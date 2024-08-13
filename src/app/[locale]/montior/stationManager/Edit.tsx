import {
  Flex,
  Modal,
  ModalContent,
  ModalOverlay,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Text,
  Box,
  Button,
  HStack,
  Table,
  Tbody,
  Td,
  Tr,
  useToast,
} from '@chakra-ui/react';
import { useMemoizedFn, useSafeState } from 'ahooks';
import { useForm, FormProvider, useFieldArray, useFormContext } from 'react-hook-form';
import CustomSelect from '@/components/CustomSelect';

import { useEffect, useRef } from 'react';
import { teleOrPhone, blankSpace } from '@/utils/rule';
import { request } from '@/utils/request';
import { FormItem as OriFormItem } from './page';
import { DelComponent } from './Table';
import dynamic from 'next/dynamic';
import { IOritreeData } from '@/components/Montior/Tree';
import { IAlarmTypeItem } from '@/models/alarm';
import { IArea } from '@/models/map';
import type { IResponsiblePerson } from './page';
import { IPageData } from '@/utils/publicData';

const TreeSelect = dynamic(() => import('@/components/Montior/TreeSelect'), { ssr: false });

interface Props {
  isOpen: boolean;
  onClose: () => void;
  alarmType: IAlarmTypeItem[];
  depTree: IOritreeData[];
  areaList: IArea[];
  itemInfo?: IResponsiblePerson;
  setItemInfo: (data?: IResponsiblePerson) => void;
  getData: (current: number) => void;
  data: IPageData<IResponsiblePerson>;
}

interface FormItem extends OriFormItem {
  personList: {
    name: string;
    phone: string;
  }[];
}

