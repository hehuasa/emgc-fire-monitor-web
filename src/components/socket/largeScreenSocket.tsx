import { IUserInfo } from '@/app/login/page';
import { ILargeScreenState, largeScreenModal } from '@/models/baseWebSocket';
import { useLocalStorageState, useMemoizedFn, useMount, useUnmount } from 'ahooks';
import { forwardRef, Ref, useImperativeHandle, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { v4 } from 'uuid';
const timerTest: {
  timer: NodeJS.Timeout | null;
  reconnect: NodeJS.Timeout | null;
} = {
  timer: null,
  reconnect: null,
};

export interface Refs {
  initWebSocket: () => void;
}

const LargeScreenSocket = (_: object, refs: Ref<Refs>) => {
  const socketTimer = useRef(1000);
  const baseWebSocketRef = useRef<WebSocket | null>(null);
  const [currentUserInfo] = useLocalStorageState<null | IUserInfo>('currentUserInfo_dp_center');
  const [largeScreen, setLargeScreen] = useRecoilState(largeScreenModal); // 获取,设置

  const isMount = useRef(false); // 组件是否已挂载
  const pingTimer = useRef<NodeJS.Timer | null>(null);
  const reconencTimer = useRef<NodeJS.Timer | null>(null);

  useImperativeHandle(refs, () => ({
    initWebSocket,
  }));

  useMount(() => {
    isMount.current = true;
  });

  useUnmount(() => {
    isMount.current = false;
    baseWebSocketRef.current?.close?.();
    baseWebSocketRef.current = null;
    clearAllTimer();
  });

  const clearAllTimer = useMemoizedFn(() => {
    pingTimer.current && clearInterval(pingTimer.current);
    reconencTimer.current && clearTimeout(reconencTimer.current);
  });

  const handleOnMsg = useMemoizedFn(({ data }) => {
    try {
      const msg = JSON.parse(data) as { msgBody: string; topic: string; code: number };
      if (msg.code && msg.code === 500) {
        baseWebSocketRef.current?.close();
      }
      if (!msg.msgBody) {
        return;
      }

      const meg = JSON.parse(data);
      if (meg.topic === 'center_large_status' && msg.msgBody) {
        const msgBody: ILargeScreenState = JSON.parse(msg.msgBody);

        const newLargeScreen = { ...largeScreen };
        newLargeScreen[msgBody.operationAction] = { ...msgBody, update: v4() };
        setLargeScreen(newLargeScreen);
        if (msgBody.operationAction === 'REFRESH') {
          window.location.reload();
        }
      }
    } catch (e) {
      console.log('推送错误', e);
    }
  });

  const initWebSocket = useMemoizedFn(() => {
    const protocol = window.location.protocol.indexOf('https') !== -1 ? 'wss' : 'ws';
    const clientType = localStorage.getItem(
      process.env.NEXT_PUBLIC_ANALYTICS_cx_factoryType
        ? `${process.env.NEXT_PUBLIC_ANALYTICS_cx_factoryType}_clientType`
        : 'clientType'
    );
    const url = `${protocol}://${process.env.NEXT_PUBLIC_ANALYTICS_Pt_message}/websocket?userId=${
      currentUserInfo ? currentUserInfo.userId : 0
    }&clientType=${clientType === 'dpCenter-show' ? 'dpCenter-show' : 'dpCenter-ctrl'}`;

    baseWebSocketRef.current = new WebSocket(url);

    const ping = () => {
      if (baseWebSocketRef.current) {
        baseWebSocketRef.current.send(
          JSON.stringify({
            featureType: 'PING',
            id: 'ping',
          })
        );
      }
    };

    const init = () => {
      if (baseWebSocketRef.current) {
        baseWebSocketRef.current.send(
          JSON.stringify({
            id: currentUserInfo?.userId,
            featureType: 'TOPIC_SUBSCRIBE',
            topics: ['center_large_status'],
          })
        );
        if (pingTimer.current) {
          clearInterval(pingTimer.current);
          pingTimer.current = null;
        }

        if (isMount.current) {
          pingTimer.current = setInterval(() => {
            ping();
          }, 6 * 1000);
        }
      }
    };

    baseWebSocketRef.current.onopen = () => {
      init();
      socketTimer.current = 1000;
    };

    baseWebSocketRef.current.onmessage = handleOnMsg;

    baseWebSocketRef.current.onclose = () => {
      console.info(socketTimer.current, '毫秒后开始重连websocket');
      reconencTimer.current = setTimeout(() => {
        if (isMount.current) {
          initWebSocket();
        }
      }, socketTimer.current);
      socketTimer.current += 1000;
      if (socketTimer.current >= 60 * 1000 * 5) {
        socketTimer.current = 1000;
      }
    };

    baseWebSocketRef.current.onerror = () => {
      //
    };
  });

  return null;
};

// export default LargeScreenSocket;
export default forwardRef(LargeScreenSocket);
