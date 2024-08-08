import { SearchIcon } from '@chakra-ui/icons';
import {
  Box,
  HStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  VStack,
  Text,
  InputGroup,
  Input,
  InputRightElement,
  Icon,
  TableContainer,
  Table,
  Thead,
  Th,
  Tbody,
  Tr,
  Td,
  Flex,
  Highlight,
  List,
  ListItem,
} from '@chakra-ui/react';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';
import { TriangleCheckedIcon } from '../Icons';
import Pagination from '../Pagination';
import useSWR from 'swr';
import { request } from '@/utils/request';
import { FormatTreeData } from '@/utils/util';
import { DepartmentType, FormatTreeDataType } from '@/models/userManage';
import { IPageData } from '@/utils/publicData';

interface PhoneBookType {
  userName: string;
  shortNum: string;
  positionName: string;
  orgName: string;
  mobile: string;
}

const PhoneBook = () => {
  const [tableData, setTableData] = useState<PhoneBookType[]>([]);
  const [totalDataLength, setTotalDataLength] = useState<number>(0);
  const [searchText, setSearchText] = useState('');
  const [pageState, setPageState] = useState({
    current: 1,
    size: 10,
  });

  const handleSearch = (e?: any) => {
    if (e?.code === 'Enter') {
      console.log('查询', e?.target);
      const userName = e?.target.value;
      getDepartJobs(currentSelect.id, pageState.current, pageState.size, userName);
    } else {
      getDepartJobs(currentSelect.id, pageState.current, pageState.size, searchText);
    }
  };

  const [currentSelect, setCurrentSelect] = useState<FormatTreeDataType>({
    id: '',
    parent: '',
    text: '',
    code: '',
  });
  const [departmentData, setDepartmentData] = useState<FormatTreeDataType[]>([]);
  const handleSelect = (depart: FormatTreeDataType) => {
    setCurrentSelect(depart);
    getDepartJobs(depart.id, pageState.current, pageState.size);
    setPageState({
      current: 1,
      size: pageState.size,
    });
  };

  // 获取通讯录
  useSWR(
    {
      url: `/ms-system/org/list-org-tree`,
      options: {
        method: 'get',
      },
    },
    request<any>,
    {
      onSuccess(data, key, config) {
        if (data.code == 200) {
          const treeData: FormatTreeDataType[] = [];
          const newData = FormatTreeData(treeData, data.data as unknown as DepartmentType[]);
          setDepartmentData(newData);
        }
      },
    }
  );

  // 查询部门人员
  const getDepartJobs = async (orgId: string, current: number, size: number, userName?: string) => {
    let url = `/ms-system/org/list-user?orgId=${orgId}&pageIndex=${current}&pageSize=${size}`;
    if (userName) {
      url = `/ms-system/org/list-user?orgId=${orgId}&pageIndex=${current}&pageSize=${size}&userName=${userName}`;
    }
    const res = await request<IPageData<PhoneBookType[]>>({
      url: url,
      options: {
        method: 'get',
      },
    });
    console.log('table-data', (res.data as any).records);

    setTableData(res.data.records as unknown as PhoneBookType[]);
    setTotalDataLength(res.data.total);
  };

  const columns = useMemo<ColumnDef<PhoneBookType>[]>(() => {
    return [
      {
        id: 'userName',
        accessorKey: 'userName',
        header: '姓名',
        cell: (info) => <Box>{info.getValue() as string}</Box>,
      },
      {
        id: 'positionName',
        header: '岗位',
        accessorKey: 'positionName',
        cell: (info) => {
          return <Box>{info.getValue() as string}</Box>;
        },
      },
      {
        id: 'orgName',
        header: '部门',
        accessorKey: 'orgName',

        cell: (info) => {
          return <Box>{info.getValue() as string}</Box>;
        },
      },
      {
        id: 'shortNum',
        header: '座机号码',
        accessorKey: 'shortNum',

        cell: (info) => {
          return <Box>{info.getValue() as string}</Box>;
        },
      },
      {
        id: 'mobile',
        header: '移动号码',
        accessorKey: 'mobile',

        cell: (info) => {
          return <Box>{info.getValue() as string}</Box>;
        },
      },
    ];
  }, []);

  const table = useReactTable({
    columns,
    data: tableData ? tableData : [],
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Box h={'120'}>
      <HStack h={'full'}>
        <Box w={'70'} h="full" borderWidth="1px" borderRadius={'10px'} borderColor="#E4E4E4">
          <Accordion allowToggle defaultIndex={[0]}>
            <AccordionItem border={'none'}>
              <HStack justify={'space-between'} pr={2}>
                <AccordionButton
                  _hover={{
                    bg: 'none',
                  }}
                >
                  <Box as="span" flex="1" textAlign="left" color={'pri.dark.100'} fontWeight="bold">
                    企业通讯录
                  </Box>
                </AccordionButton>
                <AccordionIcon />
              </HStack>
              <AccordionPanel ps={0} pe={0}>
                <List>
                  {departmentData.map((depart) => (
                    <ListItem
                      key={depart.text}
                      pl={5}
                      py={2}
                      mt={0}
                      cursor={'pointer'}
                      _hover={{
                        bg: 'pri.green.100',
                        color: 'pri.blue.100',
                      }}
                      bg={currentSelect.text === depart.text ? 'pri.green.100' : ''}
                      color={currentSelect.text === depart.text ? 'pri.blue.100' : 'pri.dark.500'}
                      fontWeight={400}
                      pos="relative"
                      onClick={() => handleSelect(depart)}
                    >
                      {depart.text}
                      {/* （{depart.remberNumber}） */}
                      {currentSelect.text === depart.text && (
                        <Icon
                          as={TriangleCheckedIcon}
                          position="absolute"
                          right={'0'}
                          bottom={0}
                          fontSize={'20px'}
                          fill={'pri.blue.100'}
                        ></Icon>
                      )}
                    </ListItem>
                  ))}
                </List>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Box>
        <Box w="full" h={'full'}>
          <VStack w={'full'} h={'full'} justifyContent="flex-start">
            <HStack w="full" justify={'space-between'}>
              <Text>
                查询到
                <Highlight
                  query={totalDataLength.toString()}
                  styles={{ color: 'pri.blue.100', fontWeight: 'bold' }}
                >
                  {totalDataLength.toString()}
                </Highlight>
                条数据
              </Text>
              <InputGroup w={74}>
                <Input
                  borderRadius={'40px'}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => handleSearch(e)}
                  placeholder="如：姓名、座机号码、移动号码"
                />
                <InputRightElement cursor={'pointer'} onClick={handleSearch}>
                  <Icon as={SearchIcon}></Icon>
                </InputRightElement>
              </InputGroup>
            </HStack>
            <TableContainer
              w="full"
              h={'100'}
              overflowY="scroll"
              borderWidth={'1px'}
              borderRadius={'10px'}
              borderColor="#E4E4E4"
              css={{
                '::-webkit-scrollbar': {
                  width: '0',
                  height: '4px',
                },
                '::-webkit-scrollbar-thumb': {
                  borderRadius: '10px',
                  backgroundColor: 'rgba(119, 140, 162, 1)',
                  cursor: 'pointer',
                },
                '::-webkit-scrollbar-track': {
                  display: 'none',
                  backgroundColor: 'rgba(0,0,0,0)',
                  opacity: 0,
                },
              }}
            >
              <Table
                w="full"
                variant="unstyled"
                textAlign={'left'}
                overflowX="auto"
                whiteSpace="nowrap"
              >
                <Thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <Tr
                      bg={'pri.blue.700'}
                      color="pri.dark.100"
                      key={headerGroup.id}
                      position="sticky"
                      top={0}
                      left={0}
                    >
                      {headerGroup.headers.map((header) => {
                        const headerKey = header.column.id;
                        return (
                          <Th
                            key={header.id}
                            ps={8}
                            py="4"
                            fontWeight="500"
                            textAlign={headerKey === 'No' ? 'center' : 'left'}
                            fontSize={'16px'}
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                          </Th>
                        );
                      })}
                    </Tr>
                  ))}
                </Thead>
                <Tbody overflowY="scroll">
                  {table.getRowModel().rows.map((row) => {
                    return (
                      <Tr
                        color="font.200"
                        bg="pri.white.100"
                        _hover={{
                          backgroundColor: 'pri.gray.400',
                        }}
                        key={row.id}
                        py="0"
                      >
                        {row.getVisibleCells().map((cell) => {
                          const cellKey = cell.column.id;

                          return (
                            <Td
                              h="14"
                              py="0"
                              key={cell.id}
                              fontSize={'16px'}
                              textAlign={cellKey === 'No' ? 'center' : 'left'}
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </Td>
                          );
                        })}
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
            <Flex w="full" h="12" py="8" pr={5} alignItems="center" justifyContent="right">
              <Pagination
                defaultCurrent={pageState.current}
                current={pageState.current}
                total={totalDataLength || 1}
                paginationProps={{
                  display: 'flex',
                }}
                onChange={(current) => {
                  if (current) {
                    pageState.current = current;
                    setPageState({
                      ...pageState,
                    });
                    getDepartJobs(currentSelect.id, pageState.current, pageState.size);
                  }
                }}
                pageSize={pageState.size}
                pageSizeOptions={[10, 25, 50]}
                onShowSizeChange={(current, size) => {
                  if (size) {
                    pageState.size = size;
                    pageState.current = 1;
                    setPageState({
                      ...pageState,
                    });
                    getDepartJobs(currentSelect.id, pageState.current, pageState.size);
                  }
                }}
                showTotal={(total) => (
                  <Text color="pri.dark.100" px="4">
                    <Highlight
                      query={String(total)}
                      styles={{ px: '1', py: '1', color: 'pri.blue.100' }}
                    >
                      {`共 ${total} 条数据`}
                    </Highlight>
                  </Text>
                )}
                pageNeighbours={1}
              />
            </Flex>
          </VStack>
        </Box>
      </HStack>
    </Box>
  );
};

export default PhoneBook;
