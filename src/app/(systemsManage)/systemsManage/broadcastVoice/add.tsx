'use client';

import { IUploadFileRespond } from '@/models/system';
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
import { blankSpace } from '@/utils/rule';
import { getFileNameByUrl } from '@/utils/util';

interface IFormItem {
  realFileName: string;
  url: string;
  voiceName: string;
  hasUpload: boolean;
}

const Add = (props: any) => {
  const { data } = props;
  const toast = useToast();
  const methods = useForm<IFormItem>();
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitted },
    watch,
  } = methods;

  const [loading, setLoading] = useSafeState(false);
  //获取部门

  const currentFile = useRef<File>();
  const currentDelFile = useRef<string>();

  const closeDialog = useMemoizedFn(() => {
    props.onAction(null, { actionType: 'cancel', componentId: 'u:f513da49400e' });
  });

  useMount(() => {
    register('hasUpload', { required: '请选择语音文件' });
    if (props.edit) {
      const name = getFileNameByUrl(data.url);
      setValue('url', data.url);
      setValue('realFileName', data.realFileName);
      setValue('voiceName', data.voiceName);
      setValue('hasUpload', data.url ? true : false);
    }
  });

  const submit = useMemoizedFn(async (e: IFormItem) => {
    try {
      //新增和删除
      await delFile();
      await uploadFile();
      const url = !props.edit
        ? '/cx-alarm/alm/broadcast-voice/add'
        : `/cx-alarm/alm/broadcast-voice/edit/${data.id}`;

      const res = await request({
        url,
        options: {
          method: 'post',
          body: JSON.stringify({
            ...e,

            url: getValues('url') ?? undefined,
          }),
        },
      });
      if (res.code === 200) {
        props.onAction(null, { actionType: 'reload', target: 'crud' });
        closeDialog();
      } else {
        toast({
          position: 'top',
          title: res.msg,
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
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
        url: '/ms-system/file/upload_file',
        options: {
          method: 'post',
          body: formData,
          headers: {},
        },
      });
      if (res.code === 200) {
        setValue('url', res.data.url);
        return Promise.resolve();
      } else {
        setLoading(false);
        toast({
          position: 'top',
          title: res.msg,
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
        return Promise.reject(res.msg);
      }
    }
  });

  const delFile = useMemoizedFn(async () => {
    if (currentDelFile.current && currentDelFile.current === getValues('url')) {
      setValue('url', '');
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
                isInvalid={!!errors.voiceName}
              >
                <Flex alignItems="center">
                  <FormLabel mb={0} mr={0} display="flex" w="90px" fontSize="14px">
                    语音名称
                  </FormLabel>

                  <Input
                    placeholder="请输入语音文件名称"
                    {...register('voiceName', {
                      required: '请输入语音文件名称',
                      validate: (content, fieldValues) =>
                        blankSpace(content, fieldValues, '请输入语音文件名称'),
                    })}
                    w="240px"
                    fontSize="14px"
                  />
                </Flex>
                <FormErrorMessage mt={0} pl="90px">
                  {errors.voiceName ? (errors.voiceName.message as unknown as string) : null}
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
                isInvalid={!!errors.realFileName}
              >
                <Flex alignItems="center">
                  <FormLabel mb={0} mr={0} display="flex" w="90px" fontSize="14px">
                    真实文件名
                  </FormLabel>

                  <Input
                    placeholder="请输入真实文件名"
                    {...register('realFileName', {
                      required: '请输入真实文件名',
                      validate: (content, fieldValues) =>
                        blankSpace(content, fieldValues, '请输入真实文件名'),
                    })}
                    w="240px"
                    fontSize="14px"
                  />
                </Flex>
                <FormErrorMessage mt={0} pl="90px">
                  {errors.realFileName ? (errors.realFileName.message as unknown as string) : null}
                </FormErrorMessage>
              </FormControl>
            </Flex>
            <Flex alignItems="center">
              <FormControl
                mr="28px"
                mb="20px"
                alignItems="center"
                w="auto"
                isRequired
                isInvalid={!!errors.hasUpload}
              >
                <Flex alignItems="center">
                  <FormLabel mb={0} mr={0} display="flex" w="90px" fontSize="14px">
                    语音文件
                  </FormLabel>
                  <FileUpload
                    maxLength={1}
                    addChange={(e) => {
                      console.log('addChange', e);
                      if (e.length) {
                        currentFile.current = e[0].file;
                        setValue('hasUpload', true, {
                          shouldValidate: isSubmitted ? true : false,
                        });
                      } else {
                        currentFile.current = undefined;
                        setValue('hasUpload', false, {
                          shouldValidate: isSubmitted ? true : false,
                        });
                      }
                    }}
                    reduceChange={(e, d) => {
                      setValue('hasUpload', false);
                      if (e.length) {
                        currentDelFile.current = e[0].src;
                      } else {
                        currentDelFile.current = undefined;
                      }
                    }}
                    dafaultData={[data.url]}
                    boxStyle={{ h: '32px', w: 'unset' }}
                    btnText="上传语音文件支持.wav格式"
                    accept={'.wav'}
                  />
                </Flex>
                <FormErrorMessage mt={0} pl="90px">
                  {errors.hasUpload ? errors.hasUpload.message : ''}
                </FormErrorMessage>
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
  type: 'my-broadcastVoice-add',
  autoVar: true,
})(Add);
