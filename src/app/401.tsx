'use client';
import { Box, Button, Flex } from '@chakra-ui/react';
import Image from 'next/image';
import React from 'react';
import noAuth from '@/assets/layout/401.png';
import { useRouter } from 'next/navigation';
const NoAuth = () => {
  const router = useRouter();
  return (
    <Box w="full" h="full" position="relative">
      <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)">
        <Box w="80%" h="80%" ml="10%">
          <Image src={noAuth} alt="" />
        </Box>
        <Box position="absolute" top="35%" left="50%" transform="translate(0, -50%)" color="font.100">
          <Box fontSize="40px">抱歉！</Box>
          <Box>您的请求被拒绝，您可以点击</Box>
          <Box>下方按钮，返回首页或重新登录。</Box>
        </Box>
        <Flex justify="space-around" color="pri.backs.200">
          <Button
            ml="24"
            bg="pri.blue.400"
            _hover={{
              bg: 'pri.blue.300',
              color: 'pri.blue.400',
            }}
            onClick={() => {
              router.push('/emgc/monitor/operation');
            }}
          >
            返回首页
          </Button>
          <Button
            ml="24"
            bg="pri.blue.400"
            _hover={{
              bg: 'pri.blue.300',
              color: 'pri.blue.400',
            }}
            onClick={() => {
              router.push('/login');
            }}
          >
            返回登录页
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default NoAuth;
