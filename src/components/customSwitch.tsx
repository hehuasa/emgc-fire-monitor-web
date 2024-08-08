import { Text, Switch, SwitchProps } from '@chakra-ui/react';
import { ChangeEvent, useEffect, useState } from 'react';

/**
 * CustomSwitch
 * 只针对chakra的Switch添加开、关文字
 */
interface props extends SwitchProps {
  onText?: string;
  offText?: string;
}

const CustomSwitch = (prop: props) => {
  const { onText = '开', offText = '关', defaultChecked, onChange, ...rest } = prop;
  const [status, setStatus] = useState(defaultChecked);

  useEffect(() => {
    setStatus(defaultChecked);
  }, [defaultChecked]);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStatus(e.target.checked);
    onChange && onChange(e);
  };
  return (
    <>
      <Switch {...rest} size={'lg'} position={'relative'} onChange={handleChange}>
        {status ? (
          <Text fontSize={'md'} color={'white'} position={'absolute'} top={3.5} left={2}>
            {onText}
          </Text>
        ) : (
          <Text fontSize={'md'} color={'white'} position={'absolute'} top={3.5} right={4}>
            {offText}
          </Text>
        )}
      </Switch>
      <Text fontSize={'smaller'}>{status}</Text>
    </>
  );
};
export default CustomSwitch;
