import { IVideoData } from '@/app/(largeScreenCenter)/largeScreenCenter/Panel/CusTomMoveable';
import { atom } from 'recoil';

type IAudioControlDataType = 'command';
// const IAudioControl = {
//     // # 数据类型
//     // # command 命令
//     dataType: 'command',
//     data: {
//       // # 类别
//       // #  openDoor: 打开
//       // #  viewCamera 显示视频
//       // #  siteResource 事件地点资源
//       type: 'type_',
//       // #内容
//       content: 'content',
//       // #分词
//       words: 'str(fenci)',
//     },
//   };
export interface IAudioControl {
  code?: number;
  dataType?: IAudioControlDataType;
  data?: {
    content: string;
    type: 'openDoor' | 'viewCamera' | 'siteResource' | 'closeCamera';
    words: string;
    station: string;
  };
  update?: string;
}

type IOperationAction =
  | 'CAPACITY'
  | 'POWER'
  | 'JOB'
  | 'EUR'
  | 'JOB_DETAIL'
  | 'ALARM_STATIS'
  | 'FIRE'
  | 'TARGET'
  | 'MET'
  | 'DEVICE_STATUS'
  | 'PERSON_STATIS'
  | 'MAP'
  | 'SLAVE_DIALOG'
  | 'VIDEO'
  | 'RESET'
  | 'REFRESH';
export interface ILargeScreenState {
  operationAction: IOperationAction;
  param?: {
    type?: string | number;
    showDaily?: boolean;
    data?: IVideoData[];
    map?: {
      mapShowType?: '2d' | '3d';
      showType?: string;

      options?: {
        center?: [number, number];
        bearing?: number;
        zoom?: number;
        pitch?: number;
      };

      isLock?: boolean;
    };
    dragParam?: Array<number>;
    stationFlag?: number;
    selected?: any;
    showHistory?: string;
    videoList?: any[];
  };
  removeKeep?: false;
  update?: string;

  // isInit?: boolean;
}

// 语音推送数据
export const audioControlModal = atom<IAudioControl>({
  key: 'audioControl_',
  default: {},
});

// 大屏推送数据
/**
 *  key和operationAction类型：
 *  CAPACITY-产能动态；
 *  POWER-能耗动态；
 *  JOB-今日作业计划；
 *  EUR-气井动态；
 *  JOB_DETAIL-今日作业计划明细；
 *  ALARM_STATIS-报警统计；
 *  FIRE-消防设施监控；
 *  TARGET-烟气指标；
 *  MET-气象信息；
 *  DEVICE_STATUS-设备状态；
 *  PERSON_STATIS-在厂人员；
 *  MAP-地图展示状态；
 *  SLAVE_DIALOG-分场站弹窗状态；
 *  VIDEO-视频
 *  RESET-重置大屏状态
 */
export const largeScreenModal = atom<{ [key: string]: ILargeScreenState }>({
  key: 'largeScreen_',
  default: {},
});

export const showDailyJobModal = atom<boolean | undefined>({
  key: 'showDailyJobModal_',
  default: undefined,
});

export const operationVideoListModal = atom<[]>({
  key: 'operationVideoListModal_',
  default: [],
});

export interface Operation {
  operationAreaId: string;
  operationType: string;
}

export const currentOperationModal = atom<Operation | null>({
  key: 'currentOperationModal_',
  default: null,
});

export const initFinshedModel = atom<boolean>({
  key: 'initFinshedModel_',
  default: false,
});
