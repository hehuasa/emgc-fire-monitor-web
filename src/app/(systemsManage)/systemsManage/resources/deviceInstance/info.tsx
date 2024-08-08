import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  Box,
  ModalFooter,
  HStack,
  FormControl,
  Flex,
  FormLabel,
  Input,
  FormErrorMessage,
  useToast,
  Tooltip,
} from '@chakra-ui/react';
import Loading from '@/components/Loading/Spin';
import { useMemoizedFn, useSafeState, useUnmount } from 'ahooks';
import { request } from '@/utils/request';
import { useEffect, useRef } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import Select from '@/components/CustomSelect';
import dynamic from 'next/dynamic';
import { deviceInfoType } from '@/models/product';

const Chart = dynamic(() => import('./chart'), { ssr: false });

interface Props {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  deviceInfo: deviceInfoType;
}

// 0:执行中,1:执行成功,2:执行失败

function statusRes(status: 0 | 1 | 2) {
  switch (status) {
    case 0:
      return '执行中';
    case 1:
      return '执行成功';
    case 2:
      return '执行失败';
    default:
      return '';
  }
}

interface IFuncList {
  describe: string;
  funcName: string;
  id: string;
  operationVos: {
    funcId: string;
    funcParamMarkBo: {
      describe: string;
      label: string;
      optionalParameters: { label: string; value: string }[];
      paramPath: string;
      paramType: string;
      subDeviceMark: true;
    }[];
    functionCode: string;
    id: string;
    productId: null;
    protocolFun: { protocol: string; modBusFun: { functionCode: '6'; offset: 124; value: 555 } };
    resultCode: '';
    waitForResult: false;
  }[];
  lastRecordVo: {
    deviceId: string;
    errorMessage: string;
    metaFunId: string;
    operationId: null;
    param: null;
    status: 0 | 1 | 2;
    token: string;
  };
  productId: string;
  sub: true;
  systemRead: false;
}

interface IProperty {
  describe: string;
  fieldCode: string;
  fieldName: string;
  precision: null;
  time: null;
  unit: string;
  value: string;
}

