import React, { useEffect } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Flex, Box, Text } from '@chakra-ui/react';
import { useReactTable, flexRender, getCoreRowModel, ColumnDef } from '@tanstack/react-table';
import Pagination from '@/components/Pagination';
import { useMount, useSafeState } from 'ahooks';
import { useRef } from 'react';
import SmoothScrollbar from 'smooth-scrollbar';
import type { IResultItem } from '.';

export type TableProps = import('@tanstack/table-core').Table<IResultItem>;

type GetKey<K extends string> = {
  [p in K]: { type: string; count: number };
};

interface IAreaCount {
  areaName: string;
  count: number;
}

function DataTable({ data }: { data: IResultItem[] }) {
  const domWarp = useRef<HTMLDivElement | null>(null);
  const scrollbar = useRef<SmoothScrollbar | null>(null);
  const [currentPage, setCurrentPage] = useSafeState(1);
  const [currentPageSize, setCurrentPageSize] = useSafeState(10);
  const [areaCount, setAreaCount] = useSafeState<IAreaCount[]>([]);

  const columns = React.useMemo<ColumnDef<IResultItem>[]>(() => {
    return [
      {
        id: 'order',
        header: '序号',
        cell: (info) => info.row.index + 1,
      },
      {
        id: 'alarmNo',
        accessorKey: 'alarmNo',
        header: '报警编号',
        cell: (row) => row.getValue(),
      },
      {
        id: 'alarmLevelName',
        accessorKey: 'alarmLevelName',
        header: '报警级别',
        cell: (row) => row.getValue(),
      },
      {
        id: 'alarmTypeName',
        accessorKey: 'alarmTypeName',
        header: '报警类型',
        cell: (row) => row.getValue(),
      },
      {
        id: 'address',
        accessorKey: 'address',
        header: '报警位置',
        cell: (row) => row.getValue(),
      },
      {
        id: 'alarmFirstTime',
        accessorKey: 'alarmFirstTime',
        header: '开始时间',
        cell: (row) => row.getValue(),
      },
      {
        id: 'alarmLastTime',
        accessorKey: 'alarmLastTime',
        header: '结束时间',
        cell: (row) => row.getValue(),
      },
      {
        id: 'alarmFrequency',
        accessorKey: 'alarmFrequency',
        header: '报警次数',
        cell: (row) => row.getValue(),
      },
      {
        id: 'dealResultName',
        accessorKey: 'dealResultName',
        header: '处理结果',
        cell: (row) => row.getValue(),
      },
    ];
  }, []);

  const table = useReactTable({
    columns,
    data: data || [],
    getCoreRowModel: getCoreRowModel(),
  });

  useMount(() => {
    if (domWarp.current) {
      scrollbar.current = SmoothScrollbar.init(domWarp.current);
    }
  });

  useEffect(() => {
    const list: IAreaCount[] = [];
    const areaObj: GetKey<IAreaCount['areaName']> = {};
    data.forEach((item) => {
      if (!areaObj[item.areaName]) {
        areaObj[item.areaName] = { type: item.areaName, count: 1 };
      } else {
        areaObj[item.areaName].count += 1;
      }
    });
    Object.keys(areaObj).forEach((item) => list.push({ areaName: item, count: areaObj[item].count }));
    setAreaCount(list);
  }, [data]);

  return (
    <Box p="10px" ref={domWarp} h="full">
      {setAreaCount.length ? (
        <Flex mb="2" flexWrap="wrap">
          {areaCount.map((item, index) => (
            <React.Fragment key={item.areaName}>
              {item.areaName}已成功处理<Text color="pri.blue.100">{item.count}条</Text>报警{index !== areaCount.length - 1 ? ',' : '!'}
            </React.Fragment>
          ))}
        </Flex>
      ) : null}

      <Box border="1px solid rgba(228, 228, 228, 1)" borderRadius="10px">
        <Table>
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr bg="rgba(46, 138, 230, 0.05)" key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <Th border="none" key={header.id} fontWeight="normal" fontSize="16px" color="rgba(24, 25, 27, 1)">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </Th>
                  );
                })}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table
              .getRowModel()
              .rows.slice((currentPage - 1) * currentPageSize, currentPage * currentPageSize)
              .map((row) => (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    const meta: any = cell.column.columnDef.meta;
                    return (
                      <Td border="none" key={cell.id} isNumeric={meta?.isNumeric} fontSize="16px">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Td>
                    );
                  })}
                </Tr>
              ))}
          </Tbody>
        </Table>
      </Box>

      <Flex w="full" h={'58px'} alignItems="center" justifyContent="flex-end" pr={2}>
        <Pagination
          defaultCurrent={1}
          total={data.length}
          paginationProps={{
            display: 'flex',
          }}
          defaultPageSize={10}
          onChange={(current, pages, size, total) => {
            setCurrentPage(current!);
          }}
          pageSize={10}
          showTotal={(total) => (
            <Box px="4" display="inline-flex">
              共
              <Text color={'pri.blue.100'} px="1">
                {total}
              </Text>
              条数据
            </Box>
          )}
        />
      </Flex>
    </Box>
  );
}

export default DataTable;
