import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Box, useDisclosure, Icon, useOutsideClick } from '@chakra-ui/react';
import { forwardRef, useEffect, useRef, useState } from 'react';
import Null from '@/assets/layout/null.png';
import Image from 'next/image';

export type SelectValueType = {
  text: string;
  code: string;
  checked?: boolean;
};
type PropsType = {
  width: string;
  placeholder: string;
  data: Array<SelectValueType>;
  defaultData: string[];
  handleSelect: (arg: SelectValueType[]) => void;
};

const CustomSelect = (props: PropsType, refs: any) => {
  const { width, placeholder, data, handleSelect, defaultData, ...rest } = props;
  const { isOpen, onToggle, onClose, onOpen } = useDisclosure();
  const ref = useRef(null);
  const [dataList, setDataList] = useState<SelectValueType[]>([]);
  const [showItem, setShowItem] = useState<SelectValueType[]>([]);

  useOutsideClick({
    ref,
    handler: () => {
      //onToggle();
      onClose();
    },
  });

  useEffect(() => {
    const newData = data.map((v) => {
      if (defaultData.length && defaultData.includes(v.code)) {
        const item = {
          ...v,
          checked: true,
        };
        setShowItem((d) => [...d, item]);
        return item;
      } else {
        return {
          ...v,
          checked: false,
        };
      }
    });
    setDataList([...newData]);
  }, [data, defaultData]);

  const handleMultSelect = (v: SelectValueType) => {
    if (v.checked) {
      // 取消选中
      v.checked = false;
      setDataList((s) => [...s]);

      const cancelItemIndex = showItem.findIndex((d) => d.code == v.code);
      showItem.splice(cancelItemIndex, 1);
      setShowItem((d) => [...d]);
    } else {
      v.checked = true;
      setDataList((s) => [...s]);
      setShowItem((d) => [...d, v]);
    }

    const selectData = dataList.filter((d) => d.checked);
    handleSelect(selectData);
  };

  return (
    <Box ref={refs} {...rest}>
      <Box
        ref={ref}
        w={width}
        h="40px"
        borderWidth={'1px'}
        borderColor={'border.100'}
        borderRadius={'5px'}
        display="flex"
        justifyContent={'space-around'}
        alignItems="center"
        position={'relative'}
        ps="4"
        pe="4"
        onClick={onOpen}
      >
        <Box w={'90%'} textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap">
          {showItem.length
            ? showItem
                .map((v) => {
                  return v.text;
                })
                .join(',')
            : placeholder}
        </Box>
        <Icon as={isOpen ? ChevronUpIcon : ChevronDownIcon}></Icon>

        {isOpen ? (
          <Box
            position={'absolute'}
            top={'41px'}
            right={0}
            borderWidth="1px"
            borderColor={'#eaeaea'}
            borderRadius={'3px'}
            w={width}
            zIndex={100}
            background="pri.blacks.100"
            maxHeight={'200px'}
            overflowY="auto"
            bg="#fff"
          >
            {dataList.length ? (
              <>
                {dataList.map((v) => {
                  return (
                    <Box
                      key={v.code}
                      ps="2px"
                      pe="2px"
                      _hover={{
                        background: 'blue.400',
                        color: '#FFF',
                      }}
                      p={2}
                      background={v.checked ? 'blue.400' : ''}
                      color={v.checked ? '#FFF' : ''}
                      onClick={() => handleMultSelect(v)}
                    >
                      <Box cursor="pointer">
                        {v.text}
                        {v.checked && <Icon as={CheckIcon}></Icon>}
                      </Box>
                    </Box>
                  );
                })}
              </>
            ) : (
              <Box textAlign="center" width={'full'} m="auto">
                <Image src={Null} quality="100" objectFit="cover" alt="空状态" />
              </Box>
            )}
          </Box>
        ) : null}
      </Box>
    </Box>
  );
};

const CustomSelectMultiple = forwardRef(CustomSelect);

export default CustomSelectMultiple;
