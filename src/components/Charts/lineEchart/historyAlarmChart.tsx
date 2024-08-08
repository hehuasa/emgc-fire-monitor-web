import { Box } from '@chakra-ui/react';
import { Ref, forwardRef, useImperativeHandle, useRef } from 'react';
import * as echarts from 'echarts';
import { useUnmount } from 'ahooks';
import { transformSize } from '@/utils/tools/webTools';
import { recordTableType } from '@/models/sms';

export interface dataType {
  row: recordTableType | undefined;
}

interface paramsType {
  dates: Array<string>;
  // data: Array<Array<[string, number | string]>>;
  // thresholdStart1Data: Array<Array<[string, number | string]>>;
  // thresholdStart0Data: Array<Array<[string, number | string]>>;
  // thresholdEnd3Data: Array<Array<[string, number | string]>>;
  // thresholdEnd2Data: Array<Array<[string, number | string]>>;
  series: Array<unknown>;
  legend: Array<string>;
}

export interface chartRef {
  setOptions: ({ dates, series, legend }: paramsType) => void;
}

const HistoryAlarmChart = (_: unknown, ref: Ref<chartRef>) => {
  const lineChartRef = useRef<echarts.ECharts>();
  const chartDom = useRef<HTMLDivElement>(null);
  // const chartDataRef = useRef<IRealData[]>();
  const initChart = ({ dates, series, legend }: paramsType) => {
    if (lineChartRef.current) {
      lineChartRef.current.dispose();
    }
    const option = {
      grid: {
        top: '20%',
        left: '3%',
        right: '3%',
        bottom: '5%',
        containLabel: true,
      },
      title: [
        {
          show: true,
          text: '历史报警趋势',
          left: '2%',
          textStyle: {
            color: '#000',
            fontSize: transformSize(14),
            fontWeight: '400',
          },
        },
      ],
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: legend,
      },
      xAxis: {
        type: 'time',
        min: dates[0],
        max: dates[1],
        // 坐标轴两边留白策略
        // boundaryGap: true,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#000',
          },
        },
        // 坐标轴文字标签
        axisLabel: {
          textStyle: {
            color: '#000',
            fontSize: 14,
          },
          margin: transformSize(22),
        },
        axisTick: {
          show: true,
          length: transformSize(5),
          // 坐标与标签刻度对齐
          alignWithLabel: true,
        },
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false,
          lineStyle: {
            type: 'solid',
            color: '#000',
            opacity: 0.2,
          },
        },
        // 坐标轴文字标签
        axisLabel: {
          textStyle: {
            color: '#000',
            fontSize: 14,
          },
          margin: transformSize(15),
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: 'solid',
            color: '#000',
            opacity: 0.3,
          },
        },
      },
      series: series,
    };
    const chartRef = echarts.init(chartDom.current!);
    chartRef.setOption(option);
    lineChartRef.current = chartRef;
  };

  useImperativeHandle(ref, () => ({
    setOptions: initChart,
  }));

  useUnmount(() => {
    lineChartRef.current?.dispose();
    chartDom.current?.remove();
  });

  return <Box width={'full'} h={'300px'} ref={chartDom}></Box>;
};

const historyAlarmChartRef = forwardRef(HistoryAlarmChart);

export default historyAlarmChartRef;
