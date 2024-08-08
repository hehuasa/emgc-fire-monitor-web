import { request } from '@/utils/request';
import { Box, BoxProps, Spinner } from '@chakra-ui/react';
import { useMemoizedFn, useMount, useSafeState, useUnmount } from 'ahooks';
import React, { useRef } from 'react';
import { VideoPlay } from '@/components/Icons';
import { useImperativeHandle, forwardRef, Ref } from 'react';

export type Refs = {
  onResize: () => void;
};
interface Iprops {
  cameraId: string;
  history?: boolean;
  start?: string;
  end?: string;
  contentStyle?: BoxProps;
  streamType?: number; // 码流类型, 0:主码流,1:子码流; 默认1
}
const user = 'admin';
const pass = 'jiankong123';

const ips = [
  'rtsp://' +
    user +
    ':' +
    pass +
    '@' +
    '192.168.23.19' +
    ':554/cam/realmonitor?channel=1&subtype=0',
  'rtsp://' +
    user +
    ':' +
    pass +
    '@' +
    '192.168.23.20' +
    ':554/cam/realmonitor?channel=1&subtype=0',
  'rtsp://' +
    user +
    ':' +
    pass +
    '@' +
    '192.168.23.22' +
    ':554/cam/realmonitor?channel=1&subtype=0',
  'rtsp://' +
    user +
    ':' +
    pass +
    '@' +
    '192.168.23.23' +
    ':554/cam/realmonitor?channel=1&subtype=0',
  'rtsp://' +
    user +
    ':' +
    pass +
    '@' +
    '192.168.23.24' +
    ':554/cam/realmonitor?channel=1&subtype=0',
  'rtsp://' +
    user +
    ':' +
    pass +
    '@' +
    '192.168.23.25' +
    ':554/cam/realmonitor?channel=1&subtype=0',
  'rtsp://' +
    user +
    ':' +
    pass +
    '@' +
    '192.168.23.26' +
    ':554/cam/realmonitor?channel=1&subtype=0',
  'rtsp://' +
    user +
    ':' +
    pass +
    '@' +
    '192.168.23.27' +
    ':554/cam/realmonitor?channel=1&subtype=0',
  'rtsp://' +
    user +
    ':' +
    pass +
    '@' +
    '192.168.23.30' +
    ':554/cam/realmonitor?channel=1&subtype=0',
  'rtsp://' +
    user +
    ':' +
    pass +
    '@' +
    '192.168.23.31' +
    ':554/cam/realmonitor?channel=1&subtype=0',

  'rtsp://' + user + ':' + pass + '@' + '192.168.23.10' + ':554/Streaming/Channels/101',
  'rtsp://' + user + ':' + pass + '@' + '192.168.23.11' + ':554/Streaming/Channels/101',
  'rtsp://' + user + ':' + pass + '@' + '192.168.23.12' + ':554/Streaming/Channels/101',
  'rtsp://' + user + ':' + pass + '@' + '192.168.23.13' + ':554/Streaming/Channels/101',
  'rtsp://' + user + ':' + pass + '@' + '192.168.23.14' + ':554/Streaming/Channels/101',
  'rtsp://' + user + ':' + pass + '@' + '192.168.23.15' + ':554/Streaming/Channels/101',
  'rtsp://' + user + ':' + pass + '@' + '192.168.23.16' + ':554/Streaming/Channels/101',
  'rtsp://' + user + ':' + pass + '@' + '192.168.23.17' + ':554/Streaming/Channels/101',
  'rtsp://' + user + ':' + pass + '@' + '192.168.23.18' + ':554/Streaming/Channels/101',
];

