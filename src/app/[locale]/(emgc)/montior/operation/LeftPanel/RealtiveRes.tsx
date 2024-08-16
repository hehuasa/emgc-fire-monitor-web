import { Box, HStack, Flex, Center, Icon } from '@chakra-ui/react';

import title from '@/assets/montior/title.png';

import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { AiOutlinePlayCircle } from 'react-icons/ai';
import { useSetRecoilState } from 'recoil';

import { currentResModel, IResItem } from '@/models/resource';

interface IProps {
  showRealDatas: boolean;
  resList: IResItem[];
}

const RealtiveRes = ({ showRealDatas, resList }: IProps) => {
  const formatMessage = useTranslations("base");
  const setCurrentRes = useSetRecoilState(currentResModel);

  const handleClick = (item: IResItem) => {
    setCurrentRes(item);
  };

  return (
    <>
      <Box bg="pri.white.100" px="4" py="3.5" borderTopRadius="10px" mt={showRealDatas ? '4' : '7'} mb="1px">
        <HStack>
          <Image alt="title" src={title} />
          <Box fontSize="lg" fontWeight="bold" color="pri.dark.100">
            {formatMessage('resource.relation.res')}
          </Box>
        </HStack>
      </Box>
      <Box bg="pri.white.100" px="4" py="3" borderBottomRadius="10px">
        {resList.map((item, index) => {
          return (
            <Flex
              key={item.id}
              color="pri.dark.500"
              _hover={{ color: 'pri.dark.100' }}
              cursor="pointer"
              justify="space-between"
              lineHeight="36px"
              onClick={() => {
                handleClick(item);
              }}
            >
              <HStack>
                <Box color="pri.dark.100">{`${index + 1}. `}</Box>
                <Box>{item.resourceName}</Box>
              </HStack>
              <Center>
                <Icon cursor="pointer" w="5" h="5" mt="1" _hover={{ fill: 'pri.dark.100' }} as={AiOutlinePlayCircle} />
              </Center>
            </Flex>
          );
        })}
      </Box>
    </>
  );
};

export default RealtiveRes;
