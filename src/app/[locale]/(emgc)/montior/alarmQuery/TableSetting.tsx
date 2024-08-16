import { SettingIcon } from '@/components/Icons';
import { Box, Checkbox, HStack, useOutsideClick } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';

export const arrays = [
  {
    id: 'No',
    header: '序号',
  },
  {
    id: 'alarmNo',
    header: '报警编号',
  },
  {
    id: 'alarmTypeName',
    header: '报警类型',
  },
  {
    id: 'alarmLevelName',
    header: '报警级别',
  },
  {
    id: 'deptName',
    header: '报警部门',
  },
  {
    id: 'alarmAreaName',
    header: '报警区域',
  },
  {
    id: 'address',
    header: '报警位置',
  },
  {
    id: 'alarmWayView',
    header: '报警方式',
  },
  {
    id: 'alarmFirstTime',
    header: '开始时间',
  },
  {
    id: 'alarmLastTime',
    header: '结束时间',
  },

  {
    id: 'statusView',
    header: '报警状态',
  },

  {
    id: 'dealResultView',
    header: '处理结果',
  },

  {
    id: 'dealUserName',
    header: '处理人',
  },
  {
    id: 'dealTime',
    header: '处理时间',
  },
];

const array_: string[] = [];
for (const { id } of arrays) {
  array_.push(id);
}
interface IProps {
  filterColumns: string[];
  setfilterColumns: (f: string[]) => void;
}
const TableSetting = ({ filterColumns, setfilterColumns }: IProps) => {
  const [showCheckBox, setShowCheckBox] = useState(false);
  const dom = useRef<HTMLDivElement | null>(null);
  const allChecked = filterColumns.length === arrays.length;
  const isIndeterminate = filterColumns.length < arrays.length && filterColumns.length > 0;

  //console.log('alllll', allChecked, filterColumns);

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
          bg="pri.white.100"
          w="50"
          right="0"
          borderRadius="10px"
          boxShadow="0px 3px 6px 1px rgba(0,0,0,0.16)"
          h="max-content"
          overflowY="auto"
        >
          <HStack lineHeight="40px" px="2" borderBottomWidth="1px" borderBottomColor="pri.gray.200">
            <Checkbox
              isChecked={allChecked}
              isIndeterminate={isIndeterminate}
              onChange={() => {
                setfilterColumns(allChecked ? [] : array_);
              }}
            >
              列展示
            </Checkbox>
          </HStack>
          {arrays.map((item) => {
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
                    setfilterColumns(array);
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

export default TableSetting;