const Edit = ({
  isOpen,
  onClose,
  alarmType,
  areaList,
  depTree,
  itemInfo,
  setItemInfo,
  getData,
  data,
}: Props) => {
  const [loading, setLoading] = useSafeState(false);
  const toast = useToast();
  const methods = useForm<FormItem>({
    defaultValues: {},
  });
  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
    reset,
    control,
    setValue,
  } = methods;

  const { fields, append, replace, remove } = useFieldArray({
    control,
    name: 'personList',
  });

  const submit = useMemoizedFn(async (e: FormItem) => {
    setLoading(true);
    if (!e.personList.length) {
      toast({
        status: 'error',
        position: 'top',
        title: '请添加人员',
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    const isAdd = itemInfo?.id === undefined;
    if (isAdd) {
      const res = await request({
        url: '/cx-alarm/dc/areaCharge/add',
        options: {
          method: 'post',
          body: JSON.stringify({
            alarmType: e.alarmType,
            areaId: e.areaId,
            deptId: e.deptId,
            changeInfo: e.personList.map((item) => ({
              deptId: e.deptId,
              //deptName: '',
              //userId: '',
              userName: item.name,
              userPhone: item.phone,
            })),
          }),
        },
      });
      if (res.code === 200) {
        getData(1);
        onClose();
      } else {
        toast({
          status: 'error',
          position: 'top',
          title: res.msg || '操作失败',
          duration: 2000,
          isClosable: true,
        });
      }
    } else {
      const res = await request({
        url: '/cx-alarm/dc/areaCharge/update',
        options: {
          method: 'post',
          body: JSON.stringify({
            //dcAreaUpdateChargeBo: {
            id: itemInfo.id,
            userName: e.personList[0].name,
            userPhone: e.personList[0].phone,
            //},
          }),
        },
      });
      if (res.code === 200) {
        getData(data.current);
        onClose();
      } else {
        toast({
          status: 'error',
          position: 'top',
          title: res.msg || '操作失败',
          duration: 2000,
          isClosable: true,
        });
      }
    }

    setLoading(false);
  });

  const onModalCancel = useMemoizedFn(() => {
    reset();
    replace([]);
    setItemInfo();
  });

  const addPerson = useMemoizedFn(() => {
    append({ name: '', phone: '' });
  });

  const columnsPerson = [
    {
      id: 'order',
      header: '序号',
      render: (info: IResponsiblePerson, index: number) => {
        return index + 1;
      },
    },
    {
      id: 'name',
      accessorKey: 'name',
      header: '用户名',
      render: (info: IResponsiblePerson, index: number) => {
        return <EditDiv index={index} name={'name'} />;
      },
    },
    {
      id: 'phone',
      accessorKey: 'phone',
      header: '联系电话',
      render: (info: IResponsiblePerson, index: number) => {
        return <EditDiv index={index} name={'phone'} />;
      },
    },
  ];

  if (!itemInfo) {
    columnsPerson.push({
      id: 'alarmLastTime',
      accessorKey: 'alarmLastTime',
      header: '操作',
      render: (info: IResponsiblePerson, index: number) => {
        return (
          <HStack spacing={2}>
            <DelComponent confirm={() => remove(index)} />
          </HStack>
        );
      },
    });
  }

  useEffect(() => {
    if (itemInfo && isOpen) {
      setValue('alarmType', itemInfo.alarmType);
      setValue('areaId', itemInfo.areaId);
      setValue('deptId', itemInfo.deptId);
      replace([{ name: itemInfo.chargeName, phone: itemInfo.chargePhone }]);
    }
  }, [itemInfo, isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} onCloseComplete={onModalCancel}>
      <ModalOverlay />
      <ModalContent maxW={'800px'}>
        <FormProvider {...methods}>
          <Flex p="20px" direction="column">
            <Box flex={1}>
              <Flex flexWrap="wrap">
                <FormControl
                  mr="28px"
                  mb="20px"
                  alignItems="center"
                  isInvalid={!!errors.deptId}
                  w="auto"
                >
                  <Flex alignItems="center">
                    <FormLabel mb={0} mr={0} display="flex" w="90px">
                      <Text color="#E31014">*</Text>部门：
                    </FormLabel>

                    <TreeSelect
                      placeholder="请选择部门"
                      data={depTree}
                      {...register('deptId', { required: '请选择部门' })}
                      w="260px"
                      h="36px"
                      ref={undefined}
                      allNodeCanSelect
                      isDisabled={!!itemInfo}
                    />
                  </Flex>
                  <FormErrorMessage mt={0} pl="90px">
                    {errors.deptId ? (errors.deptId.message as unknown as string) : null}
                  </FormErrorMessage>
                </FormControl>
                <FormControl mb="20px" alignItems="center" isInvalid={!!errors.areaId} w="auto">
                  <Flex alignItems="center">
                    <FormLabel mb={0} mr={0} display="flex" w="90px">
                      <Text color="#E31014">*</Text>区域：
                    </FormLabel>

                    <CustomSelect
                      isDisabled={!!itemInfo}
                      placeholder="请选择区域"
                      {...register('areaId', {
                        required: '请选择区域',
                      })}
                      w="260px"
                      h="36px"
                    >
                      <>
                        {areaList.map((item) => (
                          <option key={item.areaId} value={item.areaId}>
                            {item.areaName}
                          </option>
                        ))}
                      </>
                    </CustomSelect>
                  </Flex>
                  <FormErrorMessage mt={0} pl="90px">
                    {errors.areaId ? (errors.areaId.message as unknown as string) : null}
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  mb="20px"
                  mr="28px"
                  alignItems="center"
                  isInvalid={!!errors.alarmType}
                  w="auto"
                >
                  <Flex alignItems="center">
                    <FormLabel mb={0} mr={0} display="flex" w="90px">
                      <Text color="#E31014">*</Text>报警类型：
                    </FormLabel>

                    <CustomSelect
                      isDisabled={!!itemInfo}
                      placeholder="请选择报警类型"
                      {...register('alarmType', { required: '请选择报警类型' })}
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
                  <FormErrorMessage mt={0} pl="90px">
                    {errors.alarmType ? (errors.alarmType.message as unknown as string) : null}
                  </FormErrorMessage>
                </FormControl>
              </Flex>
              <Box>{!itemInfo ? <Button onClick={addPerson}>新增负责人</Button> : null}</Box>

              {fields.length ? (
                <Box mt="20px" border="1px solid rgba(228, 228, 228, 1)" borderRadius="10px">
                  <Table variant="unstyled" textAlign={'left'} w={'full'} overflowX="auto">
                    <colgroup>
                      <col style={{ width: '20%' }}></col>
                      <col style={{ width: `30%` }}></col>
                      <col style={{ width: '30%' }}></col>
                      <col style={{ width: '20%' }}></col>
                    </colgroup>
                    <Tbody>
                      <Tr>
                        <Td>序号</Td>
                        <Td>用户名</Td>
                        <Td>联系电话</Td>
                        {!itemInfo ? <Td>操作</Td> : null}
                      </Tr>
                      {fields.map((item, index) => {
                        return (
                          <Tr key={index}>
                            {columnsPerson.map((subItem, subIndex) => {
                              return (
                                <Td key={subIndex + '' + index}>
                                  {subItem.render(item as unknown as IResponsiblePerson, index)}
                                </Td>
                              );
                            })}
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>
                </Box>
              ) : null}
            </Box>

            <HStack
              mt="20px"
              justifyContent="center"
              w="full"
              h="50px"
              spacing={2}
              alignItems="center"
            >
              <Button onClick={onClose}>取消</Button>
              <Button onClick={handleSubmit(submit)} isLoading={loading}>
                提交
              </Button>
            </HStack>
          </Flex>
        </FormProvider>
      </ModalContent>
    </Modal>
  );
};

export default Edit;

interface IEditDivProps {
  index: number;
  name: string;
}

const EditDiv = ({ index, name }: IEditDivProps) => {
  const {
    getValues,
    setValue,
    formState: { errors, isSubmitted },
    register,
  } = useFormContext();
  const [defaultValue, setDefaultValue] = useSafeState('');
  const container = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (name === 'phone') {
      register(`personList.${index}.${name}`, {
        required: `请输入电话`,
        validate: (content) => teleOrPhone(content),
      });
    } else {
      register(`personList.${index}.${name}`, {
        required: `请输入用户名`,
        validate: (content, fieldValues) => blankSpace(content, fieldValues, '请输入用户名'),
      });
    }

    const value = getValues(`personList.${index}.${name}`);
    setDefaultValue(value);
  }, []);

  const message = (errors as any).personList?.[index]?.[name];

  return (
    <>
      <Box
        onInput={(e) => {
          const box = e.target as HTMLDivElement;
          const v = box.innerText;
          setValue(`personList.${index}.${name}`, v, {
            shouldValidate: isSubmitted ? true : false,
          });
        }}
        ref={container}
        _focusVisible={{ border: 'none', boxShadow: 'none', outline: 'none' }}
        contentEditable
        _empty={{ _before: { content: `"暂无数据"` } }}
        _focus={{ _before: { content: `""` } }}
        w="100%"
        wordBreak="break-all"
        suppressContentEditableWarning
      >
        {defaultValue}
      </Box>

      {message?.message ? <Box color="pri.red.100">{message.message}</Box> : null}
    </>
  );
};
