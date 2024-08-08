import level0 from '@/assets/thunderAndLightning/level0.png';
import level1 from '@/assets/thunderAndLightning/level1.png';
import level2 from '@/assets/thunderAndLightning/level2.png';
import level3 from '@/assets/thunderAndLightning/level3.png';
import { request } from '@/utils/request';
import { Box, StyleProps } from '@chakra-ui/react';
import { useMemoizedFn, useMount, useSafeState, useUnmount } from 'ahooks';
import { useMemo, useRef } from 'react';

type IData = {
  fieldCode: string;
  fieldName: string;
  describe: null;
  precision: null;
  unit: null;
  value: null;
  time: null;
};

const ThunderAndLightning = (outContainerStyle: StyleProps) => {
  const timer = useRef<NodeJS.Timer>();
  const [level, setLevel] = useSafeState(0);

  const getData = useMemoizedFn(async () => {
    const id = 'c46d9a61-dc34-a5c9-e37a-7e092a9a4407';
    const url = `/device-manger/device/device_data_last?deviceId=${id}`;
    const res = await request<IData[]>({
      url,
    });

    if (res.code === 200) {
      const lastData = res.data[5];
      setLevel(lastData?.value || 0);
    }
  });

  useMount(() => {
    timer.current = setInterval(() => {
      getData();
    }, 10000);
    getData();
  });

  useUnmount(() => {
    clearInterval(timer.current);
  });

  const url = useMemo(() => {
    switch (level) {
      case 1:
        return level1.src;
      case 2:
        return level2.src;
      case 3:
        return level3.src;
      default:
        return level0.src;
    }
  }, [level]);

  return (
    <Box {...outContainerStyle}>
      <Box w="72px" h="67px" backgroundImage={url} backgroundSize={'100% 100%'} backgroundRepeat="no-repeat"></Box>
    </Box>
  );
};

export default ThunderAndLightning;