const Info = ({ isOpen, onOpen, onClose, deviceInfo }: Props) => {
  const metaFunId = useRef('');
  const [funcList, setFuncList] = useSafeState<IFuncList[]>([]);
  const { isOpen: carryIsOpen, onOpen: carryOnOpen, onClose: carryOnClose } = useDisclosure();
  const [propertyList, setPropertyList] = useSafeState<IProperty[]>([]);
  const addMethods = useForm();
  const toast = useToast();
  const timer = useRef<NodeJS.Timer>();
  const {
    register: addRegister,
    getValues: addGetValues,
    setValue: addSetValue,
    reset,
    formState: { errors },
    handleSubmit,
    control,
  } = addMethods;

  const { fields, append, replace, remove } = useFieldArray({
    control,
    name: 'config',
  });

  useEffect(() => {
    console.log('deviceInfodeviceInfo', deviceInfo);
    if (isOpen && deviceInfo?.id) {
      if (timer.current) {
        clearInterval(timer.current);
      }
      getPoperty(deviceInfo.id);
      getFuc(deviceInfo.id);
      timer.current = setInterval(() => {
        getPoperty(deviceInfo.id!);
        getFuc(deviceInfo.id);
      }, 5000);
    }
    if (!isOpen) {
      clearInterval(timer.current);
    }
  }, [deviceInfo, isOpen]);

  useUnmount(() => {
    if (timer.current) {
      clearInterval(timer.current);
    }
  });

  //获取属性
  const getPoperty = useMemoizedFn(async (deviceId: string) => {
    const { data, code, msg } = await request<IProperty[]>({
      url: `/device-manger/device/device_data_last?deviceId=${deviceId}`,
    });
    if (code === 200) {
      setPropertyList(data);
    }
  });

  //获取全部功能列表
  const getFuc = useMemoizedFn(async (deviceId) => {
    const { data, code, msg } = await request<IFuncList[]>({
      url: `/device-manger/device/list_with_result?deviceId=${deviceId}`,
    });
    if (code === 200) {
      setFuncList(data);
    }
  });

  //执行功能
  const carry = useMemoizedFn((item: IFuncList) => {
    metaFunId.current = item.id;
    const operationVos = item.operationVos;
    //判断是否有参数
    const arr: {
      funOperationId: string;
      describe: string;
      label: string;
      optionalParameters: {
        label: string;
        value: string;
      }[];
      paramPath: string;
      paramType: string;
      subDeviceMark: true;
    }[] = [];
    operationVos.forEach((mainItem) => {
      mainItem.funcParamMarkBo.forEach((subItem) => {
        if (!subItem.subDeviceMark) {
          arr.push({ ...subItem, funOperationId: mainItem.id });
        }
      });
    });

    carryOnOpen();
    if (arr.length) {
      replace(arr);
    } else {
      replace([]);
    }
  });

  const columns = [
    {
      title: '功能名称',
      key: 'funcName',
      render: (e: IFuncList) => {
        return <Box>{e.funcName}</Box>;
      },
    },
    {
      title: '描述',
      key: 'describe',
      render: (e: IFuncList) => {
        return <Box>{e.describe}</Box>;
      },
    },
    {
      title: '执行结果',
      key: 'result',
      render: (e: IFuncList) => {
        if (e.lastRecordVo?.status === 0) {
          return (
            <Tooltip label={e.lastRecordVo?.errorMessage}>
              <Box>{statusRes(e.lastRecordVo.status)}</Box>
            </Tooltip>
          );
        }
        return <Box>{statusRes(e.lastRecordVo?.status)}</Box>;
      },
    },
    {
      title: '操作',
      key: 'opetator',
      render: (e: IFuncList) => {
        return (
          <Button
            onClick={() => carry(e)}
            color={'pri.yellow.200'}
            bg={'pri.yellow.100'}
            _hover={{ color: '#FFF', bg: 'pri.yellow.200' }}
            borderRadius={'4px'}
            fontWeight={0}
          >
            执行
          </Button>
        );
      },
    },
  ];

  const confirmCarry = useMemoizedFn(async (e_) => {
    const e = e_ as {
      config: {
        funOperationId: string;
        paramPath: string;
        paramType: string;
        value: string;
      }[];
    };
    if (fields.length) {
      const obj = {
        deviceId: deviceInfo?.id,
        markExecutes: e.config.map((item) => ({
          funOperationId: item.funOperationId,
          paramPath: item.paramPath,
          paramType: item.paramType,
          value: item.value,
        })),
        metaFunId: metaFunId.current,
      };
      const { data, code, msg } = await request({
        url: `/device-manger/product_fun/execute_change`,
        options: {
          method: 'post',
          body: JSON.stringify(obj),
        },
      });
      if (code === 200) {
        toast({
          title: `执行成功`,
          status: 'success',
          position: 'top',
          duration: 2000,
          isClosable: true,
        });
        carryOnClose();
      } else {
        toast({
          title: msg ?? `执行成功`,
          status: 'error',
          position: 'top',
          duration: 2000,
          isClosable: true,
        });
      }
    } else {
      const obj = {
        deviceId: deviceInfo?.id,

        metaFunId: metaFunId.current,
      };
      const { data, code, msg } = await request({
        url: `/device-manger/product_fun/execute`,
        options: {
          method: 'post',
          body: JSON.stringify(obj),
        },
      });
      if (code === 200) {
        toast({
          title: `执行成功`,
          status: 'success',
          position: 'top',
          duration: 2000,
          isClosable: true,
        });
        carryOnClose();
      } else {
        toast({
          title: msg ?? `执行成功`,
          status: 'error',
          position: 'top',
          duration: 2000,
          isClosable: true,
        });
      }
    }
  });
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
        <ModalOverlay></ModalOverlay>
        <ModalContent w="800px" maxW="unset" pb="20px">
          <Loading spin={false}>
            <ModalHeader>详情</ModalHeader>
            <ModalCloseButton></ModalCloseButton>
            <ModalBody minW="300px">
              <Flex>
                {/* <Chart /> */}
                {!propertyList.length ? (
                  <Box textAlign="center">暂无属性数据</Box>
                ) : (
                  propertyList.map((item, index) => (
                    <Box
                      p="20px"
                      key={index}
                      border="1px solid #CBD5E0"
                      borderRadius="4px"
                      w="calc"
                      mr="5%"
                      width="30%"
                    >
                      <Box>属性名称:{item.fieldName}</Box>
                      <Box>
                        当前值({item.unit}):{item.value}
                      </Box>
                    </Box>
                  ))
                )}
              </Flex>
              {funcList.length ? (
                <TableContainer w="full" mt={2} h="full" overflowY="auto">
                  <Table
                    variant="unstyled"
                    textAlign={'left'}
                    w={'full'}
                    whiteSpace={'normal'}
                    overflowX="auto"
                  >
                    <Thead h="11" position={'sticky'} top={0} zIndex={10}>
                      <Tr>
                        {columns.map((item) => (
                          <Th key={item.key} p={0} pr={3} fontSize={'16px'} textAlign={'left'}>
                            {item.title}
                          </Th>
                        ))}
                      </Tr>
                    </Thead>
                    <Tbody overflowY="auto">
                      {funcList.map((item) => {
                        return (
                          <Tr
                            h={'11'}
                            color="font.200"
                            bg={'backs.200'}
                            cursor={'pointer'}
                            key={item.id}
                          >
                            {columns.map((sub) => {
                              return (
                                <Td
                                  key={sub.key}
                                  textAlign={'left'}
                                  py="0"
                                  h={'11'}
                                  borderBottomWidth={'1px'}
                                  borderBottomColor={'border.100'}
                                  p={0}
                                  pr={3}
                                  bg={'backs.300'}
                                  color={'font.400'}
                                  fontSize={'16px'}
                                >
                                  {sub.render(item)}
                                </Td>
                              );
                            })}
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>
                </TableContainer>
              ) : (
                <Box minH="100px" textAlign="center">
                  暂无功能数据
                </Box>
              )}
            </ModalBody>
          </Loading>
        </ModalContent>
      </Modal>
      <Modal isOpen={carryIsOpen} onClose={carryOnClose} size="lg" closeOnOverlayClick={false}>
        <FormProvider {...addMethods}>
          <ModalOverlay></ModalOverlay>
          <ModalContent>
            <Loading spin={false}>
              <ModalHeader>操作</ModalHeader>
              <ModalCloseButton></ModalCloseButton>
              {fields.length ? (
                <>
                  {fields.map((item: any, index) => {
                    return (
                      <FormControl
                        mt={2}
                        pr={2}
                        isRequired
                        isInvalid={!!(errors as unknown as any).config?.[index]?.value}
                        key={item.id}
                      >
                        <Flex alignItems="center">
                          <FormLabel textAlign="right" w="30%" mr={'2'}>
                            {item.label}：
                          </FormLabel>
                          <Box flex={1}>
                            {item.optionalParameters.length ? (
                              <Select
                                placeholder="请选择"
                                {...addRegister(`config.${index}.value`, {
                                  required: `请选择${item.label}`,
                                })}
                              >
                                {item.optionalParameters.map((sub: any, index: number) => (
                                  <option key={index + 'sub' + index} value={sub.value}>
                                    {sub.label}
                                  </option>
                                ))}
                              </Select>
                            ) : (
                              <Input
                                placeholder={'请输入'}
                                {...addRegister(`config.${index}.value`, {
                                  required: `请输入${item.label}`,
                                })}
                              />
                            )}
                          </Box>
                        </Flex>
                        <FormErrorMessage pl="30%" mt={0}>
                          {(errors as unknown as any)?.config?.[index]?.value?.message}
                        </FormErrorMessage>
                      </FormControl>
                    );
                  })}
                </>
              ) : (
                <Box pl="20px">确定要执行吗</Box>
              )}
            </Loading>
            <ModalFooter>
              <HStack justifyContent={'flex-end'} alignItems="center">
                <Button onClick={carryOnClose}>取消</Button>
                {fields.length ? (
                  <Button onClick={handleSubmit(confirmCarry)}>确定</Button>
                ) : (
                  <Button onClick={confirmCarry}>确定</Button>
                )}
              </HStack>
            </ModalFooter>
          </ModalContent>
        </FormProvider>
      </Modal>
    </>
  );
};

export default Info;
