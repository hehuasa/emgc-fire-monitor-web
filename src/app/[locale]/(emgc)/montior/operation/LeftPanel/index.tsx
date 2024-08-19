'use client';
import {
  alarmDepartmentModel,
  alarmFilterModel,
  alarmTypeModel,
  currentAlarmModel,
  currentAlarmStatusModel,
  foldModel,
  IAlarmHistory,
} from '@/models/alarm';
import { UpdateAlarmfnContext } from '@/models/map';
import { currentGpsInfoModel, currentGpsListModel, currentResModel } from '@/models/resource';
import { useMemoizedFn } from 'ahooks';
import dynamic from 'next/dynamic';
import { useContext, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import AlarmDealModal from './AlarmDeal';
import AlarmFilter from './AlarmFilter';
import GpsLocation from './GpsLocation';
import GpsLocationList from './GpsLocationList';
import { useTranslations } from 'next-intl';

const AlarmDetail = dynamic(() => import('./AlarmDetail'), { ssr: false });

const RessourceDetail = dynamic(() => import('./RessourceDetail'), { ssr: false });
const AlarmList = dynamic(() => import('./AlarmList'), { ssr: false });

const AlarmCharger = dynamic(() => import('@/components/Alarm/AlarmCharger'), { ssr: false });

const ItemButtonDefault = dynamic(() => import('./ItemButtons'), { ssr: false });

export interface IHisResData {
  current: number;
  size: number;
  records: IAlarmHistory[];
  total: number;
}

const LeftPanel = () => {
  const formatMessage = useTranslations("alarm");
  const [fold, setFold] = useRecoilState(foldModel);
  const alarmFilterShow = useRecoilValue(alarmFilterModel);
  const [currentAlarm, setCurrentAlarm] = useRecoilState(currentAlarmModel);
  const [currentRes, setCurrentRes] = useRecoilState(currentResModel);
  const [currentGpsList, setCurrentGpsList] = useRecoilState(currentGpsListModel);
  const [currentGpsInfo, setCurrentGpsInfo] = useRecoilState(currentGpsInfoModel);
  const [alarmType] = useRecoilState(alarmTypeModel);
  const alarmStatus = useRecoilValue(currentAlarmStatusModel);
  const alarmDepartment = useRecoilValue(alarmDepartmentModel);
  const { getAlalrmList, updateAlarmCluster } = useContext(UpdateAlarmfnContext);

  // 是否显示详情
  const showAlarmDetail = Boolean(currentAlarm);

  // 是否显示详情
  const showResDetail = Boolean(currentRes);

  useEffect(() => {
    if (currentAlarm) {
      setCurrentRes(null);
      setCurrentGpsInfo(null);
      setCurrentGpsList(null);
    }
  }, [currentAlarm]);

  useEffect(() => {
    if (currentRes) {
      setCurrentGpsInfo(null);
      setCurrentAlarm(null);
      setCurrentGpsList(null);
    }
  }, [currentRes]);

  useEffect(() => {
    if (currentGpsInfo) {
      setCurrentRes(null);
      setCurrentAlarm(null);
      setCurrentGpsList(null);
    }
  }, [currentGpsInfo]);

  useEffect(() => {
    if (currentGpsList) {
      setCurrentRes(null);
      setCurrentAlarm(null);
      setCurrentGpsInfo(null);
    }
  }, [currentGpsList]);

  const [showAlarmCharger, setshowAlarmCharger] = useState(false);

  const dealCallBack = useMemoizedFn(() => {
    //更新报警列表和聚合
    getAlalrmList?.({
      alarmDepartment_: alarmDepartment,
      alarmTypes_: alarmType.map((item) => item.alarmType).join(','),
      currentAlarmStatus_: alarmStatus,
    });
    updateAlarmCluster?.({
      alarmDepartment_: alarmDepartment,
      alarmTypes_: alarmType.map((item) => item.alarmType).join(','),
      currentAlarmStatus_: alarmStatus,
    });
  });

  return (
    <div
      className='absolute top-0 left-0 z-10 w-[400px] h-full bg-black/10 transition-[transform 0.15s] backdrop-blur-xl'

      style={{
        transform: `translateX(${fold ? '-100%' : '0'})`,
        padding: `${fold ? '5px' : '16px'}`

      }}


    >

      <div
        className='relative '
        style={{
          height: currentGpsInfo === null && currentGpsList === null
            ? 'calc(100% - 4.375rem)'
            : 'calc(100% )'
        }}

      >
        <div className="tooltip tooltip-right cursor-pointer absolute top-4 z-20  " data-tip={
          fold
            ? formatMessage('alarm-list-unfold')
            : formatMessage('alarm-list-fold')
        }
          style={{ right: fold ? '-34px' : '-43px', transition: 'left 0.2s ease-in-out' }}
        >
          <div
            className='hover:opacity-90 w-7 h-24'


            onClick={() => {
              setFold(!fold);
            }}

          />
        </div>

        <div className='absolute top-4 z-10 '
          style={{
            right: fold ? '-0.25rem' : '-1rem',
            transition: 'right 0.2s ease-in-out',
          }}
        >
          <svg viewBox="0 0 30 102.849" className='absolute top-0 left-0 w-7 h-24 fill-black/10'>
            <path d="M.002 102.849V0a37.545 37.545 0 0 0 14.8 21.6 36.345 36.345 0 0 1 11.045 12.739 36.65 36.65 0 0 1 3.071 8.136 37.351 37.351 0 0 1 1.083 8.952 37.363 37.363 0 0 1-1.083 8.954 36.649 36.649 0 0 1-3.071 8.137 36.342 36.342 0 0 1-11.045 12.74 37.56 37.56 0 0 0-14.8 21.591Z" />
          </svg>
          <svg viewBox="0 0 30 102.849" className='absolute top-0 left-0 w-7 h-24 fill-white' style={{
            transform: `${fold ? 'translateX(-12px) rotate(180deg)' : ''}`
          }}>
            <path

              d="m.574 52.581 9.665 9.559a1.93 1.93 0 1 0 2.714-2.744l-8.287-8.2 8.22-8.243a1.93 1.93 0 0 0-2.733-2.725L.569 49.839v.006H.563a1.917 1.917 0 0 0-.4.606c0 .008-.014.015-.015.023a1.929 1.929 0 0 0 .426 2.107Z"

            />
          </svg>

        </div>
        <AlarmList showDetail={showAlarmDetail || showResDetail} fold={fold} />
        {currentAlarm && <AlarmDetail fold={fold} />}
        {currentGpsInfo && <GpsLocation fold={fold} />}
        {currentRes && <RessourceDetail fold={fold} />}
        {currentGpsList && <GpsLocationList fold={fold} />}
      </div>
      {/* 按钮组 */}
      {
        currentGpsInfo === null && currentGpsList === null && (
          <ItemButtonDefault
            showAlarmDetail={showAlarmDetail}
            showResDetail={showResDetail}
            alarmStatus={alarmStatus}
            setShowAlarmCharger={setshowAlarmCharger}
          />
        )
      }

      {/* 场站负责人 */}
      {
        showAlarmCharger && currentAlarm && (
          <AlarmCharger
            alarmType={currentAlarm.alarmType}
            areaId={currentAlarm.alarmAreaId}
            handleClose={() => {
              setshowAlarmCharger(false);
            }}
          />
        )
      }
      {
        showAlarmCharger && currentRes && (
          <AlarmCharger
            areaId={currentRes.areaId}
            handleClose={() => {
              setshowAlarmCharger(false);
            }}
          />
        )
      }
      {/* 报警处理 */}
      <AlarmDealModal dealCallBack={dealCallBack} />

      {alarmFilterShow ? <AlarmFilter /> : null}
    </div >
  );
};

export default LeftPanel;
