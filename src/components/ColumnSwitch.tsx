import { HStack, Box, Icon } from '@chakra-ui/react';
import { useMemoizedFn } from 'ahooks';
import { useState } from 'react';
import { AiOutlineSwap } from 'react-icons/ai';

/**
 * ColumnSwitch
 * @name '表头切换工具'
 * @param defaultKeys
 * @param DefaultKeyIndex
 * @function handleSwitchKey :切换方式
 */

type propsType = {
  defaultKeys: Array<{ label: string; value: string }>;
  handleSwitch: (arg: number) => void;
};

const ColumnSwitch = ({ defaultKeys, handleSwitch }: propsType) => {
  const [keys, setKeys] = useState(defaultKeys);
  const [keyIndex, setKeyIndex] = useState<number>(0);

  const handleSwitchKey = useMemoizedFn(() => {
    const legnth = keys.length;
    if (legnth > 0) {
      setKeyIndex(keyIndex + 1);
      if (keyIndex > length) {
        setKeyIndex(0);
      }
    }
    handleSwitch(keyIndex);
  });
  return (
    <HStack>
      <Box>{keys[keyIndex].label}</Box>
      <Icon onClick={handleSwitchKey} cursor={'pointer'} as={AiOutlineSwap}></Icon>
    </HStack>
  );
};

export default ColumnSwitch;
