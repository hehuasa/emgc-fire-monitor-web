'use client';
import { Box, Flex } from '@chakra-ui/react';
import Image from 'next/image';

import React, { useContext, useMemo, useRef, useState } from 'react';
import title from '@/assets/montior/title.png';
import {
  alarmTypeModel,
  alarmListModel,
  currentAlarmStatusModel,
  IAlarmStatus,
  IAlarmTypeItem,
  alarmFilterModel,
  alarmDepartmentModel,
} from '@/models/alarm';
import { useRecoilState, useRecoilValue } from 'recoil';

import useVirtual from 'react-cool-virtual';

import nodata from '@/assets/montior/nodata.png';
import ListItem from './ListItem';
import { MapSceneContext, UpdateAlarmfnContext } from '@/models/map';
import Link from 'next/link';
import { useMemoizedFn } from 'ahooks';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import './index.css'

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
  const alarmDepartment = useRecoilValue(alarmDepartmentModel);
  const alarmList = useRecoilValue(alarmListModel);

  const [alarmFilterShow, setAlarmFilterShow] = useRecoilState(alarmFilterModel);

  const alarmTypes = useRecoilValue(alarmTypeModel);

  const scene = useContext(MapSceneContext);

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
    if (scene) {
      updateAlarmCluster({
        alarmTypes_: alarmTypes_,
        currentAlarmStatus_: status,
        alarmDepartment_: alarmDepartment,
      });
    }

  };

  return (
    <div className='flex flex-col absolute h-full py-3.5 w-full rounded-xl bg-gray-50/80 overflow-hidden'

      style={{
        opacity: fold || showDetail ? 0 : 1,
        zIndex: fold || showDetail ? -1 : 1
      }}


    >
      <div className='px-3.5'>
        <div
          className='flex justify-between items-center mb-4'>
          <div
            className='flex gap-2 items-center'
          >
            <Image alt="title" src={title} />
            <div
              className='text-lg font-bold text-gray-900'>
              {formatMessage('alarm-list')}
              {`（${alarmList.length}  ${formatMessageBase('alarms')} ）`}
            </div>
          </div>
          <div >
            <Link
              className='flex gap-2 text-sm items-center cursor-pointer text-gray-900 hover:text-blue-700 fill-gray-900 hover:fill-blue-700'
              href="/emgc/montior/alarmQuery">
              <div>
                {formatMessageBase('more')}
              </div>
              <svg viewBox="0 0 9.91 10.737" className='-rotate-90 w-2 h-2'>
                <path d="M4.956 8.743 1.411 5.194A.829.829 0 0 0 .244 6.366l4.126 4.127a.825.825 0 0 0 1.172 0l4.126-4.127a.829.829 0 1 0-1.171-1.172Z" />
                <path d="M4.956 3.792 1.416.243A.829.829 0 0 0 .244 1.415L4.37 5.542a.825.825 0 0 0 1.172 0l4.126-4.126A.829.829 0 1 0 8.496.244Z" />
              </svg> </Link></div>
        </div>
        <div className='ps-4 pe-2.5 mb-2.5 py-2.5 rounded-lg shadow-md shadow-sky-200/10 bg-white' >
          <div className='flex justify-between items-center'>
            <div className='flex text-lg text-center rounded-3xl leading-10 bg-gray-300' >
              <div
                className={`w-32 h-10 cursor-pointer rounded-3xl
                   ${alarmStatus === '01' ? 'text-white' : 'text-gray-900'}
                    ${alarmStatus === '01' ? 'bg-primary' : ''}
                   `
                }
                onClick={() => {
                  handleAlarmSatausCheck('01', alarmTypes);
                }}
              >
                {formatMessage('alarm-undeal')}
              </div>
              <div
                className={`w-32 h-10 cursor-pointer rounded-3xl
                        ${alarmStatus === '02' ? 'text-white' : 'text-gray-900'}
                         ${alarmStatus === '02' ? 'bg-primary' : ''}
                        `
                }
                onClick={() => {
                  handleAlarmSatausCheck('02', alarmTypes);
                }}

              >
                {formatMessage('alarm-dealing')}
              </div>
            </div>
            <div className='tooltip tooltip-top' data-tip={formatMessage('alarm-filter')}>
              <div>
                {alarmFilterShow ? (
                  <svg viewBox="0 0 18 18" className='cursor-pointer w-4 h-4' onClick={() => setAlarmFilterShow(false)}>
                    <path
                      fill="#0078ec"
                      d="M76.916,144.83h10.44a1.178,1.178,0,0,0,0-2.3H76.916a1.178,1.178,0,0,0,0,2.3Zm0-5.362h10.44a1.178,1.178,0,0,0,0-2.3H76.916a1.178,1.178,0,0,0,0,2.3Zm.065-5.17H93.018a1.163,1.163,0,0,0,0-2.3H76.982a1.163,1.163,0,0,0,0,2.3ZM89.418,144.83,94,141l-4.582-3.83Zm3.6,2.872H76.982a1.163,1.163,0,0,0,0,2.3H93.018a1.163,1.163,0,0,0,0-2.3Z"
                      transform="translate(-76 -132)"
                    />
                  </svg>

                ) : (
                  <svg viewBox="0 0 18 18" className='cursor-pointer w-4 h-4' onClick={() => setAlarmFilterShow(true)} >
                    <path
                      d="M76.916,144.83H93.084a1.178,1.178,0,0,0,0-2.3H76.916a1.178,1.178,0,0,0,0,2.3Zm0-5.362H93.084a1.178,1.178,0,0,0,0-2.3H76.916a1.178,1.178,0,0,0,0,2.3Zm.065-5.17H93.018a1.163,1.163,0,0,0,0-2.3H76.982a1.163,1.163,0,0,0,0,2.3Zm16.036,13.4H76.982a1.163,1.163,0,0,0,0,2.3H93.018a1.163,1.163,0,0,0,0-2.3Z"
                      transform="translate(-76 -132)"
                    />
                  </svg>

                )}
              </div>
            </div>

          </div>
          <div className='flex justify-between text-base mt-4 text-slate-500' >
            <div className='flex items-center'>
              {formatMessage('alarm-startTime')}
              <SortIcon
                type="alarmFirstTime"
                toggleSort={toggleSort}
                sortCondision={sortCondision}
              />
            </div>
            <div className='flex items-center'>
              {formatMessage('alarm-level')}
              <SortIcon type="alarmLevel" toggleSort={toggleSort} sortCondision={sortCondision} />
            </div>
            <div className='flex items-center'>
              {formatMessage('alarm-endTime')}
              <SortIcon
                type="alarmLastTime"
                toggleSort={toggleSort}
                sortCondision={sortCondision}
              />
            </div>
          </div>
        </div>
      </div>

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
        <div
          className='flex-1 scrollbar overflow-y-auto'
          ref={(el) => {
            outerRef.current = el; // Set the element to the `outerRef`
            scrollRef.current = el; // Share the element for other purposes
          }}

        >
          <div
            className='alarm-list text-gray-900 w-[340px] ml-3.5'

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
          </div>
        </div>
      )}
    </div>
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
    <div className='flex flex-col'>
      <div
        className='flex cursor-pointer w-7 h-2.5 justify-center items-center clic'
        onClick={() => toggle('up')}
      >
        <div
          className='w-3 h-1.5'
          style={{
            background:
              sortCondision?.type === type && sortCondision?.sort === 'up'
                ? '#0369FF'
                : '#A8B4C2',

            clipPath: "polygon(0 100%, 50% 0, 100% 100%)"
          }}
        />
      </div>
      <div
        className='flex cursor-pointer w-7 h-2.5 justify-center items-center clic'
        onClick={() => toggle('down')}



      >
        <div
          className={`
            w-3 h-1.5
            `}
          style={{
            background:
              sortCondision?.type === type && sortCondision?.sort === 'down'
                ? '#0369FF'
                : '#A8B4C2',

            clipPath: "polygon(0 0, 50% 100%, 100% 0)"
          }}

        />
      </div>
    </div>
  );
};
