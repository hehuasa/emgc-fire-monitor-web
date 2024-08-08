import stateView2 from '@/assets/montior/stateView0.png';
import stateView0 from '@/assets/montior/stateView2.png';
import { IAlarmDetail } from '@/models/alarm';
import { Box, HStack } from '@chakra-ui/react';
import Image from 'next/image';
import stateView1 from '../../assets/montior/stateView1.png';
import DurationTime from '../DurationTime';

// import second from 'public/'

interface IProps {
  alarmDetail: IAlarmDetail;
}
const AlarmDetail = ({ alarmDetail }: IProps) => {
  const {
    deptName,
    address,
    devName,
    alarmNo,
    alarmTypeName,
    alarmLevelName,
    alarmFirstTime,
    supplement,
    alarmUserName,
    linkPhone,
    status,
    alarmFrequency,
    alarmLastTime,
    dealUserName,
    dealTime,
    almAlarmDeals,
    dealWayView,
    durationTime,
  } = alarmDetail;

  const getSrc = (type: '01' | '02' | '03') => {
    switch (type) {
      case '01':
        return stateView0;
      case '02':
        return stateView1;
      case '03':
        return stateView2;
      default:
        return stateView0;
    }
  };
  return (
    <Box>
      <Box
        position="relative"
        bg="pri.gray.100"
        p="4"
        borderRadius="10px"
        borderColor="pri.gray.200"
        borderWidth="1px"
      >
        <Box>基本信息</Box>
        <Box position="absolute" top="0" right="4">
          <Image src={getSrc(status)} alt="" />
        </Box>
        <Box mt="4" overflow="hidden">
          <HStack w="60%" float="left">
            <Box color="pri.dark.400" alignItems="flex-start">
              报警部门:
            </Box>
            <Box flex={1}>{deptName}</Box>
          </HStack>
          <HStack w="40%" float="left">
            <Box color="pri.dark.400" alignItems="flex-start">
              报警位置:
            </Box>
            <Box flex={1}>{address}</Box>
          </HStack>
        </Box>
        <Box mt="4" overflow="hidden">
          <HStack w="60%" float="left" alignItems="flex-start">
            <Box color="pri.dark.400">报警设备:</Box>
            <Box flex={1}>{devName}</Box>
          </HStack>
          <HStack w="40%" float="left" alignItems="flex-start">
            <Box color="pri.dark.400">报警编号:</Box>
            <Box flex={1}>{alarmNo}</Box>
          </HStack>
        </Box>
        <Box mt="4" overflow="hidden">
          <HStack w="60%" float="left" alignItems="flex-start">
            <Box color="pri.dark.400">报警类型:</Box>
            <Box flex={1}>{alarmTypeName}</Box>
          </HStack>
          {process.env.NEXT_PUBLIC_ANALYTICS_Ms_type !== 'yb' && (
            <HStack w="40%" float="left" alignItems="flex-start">
              <Box color="pri.dark.400">报警级别:</Box>
              <Box color="pri.red.100">{alarmLevelName}</Box>
            </HStack>
          )}
        </Box>
        <Box mt="4" overflow="hidden">
          <HStack w="60%" float="left" alignItems="flex-start">
            <Box color="pri.dark.400">开始时间:</Box>
            <Box flex={1}>{alarmFirstTime}</Box>
          </HStack>
          <HStack w="40%" float="left" alignItems="flex-start">
            <Box color="pri.dark.400">持续时长:</Box>
            <Box></Box>
            <DurationTime durationTime={durationTime} />
          </HStack>
        </Box>
        <HStack mt="4" alignItems="flex-start">
          <Box color="pri.dark.400">警情补充:</Box>
          <Box flex={1}>{supplement}</Box>
        </HStack>
        <Box mt="4" overflow="hidden">
          <HStack w="60%" float="left" alignItems="flex-start">
            <Box color="pri.dark.400">报警人:</Box>
            <Box flex={1}>{alarmUserName}</Box>
          </HStack>
          <HStack w="40%" float="left" alignItems="flex-start">
            <Box color="pri.dark.400">联系电话:</Box>
            <Box flex={1}>{linkPhone}</Box>
          </HStack>
        </Box>
      </Box>

      <Box
        position="relative"
        mt="4"
        bg="pri.gray.100"
        p="4"
        borderRadius="10px"
        borderColor="pri.gray.200"
        borderWidth="1px"
      >
        <Box>报警处理</Box>

        <Box mt="4" overflow="hidden">
          <HStack w="60%" float="left" alignItems="flex-start">
            <Box color="pri.dark.400">处理结果:</Box>
            <Box flex={1}>{almAlarmDeals?.[0]?.dealResultView}</Box>
          </HStack>
          <HStack w="40%" float="left" alignItems="flex-start">
            <Box color="pri.dark.400">处理方式:</Box>
            <Box flex={1}>{almAlarmDeals?.[0]?.dealWayView}</Box>
          </HStack>
        </Box>
        <Box mt="4" overflow="hidden">
          <HStack w="60%" float="left" alignItems="flex-start">
            <Box color="pri.dark.400">处理人:</Box>
            <Box flex={1}>{almAlarmDeals?.[0]?.dealUserName}</Box>
          </HStack>
          <HStack w="40%" float="left" alignItems="flex-start">
            <Box color="pri.dark.400">报警次数:</Box>
            <Box flex={1}>{alarmFrequency}</Box>
          </HStack>
        </Box>
        <Box mt="4" overflow="hidden">
          <HStack w="60%" float="left" alignItems="flex-start">
            <Box color="pri.dark.400">结束时间:</Box>
            <Box flex={1}>{alarmLastTime}</Box>
          </HStack>
          <HStack w="40%" float="left" alignItems="flex-start">
            <Box color="pri.dark.400">处理时间:</Box>
            <Box flex={1}>{almAlarmDeals?.[0]?.dealTime}</Box>
          </HStack>
        </Box>
        <Box mt="4" overflow="hidden">
          <HStack w="60%" float="left" alignItems="flex-start">
            <Box color="pri.dark.400">处理说明:</Box>
            <Box flex={1}>{almAlarmDeals?.[0]?.dealExplain}</Box>
          </HStack>
        </Box>
      </Box>
    </Box>
  );
};

export default AlarmDetail;
