import { IAlarmHistory } from '@/models/alarm';
import { Table, Thead, Tr, Th, Tbody, Td, Flex, Box, Highlight, Text } from '@chakra-ui/react';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import React, { useMemo } from 'react';
import Pagination from '../Pagination';

interface IProps {
  devId: string;
  size: number;
  total: number;
  current: number;
  records: IAlarmHistory[];
  getHisData: (devId: string, current: number, size: number) => Promise<void>;
}
const AlarmHistory = ({ devId, getHisData, records, size, total, current }: IProps) => {
  const columns = useMemo<ColumnDef<IAlarmHistory>[]>(() => {
    return [
      {
        id: 'No',
        header: '序号',
        cell: (info) => info.row.index + 1,
      },
      {
        id: 'alarmNo',
        header: '报警编号',
        accessorKey: 'alarmNo',

        cell: (info) => {
          return <Box>{info.getValue() as string}</Box>;
        },
      },
      {
        id: 'alarmLevelName',
        header: '报警级别',
        accessorKey: 'alarmLevelName',

        cell: (info) => {
          return <Box>{info.getValue() as string}</Box>;
        },
      },
      {
        id: 'alarmTypeName',
        header: '报警类型',
        accessorKey: 'alarmTypeName',

        cell: (info) => {
          return <Box>{info.getValue() as string}</Box>;
        },
      },

      {
        id: 'alarmFirstTime',
        header: '开始时间',
        accessorKey: 'alarmFirstTime',

        cell: (info) => {
          return <Box>{info.getValue() as string}</Box>;
        },
      },

      {
        id: 'alarmLastTime',
        header: '结束时间',
        accessorKey: 'alarmLastTime',

        cell: (info) => {
          return <Box>{info.getValue() as string}</Box>;
        },
      },

      {
        id: 'durationTime',
        header: '响应时长',
        accessorKey: 'durationTime',

        cell: (info) => {
          return <Box>{info.getValue() as string}</Box>;
        },
      },
      {
        id: 'dealResultView',
        header: '处理结果',
        accessorKey: 'dealResultView',

        cell: (info) => {
          return <Box>{info.getValue() as string}</Box>;
        },
      },
    ];
  }, []);
  const table = useReactTable({
    columns,
    data: records,
    getCoreRowModel: getCoreRowModel(),
  });

  console.log('recordsrecords', records);

  return (
    <>
      <Table
        variant="unstyled"
        borderRadius="10px"
        textAlign={'center'}
        borderWidth="1px"
        borderColor="pri.gray.200"
      >
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr bg="pri.blue.500" color="pri.drak.100" key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <Th key={header.id} px="2" textAlign={'center'} fontSize="md">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </Th>
                );
              })}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <Tr bg="pri.gray.500" key={row.id} py="0">
                {row.getVisibleCells().map((cell) => {
                  return (
                    <Td h="14" py="0" key={cell.id} fontSize="md" textAlign={'center'}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Td>
                  );
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      <Flex
        w="full"
        h="12"
        py="8"
        pr={5}
        borderTop="1px"
        borderColor="border.100"
        alignItems="center"
        justifyContent="right"
      >
        <Pagination
          defaultCurrent={1}
          current={current}
          total={total || 1}
          paginationProps={{
            display: 'flex',
          }}
          onChange={(current, pages, size, total) => {
            if (current) {
              getHisData(devId, current, size!);
            }
          }}
          pageSize={size}
          pageSizeOptions={[10, 25, 50]}
          onShowSizeChange={(current, size) => {
            if (size) {
              getHisData(devId, current!, size);
            }
          }}
          showTotal={(total) => (
            <Text color="pri.dark.100" px="4">
              <Highlight query={String(total)} styles={{ px: '1', py: '1', color: 'pri.blue.100' }}>
                {`共 ${total} 条数据`}
              </Highlight>
            </Text>
          )}
          showSizeChanger
          pageNeighbours={1}
          showQuickJumper
        />
      </Flex>
    </>
  );
};

export default AlarmHistory;
