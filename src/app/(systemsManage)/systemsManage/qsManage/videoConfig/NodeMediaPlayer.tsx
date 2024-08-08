import { request } from '@/utils/request';
import { Box, BoxProps, Spinner } from '@chakra-ui/react';
import { useMount, useUnmount } from 'ahooks';

import React, { useRef, useState } from 'react';

interface Iprops {
  cameraId: string;
  history?: boolean;
  start?: string;
  end?: string;
  contentStyle?: BoxProps;
}
const NodeMediaPlayer = ({ cameraId, history, start, end, contentStyle }: Iprops) => {
  const id = useRef<string>('video' + Math.ceil(Math.random() * 10000) + new Date().getTime());
  const [loading, setloading] = useState(true);
  const playerRef = useRef<NodePlayer | null>(null);

  useMount(() => {
    if (id.current) {
      getPlayUrl().then((url) => {
        console.info('============url==============', url);
        playerRef.current = new NodePlayer();
        playerRef.current.useWorker();
        playerRef.current.setView(id.current);
        playerRef.current.start(url);
        playerRef.current.on('start', () => {
          setloading(false);
        });
      });
    }
  });

  useUnmount(() => {
    if (playerRef.current) {
      playerRef.current.stop();

      playerRef.current.release(true);
    }
  });
  const getPlayUrl = async () => {
    const url = history
      ? '/device-manger/camera/rtsp_history_play'
      : '/device-manger/camera/rtsp_live_play';
    const dev = process.env.NODE_ENV !== 'production';

    const obj: Iprops & { playProtocol: string } = {
      playProtocol: 'HTTP_FLV',
      cameraId,
    };
    if (history) {
      obj.start = start;
      obj.end = end;
    }
    const urlRes = await request<{ id: string; playUrl: string }>({
      url,
      options: {
        method: 'post',
        body: JSON.stringify({
          //   playProtocol: 'HTTP_FLV',
          // cameraId,
          // start: '2023-02-06 12:00:00',
          // end: '2023-02-06 13:00:00',
          // rtspUrl: 'rtsp://admin:admin2019@192.168.0.109:554/cam/realmonitor?channel=1&subtype=1',
          ...obj,
        }),
      },
    });
    return (
      window.location.origin +
      process.env.NEXT_PUBLIC_ANALYTICS_BasePath +
      '/httpflv' +
      urlRes.data.playUrl
    );
    return dev
      ? window.location.origin + '/httpflv' + '/live/stream/e35c8c63d8b94fb1afe6d9045ba97d28.flv'
      : window.location.origin + '/httpflv' + urlRes.data.playUrl;
    const res = await request<any>({
      url: '/video-server/api/rtsp_play',
      options: {
        method: 'post',
        body: JSON.stringify({
          playProtocol: 'HTTP_FLV',
          rtspUrl: 'rtsp://admin:admin2019@192.168.0.109:554/cam/realmonitor?channel=1&subtype=1',
        }),
      },
    });

    console.info('res', res);

    return dev
      ? window.location.origin + '/httpflv' + '/live/stream/bb029b2f816745c8ba569a46bc050421.flv'
      : window.location.origin + '/httpflv' + res.data.playUrl;
  };
  return (
    <Box
      w="700px"
      h="500px"
      bg="pri.dark.100"
      position="relative"
      borderRadius="10px"
      overflow="hidden"
      {...contentStyle}
    >
      <canvas
        id={id.current}
        style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 1 }}
      />

      {loading && (
        <Spinner
          size="xl"
          color="pri.white.100"
          zIndex={2}
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
        />
      )}
    </Box>
  );
};

export default NodeMediaPlayer;
