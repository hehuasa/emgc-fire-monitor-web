'use client';

import selectedPng from '@/assets/montior/selected.png';
import { IOritreeData } from '@/components/Montior/Tree';
import {
  alarmDepartmentModel,
  alarmFilterModel,
  alarmTypeModel,
  currentAlarmStatusModel,
  IAlarmStatus,
  IAlarmTypeItem,
} from '@/models/alarm';
import { MapContext, UpdateAlarmfnContext, UpdateAlarmListParam } from '@/models/map';
import { IDepartment } from '@/models/system';
import { request } from '@/utils/request';
import { Box, Checkbox, Flex, SimpleGrid, Text, Tooltip, useOutsideClick } from '@chakra-ui/react';
import { useMemoizedFn, useSafeState } from 'ahooks';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useContext, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

const TreeSelect = dynamic(() => import('@/components/Montior/TreeSelect'), { ssr: false });

const AlarmFilter = () => {
  const formatMessage = useTranslations("base");
  const [alarmTypes, setAlarmTypes] = useRecoilState(alarmTypeModel);
  const alarmStatus = useRecoilValue(currentAlarmStatusModel);

  const [alarmDepartment, setAlarmDepartment] = useRecoilState(alarmDepartmentModel);
  const setAlarmFilterShow = useSetRecoilState(alarmFilterModel);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [depTree, setDepTree] = useSafeState<IOritreeData[]>([]);

  const map = useContext(MapContext);

  const { getAlalrmList, updateAlarmCluster } = useContext(UpdateAlarmfnContext);

  const methods = useForm();
  const { register, setValue } = methods;

  useOutsideClick({
    ref: containerRef,
    handler: () => {
      setAlarmFilterShow(false);
    },
  });

  // useMount(() => {
  //   getDepartment();
  //   setValue('deptId', alarmDepartment);
  // });

  const handleCheckAll = useMemoizedFn((e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    let newTypes: IAlarmTypeItem[] = [];
    if (checked) {
      newTypes = alarmTypes.map((item) => ({ ...item, isChecked: true }));
    } else {
      newTypes = alarmTypes.map((item) => ({ ...item, isChecked: false }));
    }
    setAlarmTypes([...newTypes]);
    let alarmTypes_ = '';
    for (const [index, { alarmType, isChecked }] of newTypes.entries()) {
      if (isChecked) {
        alarmTypes_ += index < newTypes.length - 1 ? `${alarmType},` : `${alarmType}`;
      }
    }
    updateAlarmListAndCluster({
      alarmTypes_,
      currentAlarmStatus_: alarmStatus,
      alarmDepartment_: alarmDepartment,
    });
  });

  //更新报警列表和地图上的报警数据
  const updateAlarmListAndCluster = useMemoizedFn(
    ({ alarmDepartment_, alarmTypes_, currentAlarmStatus_ }: UpdateAlarmListParam) => {
      getAlalrmList({
        alarmTypes_,
        currentAlarmStatus_,
        alarmDepartment_,
      });

      updateAlarmCluster({
        alarmTypes_,
        currentAlarmStatus_,
        alarmDepartment_,
      });
    }
  );

  const handleAlarmFilter = (item: IAlarmTypeItem, index: number, status: IAlarmStatus) => {
    const alarmTypesCache = [];

    for (const iterator of alarmTypes) {
      alarmTypesCache.push({ ...iterator });
    }
    alarmTypesCache[index].isChecked = !item.isChecked;

    setAlarmTypes([...alarmTypesCache]);

    let alarmTypes_ = '';
    const newG = alarmTypesCache.filter((val) => val.isChecked);

    for (const [index, { alarmType }] of newG.entries()) {
      alarmTypes_ += index < newG.length - 1 ? `${alarmType},` : `${alarmType}`;
    }

    updateAlarmListAndCluster({
      alarmTypes_,
      currentAlarmStatus_: status,
      alarmDepartment_: alarmDepartment,
    });
  };

  //获取部门
  const getDepartment = useMemoizedFn(async () => {
    const res = await request<IDepartment[]>({ url: '/ms-system/org/list-org-tree' });

    if (res.code === 200) {
      const fn = (list: IDepartment[]) => {
        const data: IOritreeData[] = [];
        for (const item of list) {
          if (item.children && item.children.length) {
            data.push({
              name: item.orgName,
              id: item.id,
              children: fn(item.children),
            });
          } else {
            data.push({
              name: item.orgName,
              id: item.id,
            });
          }
        }
        return data;
      };

      const newData = fn(res.data);
      setDepTree(newData);
    }
  });

  const treeOnSelect = useMemoizedFn((id: string) => {
    setAlarmDepartment(id);
    updateAlarmListAndCluster({
      alarmTypes_: alarmTypes
        .filter((item) => item.isChecked)
        .map((item) => item.alarmType)
        .join(','),
      currentAlarmStatus_: alarmStatus,
      alarmDepartment_: id,
    });
  });

  return (
    <Box
      w="325px"
      position="absolute"
      right="-40px"
      top="80px"
      transform="translateX(100%)"
      h="calc(100% - 80px)"
      layerStyle="scrollbarStyle"
      overflowY="auto"
    >
      <Box
        ref={containerRef}
        bg="#fff"
        p={2}
        boxShadow="0px 3px 6px 1px rgba(0,0,0,0.16)"
        borderRadius="2"
      >
        <Box fontSize="16px" fontWeight="bold">
          {formatMessage({ id: 'alarm.type' })}
        </Box>
        <Box>
          <Flex mt={2}>
            <Text mr={2}>{formatMessage({ id: 'selectAll' })}</Text>
            <Checkbox
              onChange={handleCheckAll}
              isChecked={alarmTypes.every((item) => item.isChecked)}
              isIndeterminate={
                alarmTypes.every((item) => item.isChecked)
                  ? false
                  : alarmTypes.some((item) => item.isChecked)
              }
            />
          </Flex>
          <SimpleGrid columns={3} spacingY="2.5" mt="2.5">
            {alarmTypes.map((item, index) => {
              return (
                <Tooltip
                  label={item.alarmTypeName?.length > 4 ? item.alarmTypeName : ''}
                  placement="top"
                  key={item.alarmType}
                >
                  <Box
                    onClick={() => {
                      handleAlarmFilter(item, index, alarmStatus);
                    }}
                    cursor="pointer"
                    color={item.isChecked ? 'pri.blue.100' : 'pri.dark.500'}
                    position="relative"
                    bg={item.isChecked ? '#E5EBF2' : ''}
                    mr={index % 3 === 2 ? '0px' : '12px'}
                    h="36px"
                    lineHeight={'36px'}
                    textAlign="center"
                    userSelect="none"
                  >
                    {item.alarmTypeName?.length > 4
                      ? item.alarmTypeName.slice(0, 4) + '...'
                      : item.alarmTypeName}
                    {item.isChecked && (
                      <Box position="absolute" bottom={0} right={0}>
                        <Image alt="title" src={selectedPng} />
                      </Box>
                    )}
                  </Box>
                </Tooltip>
              );
            })}
          </SimpleGrid>
        </Box>
        {/* <Box my={2} fontSize="16px" fontWeight="bold">
          {formatMessage({ id: 'dp' })}
        </Box> */}
        {/* <FormProvider {...methods}>
          <TreeSelect
            placeholder="请选择部门"
            data={depTree}
            w="300px"
            {...register('deptId')}
            ref={undefined}
            allNodeCanSelect
            onSelect={(e) => treeOnSelect(e[0])}
          />
        </FormProvider> */}
      </Box>
    </Box>
  );
};

export default AlarmFilter;
