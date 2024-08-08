import { stateSetRequest } from '@/app/(largeScreenCenter)/largeScreenCenter/Panel/StateSetRequest';
import { audioControlModal, IAudioControl } from '@/models/baseWebSocket';
import { request } from '@/utils/request';
import { dev } from '@/utils/util';
import { useToast } from '@chakra-ui/react';
import { useMemoizedFn } from 'ahooks';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { v4 } from 'uuid';

const timerTest: {
  timer: NodeJS.Timeout | null;
  reconnect: NodeJS.Timeout | null;
} = {
  timer: null,
  reconnect: null,
};

const AudioControlSocket = () => {
  const toast = useToast();
  const [start, setStart] = useState('');
  const refCount = useRef(0);
  const baseWebSocketRef = useRef<WebSocket>();
  const setAudioControl = useSetRecoilState(audioControlModal);

  const openDoor = useCallback(
    async (command: string, stationFlag: string) => {
      const { code, msg, data } = await request<string>({
        url: '/cx-largescreen/ct/voiceCommand/openDoor',
        options: {
          method: 'post',
          headers: {
            'x-station': stationFlag,
          },
          body: command,
        },
      });
      if (code === 200) {
        toast({
          title: '操作成功',
          position: 'top',
          status: 'success',
        });
      } else {
        toast({
          title: msg || '操作失败',
          position: 'top',
          status: 'error',
        });
      }
    },
    [toast]
  );

  const onmessageInfo = useMemoizedFn((e: MessageEvent<string>) => {
    if (e.data) {
      const meg: IAudioControl = JSON.parse(e.data);

      if (meg.code && meg.code === 500) {
        baseWebSocketRef.current?.close();
      }

      switch (meg.data?.type) {
        case 'openDoor':
          let station = '';
          switch (meg.data.station) {
            case '三号':
              station = '3#';
              break;
            case '四号':
              station = '4#';
              break;
            case '五号':
              station = '5#';
              break;
            case '六号':
              station = '6#';
              break;
          }
          meg.data.content && openDoor(meg.data.content, station);
          break;
        case 'viewCamera':
          setAudioControl({ ...meg, update: v4() });
          break;
        case 'closeCamera':
          stateSetRequest({
            operationAction: 'VIDEO',
            param: { data: [] },
          });
          break;
        case 'siteResource':
          break;
        default:
          break;
      }
    }
  });

  useEffect(() => {
    const protocol = window.location.protocol.indexOf('https') !== -1 ? 'wss' : 'ws';
    const url = dev ? `${protocol}://127.0.0.1:23911` : `${protocol}://127.0.0.1:23911`;

    baseWebSocketRef.current = new WebSocket(url);
    baseWebSocketRef.current.onmessage = onmessageInfo;
    baseWebSocketRef.current.onopen = () => {
      if (timerTest.reconnect) {
        clearInterval(timerTest.reconnect);
        timerTest.reconnect = null;
      }
    };
    baseWebSocketRef.current.onclose = () => {
      if (timerTest.reconnect) {
        clearInterval(timerTest.reconnect);
        timerTest.reconnect = null;
      }

      if (refCount.current > 10) {
        refCount.current = 0;
        return;
      }

      timerTest.reconnect = setInterval(() => {
        setStart(v4());
        refCount.current += 1;
      }, 6000);
    };
    return () => {
      if (baseWebSocketRef.current && baseWebSocketRef.current.close) {
        baseWebSocketRef.current.close();
      }
      if (timerTest.reconnect) {
        clearInterval(timerTest.reconnect);
        timerTest.reconnect = null;
      }
      // if (timerTest.timer) {
      //     clearInterval(timerTest.timer);
      //     timerTest.timer = null;
      // }
    };
  }, [onmessageInfo, openDoor, setAudioControl, start]);

  return null;
};

export default AudioControlSocket;
