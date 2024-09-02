import {
  alarmDealTypeModel,
  alarmTypeModel,
  checkedAlarmIdsModel,
  currentAlarmModel,
  dealAlarmModalVisibleModal,
  IAlarmDetail,
} from '@/models/alarm';

import CustomSelect from '@/components/CustomSelect';
import { IArea } from '@/models/map';
import { DCItem } from '@/models/system';
import { flatMenuModel } from '@/models/user';
import { request } from '@/utils/request';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Textarea,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { FeatureCollection, Polygon } from '@turf/turf';
import { useMemoizedFn, useSafeState } from 'ahooks';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useRecoilState, useRecoilValue } from 'recoil';
import Table from './table';
import { useTranslations } from 'next-intl';

export interface IResultItem {
  address: string;
  alarmFirstTime: string;
  alarmFrequency: number;
  alarmLastTime: string;
  alarmLevelName: string;
  alarmNo: string;
  alarmTypeName: string;
  dealResultName: string;
  areaName: string;
}

interface IEventForm {
  incidentAddress: string;
  incidentName: string;
  incidentType: string;
  incidentTime: string;
  incidentIspoison: string;
  incidentTrap: string;
  incidentIsbomb: string;
  incidentIscasualty: string;
  incidentTendency: string;
  incidentUseMeasure: string;
  incidentCause: string;
  incidentResourceName: string;
  incidentDeath: string;
  incidentDisappear: string;
  incidentInjured: string;
}

interface Props {
  dealCallBack?: () => void;
}

