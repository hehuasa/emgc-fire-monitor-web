'use client';
// import defaultPng from '@/assets/montior/default.png';
// import FAS from '@/assets/montior/FAS.png';
// import GAS from '@/assets/montior/GAS.png';
import {
  alarmTypeModel,
  checkedAlarmIdsModel,
  currentAlarmModel,
  IAlarm,
  IAlarmDetail,
  ISuppData,
} from '@/models/alarm';


import { request } from '@/utils/request';
import { Checkbox } from 'antd';
import moment from 'moment';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

interface IProps {
  alarm: IAlarm;

  measureRef: unknown;
}
// const getImg = (type: string) => {
//   switch (type) {
//     case 'FAS':
//       return FAS;
//     case 'GAS':
//       return GAS;
//     default:
//       return defaultPng;
//   }
// };
const getColor = (level: IAlarm['alarmLevel']) => {
  switch (level) {
    case '00':
      return 'rgba(100, 179, 255, 1)';

    case '01':
      return 'rgba(253, 37, 37, 1)';
    case '02':
      return 'rgba(247, 162, 35, 1)';
    case '03':
      return 'rgba(255, 247, 0, 1)';

    default:
      return 'rgba(100, 179, 255, 1)';
  }
};
const ListItem = ({ alarm, measureRef }: IProps) => {
  const alarmTypes = useRecoilValue(alarmTypeModel);
  const [checkedAlarmIds, setCheckedAlarmIds] = useRecoilState(checkedAlarmIdsModel);
  const setCurrentAlarmDeatil = useSetRecoilState(currentAlarmModel);

  const { alarmId, address, alarmType, alarmLevel, alarmLastTime, deptName, alarmAreaName } = alarm;

  const handleAlarmCheck = () => {
    const checkedAlarmIdsCache = [...checkedAlarmIds];
    const index = checkedAlarmIdsCache.findIndex((val) => val === alarmId);
    if (index === -1) {
      checkedAlarmIdsCache.push(alarmId);
    } else {
      checkedAlarmIdsCache.splice(index, 1);
    }

    setCheckedAlarmIds(checkedAlarmIdsCache);
  };

  const getAlarmDetail = async () => {
    const res = await request<IAlarmDetail>({ url: `/cx-alarm/alm/alarm/find/${alarmId}` });
    if (res.code === 200) {
      console.log('res.data.suppData', res.data);
      const newSuppData: ISuppData[] = res.data.suppData.map((item, index) => {
        if (item.infoType !== 0) {
          const newItem = { ...item };
          const path =
            newItem.infoValue && newItem.infoValue !== '' && newItem.infoValue !== null
              ? new URL(newItem.infoValue)
              : {
                pathname: '',
              };
          const newImgUrl = '/minio' + path.pathname;
          newItem.infoValue = newImgUrl;

          return newItem;
        }
        return item;
      });

      const newCurrentAlarmDeatil = JSON.parse(
        JSON.stringify({
          ...res.data,
          suppData: newSuppData,
        })
      );

      console.log('debug-------3-------', newCurrentAlarmDeatil);
      setCurrentAlarmDeatil(newCurrentAlarmDeatil);
      // setCurrentAlarmDeatil(null);
      // requestAnimationFrame(() => {
      //   setCurrentAlarmDeatil(newCurrentAlarmDeatil);
      // });
    }
  };
  const currentType = alarmTypes.find((val) => val.alarmType === alarmType);
  // const imgSrc = currentType ? getImg(currentType.alarmType) : defaultPng;
  const alarmTypeName = currentType ? currentType.alarmTypeName : '';
  const isChecked = checkedAlarmIds.includes(alarmId);

  return (
    <div
      className={
        `min-h-[100px] mb-2.5 p-2.5 flex items-center rounded-xl text-lg justify-start border 
      ${isChecked ? 'border-primary' : 'border-primary/0'}
      cursor-pointer
    bg-white shadow-md 
    hover:border-primary`
      }

      key={alarmId}
      ref={measureRef}


      onClick={getAlarmDetail}
    >
      <div
        className='flex items-center'
        onClick={(e) => e.stopPropagation()}>
        <Checkbox

          checked={isChecked}

          onChange={handleAlarmCheck}
        />
      </div>

      {/* <Center w="10" h="10" borderRadius="50%" bg="pri.red.200" cursor="pointer">
        <Image src={imgSrc} alt={alarmTypeName} />
      </Center> */}

      <div className='w-3 h-3 rounded-full ml-2.5'
        style={{
          backgroundColor: getColor(alarmLevel)
        }}
      ></div>
      <div
        className='flex flex-col ml-2.5 w-[250px] text-gray-900'>
        <p
          className='text-base '
        >
          {/* {deptName} */}
          {alarmAreaName}
          {alarmAreaName === address ? '' : address}
        </p>
        <p
          className='text-sm '>
          {alarm.resourceNo}
        </p>
        <div className='flex justify-between items-center text-sm '>
          <div title={alarmTypeName} className='w-[120px] text-primary'>
            {alarmTypeName}
          </div>
          <div className='text-gray-500' >{moment(alarmLastTime).format('YY/MM/DD HH:mm:ss')}</div>
        </div>
      </div>
    </div>
  );
};

export default ListItem;
