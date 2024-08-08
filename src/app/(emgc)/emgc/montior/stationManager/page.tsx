'use client';
import { Box, Button, Flex, FormControl, FormLabel, useDisclosure, HStack } from '@chakra-ui/react';
import Table from './Table';
import Edit from './Edit';
import { useMemoizedFn, useMount, useSafeState } from 'ahooks';
import { request } from '@/utils/request';
import { useForm, FormProvider } from 'react-hook-form';
import CustomSelect from '@/components/CustomSelect';

import { IAlarmTypeItem } from '@/models/alarm';
import { useRef } from 'react';
import dynamic from 'next/dynamic';
import { stringify } from 'qs';
import { IPageData, initPageData } from '@/utils/publicData';
import { IArea } from '@/models/map';
import { depTreeModal } from '@/models/global';
import { useRecoilValue } from 'recoil';

const TreeSelect = dynamic(() => import('@/components/Montior/TreeSelect'), { ssr: false });

export interface IResponsiblePerson {
  alarmType: string;
  alarmTypeName: string;
  areaId: string;
  areaName: string;
  chargeId: null;
  chargeName: string;
  chargePhone: string;
  deptId: string;
  deptName: null;
  id: string;
}

export interface FormItem {
  alarmType: string;
  deptId: string;
  areaId: string;
}

const Page = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [alarmType, setAlarmType] = useSafeState<IAlarmTypeItem[]>([]);
  const depTree = useRecoilValue(depTreeModal);

  const [areaList, setAreaList] = useSafeState<IArea[]>([]);
  const [tableLoading, setTableLoading] = useSafeState(false);
  const [itemInfo, setItemInfo] = useSafeState<IResponsiblePerson>();
  const methods = useForm<FormItem>({
    defaultValues: {},
  });
  const { handleSubmit, register, resetField, reset } = methods;

  const [data, setData] = useSafeState<IPageData<IResponsiblePerson>>(initPageData);

  const keyPrama = useRef<Partial<FormItem>>({});

  const getData = useMemoizedFn(async (current: number, size = 10) => {
    setTableLoading(true);
    const obj = {
      size,
      current,
      ...keyPrama.current,
    };
    const str = stringify(obj);
    const { code, data, msg } = await request<IPageData<IResponsiblePerson>>({
      url: `/cx-alarm/dc/areaCharge/findPage?${str}`,
    });
    if (code === 200) {
      setData(data);
    }
    setTableLoading(false);
  });

  const getAlarmTypes = () => {
    request<IAlarmTypeItem[]>({ url: '/cx-alarm/alm/alarm/getAlarmType' }).then((res) => {
      if (res.code === 200) {
        setAlarmType(res.data);
      }
    });
  };

  useMount(() => {
    getAlarmTypes();
    getArea();
    getData(1);
  });

  const search = (e: FormItem) => {
    keyPrama.current = e;
    getData(1);
  };

  const resetSearch = useMemoizedFn(() => {
    reset();
    keyPrama.current = {};
    getData(1);
  });

  //获取区域
  const getArea = useMemoizedFn(async () => {
    const obj = {
      size: 1000,
      //deptId: getLeftDepId(),
    };
    const str = stringify(obj, { skipNulls: true });
    const res = await request<IPageData<IArea>>({ url: `/cx-alarm/dc/area/page?${str}` });
    if (res.code === 200) {
      setAreaList(res.data.records);
    }
  });

  const del = useMemoizedFn(async (id: string) => {
    const res = await request<IPageData<IArea>>({
      url: `/cx-alarm/dc/areaCharge/delete`,
      options: {
        method: 'delete',
        body: JSON.stringify([id]),
      },
    });
    getData(1);
  });

  return (
    <Box h="100%" p="20px">
      <FormProvider {...methods}>
        <Box flex={1}>
          <Flex flexWrap="wrap">
            <FormControl mr="28px" mb="20px" alignItems="center" w="auto">
              <Flex alignItems="center">
                <FormLabel mb={0} mr={0} display="flex" w="90px">
                  部门：
                </FormLabel>

                <TreeSelect
                  placeholder="请选择部门"
                  data={depTree}
                  {...register('deptId')}
                  w="260px"
                  ref={undefined}
                  allNodeCanSelect
                  h="36px"
                />
              </Flex>
            </FormControl>
            <FormControl mr="28px" mb="20px" alignItems="center" w="auto">
              <Flex alignItems="center">
                <FormLabel mb={0} mr={0} display="flex" w="90px">
                  区域：
                </FormLabel>

                <CustomSelect placeholder="请选择区域" {...register('areaId')} w="260px" h="36px">
                  <>
                    {areaList.map((item) => (
                      <option key={item.areaId} value={item.areaId}>
                        {item.areaName}
                      </option>
                    ))}
                  </>
                </CustomSelect>
              </Flex>
            </FormControl>
            <FormControl mr="28px" mb="20px" alignItems="center" w="auto">
              <Flex alignItems="center">
                <FormLabel mb={0} mr={0} display="flex" w="90px">
                  报警类型：
                </FormLabel>

                <CustomSelect
                  placeholder="请选择报警类型"
                  {...register('alarmType')}
                  w="260px"
                  h="36px"
                >
                  {alarmType.map((item) => (
                    <option value={item.alarmType} key={item.alarmType}>
                      {item.alarmTypeName}
                    </option>
                  ))}
                </CustomSelect>
              </Flex>
            </FormControl>
            <HStack alignItems="flex-start">
              <Button onClick={handleSubmit(search)} h="36px">
                搜索
              </Button>
              <Button onClick={resetSearch} h="36px">
                重置
              </Button>
              <Button onClick={onOpen} h="36px">
                新增负责人
              </Button>
            </HStack>
          </Flex>
        </Box>
      </FormProvider>
      <Table
        del={del}
        setItemInfo={setItemInfo}
        eidtOnOpen={onOpen}
        data={data}
        getData={getData}
        tableLoading={tableLoading}
      />
      <Edit
        isOpen={isOpen}
        onClose={onClose}
        alarmType={alarmType}
        areaList={areaList}
        depTree={depTree}
        itemInfo={itemInfo}
        setItemInfo={setItemInfo}
        getData={getData}
        data={data}
      />
    </Box>
  );
};

export default Page;