const AlarmDeal = ({ dealCallBack }: Props) => {
  const [buttonIsLoading, setButtonLoading] = useSafeState(false);
  const alarmDealTypes = useRecoilValue(alarmDealTypeModel);
  const formatMessage = useTranslations('alarm');
  const [dealResult, setprocessResult] = useSafeState<string>('02');
  const [alarmType] = useRecoilState(alarmTypeModel);
  const flatMenus = useRecoilValue(flatMenuModel);
  const route = useRouter();

  const [incidentType, setIncidentType] = useSafeState<DCItem[]>([]);

  const toast = useToast();
  const [dealExplain, setdealExplain] = useSafeState<string>('');
  const [currentAlarm, setCurrentAlarm] = useRecoilState(currentAlarmModel);
  const [checkedAlarmIds, setCheckedAlarmIds] = useRecoilState(checkedAlarmIdsModel);
  const { isOpen: resultIsOpen, onOpen: resultOnOpen, onClose: resultOnClose } = useDisclosure();
  const [dealAlarmVisible, setDealAlarmVisible] = useRecoilState(dealAlarmModalVisibleModal);
  const [tabIndex, setTabIndex] = useSafeState(0);

  const methods = useForm<IEventForm>({
    defaultValues: {
      incidentAddress: '',
      incidentName: '',
      incidentType: '',
      incidentTime: '',
      incidentIspoison: '0',
      incidentTrap: '0',
      incidentIsbomb: '0',
      incidentIscasualty: '0',
    },
  });
  const {
    register,
    getValues,
    setValue,
    formState: { errors, isSubmitted },
    handleSubmit,
    reset,
    control,
  } = methods;

  //获取事件类型
  const getTncidentType = async () => {
    const { data, code } = await request<DCItem[]>({
      url: `/cx-scws/dc_dict/list_item?dictCode=incident_type`,
    });
    if (code === 200) {
      setIncidentType(data);
    }
  };

  useEffect(() => {
    if (dealAlarmVisible.visible && currentAlarm) {
      setValue('incidentAddress', currentAlarm.address);
      setValue('incidentName', currentAlarm.address + currentAlarm.alarmTypeName);
      //setValue('incidentType', currentAlarm.alarmType);
      setValue('incidentTime', currentAlarm.alarmFirstTime);
      getTncidentType();
    }
  }, [dealAlarmVisible.visible]);

  //处理结果数据
  const [resultData, setResultData] = useSafeState<IResultItem[]>([]);

  // 单个报警处理
  const commitAlarm = async (currentAlarm: IAlarmDetail) => {
    setButtonLoading(true);
    const url = '/cx-alarm/alm/alarm/dealAlarm';
    const res = await request<IResultItem[]>({
      url,
      options: {
        method: 'post',
        body: JSON.stringify({
          alarmId: currentAlarm.alarmId,
          dealExplain,
          dealResult,
          dealType: '01',
          submit: true,
        }),
      },
    });
    dealAlarmOnClose();

    if (res.code !== 200) {
      toast({
        title: res.msg,
        status: 'warning',
        position: 'top',

        duration: 2000,
        isClosable: true,
      });
    } else {
      toast({
        title: '操作成功',
        status: 'success',
        position: 'top',

        duration: 2000,
        isClosable: true,
      });
      setResultData(res.data);
      resultOnOpen();
      updateAlarm();
    }
    setButtonLoading(false);
  };

  const commitMutiAlarms = async (checkedAlarmIds: string[]) => {
    setButtonLoading(true);
    const url = '/cx-alarm/alm/alarm/dealAlarmBatch';
    const res = await request<IResultItem[]>({
      url,
      options: {
        method: 'post',
        body: JSON.stringify({
          alarmIds: checkedAlarmIds,
          dealExplain,
          dealResult,
          submit: true,
        }),
      },
    });
    dealAlarmOnClose();

    if (res.code !== 200) {
      toast({
        title: res.msg,
        status: 'warning',
        position: 'top',

        duration: 2000,
        isClosable: true,
      });
    } else {
      toast({
        title: '操作成功',
        status: 'success',
        position: 'top',
        duration: 2000,
        isClosable: true,
      });
      setResultData(res.data);
      resultOnOpen();
      setCheckedAlarmIds([]);
      updateAlarm();
    }
    setButtonLoading(false);
  };

  // 处理报警通过区域
  const handleAlarmDealByArea = async (areaId: string) => {
    setButtonLoading(true);
    const url = '/cx-alarm/alm/alarm/dealAlarmByArea';

    //判断是否是多楼层 多楼层需要传入所有楼层的id,
    const otherFloor = await request({ url: `/cx-alarm/dc/area/areaMap/floors?areaId=${areaId}` });
    const areaMapRes = otherFloor as unknown as FeatureCollection<Polygon, IArea>;

    const alarmAreaId = [areaId];
    if (areaMapRes?.features) {
      areaMapRes?.features.forEach((item) => alarmAreaId.push(item.properties.areaId));
    }

    const res = await request<IResultItem[]>({
      url,
      options: {
        method: 'post',
        body: JSON.stringify({
          alarmAreaId: alarmAreaId.join(','),
          dealExplain,
          dealResult,
          //是否保存 true保存 false暂存
          submit: true,
        }),
      },
    });
    dealAlarmOnClose();

    if (res.code !== 200) {
      toast({
        title: res.msg,
        status: 'warning',
        position: 'top',
      });
    } else {
      toast({
        title: '操作成功',
        status: 'success',
        position: 'top',
      });
      setResultData(res.data);
      resultOnOpen();
      updateAlarm();
    }
    setButtonLoading(false);
  };

  const modalClose = useMemoizedFn(() => {
    setprocessResult('02');
    setdealExplain('');
    reset();
    setTabIndex(0);
    setCurrentAlarm(null);
  });

  const dealAlarmOnClose = useMemoizedFn(() => {
    setDealAlarmVisible({ visible: false });
  });

  const dealResultOnClose = useMemoizedFn(() => {
    setResultData([]);
  });

  const creatEvent = useMemoizedFn(async (e) => {
    setButtonLoading(true);
    const { code, data, msg } = await request<string>({
      url: `/cx-scws/incident/create`,
      options: {
        method: 'post',
        body: JSON.stringify({
          ...e,
          alarmId: currentAlarm?.alarmId,
          orgId: currentAlarm?.deptId,
          areaId: currentAlarm?.alarmAreaId,
          incidentTime: moment(e.incidentTime).format('YYYY-MM-DD HH:mm:ss'),
        }),
      },
    });
    if (code === 200) {
      toast({
        title: '操作成功' || msg,
        position: 'top',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      dealAlarmOnClose();

      updateAlarm();

      //如果有应急指挥权限，跳转至应急指挥
      const hasAuth = !!flatMenus.find((item) => item.functionCode === '2003');
      if (hasAuth) {
        route.push(`/command/onePicture?eventId=${data}&areaId=${currentAlarm?.alarmId}`);
      }
    } else {
      toast({ title: msg, position: 'top', status: 'error', duration: 2000, isClosable: true });
    }
    setButtonLoading(false);
  });

  const dealAlarm = useMemoizedFn(() => {
    //
    const areaId = dealAlarmVisible.param?.currentAreaClusterData.areaId;

    if (areaId) {
      handleAlarmDealByArea(areaId);
    } else {
      if (currentAlarm) {
        commitAlarm(currentAlarm);
      } else {
        commitMutiAlarms(checkedAlarmIds);
      }
    }
  });

  const updateAlarm = useMemoizedFn(() => {
    dealCallBack?.();
  });

  return (
    <>
      <Modal
        size="3xl"
        isCentered
        isOpen={dealAlarmVisible.visible}
        onClose={dealAlarmOnClose}
        onCloseComplete={modalClose}
      >
        <ModalOverlay />
        <ModalContent borderRadius="10px">
          <ModalHeader
            borderTopRadius="10px"
            py="0"
            textAlign="left"
            lineHeight="2.75rem"
            fontSize="lg"
            bg="pri.gray.100"
          >
            {formatMessage('alarm-deal')}
          </ModalHeader>
          <ModalCloseButton h="11" top="0" lineHeight="2.75rem" />
          <ModalBody bg="pri.white.100" px="0" py="0">
            <Tabs variant="enclosed" index={tabIndex} onChange={setTabIndex}>
              <TabList borderRadius={0}>
                <Tab borderRadius={0}>{formatMessage('alarm.close')}</Tab>

                {/* 批量处理暂时不显示升级成事件 */}
                {currentAlarm ? (
                  <Tab borderRadius={0} isDisabled={!currentAlarm}>
                    {formatMessage('alarm-toEvent')}
                  </Tab>
                ) : null}
              </TabList>
              <TabPanels>
                <TabPanel>
                  <HStack
                    minH="12"
                    bg="pri.gray.500"
                    mb="2.5"
                    px="2.5"
                    borderRadius="10px"
                    borderWidth="1px"
                    borderColor="pri.gray.200"
                  >
                    <Box w="22" whiteSpace="nowrap">
                      *{formatMessage('alarm-deal-result')}:
                    </Box>
                    <RadioGroup px="4" value={dealResult} onChange={setprocessResult}>
                      {alarmDealTypes.map((item) => {
                        return (
                          <Radio
                            bg="pri.white.100"
                            borderWidth="1px"
                            borderColor="pri.dark.600"
                            key={item.id}
                            value={item.value}
                            px="2"
                          >
                            {item.cnName}
                          </Radio>
                        );
                      })}
                    </RadioGroup>
                  </HStack>
                  <Textarea
                    value={dealExplain}
                    onChange={(e) => {
                      setdealExplain(e.target.value);
                    }}
                    placeholder={formatMessage('alarm.remark.tips')}
                    borderRadius="10px"
                  />
                </TabPanel>
                <TabPanel>
                  <FormProvider {...methods}>
                    <HStack
                      minH="12"
                      bg="pri.gray.500"
                      mb="2.5"
                      px="2.5"
                      ml="0px"
                      borderRadius="10px"
                      borderWidth="1px"
                      borderColor="pri.gray.200"
                      spacing={0}
                    >
                      <Box color="pri.red.100" w="80px" whiteSpace="nowrap">
                        *{formatMessage('alarm.deal.result')}:
                      </Box>
                      <RadioGroup value="1" px={4}>
                        <Radio
                          bg="pri.white.100"
                          borderWidth="1px"
                          borderColor="pri.dark.600"
                          value="1"
                        >
                          生成新事件
                        </Radio>
                      </RadioGroup>
                    </HStack>

                    <FormControl mt={0} isRequired isInvalid={!!errors.incidentAddress}>
                      <HStack
                        minH="12"
                        bg="pri.gray.500"
                        mb="2.5"
                        px="2.5"
                        borderRadius="10px"
                        borderWidth="1px"
                        borderColor="pri.gray.200"
                        spacing={0}
                      >
                        <Box w="80px" whiteSpace="nowrap">
                          *事发位置:
                        </Box>
                        <Input
                          flex={1}
                          border="none"
                          _hover={{}}
                          {...register('incidentAddress', { required: '请输入事发位置' })}
                        />
                      </HStack>
                      <FormErrorMessage mb={2} pl="120px">
                        {errors.incidentAddress?.message}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl mt={0} isRequired isInvalid={!!errors.incidentName}>
                      <HStack
                        minH="12"
                        bg="pri.gray.500"
                        mb="2.5"
                        px="2.5"
                        borderRadius="10px"
                        borderWidth="1px"
                        borderColor="pri.gray.200"
                        spacing={0}
                      >
                        <Box w="80px" whiteSpace="nowrap">
                          *事件名称:
                        </Box>
                        <Input
                          flex={1}
                          border="none"
                          _hover={{}}
                          {...register('incidentName', { required: '请输入事发位置' })}
                        />
                      </HStack>
                      <FormErrorMessage mb={2} pl="120px">
                        {errors.incidentName?.message}
                      </FormErrorMessage>
                    </FormControl>
                    <HStack
                      minH="12"
                      bg="pri.gray.500"
                      mb="2.5"
                      px="2.5"
                      borderRadius="10px"
                      borderWidth="1px"
                      borderColor="pri.gray.200"
                      alignItems="center"
                    >
                      <Box flex={1}>
                        <FormControl mt={0} isRequired isInvalid={!!errors.incidentType}>
                          <Flex alignItems="center">
                            <Box w="80px" whiteSpace="nowrap">
                              * 事件类型:
                            </Box>
                            <CustomSelect
                              flex={1}
                              border="none"
                              _hover={{}}
                              {...register('incidentType', { required: '请选择事件类型' })}
                              mr={1}
                              placeholder="请选择事件类型"
                            >
                              {incidentType.map((item) => (
                                <option value={item.value} key={item.id}>
                                  {item.cnName}
                                </option>
                              ))}
                            </CustomSelect>
                          </Flex>
                          <FormErrorMessage mb={2} pl="120px">
                            {errors.incidentType?.message}
                          </FormErrorMessage>
                        </FormControl>
                      </Box>
                      <Box w="1px" h="30px" bg="pri.gray.200" />
                      <Box flex={1}>
                        <FormControl mt={0} isRequired isInvalid={!!errors.incidentTime}>
                          <Flex alignItems="center">
                            <Box w="80px" whiteSpace="nowrap">
                              *事发时间:
                            </Box>
                            <Input
                              flex={1}
                              border="none"
                              _hover={{}}
                              {...register('incidentTime', { required: '请选择事发事件' })}
                              type="datetime-local"
                            />
                          </Flex>
                          <FormErrorMessage mb={2} pl="120px">
                            {errors.incidentTime?.message}
                          </FormErrorMessage>
                        </FormControl>
                      </Box>
                    </HStack>
                    <HStack
                      minH="12"
                      bg="pri.gray.500"
                      mb="2.5"
                      px="2.5"
                      borderRadius="10px"
                      borderWidth="1px"
                      borderColor="pri.gray.200"
                      alignItems="center"
                    >
                      <Box flex={1}>
                        <FormControl mt={0} isRequired>
                          <Flex alignItems="center">
                            <Box w="80px" whiteSpace="nowrap">
                              有无中毒:
                            </Box>
                            <Box flex={1} px={4}>
                              <Controller
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                  <RadioGroup mr={1} onChange={onChange} value={value}>
                                    <Stack direction="row">
                                      <Radio value="1">有</Radio>
                                      <Radio value="0">无</Radio>
                                    </Stack>
                                  </RadioGroup>
                                )}
                                name="incidentIspoison"
                              />
                            </Box>
                          </Flex>
                        </FormControl>
                      </Box>
                      <Box w="1px" h="30px" bg="pri.gray.200" />
                      <Box flex={1}>
                        <FormControl mt={0} isRequired>
                          <Flex alignItems="center">
                            <Box w="80px" whiteSpace="nowrap">
                              有无被困:
                            </Box>
                            <Box flex={1} px={4}>
                              <Controller
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                  <RadioGroup onChange={onChange} value={value}>
                                    <Stack direction="row">
                                      <Radio value="1">有</Radio>
                                      <Radio value="0">无</Radio>
                                    </Stack>
                                  </RadioGroup>
                                )}
                                name="incidentTrap"
                              />
                            </Box>
                          </Flex>
                          <FormErrorMessage mb={2} pl="120px">
                            {(errors as unknown as any).incidentTime?.message}
                          </FormErrorMessage>
                        </FormControl>
                      </Box>
                    </HStack>
                    <HStack
                      minH="12"
                      bg="pri.gray.500"
                      mb="2.5"
                      px="2.5"
                      borderRadius="10px"
                      borderWidth="1px"
                      borderColor="pri.gray.200"
                      alignItems="center"
                    >
                      <Box flex={1}>
                        <FormControl mt={0} isRequired>
                          <Flex alignItems="center">
                            <Box w="80px" whiteSpace="nowrap">
                              有无爆炸:
                            </Box>
                            <Box flex={1} px={4}>
                              <Controller
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                  <RadioGroup mr={1} onChange={onChange} value={value}>
                                    <Stack direction="row">
                                      <Radio value="1">有</Radio>
                                      <Radio value="0">无</Radio>
                                    </Stack>
                                  </RadioGroup>
                                )}
                                name="incidentIsbomb"
                              />
                            </Box>
                          </Flex>
                        </FormControl>
                      </Box>
                      <Box w="1px" h="30px" bg="pri.gray.200" />
                      <Box flex={1}>
                        <FormControl mt={0} isRequired>
                          <Flex alignItems="center">
                            <Box w="80px" whiteSpace="nowrap">
                              有无伤亡:
                            </Box>
                            <Box flex={1} px={4}>
                              <Controller
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                  <RadioGroup onChange={onChange} value={value}>
                                    <Stack direction="row">
                                      <Radio value="1">有</Radio>
                                      <Radio value="0">无</Radio>
                                    </Stack>
                                  </RadioGroup>
                                )}
                                name="incidentIscasualty"
                              />
                            </Box>
                          </Flex>
                        </FormControl>
                      </Box>
                    </HStack>
                    <HStack
                      minH="12"
                      bg="pri.gray.500"
                      mb="2.5"
                      px="2.5"
                      borderRadius="10px"
                      borderWidth="1px"
                      borderColor="pri.gray.200"
                      alignItems="center"
                    >
                      <Box flex={1}>
                        <FormControl mt={0}>
                          <Flex alignItems="center">
                            <Box w="80px" whiteSpace="nowrap">
                              死亡人数:
                            </Box>
                            <Box flex={1} px={4}>
                              <Input
                                type="number"
                                border="none"
                                mr={1}
                                {...register('incidentDeath')}
                              />
                            </Box>
                          </Flex>
                        </FormControl>
                      </Box>
                      <Box w="1px" h="30px" bg="pri.gray.200" />
                      <Box flex={1}>
                        <FormControl mt={0}>
                          <Flex alignItems="center">
                            <Box w="80px" whiteSpace="nowrap">
                              受伤人数:
                            </Box>
                            <Box flex={1} px={4}>
                              <Input
                                type="number"
                                border="none"
                                mr={1}
                                {...register('incidentInjured')}
                              />
                            </Box>
                          </Flex>
                        </FormControl>
                      </Box>
                    </HStack>
                    <FormControl mt={0}>
                      <HStack
                        minH="12"
                        bg="pri.gray.500"
                        mb="2.5"
                        px="2.5"
                        borderRadius="10px"
                        borderWidth="1px"
                        borderColor="pri.gray.200"
                        spacing={0}
                      >
                        <Box whiteSpace="nowrap">事件发展趋势:</Box>
                        <Input
                          flex={1}
                          border="none"
                          _hover={{}}
                          {...register('incidentTendency')}
                          placeholder="请输入事件发展趋势"
                        />
                      </HStack>
                    </FormControl>
                    <FormControl mt={0}>
                      <HStack
                        minH="12"
                        bg="pri.gray.500"
                        mb="2.5"
                        px="2.5"
                        borderRadius="10px"
                        borderWidth="1px"
                        borderColor="pri.gray.200"
                        spacing={0}
                      >
                        <Box whiteSpace="nowrap">事件已采取措施:</Box>
                        <Input
                          flex={1}
                          border="none"
                          _hover={{}}
                          {...register('incidentUseMeasure')}
                          placeholder="请输入事件已采取措施"
                        />
                      </HStack>
                    </FormControl>
                    <FormControl mt={0}>
                      <HStack
                        minH="12"
                        bg="pri.gray.500"
                        mb="2.5"
                        px="2.5"
                        borderRadius="10px"
                        borderWidth="1px"
                        borderColor="pri.gray.200"
                        spacing={0}
                      >
                        <Box whiteSpace="nowrap">事发原因:</Box>
                        <Input
                          flex={1}
                          border="none"
                          _hover={{}}
                          {...register('incidentCause')}
                          placeholder="请输入事发原因"
                        />
                      </HStack>
                    </FormControl>
                    <FormControl mt={0}>
                      <HStack
                        minH="12"
                        bg="pri.gray.500"
                        mb="2.5"
                        px="2.5"
                        borderRadius="10px"
                        borderWidth="1px"
                        borderColor="pri.gray.200"
                        spacing={0}
                      >
                        <Box whiteSpace="nowrap">报警设备:</Box>
                        <Input
                          flex={1}
                          border="none"
                          _hover={{}}
                          {...register('incidentResourceName')}
                          placeholder="请输入报警设备"
                        />
                      </HStack>
                    </FormControl>
                  </FormProvider>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>

          <ModalFooter justifyContent="flex-end">
            {tabIndex === 0 ? (
              <Button
                fontWeight="400"
                px="6"
                borderRadius="20px"
                bg="pri.blue.100"
                color="pri.white.100"
                onClick={dealAlarm}
                isLoading={buttonIsLoading}
              >
                {formatMessage('commit')}
              </Button>
            ) : (
              <Button
                fontWeight="400"
                px="6"
                borderRadius="20px"
                bg="pri.blue.100"
                color="pri.white.100"
                onClick={handleSubmit(creatEvent)}
                isLoading={buttonIsLoading}
              >
                {formatMessage('commit')}
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        size="3xl"
        isCentered
        isOpen={resultIsOpen}
        onClose={resultOnClose}
        onCloseComplete={dealResultOnClose}
      >
        <ModalOverlay />
        <ModalContent maxW="1200px" maxH="full" overflow="auto" borderRadius="10px">
          <ModalHeader
            borderTopRadius="10px"
            py="0"
            textAlign="left"
            lineHeight="2.75rem"
            fontSize="lg"
            bg="pri.gray.100"
          >
            {formatMessage('alarm.deal')}
          </ModalHeader>
          <ModalCloseButton h="11" top="0" lineHeight="2.75rem" />
          <ModalBody bg="pri.white.100" px="0" py="0" borderBottomRadius="10px">
            <Table data={resultData} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AlarmDeal;
