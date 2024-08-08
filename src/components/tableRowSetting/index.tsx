import { SettingIcon } from '@/components/Icons';
import { Box, Checkbox, HStack, useOutsideClick } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';

interface IProps {
  columns: Array<{ id: string; header: string }>;
  filterColumns: string[];
  setFilterColumns: (arg: string[]) => void;
}
const TableRowSetting = ({ columns, filterColumns, setFilterColumns }: IProps) => {
  const [showCheckBox, setShowCheckBox] = useState(false);
  const dom = useRef<HTMLDivElement | null>(null);
  const allChecked = columns.length == filterColumns.length;
  const isIndeterminate = filterColumns.length < columns.length && filterColumns.length > 0;

  useOutsideClick({
    ref: dom,
    handler: () => {
      setShowCheckBox(false);
    },
  });
  return (
    <Box ref={dom} w="15">
      <SettingIcon
        _hover={{ fill: 'pri.blue.100' }}
        cursor="pointer"
        onClick={() => {
          setShowCheckBox(true);
        }}
      />

      {showCheckBox && (
        <Box
          position="absolute"
          zIndex={4}
          w="50"
          left="-25"
          top={10}
          borderRadius="10px"
          boxShadow="0px 3px 6px 1px rgba(0,0,0,0.16)"
          maxH={'50vh'}
          overflowY={'auto'}
          bg={'#FFF'}
        >
          <HStack lineHeight="40px" px="2" borderBottomWidth="1px" borderBottomColor="pri.gray.200">
            <Checkbox
              isChecked={allChecked}
              isIndeterminate={isIndeterminate}
              onChange={() => {
                const allCheckedList = columns.map((v) => v.id);
                setFilterColumns(allChecked ? [] : allCheckedList);
              }}
            >
              列展示
            </Checkbox>
          </HStack>
          {columns.map((item) => {
            return (
              <HStack key={item.id} lineHeight="40px" px="3.5">
                <Checkbox
                  isChecked={filterColumns.includes(item.id)}
                  onChange={() => {
                    const array = [...filterColumns];
                    const currentIndex = array.findIndex((val) => val === item.id);
                    if (currentIndex === -1) {
                      array.push(item.id);
                    } else {
                      array.splice(currentIndex, 1);
                    }
                    setFilterColumns(array);
                  }}
                  value={item.id}
                >
                  {item.header}
                </Checkbox>
              </HStack>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default TableRowSetting;
