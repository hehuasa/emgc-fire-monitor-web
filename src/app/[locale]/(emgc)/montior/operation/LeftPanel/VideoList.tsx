import { Box, Center, Flex, HStack, useToast } from '@chakra-ui/react';

import title from '@/assets/montior/title.png';

import { VideoPlay, VideoSuspend } from '@/components/Icons';
import { MapContext } from '@/models/map';
import {
  addPlayVideos,
  IPlayVideoItem,
  IVideoResItem,
  playVideosModel,
  videoListModal,
} from '@/models/video';
import { featureCollection, point } from '@turf/turf';
import { useUnmount } from 'ahooks';
import Image from 'next/image';
import { useContext } from 'react';
import { useTranslations } from 'next-intl';
import { useRecoilState } from 'recoil';

interface IProps {
  showRealDatas: boolean;
  leaveVideo: () => void;
}

const VideoList = ({ showRealDatas, leaveVideo }: IProps) => {
  const formatMessage = useTranslations("base");
  const [videoList, setVideoList] = useRecoilState(videoListModal);

  //正在播放的视频
  const [playVideos, setPlayVideos] = useRecoilState(playVideosModel);

  const toast = useToast();
  const map = useContext(MapContext);

  const playVideo = (video: IVideoResItem, playVideos: IPlayVideoItem[]) => {
    if (playVideos.find((val) => val.cameraId === video.iotDeviceId)) {
      toast({
        title: '请勿重复播放' + video.resourceName,
        position: 'top',
        duration: 3000,
      });
      return;
    }

    const array = [{ cameraId: video.iotDeviceId, name: video.resourceName }];
    const videos_ = addPlayVideos(array, playVideos);
    setPlayVideos(videos_);
  };

  //页面销毁的时候去掉视频列表，防止大屏那边显示相同视频
  useUnmount(() => {
    setVideoList([]);
  });

  const hoverVideo = (item: IVideoResItem) => {
    if (map) {
      const videosource = map.getSource('video_h') as maplibregl.GeoJSONSource;

      const sourcedata = featureCollection([
        point(item.coordinates, {
          ...item,
        }),
      ]);

      videosource?.setData(sourcedata as GeoJSON.GeoJSON);
    }
  };

  if (!videoList.length) {
    return null;
  }

  return (
    <>
      <Box
        bg="pri.white.100"
        px="4"
        py="3.5"
        borderTopRadius="10px"
        mt={showRealDatas ? '4' : '7'}
        mb="1px"
      >
        <HStack>
          <Image alt="title" src={title} />
          <Box fontSize="lg" fontWeight="bold" color="pri.dark.100">
            {formatMessage('resource.video.list')}
          </Box>
        </HStack>
      </Box>

      <Box bg="pri.white.100" px="4" py="3" borderBottomRadius="10px" onMouseLeave={leaveVideo}>
        {videoList.map((item, index) => {
          return (
            <Flex
              key={item.id}
              color="pri.dark.500"
              _hover={{ color: 'pri.dark.100' }}
              cursor="pointer"
              justify="space-between"
              lineHeight="36px"
              onClick={() => {
                playVideo(item, playVideos);
              }}
              onMouseEnter={() => {
                hoverVideo(item);
              }}
            >
              <HStack>
                <Box color="pri.dark.100">{`${index + 1}. `}</Box>
                <Box>{item.resourceName}</Box>
              </HStack>
              <Center>
                {playVideos.find((v) => v.cameraId === item.iotDeviceId)?.cameraId ? (
                  <VideoSuspend w="18px" h="18px" />
                ) : (
                  <VideoPlay w="18px" h="18px" />
                )}
              </Center>
            </Flex>
          );
        })}
      </Box>
    </>
  );
};

export default VideoList;
