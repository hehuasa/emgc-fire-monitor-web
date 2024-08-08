import { atom } from 'recoil';

export interface IAlarm {
  alarmId: string; // 报警id
  alarmIds: Array<string>;
  alarmFirstTime: string; // 开始时间
  alarmLastTime: string; // 结束时间
  address: string; // 报警具体位置
  alarmType: string; // 报警类型
  alarmUserId: string;
  alarmTypeName: string;
  firstAlarm: boolean;
  alarmLevelRefer: string;
  cellId: string;
}

export const currentAlarmIdsModel = atom<Array<string> | []>({
  key: 'currentAlarmIds_qs_largeScreen',
  default: [],
});

export const currentAlarmTypeModel = atom<string | null>({
  key: 'currentAlarmType_qs_largeScreen',
  default: null,
});

export const lastUpdateAlarmTimeModel = atom<number>({
  key: 'lastUpdateAlarmTime_qs_largeScreen',
  default: 0,
});
