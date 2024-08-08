import { Box, Flex } from '@chakra-ui/react';
import { useMemoizedFn, useMount, useSafeState, useUnmount } from 'ahooks';
import { useRef } from 'react';

const Process = () => {
  //初始化点的格式

  const timer = useRef<NodeJS.Timer>();
  const [pointCount, setPointCount] = useSafeState(1);

  const animate = useMemoizedFn(() => {
    timer.current = setInterval(() => {
      setPointCount((v) => {
        if (v === 3) {
          return 0;
        }
        return v + 1;
      });
    }, 500);
  });

  useMount(() => {
    animate();
  });

  useUnmount(() => {
    clearInterval(timer.current);
  });

  return (
    <Flex>
      {Array.from({ length: pointCount }).map((_, index) => (
        <Box key={index}>.</Box>
      ))}
    </Flex>
  );
};

export default Process;
