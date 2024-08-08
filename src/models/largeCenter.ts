import { atom } from 'recoil';

// 气井历史数据据设备资源名称
export const resourceNameModel = atom<string>({
  key: 'resourceName_',
  default: '',
});

// 气井历史数据据设备场站标识
export const stationFlagModel = atom<string>({
  key: 'stationFlag_',
  default: '',
});

// 气井历史数据据设备id
export const deviceIdModel = atom<string>({
  key: 'deviceId_',
  default: '',
});

// 气井历史数据据子设备code
export const subDeviceCodeMoodel = atom<string>({
  key: 'subDeviceCode_',
  default: '',
});

// taskQueue
export const taskQueueModel = atom<any[]>({
  key: 'taskQueue_',
  default: [],
});

// page1
export const childPage1DataModel = atom<any | null>({
  key: 'childPage1Data_',
  default: null,
});

// page2
export const childPage2DataModel = atom<any | null>({
  key: 'childPage2Data_',
  default: null,
});

// page2
export const fireWaterDataModel = atom<any | null>({
  key: 'fireWaterData_',
  default: null,
});

// 天气历史记录
export const weaStationFlagModal = atom<any | null>({
  key: 'weaStationFlagModal_',
  default: null,
});
