import { Box, HStack } from '@chakra-ui/react';
import { useSafeState } from 'ahooks';
import { HandleAlarmIcon, SpaceSquare } from '@/components/Icons';
import { handleAlarmModel } from '@/models/alarm';
import { useSetRecoilState } from 'recoil';
import { isSpaceQueryingModel } from '@/models/map';

interface IProps {
  close: () => void;
  areaName: string;
  latlng: number[];
  areaId: string;
}

const RightClickMenu = ({ close, areaName, areaId, latlng }: IProps) => {
  // 查周边矩形
  const [spaceQueryCircle, setSpaceQueryCircle] = useSafeState(false);

  // 查周边圆形
  const setSpaceQuerySquare = useSetRecoilState(isSpaceQueryingModel);

  const setAlarmOpen = useSetRecoilState(handleAlarmModel);
  return (
    <Box
      fontSize="16px"
      bg="pri.white.100"
      borderRadius="12px"
      boxShadow="0px 3px 6px 1px rgb(119,140,162)"
      p="2.5"
    >
      <HStack
        borderRadius="12px"
        my="1"
        p="2.5"
        bg="pri.gray.500"
        _hover={{ color: 'pri.blue.100', fill: 'pri.blue.100' }}
        color={spaceQueryCircle ? 'pri.blue.100' : 'pri.dark.500'}
        cursor="pointer"
        onClick={(e) => {
          e.stopPropagation();
          setAlarmOpen({ visible: true, param: { areaName, areaId, latlng } });
          close();
        }}
      >
        <HandleAlarmIcon w="4" h="4" />

        <Box>人工报警</Box>
      </HStack>
      {/* <HStack
        onClick={(e) => {
          e.stopPropagation();
          setSpaceQueryCircle(!spaceQueryCircle);
          close();
        }}
        borderRadius="12px"
        my="1"
        p="2.5"
        bg="pri.gray.500"
        _hover={{ color: 'pri.blue.100', fill: 'pri.blue.100' }}
        color={spaceQueryCircle ? 'pri.blue.100' : 'pri.dark.500'}
        fill={spaceQueryCircle ? 'pri.blue.100' : 'pri.dark.500'}
        cursor="pointer"
      >
        <SpaceCircle w="3.5" h="3.5" />

        <Box>查周边（圆形）</Box>
      </HStack> */}
      <HStack
        onClick={(e) => {
          e.stopPropagation();
          setSpaceQuerySquare(true);
          close();
        }}
        borderRadius="12px"
        my="1"
        p="2.5"
        bg="pri.gray.500"
        _hover={{ color: 'pri.blue.100', fill: 'pri.blue.100' }}
        // color={spaceQuerySquare ? 'pri.blue.100' : 'pri.dark.500'}
        // fill={spaceQuerySquare ? 'pri.blue.100' : 'pri.dark.500'}
        cursor="pointer"
      >
        <SpaceSquare w="3.5" h="3.5" />

        <Box>查周边（矩形）</Box>
      </HStack>
    </Box>
  );
};

export default RightClickMenu;
