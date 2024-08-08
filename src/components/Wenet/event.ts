let wenetWs: WebSocket | null = null;
let timer: NodeJS.Timer | null = null;
let res = '';
let setRecordEndFun: null | ((text: string) => void) = null; // 语音识别完成
let handleRecordErrorCallBcak: null | (() => void);
let handleRecordSucessCallBcak: null | (() => void);
let setRecordTextFun: null | React.Dispatch<React.SetStateAction<string>>;

// 上传语音流进行交互
const TransferUpload = (number: number, blobOrNull: Blob | null, duration: number, blobRec: any, isClose: boolean) => {
  if (blobOrNull) {
    const blob = blobOrNull;
    // const encTime = blob.encTime;
    const reader = new FileReader();
    reader.onloadend = function () {
      if (wenetWs) {
        console.info('=========send info=================');
        wenetWs.send(reader.result!);
        if (setRecordTextFun) {
          setRecordTextFun('语音识别中。。。');
        }
      }
    };
    reader.readAsArrayBuffer(blob);
  }
};

// 调取麦克风失败后的回调
const handleRecordError = () => {
  stopRecording();
  if (handleRecordErrorCallBcak) {
    handleRecordErrorCallBcak();
  }
};
// 调取麦克风成功回调
const handleRecordSucess = () => {
  if (handleRecordSucessCallBcak) {
    handleRecordSucessCallBcak();
  }
};
const parseResult = (msg: string) => {
  const data = JSON.parse(msg);
  let nbest;
  if (data.type == 'partial_result') {
    nbest = JSON.parse(data.nbest);
    const sentence = nbest[0].sentence;
    if (sentence.length > 0) {
      if (setRecordEndFun) {
        setRecordEndFun(res + sentence);
      }
      console.info('============res + sentence==============', res + sentence);
      // $("#resultPanel").html(res + sentence)
    }
  } else if (data.type == 'final_result') {
    nbest = JSON.parse(data.nbest);
    const sentence = nbest[0].sentence;
    if (sentence.length > 0) {
      res += sentence + '，';
      if (setRecordEndFun) {
        setRecordEndFun(res);
      }
      console.info('=========res=================', res);
      // $("#resultPanel").html(result)
    }
    console.log(nbest);
  }
};
const initWenSocket = (url: string) => {
  wenetWs = new WebSocket(url);
  wenetWs.onopen = function () {
    console.log('Websocket 连接成功，开始识别');
    wenetWs!.send(
      JSON.stringify({
        signal: 'start',
        nbest: 1,
        continuous_decoding: true,
      })
    );
  };
  wenetWs.onmessage = function (_msg) {
    parseResult(_msg.data);
  };
  wenetWs.onclose = function (e) {
    console.log('WebSocket 连接断开');
    if (res.length > 0) {
      if (res.endsWith('，')) {
        res = res.slice(0, -1);
      }
      // $("#resultPanel").html(res + "。")
      res = '';
    }
  };
  wenetWs.onerror = function (e) {
    console.log('WebSocket 连接失败');
  };
};

//
const initObj = () => {
  return { wenetWs, timer };
};

// 初始化
const initRecorder = () => {
  // setTimeout(() => {
  SoundRecognizer.init({
    soundType: 'pcm',
    sampleRate: 16000,
    // recwaveElm: '.recwave',
    translerCallBack: TransferUpload,
    recordLevelBack: getRecordLevel,
    handleRecordError: handleRecordError,
    handleRecordSucess: handleRecordSucess,
  });
  // }, 5 * 100);
  // return { wenetWs, timer };
};
let levelIndex = 0; // 判断无声音的持续时间
const levelQuitNum = 60; // 音量小于30， 为静音
const silentSeconds = 800; // 3秒不说话，退出识别
let recordTimer: null | NodeJS.Timer = null;
let currentLevel = 0;
// 监听语音音量
const getRecordLevel = (level: number) => {
  // console.info('============当前音量==============', level);
  currentLevel = level;
};

const startRecording = (
  dealRecord: (text: string) => void,
  sucessCallBack: () => void,
  errorCallBack: () => void,
  setRecordText: React.Dispatch<React.SetStateAction<string>>
) => {
  console.info('============startRecording==============');
  initRecorder();
  const dev = process.env.NODE_ENV !== 'production';
  const path = window.location.host;
    const protocol = window.location.protocol.indexOf('https') !== -1 ? 'wss' : 'ws';
    const url = dev ? `${protocol}://${path}:${process.env.NEXT_PUBLIC_ANALYTICS_DevHttpsPort}/wenetServer/` :  `${protocol}://${path}/wenetServer/`;
    const urldev = 'wss://192.168.0.240/wenetServer/'
  initWenSocket(url);

  setRecordEndFun = dealRecord;
  handleRecordErrorCallBcak = errorCallBack;
  handleRecordSucessCallBcak = sucessCallBack;
  setRecordTextFun = setRecordText;
  // Start countdown
  let seconds = 180;

  timer = setInterval(function () {
    seconds--;
    if (seconds === 0) {
      console.info('==============stopRecording============', );
      stopRecording();
    }
    // 监听音量，静音3秒退出

    if (currentLevel > levelQuitNum) {
      levelIndex = 0;
    } else {
      levelIndex += 100;
      if (levelIndex > silentSeconds) {
        stopRecording();
        recordTimer = null;
        levelIndex = 0;
        currentLevel = 0;
      }
    }
  }, 100);
};
const stopRecording = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  SoundRecognizer.recordClose();
  setTimeout(() => {
    if (wenetWs) {
      wenetWs.send(JSON.stringify({ signal: 'end' }));
    }
  }, 2 * 100);
};

export { startRecording, stopRecording, initObj };
