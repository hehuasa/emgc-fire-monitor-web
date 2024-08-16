import { IRealData } from '@/components/Charts/AlarmDetailCharts';
import { MapContext } from '@/models/map';
import { playVideosModel, IVideoResItem, videoListModal } from '@/models/video';

import { FeatureCollection, Point, featureCollection } from '@turf/turf';
import { useMemoizedFn, useUnmount } from 'ahooks';

import Image from 'next/image';

import { Box, Flex, HStack } from '@chakra-ui/react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import title from '@/assets/montior/title.png';

import { useIntl } from 'react-intl';

import SmoothScrollbar from 'smooth-scrollbar';
import RealData from './RealData';
import { request } from '@/utils/request';

import { currentResModel, IResItem } from '@/models/resource';
import { CloseIcon } from '@chakra-ui/icons';
import VideoList from './VideoList';

interface IProps {
  fold: boolean;
}

const RessourceDetail = ({ fold }: IProps) => {
  const { formatMessage } = useIntl();

  const scrollbar = useRef<SmoothScrollbar | null>(null);
  const [currentRes, setCurrentRes] = useRecoilState(currentResModel);
  // const [resList, setResList] = useState<IResItem[]>([]);
  const [videoList, setVideoList] = useRecoilState(videoListModal);

  const [playVideos, setPlayVideos] = useRecoilState(playVideosModel);
  const map = useContext(MapContext);

  const [realDatas, setRealDatas] = useState<IRealData[]>([]);
  const { resourceName, areaName, deptName, address, equipmentId, resourceNo, hasVideo } =
    currentRes as IResItem;

  useEffect(() => {
    if (currentRes) {
      //判断当前的资源是否是视频资源 如果是视频资源视频列表为本身 否则重新请求视频列表

      if (hasVideo) {
        judgeCurrentResrouce();
      } else {
        getCameras();
      }
    }
  }, [currentRes]);

  useUnmount(() => {
    handleClose();
  });
  const getRealData = async () => {
    const url = '/device-manger/sub_device/sub_device_data';
    const res = await request<IRealData[]>({
      url,
      options: {
        method: 'post',
        body: JSON.stringify({
          deviceId: 'ba4d2fac-d7cb-767d-5aa8-0983ab5daadb',
          startData: {
            unit: '2',
            value: -1,
          },
          subDeviceId: 'ba4d2fac-d7cb-767d-5aa8-0983ab5daadb',
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
    const url = `/cx-alarm/resource/list-ref-resource?devId=${currentRes?.id}`;
    const res = (await request({ url })) as unknown as FeatureCollection<Point, IVideoResItem>;
    const array = [];

    if (!res.features) {
      setVideoList([]);
    } else {
      for (const [index, item] of res.features.entries()) {
        array.push(item.properties);
        item.properties.index = String(index + 1);
        item.properties.coordinates = item.geometry.coordinates;
      }
      setVideoList(array);

      if (map) {
        const videosource = map.getSource('video') as maplibregl.GeoJSONSource;
        videosource.setData(res as GeoJSON.GeoJSON);
      }
    }
  };
  const handleClose = () => {
    setCurrentRes(null);
    setPlayVideos([]);
    requestAnimationFrame(() => {
      leaveVideo();
      emptyVideoLayer();
    });
  };

  const leaveVideo = () => {
    if (map) {
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

  //当前资源如果是视频,重新设置视频列表
  const judgeCurrentResrouce = useMemoizedFn(() => {
    if (currentRes) {
      const orightp = currentRes.coordinate;
      let coordinates: number[] = [];
      if (typeof orightp === 'string') {
        const o = JSON.parse(orightp) as Point;
        coordinates = o.coordinates;
      } else if (orightp.type === 'Point') {
        coordinates = orightp.coordinates;
      }
      setVideoList([
        {
          equipmentid: currentRes.equipmentid + '',
          id: currentRes.id,
          layerid: currentRes.layerid,
          equipmentId: currentRes.equipmentId,
          resourceNo: currentRes.resourceNo,
          iotDeviceId: currentRes.iotDeviceId,
          iotSubDeviceId: '',
          index: '0',
          coordinates: coordinates,
          resourceName: currentRes.resourceName,
        },
      ]);
    }
  });

  const showRealDatas = realDatas?.length > 0 && realDatas[0].values.length > 0;
  return (
    <Box
      position="relative"
      py="3.5"
      h="full"
      opacity={fold ? 0 : 1}
      zIndex={fold ? -1 : 1}
      borderRadius="10px"
      backgroundColor="pri.gray.600"
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
      />
      <CloseIcon
        onClick={handleClose}
        cursor="pointer"
        _hover={{ opacity: 0.8 }}
        position="absolute"
        right="2"
        top="2"
        color="pri.white.100"
        zIndex={2}
      />
      <Box h="full" overflowY="auto" layerStyle="scrollbarStyle">
        <Box w="340px" ml="3.5">
          <Box bg="pri.white.100" px="4" py="3.5" borderTopRadius="10px" mb="1px">
            <HStack>
              <Image alt="title" src={title} />
              <Box fontSize="lg" fontWeight="bold">
                {formatMessage('resource.base.info')}
              </Box>
            </HStack>
          </Box>
          <Box bg="pri.white.100" px="4" pt="4" borderBottomRadius="10px">
            <Box color="pri.dark.100" lineHeight="30px" mb="3.5">
              <Flex>
                <Box minW="18" whiteSpace="nowrap" color="pri.dark.100">
                  {formatMessage('resource.name')} :
                </Box>
                <Box flex={1} color="pri.dark.500">
                  {resourceName}
                  {equipmentId}
                </Box>
              </Flex>
              {/* <Flex>
                <Box minW="18" whiteSpace="nowrap" color="pri.dark.100">
                  {formatMessage('emgc.res.type' )} :
                </Box>
                <Box flex={1} color="pri.dark.500">
                  资源类型
                </Box>
              </Flex> */}
              <Flex>
                <Box minW="18" whiteSpace="nowrap" color="pri.dark.100">
                  {formatMessage('resource.processNum')} :
                </Box>
                <Box flex={1} color="pri.dark.500">
                  {resourceNo}
                </Box>
              </Flex>
              <Flex>
                <Box minW="18" whiteSpace="nowrap">
                  {formatMessage('resource.org')} :
                </Box>
                <Box flex={1} color="pri.dark.500">
                  {deptName}
                </Box>
              </Flex>
              <Flex>
                <Box minW="18" whiteSpace="nowrap">
                  {formatMessage('resource.area')} :
                </Box>
                <Box flex={1} color="pri.dark.500">
                  {areaName}
                </Box>
              </Flex>
              <Flex>
                <Box minW="18" whiteSpace="nowrap">
                  {formatMessage('resource.install')} :
                </Box>
                <Box flex={1} color="pri.dark.500">
                  {address}
                </Box>
              </Flex>
              {currentRes?.layerId === '110' ? (
                <Flex>
                  <Box minW="18" whiteSpace="nowrap">
                    {formatMessage('resource.door.status')} :
                  </Box>
                  <Box flex={1} color="pri.dark.500">
                    关
                  </Box>
                </Flex>
              ) : null}
            </Box>
          </Box>

          {showRealDatas && <RealData realDatas={realDatas} />}

          {/* {resList.length > 0 && <RealtiveRes showRealDatas={showRealDatas} resList={resList} />} */}
          {videoList.length > 0 && (
            <VideoList showRealDatas={showRealDatas} leaveVideo={leaveVideo} />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default RessourceDetail;
