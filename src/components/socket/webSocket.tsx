'use client';
import { NewAlarmIcon, UpdateaAlarmIcon } from '@/components/Icons';
import {
  addIncidentModel,
  alarmListModel,
  currentAlarmModel,
  currentDpAlarmModel,
  currentDpIncidentModel,
  IAlarmDetail,
  ISuppData,
  lastUpdateAlarmTimeModel,
  lastUpdateAlarmTimeWithNotNewModel,
  lastUpdateIncidentModel,
  showAlarmToastModel,
} from '@/models/alarm';
import { IUserRes } from '@/models/user';
import { CloseIcon } from '@chakra-ui/icons';
import { Box, Flex, HStack, ToastId, useToast } from '@chakra-ui/react';
import { useLocalStorageState, useMemoizedFn, useMount, useThrottleFn, useUnmount } from 'ahooks';
import { forwardRef, Ref, useEffect, useImperativeHandle, useRef } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

type IClientType = 'web-show' | 'web-video' | 'large-show' | 'big-screen-command';
export interface Refs {
  initWebSocket: (clientType?: IClientType) => void;
}

const Websocket = (_: object, refs: Ref<Refs>) => {
  const socket = useRef<WebSocket | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const toast = useToast();
  const socketTimer = useRef(1000);
  const pingTimer = useRef<NodeJS.Timer | null>(null);
  const reconencTimer = useRef<NodeJS.Timer | null>(null);

  // 超过5个弹窗，就关闭之前的
  const toasts = useRef<ToastId[]>([]);
  const showAlarmToast = useRecoilValue(showAlarmToastModel);
  const alarmList = useRecoilValue(alarmListModel);

  const [currentUserInfo] = useLocalStorageState<null | IUserRes>('emgc_web_currentUserInfo');

  const [currentAlarmDeatil, setCurrentAlarmDeatil] = useRecoilState(currentAlarmModel);
  const currentAlarmDeatilRef = useRef(currentAlarmDeatil);

  const setCurrentDpAlarmDeatil = useSetRecoilState(currentDpAlarmModel);
  const setCurrentDpIncidentDeatil = useSetRecoilState(currentDpIncidentModel);

  const setLastUpdateIncident = useSetRecoilState(lastUpdateIncidentModel);
  const setAddIncidentModel = useSetRecoilState(addIncidentModel);

  const isMount = useRef(false); // 组件是否已挂载

  const setLastUpdateAlarmTime = useSetRecoilState(lastUpdateAlarmTimeModel);
  const setlastUpdateAlarmTimeWithNotNew = useSetRecoilState(lastUpdateAlarmTimeWithNotNewModel);

  // console.info('============alarmType1==============', alarmType);
  useEffect(() => {
    currentAlarmDeatilRef.current = currentAlarmDeatil;
  }, [currentAlarmDeatil]);

  useImperativeHandle(refs, () => ({
    initWebSocket,
  }));

  useMount(() => {
    audioRef.current = document.getElementById('alarmAudio') as HTMLAudioElement;
    isMount.current = true;
  });

  useUnmount(() => {
    isMount.current = false;

    socket.current?.close?.();
    socket.current = null;
    clearAllTimer();
  });

  const clearAllTimer = useMemoizedFn(() => {
    pingTimer.current && clearInterval(pingTimer.current);
    reconencTimer.current && clearTimeout(reconencTimer.current);
  });

  useEffect(() => {
    alarmListRef.current = alarmList;
  }, [alarmList]);

  const renderToast = useMemoizedFn((type: 'ALARM' | 'CLOSE_ALARM', newAlarm: IAlarmDetail) => {
    if (!showAlarmToast) {
      return;
    }
    const isAdd = type === 'ALARM';

    //toast持续时长
    const duration = 50;

    // 弹窗超过5个，关闭之前的

    if (toasts.current.length >= 1) {
      toast.close(toasts.current[0]);
      toasts.current.splice(0, 1);
    }
    const currentToast = toast({
      position: 'bottom-right',
      duration: duration * 1000,
      containerStyle: {
        marginBottom: '10',
      },

      render: () => {
        return (
          <Box
            w="70"
            bg="pri.white.100"
            color="font.200"
            borderRadius="5px"
            overflow="hidden"
            boxShadow="0px 3px 6px 1px rgba(0,0,0,0.16)"
          >
            <Flex
              bg={isAdd ? 'pri.red.100' : 'pri.green.200'}
              h="7"
              justifyContent="space-between"
              alignItems="center"
              px="2"
            >
              <Box color="#fff">{isAdd ? '警告' : '报警已处理'}</Box>
              <CloseIcon
                w="3"
                h="3"
                mr="2"
                cursor="pointer"
                _hover={{ fill: 'pri.blue.100' }}
                color="pri.white.100"
                onClick={(e) => {
                  e.stopPropagation();
                  toast.close(currentToast);
                }}
              />
            </Flex>

            <HStack px="3" my="3">
              {isAdd ? (
                <>
                  <NewAlarmIcon fill="pri.red.100" />
                  <Box fontWeight="bold">接收到新的报警</Box>
                </>
              ) : (
                <>
                  <UpdateaAlarmIcon />
                  <Box fontWeight="bold">报警更新</Box>
                </>
              )}
            </HStack>
            <Flex justify="flex-start" px="3" pb="3" wrap="wrap">
              {isAdd && (
                <Flex
                  flexWrap="wrap"
                  // cursor="pointer"
                  // onClick={go}
                >
                  {newAlarm.alarmLastTime}
                  {newAlarm.alarmAreaName}
                  发生:{newAlarm.alarmTypeName}
                </Flex>
              )}

              {!isAdd && <Box>报警已处理</Box>}
            </Flex>
          </Box>
        );
      },
    });
    toasts.current.push(currentToast);
  });

  const handleOnMsg = useMemoizedFn(({ data }) => {
    try {
      const msg = JSON.parse(data) as { msgBody: any; topic: string; code: number };
      const { msgBody, topic } = msg;

      if (msg.code && msg.code === 500) {
        socket.current?.close();
      }
      if (!msgBody) {
        return;
      }

      if (topic === 'cx-alarm') {
        const {
          data: newMsg,
          remark,
          type,
        } = JSON.parse(msgBody) as { data: IAlarmDetail; remark: string; type: string };
        // let isAuth: any;
        // if (window && window.location.pathname.includes('largeScreen')) {
        //   isAuth = alarmTypeDp.findIndex((alarm) => alarm.alarmType === newMsg.alarmType);
        // } else {
        //   isAuth = alarmType.findIndex((alarm) => alarm.alarmType === newMsg.alarmType);
        // }

        // if (type === 'CLOSE_ALARM') {
        //   isAuth = 1;
        // }

        // if (isAuth > -1) {
        switch (type) {
          case 'ALARM':
            //播放语音
            addAlarm(newMsg as IAlarmDetail);
            if (newMsg.firstAlarm) {
              if (audioRef.current) {
                if (!audioRef.current.paused) {
                  audioRef.current.currentTime = 0;
                }
                audioRef.current.play();
              }
            }
            break;
          case 'CLOSE_ALARM':
            renderToast('CLOSE_ALARM', newMsg as IAlarmDetail);
            delAlarm();
            break;
        }
        // }
      }

      if (topic === 'incident_info') {
        const { data: newMsg, type } = JSON.parse(msgBody) as { data: IAlarmDetail; type: string };
        switch (type) {
          case 'CREATE_INCIDENT':
            setCurrentDpIncidentDeatil({
              ...newMsg,
              fromSocket: true,
            });
            setAddIncidentModel(true);
            break;
          default:
            setCurrentDpIncidentDeatil(null);
        }
        setLastUpdateIncident(new Date().getTime());
      }
    } catch (e) {
      console.log('推送错误', e);
    }
  });

  const initWebSocket = useMemoizedFn((clientType: IClientType = 'web-show') => {
    console.log('大屏socket', clientType);
    const dev = process.env.NODE_ENV !== 'production';

    const path = window.location.host;
    const hostname = window.location.hostname;

    const protocol = window.location.protocol.indexOf('https') !== -1 ? 'wss' : 'ws';
    const infoStr: string = localStorage.getItem('emgc_web_currentUserInfo') ?? '{}';
    const userInfo = JSON.parse(infoStr);
    const userId =
      currentUserInfo && currentUserInfo.userId ? currentUserInfo.userId : userInfo.userId;

    const url = dev
      ? `${protocol}://${process.env.NEXT_PUBLIC_ANALYTICS_Pt_message_dev}/websocket?userId=${userId}&clientType=${clientType}`
      : `${protocol}://${
          path + process.env.NEXT_PUBLIC_ANALYTICS_Pt_message
        }/websocket?userId=${userId}&clientType=${clientType}`;

    socket.current = new WebSocket(url);
    const ping = () => {
      if (socket.current) {
        socket.current.send(
          JSON.stringify({
            featureType: 'PING',
            id: 'ping',
          })
        );
      }
    };

    const init = () => {
      if (socket.current) {
        const infoStr: string = localStorage.getItem('emgc_web_currentUserInfo') ?? '{}';
        const userInfo = JSON.parse(infoStr);
        const userId =
          currentUserInfo && currentUserInfo.userId ? currentUserInfo.userId : userInfo.userId;

        socket.current.send(
          JSON.stringify({
            id: userId,
            featureType: 'TOPIC_SUBSCRIBE',
            topics: ['cx-alarm', 'slave_large_status', 'incident_info'],
          })
        );
        if (pingTimer.current) {
          clearInterval(pingTimer.current);
          pingTimer.current = null;
        }

        if (isMount.current) {
          pingTimer.current = setInterval(() => {
            ping();
          }, 20 * 1000);
        }
      }
    };

    socket.current.onopen = () => {
      init();
      socketTimer.current = 1000;
    };

    socket.current.onmessage = handleOnMsg;

    socket.current.onclose = () => {
      console.info(socketTimer.current, '毫秒后开始重连websocket');
      reconencTimer.current = setTimeout(() => {
        if (isMount.current) {
          initWebSocket(clientType);
        }
      }, socketTimer.current);
      socketTimer.current += 1000;
      if (socketTimer.current >= 60 * 1000 * 5) {
        socketTimer.current = 1000;
      }
    };

    socket.current.onerror = () => {
      //
    };
  });

  const { run: updateMontiorMapData } = useThrottleFn(
    () => {
      setLastUpdateAlarmTime(new Date().getTime());
    },
    { wait: 1000, leading: false }
  );

  // 报警太频繁，非首次报警，5秒更新一次
  const { run: updateMontiorMapDataSlow } = useThrottleFn(
    () => {
      setlastUpdateAlarmTimeWithNotNew(new Date().getTime());
    },
    { wait: 5000, leading: false }
  );
  const alarmListRef = useRef(alarmList);

  //加节流的报警详情更新函数
  const { run: updateAlarmDetail } = useThrottleFn(
    (data: IAlarmDetail, alarmId: string) => {
      //再次判断是否当前推送过来的报警id和之前代开的报警详情id是否一致
      if (currentAlarmDeatilRef.current && currentAlarmDeatilRef.current.alarmId === alarmId) {
        const newSuppData: ISuppData[] = data.suppData.map((item, index) => {
          if (item.infoType !== 0) {
            const newItem = { ...item };
            const path = new URL(newItem.infoValue);
            const newImgUrl = '/minio' + path.pathname;
            newItem.infoValue = newImgUrl;

            return newItem;
          }
          return item;
        });

        const newCurrentAlarmDeatil = JSON.parse(
          JSON.stringify({
            ...data,
            suppData: newSuppData,
          })
        );

        console.log('debug-------6-------', newCurrentAlarmDeatil);
        setCurrentAlarmDeatil(newCurrentAlarmDeatil);

        // setCurrentAlarmDeatil(data);
      }
    },

    {
      wait: 2000,
      leading: true,
    }
  );

  const addAlarm = useMemoizedFn(async (alarm: IAlarmDetail) => {
    //需要接受报警推送的页面
    const montiorRouter = ['monitor/operation'];
    //需要接受报警推送的页面（不包括大屏）
    const montiorRouterNotLG = ['monitor/operation'];
    //是否处于检测预警页面
    const isMontiorRouter = montiorRouter.some((item) => window?.location.pathname.includes(item));
    const isMontiorRouterNotLG = montiorRouterNotLG.some((item) =>
      window.location.pathname.includes(item)
    );

    if (isMontiorRouter) {
      const { alarmId, firstAlarm, firstDpAlarm } = alarm;

      /*
        首次报警的时候打开详情
        打开的报警接收到更新时重新获取详情
        这里不包括大屏
      */

      if (firstAlarm) {
        //首次报警更新列表和聚合 1s执行一次
        updateMontiorMapData();
        if (!currentAlarmDeatilRef.current && isMontiorRouterNotLG) {
          console.log('首次报警');
          setCurrentAlarmDeatil({ ...alarm, fromSocket: true });
        }
      } else {
        //非首次报警更新列表和聚合 5s执行一次
        updateMontiorMapDataSlow();
        if (
          currentAlarmDeatilRef.current &&
          currentAlarmDeatilRef.current.alarmId === alarmId &&
          isMontiorRouterNotLG
        ) {
          console.log('非首次报警', currentAlarmDeatilRef.current?.alarmId, alarmId);
          updateAlarmDetail({ ...alarm, fromSocket: true }, alarmId);
        }
      }

      if (firstDpAlarm) {
        //首次报警更新列表和聚合 1s执行一次
        updateMontiorMapData();
        if (isMontiorRouter) {
          setCurrentDpAlarmDeatil({ ...alarm, fromSocket: true });
        }
      }
    }
  });

  const delAlarm = useMemoizedFn(async () => {
    requestAnimationFrame(() => {
      updateMontiorMapData();
    });
  });
  return null;
};

export default forwardRef(Websocket);
