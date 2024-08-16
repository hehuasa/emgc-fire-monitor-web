import { Box, HStack, useOutsideClick } from '@chakra-ui/react';
import { useSafeState } from 'ahooks';
import { broadcastVisibleModel, accessControltVisibleModel } from '@/models/map';
import { useSetRecoilState } from 'recoil';
import { AccessControl, VoiceIcon } from '@/components/Icons';
import { useRef } from 'react';
import { useTranslations } from 'next-intl'

interface Props {
  closeShowType: () => void;
}

type openType = 'broadcast' | 'accessControl' | '';

const LinkageQquipment = ({ closeShowType }: Props) => {
  const formatMessage = useTranslations("base");

  const [showType, setShowType] = useSafeState<openType>('');
  const boxRef = useRef<null | HTMLDivElement>(null);
  const setBroadcastVisible = useSetRecoilState(broadcastVisibleModel);
  const setAccessControlVisible = useSetRecoilState(accessControltVisibleModel);

  useOutsideClick({
    ref: boxRef,
    handler: () => {
      //closeShowType();
    },
  });

  return (
    <Box
      position="absolute"
      boxShadow=" 0px 3px 6px 1px rgba(119,140,162,0.16);"
      borderRadius="12px"
      top="14"
      //right="206"
      zIndex={3}
      bg="pri.white.100"
      p="2.5"
      ref={boxRef}
    >
      <HStack
        onClick={() => {
          closeShowType();
          setBroadcastVisible(true);
        }}
        borderRadius="12px"
        my="1"
        p="2.5"
        bg="pri.gray.500"
        _hover={{ color: 'pri.blue.100', fill: 'pri.blue.100' }}
        color={showType === 'broadcast' ? 'pri.blue.100' : 'pri.dark.500'}
        fill={showType === 'broadcast' ? 'pri.blue.100' : 'pri.dark.500'}
        cursor="pointer"
      >
        <VoiceIcon w="16px" />
        <Box>{formatMessage('broadcasting')}</Box>
      </HStack>
      <HStack
        onClick={() => {
          closeShowType();
          setAccessControlVisible(true);
        }}
        borderRadius="12px"
        my="1"
        p="2.5"
        bg="pri.gray.500"
        _hover={{ color: 'pri.blue.100', fill: 'pri.blue.100' }}
        color={showType === 'accessControl' ? 'pri.blue.100' : 'pri.dark.500'}
        fill={showType === 'accessControl' ? 'pri.blue.100' : 'pri.dark.500'}
        cursor="pointer"
      >
        <AccessControl w="16px" />
        <Box>{formatMessage('accessControl')}</Box>
      </HStack>
    </Box>
  );
};

export default LinkageQquipment;
