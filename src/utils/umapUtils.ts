import { IAlarm } from '@/models/alarm';

export const genUmapIcons = (alarmList: IAlarm[]) => {
  const array = [];

  for (const alarm of alarmList) {
    const { alarmId, alarmType, alarmLevel, coordinate } = alarm;
    if (coordinate) {
      array.push({
        alarmId: alarmId,
        coords: {
          type: coordinate.type,
          lng: coordinate.coordinates[0],
          lat: coordinate.coordinates[1],
          height: coordinate.coordinates[2] || 3 + Math.ceil(Math.random() * 10),
        },
        alarmType: alarmType || '',
        alarmLevel: alarmLevel || '09',
        screenType: '01', // 1 屏幕图标  2 世界图标
      });
    }
  }

  return array;
};
