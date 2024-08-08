import { requestUpload } from '@/utils/request';
import { ArrowUpIcon } from '@chakra-ui/icons';
import { Button, ButtonProps, Input, useToast } from '@chakra-ui/react';
import { useMemoizedFn } from 'ahooks';
import React, { useRef, useState } from 'react';

export interface IUploadRes {
  fileName: string;
  realFileName: string;
  url: string;
  showUrl: string;
}

interface propsType extends ButtonProps {
  action: string;
  autoUpload?: boolean;
  name?: string; //上传的目标字段,默认为file
  btnText?: string; // 跟children互斥
  onSuccess?: (arg: any) => void; //成功的回调
  onError?: (arg: any) => void; // 失败的回调
  uploadCallBack?: (file: File) => void;
  children?: JSX.Element;
  accept?: string; //格式限制
  fileSize?: number;
  stationFlag?: string;
}

// 上传文件
const Upload = ({
  action,
  autoUpload = true,
  name = 'file',
  btnText = '上传',
  onSuccess,
  onError,
  uploadCallBack,
  accept,
  fileSize,
  children,
  stationFlag,
  ...rest
}: propsType) => {
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePickFile = useMemoizedFn(() => {
    if (!loading) {
      inputRef.current?.click();
    }
  });
  const handleFileChange = useMemoizedFn((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files || [];

    for (let index = 0; index < files.length; index++) {
      //文件大小限制
      if (fileSize && files[0].size > fileSize * 1024 * 1024) {
        toast({ title: `不能超过${fileSize}M`, position: 'top', status: 'warning' });
        (inputRef.current as HTMLInputElement).value = '';
        return;
      }
      if (uploadCallBack) {
        autoUpload && uploadCallBack(files[index]);
      } else {
        autoUpload && uploadFile(files[index]);
      }
    }
    (inputRef.current as HTMLInputElement).value = '';
  });

  const uploadFile = useMemoizedFn(async (file: File) => {
    const formData = new FormData();
    formData.append(name, file);
    setLoading(true);

    const { code, data, msg } = await requestUpload<IUploadRes>({
      url: action,
      options: {
        method: 'post',
        body: formData,
        headers: stationFlag
          ? {
              'x-station': stationFlag || '',
            }
          : {},
      },
    });

    if (code == 200) {
      onSuccess && onSuccess(data);
      toast({
        title: '操作成功',
        position: 'top',
        status: 'success',
      });
    } else {
      onError && onError(data);
      toast({
        title: msg || '操作失败',
        position: 'top',
        status: 'error',
        description: 2000,
        isClosable: true,
      });
    }
    setLoading(false);
  });

  return (
    <>
      <Input
        accept={accept}
        type={'file'}
        display="none"
        ref={inputRef}
        onChange={handleFileChange}
      />
      {!children ? (
        <Button
          leftIcon={<ArrowUpIcon />}
          loadingText={btnText + '中'}
          isLoading={loading}
          onClick={handlePickFile}
          {...rest}
        >
          {btnText}
        </Button>
      ) : (
        React.Children?.map(children, (child: any) => {
          return React.cloneElement(child, {
            onClick: handlePickFile,
            cursor: 'pointer',
          });
        })
      )}
    </>
  );
};

export default Upload;
