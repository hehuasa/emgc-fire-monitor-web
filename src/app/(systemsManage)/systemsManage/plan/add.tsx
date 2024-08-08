'use client';

import CustomSelect from '@/components/CustomSelect';
import { IOritreeData } from '@/components/Montior/Tree';
import TreeSelect from '@/components/Montior/TreeSelect';
import { DCItem, IDepartment, IUploadFileRespond } from '@/models/system';
import { request, requestUpload } from '@/utils/request';
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  useToast,
  Input,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useMemoizedFn, useMount, useSafeState } from 'ahooks';
import { FormItem, Button } from 'amis';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import FileUpload from '@/components/Upload';
import { useRef } from 'react';
import Spin from '@/components/Loading/Spin';

interface IFormItem {
  deptId: string;
  planName: string;
  planNo: string;
  planTime: string;
  planType: string;
  planVersion: string;
  records: string;
  updateDate: string;
  updateTimes: string;
  filePath: string;
}

const Add = (props: any) => {
  const { planTypeList, data } = props;
  const toast = useToast();
  const methods = useForm<IFormItem>();
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = methods;
  const [depTree, setDepTree] = useSafeState<IOritreeData[]>([]);
  const [loading, setLoading] = useSafeState(false);
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

  const currentFile = useRef<File>();
  const currentDelFile = useRef<string>();

  const closeDialog = useMemoizedFn(() => {
    props.onAction(null, { actionType: 'cancel', componentId: 'u:f513da49400e' });
  });

  useMount(() => {
    getDepartment();
    if (props.edit) {
      console.log('zzzzzzzzzz');
      setValue('deptId', data.deptId);
      setValue('planName', data.planName);
      setValue('planNo', data.planNo);
      setValue('planTime', data.planTime);
      setValue('planVersion', data.planVersion);
      setValue('records', data.records);
      setValue('updateTimes', data.updateTimes);
      setValue('planType', data.planType);
      setValue('filePath', data.filePath);
    }
  });

  const submit = useMemoizedFn(async (e: IFormItem) => {
    try {
      //新增和删除
      await delFile();

      await uploadFile();

      const res = await request({
        url: '/cx-scws/plan_text_info/saveOrUpdate',
        options: {
          method: 'post',
          body: JSON.stringify({
            ...e,
            //编辑的时候需要id
            id: props.edit ? data.id : undefined,
            filePath: getValues('filePath') ?? undefined,
          }),
        },
      });
      if (res.code === 200) {
        props.onAction(null, { actionType: 'reload', target: 'crud' });
        closeDialog();
      } else {
        toast({ position: 'top', title: res.msg, status: 'error' });
      }
    } catch (err) {
      //
    }

    setLoading(false);
  });

  const uploadFile = useMemoizedFn(async () => {
    setLoading(true);
    if (!currentFile.current) {
      return Promise.resolve();
    } else {
      const formData = new FormData();
      formData.append('multipartFile', currentFile.current);
      const res = await requestUpload<IUploadFileRespond>({
        url: '/cx-scws/file/upload_file',
        options: {
          method: 'post',
          body: formData,
          headers: {},
        },
      });
      if (res.code === 200) {
        setValue('filePath', res.data.url);
        return Promise.resolve();
      } else {
        setLoading(false);
        toast({ position: 'top', title: res.msg, status: 'error' });
        return Promise.reject(res.msg);
      }
    }
  });

  const delFile = useMemoizedFn(async () => {
    if (currentDelFile.current && currentDelFile.current === getValues('filePath')) {
      setValue('filePath', '');
    }
  });

  return (
    <Spin spin={loading}>
      <Box w="full">
        <FormProvider {...methods}>
          <Box w="full">
            <Flex flexWrap="wrap">
              <FormControl
                mr="28px"
                mb="20px"
                alignItems="center"
                w="auto"
                isRequired
                isInvalid={!!errors.deptId}
              >
                <Flex alignItems="center">
                  <FormLabel mb={0} mr={0} display="flex" w="90px">
                    部门
                  </FormLabel>

                  <TreeSelect
                    placeholder="请选择部门"
                    data={depTree}
                    {...register('deptId', { required: '请选择部门' })}
                    w="240px"
                    ref={undefined}
                    allNodeCanSelect
                  />
                </Flex>
                <FormErrorMessage mt={0}>
                  {errors.deptId ? (errors.deptId.message as unknown as string) : null}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                mr="28px"
                mb="20px"
                alignItems="center"
                w="auto"
                isRequired
                isInvalid={!!errors.planType}
              >
                <Flex alignItems="center">
                  <FormLabel mb={0} mr={0} display="flex" w="90px">
                    预案类别
                  </FormLabel>

                  <CustomSelect
                    placeholder="请选择预案类别"
                    {...register('planType', { required: '请选择预案类别' })}
                    w="240px"
                    h="36px"
                  >
                    <>
                      {planTypeList.map((item: DCItem) => (
                        <option key={item.cnName} value={item.cnName}>
                          {item.cnName}
                        </option>
                      ))}
                    </>
                  </CustomSelect>
                </Flex>
                <FormErrorMessage mt={0}>
                  {errors.planType ? (errors.planType.message as unknown as string) : null}
                </FormErrorMessage>
              </FormControl>
            </Flex>
            <Flex flexWrap="wrap">
              <FormControl
                mr="28px"
                mb="20px"
                alignItems="center"
                w="auto"
                isRequired
                isInvalid={!!errors.planNo}
              >
                <Flex alignItems="center">
                  <FormLabel mb={0} mr={0} display="flex" w="90px">
                    预案编号
                  </FormLabel>

                  <Input
                    placeholder="请输入预案编号"
                    {...register('planNo', { required: '请输入预案编号' })}
                    w="240px"
                  />
                </Flex>
                <FormErrorMessage mt={0}>
                  {errors.planNo ? (errors.planNo.message as unknown as string) : null}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                mr="28px"
                mb="20px"
                alignItems="center"
                w="auto"
                isRequired
                isInvalid={!!errors.planName}
              >
                <Flex alignItems="center">
                  <FormLabel mb={0} mr={0} display="flex" w="90px">
                    预案名称
                  </FormLabel>

                  <Input
                    placeholder="请输入预案名称"
                    {...register('planName', { required: '请输入预案名称' })}
                    w="240px"
                  />
                </Flex>
                <FormErrorMessage mt={0}>
                  {errors.planName ? (errors.planName.message as unknown as string) : null}
                </FormErrorMessage>
              </FormControl>
            </Flex>
            <Flex flexWrap="wrap">
              <FormControl
                mr="28px"
                mb="20px"
                alignItems="center"
                w="auto"
                isRequired
                isInvalid={!!errors.planVersion}
              >
                <Flex alignItems="center">
                  <FormLabel mb={0} mr={0} display="flex" w="90px">
                    当前版本
                  </FormLabel>

                  <Input
                    placeholder="请输入当前版本"
                    {...register('planVersion', { required: '请输入当前版本' })}
                    w="240px"
                  />
                </Flex>
                <FormErrorMessage mt={0}>
                  {errors.planVersion ? (errors.planVersion.message as unknown as string) : null}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                mr="28px"
                mb="20px"
                alignItems="center"
                w="auto"
                isRequired
                isInvalid={!!errors.planTime}
              >
                <Flex alignItems="center">
                  <FormLabel mb={0} mr={0} display="flex" w="90px">
                    发布日期
                  </FormLabel>

                  <Input
                    type="date"
                    placeholder="请输入发布日期"
                    {...register('planTime', { required: '请输入发布日期' })}
                    w="240px"
                  />
                </Flex>
                <FormErrorMessage mt={0}>
                  {errors.planTime ? (errors.planTime.message as unknown as string) : null}
                </FormErrorMessage>
              </FormControl>
            </Flex>
            <Flex flexWrap="wrap">
              <FormControl mr="28px" mb="20px" alignItems="center" w="auto">
                <Flex alignItems="center">
                  <FormLabel mb={0} mr={0} display="flex" w="90px">
                    修订次数
                  </FormLabel>

                  <Input
                    type="number"
                    placeholder="请输入修订次数"
                    {...register('updateTimes')}
                    w="240px"
                  />
                </Flex>
              </FormControl>
              <FormControl mr="28px" mb="20px" alignItems="center" w="auto">
                <Flex alignItems="center">
                  <FormLabel mb={0} mr={0} display="flex" w="90px">
                    是否备案
                  </FormLabel>

                  <CustomSelect
                    placeholder="请选择预案类别"
                    {...register('records')}
                    w="240px"
                    h="36px"
                  >
                    {[
                      { label: '是', value: '1' },
                      { label: '否', value: '0' },
                    ].map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </CustomSelect>
                </Flex>
              </FormControl>
              {/* <FormControl mr="28px" mb="20px" alignItems="center" w="auto">
                <Flex alignItems="center">
                  <FormLabel mb={0} mr={0} display="flex" w="90px">
                    修订日期
                  </FormLabel>

                  <Input
                    type="date"
                    placeholder="请输入修订日期"
                    {...register('updateDate')}
                    w="240px"
                  />
                </Flex>
              </FormControl> */}
            </Flex>

            <Flex alignItems="center">
              <FormControl mr="28px" mb="20px" alignItems="center" w="auto">
                <Flex alignItems="center">
                  <FormLabel mb={0} mr={0} display="flex" w="90px">
                    文本预案
                  </FormLabel>
                  <FileUpload
                    maxLength={1}
                    addChange={(e) => {
                      console.log('新增', e);
                      if (e.length) {
                        currentFile.current = e[0].file;
                      } else {
                        currentFile.current = undefined;
                      }
                    }}
                    reduceChange={(e, d) => {
                      if (e.length) {
                        currentDelFile.current = e[0].src;
                      } else {
                        currentDelFile.current = undefined;
                      }
                    }}
                    dafaultData={[data.filePath]}
                  />
                </Flex>
              </FormControl>
            </Flex>
          </Box>
        </FormProvider>
        <Flex justifyContent="flex-end">
          <Box mr="4">
            <Button onClick={closeDialog} type="button" level="secondary" className="navbar-btn">
              取消
            </Button>
          </Box>
          <Box>
            <Button
              onClick={handleSubmit(submit)}
              type="button"
              level="primary"
              className="navbar-btn"
            >
              确定
            </Button>
          </Box>
        </Flex>
      </Box>
    </Spin>
  );
};

export default FormItem({
  type: 'my-plan-add',
  autoVar: true,
})(Add);
