import { currentAlarmModel, IAlarmDetail } from '@/models/alarm';
import { CloseIcon } from '@chakra-ui/icons';
import Image from 'next/image';

import title from '@/assets/montior/title.png';
import { MoreIcon } from '@/components/Icons';
import TimerCounter from '@/components/TimerCounter';
import { Box, Center, Flex, HStack } from '@chakra-ui/react';
import { useMemoizedFn, useMount, useUnmount } from 'ahooks';
import { useContext, useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import SmoothScrollbar from 'smooth-scrollbar';

import { IRealData } from '@/components/Charts/AlarmDetailCharts';
import { MapContext } from '@/models/map';
import { IPlayVideoItem, IVideoResItem, playVideosModel, videoListModal } from '@/models/video';
import { request } from '@/utils/request';
import { getAlarmLevelReferTitle } from '@/utils/util';
import { featureCollection, FeatureCollection, Point } from '@turf/turf';
import AlarmImg from './AlarmImg';
import RealData from './RealData';
import VideoList from './VideoList';
import { useTranslations } from 'next-intl';

interface IProps {
  fold: boolean;
}

const AlarmDetail = ({ fold }: IProps) => {
  const formatMessage = useTranslations("base");

  const scrollbar = useRef<SmoothScrollbar | null>(null);
  const domWarp = useRef<HTMLDivElement | null>(null);
  const [currentAlarm, setCurrentAlarm] = useRecoilState(currentAlarmModel);
  const [videoList, setVideoList] = useRecoilState(videoListModal);
  const [playVideos, setPlayVideos] = useRecoilState(playVideosModel);
  const map = useContext(MapContext);

  const [showMore, setShowMore] = useState(false);
  const [realDatas, setRealDatas] = useState<IRealData[]>([]);
  const {
    address,
    statusView,
    devName,
    alarmTypeName,
    alarmLastTime,
    supplement,
    alarmFirstTime,
    alarmUserName,
    linkPhone,
    alarmLevel,
    deptName,
    alarmAreaName,
    alarmLevelName,
    resourceNo,
    alarmLevelRefer,
    iotDeviceId,
    iotSubDeviceId,
    suppData,
    alarmId,
    fromSocket,
  } = currentAlarm as IAlarmDetail;

  useEffect(() => {
    console.log('currentAlarm2222', currentAlarm);
    console.log('suppData2222', suppData);
  }, [currentAlarm]);

  useMount(() => {
    setTimeout(() => {
      if (domWarp.current) {
        scrollbar.current = SmoothScrollbar.init(domWarp.current);
      }
    }, 2 * 100);
    getRealData();
    getCameras();
    cameraMoveAndPush();
  });

  useUnmount(() => {
    handleClose();
  });

  //根据报警id将关联摄像头移动到预置位
  const cameraMoveAndPush = useMemoizedFn(async () => {
    //if (fromSocket) {
    const res = await request({
      url: `/cx-alarm/camera/move-preset-push-video/${alarmId}`,
      options: {
        method: 'post',
      },
    });
    //}
  });

  const getRealData = async () => {
    const url = '/device-manger/sub_device/sub_device_data';
    const res = await request<IRealData[]>({
      url,
      options: {
        method: 'post',
        body: JSON.stringify({
          deviceId: iotDeviceId,
          startData: {
            unit: '2',
            value: -1,
          },
          subDeviceCode: iotSubDeviceId,
        }),
      },
    });
    setRealDatas(res.data);
    if (scrollbar.current) {
      setTimeout(() => {
        scrollbar.current?.update();
      }, 1 * 100);
    }
    return res.data;
  };
  const getCameras = async () => {
    const url = `/cx-alarm/resource/list-ref-resource?devId=${currentAlarm?.resourceId}`;
    const res = (await request({ url })) as unknown as FeatureCollection<Point, IVideoResItem>;
    if (!res.features) {
      setVideoList([]);
      return;
    }
    const array = [];
    let index_ = 0;

    for (const [index, item] of res.features.entries()) {
      array.push(item.properties);
      item.properties.index = String(index + 1);
      item.properties.coordinates = item.geometry.coordinates;
      index_ += 1;
      if (index_ >= 4) {
        index_ = 0;
      }
    }
    setVideoList(array);

    if (map) {
      const videosource = map.getSource('video') as maplibregl.GeoJSONSource;
      videosource.setData(res as GeoJSON.GeoJSON);
    }
    const needAddVideos: IPlayVideoItem[] = [];

    //默认播放前面四个
    array.forEach((item, index) => {
      if (index <= 3) {
        needAddVideos.push({
          cameraId: item.iotDeviceId,
          name: item.resourceName,
          index: index + 1,
        });
      }
    });

    //默认播放第一个视频
    //const video = array[0];
    //needAddVideos.push({ cameraId: video.iotDeviceId, name: video.resourceName, index: 1 });
    setPlayVideos(needAddVideos);
    if (scrollbar.current) {
      setTimeout(() => {
        scrollbar.current?.update();
      }, 1 * 100);
    }
    return res;
  };

  const handleClose = () => {
    setCurrentAlarm(null);
    setPlayVideos([]);

    requestAnimationFrame(() => {
      try {
        leaveVideo();
        emptyVideoLayer();
      } catch (error) {
        console.info('============error==============', error);
      }
    });
  };

  const leaveVideo = () => {
    console.log('levellllllll video');
    if (map && map.getSource) {
      // console.info('============map==============', map);
      const videosource = map.getSource('video_h') as maplibregl.GeoJSONSource;

      const sourcedata = featureCollection([]);
      videosource?.setData(sourcedata as GeoJSON.GeoJSON);
    }
  };
  const emptyVideoLayer = () => {
    if (map) {
      const videosource = map.getSource('video') as maplibregl.GeoJSONSource;

      const sourcedata = featureCollection([]);
      videosource?.setData(sourcedata as GeoJSON.GeoJSON);
    }
  };

  const showRealDatas = realDatas?.length > 0 && realDatas[0].values.length > 0;

  return (
    <Box
      position="relative"
      p="3.5"
      h="full"
      opacity={fold ? 0 : 1}
      zIndex={fold ? -1 : 1}
      borderRadius="10px"
      backgroundColor="pri.gray.600"
      userSelect="none"
    >
      <Box
        position="absolute"
        right={0}
        top={0}
        w="0"
        h="0"
        borderWidth="1.75rem"
        borderColor="pri.blue.100"
        borderBottomColor="transparent"
        borderLeftColor="transparent"
        borderTopRightRadius="0.625rem"
        zIndex={2}
        cursor="pointer"
        onClick={handleClose}
      >
        <CloseIcon
          _hover={{ opacity: 0.8 }}
          position="absolute"
          right="-20px"
          top="-20px"
          color="pri.white.100"
          zIndex={2}
        />
      </Box>

      <Box h="full" ref={domWarp}>
        <Box bg="pri.white.100" px="4" py="3.5" borderTopRadius="10px" mb="1px">
          <HStack>
            <Image alt="title" src={title} />
            <Box fontSize="lg" fontWeight="bold" color="pri.dark.100">
              {formatMessage({ id: 'alarm.info' })}
            </Box>
          </HStack>
        </Box>
        <Box bg="pri.white.100" px="4" pt="4" borderBottomRadius="10px">
          <Box color="pri.dark.100" lineHeight="30px" mb="3.5">
            <Flex alignItems="flex-start">
              <Box minW="18" whiteSpace="nowrap" justifyContent="flex-start">
                {formatMessage({ id: 'alarm.place' })} :
              </Box>

              <Box color="pri.dark.500" flex={1} ml="0.5rem" wordBreak="break-all">
                {deptName}
                {alarmAreaName}
                {alarmAreaName === address ? '' : address}
              </Box>
            </Flex>
            <HStack>
              <Box minW="18" whiteSpace="nowrap">
                {formatMessage({ id: 'alarm.areaName' })} :
              </Box>
              <Box>{alarmAreaName}</Box>
            </HStack>
            <HStack>
              <Box minW="18" whiteSpace="nowrap">
                {formatMessage({ id: 'alarm.res.proNum' })} :
              </Box>
              <Box>{resourceNo}</Box>
            </HStack>
            {alarmLevelRefer && (
              <HStack>
                <Box minW="18" whiteSpace="nowrap">
                  {formatMessage({ id: 'alarm.category' })} :
                </Box>
                <Box>{getAlarmLevelReferTitle(alarmLevelRefer)}</Box>
              </HStack>
            )}

            <HStack>
              <Box minW="18" whiteSpace="nowrap">
                {formatMessage({ id: 'alarm.duration' })} :
              </Box>
              <Box color="pri.red.100">
                <TimerCounter time={alarmFirstTime} />
              </Box>
            </HStack>
            <HStack>
              <Box minW="18" whiteSpace="nowrap">
                {formatMessage({ id: 'alarm.status' })} :
              </Box>
              <Box color="pri.red.100">{statusView}</Box>
            </HStack>

            <HStack>
              <Box minW="18" whiteSpace="nowrap">
                {formatMessage({ id: 'alarm.res.name' })} :
              </Box>
              <Box color="pri.dark.500">{devName}</Box>
            </HStack>

            <HStack>
              <Box minW="18" whiteSpace="nowrap">
                {formatMessage({ id: 'alarm.type' })} :
              </Box>
              <Box color="pri.red.100">{alarmTypeName}</Box>
            </HStack>
            <HStack>
              <Box minW="18" whiteSpace="nowrap">
                {formatMessage({ id: 'alarm.level' })} :
              </Box>
              <Box color="pri.red.100">{alarmLevelName}</Box>
            </HStack>

            {showMore && (
              <>
                <HStack>
                  <Box minW="18" whiteSpace="nowrap">
                    {formatMessage({ id: 'alarm.startTime' })} :
                  </Box>
                  <Box color="pri.dark.500">{alarmFirstTime}</Box>
                </HStack>
                <HStack>
                  <Box minW="18" whiteSpace="nowrap">
                    {formatMessage({ id: 'alarm.lastTime' })} :
                  </Box>
                  <Box color="pri.dark.500">{alarmLastTime}</Box>
                </HStack>
                {alarmUserName && (
                  <HStack>
                    <Box minW="18" whiteSpace="nowrap">
                      {formatMessage({ id: 'alarm.user.name' })} :
                    </Box>
                    <Box color="pri.dark.500">{alarmUserName}</Box>
                  </HStack>
                )}
                {linkPhone && (
                  <HStack>
                    <Box minW="18" whiteSpace="nowrap">
                      {formatMessage({ id: 'alarm.user.phone' })} :
                    </Box>
                    <Box color="pri.dark.500">{linkPhone}</Box>
                  </HStack>
                )}

                {supplement && (
                  <HStack>
                    <Box minW="18" whiteSpace="nowrap">
                      {formatMessage({ id: 'alarm.desc' })} :
                    </Box>
                    <Box color="pri.dark.500">{supplement}</Box>
                  </HStack>
                )}

                {suppData && suppData.length ? <AlarmImg data={suppData} /> : null}
              </>
            )}
            <Center
              py="3"
              mt="2"
              mb="-3"
              borderTopColor="pri.dark.500"
              borderTopStyle="dashed"
              borderTopWidth="1px"
            >
              <MoreIcon
                cursor="pointer"
                _hover={{ fill: 'pri.blue.100' }}
                onClick={() => {
                  setShowMore(!showMore);
                }}
                w="3"
                h="3"
                transform={showMore ? 'rotate(180deg)' : ''}
                fill="pri.dark.500"
              />
            </Center>
          </Box>
        </Box>

        {showRealDatas && <RealData realDatas={realDatas} />}

        {videoList.length > 0 && (
          <VideoList showRealDatas={showRealDatas} leaveVideo={leaveVideo} />
        )}
      </Box>
    </Box>
  );
};

export default AlarmDetail;
