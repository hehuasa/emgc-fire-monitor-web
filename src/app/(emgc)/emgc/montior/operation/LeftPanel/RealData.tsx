import { IRealData } from '@/components/Charts/AlarmDetailCharts';
import { Box, HStack } from '@chakra-ui/react';
import title from '@/assets/montior/title.png';

import React from 'react';
import Image from 'next/image';
import { useIntl } from 'react-intl';
import dynamic from 'next/dynamic';
const AlarmDetailCharts = dynamic(() => import('@/components/Charts/AlarmDetailCharts'), { ssr: false });

interface IProps {
  realDatas: IRealData[];
}

const RealData = ({ realDatas }: IProps) => {
  const { formatMessage } = useIntl();

  return (
    <>
      <Box bg="pri.white.100" px="4" py="3.5" borderTopRadius="10px" mt="7" mb="1px">
        <HStack>
          <Image alt="title" src={title} />
          <Box fontSize="lg" fontWeight="bold" color="pri.dark.100">
            {formatMessage('emgc.res.liveData')}
          </Box>
        </HStack>
      </Box>
      {realDatas.map((realData) => {
        return (
          <Box key={realData.fieldCode} bg="pri.white.100" px="4" pt="4" borderBottomRadius="10px">
            <AlarmDetailCharts data={realData} />
          </Box>
        );
      })}
    </>
  );
};

export default RealData;
