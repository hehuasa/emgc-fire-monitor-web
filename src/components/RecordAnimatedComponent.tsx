/*

  语音识别动画展示组件
*/

import { Box, chakra, Center } from '@chakra-ui/react';
import { motion, isValidMotionProp } from 'framer-motion';
import React from 'react';

import { MicrophoneIconL } from '@/components/Icons';

import { CloseIcon } from '@chakra-ui/icons';

const ChakraBox = chakra(motion.div, {
  shouldForwardProp: isValidMotionProp,
});

interface Props {
  recordText: string;
  showAn: boolean;
  setShowRecord: React.Dispatch<React.SetStateAction<boolean>>;
}

const RecordAnimatedComponent = ({ recordText, showAn, setShowRecord }: Props) => {
  return (
    <Box position="fixed" w={window.innerWidth} zIndex="11" top="0" left="0" h={window.innerHeight} bg="rgba(37, 38, 49, 0.60)">
      <Box bg="pri.white.100" position="relative" h="30" px="6">
        <Center w="120" h="full">
          {recordText}
        </Center>
        <Box position="absolute" top="50%" left="50%" transform="translate(-50%,-50%)">
          <Box position="relative">
            <Box position="absolute" top="50%" left="50%" transform="translate(-50%,-50%)">
              <ChakraBox
                bg={showAn ? 'pri.gray.200' : 'pri.white.100'}
                w="17"
                h="17"
                boxShadow={showAn ? '' : '0px 0px 8px 1px rgba(119,140,162,0.4)'}
                animate={
                  showAn
                    ? {
                        scale: [1, 1.2, 1.4, 1.2, 1],
                      }
                    : undefined
                }
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                transition={{
                  duration: 1,
                  times: [0, 0.2, 0.5, 0.8, 1],
                  repeat: Infinity,
                  repeatDelay: 0,
                }}
                borderRadius="50%"
              ></ChakraBox>
            </Box>

            <Box
              bg="pri.blue.100"
              w="17"
              h="17"
              opacity={showAn ? 1 : 0}
              borderRadius="50%"
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%,-50%)"
            ></Box>
            <MicrophoneIconL
              w="6"
              h="8"
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%,-50%)"
              fill={showAn ? 'pri.white.100' : 'pri.dark.500'}
            />
          </Box>
        </Box>
        <CloseIcon
          position="absolute"
          top="6"
          right="6"
          cursor="pointer"
          _hover={{ stroke: 'pri.blue.100' }}
          onClick={() => {
            setShowRecord(false);
          }}
        />
      </Box>
    </Box>
  );
};

export default RecordAnimatedComponent;