const getUrl = (index: number) => {
  const url = ips[index];
  // const url = 'rtsp://' + user + ":" + pass + "@" + ip + ':554/cam/realmonitor?channel=1&subtype=0';
  return url;
};
const NodeMediaPlayer = (
  { cameraId, history, start, end, contentStyle, streamType }: Iprops,
  ref: Ref<Refs>
) => {
  const id = useRef<string>('video' + Math.ceil(Math.random() * 10000) + new Date().getTime());
  //正在加载
  const [loading, setloading] = useSafeState(true);
  //正在播放
  const [isPlaying, setIsPlaying] = useSafeState(false);
  // const toast = useToast();
  const timer = useRef<null | NodeJS.Timer>(null);
  const playerRef = useRef<null | NodePlayer>(null);

  const currentVideo = useRef<{ id: string; playUrl: string }>({
    id: '',
    playUrl: '',
  });

  useImperativeHandle(ref, () => {
    return {
      onResize: resize,
    };
  });

  const resize = useMemoizedFn(() => {
    playerRef.current?.onResize();
  });

  useMount(() => {
    if (id.current) {
      NodePlayer.load(() => {
        playerRef.current = new NodePlayer();
        playerRef.current.useWorker();
        playerRef.current.setBufferTime(100);
        playerRef.current.enableAudio(false);

        playerRef.current.setView(id.current);
        playerRef.current.on('start', () => {
          setIsPlaying(true);
          setloading(false);
          resize();
        });

        playerRef.current.on('stop', () => {
          setIsPlaying(false);
          setloading(false);
        });

        playerRef.current.on('error', () => {
          setIsPlaying(false);
          setloading(false);
        });

        playVideo();
      });
    }
  });

  useUnmount(() => {
    if (currentVideo.current.id) {
      stopVideo(currentVideo.current);
    }
    if (playerRef.current) {
      playerRef.current.release(true);
    }
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
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
      streamType: streamType !== undefined ? streamType : 1,
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
          ...obj,
        }),
      },
    });

    if (urlRes.code === 200) {
      if (timer.current) {
        clearInterval(timer.current);
        timer.current = null;

        timer.current = setInterval(() => {
          pingUrl({ id: urlRes.data.id, playUrl: urlRes.data.playUrl });
        }, 5 * 1000 * 60);
      }
      const path = window.location.host;
      const protocol = window.location.protocol.indexOf('https') !== -1 ? 'https://' : 'http://';

      return {
        id: urlRes.data.id,
        playUrl: urlRes.data.playUrl,
        url: protocol + path + '/httpflv' + urlRes.data.playUrl,
        //url: 'http://192.168.0.243:8080/live/test.flv',
      };
    } else {
      setloading(false);
    }
  };
  const getPlayUrl_fat = async () => {
    const idex = Math.floor(Math.random() * ips.length);
    const url = getUrl(idex);
    const res = await request<any>({
      url: '/video-server/api/rtsp_play',
      options: {
        method: 'post',
        body: JSON.stringify({
          playProtocol: 'HTTP_FLV',
          rtspUrl: url,
        }),
      },
    });

    console.info('res', res);

    if (res && res.code === 200) {
      return {
        id: res.data.id,
        playUrl: res.data.playUrl,
        url: window.location.origin + '/httpflv' + res.data.playUrl,
      };
    }
    return { id: '', playUrl: '', url: '' };

    // return window.location.origin + '/httpflv' + res.data.playUrl;
  };

  const playVideo = async () => {
    setloading(true);
    if (playerRef.current) {
      const res =
        process.env.NEXT_PUBLIC_ANALYTICS_Ms_type === 'cx'
          ? await getPlayUrl()
          : await getPlayUrl();
      if (res) {
        const { id, playUrl, url } = res;
        if (currentVideo.current.id) {
          stopVideo(currentVideo.current);
        }
        currentVideo.current = { id, playUrl };
        playerRef.current.start(url);
      }
    }
  };

  const stopVideo = (obj: { id: string; playUrl: string }) => {
    if (playerRef.current) {
      playerRef.current.stop();
      playerRef.current.clearView();
      if (history) {
        request({
          url: '/video-server/api/forced_shutdown',
          options: {
            method: 'post',
            body: JSON.stringify(obj),
          },
        });
      }
    }
    // request({
    //   url: '/video-server/api/forced_shutdown',
    //   options: {
    //     method: 'post',
    //     body: JSON.stringify(obj),
    //   },
    // });
  };

  const pingUrl = async ({ id, playUrl }: { id: string; playUrl: string }) => {
    const urlRes = await request<{ id: string; playUrl: string }>({
      url: '/video-server/api/alive',
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
      <canvas
        id={id.current}
        style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 1 }}
      />

      {loading ? (
        <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" zIndex={2}>
          <Spinner w="48px" h="48px" color="pri.white.100" />
        </Box>
      ) : null}
      {!loading && !isPlaying && (
        <VideoPlay
          onClick={playVideo}
          w="48px"
          zIndex={2}
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          cursor="pointer"
        />
      )}
    </Box>
  );
};

export default forwardRef(NodeMediaPlayer);
