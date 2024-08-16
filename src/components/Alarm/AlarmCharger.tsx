import { request } from '@/utils/request';
import Image from 'next/image';

import { Box, Flex, HStack } from '@chakra-ui/react';
import { useMount } from 'ahooks';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl'
import { CircleClose, PhoneIcon } from '../Icons';
import nodata from '@/assets/montior/nodata.png';
import { createGetUrl } from '@/utils/util';
import { callNumberVisibleModel } from '@/models/callNumber';
import { useSetRecoilState } from 'recoil';

interface IAlarmCharger {
  chargeName: string;
  chargePhone: string;
}
const AlarmCharger = ({ areaId, alarmType, handleClose }: { areaId: string; alarmType?: string; handleClose: () => void }) => {
  const formatMessage = useTranslations("base");
  const setCallNumberShow = useSetRecoilState(callNumberVisibleModel);
  const [users, setusers] = useState<IAlarmCharger[]>([]);
  useMount(() => {
    getData();
  });
  const getData = async () => {
    const url = `/cx-alarm/alm/alarm/findAlarmCharger${createGetUrl({ areaId, alarmType })}`;
    const res = await request<IAlarmCharger[]>({ url });
    if (res.code === 200) {
      setusers(res.data);
    }
  };

  return (
    <Box position="absolute" zIndex={2} right="-100" bottom="80" w="94" bg="pri.white.100" borderRadius="10px">
      <Flex borderTopRadius="10px" h="12" bg="pri.gray.100" lineHeight="48px" justify="space-between" align="center" px="5">
        <Box color="pri.dark.100">{formatMessage({ id: 'alarm.director.user' })}</Box>

        <CircleClose cursor="pointer" w="5" h="5" onClick={handleClose} fill="pri.dark.500" />
      </Flex>
      <Box borderBottomRadius="10px" px="5">
        {users.length === 0 ? (
          <Flex
            w="85"
            h="50"
            bg="pri.white.100"
            boxShadow="0px 3px 6px 1px rgba(119,140,162,0.1)"
            flexDir="column"
            justify="center"
            align="center"
          >
            <Image width={154} height={124} src={nodata} alt={formatMessage({ id: 'alarm.nodata' })} />
            <Box fontSize="lg" color="pri.dark.500">
              {/* {formatMessage({ id: 'alarm.nodata' })} */}
              暂无场站负责人数据
            </Box>
          </Flex>
        ) : (
          <>
            {users.map((item, index) => {
              return (
                <Box key={item.chargePhone + index} my="4">
                  <HStack cursor="pointer">
                    <Box>{item.chargeName}</Box>
                    <HStack
                      //onClick={() => callNumber({ name: item.chargeName, number: item.chargePhone })}
                      onClick={() => {
                        setCallNumberShow({ visible: true, name: item.chargeName, number: item.chargePhone });
                      }}
                      _hover={{ color: 'pri.blue.200', fill: 'pri.blue.200' }}
                      color="pri.blue.100"
                      fill="pri.blue.100"
                    >
                      <Box>{item.chargePhone}</Box>
                      <PhoneIcon />
                    </HStack>
                  </HStack>
                </Box>
              );
            })}
          </>
        )}
      </Box>
    </Box>
  );
};

export default AlarmCharger;
