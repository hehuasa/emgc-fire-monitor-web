import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { Box } from '@chakra-ui/react';

type EChartsOption = echarts.EChartsOption;
type dayType = '01' | '02' | '03';

const formData = new FormData();
formData.append('codeTypeCode', '131');

const AlarmTrend = () => {
  const dom = useRef<HTMLDivElement | null>(null);

  const mycharts = useRef<echarts.ECharts>();

  useEffect(() => {
    const op: EChartsOption = {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: [820, 932],
          type: 'line',
          smooth: true,
        },
      ],
    };
    mycharts.current = echarts.init(dom.current!);
    mycharts.current.setOption(op);
  }, []);

  return <Box ref={dom} flex={1} h="400px" position="relative" w="400px"></Box>;
};

export default AlarmTrend;
