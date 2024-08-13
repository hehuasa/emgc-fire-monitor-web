'use client';
import { IAlarmDetail } from '@/models/alarm';
import { initPageData, IPageData } from '@/utils/publicData';
import { request, requestDownload } from '@/utils/request';
import { Box, Flex } from '@chakra-ui/react';
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
      url = `/cx-alarm/alm/alarmHistory/query?${param}`;
    } else {
      url = `/cx-alarm/alm/alarm/findMorePage?${param}`;
    }
    const { data, code } = await request<IPageData<IAlarmDetail>>({ url });
    if (code === 200) {
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
      ? '/cx-alarm/alm/alarmHistory/exportMore'
      : '/cx-alarm/alm/alarm/exportMore';
    await requestDownload({
      url: `${url}?${param}`,
      options: { name: `报警数据${date}.xlsx` },
    });
    setEportLoading(false);
  };

  return (
    <Flex h="full" flexDirection="column">
      <AlarmQuere
        handleSearch={handleSearch}
        exportFile={exportFile}
        exportLoading={exportLoading}
        methods={methods}
      />
      <Box flex="1" borderRadius="lg" p="4" bg="pri.gray.500" overflow="hidden">
        <AlarmTable data={data} isLoading={isLoading} getPage={getPage} />
      </Box>
    </Flex>
  );
};

export default AlarmQuery;
