'use client';
import defaultPng from '@/assets/montior/default.png';
import FAS from '@/assets/montior/FAS.png';
import GAS from '@/assets/montior/GAS.png';
import {
  alarmTypeModel,
  checkedAlarmIdsModel,
  currentAlarmModel,
  IAlarm,
  IAlarmDetail,
  ISuppData,
} from '@/models/alarm';
import { Box, Checkbox, Flex, Text } from '@chakra-ui/react';

import { request } from '@/utils/request';
import moment from 'moment';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

interface IProps {
  alarm: IAlarm;

  measureRef: any;
}
const getImg = (type: string) => {
  switch (type) {
    case 'FAS':
      return FAS;
    case 'GAS':
      return GAS;
    default:
      return defaultPng;
  }
};
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
  const imgSrc = currentType ? getImg(currentType.alarmType) : defaultPng;
  const alarmTypeName = currentType ? currentType.alarmTypeName : '';
  const isChecked = checkedAlarmIds.includes(alarmId);

  return (
    <Flex
      minH="25"
      mb="2.5"
      p="2.5"
      align="center"
      key={alarmId}
      borderRadius="10px"
      ref={measureRef}
      bg="pri.white.100"
      fontSize="lg"
      boxShadow=" 0px 3px 6px 1px rgba(119,140,162,0.1)"
      justify="flex-start"
      alignItems="center"
      borderWidth="1px"
      borderColor={isChecked ? 'pri.blue.100' : 'transparent'}
      _hover={{
        borderColor: 'pri.blue.100',
      }}
      onClick={getAlarmDetail}
      cursor="pointer"
    >
      <Flex onClick={(e) => e.stopPropagation()} alignItems="center">
        <Checkbox
          colorScheme="blue"
          isChecked={isChecked}
          cursor="pointer"
          onChange={handleAlarmCheck}
        />
      </Flex>

      {/* <Center w="10" h="10" borderRadius="50%" bg="pri.red.200" cursor="pointer">
        <Image src={imgSrc} alt={alarmTypeName} />
      </Center> */}

      <Box w="3" h="3" borderRadius="50%" ml="2.5" bg={getColor(alarmLevel)}></Box>
      <Flex flexDir="column" ml="2.5" w="62.5">
        <Text noOfLines={2} fontSize="16px" color="pri.dark.100">
          {/* {deptName} */}
          {alarmAreaName}
          {alarmAreaName === address ? '' : address}
        </Text>
        <Text noOfLines={1} fontSize="14px">
          {alarm.resourceNo}
        </Text>
        <Flex fontSize="14px" justify="space-between" align="center">
          <Text title={alarmTypeName} color="pri.blue.100" w="30">
            {alarmTypeName}
          </Text>
          <Box color="pri.dark.500">{moment(alarmLastTime).format('YY/MM/DD HH:mm:ss')}</Box>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ListItem;
