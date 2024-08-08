import { Box } from '@chakra-ui/react';
const getInitTime = (durationTime: number) => {
  const time_ = new Date();
  time_.setSeconds(time_.getSeconds() + durationTime);

  return time_;
};

const DurationTime = ({ durationTime, color }: { durationTime: number; color?: string }) => {
  // const { minutes, hours, days } = useStopwatch({
  //   autoStart: true,
  //   offsetTimestamp: getInitTime(durationTime),
  // });

  const newDays = Math.floor(durationTime / (60 * 60 * 24));
  const newHours = Math.floor((durationTime % (60 * 60 * 24)) / (60 * 60));
  const newMinutes = Math.floor((durationTime % (60 * 60)) / 60);

  return (
    <Box
      color={color ? color : 'pri.red.100'}
    >{`${newDays} 天 ${newHours} 小时 ${newMinutes}  分`}</Box>
  );
};

export default DurationTime;
