'use client';
import { request } from '@/utils/request';
import {
  AlertDialog,
  AlertDialogBody,
  useToast,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useRef } from 'react';

const InitData = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);
  const toast = useToast();
  const resetCounts = async () => {
    const url = `/cx-alarm/ext/personnelRecord/clearPersonnel`;

    const res = await request({
      url,
      options: {
        method: 'DELETE',
      },
    });

    if (res && res.code === 200) {
      toast({
        position: 'top',
        title: '操作成功',
        duration: 2000,
        isClosable: true,
      });
    } else {
      toast({
        colorScheme: 'red',
        title: '操作失败',
        description: res.msg,
        duration: 2000,
        isClosable: true,
      });
    }

    onClose();
  };
  return (
    <Box>
      <Button my="4" ml="8" colorScheme="blue" onClick={onOpen}>
        在厂人数统计清零
      </Button>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>请确认</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>请确认是否执行操作？</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              否
            </Button>
            <Button colorScheme="red" ml={3} onClick={resetCounts}>
              是
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Box>
  );
};

export default InitData;
