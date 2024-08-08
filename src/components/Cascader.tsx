import { Box, Flex, Stack } from '@chakra-ui/react';
import { useMemoizedFn, useMount, useSafeState } from 'ahooks';
import { createContext, useContext } from 'react';
//import {Cascader} from 'amis'

const MyContent = createContext<CustomContext>({
  selected: [],
  setSelected: function (data: string[]): void {
    throw new Error('Function not implemented.');
  },
  showData: [],
  setShowData: function (data: Option[][]): void {
    throw new Error('Function not implemented.');
  },
});

interface CustomContext {
  selected: string[];
  setSelected: (data: string[]) => void;
  showData: Option[][];
  setShowData: (data: Option[][]) => void;
}

export interface Option {
  value: string;
  label: string;
  children?: Option[];
}

const options: Option[] = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
      },
    ],
  },
];

const Cascader = () => {
  const [selected, setSelected] = useSafeState<string[]>(['zhejiang', 'hangzhou', 'xihu']);
  const [showData, setShowData] = useSafeState<Option[][]>([]);
  useMount(() => {
    if (selected && selected.length) {
      const initArr = [options];
      selected.forEach((item, index) => {
        const children = initArr[index].find((subItem) => subItem.value === item)?.children || [];
        if (children && children.length) {
          initArr.push(children);
        }
      });
      setShowData(initArr);
    } else {
      setShowData([options]);
    }
  });

  return (
    <MyContent.Provider value={{ selected, setSelected, showData, setShowData }}>
      <Flex bg="#fff" borderRadius="1.5" border="1px solid #666" h="20" w="max-content">
        <Item />
      </Flex>
    </MyContent.Provider>
  );
};

interface IItem {
  index?: number;
}

const Item = ({ index = 0 }: IItem) => {
  const { selected, setSelected, setShowData, showData } = useContext(MyContent);

  const currentItemActive = selected[index];

  const select = useMemoizedFn((value: Option) => {
    //设置显示的内容
    const arr = [...showData].slice(0, index + 1);
    arr.push(value.children || []);
    setShowData(arr);

    //设置选中的值
    const select = [...selected].slice(0, index + 1);
    select[index] = value.value;
    setSelected(select);
  });

  if (!(showData[index] && showData[index].length)) {
    return null;
  }
  return (
    <>
      <Stack w="200px">
        {showData[index].map((item) => (
          <Box
            cursor="pointer"
            color={currentItemActive === item.value ? 'green' : ''}
            key={item.value}
            onClick={() => select(item)}
          >
            {item.label}
          </Box>
        ))}
      </Stack>
      <Item index={index + 1} />
    </>
  );
};

export default Cascader;
