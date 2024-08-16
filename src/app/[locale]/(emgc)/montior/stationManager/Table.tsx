import React from 'react';
import { Table, Thead, Tbody, Tr, Td, Flex, Box, Text, HStack, Th, Button } from '@chakra-ui/react';
import { useReactTable, flexRender, getCoreRowModel, ColumnDef } from '@tanstack/react-table';
import Pagination from '@/components/Pagination';
import { useMount } from 'ahooks';
import { useRef } from 'react';
import SmoothScrollbar from 'smooth-scrollbar';
import { IResponsiblePerson } from './page';
import { IPageData } from '@/utils/publicData';
import { TableAlertDelComponent as DelComponent } from '@/components/TableDel';
import Loading from '@/components/Loading/Spin';
import { getDepName } from '@/utils/util';
import { depTreeModal } from '@/models/global';
import { useRecoilValue } from 'recoil';

interface Props {
  eidtOnOpen: () => void;
  data: IPageData<IResponsiblePerson>;
  getData: (current: number) => void;
  tableLoading: boolean;
  setItemInfo: (data?: IResponsiblePerson) => void;
  del: (id: string) => void;
}

function DataTable({ eidtOnOpen, data, getData, tableLoading, setItemInfo, del }: Props) {
  const domWarp = useRef<HTMLDivElement | null>(null);
  const scrollbar = useRef<SmoothScrollbar | null>(null);
  const depTree = useRecoilValue(depTreeModal);
  const columns = React.useMemo<ColumnDef<IResponsiblePerson>[]>(() => {
    return [
      {
        id: 'order',
        header: '序号',
        cell: ({ row }) => {
          return row.index + 1;
        },
      },

      {
        id: 'deptName',
        accessorKey: 'deptName',
        header: '部门',
        cell: (row) => {
          return getDepName(depTree, row.row.original.deptId);
        },
      },
      {
        id: 'areaName',
        accessorKey: 'areaName',
        header: '区域',
        cell: (row) => {
          return row.getValue();
        },
      },
      {
        id: 'alarmTypeName',
        accessorKey: 'alarmTypeName',
        header: '报警类型',
        cell: (row) => {
          return row.getValue();
        },
      },

      {
        id: 'chargeName',
        accessorKey: 'chargeName',
        header: '负责人姓名',
        cell: (row) => {
          return row.getValue();
        },
      },
      {
        id: 'chargePhone',
        accessorKey: 'chargePhone',
        header: '负责人电话',
        cell: (row) => {
          return row.getValue();
        },
      },
      {
        id: 'alarmLastTime',
        accessorKey: 'alarmLastTime',
        header: '操作',
        cell: (row) => {
          return (
            <HStack spacing={2}>
              <Button
                height="32px"
                borderRadius="6px"
                border="1px solid #1677ff"
                bg="#fff"
                color="#1677ff"
                _hover={{
                  color: '#45a8ff',
                }}
                p="4px 12px"
                fontWeight="normal"
                onClick={() => {
                  eidtOnOpen();
                  setItemInfo(row.row.original);
                }}
                fontSize="14px"
              >
                修改
              </Button>
              <DelComponent
                confirm={() => {
                  del(row.row.original.id);
                }}
                buttonProps={{ fontSize: '14px', p: '4px 12px', height: '32px' }}
              />
            </HStack>
          );
        },
      },
    ];
  }, [data]);

  const table = useReactTable({
    columns,
    data: data.records || [],
    getCoreRowModel: getCoreRowModel(),
  });

  useMount(() => {
    if (domWarp.current) {
      scrollbar.current = SmoothScrollbar.init(domWarp.current);
    }
  });

  return (
    <Loading spin={tableLoading}>
      <Box ref={domWarp} h="calc(100% - 76px)">
        <Box border="1px solid rgba(228, 228, 228, 1)" borderRadius="10px">
          <Table w="100%">
            <Thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr bg="rgba(46, 138, 230, 0.05)" key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <Th fontSize="16px" key={header.id} p="3.5">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </Th>
                    );
                  })}
                </Tr>
              ))}
            </Thead>
            <Tbody>
              {table.getRowModel().rows.map((row, index) => {
                return (
                  <React.Fragment key={row.id + index}>
                    <Tr key={row.id}>
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <Td p="3.5" key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </Td>
                        );
                      })}
                    </Tr>
                  </React.Fragment>
                );
              })}
            </Tbody>
          </Table>
        </Box>

        <Flex w="full" h={'58px'} alignItems="center" justifyContent="flex-end" pr={2}>
          <Pagination
            defaultCurrent={1}
            current={data.current}
            total={data.total}
            paginationProps={{
              display: 'flex',
            }}
            defaultPageSize={10}
            onChange={(current, pages, size, total) => {
              getData(current!);
            }}
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
    </Loading>
  );
}

export default DataTable;

export { DelComponent };
