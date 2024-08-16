'use client';
import { Box, Flex, HStack, Tooltip } from '@chakra-ui/react';
import Image from 'next/image';

import React, { useContext, useMemo, useRef, useState } from 'react';
import title from '@/assets/montior/title.png';
import { MoreIcon } from '@/components/Icons';
import {
  alarmTypeModel,
  alarmListModel,
  currentAlarmStatusModel,
  IAlarmStatus,
  IAlarmTypeItem,
  alarmFilterModel,
  alarmDepartmentModel,
} from '@/models/alarm';
import { useRecoilState } from 'recoil';

import useVirtual from 'react-cool-virtual';

import nodata from '@/assets/montior/nodata.png';
import ListItem from './ListItem';
import { MapContext, UpdateAlarmfnContext } from '@/models/map';
import Link from 'next/link';
import { useMemoizedFn } from 'ahooks';
import { AlarmFilter, AlarmFilterChecked } from '@/components/Icons';
import moment from 'moment';
import { useTranslations } from 'next-intl';

interface ISortCondisionItem {
  type: 'alarmLevel' | 'alarmLastTime' | 'alarmFirstTime';
  sort: 'up' | 'down' | '';
}

interface IProps {
  fold: boolean;
  showDetail: boolean;
}

const AlarmList = ({ fold, showDetail }: IProps) => {
  const formatMessage = useTranslations("alarm");
  const formatMessageBase = useTranslations("base");

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [alarmStatus, setAlarmStatus] = useRecoilState(currentAlarmStatusModel);
  const [alarmDepartment, setAlarmDepartment] = useRecoilState(alarmDepartmentModel);
  const [alarmList, setAlarmList] = useRecoilState(alarmListModel);

  const [alarmFilterShow, setAlarmFilterShow] = useRecoilState(alarmFilterModel);

  const [alarmTypes, setAlarmTypes] = useRecoilState(alarmTypeModel);

  const map = useContext(MapContext);

  const { updateAlarmCluster, getAlalrmList } = useContext(UpdateAlarmfnContext);

  const { outerRef, innerRef, items } = useVirtual<HTMLDivElement, HTMLDivElement>({
    itemCount: alarmList.length,
    resetScroll: true,
    // useIsScrolling: true,
  });

  //重新排序的条件
  const [sortCondision, setSortdition] = useState<ISortCondisionItem>();

  const toggleSort = useMemoizedFn((data?: ISortCondisionItem) => {
    setSortdition(data);
  });

  //重新排序后的数据
  const sortAlarmList = useMemo(() => {
    if (sortCondision && sortCondision.sort) {
      const arr = [...alarmList].sort((a, b) => {
        if (sortCondision.type === 'alarmFirstTime') {
          const newADate = moment(a.alarmLastTime).valueOf();
          const newBDate = moment(b.alarmLastTime).valueOf();
          if (sortCondision.sort === 'up') {
            return newBDate - newADate;
          } else {
            return -(newBDate - newADate);
          }
        } else if (sortCondision.type === 'alarmLastTime') {
          const newADate = moment(a.alarmLastTime).valueOf();
          const newBDate = moment(b.alarmLastTime).valueOf();
          if (sortCondision.sort === 'up') {
            return newBDate - newADate;
          } else {
            return -(newBDate - newADate);
          }
        } else {
          const newA = +a.alarmLevel;
          const newB = +b.alarmLevel;
          if (sortCondision.sort === 'up') {
            return newB - newA;
          } else {
            return -(newB - newA);
          }
        }
      });
      return arr;
    }
    return alarmList;
  }, [alarmList, sortCondision]);

  const handleAlarmSatausCheck = (status: IAlarmStatus, alarmTypes: IAlarmTypeItem[]) => {
    setAlarmStatus(status);

    let alarmTypes_ = '';
    const newG = alarmTypes.filter((val) => val.isChecked);
    for (const [index, { alarmType }] of newG.entries()) {
      alarmTypes_ += index < newG.length - 1 ? `${alarmType},` : `${alarmType}`;
    }

    getAlalrmList({
      alarmTypes_: alarmTypes_,
      currentAlarmStatus_: status,
      alarmDepartment_: alarmDepartment,
    });
    map &&
      updateAlarmCluster({
        alarmTypes_: alarmTypes_,
        currentAlarmStatus_: status,
        alarmDepartment_: alarmDepartment,
      });
  };

  return (
    <Flex
      position="absolute"
      flexDir="column"
      h="full"
      py="3.5"
      w="full"
      opacity={fold || showDetail ? 0 : 1}
      zIndex={fold || showDetail ? -1 : 1}
      borderRadius="10px"
      backgroundColor="pri.gray.600"
      overflowY="auto"
    >
      <Box px="3.5">
        <Flex mb="4" justify="space-between" align="center">
          <HStack>
            <Image alt="title" src={title} />
            <Box fontSize="lg" fontWeight="bold" color="pri.dark.100">
              {formatMessage('alarm-list')}
              {`（${alarmList.length}  ${formatMessageBase('alarms')} ）`}
            </Box>
          </HStack>
          <HStack
            cursor="pointer"
            fill="pri.dark.500"
            color="pri.dark.500"
            _hover={{ color: 'pri.blue.100', fill: 'pri.blue.100' }}
          >
            <Box>
              <Link
                href="/emgc/montior/alarmQuery"
              //href="/emgc/montior/stationManager"
              //href="/emgc/montior/alarmSwitch"
              //href="/emgc/montior/jobSafety"
              //href="/emgc/jobSafety"
              //href="/emgc/montior/cameraDeviceManagement"
              //href="/emgc/montior/equipmentLocationManagement"
              >
                {formatMessageBase('more')}
              </Link>
            </Box>
            <MoreIcon w="2" h="2" transform="rotate(-90deg)" />
          </HStack>
        </Flex>
        <Box
          //h={groupFold ? '15' : `${Math.ceil(alarmTypes.length / 3) * 2 + 0.75 + 3.75}rem`}
          py="2.5"
          ps="4"
          pe="2.5"
          mb="2.5"
          backgroundColor="pri.white.100"
          borderRadius="10px"
          boxShadow="0px 3px 6px 1px rgba(119,140,162,0.1)"
        >
          <Flex justify="space-between" align="center">
            <Flex
              lineHeight="40px"
              fontSize="lg"
              textAlign="center"
              bg={'pri.gray.300'}
              borderRadius="20px"
            >
              <Box
                onClick={() => {
                  handleAlarmSatausCheck('01', alarmTypes);
                }}
                w="35"
                h="10"
                color={alarmStatus === '01' ? 'pri.white.100' : 'pri.dark.100'}
                cursor="pointer"
                borderRadius="20px"
                bg={alarmStatus === '01' ? 'pri.blue.100' : ''}
              >
                {formatMessage('alarm-undeal')}
              </Box>
              <Box
                onClick={() => {
                  handleAlarmSatausCheck('02', alarmTypes);
                }}
                w="35"
                h="10"
                color={alarmStatus === '02' ? 'pri.white.100' : 'pri.dark.100'}
                cursor="pointer"
                borderRadius="20px"
                bg={alarmStatus === '02' ? 'pri.blue.100' : ''}
              >
                {formatMessage('alarm-dealing')}
              </Box>
            </Flex>
            <Tooltip label={formatMessage('alarm-filter')} placement="right">
              <Box>
                {alarmFilterShow ? (
                  <AlarmFilterChecked cursor="pointer" />
                ) : (
                  <AlarmFilter cursor="pointer" onClick={() => setAlarmFilterShow(true)} />
                )}
              </Box>
            </Tooltip>
          </Flex>
          <Flex justifyContent="space-between" fontSize="16px" color="#778CA2" mt="15px">
            <Flex alignItems="center">
              {formatMessage('alarm-startTime')}
              <SortIcon
                type="alarmFirstTime"
                toggleSort={toggleSort}
                sortCondision={sortCondision}
              />
            </Flex>
            <Flex>
              {formatMessage('alarm-level')}
              <SortIcon type="alarmLevel" toggleSort={toggleSort} sortCondision={sortCondision} />
            </Flex>
            <Flex>
              {formatMessage('alarm-endTime')}
              <SortIcon
                type="alarmLastTime"
                toggleSort={toggleSort}
                sortCondision={sortCondision}
              />
            </Flex>
          </Flex>
        </Box>
      </Box>

      {alarmList.length === 0 ? (
        <Flex
          w="85"
          h="50"
          bg="pri.white.100"
          boxShadow="0px 3px 6px 1px rgba(119,140,162,0.1)"
          borderRadius="10px"
          flexDir="column"
          justify="center"
          align="center"
          flex={1}
          ml="3.5"
        >
          <Image
            width={154}
            height={124}
            src={nodata}
            alt={formatMessage('alarm-nodata')}
          />
          <Box fontSize="lg" color="pri.dark.500">
            {formatMessage('alarm-nodata')}
          </Box>
        </Flex>
      ) : (
        <Box
          flex={1}
          overflow="overlay"
          ref={(el) => {
            outerRef.current = el; // Set the element to the `outerRef`
            scrollRef.current = el; // Share the element for other purposes
          }}
          layerStyle="scrollbarStyle"
        >
          <Box
            color="font.100"
            w="85"
            ml="3.5"
            ref={(el) => {
              innerRef.current = el; // Set the element to the `outerRef`
              scrollRef.current = el; // Share the element for other purposes
            }}
          >
            {items.map(({ index, measureRef }) => {
              // Use the `measureRef` to measure the item size
              const item = sortAlarmList[index];
              if (!item) {
                return null;
              }

              return (
                <ListItem
                  key={item.alarmId}
                  alarm={item}
                  measureRef={measureRef}
                // openAlarmDeal={openAlarmDeal}
                />
              );
            })}
          </Box>
        </Box>
      )}
    </Flex>
  );
};

