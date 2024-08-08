'use client';

import CallPhone from './CallPhone';
import { useRecoilState } from 'recoil';
import { callNumberVisibleModel } from '@/models/callNumber';
import { forwardRef, Ref, useImperativeHandle, useRef, useEffect } from 'react';
import { useUnmount, useMemoizedFn } from 'ahooks';
import { useToast } from '@chakra-ui/react';
import { Refs as CallPhoneRef } from './CallPhone';
import { createPortal } from 'react-dom';
import { execOperate } from '@/utils/util';

const pings = JSON.stringify({ pingTest: 'pingTest' });

export let phoneSocket: null | WebSocket = null;

export interface Refs {
  initPhoneSocketFun: () => void;
}

const CallNumberContainer = (_: object, refs: Ref<Refs>) => {
  const [data, setData] = useRecoilState(callNumberVisibleModel);
  const visibleRef = useRef(false);
  const toast = useToast();
  const callPhoneRef = useRef<CallPhoneRef>(null);
  const timer = useRef<NodeJS.Timer>();
  const reconnectTimer = useRef<NodeJS.Timer>();
  const reconnectCount = useRef(0);
  const { isbroadcast, name, number, eventId } = data;
  //重连超过5次不再连接
  const maxconnectCount = 5;
  useEffect(() => {
    visibleRef.current = data.visible;
  }, [data.visible]);

  const destory = () => {
    setData({ visible: false });
  };

  const phoneRef = useRef<null | WebSocket>(null);

  useImperativeHandle(refs, () => ({
    initPhoneSocketFun,
    phoneRef: phoneRef.current,
  }));

  useUnmount(() => {
    phoneRef.current?.close?.();
    clearAllTimer();
    phoneSocket = null;
  });

  const clearAllTimer = useMemoizedFn(() => {
    clearInterval(timer.current);
    clearTimeout(reconnectTimer.current);
  });

  const initPhoneSocketFun = useMemoizedFn(() => {
    //const protocol = window.location.protocol.indexOf('https') !== -1 ? 'wss' : 'ws';
    const url = `ws://127.0.0.1:8443/server`;
    //const url = `${protocol}://172.30.12.41:8443/server`;
    phoneRef.current = new WebSocket(url);

    //推送消息
    phoneRef.current.onmessage = ({ data }) => {
      const json = JSON.parse(data) as { state: number; phoneNum: string; name?: string };
      console.log('on message``````````````', json, json.state);

      const { state, phoneNum, name } = json;

      //1正在拨号
      //if (state === 1) {
      // if (!visibleRef.current) {
      //   setData({ visible: true, name: '', number: phoneNum });
      // }
      //}

      //挂断电话
      if (state === 3) {
        //关闭弹窗
        //callPhoneRef.current?.close();
        const title = (name || '') + '挂断电话';
        toast({
          title,
          status: 'info',
          position: 'top',
          duration: 3000,
        });

        if (eventId && isbroadcast) {
          execOperate({ incidentId: eventId!, operationAction: 'BROADCAST', removeKeep: true });
        }
      }

      //通话中
      if (state === 2) {
        callPhoneRef.current?.setPhonelineStatu(3);
        const title = (name || '') + '通话中';

        toast({
          title,
          status: 'info',
          position: 'top',
          duration: 3000,
        });
      }
    };

    phoneRef.current.onopen = () => {
      phoneSocket = phoneRef.current;
      timer.current = setInterval(() => {
        phoneRef.current?.send(pings);
      }, 6000 * 3);

      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
      }
    };

    phoneRef.current.onclose = () => {
      //断线重连
      reconnectCount.current = reconnectCount.current + 1;
      if (reconnectCount.current === maxconnectCount) {
        clearAllTimer();
      } else {
        reconnectTimer.current = setTimeout(() => {
          initPhoneSocketFun();
        }, 5000);
      }
    };
  });

  //we端发送拨打电话
  const webCall = useMemoizedFn(() => {
    if (phoneRef.current?.readyState === 1) {
      phoneRef.current?.send(
        JSON.stringify({
          head: { subMsg: 11, subType: 1 },
          state: 0,
          phoneNum: data.number || '',
          //phoneNum: '*62502,*62504',
          path: data.path || '',
          //播放名称区域名称

          name: data.name,
        })
      );
    } else {
      toast({
        title: '电话服务连接失败',
        status: 'error',
        position: 'top',
        duration: 3000,
        isClosable: true,
      });
    }
  });

  //web发送端挂断电话
  const webHangUp = useMemoizedFn(() => {
    if (phoneRef.current?.readyState === 1) {
      if (eventId && isbroadcast) {
        execOperate({ incidentId: eventId, operationAction: 'BROADCAST', removeKeep: true });
      }

      phoneRef.current?.send(
        JSON.stringify({
          head: { subMsg: 12, subType: 1 },
          state: 0,
          phoneNum: data.number,
          //phoneNum: '*62502,*62504',
          path: data.path || '',
          name: data.name,
        })
      );
    } else {
      toast({
        title: '电话服务连接失败',
        status: 'error',
        position: 'top',
        duration: 3000,
        isClosable: true,
      });
    }
  });

  //是否显示提示框
  if (!data.visible) {
    return null;
  }

  return createPortal(
    <CallPhone
      destory={destory}
      name={name!}
      number={number!}
      isbroadcast={isbroadcast}
      webCall={webCall}
      webHangUp={webHangUp}
      ref={callPhoneRef}
    />,
    document.body
  );
};

export default forwardRef(CallNumberContainer);
