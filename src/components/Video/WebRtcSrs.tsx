import { request } from '@/utils/request';
import { Box, BoxProps, Spinner } from '@chakra-ui/react';
import { useMount, useUnmount } from 'ahooks';
import { useRef, useState } from 'react';

interface Iprops {
  cameraId: string;
  history?: boolean;
  start?: string;
  end?: string;
  contentStyle?: BoxProps;
}
const WebRtcSrs = ({ cameraId, history, start, end, contentStyle }: Iprops) => {
  const videoDom = useRef<HTMLVideoElement | null>(null);
  const [loading, setloading] = useState(true);
  const timer = useRef<null | NodeJS.Timer>(null);

  useMount(() => {
    console.info('============SrsRtcPlayerAsync==============', SrsRtcPlayerAsync);
    const sdk = new SrsRtcPlayerAsync();
    if (videoDom.current) {
      videoDom.current.srcObject = sdk.stream;
      getPlayUrl().then((url) => {
        sdk
          .play(url, process.env.NEXT_PUBLIC_ANALYTICS_BasePath)
          .then(function (session: unknown) {
            setloading(false);
          })
          .catch(function (reason: unknown) {
            sdk.close();
          });
      });
    }
  });
  useUnmount(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  });
  const getPlayUrl = async () => {
    const url = history
      ? '/ms-gateway/device-manger/camera/rtsp_history_play'
      : '/ms-gateway/device-manger/camera/rtsp_live_play';

    const obj: Iprops & { playProtocol: string } = {
      playProtocol: 'WEBRTC',
      cameraId,
    };
    if (history) {
      obj.start = start;
      obj.end = end;
    }

    const dev = process.env.NODE_ENV !== 'production';

    if (dev) {
      const res = await request<any>({
        url: '/ms-gateway/video-server/api/rtsp_play',
        options: {
          method: 'post',
          body: JSON.stringify({
            playProtocol: 'WEBRTC',
            // rtspUrl: 'rtsp://admin:jiankong123@172.17.2.6:554/Streaming/Channels/101?transportmode=unicast',
            rtspUrl: 'rtsp://admin:admin2019@192.168.0.109:554/cam/realmonitor?channel=1&subtype=0',
          }),
        },
      });

      console.info('res', res);
      if (res.code == 200) {
        return (
          'webrtc:' +
          process.env.NEXT_PUBLIC_ANALYTICS_WebRtcApi?.substring('http:'.length) +
          res.data.playUrl
        );
      } else {
        return '';
      }
    }

    const urlRes = await request<{ id: string; playUrl: string }>({
      url,
      options: {
        method: 'post',
        body: JSON.stringify({
          // playProtocol: 'WEBRTC',
          // cameraId,
          // start: '2023-02-06 12:00:00',
          // end: '2023-02-06 13:00:00',
          // rtspUrl: 'rtsp://admin:admin2019@192.168.0.109:554/cam/realmonitor?channel=1&subtype=1',
          ...obj,
        }),
      },
    });

    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;

      timer.current = setInterval(
        () => {
          pingUrl({ id: urlRes.data.id, playUrl: urlRes.data.playUrl });
        },
        5 * 1000 * 60
      );
    }
    return (
      'webrtc:' +
      process.env.NEXT_PUBLIC_ANALYTICS_WebRtcApi?.substring('http:'.length) +
      urlRes?.data?.playUrl
    );
  };

  const pingUrl = async ({ id, playUrl }: { id: string; playUrl: string }) => {
    const urlRes = await request<{ id: string; playUrl: string }>({
      url: '/ms-gateway/video-server/api/alive',
      options: {
        method: 'post',
        body: JSON.stringify({ id, playUrl }),
      },
    });
  };
  return (
    <Box
      w="full"
      h="full"
      bg="pri.dark.100"
      position="relative"
      borderRadius="10px"
      overflow="hidden"
      {...contentStyle}
    >
      <video
        ref={videoDom}
        autoPlay
        muted
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1,
          objectFit: 'fill',
        }}
      />
      {loading && (
        <Spinner
          size="xl"
          color="pri.white.100"
          zIndex={2}
          position="absolute"
          top="50%"
          left="50%"
        />
      )}
    </Box>
  );
};

export default WebRtcSrs;
