import { lastUpdateAlarmTimeModel } from '@/models/alarm';
import { Box } from '@chakra-ui/react';
import { useMount, useUnmount } from 'ahooks';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
// import { getExecData } from './LargeScreenApi/getApi';

import leidian1 from '@/assets/large_img/img/home/weatherwarning/leidian1.png';
import leidian2 from '@/assets/large_img/img/home/weatherwarning/leidian2.png';
import leidian3 from '@/assets/large_img/img/home/weatherwarning/leidian3.png';
import leidian5 from '@/assets/large_img/img/home/weatherwarning/leidian5.png';

interface WeatherWarningEffectProps {
  containerWidth: string;
  containerHeight: string;
  imgWidth: string;
  imgHeight: string;
  getLevel?: (level: number) => void;
}

const WeatherWarningEffect = (props: WeatherWarningEffectProps) => {
  const {
    containerWidth = '',
    containerHeight = '',
    imgWidth = '',
    imgHeight = '',
    getLevel,
  } = props;
  const timer = useRef<NodeJS.Timer | null>(null); // 定时器
  const interval = 5 * 60; // 数据请求间隔时间
  const [waringLevel, setLevel] = useState(0);
  const lastUpdateAlarmTime = useRecoilValue(lastUpdateAlarmTimeModel);

  const getBoxShadow = (waringLevel: number) => {
    const color = getColor(waringLevel);
    switch (waringLevel) {
      case 1:
        return ['0 0 0px ' + color, '0 0 6px ' + color, '0 0 12px ' + color];
      case 2:
        return ['0 0 0px ' + color, '0 0 8px ' + color, '0 0 16px ' + color];
      case 3:
        return ['0 0 0px ' + color, '0 0 10px ' + color, '0 0 20px ' + color];
    }
  };

  const getColor = (waringLevel?: number) => {
    switch (waringLevel) {
      case 1:
        return '#FFE800';
      case 2:
        return '#ED7103';
      case 3:
        return '#ff0519';
      default:
        return '#7C849C';
    }
  };

  const getDuration = (waringLevel: number) => {
    switch (waringLevel) {
      case 1:
        return 0.8;
      case 2:
        return 0.7;
      case 3:
        return 0.5;
      default:
        return 0;
    }
  };

  /**
   * 根据等级获取雷电预警图片
   */
  const getLeidianImgByLevel = (waringLevel?: number) => {
    switch (waringLevel) {
      case 1:
        return leidian3;
      case 2:
        return leidian2;
      case 3:
        return leidian1;
      default:
        return leidian5;
    }
  };

  const getData = async () => {
    // const weatherWaringRes = await getWeatherWaring();
    const weatherWaringRes: any = {
      code: 500,
    };

    if (weatherWaringRes.code === 200) {
      if (
        weatherWaringRes.data.earlyWarningLevel &&
        weatherWaringRes.data.earlyWarningLevel.value !== null
      ) {
        setLevel(weatherWaringRes.data.earlyWarningLevel.value);
        getLevel && getLevel(weatherWaringRes.data.earlyWarningLevel.value);
      } else {
        setLevel(0);
        getLevel && getLevel(0);
      }
    } else {
      setLevel(0);
      getLevel && getLevel(0);
    }
  };

  // 监听 lastUpdateAlarmTime， 更新雷电预警
  useEffect(() => {
    if (lastUpdateAlarmTime) {
      getData();
    }
  }, [lastUpdateAlarmTime]);

  // 挂载
  useMount(() => {
    if (timer.current) {
      return;
    } else {
      getData();
      timer.current = setInterval(() => {
        getData();
      }, interval * 1000);
    }

    // setTimeout(() => {
    //   setLevel(3);
    //   getLevel && getLevel(3);
    // }, 2000);
  });

  // 卸载
  useUnmount(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  });

  return (
    <motion.div
      animate={{
        boxShadow: getBoxShadow(waringLevel),
        borderColor: [getColor(waringLevel), getColor(waringLevel), getColor(waringLevel)],
      }}
      initial={{
        position: 'absolute',
        top: '0%',
        width: containerWidth,
        height: containerHeight,
        borderWidth: '1px',
        borderColor: getColor(waringLevel),
        borderRadius: '10px',
        boxShadow: '0 0 5px ' + getColor(waringLevel),
        opacity: 1,
      }}
      transition={{
        duration: getDuration(waringLevel),
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      <Box
        position="absolute"
        width={imgWidth}
        height={imgHeight}
        top="50%"
        left="50%"
        transform={'translate(-50%, -50%)'}
        backgroundImage={`url(${getLeidianImgByLevel(waringLevel).src})`}
        backgroundSize={'100% 100%'}
        backgroundRepeat="no-repeat"
      ></Box>
    </motion.div>
  );
};

export default WeatherWarningEffect;
