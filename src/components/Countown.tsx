'use client';
import { Box, Flex } from '@chakra-ui/react';
import { useCountDown, useUnmount } from 'ahooks';
import moment from 'moment';
import { useRef } from 'react';

const Countown = ({ countTime }: { countTime: number }) => {
  const timer = useRef<NodeJS.Timer | null>(null);
  const [countdown] = useCountDown({
    leftTime: countTime,
  });

  useUnmount(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  });

  return (
    <Flex
      pos="absolute"
      top="120%"
      left="50%"
      transform="translate(-50%, -50%)"
      fontSize="12px"
      color="#f00"
      whiteSpace="nowrap"
      pointerEvents={'none'}
      alignItems="center"
    >
      {countdown ? (
        <>
          <Box>禁用时长:</Box>
          <Box>{moment.utc(countdown).format('HH:mm:ss')}</Box>
        </>
      ) : (
        ''
      )}
    </Flex>
  );
};

export default Countown;
