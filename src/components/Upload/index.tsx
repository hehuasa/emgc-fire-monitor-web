'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Box, Flex, HStack, Input, Stack, useToast, BoxProps } from '@chakra-ui/react';
import { useMemoizedFn } from 'ahooks';
import cloneDeep from 'lodash/cloneDeep';
import { SmallCloseIcon } from '@chakra-ui/icons';
import { ZoomInImage } from './downLoadFiles';
import { download } from './downLoadFiles';
import { getFileNameByUrl } from '@/utils/util';

//判断图片类型
export const isImg = (name: string) => {
  return /\.(gif|jpg|jpeg|png|webp)$/i.test(name);
};

type IDefatltData = string[];

export type IfileItem = {
  name: string;
  isPic: boolean;
  src?: string;
  file?: File;
  Uploaded?: boolean;
};

interface Props {
  addChange?: (data: IfileItem[]) => void;
  dafaultData?: IDefatltData;
  reduceChange?: (data: IfileItem[], currentDelingItem: IfileItem) => void;
  maxLength?: number;
  btnText?: string;
  boxStyle?: BoxProps;
  accept?: string;
}

const FileUpload = ({
  addChange,
  dafaultData,
  reduceChange,
  maxLength = 5,
  btnText = '+ 点击上传图片/附件',
  boxStyle,
  accept,
}: Props) => {
  const [uploadFiles, setUploadFiles] = useState<IfileItem[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const toast = useToast();
  const redueceFile = useRef<IfileItem[]>([]);

  const isBackfill = useRef(false);

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = useMemoizedFn(
    async ({ target }) => {
      const files = target.files;
      const file = files?.[0];

      handleFiles(files, uploadFiles);
      //每次上传完成之后清空input
      target.value = '';
    }
  );

  //编辑的时候回填
  useEffect(() => {
    const arr: IfileItem[] = [];
    if (dafaultData && dafaultData.length && !isBackfill.current) {
      dafaultData.forEach((item) => {
        if (item) {
          const name = getFileNameByUrl(item);
          arr.push({ name, src: item, isPic: isImg(item), Uploaded: true });
        }
        isBackfill.current = true;
      });

      setUploadFiles(arr);
    }
  }, [dafaultData]);

  const handleFiles = (files: FileList | null, uploadFiles: IfileItem[]) => {
    //上传文件数量限制为5个
    if (files?.length && files?.length + uploadFiles.length > maxLength) {
      toast({
        title: `上传文件数量限制为${maxLength}个`,
        position: 'top',
        status: 'warning',
        isClosable: true,
      });
      return;
    }
    if (files) {
      const uploadFiles_d = cloneDeep(uploadFiles);

      for (const file of files) {
        const isPic = isImg(file.name);
        const obj: IfileItem = { name: file.name, src: '', isPic, file };
        uploadFiles_d.push(obj);
        // 是图片类型，执行预览的逻辑
        if (isPic) {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = () => {
            if (fileReader.result) {
              obj.src = fileReader.result as string;
            }
            setUploadFiles(uploadFiles_d);
          };
        } else {
          setUploadFiles(uploadFiles_d);
        }
      }

      const arr = uploadFiles_d.filter((item) => !item.Uploaded);
      addChange?.(arr);
    }
  };

  const upload = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const delItem = useCallback(
    (i: number, item: IfileItem) => {
      const list = uploadFiles.filter((_, index) => index !== i);
      setUploadFiles(list);

      if (item.Uploaded) {
        redueceFile.current.push(item);

        reduceChange?.(redueceFile.current, item);
      }
    },
    [uploadFiles]
  );

  return (
    <Box>
      {uploadFiles.length < maxLength ? (
        <Flex
          onClick={upload}
          justifyContent="center"
          fontSize={14}
          color="blue.200"
          cursor="pointer"
          border="1px"
          padding={1}
          w={160}
          h="48px"
          alignItems="center"
          borderRadius={5}
          {...boxStyle}
        >
          {btnText}
        </Flex>
      ) : null}

      <Input
        type="file"
        display="none"
        accept={accept}
        onChange={handleFileChange}
        multiple
        ref={inputRef}
      />
      {uploadFiles.length ? (
        <>
          <Stack spacing="14px" mt="10px" mb="10px">
            {uploadFiles
              .filter((item) => !item.isPic)
              .map((item, index) => {
                return (
                  <Flex alignItems="center" key={index + 'npic'} position="relative">
                    <Box
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                      cursor={item.Uploaded && item.src ? 'pointer' : 'default'}
                      onClick={() => {
                        if (item.Uploaded && item.src) {
                          download(item.src);
                        }
                      }}
                    >
                      {item.name}
                    </Box>
                    <SmallCloseIcon
                      fontSize="24px"
                      cursor="pointer"
                      onClick={() => delItem(index, item)}
                    />
                  </Flex>
                );
              })}
          </Stack>
          <HStack spacing={'8px'}>
            {uploadFiles
              .filter((item) => item.isPic)
              .map((item, index) => {
                return (
                  <Box key={index + 'pic'} w={112} h={112} position="relative">
                    <SmallCloseIcon
                      fontSize="24px"
                      cursor="pointer"
                      position="absolute"
                      top="0px"
                      right="0px"
                      onClick={() => delItem(index, item)}
                    />
                    <ZoomInImage url={item.src!} w="100%" height="100%" />
                  </Box>
                );
              })}
          </HStack>
        </>
      ) : null}
    </Box>
  );
};

export default FileUpload;