export default AlarmList;

type ItemSort = 'up' | 'down' | '';

interface Props {
  type: ISortCondisionItem['type'];
  toggleSort: (data?: ISortCondisionItem) => void;
  sortCondision?: ISortCondisionItem;
}

const SortIcon = ({ type, toggleSort, sortCondision }: Props) => {
  const toggle = useMemoizedFn((sort_: ItemSort) => {
    if (sort_ === sortCondision?.sort && type === sortCondision.type) {
      toggleSort(undefined);
    } else {
      toggleSort({ type, sort: sort_ });
    }
  });

  return (
    <Flex flexDirection="column">
      <Flex
        onClick={() => toggle('up')}
        cursor="pointer"
        w="30px"
        h="10px"
        justify="center"
        alignItems="center"
      >
        <Box
          w="12px"
          h="6px"
          bg={
            sortCondision?.type === type && sortCondision?.sort === 'up'
              ? 'pri.blue.100'
              : 'pri.dark.500'
          }
          clipPath="polygon(0 100%, 50% 0, 100% 100%)"
        />
      </Flex>
      <Flex
        onClick={() => toggle('down')}
        cursor="pointer"
        w="30px"
        h="10px"
        justify="center"
        alignItems="center"
      >
        <Box
          w="12px"
          h="6px"
          bg={
            sortCondision?.type === type && sortCondision?.sort === 'down'
              ? 'pri.blue.100'
              : 'pri.dark.500'
          }
          clipPath="polygon(0 0, 50% 100%, 100% 0)"
        />
      </Flex>
    </Flex>
  );
};
