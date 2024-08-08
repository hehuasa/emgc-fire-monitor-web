import { Box } from '@chakra-ui/react';
import { useStopwatch } from 'react-timer-hook';
const getInitTime = (time: string) => {
  const time_ = new Date();
  const ms = time_.getTime() - new Date(time).getTime();
  time_.setSeconds(time_.getSeconds() + ms / 1000);

  return time_;
};
const TimerCounter = ({ time, color }: { time: string; color?: string }) => {
  const { minutes, hours, days } = useStopwatch({
    autoStart: true,
    offsetTimestamp: getInitTime(time),
  });

  return (
    <Box color={color ? color : 'pri.red.100'}>{`${days} 天 ${hours} 小时 ${minutes}  分`}</Box>
  );
};

export default TimerCounter;
