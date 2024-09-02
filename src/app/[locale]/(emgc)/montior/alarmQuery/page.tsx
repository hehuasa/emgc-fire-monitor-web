'use client';
import { IAlarmDetail } from '@/models/alarm';
import { initPageData, IPageData } from '@/utils/publicData';
import { downloadRequest, request } from '@/utils/request';
import { useMemoizedFn, useMount, useSafeState } from 'ahooks';
import moment from 'moment';
import dynamic from 'next/dynamic';
import { stringify } from 'qs';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';

const AlarmTable = dynamic(() => import('./AlarmTable'), { ssr: false });
const AlarmQuere = dynamic(() => import('./AlarmQuere'), { ssr: false });

export interface IAlarmPageState {
  alarmTypes?: string;
  alarmAreaIds?: string;
  searchText?: string;
  alarmTimeStart?: string;
  status?: string;
  orgId?: string;
  alarmTimeEnd?: string;
}
const initState: IAlarmPageState = {
  alarmTypes: '',
  alarmAreaIds: '',
  alarmTimeStart: '',
  searchText: '',
  status: '01',
  orgId: '',
  alarmTimeEnd: '',
};
const AlarmQuery = () => {
  const paramObj = useRef<IAlarmPageState>(initState);
  const [exportLoading, setEportLoading] = useSafeState(false);
  const [isLoading, setLoading] = useSafeState(false);
  const [data, setData] = useSafeState<IPageData<IAlarmDetail>>(initPageData);
  const methods = useForm<IAlarmPageState>({
    defaultValues: {
      status: '01',
    },
  });
  const { getValues } = methods;
  const handleSearch = useMemoizedFn(async (e?: IAlarmPageState) => {
    setLoading(true);
    // if (e) {
    //   if (e.alarmTimeStart) {
    //     e.alarmTimeStart = moment(e.alarmTimeStart).format('YYYY-MM-DD HH:mm:ss');
    //   }
    //   if (e.alarmTimeEnd) {
    //     e.alarmTimeEnd = moment(e.alarmTimeEnd).format('YYYY-MM-DD HH:mm:ss');
    //   }
    //   if (e.searchText) {
    //     e.searchText = e.searchText.trim();
    //   }

    //   paramObj.current = e;
    // }

    await getPage(1, data.size);
  });

  const getPage = useMemoizedFn(async (current: number, size = 10) => {
    setLoading(true);
    const values = getValues();

    const formatStr = 'YYYY:MM:DD HH:mm:ss';
    if (values.alarmTimeStart) {
      values.alarmTimeStart = moment(values.alarmTimeStart).format(formatStr);
    }

    if (values.alarmTimeEnd) {
      values.alarmTimeEnd = moment(values.alarmTimeEnd).format(formatStr);
    }

    const param = stringify({
      //...paramObj.current,
      current,
      size,
      ...values,
    });
    let url = '';
    if (values.status === '03') {
      url = `/ms-gateway/cx-alarm/alm/alarmHistory/query?${param}`;
    } else {
      url = `/ms-gateway/cx-alarm/alm/alarm/findMorePage?${param}`;
    }
    const { data, code } = await request<IPageData<IAlarmDetail>>({ url });
    if (code === 200) {
      for (let i = 0; i < data.records.length; i++) {
        data.records[i].key = data.records[i].alarmAreaId;
      }
      setData(data);
    }
    setLoading(false);
  });

  useMount(() => {
    getPage(1);
  });

  //导出的时候 已处理和未处理接口不同
  const exportFile = async (isHistory: boolean) => {
    const values = getValues();

    setEportLoading(true);
    const param = stringify(
      {
        current: data.current,
        size: data.size,
        //...paramObj.current,
        ...values,
      },
      { indices: false }
    );
    const date = moment().format('YYYY-MM-DD HH:mm:ss');
    const url = isHistory
      ? '/ms-gateway/cx-alarm/alm/alarmHistory/exportMore'
      : '/ms-gateway/cx-alarm/alm/alarm/exportMore';
    await downloadRequest({
      url: `${url}?${param}`,
      options: { name: `报警数据${date}.xlsx` },
    });
    setEportLoading(false);
  };

  return (
    <div className="relative h-full w-full flex flex-col">
      <AlarmQuere
        handleSearch={handleSearch}
        exportFile={exportFile}
        exportLoading={exportLoading}
        methods={methods}
      />
      <div className="relative flex-1 p-4 bg-gray-100 overflow-hidden">
        <AlarmTable data={data} isLoading={isLoading} getPage={getPage} />
      </div>
    </div>
  );
};

export default AlarmQuery;
