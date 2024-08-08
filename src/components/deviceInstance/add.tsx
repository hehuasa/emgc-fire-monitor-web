import { decoderListType, productTableType, productTag, productType } from '@/models/product';
import { request } from '@/utils/request';
import { treeDataFormat } from '@/utils/util';
import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Select,
  Switch,
  useToast,
} from '@chakra-ui/react';
import { useMount } from 'ahooks';
import { forwardRef, Ref, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import TreeSelect from '../TreeSelect';
import { ITreeItem } from '../TreeView';

export type modalRef = {
  submit: () => Promise<any>;
};

const AddModal = (prop: any, refs: Ref<modalRef>) => {
  const toast = useToast();
  const methods = useForm();
  const {
    register,
    getValues,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = methods;

  // 所属分类
  const [treeData, setTreeData] = useState<ITreeItem[]>([]);
  const getCategories = useCallback(async () => {
    const { code, data } = await request({
      url: `/device-manger/product_classification/classification_tree_without_product`,
      options: {
        method: 'get',
      },
    });
    if (code == 200) {
      const treeData_: ITreeItem[] = treeDataFormat(data as productType[], [], '0');
      setTreeData(treeData_);
    }
  }, []);
  // 通过分类id获取产品列表
  const [productList, setProductList] = useState<productTableType[]>([]);
  const getProductList = useCallback(async (categoryId: string) => {
    const { code, data } = await request({
      url: `/device-manger/product/list`,
      options: {
        method: 'post',
        body: JSON.stringify({ classificationId: categoryId }),
      },
    });
    if (code == 200) {
      setProductList(data as productTableType[]);
    }
  }, []);
  // 根据选中的设备进行展示
  const [protoCol, setProtoCol] = useState('');
  const handleChangeProduct = useCallback(() => {
    const currentProductId = getValues('productId');
    const currentProduct = productList.find((v) => v.id == currentProductId);
    if (currentProduct) {
      setValue('protocol', currentProduct.protocol);
      setProtoCol(currentProduct.protocol);
      // setDecoder([currentProduct.decoderVo]);
      getTagList();
    }
  }, [productList]);
  // 采集器
  const [decoder, setDecoder] = useState<decoderListType[]>([]);
  const getDecoder = useCallback(async () => {
    const { code, data } = await request({
      url: `/device-manger/collector/list`,
      options: {
        method: 'post',
        body: JSON.stringify({
          mode: getValues('protocol'),
        }),
      },
    });
    if (code == 200) {
      setDecoder(data as decoderListType[]);
    }
  }, []);
  // 设备标签
  const [tagList, setTagList] = useState<productTag[]>([]);
  const getTagList = useCallback(async () => {
    const currentProductId = getValues('productId');
    const { code, data } = await request({
      url: `/device-manger/product_tag/list?productId=${currentProductId}`,
      options: {
        method: 'get',
      },
    });
    if (code == 200) {
      setTagList(data as productTag[]);
    }
  }, []);

  useMount(() => {
    getCategories();
  });
  useEffect(() => {
    const subscribe = watch((val, { name }) => {
      if (name == 'productSort') {
        const code = val[name];
        getProductList(code as string);
      }
      if (name == 'protocol') {
        getDecoder();
      }
    });
    return () => subscribe.unsubscribe();
  }, []);

  // 加密
  const [encryptCode, setEncryptCode] = useState('');
  const encryptPassword = useCallback(async () => {
    const password = getValues('connectConfig.password');
    const { code, data } = await request({
      url: `/device-manger/device/encrypt?password=${password}`,
    });
    if (code == 200) {
      console.log('data', data, password);
      setEncryptCode(data as string);
    }
  }, []);

  const submitForm = async () => {
    console.log('提交');
    const protocol = getValues('protocol');
    const connectConfigData = getValues('connectConfig');
    let params = {};
    switch (protocol) {
      case 'MODBUS-TCP':
        params = {
          protocol,
          modBusTcpConnect: {
            ...connectConfigData,
          },
        };
        break;
      case 'MODBUS-RTU':
        params = {
          protocol,
          modBusRtuConnect: {
            ...connectConfigData,
          },
        };
        break;
      case 'OPC-UA':
        params = {
          protocol,
          opcUaConnect: {
            ...connectConfigData,
            password: encryptCode,
          },
        };
        break;
      case 'OPC-DA':
        params = {
          protocol,
          opcDaConnect: {
            ...connectConfigData,
            password: encryptCode,
          },
        };
        break;
      case 'MQTT':
        params = {
          protocol,
          mqttConnect: {
            ...connectConfigData,
            password: encryptCode,
          },
        };
        break;
      case 'COM':
        params = {
          protocol,
          comConnect: {
            ...connectConfigData,
          },
        };
        break;
      case 'TCP-SERVER':
        params = {
          protocol,
          tcpServerConnect: {
            ...connectConfigData,
          },
        };
        break;
      case 'TCP-CLIENT':
        params = {
          protocol,
          tcpClientConnect: {
            ...connectConfigData,
          },
        };
        break;
      case 'UDP':
        params = {
          protocol,
          modBusRtuConnect: {
            ...connectConfigData,
          },
        };
        break;
      case 'WEBSOCKET':
        params = {
          protocol,
          websocketConnect: {
            ...connectConfigData,
          },
        };
        break;
      case 'HTTP-CLIENT':
        params = {
          protocol,
          httpClientConnect: {
            ...connectConfigData,
          },
        };
        break;
      case 'HTTP-SERVER':
        params = {
          protocol,
          httpServerConnect: {
            ...connectConfigData,
          },
        };
        break;
    }

    const tagObj: any = {};
    tagList.forEach((tag, i) => {
      tagObj[tag.tagCode] = getValues('tag' + i);
    });
    const { code, data, msg } = await request({
      url: `/device-manger/device/add`,
      options: {
        method: 'post',
        body: JSON.stringify({
          deviceName: getValues('deviceName'),
          productId: getValues('productId'),
          runLogLevel: getValues('runLogLevel'),
          serverId: getValues('serverId'),
          tag: tagObj,
          connectConfig: params,
        }),
      },
    });
    if (code === 200) {
      toast({
        title: '添加成功',
        position: 'top',
        status: 'success',

        duration: 2000,
        isClosable: true,
      });
    } else {
      toast({
        title: msg,
        position: 'top',
        status: 'warning',

        duration: 2000,
        isClosable: true,
      });
    }
    return Promise.resolve();
  };

  const SubmitErrorHandler = useCallback(() => {
    return Promise.reject(false);
  }, []);
  useImperativeHandle(refs, () => ({
    submit: handleSubmit(submitForm, SubmitErrorHandler),
  }));

  return (
    <FormProvider {...methods}>
      <form>
        <Flex flexWrap={'wrap'} justifyContent="flex-start">
          <FormControl
            w={'360px'}
            mr={10}
            mb={4}
            isRequired
            isInvalid={(errors as unknown as any).productSort}
          >
            <HStack>
              <FormLabel whiteSpace={'nowrap'} w="24%" textAlign={'right'}>
                所属分类：
              </FormLabel>
              <Box w={'70%'}>
                <TreeSelect
                  treeData={treeData}
                  rootId="0"
                  placeholder="请选择产品分类"
                  {...register('productSort', {
                    required: '请选择产品分类',
                  })}
                ></TreeSelect>
                <FormErrorMessage mt={0}>
                  {(errors as unknown as any).productSort?.message}
                </FormErrorMessage>
              </Box>
            </HStack>
          </FormControl>
          <FormControl
            w={'360px'}
            mr={10}
            mb={4}
            isRequired
            isInvalid={(errors as unknown as any).productId}
          >
            <HStack>
              <FormLabel whiteSpace={'nowrap'} w="24%" textAlign={'right'}>
                所属产品：
              </FormLabel>
              <Box w={'70%'}>
                <Select
                  placeholder="请选择产品名称"
                  {...register('productId', {
                    onChange: handleChangeProduct,
                    required: '请选择产品名称',
                  })}
                >
                  {productList.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage mt={0}>
                  {(errors as unknown as any).productId?.message}
                </FormErrorMessage>
              </Box>
            </HStack>
          </FormControl>
          <FormControl w={'360px'} mr={10} mb={4} isRequired>
            <HStack>
              <FormLabel whiteSpace={'nowrap'} w="24%" textAlign={'right'}>
                链接协议：
              </FormLabel>
              <Input w={'70%'} placeholder="请输入产品名称" disabled {...register('protocol')} />
            </HStack>
          </FormControl>
          <FormControl
            w={'360px'}
            mr={10}
            mb={4}
            isRequired
            isInvalid={(errors as unknown as any).deviceName}
          >
            <HStack>
              <FormLabel whiteSpace={'nowrap'} w="24%" textAlign={'right'}>
                设备名称：
              </FormLabel>
              <Box w={'70%'}>
                <Input
                  placeholder="请输入产品名称"
                  {...register('deviceName', {
                    required: '请输入产品名称',
                  })}
                />
                <FormErrorMessage mt={0}>
                  {(errors as unknown as any).deviceName?.message}
                </FormErrorMessage>
              </Box>
            </HStack>
          </FormControl>
          <FormControl
            w={'360px'}
            mr={10}
            mb={4}
            isRequired
            isInvalid={(errors as unknown as any).runLogLevel}
          >
            <HStack pl={5}>
              <FormLabel whiteSpace={'nowrap'} w="24%" textAlign={'right'}>
                日志级别：
              </FormLabel>
              <Box w={'70%'}>
                <Select
                  placeholder="请选择日志级别"
                  {...register('runLogLevel', {
                    required: '请选择日志级别',
                  })}
                >
                  <option value={'ERROR'}>ERROR</option>
                  <option value={'INFO'}>INFO</option>
                  <option value={'WARN'}>WARN</option>
                </Select>
                <FormErrorMessage mt={0}>
                  {(errors as unknown as any).runLogLevel?.message}
                </FormErrorMessage>
              </Box>
            </HStack>
          </FormControl>
          <FormControl w={'360px'} mr={10} mb={4}>
            <HStack pl={5}>
              <FormLabel whiteSpace={'nowrap'} textAlign={'right'}>
                采集器：
              </FormLabel>
              <Select w={'70%'} placeholder="请输入产品名称" {...register('serverId')}>
                {decoder.map((v) => (
                  <option key={v.serverId} value={v.serverId}>
                    {v.serverId}
                  </option>
                ))}
              </Select>
            </HStack>
          </FormControl>
          <FormControl mr={10} mb={4}>
            <HStack pl={1}>
              <FormLabel whiteSpace={'nowrap'} textAlign={'right'}>
                设备标签：
              </FormLabel>
              <Box w={'70%'} {...register('tag')}>
                {tagList.map((v, i) => (
                  <HStack key={i} mb={2}>
                    <FormLabel whiteSpace={'nowrap'} textAlign={'right'}>
                      {v.tagName}:
                    </FormLabel>
                    <Input placeholder="请输入标签名称" {...register('tag' + i)} />
                  </HStack>
                ))}
              </Box>
            </HStack>
          </FormControl>
        </Flex>
        {protoCol === 'MODBUS-TCP' && (
          <Flex flexWrap={'wrap'} justifyContent="flex-start">
            <FormControl
              w={'360px'}
              mr={10}
              mb={4}
              isRequired
              isInvalid={(errors as unknown as any).connectConfig?.host}
            >
              <HStack>
                <FormLabel whiteSpace={'nowrap'} w="24%" textAlign={'right'}>
                  设备IP：
                </FormLabel>
                <Box w={'70%'}>
                  <Input
                    placeholder="请输入设备IP"
                    {...register('connectConfig.host', {
                      required: '请输入设备IP',
                    })}
                  />
                  <FormErrorMessage mt={0}>
                    {(errors as unknown as any).connectConfig?.host?.message}
                  </FormErrorMessage>
                </Box>
              </HStack>
            </FormControl>
            <FormControl
              w={'360px'}
              mr={10}
              mb={4}
              isRequired
              isInvalid={(errors as unknown as any).connectConfig?.port}
            >
              <HStack>
                <FormLabel whiteSpace={'nowrap'} w="24%" textAlign={'right'}>
                  设备端口：
                </FormLabel>
                <Box w={'70%'}>
                  <Input
                    placeholder="请输入设备端口"
                    {...register('connectConfig.port', {
                      required: '请输入设备端口',
                    })}
                  />
                  <FormErrorMessage mt={0}>
                    {(errors as unknown as any).connectConfig?.port?.message}
                  </FormErrorMessage>
                </Box>
              </HStack>
            </FormControl>
            <FormControl
              w={'360px'}
              mr={10}
              mb={4}
              isRequired
              isInvalid={(errors as unknown as any).connectConfig?.slaveId}
            >
              <HStack>
                <FormLabel whiteSpace={'nowrap'} w="24%" textAlign={'right'}>
                  从机ID：
                </FormLabel>
                <Box w={'70%'}>
                  <Input
                    type={'number'}
                    placeholder="请输入从机ID"
                    {...register('connectConfig.slaveId', {
                      required: '请输入从机ID',
                    })}
                  />
                  <FormErrorMessage mt={0}>
                    {(errors as unknown as any).connectConfig?.slaveId?.message}
                  </FormErrorMessage>
                </Box>
              </HStack>
            </FormControl>
          </Flex>
        )}
        {protoCol === 'MODBUS-RTU' && (
          <Flex flexWrap={'wrap'} justifyContent="flex-start">
            <FormControl w={'360px'} mr={10} mb={4}>
              <HStack>
                <FormLabel whiteSpace={'nowrap'} w="24%" textAlign={'right'}>
                  串口名称：
                </FormLabel>
                <Box w={'70%'}>
                  <Input
                    placeholder="请输入串口名称"
                    {...register('connectConfig.comName', {
                      required: '请输入串口名称',
                    })}
                  />
                </Box>
              </HStack>
            </FormControl>
            <FormControl w={'360px'} mr={10} mb={4}>
              <HStack>
                <FormLabel whiteSpace={'nowrap'} w="24%" textAlign={'right'}>
                  波特率：
                </FormLabel>
                <Box w={'70%'}>
                  <Input
                    placeholder="请输入波特率"
                    {...register('connectConfig.baudRate', {
                      required: '请输入波特率',
                    })}
                  />
                </Box>
              </HStack>
            </FormControl>
            <FormControl w={'360px'} mr={10} mb={4}>
              <HStack>
                <FormLabel whiteSpace={'nowrap'} w="24%" textAlign={'right'}>
                  数据位：
                </FormLabel>
                <Box w={'70%'}>
                  <Input
                    placeholder="请输入数据位"
                    {...register('connectConfig.dataBits', {
                      required: '请输入数据位',
                    })}
                  />
                </Box>
              </HStack>
            </FormControl>
            <FormControl w={'360px'} mr={10} mb={4}>
              <HStack>
                <FormLabel whiteSpace={'nowrap'} w="24%" textAlign={'right'}>
                  校验位：
                </FormLabel>
                <Box w={'70%'}>
                  <Input
                    placeholder="请输入校验位"
                    {...register('connectConfig.parity', {
                      required: '请输入校验位',
                    })}
                  />
                </Box>
              </HStack>
            </FormControl>
            <FormControl w={'360px'} mr={10} mb={4}>
              <HStack>
                <FormLabel whiteSpace={'nowrap'} w="24%" textAlign={'right'}>
                  停止位：
                </FormLabel>
                <Box w={'70%'}>
                  <Input
                    placeholder="请输入停止位"
                    {...register('connectConfig.stopBits', {
                      required: '请输入停止位',
                    })}
                  />
                </Box>
              </HStack>
            </FormControl>
            <FormControl w={'360px'} mr={10} mb={4}>
              <HStack>
                <FormLabel whiteSpace={'nowrap'} w="24%" textAlign={'right'}>
                  从机ID：
                </FormLabel>
                <Box w={'70%'}>
                  <Input
                    placeholder="请输入从机ID"
                    {...register('connectConfig.slaveId', {
                      required: '请输入从机ID',
                    })}
                  />
                </Box>
              </HStack>
            </FormControl>
          </Flex>
        )}
        {protoCol === 'OPC-UA' && (
          <Flex flexWrap={'wrap'} justifyContent="flex-start">
            <FormControl w={'360px'} mr={10} mb={4}>
              <HStack>
                <FormLabel whiteSpace={'nowrap'} w="24%" textAlign={'right'}>
                  端点URL：
                </FormLabel>
                <Box w={'70%'}>
                  <Input
                    placeholder="请输入端点URL"
                    {...register('connectConfig.endPointUrl', {
                      required: '请输入端点URL',
                    })}
                  />
                </Box>
              </HStack>
            </FormControl>
            <FormControl w={'360px'} mr={10} mb={4}>
              <HStack>
                <FormLabel whiteSpace={'nowrap'} w="24%" textAlign={'right'}>
                  安全策略：
                </FormLabel>
                <Box w={'70%'}>
                  <Select
                    placeholder="请输入安全策略"
                    {...register('connectConfig.securityPolicy', {
                      required: '请输入安全策略',
                    })}
                  >
                    <option value={'None'}>None</option>
                    <option value={'Basic256'}>Basic256</option>
                    <option value={'Basic128Rsa15'}>Basic128Rsa15</option>
                    <option value={'Basic256Sha256'}>Basic256Sha256</option>
                  </Select>
                </Box>
              </HStack>
            </FormControl>
            <FormControl w={'360px'} mr={10} mb={4}>
              <HStack>
                <FormLabel whiteSpace={'nowrap'} w="24%" textAlign={'right'}>
                  证书路径：
                </FormLabel>
                <Box w={'70%'}>
                  <Input
                    placeholder="请输入证书路径"
                    {...register('connectConfig.certificateUrl', {
                      required: '请输入证书路径',
                    })}
                  />
                </Box>
              </HStack>
            </FormControl>
            <FormControl w={'360px'} mr={10} mb={4}>
              <HStack>
                <FormLabel whiteSpace={'nowrap'} w="24%" textAlign={'right'}>
                  是否匿名登陆：
                </FormLabel>
                <Box w={'70%'}>
                  <Switch
                    {...register('connectConfig.anonymous', {
                      required: '',
                    })}
                  />
                </Box>
              </HStack>
            </FormControl>
            <FormControl w={'360px'} mr={10} mb={4}>
              <HStack>
                <FormLabel whiteSpace={'nowrap'} w="24%" textAlign={'right'}>
                  账号：
                </FormLabel>
                <Box w={'70%'}>
                  <Input
                    placeholder="请输入账号"
                    {...register('connectConfig.username', {
                      required: '请输入账号',
                    })}
                  />
                </Box>
              </HStack>
            </FormControl>
            <FormControl w={'360px'} mr={10} mb={4}>
              <HStack>
                <FormLabel whiteSpace={'nowrap'} w="24%" textAlign={'right'}>
                  密码：
                </FormLabel>
                <Box w={'70%'}>
                  <Input
                    type="password"
                    placeholder="请输入密码"
                    {...register('connectConfig.password', {
                      required: '请输入密码',
                    })}
                    blur={encryptPassword}
                  />
                </Box>
              </HStack>
            </FormControl>
          </Flex>
        )}
        {protoCol === 'OPC-DA' && (
          <Flex flexWrap={'wrap'} justifyContent="flex-start">
            <FormControl w={'360px'} mr={10} mb={4}>
              <HStack>
                <FormLabel whiteSpace={'nowrap'} w="24%" textAlign={'right'}>
                  地址：
                </FormLabel>
                <Box w={'70%'}>
                  <Input
                    placeholder="请输入地址"
                    {...register('connectConfig.host', {
                      required: '请输入地址',
                    })}
                  />
                </Box>
              </HStack>
            </FormControl>
            <FormControl w={'360px'} mr={10} mb={4}>
              <HStack>
                <FormLabel whiteSpace={'nowrap'} w="24%" textAlign={'right'}>
                  账号：
                </FormLabel>
                <Box w={'70%'}>
                  <Input
                    placeholder="请输入账号"
                    {...register('connectConfig.username', {
                      required: '请输入账号',
                    })}
                  />
                </Box>
              </HStack>
            </FormControl>
            <FormControl w={'360px'} mr={10} mb={4}>
              <HStack>
                <FormLabel whiteSpace={'nowrap'} w="24%" textAlign={'right'}>
                  密码：
                </FormLabel>
                <Box w={'70%'}>
                  <Input
                    type="password"
                    placeholder="请输入密码"
                    {...register('connectConfig.password', {
                      required: '请输入密码',
                    })}
                    blur={encryptPassword}
                  />
                </Box>
              </HStack>
            </FormControl>
            <FormControl w={'360px'} mr={10} mb={4}>
              <HStack>
                <FormLabel whiteSpace={'nowrap'} w="24%" textAlign={'right'}>
                  类标识符：
                </FormLabel>
                <Box w={'70%'}>
                  <Input
                    placeholder="请输入类标识符"
                    {...register('connectConfig.clsid', {
                      required: '请输入类标识符',
                    })}
                  />
                </Box>
              </HStack>
            </FormControl>
            <FormControl w={'360px'} mr={10} mb={4}>
              <HStack>
                <FormLabel whiteSpace={'nowrap'} w="24%" textAlign={'right'}>
                  程序ID：
                </FormLabel>
                <Box w={'70%'}>
                  <Input
                    placeholder="请输入程序ID"
                    {...register('connectConfig.progId', {
                      required: '请输入程序ID',
                    })}
                  />
                </Box>
              </HStack>
            </FormControl>
          </Flex>
        )}
        {protoCol === 'MQTT' && (
          <Flex flexWrap={'wrap'} justifyContent="flex-start">
            <FormControl w={'360px'} mr={10} mb={4}>
              <HStack>
                <FormLabel whiteSpace={'nowrap'} w="24%" textAlign={'right'}>
                  设备IP：
                </FormLabel>
                <Box w={'70%'}>
                  <Input
                    placeholder="请输入设备IP"
                    {...register('connectConfig.host', {
                      required: '请输入设备IP',
                    })}
                  />
                </Box>
              </HStack>
            </FormControl>
            <FormControl w={'360px'} mr={10} mb={4}>
              <HStack>
                <FormLabel whiteSpace={'nowrap'} w="24%" textAlign={'right'}>
                  设备端口：
                </FormLabel>
                <Box w={'70%'}>
                  <Input
                    placeholder="请输入账号"
                    {...register('connectConfig.port', {
                      required: '请输入账号',
                    })}
                  />
                </Box>
              </HStack>
            </FormControl>
            <FormControl w={'360px'} mr={10} mb={4}>
              <HStack>
                <FormLabel whiteSpace={'nowrap'} w="24%" textAlign={'right'}>
                  SSL：
                </FormLabel>
                <Box w={'70%'}>
                  <Switch
                    {...register('connectConfig.ssl', {
                      required: '',
                    })}
                  />
                </Box>
              </HStack>
            </FormControl>
            <FormControl w={'360px'} mr={10} mb={4}>
              <HStack>
                <FormLabel whiteSpace={'nowrap'} w="24%" textAlign={'right'}>
                  安全策略：
                </FormLabel>
                <Box w={'70%'}>
                  <Select
                    placeholder="请选择安全策略"
                    {...register('connectConfig.credentialsType', {
                      required: '请选择安全策略',
                    })}
                  >
                    <option value={'ANONYMOUS'}>ANONYMOUS</option>
                    <option value={'BASIC'}>BASIC</option>
                    <option value={'CERT_PEM'}>CERT_PEM</option>
                  </Select>
                </Box>
              </HStack>
            </FormControl>
            <FormControl w={'360px'} mr={10} mb={4}>
              <HStack>
                <FormLabel whiteSpace={'nowrap'} w="24%" textAlign={'right'}>
                  账号：
                </FormLabel>
                <Box w={'70%'}>
                  <Input
                    placeholder="请输入账号"
                    {...register('connectConfig.username', {
                      required: '请输入账号',
                    })}
                  />
                </Box>
              </HStack>
            </FormControl>
            <FormControl w={'360px'} mr={10} mb={4}>
              <HStack>
                <FormLabel whiteSpace={'nowrap'} w="24%" textAlign={'right'}>
                  密码：
                </FormLabel>
                <Box w={'70%'}>
                  <Input
                    type={'password'}
                    placeholder="请输入密码"
                    {...register('connectConfig.password', {
                      required: '请输入密码',
                    })}
                    blur={encryptPassword}
                  />
                </Box>
              </HStack>
            </FormControl>
          </Flex>
        )}
        {protoCol === 'COM' && (
          <Flex flexWrap={'wrap'} justifyContent="flex-start">
            <FormControl w={'360px'} mr={10} mb={4}>
              <HStack>
                <FormLabel whiteSpace={'nowrap'} w="24%" textAlign={'right'}>
                  串口名称：
                </FormLabel>
                <Box w={'70%'}>
                  <Input
                    placeholder="请输入串口名称"
                    {...register('connectConfig.comName', {
                      required: '请输入串口名称',
                    })}
                  />
                </Box>
              </HStack>
            </FormControl>
            <FormControl w={'360px'} mr={10} mb={4}>
              <HStack>
                <FormLabel whiteSpace={'nowrap'} w="24%" textAlign={'right'}>
                  波特率：
                </FormLabel>
                <Box w={'70%'}>
                  <Input
                    placeholder="请输入波特率"
                    {...register('connectConfig.baudRate', {
                      required: '请输入波特率',
                    })}
                  />
                </Box>
              </HStack>
            </FormControl>
            <FormControl w={'360px'} mr={10} mb={4}>
              <HStack>
                <FormLabel whiteSpace={'nowrap'} w="24%" textAlign={'right'}>
                  数据位：
                </FormLabel>
                <Box w={'70%'}>
                  <Input
                    placeholder="请输入数据位"
                    {...register('connectConfig.dataBits', {
                      required: '请输入数据位',
                    })}
                  />
                </Box>
              </HStack>
            </FormControl>
            <FormControl w={'360px'} mr={10} mb={4}>
              <HStack>
                <FormLabel whiteSpace={'nowrap'} w="24%" textAlign={'right'}>
                  校验位：
                </FormLabel>
                <Box w={'70%'}>
                  <Input
                    placeholder="请输入校验位"
                    {...register('connectConfig.parity', {
                      required: '请输入校验位',
                    })}
                  />
                </Box>
              </HStack>
            </FormControl>
            <FormControl w={'360px'} mr={10} mb={4}>
              <HStack>
                <FormLabel whiteSpace={'nowrap'} w="24%" textAlign={'right'}>
                  停止位：
                </FormLabel>
                <Box w={'70%'}>
                  <Input
                    placeholder="请输入停止位"
                    {...register('connectConfig.stopBits', {
                      required: '请输入停止位',
                    })}
                  />
                </Box>
              </HStack>
            </FormControl>
          </Flex>
        )}
        {protoCol === 'TCP-SERVER' && (
          <Flex flexWrap={'wrap'} justifyContent="flex-start">
            <FormControl w={'360px'} mr={10} mb={4}>
              <HStack>
                <FormLabel whiteSpace={'nowrap'} w="24%" textAlign={'right'}>
                  设备IP：
                </FormLabel>
                <Box w={'70%'}>
                  <Input
                    placeholder="请输入设备IP"
                    {...register('connectConfig.host', {
                      required: '请输入设备IP',
                    })}
                  />
                </Box>
              </HStack>
            </FormControl>
            <FormControl w={'360px'} mr={10} mb={4}>
              <HStack>
                <FormLabel whiteSpace={'nowrap'} w="24%" textAlign={'right'}>
                  监听端口：
                </FormLabel>
                <Box w={'70%'}>
                  <Input
                    placeholder="请输入监听端口"
                    {...register('connectConfig.serverPort', {
                      required: '请输入监听端口',
                    })}
                  />
                </Box>
              </HStack>
            </FormControl>
          </Flex>
        )}
        {protoCol === 'TCP-CLIENT' && (
          <Flex flexWrap={'wrap'} justifyContent="flex-start">
            <FormControl w={'360px'} mr={10} mb={4}>
              <HStack>
                <FormLabel whiteSpace={'nowrap'} w="24%" textAlign={'right'}>
                  设备IP：
                </FormLabel>
                <Box w={'70%'}>
                  <Input
                    placeholder="请输入设备IP"
                    {...register('connectConfig.host', {
                      required: '请输入设备IP',
                    })}
                  />
                </Box>
              </HStack>
            </FormControl>
            <FormControl w={'360px'} mr={10} mb={4}>
              <HStack>
                <FormLabel whiteSpace={'nowrap'} w="24%" textAlign={'right'}>
                  设备端口：
                </FormLabel>
                <Box w={'70%'}>
                  <Input
                    placeholder="请输入设备端口"
                    {...register('connectConfig.port', {
                      required: '请输入设备端口',
                    })}
                  />
                </Box>
              </HStack>
            </FormControl>
          </Flex>
        )}
        {protoCol === 'UDP' && (
          <Flex flexWrap={'wrap'} justifyContent="flex-start">
            <FormControl w={'360px'} mr={10} mb={4}>
              <HStack>
                <FormLabel whiteSpace={'nowrap'} w="24%" textAlign={'right'}>
                  设备IP：
                </FormLabel>
                <Box w={'70%'}>
                  <Input
                    placeholder="请输入设备IP"
                    {...register('connectConfig.targetHost', {
                      required: '请输入设备IP',
                    })}
                  />
                </Box>
              </HStack>
            </FormControl>
            <FormControl w={'360px'} mr={10} mb={4}>
              <HStack>
                <FormLabel whiteSpace={'nowrap'} w="24%" textAlign={'right'}>
                  设备端口：
                </FormLabel>
                <Box w={'70%'}>
                  <Input
                    placeholder="请输入设备端口"
                    {...register('connectConfig.targetPort', {
                      required: '请输入设备端口',
                    })}
                  />
                </Box>
              </HStack>
            </FormControl>
            <FormControl w={'360px'} mr={10} mb={4}>
              <HStack>
                <FormLabel whiteSpace={'nowrap'} w="24%" textAlign={'right'}>
                  监听端口：
                </FormLabel>
                <Box w={'70%'}>
                  <Input
                    placeholder="请输入监听端口"
                    {...register('connectConfig.port', {
                      required: '请输入监听端口',
                    })}
                  />
                </Box>
              </HStack>
            </FormControl>
          </Flex>
        )}
        {protoCol === 'WEBSOCKET' && (
          <Flex flexWrap={'wrap'} justifyContent="flex-start">
            <FormControl w={'360px'} mr={10} mb={4}>
              <HStack>
                <FormLabel whiteSpace={'nowrap'} w="24%" textAlign={'right'}>
                  ws连接串：
                </FormLabel>
                <Box w={'70%'}>
                  <Input
                    placeholder="请输入ws连接串"
                    {...register('connectConfig.uri', {
                      required: '请输入ws连接串',
                    })}
                  />
                </Box>
              </HStack>
            </FormControl>
          </Flex>
        )}
        {protoCol === 'HTTP-CLIENT' && (
          <Flex flexWrap={'wrap'} justifyContent="flex-start">
            <FormControl w={'360px'} mr={10} mb={4}>
              <HStack>
                <FormLabel whiteSpace={'nowrap'} w="24%" textAlign={'right'}>
                  设备IP：
                </FormLabel>
                <Box w={'70%'}>
                  <Input
                    placeholder="请输入设备IP"
                    {...register('connectConfig.host', {
                      required: '请输入设备IP',
                    })}
                  />
                </Box>
              </HStack>
            </FormControl>
            <FormControl w={'360px'} mr={10} mb={4}>
              <HStack>
                <FormLabel whiteSpace={'nowrap'} w="24%" textAlign={'right'}>
                  设备端口：
                </FormLabel>
                <Box w={'70%'}>
                  <Input
                    placeholder="请输入设备端口"
                    {...register('connectConfig.port', {
                      required: '请输入设备端口',
                    })}
                  />
                </Box>
              </HStack>
            </FormControl>
          </Flex>
        )}
        {protoCol === 'HTTP-SERVER' && (
          <Flex flexWrap={'wrap'} justifyContent="flex-start">
            <FormControl w={'360px'} mr={10} mb={4}>
              <HStack>
                <FormLabel whiteSpace={'nowrap'} w="24%" textAlign={'right'}>
                  监听端口：
                </FormLabel>
                <Box w={'70%'}>
                  <Input
                    placeholder="请输入监听端口"
                    {...register('connectConfig.httpPort', {
                      required: '请输入监听端口',
                    })}
                  />
                </Box>
              </HStack>
            </FormControl>
          </Flex>
        )}
      </form>
    </FormProvider>
  );
};

const AddModalRef = forwardRef(AddModal);

export default AddModalRef;
