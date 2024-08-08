/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useMount, useUnmount } from 'ahooks';
import React, { useRef, useState } from 'react';
import Spin from '@/components/Loading/Spin';
import { dev } from '@/utils/util';

type msgType = 'message' | 'playing' | 'suspend';

// @ts-ignore
export interface IUeMap extends HTMLVideoElement {
  emitMessage?: (val: any) => void; // 发送消息
  addEventListener?: (type: msgType, callback: (e: { detail: any }) => void) => void; // 接收消息
  removeEventListener?: (type: msgType, callback: (e: { detail: any }) => void) => void; // 取消订阅
  [key: string]: any;
}
interface Iprops {
  getUeMapObj: ({ map }: { map: IUeMap }) => void;
}

const id = dev
  ? 'ws://192.168.0.240:8088'
  : (process.env.NEXT_PUBLIC_ANALYTICS_3d_Webrtc as string);
// const id = dev ? 'wss://172.30.17.31/webrtcDev/' : process.env.NEXT_PUBLIC_ANALYTICS_3d_Webrtc as string;

const UeBaseMap = ({ getUeMapObj }: Iprops) => {
  const psRef = useRef<IUeMap | null>(null);

  const timer = useRef<NodeJS.Timer | null>(null);
  const [isloading, setIsLoading] = useState(true);

  const callback = (e: any) => {
    console.info('============e==============', e);
    console.info('============e.detail==============', e.detail);

    if (e.detail && e.detail === 'connecting!') {
      if (timer.current) {
        clearInterval(timer.current);
        timer.current = null;

        getUeMapObj({ map: psRef.current as IUeMap });
        if (psRef.current && psRef.current.removeEventListener) {
          psRef.current.removeEventListener('message', callback);
          setTimeout(() => {
            setIsLoading(false);
          }, 500);
        }
      }
    }
  };
  const onConnectingCallback = () => {
    let nums = 0;
    if (psRef.current && psRef.current.addEventListener) {
      psRef.current.addEventListener('message', callback);
      timer.current = setInterval(() => {
        nums += 1;
        if (nums >= 1000 && timer.current) {
          clearInterval(timer.current);
          timer.current = null;
        }
        if (
          psRef.current &&
          psRef.current.emitMessage &&
          psRef.current.dc &&
          psRef.current.dc.send
        ) {
          console.info('===========connecting===============', psRef.current.emitMessage);
          psRef.current.emitMessage({
            type: 'connecting',
          });
        }
      }, 100);
    }
  };
  useMount(() => {
    // @ts-ignore
    import('../../../public/peer-steam/peer-stream.js').then(() => {
      const video = document.getElementById(id as string) as HTMLVideoElement;
      psRef.current = video;
      console.info('============video==============', video);

      onConnectingCallback();
    });
  });

  useUnmount(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  });

  const testPoint = () => {
    // const coords = [103.823338, 30.992457, 500];
    const value = {
      type: 'alarmList',
      values: [
        {
          alarmId: '1637676840122324353',
          alarmLevel: '02',
          alarmType: 'FAS',
          coords: { lng: 103.82354429856855, lat: 30.993136009087323, height: 1000 },
          screenType: '02',
        },
      ],
    };

    if (psRef.current && psRef.current.emitMessage) {
      psRef.current.emitMessage(JSON.stringify(value));
    }
  };
  return (
    <>
      <Spin spin={isloading} bg="pri.black.100">
        <video
          is="peer-stream"
          id={id}
          style={{ width: '100%', height: '100%', position: 'fixed', top: 0, left: 0 }}
        ></video>
      </Spin>
    </>
  );
};

export default UeBaseMap;
