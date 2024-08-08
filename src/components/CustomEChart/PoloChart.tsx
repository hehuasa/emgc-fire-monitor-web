import { baseProps } from '@/utils/tools/largeScreenTools';
import { Box } from '@chakra-ui/react';
import * as echarts from 'echarts';
import 'echarts-liquidfill';
import { useEffect, useRef } from 'react';

interface WaterPoloProps extends baseProps {
  domId: any;
  data: any;
  safetyLineMax: number;
  safetyLineMin: number;
}

const safetyColors = ['rgb(39,113,106,1)', 'rgb(28,166,110,1)'];
const unsafeColors = ['rgb(112,63,98,1)', 'rgb(185,57,92,1)'];

const PoloChart = (props: WaterPoloProps) => {
  const {
    top = '',
    bottom = '',
    left = '',
    right = '',
    width = '',
    height = '',
    domId,
    data,
    safetyLineMax,
    safetyLineMin,
  } = props;
  const animation = true; // 是否开启图表加载动画
  const chartRef = useRef<echarts.ECharts>();

  /**
   * 初始化图表
   */
  const initEcharts = () => {
    if (chartRef.current) {
      chartRef.current?.dispose();
    }

    // 图表配置
    const options = {
      series: [
        {
          animation: animation,
          type: 'liquidFill', //配置echarts图类型
          radius: '200%',
          backgroundColor: '#fff',
          amplitude: 5,
          center: ['50%', '50%'],
          // shape: 'rect', // 设置水球图类型（矩形[rect]，菱形[diamond]，三角形[triangle]，水滴状[pin],箭头[arrow]...） 默认为圆形
          data: data, //设置波浪的值
          //waveAnimation:false, //静止的波浪
          backgroundStyle: {
            borderWidth: 0,
            borderRadius: '50%',
            // borderColor: data[0] >= safetyLine ? unsafeColors[1] : safetyColors[1],
            // color: 'transparent', //水球图内部背景色
            color: '#FFFFFF29', //水球图内部背景色
          },
          outline: {
            show: false,
            borderDistance: 5,
            itemStyle: {
              borderWidth: 2,
              borderColor: '#fff',
            },
          },
          color: [
            //波浪颜色
            {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 1,
                  color:
                    data[0] >= safetyLineMax || data[0] < safetyLineMin
                      ? unsafeColors[0]
                      : safetyColors[0], //下
                },
                {
                  offset: 0,
                  color:
                    data[0] >= safetyLineMax || data[0] < safetyLineMin
                      ? unsafeColors[1]
                      : safetyColors[1],
                },
              ],
              globalCoord: false,
            },
            {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 1,
                  color:
                    data[0] >= safetyLineMax || data[0] < safetyLineMin
                      ? unsafeColors[0]
                      : safetyColors[0], //下
                },
                {
                  offset: 0,
                  color:
                    data[0] >= safetyLineMax || data[0] < safetyLineMin
                      ? unsafeColors[1]
                      : safetyColors[1],
                },
              ],
              globalCoord: false,
            },
          ],
          label: {
            normal: {
              formatter: '',
            },
          },
        },
      ],
    };

    const newChart = echarts?.init(document.getElementById(domId) as HTMLElement);
    newChart.setOption(options, true);
    chartRef.current = newChart;
  };

  useEffect(() => {
    initEcharts();
  });

  return (
    <Box
      pos="absolute"
      top={top}
      bottom={bottom}
      left={left}
      right={right}
      width={width}
      height={height}
    >
      <Box id={domId} pos={'absolute'} width={'100%'} height={'100%'}></Box>
    </Box>
  );
};
export default PoloChart;
