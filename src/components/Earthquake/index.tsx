'use client';
import Center from '@/assets/earthquake/center.png';
import Distance from '@/assets/earthquake/distance.png';
import Level from '@/assets/earthquake/level.png';
import Time from '@/assets/earthquake/time.png';
import Tip from '@/assets/earthquake/Tip.png';
import { earthquakeType } from '@/models/alarm';
import { IUserInfo } from '@/models/user';
import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import { useCountDown, useLocalStorageState, useMemoizedFn, useMount, useUnmount } from 'ahooks';
import moment from 'moment';
import Image from 'next/image';
import { forwardRef, Ref, useImperativeHandle, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
type IClientType =
  | 'web-show'
  | 'web-video'
  | 'large-show'
  | 'big-screen-command'
  | 'web-earth'
  | 'big-screen-earth';
export interface Refs {
  initSocketFun: () => void;
}
interface modalType {
  isOpen: boolean;
  msg: earthquakeType;
  onClose: () => void;
}

const EarthquakeModal = (_: object, refs: Ref<Refs>) => {
  const socketRef = useRef<WebSocket | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentUserInfo] = useLocalStorageState<null | IUserInfo>('currentUserInfo_cx_alarm');
  const socketTimer = useRef(1000);
  const pingTimer = useRef<NodeJS.Timer | null>(null);
  const reconencTimer = useRef<NodeJS.Timer | null>(null);
  const isMount = useRef(false); // 组件是否已挂载
  const [info, setInfo] = useState<earthquakeType | null>(null);

  const [countdown] = useCountDown({
    leftTime: info ? info?.points[0].countDown * 1000 - (Date.now() - info.updateAt) : 0,
    onEnd: () => {
      setInfo(null);
      if (audioRef.current?.played) {
        audioRef.current.muted = true;
        audioRef.current.currentTime = 0;
      }
    },
  });

  useImperativeHandle(refs, () => ({
    initSocketFun,
  }));

  useMount(() => {
    audioRef.current = document.getElementById('earthquakeAudio') as HTMLAudioElement;
    isMount.current = true;
  });

  useUnmount(() => {
    isMount.current = false;
  });

  const initSocketFun = useMemoizedFn((clientType: IClientType = 'web-earth') => {
    const dev = process.env.NODE_ENV !== 'production';

    const protocol = window.location.protocol.indexOf('https') !== -1 ? 'wss' : 'ws';
    const url = dev
      ? `${protocol}://${process.env.NEXT_PUBLIC_ANALYTICS_Pt_message}/websocket?userId=${
          currentUserInfo ? currentUserInfo.userId : 0
          // ? `ws://192.168.0.240/cx_pt_message/websocket?userId=${currentUserInfo ? currentUserInfo.userId : 0
        }&clientType=${clientType}`
      : `${protocol}://${process.env.NEXT_PUBLIC_ANALYTICS_Pt_message}/websocket?userId=${
          currentUserInfo ? currentUserInfo.userId : 0
        }&clientType=${clientType}`;

    socketRef.current = new WebSocket(url);
    const ping = () => {
      if (socketRef.current) {
        socketRef.current.send(
          JSON.stringify({
            featureType: 'PING',
            id: 'ping',
          })
        );
      }
    };

    const init = () => {
      if (socketRef.current) {
        socketRef.current.send(
          JSON.stringify({
            id: currentUserInfo?.userId,
            featureType: 'TOPIC_SUBSCRIBE',
            topics: ['dz'],
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
    socketRef.current.onopen = () => {
      init();
      console.log('打开socket');

      socketTimer.current = 1000;
    };
    socketRef.current.onclose = () => {
      console.info(socketTimer.current, '毫秒后开始重连地震socket');
      reconencTimer.current = setTimeout(() => {
        if (isMount.current) {
          initSocketFun(clientType);
        }
      }, socketTimer.current);
      socketTimer.current += 1000;
      if (socketTimer.current >= 60 * 1000 * 5) {
        socketTimer.current = 1000;
      }
    };
    socketRef.current.onmessage = ({ data }) => {
      try {
        const msg = JSON.parse(data) as { msgBody: any; topic: string; code: number };
        const { msgBody, topic } = msg;

        if (msg.code && msg.code === 500) {
          socketRef.current?.close();
        }
        if (!msgBody) {
          return;
        }

        if (topic === 'dz') {
          const { data: msgText, type } = JSON.parse(msgBody) as {
            data: earthquakeType;
            type: string;
          };
          switch (type) {
            case 'DZ':
              // 地震预警
              if (msgText.eventId) {
                setInfo(msgText);
                if (audioRef.current && isMount.current) {
                  audioRef.current.play();
                  audioRef.current.muted = false;
                }
              }

              break;
          }
        }
      } catch (e) {
        console.log('推送错误', e);
      }
    };
  });

  if (!info) {
    return null;
  }

  return createPortal(
    <Box
      position={'absolute'}
      top={'50%'}
      left={'50%'}
      marginLeft={'-260px'}
      marginTop={'-150px'}
      zIndex={9999}
      w={'520px'}
      h={'300px'}
      borderRadius={10}
      background={'linear-gradient(180deg, #CC2323 0%, #B81F1F 100%)'}
      overflow={'hidden'}
      boxShadow="0 1px 2px rgb(0 0 0 / 10%)"
      transition="all 0.2s"
      p={2}
      transform={'scale(1.5)'}
    >
      <Text color={'white'} fontSize={'20px'} fontWeight={'bold'} textAlign={'center'}>
        地震预警
      </Text>
      <HStack justifyContent={'center'} alignItems={'center'}>
        <Image alt="tip" src={Tip} />
        <HStack justifyContent={'center'} alignItems={'baseline'}>
          <Text color={'white'} fontWeight={'bold'} fontSize={'43px'}>
            {Math.round(countdown / 1000)}
          </Text>
          <Text color={'white'} fontWeight={'400'} fontSize={'16px'}>
            秒后
          </Text>
        </HStack>
      </HStack>
      <Text color={'white'} fontSize={'18px'} fontWeight={'400'} textAlign={'center'}>
        地震横波预计将到达
      </Text>
      <Text color={'#E89595'} fontSize={'14px'} fontWeight={'400'} textAlign={'center'} mt={'10px'}>
        温馨提示：本地区震感强烈，请合理避险
      </Text>
      <HStack justifyContent={'space-between'} mt={'10px'}>
        <VStack justifyContent={'center'} w={'24%'} h={20} bg={'#DC4141'} borderRadius={'4px'}>
          <HStack justifyContent={'center'}>
            <Image alt="Center" src={Center} />
            <Text color={'#FFD4D4'}>震中</Text>
          </HStack>
          <Box color={'white'}>
            <Text noOfLines={1} textAlign={'center'}>
              {info.epicenter}
            </Text>
          </Box>
        </VStack>
        <VStack justifyContent={'center'} w={'24%'} h={20} bg={'#DC4141'} borderRadius={'4px'}>
          <HStack justifyContent={'center'}>
            <Image alt="Distance" src={Distance} />
            <Text color={'#FFD4D4'}>震中距</Text>
          </HStack>
          <Box color={'white'}>
            <Text noOfLines={1} textAlign={'center'}>
              {info.points[0].distance}KM
            </Text>
          </Box>
        </VStack>
        <VStack justifyContent={'center'} w={'24%'} h={20} bg={'#DC4141'} borderRadius={'4px'}>
          <HStack justifyContent={'center'}>
            <Image alt="Level" src={Level} />
            <Text color={'#FFD4D4'}>震级</Text>
          </HStack>
          <Box color={'white'}>
            <Text noOfLines={1} textAlign={'center'}>
              {info.points[0].intensity}级
            </Text>
          </Box>
        </VStack>
        <VStack justifyContent={'center'} w={'24%'} h={20} bg={'#DC4141'} borderRadius={'4px'}>
          <HStack justifyContent={'center'}>
            <Image alt="Time" src={Time} />
            <Text color={'#FFD4D4'}>时间</Text>
          </HStack>
          <Box color={'white'}>
            <Text noOfLines={1} textAlign={'center'}>
              {moment(info.startAt).format('HH:mm')}
            </Text>
          </Box>
        </VStack>
      </HStack>
      <Text mt={'10px'} color={'#E89595'} fontSize={'14px'} fontWeight={'400'} textAlign={'center'}>
        {info.signature[1]}-{info.signature[0]}
      </Text>
    </Box>,
    document.body
  );
};

export default forwardRef(EarthquakeModal);
