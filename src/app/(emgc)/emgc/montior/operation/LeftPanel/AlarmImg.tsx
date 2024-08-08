import { ArrowIcon } from '@/components/Icons';
import { IAlarmDetail } from '@/models/alarm';
import {
  Box,
  chakra,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  shouldForwardProp,
  useDisclosure,
} from '@chakra-ui/react';
import { useMemoizedFn } from 'ahooks';
import { isValidMotionProp, motion, useAnimation } from 'framer-motion';
import React, { useRef } from 'react';
//import Image from 'next/image';

const ChakraBox = chakra(motion.div, {
  /**
   * Allow motion props and non-Chakra props to be forwarded.
   */
  shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
});

interface Props {
  data: IAlarmDetail['suppData'];
}

const Img: React.FC<Props> = ({ data }) => {
  console.log('报警data', data);
  const init = 1500;
  const index = useRef(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const controls = useAnimation();
  const imgData = data.filter((item) => item.infoType === 1);

  const move = useMemoizedFn((type: 'left' | 'right') => {
    if (type === 'left') {
      if (index.current === 0) {
        return;
      }
      index.current = index.current - 1;
    } else {
      // 除以2是因为里面只有一半是图片
      if (index.current === imgData.length - 1) {
        return;
      }
      index.current = index.current + 1;
    }
    controls.start({
      transform: `translateX(-${index.current * init}px)`,
      transition: { duration: 0.2 },
    });
  });

  const openMaxImg = (id: string) => {
    const index_ = imgData.findIndex((item) => id === item.id);
    index.current = index_;
    onOpen();
  };

  //数据中第一个是图片，第二个是图片说明以此类推
  return (
    <Flex flexWrap="wrap">
      {data.map((item, index) => {
        if (item.infoType === 1) {
          const info = data[index + 1];
          return (
            <Flex
              w="full"
              cursor="zoom-out"
              onClick={() => openMaxImg(item.id)}
              mb="10px"
              key={item.id}
              h="100px"
              alignItems="center"
            >
              <Image
                userSelect="none"
                src={item.infoValue}
                alt="Picture of the author"
                w={102}
                h={102}
              />
              {info ? (
                <Box ml="2" flex={1} wordBreak="break-all">
                  {info.infoName}:{info.infoValue}
                </Box>
              ) : null}
            </Flex>
          );
        }
        return null;
      })}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        onCloseComplete={() => {
          index.current = 0;
        }}
      >
        <ModalOverlay />
        <ModalContent w="unset" maxW={`${init}px`}>
          <ModalHeader
            py="0"
            textAlign="left"
            lineHeight="2.75rem"
            fontSize="lg"
            fontWeight="normal"
            bg="pri.gray.100"
            borderRadius="10px"
          >
            报警图片
          </ModalHeader>
          <ModalCloseButton h="11" top="0" lineHeight="2.75rem" />
          <ModalBody p={0} h="600px" color="pri.dark.100" bg="pri.white.100" borderRadius="10px">
            <Box w="100%" h="100%" position="relative" overflow="hidden">
              <ChakraBox
                initial={{
                  transform: `translateX(-${index.current * init}px)`,
                }}
                display="flex"
                w={init * imgData.length + 'px'}
                h="100%"
                animate={controls}
                position="relative"
              >
                {imgData.map((item, index) => {
                  return (
                    <Box onClick={onOpen} key={item.id} w={`${init}px`} h="100%">
                      <Image
                        userSelect="none"
                        src={item.infoValue}
                        alt="Picture of the author"
                        w={'100%'}
                        h="760px"
                      />
                    </Box>
                  );
                })}
              </ChakraBox>
              <Flex
                onClick={() => move('left')}
                justifyContent="center"
                alignItems="center"
                position="absolute"
                top="50%"
                left={0}
                w="50px"
                h="50px"
                cursor="pointer"
                transform="translate(0px, -50%)"
              >
                <ArrowIcon fontSize={'60px'} transform="rotate(90deg)" />
              </Flex>
              <Flex
                onClick={() => move('right')}
                justifyContent="center"
                alignItems="center"
                position="absolute"
                top="50%"
                right={0}
                w="50px"
                h="50px"
                cursor="pointer"
                transform="translate(0px, -50%)"
              >
                <ArrowIcon fontSize={'60px'} transform="rotate(-90deg)" />
              </Flex>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Img;
