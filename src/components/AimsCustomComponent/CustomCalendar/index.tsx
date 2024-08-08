import { getData } from '@/components/LargeScreenApi/getApi';
import { Box, Flex } from '@chakra-ui/react';
import { useMount } from 'ahooks';
import { FormItem } from 'amis-core';
import React, { useState } from 'react';

interface IProp {
  value: string;
  onChange: (value: any) => void;
}

interface weekPlans {
  weekDates: Array<string>;
}

interface IData {
  monthPlans: Array<weekPlans>;
}

const CustomCalendar: React.FC<IProp> = ({ value, onChange }) => {
  const [data, setData] = useState<IData>();

  const getApiData = async () => {
    const res: any = await getData(
      '/cx-largescreen/ct/capacityPlan/findPlanTree?stationFlag=' +
        encodeURIComponent('3#') +
        '&year=2024'
    );
    if (res.code === 200) {
      setData(res.data);
    }
  };

  useMount(() => {
    getApiData();
  });

  return (
    <Box pos="absolute" w="99%" h="calc(100% - 220px) ">
      <Box pos="relative" w="100%" h="10%"></Box>
      <Flex
        pos="relative"
        w="100%"
        h="90%"
        wrap="wrap"
        overflowY="scroll"
        justifyContent="space-between"
      >
        {data &&
          data.monthPlans.map((month: any, index: number) => (
            <Flex key={index} pos="relative" w="33%" h="50%" border="1px solid #f00">
              <Box pos="relative" w="70%" h="100%" bgColor="#0f0">
                <Box>{month.weekPlans}</Box>;
                {month.weekPlans.map((week: any, weekIndex: number) => {
                  // <Flex key={weekIndex}>
                  //   <Box>{week.startDate}</Box>
                  //   {/* {week.weekDates.map((day: string, dayIndex: number) => (
                  //     <Box key={dayIndex}>{day}</Box>
                  //   ))} */}
                  // </Flex>;
                })}
                <Box pos="absolute" left="50%" bottom="0%" transform="translate(-50%, 0%)">
                  {index + 1 + '月计划产量'}
                </Box>
              </Box>
              <Box pos="relative" w="30%" h="100%" bgColor="#ff0"></Box>
            </Flex>
          ))}
      </Flex>
    </Box>
  );
};

export default FormItem({
  type: 'CustomCalendar',
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
})(CustomCalendar);
