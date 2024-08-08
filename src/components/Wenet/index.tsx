import { useMount, useUnmount } from 'ahooks';
import { useRef } from 'react';
import { initObj } from './event';

const Wenet = () => {
  const wenetWsRef = useRef<WebSocket | null>(null);
  const wenetTimer = useRef<NodeJS.Timer | null>(null);

  useMount(() => {
    // startRecording
    const { wenetWs, timer } = initObj();
    wenetWsRef.current = wenetWs;
    wenetTimer.current = timer;
  });
  useUnmount(() => {
    if (wenetTimer.current) {
      console.info('============wenetWsRef===== useUnmoun=========', wenetWsRef);
      clearInterval(wenetTimer.current);
      wenetTimer.current = null;
    }
  });
  // const TransferUpload = (number: number, blobOrNull: Blob | null, duration: number, blobRec: any, isClose: boolean) => {
  //   if (blobOrNull) {
  //     const blob = blobOrNull;
  //     // const encTime = blob.encTime;
  //     const reader = new FileReader();
  //     reader.onloadend = function () {
  //       if (wenetWsRef.current) {
  //         wenetWsRef.current.send(reader.result!);
  //       }
  //     };
  //     reader.readAsArrayBuffer(blob);
  //   }
  // };

  // const parseResult = (msg: string) => {
  //   const data = JSON.parse(msg);
  //   let nbest;
  //   if (data.type == 'partial_result') {
  //     nbest = JSON.parse(data.nbest);
  //     const sentence = nbest[0].sentence;
  //     if (sentence.length > 0) {
  //       console.info('============res.current + sentence==============', res.current + sentence);
  //       // $("#resultPanel").html(res.current + sentence)
  //     }
  //   } else if (data.type == 'final_result') {
  //     nbest = JSON.parse(data.nbest);
  //     const sentence = nbest[0].sentence;
  //     if (sentence.length > 0) {
  //       res.current += sentence + '，';
  //       console.info('=========res.current=================', res.current);
  //       // $("#resultPanel").html(result)
  //     }
  //     console.log(nbest);
  //   }
  // };
  // const initWenSocket = (url: string) => {
  //   if ('WebSocket' in window) {
  //     wenetWsRef.current = new WebSocket(url);
  //     wenetWsRef.current.onopen = function () {
  //       console.log('Websocket 连接成功，开始识别');
  //       wenetWsRef.current!.send(
  //         JSON.stringify({
  //           signal: 'start',
  //           nbest: 1,
  //           continuous_decoding: true,
  //         })
  //       );
  //     };
  //     wenetWsRef.current.onmessage = function (_msg) {
  //       parseResult(_msg.data);
  //     };
  //     wenetWsRef.current.onclose = function () {
  //       console.log('WebSocket 连接断开');
  //       if (res.current.length > 0) {
  //         if (res.current.endsWith('，')) {
  //           res.current = res.current.slice(0, -1);
  //         }
  //         // $("#resultPanel").html(res.current + "。")
  //         res.current = '';
  //       }
  //     };
  //     wenetWsRef.current.onerror = function () {
  //       console.log('WebSocket 连接失败');
  //     };
  //   }
  // };

  // const startRecording = () => {
  //   // Check socket url
  //   // init recorder
  //   SoundRecognizer.init({
  //     soundType: 'pcm',
  //     sampleRate: 16000,
  //     recwaveElm: '.recwave',
  //     translerCallBack: TransferUpload,
  //   });

  //   // Start countdown
  //   let seconds = 180;

  //   timer.current = setInterval(function () {
  //     seconds--;
  //     if (seconds === 0) {
  //       stopRecording();
  //     }
  //   }, 1000);
  // };
  // const stopRecording = () => {
  //   if (wenetWsRef.current) {
  //     wenetWsRef.current.send(JSON.stringify({ signal: 'end' }));
  //   }
  //   SoundRecognizer.recordClose();

  //   if (timer.current) {
  //     clearInterval(timer.current);
  //   }
  // };
  return null;
};

export default Wenet;
