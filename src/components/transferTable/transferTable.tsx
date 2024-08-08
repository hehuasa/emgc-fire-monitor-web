import {
  Box,
  Button,
  ButtonProps,
  FormControl,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  Text,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  ModalFooter,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { leftTableRowType } from './leftTable';
import { useMemoizedFn, useMount, useUnmount } from 'ahooks';
import { FormProvider, useForm } from 'react-hook-form';
import { useRecoilState, useRecoilValue } from 'recoil';
import { departmentData } from '@/models/userManage';
import { request } from '@/utils/request';
import { allDeviceListModel, deviceListModel, selectDeviceIdsModel } from '@/models/sms';
import CustomSelect from '@/components/CustomSelect';
import InstallTable, {
  Refs,
  tableRowType,
} from '@/app/(sms)/sms/infoPush/rule/component/installtionTable';
const LeftTable = dynamic(() => import('./leftTable'), { ssr: false });
const RightTable = dynamic(() => import('./rightTable'), { ssr: false });
const TreeSelect = dynamic(() => import('@/components/TreeSelect'), { ssr: false });

const ToolBtnStyle: ButtonProps = {
  size: 'sm',
};
const TransferTable = () => {
  const method = useForm();
  const {
    register,
    setValue,
    getValues,
    watch,
    formState: { errors },
    reset,
  } = method;
  const {
    isOpen: isOpenInstallation,
    onOpen: onOpenInstallation,
    onClose: onCloseInstallation,
  } = useDisclosure();
  const allDeviceList = useRecoilValue(allDeviceListModel);
  // const [leftTableView, setLeftTableView] = useState<IResItem[]>();
  const [leftTableData, setLeftTableData] = useRecoilState(deviceListModel);
  const [deviceIds, setDeviceIds] = useRecoilState(selectDeviceIdsModel);
  const [getTreeData, setTreeData] = useRecoilState(departmentData);
  const [majorsList, setMajors] = useState<Array<{ label: string; value: string }>>([]);
  const [majorDeviceData, setMajorDeviceData] = useState<Map<string, Array<leftTableRowType>>>(
    new Map()
  );

  const InstallTableRef = useRef<Refs | null>(null);

  useMount(() => {
    majorData();
    if (allDeviceList.length > 0) {
      setLeftTableData(allDeviceList);
    }
  });

  const majorData = useMemoizedFn(async () => {
    const { code, data } = await request({
      url: `/cx-alarm/device/manager/major_device`,
    });
    if (code == 200) {
      const map = new Map();
      const majorData: Array<{ label: string; value: string }> = [];
      Object.entries(data as object).forEach((item) => {
        majorData.push({
          label: item[0],
          value: item[0],
        });
        map.set(item[0], item[1]);
      });

      setMajors(majorData);

      setMajorDeviceData(map);
    }
  });

  const handleReset = useMemoizedFn(() => {
    reset({
      equipmentId: '',
      orgId: '',
      marjor: '',
    });
  });
  const handleSearch = useMemoizedFn(async () => {
    let params = {};
    if (getValues('orgId')) {
      params = Object.assign(params, {
        orgId: getValues('orgId'),
      });
    }
    if (getValues('marjor')) {
      params = Object.assign(params, {
        major: getValues('marjor'),
      });
    }
    if (getValues('equipmentId')) {
      params = Object.assign(params, {
        equipmentId: getValues('equipmentId'),
      });
    }

    if (getValues('installationName')) {
      params = Object.assign(params, {
        areaId: getValues('installationId'),
      });
    }

    const { code, data } = await request({
      url: `/cx-alarm/device/manager/list_device`,
      options: {
        method: 'post',
        body: JSON.stringify(params),
      },
    });
    if (code == 200) {
      setLeftTableData(data as unknown as leftTableRowType[]);
    }
  });
  useUnmount(() => {
    setLeftTableData([]);
    setDeviceIds([]);
  });

  const handlePushInstalltion = () => {
    const row: tableRowType | undefined = InstallTableRef.current?.submit();
    setValue('installationName', row?.areaName);
    setValue('installationId', row?.areaId);
    onCloseInstallation();
  };

  return (
    <>
      <FormProvider {...method}>
        <HStack justifyContent={'flex-start'} mt={2}>
          {process.env.NEXT_PUBLIC_ANALYTICS_Ms_type === 'yb' && (
            <>
              <FormControl>
                <HStack alignItems={'center'}>
                  <HStack>
                    <Box>部门：</Box>
                    <TreeSelect
                      w={'220px'}
                      h={8}
                      {...register('orgId')}
                      treeData={getTreeData}
                      placeholder={'请选择部门'}
                      ref={undefined}
                    ></TreeSelect>
                  </HStack>
                </HStack>
              </FormControl>
              <FormControl>
                <HStack alignItems={'center'}>
                  <Box>专业：</Box>
                  <Box w={'200px'}>
                    <CustomSelect
                      placeholder="请根据专业选择"
                      w="200px"
                      h={8}
                      {...register('marjor')}
                    >
                      {majorsList.map((marjor) => (
                        <option key={marjor.value} value={marjor.value}>
                          {marjor.label}
                        </option>
                      ))}
                    </CustomSelect>
                  </Box>
                </HStack>
              </FormControl>
            </>
          )}
          {process.env.NEXT_PUBLIC_ANALYTICS_Ms_type === 'zk' && (
            <>
              <FormControl>
                <HStack alignItems={'center'} py={1}>
                  <Box w={20} textAlign={'end'}>
                    装置:
                  </Box>
                  <Input
                    w={72}
                    borderRadius={'10px'}
                    h={8}
                    placeholder="请选择装置"
                    {...register('installationName')}
                    onClick={onOpenInstallation}
                  />
                </HStack>
              </FormControl>
            </>
          )}
          <FormControl>
            <HStack alignItems={'center'}>
              <Box>设备编号：</Box>
              <Box w={'200px'}>
                <Input h={8} placeholder="请输入设备编号" {...register('equipmentId')} />
              </Box>
            </HStack>
          </FormControl>
          <HStack>
            <Button colorScheme="gray" {...ToolBtnStyle} onClick={handleReset}>
              重置
            </Button>
            <Button colorScheme="blue" {...ToolBtnStyle} onClick={handleSearch}>
              查询
            </Button>
          </HStack>
        </HStack>
      </FormProvider>

      <HStack w={'full'} alignItems={'flex-start'} mt={2}>
        <Box w={'49%'} border={'1px solid'} borderRadius={'4px'} borderColor={'pri.gray.300'}>
          <LeftTable />
        </Box>
        <Box w={'49%'} border={'1px solid'} borderRadius={'4px'} borderColor={'pri.gray.300'}>
          <RightTable />
        </Box>
      </HStack>
      <Modal isOpen={isOpenInstallation} onClose={onCloseInstallation} size="2xl">
        <ModalOverlay></ModalOverlay>
        <ModalContent borderRadius={'10px'}>
          <ModalHeader
            h={12}
            py={2}
            fontWeight={'normal'}
            bg={'pri.gray.100'}
            borderTopLeftRadius={'10px'}
            borderTopRightRadius={'10px'}
          >
            <Text>装置列表</Text>
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody>
            <InstallTable ref={InstallTableRef} />
          </ModalBody>
          <ModalFooter>
            <HStack>
              <Button onClick={onCloseInstallation}>取消</Button>
              <Button colorScheme={'blue'} onClick={handlePushInstalltion}>
                确定
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default TransferTable;
