import React, { useRef } from 'react';

import * as echarts from 'echarts/core';
import { EChartsOption } from 'echarts';
import { CanvasRenderer } from 'echarts/renderers';
import { GridComponent, DataZoomComponent, TitleComponent, TooltipComponent, ToolboxComponent } from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';

// import { request } from '@/utils/request';
import { Box } from '@chakra-ui/react';
import { useMount } from 'ahooks';

export interface IRealData {
  describe: string;
  fieldCode: string;
  fieldName: string;
  precision: 0;
  times: string[];
  unit: string;
  values: number[];
}
const AlarmDetailCharts = ({ data }: { data: IRealData }) => {
  const domRef = useRef<HTMLDivElement | null>(null);

  useMount(async () => {
    initChart(data);
  });

  // const getData = async () => {
  //   const url = '/device-manger/sub_device/sub_device_data';
  //   const res = await request<IRealData[]>({
  //     url,
  //     options: {
  //       method: 'post',
  //       body: JSON.stringify({
  //         deviceId: 'ba4d2fac-d7cb-767d-5aa8-0983ab5daadb',
  //         startData: {
  //           unit: '2',
  //           value: -1,
  //         },
  //       }),
  //     },
  //   });

  //   return res.data;
  // };

  const initChart = async (data: IRealData) => {
    const option: EChartsOption = {
      tooltip: {
        trigger: 'axis',
        position: function (pt) {
          return [pt[0], '10%'];
        },
      },
      xAxis: {
        type: 'category',
        data: data.times,
      },
      yAxis: {
        type: 'value',
      },
      title: {
        left: 'left',
        text: data.fieldName,
        subtext: `单位：${data.unit}`,
      },
      // toolbox: {
      //   feature: {
      //     dataZoom: {
      //       yAxisIndex: 'none',
      //     },
      //     restore: {},
      //     saveAsImage: {},
      //   },
      // },
      dataZoom: [
        {
          start: 60,
          end: 100,
        },
      ],
      series: [
        {
          data: data.values,
          type: 'line',
          smooth: true,
        },
      ],
    };
    if (domRef.current) {
      echarts.use([
        CanvasRenderer,
        GridComponent,
        ToolboxComponent,
        LineChart,
        UniversalTransition,
        TooltipComponent,
        DataZoomComponent,
        TitleComponent,
      ]);
      const myChart4 = echarts.init(domRef.current);

      myChart4.setOption(option);
    }
  };
  return <Box ref={domRef} h="60"></Box>;
};

export default AlarmDetailCharts;
