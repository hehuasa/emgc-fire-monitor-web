import { request } from '@/utils/request';
import { Box, BoxProps, Spinner } from '@chakra-ui/react';
import { useMount, useSafeState, useUnmount } from 'ahooks';
import React, { useRef } from 'react';
import { VideoPlay } from '@/components/Icons';

interface Iprops {
  cameraId: string;
  history?: boolean;
  start?: string;
  end?: string;
  contentStyle?: BoxProps;
  streamType?: number; // 码流类型, 0:主码流,1:子码流; 默认1
}
const NodeMediaPlayerDp = ({ cameraId, history, start, end, contentStyle, streamType }: Iprops) => {
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

  useMount(() => {
    if (id.current) {
      playerRef.current = new NodePlayer();

      // player.useMSE();
      playerRef.current.useMSE();
      /**
       * 使用worker线程解码, 适用于多画面直播, 能有效利用多核处理器
       * 紧随 new 后调用
       */
      // player.useWorker();

      /**
       * 使用Chrome86及之后提供的WebCodecs API来进行硬解码,当前为实验特性,需要手动开启
       * 在浏览器地址栏输入 chrome://flags/#enable-experimental-web-platform-features 设为启动
       * 或者在命令行中加参数 --enable-blink-features=WebCodecs 来启动
       * Chrome最新发布94版已默认开启,支持Desktop,Anddroid,Webview!
       * 需要https加载web,播放https/wss流地址
       */
      // playerRef.current.useWCS();
      playerRef.current.enableAudio(false);
      // playerRef.current.useWorker();
      playerRef.current.setView(id.current);
      playerRef.current.setBufferTime(0);
      playerRef.current.on('start', () => {
        setIsPlaying(true);
        setloading(false);
      });

      playerRef.current.on('stop', () => {
        setIsPlaying(false);
        setloading(false);
        playerRef.current?.release(true);
      });

      playerRef.current.on('error', () => {
        setIsPlaying(false);
        setloading(false);
        playerRef.current?.release(true);
      });

      playVideo();
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
      };
    } else {
      setloading(false);
    }
  };

  const playVideo = async () => {
    setloading(true);
    if (playerRef.current) {
      const res = await getPlayUrl();
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

export default NodeMediaPlayerDp;
