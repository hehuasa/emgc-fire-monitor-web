import CustomSelect from '@/components/CustomSelect';
import TransferTable from '@/components/transferTable/transferTable';
import { allDeviceListModel, selectDeviceIdsModel } from '@/models/sms';
import { deviceProperty } from '@/models/system';
import { request } from '@/utils/request';
import { AddIcon, SearchIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  FormControl,
  HStack,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
  useDisclosure,
  Text,
  InputGroup,
  InputRightElement,
  useToast,
  Center,
} from '@chakra-ui/react';
import { useMemoizedFn, useMount } from 'ahooks';
import { FormItem } from 'amis';
import React, { useRef, useState } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { useRecoilState } from 'recoil';

const Add = (props: any) => {
  const toast = useToast();
  const [deviceIds, setDeviceIds] = useRecoilState(selectDeviceIdsModel);
  const [allDeviceData, setAllDeviceData] = useRecoilState(allDeviceListModel);
  const method = useForm();
  const { register, setValue, getValues, control } = method;
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'monitor',
  });
  const pointData = useRef<{
    resourceName: string;
    resourceNo: string;
    iotSubDeviceId: string;
    deviceId: string;
    resourceId: string;
  }>();

  const [propertyList, setPropertyList] = useState<deviceProperty[]>([]);

  useMount(() => {
    if (props.edit) {
      console.log('编辑', props.data);
      getPropertyList(props.data.iotDeviceId, props.data.iotSubDeviceId);
      setValue('pointes', props.data.resourceName);
      pointData.current = {
        resourceName: props.data.resourceName,
        resourceNo: props.data.resourceNo,
        iotSubDeviceId: props.data.iotSubDeviceId,
        deviceId: props.data.iotDeviceId,
        resourceId: props.data.resourceId,
      };

      props.data.monitor.forEach((d: any) => {
        append({
          ...d,
        });
      });
    } else {
      append({
        thresholdLevel: '',
        thresholdProperty: '',
        thresholdStart: null,
        thresholdEnd: null,
      });
    }
  });
  const handleChangePoint = useMemoizedFn(() => {
    //
    onOpen();
  });

  const handleDelete = useMemoizedFn((index: number) => {
    remove(index);
  });
  const handleAddGroup = useMemoizedFn(() => {
    //
    append({
      thresholdLevel: '',
      thresholdProperty: '',
      thresholdStart: null,
      thresholdEnd: null,
    });
  });

  const handleAddPoint = useMemoizedFn(() => {
    // 点位添加
    // const interlockDeviceData = getValues(`interlockGroupBos.${currentItemIndex}.interlockDeviceBos`);
    const deviceDataList = allDeviceData.filter((device) => deviceIds.includes(device.id));
    const pointTableData = deviceDataList.map((device) => {
      return {
        resourceName: device.resourceName,
        resourceNo: device.resourceNo,
        iotSubDeviceId: device.iotSubDeviceId,
        deviceId: device.iotDeviceId,
        resourceId: device.id,
      };
    });
    console.log('点位添加', pointTableData);
    if (pointTableData.length) {
      setValue('pointes', pointTableData[0].resourceName);
      pointData.current = pointTableData[0];
      getPropertyList(pointData.current.deviceId, pointData.current.iotSubDeviceId);
    }

    onClose();
  });

  const handleClosePoint = useMemoizedFn(() => {
    onClose();
  });

  const getPropertyList = useMemoizedFn(async (deviceId: string, subDeviceCode?: string) => {
    const { code, data } = await request<deviceProperty[]>({
      url: `/device-manger/product_property/query_device_or_sub_device_property?deviceId=${deviceId}&subDeviceCode=${subDeviceCode}`,
    });
    if (code === 200) {
      setPropertyList(data);
    }
  });

  const handleSubmit = useMemoizedFn(async () => {
    const params = {
      iotDeviceId: pointData.current?.deviceId,
      iotSubDeviceId: pointData.current?.iotSubDeviceId,
      monitor: getValues('monitor'),
      resourceId: pointData.current?.resourceId,
      resourceNo: pointData.current?.resourceNo,
    };

    if (props.edit) {
      Object.assign(params, {
        id: props.data.id,
      });
    }

    const { code, msg } = await request({
      url: props.edit ? `/cx-alarm/alm/alarm_monitor/update` : `/cx-alarm/alm/alarm_monitor/add`,
      options: {
        method: 'post',
        body: JSON.stringify(params),
      },
    });
    if (code == 200) {
      toast({
        title: props.edit ? '修改成功' : '新增成功',
        position: 'top',
        duration: 1000,
        status: 'success',
      });
    } else {
      toast({
        title: msg,
        position: 'top',
        duration: 1000,
        status: 'error',
      });
    }

    closeDialog();
    // 刷新
    props.onAction(null, { actionType: 'reload', target: 'crud' });
  });

  const closeDialog = useMemoizedFn(() => {
    props.onAction(null, { actionType: 'cancel', componentId: 'u:f513da49400e' });
  });

  return (
    <>
      <VStack w={'full'} pb={5}>
        <FormProvider {...method}>
          <FormControl isRequired>
            <HStack>
              <Box w={20}>点位选择：</Box>
              <InputGroup w={'50'}>
                <Input placeholder="请选择点位" {...register('pointes')}></Input>
                <InputRightElement>
                  <Icon cursor={'pointer'} as={SearchIcon} onClick={handleChangePoint}></Icon>
                </InputRightElement>
              </InputGroup>
            </HStack>
          </FormControl>
          <Card w={'full'}>
            <CardBody w={'full'}>
              <VStack>
                {fields.map((item, index) => (
                  <HStack key={index} justifyContent={'space-between'} w={'full'}>
                    <HStack>
                      <HStack justifyContent={'center'}>
                        <Box color={'red'}>*</Box>
                        <Box w={20}>告警级别：</Box>
                      </HStack>
                      <Input
                        placeholder="请输入告警级别"
                        {...register(`monitor.${index}.thresholdLevel`)}
                      ></Input>
                    </HStack>
                    <HStack>
                      <HStack justifyContent={'center'}>
                        <Box color={'red'}>*</Box>
                        <Box w={20}>判断属性：</Box>
                      </HStack>
                      <CustomSelect
                        w={34}
                        placeholder="请选择判断属性"
                        {...register(`monitor.${index}.thresholdProperty`)}
                      >
                        {propertyList.map((v) => (
                          <option key={v.id} value={v.fieldCode}>
                            {v.fieldName}
                          </option>
                        ))}
                      </CustomSelect>
                    </HStack>
                    <HStack>
                      <Box w={20}>阈值范围：</Box>
                      <HStack>
                        <Input
                          w={32}
                          placeholder="请输入起始阈值"
                          type="number"
                          {...register(`monitor.${index}.thresholdStart`)}
                        ></Input>
                        <span>-</span>
                        <Input
                          w={32}
                          placeholder="请输入结束阈值"
                          type="number"
                          {...register(`monitor.${index}.thresholdEnd`)}
                        ></Input>
                      </HStack>
                    </HStack>
                    <Box
                      fontSize={'sm'}
                      color={'pri.gray.800'}
                      cursor={'pointer'}
                      onClick={() => handleDelete(index)}
                    >
                      <span>删除</span>
                    </Box>
                  </HStack>
                ))}
                {fields.length == 0 && <Center>暂无数据</Center>}
              </VStack>
            </CardBody>
          </Card>
        </FormProvider>

        <HStack
          justifyContent={'center'}
          alignItems={'center'}
          borderWidth={'1px'}
          borderStyle={'dashed'}
          borderColor={'pri.gray.800'}
          w={'full'}
          px={4}
          py={2}
          mt={2}
          borderRadius={4}
          cursor={'pointer'}
          onClick={handleAddGroup}
        >
          <Icon as={AddIcon}></Icon>
          <Box>添加</Box>
        </HStack>
        <ButtonGroup position={'absolute'} bottom={0} right={3} p={2.5}>
          <Button size={'md'} colorScheme="gray" onClick={closeDialog}>
            取消
          </Button>
          <Button size={'md'} onClick={handleSubmit} colorScheme="blue">
            确定
          </Button>
        </ButtonGroup>
      </VStack>
      <Modal isOpen={isOpen} onClose={handleClosePoint} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontWeight={'normal'}>
            <Text>点位选择</Text>
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody>
            <TransferTable />
          </ModalBody>
          <ModalFooter>
            <ButtonGroup>
              <Button colorScheme="gray" onClick={handleClosePoint}>
                取消
              </Button>
              <Button colorScheme="blue" onClick={handleAddPoint}>
                确定
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default FormItem({
  type: 'my-threshold-add',
  autoVar: true,
})(Add);
