/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { request } from '@/utils/request';
import { Box } from '@chakra-ui/react';
import { useMount, useUnmount } from 'ahooks';

import React, { useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

type IProps = {
  cameraId: string;
};
const VideoPlayer = ({ cameraId }: IProps) => {
  const videoDom = useRef<HTMLDivElement>(null);
  const id = useRef('video' + uuidv4().replace(/-/g, ''));
  const palyer = useRef<Jessibuca | null>(null);

  useMount(() => {
    if (videoDom.current) {
      if (palyer.current) {
        palyer.current.destroy();
        palyer.current = null;
      }
      // const dom = createDom();
      palyer.current = initPlayer();
      request<any>({
        url: '/video-server/api/rtsp_play',
        options: {
          method: 'post',
          body: JSON.stringify({
            playProtocol: 'WS_FLV',
            rtspUrl: 'rtsp://admin:admin2019@192.168.0.109:554/cam/realmonitor?channel=1&subtype=0',
          }),
        },
      }).then((data) => {
        if (palyer.current && data && data.data) {
          palyer.current.play(data.data.playUrl);
        }
      });
    }
  });

  useUnmount(() => {
    if (palyer.current) {
      palyer.current.destroy();
      palyer.current = null;
    }
  });

  const createDom = () => {
    if (videoDom.current) {
      const canvas = document.createElement('canvas') as HTMLCanvasElement;
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.id = id.current;

      const old = videoDom.current.getElementsByTagName('canvas');
      if (old && old[0]) {
        old[0].remove();
      }
      videoDom.current.appendChild(canvas);
      return canvas;
    }

    return 0;
  };

  const initPlayer = () => {
    let player = null;
    if (videoDom.current) {
      player = new Jessibuca({
        container: videoDom.current,
        videoBuffer: 0.2, // 缓存时长
        decoder: './jessibuca/decoder.js',
        isResize: false,
        // text: '',
        loadingText: '加载中',
        debug: false,
        useMSE: true,
        autoWasm: true,
        hasAudio: false,

        isNotMute: false,
        heartTimeout: 10,
      });
    }
    return player;
  };

  return (
    <Box h="full" position="relative" ref={videoDom} bg="black">
      {/* <canvas style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} id={id.current}></canvas> */}
    </Box>
  );
};

export default VideoPlayer;
