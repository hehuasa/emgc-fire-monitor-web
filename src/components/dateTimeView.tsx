import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { Box, Grid, GridItem, HStack, Icon, Text } from '@chakra-ui/react';
import { useMemoizedFn, useMount } from 'ahooks';
import moment from 'moment';
import { useState } from 'react';

const mouths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const DateTimeView = () => {
  const [dateType, setDateType] = useState('year');

  useMount(() => {
    // 获取当天日期
  });

  return (
    <Box w={'full'} p={2}>
      <Years></Years>
    </Box>
  );
};

const Years = () => {
  const [yearEraData, setYearEraData] = useState<number[]>([]);
  const [currentYear, setCurrentYear] = useState<number>(0);
  const [currentMouth, setCurrentMouth] = useState<number>(0);
  const [dateType, setDateType] = useState<'year' | 'mouth' | 'day'>('year');

  useMount(() => {
    const year = new Date().getFullYear();
    const mouth = new Date().getMonth();
    const maxYear = moment().add(6, 'y').year();
    const minYear = moment().subtract(6, 'y').year();
    setCurrentYear(year);
    if (year) {
      setCurrentMouth(mouth + 1);
    }
    const years = [];
    for (let index = minYear; index < maxYear; index++) {
      years.push(index);
    }
    setYearEraData(years);
  });

  const handleChangeDate = useMemoizedFn(() => {
    if (dateType === 'year') {
      return;
    }
    if (dateType === 'mouth') {
      setDateType('year');
    }
  });

  const handleLastYear = useMemoizedFn((currentYear: number) => {
    const lastYear = moment([currentYear]).subtract(1, 'y').year();
    setCurrentYear(lastYear);
  });
  const handleNextYear = useMemoizedFn((currentYear: number) => {
    const nextYear = moment([currentYear]).add(1, 'y').year();
    setCurrentYear(nextYear);
  });

  const handleSelectYear = useMemoizedFn((year: number) => {
    setCurrentYear(year);
    const fullYear = new Date().getFullYear();
    if (year === fullYear) {
      const mouth = new Date().getMonth();
      setCurrentMouth(mouth + 1);
    } else {
      setCurrentMouth(0);
    }

    setDateType('mouth');
    console.log('year', year, fullYear);
  });
  const handleSelectMouth = useMemoizedFn((mouth: number) => {
    setCurrentMouth(mouth);
    setDateType('day');
  });

  return (
    <Box w={'full'}>
      <HStack w={'full'} justifyContent={'space-between'}>
        <Box>
          <Icon as={ArrowBackIcon} onClick={() => handleLastYear(currentYear)}></Icon>
        </Box>
        <Text
          px={2}
          py={1}
          onClick={handleChangeDate}
          _hover={{
            bg: dateType !== 'year' ? 'gray.200' : '',
            cursor: dateType !== 'year' ? 'pointer' : '',
          }}
        >
          {currentYear}
        </Text>
        <Box>
          <Icon as={ArrowForwardIcon} onClick={() => handleNextYear(currentYear)}></Icon>
        </Box>
      </HStack>
      <Box w={'full'} mt={2}>
        <Grid templateColumns={'repeat(3,1fr)'} textAlign={'center'} justifyItems={'center'}>
          {dateType === 'year' &&
            yearEraData.map((year) => (
              <GridItem
                key={year}
                padding={2}
                cursor="pointer"
                textAlign={'center'}
                w={14}
                _hover={{
                  bg: currentYear === year ? '' : 'pri.gray.100',
                }}
                className={currentYear === year ? 'dateActive' : ''}
                onClick={() => handleSelectYear(year)}
              >
                {year}
              </GridItem>
            ))}
          {dateType === 'mouth' &&
            mouths.map((mouth) => (
              <GridItem
                key={mouth}
                padding={2}
                cursor="pointer"
                textAlign={'center'}
                w={14}
                _hover={{
                  bg: currentMouth === mouth ? '' : 'pri.gray.100',
                }}
                className={currentMouth === mouth ? 'dateActive' : ''}
                onClick={() => handleSelectMouth(mouth)}
              >
                {mouth}月
              </GridItem>
            ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default DateTimeView;
