import {
	TableContainer,
	Table,
	Thead,
	Tr,
	Th,
	Tbody,
	Td,
	Button,
	HStack,
	Tooltip,
	Text,
	Flex,
	Box,
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverHeader,
	PopoverBody,
	useDisclosure,
	useOutsideClick,
	PopoverArrow,
	useToast,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Divider,
	Center,
} from '@chakra-ui/react';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useCallback, useMemo, useRef, useState } from 'react';
// import Null from '@/assets/layout/null.png';
// import Image from 'next/image';
import Pagination from '@/components/Pagination';
import { deviceInfoType, productTableType } from '@/models/product';
import { IPageData } from '@/utils/publicData';
import { request } from '@/utils/request';
import { useMemoizedFn, useMount } from 'ahooks';
import { useRouter } from 'next/navigation';
import type { Keyword } from './page';

type PropsType = {
	data: IPageData<productTableType[]>;
	getTableData: (data: Keyword) => void;
	goEdit: (row: deviceInfoType) => void;
	del: (id: string) => void;
	openInfo: (item: deviceInfoType) => void;
};

type realDataType = {
	name: string;
	value: boolean;
};

const ProductTable = ({ data, getTableData, goEdit, del, openInfo }: PropsType) => {
	const router = useRouter();
	const toast = useToast();
	const ref = useRef<HTMLDivElement | null>(null);
	const [showLeftPing, setShowLeftPing] = useState(false);
	const [showRightPing, setShowRightPing] = useState(false);
	const [hoverRowId, sethoverRowId] = useState('');
	const { isOpen: isOpenLog, onOpen: onOpenLog, onClose: onCloseLog } = useDisclosure();

	const openLink = useCallback(async (id: string) => {
		const { code, data } = await request({
			url: `/device-manger/device/start?id=${id}`,
		});
		if (code == 200) {
			toast({
				status: 'success',
				title: '打开成功',
				position: 'top',
				duration: 2000,
				isClosable: true,
			});
			getTableData({});
		}
	}, []);
	const closeLink = useCallback(async (id: string) => {
		const { code, data } = await request({
			url: `/device-manger/device/close?id=${id}`,
		});
		if (code == 200) {
			toast({
				status: 'success',
				title: '关闭成功',
				position: 'top',
				duration: 2000,
				isClosable: true,
			});
			getTableData({});
		}
	}, []);

	useMount(() => {
		const timer = setInterval(() => {
			if (ref.current) {
				clearInterval(timer);
				ref.current.addEventListener('scroll', () => {
					if (ref.current) {
						const showLeft = ref.current.scrollLeft > 0;
						const showRight =
							ref.current.scrollLeft < ref.current.scrollWidth - ref.current.clientWidth;
						setShowLeftPing(showLeft);
						setShowRightPing(showRight);
					}
				});
			}
		}, 100);
	});

	const columns = useMemo<ColumnDef<deviceInfoType>[]>(() => {
		return [
			{
				id: 'num',
				header: '序号',
				cell: ({ row }) => {
					return <Text>{row.index + 1}</Text>;
				},
			},
			// {
			//   id: 'productId',
			//   accessorKey: 'productId',
			//   header: '所属设备',
			//   cell: (row) => {
			//     const text = row.getValue() as string;
			//     return (
			//       <Tooltip label={text}>
			//         <Text noOfLines={1}>{text}</Text>
			//       </Tooltip>
			//     );
			//   },
			// },
			{
				id: 'deviceName',
				accessorKey: 'deviceName',
				header: '设备实例名称',
				cell: (row) => {
					const text = row.getValue() as string;
					return (
						<Tooltip label={text}>
							<Text noOfLines={1}>{text}</Text>
						</Tooltip>
					);
				},
			},
			// {
			//   id: 'serverId',
			//   accessorKey: 'serverId',
			//   header: '采集器',
			//   cell: ({ row, getValue }) => {
			//     const text = getValue() as string;
			//     return <Text>{text}</Text>;
			//   },
			// },
			{
				id: 'status',
				accessorKey: 'status',
				header: '	设备实例状态',
				cell: ({ row, getValue }) => {
					let stateText = '';
					if (getValue() === 1) {
						stateText = '在线';
					}
					if (getValue() === 2) {
						stateText = '离线';
					}
					if (getValue() === 9) {
						stateText = '启动中';
					}
					return <Text>{stateText}</Text>;
				},
			},
			{
				id: 'runLogLevel',
				accessorKey: 'runLogLevel',
				header: '日志级别',
				cell: ({ row, getValue }) => {
					let text = '';
					switch (getValue()) {
						case 'ERROR':
							text = '错误级别';
							break;
						case 'INFO':
							text = '消息级别';
							break;
						case 'WARN':
							text = '警告级别';
							break;
					}
					return <Text>{text}</Text>;
				},
			},
			{
				id: 'fail',
				accessorKey: 'fail',
				header: '故障',
				cell: ({ row, getValue }) => {
					return <Text>{getValue() ? '是' : '否'}</Text>;
				},
			},
			{
				id: 'options',
				header: '操作',
				cell: ({ row }) => {
					const states = Number(row.original.status);

					return (
						<HStack flexWrap={'nowrap'} justify="center">
							{states == 2 && (
								<Button
									size="sm"
									color={'pri.white.100'}
									_hover={{
										bg: 'blue.400',
									}}
									bg="pri.blue.100"
									fontWeight={0}
									onClick={() => {
										const { id } = row.original;
										openLink(id!);
									}}
								>
									开启
								</Button>
							)}
							{states == 1 && (
								<Button
									size="sm"
									color={'pri.white.100'}
									_hover={{
										bg: 'blue.400',
									}}
									bg="pri.blue.100"
									fontWeight={0}
									onClick={() => {
										const { id } = row.original;
										closeLink(id!);
									}}
								>
									断开
								</Button>
							)}
							{states === 9 && (
								<Button
									size="sm"
									color={'pri.white.100'}
									_hover={{
										bg: 'blue.400',
									}}
									bg="pri.blue.100"
									fontWeight={0}
									onClick={() => {
										getTableData({});
										toast({
											title: '刷新成功',
											status: 'success',
											position: 'top',
											duration: 1000,
										});
									}}
								>
									刷新
								</Button>
							)}
							{/* <Button
                // color={'pri.yellow.200'}
                // bg={'pri.yellow.100'}
                // _hover={{ color: '#FFF', bg: 'pri.yellow.200' }}
                // borderRadius={'4px'}
                variant='outline'
                fontWeight={0}
                onClick={() => {
                  openInfo(row.original);
                }}
              >
                详情
              </Button> */}
							{/* <Button
                // leftIcon={<ViewIcon />}
                // color={'pri.yellow.200'}
                // bg={'pri.yellow.100'}
                // _hover={{ color: '#FFF', bg: 'pri.yellow.200' }}
                // borderRadius={'4px'}
                fontWeight={0}
                variant="outline"
                onClick={() => {
                  const id = row.original.id;
                  currentRowId.current = id!;
                  getLog();
                  onOpenLog();
                }}
              >
                日志
              </Button> */}
							{/* <Button
                leftIcon={<EditIcon />}
                color={'pri.yellow.200'}
                bg={'pri.yellow.100'}
                _hover={{ color: '#FFF', bg: 'pri.yellow.200' }}
                borderRadius={'4px'}
                fontWeight={0}
                onClick={() => {
                  // const { productId, deviceName, runLogLevel } = row.original;
                  goEdit(row.original);
                }}
              >
                修改
              </Button> */}
							{/* <DelComponent id={row.original.id!} del={del} /> */}

							{/*  */}
						</HStack>
					);
				},
			},
		];
	}, []);

	const table = useReactTable({
		columns: columns as any,
		data: data.records || [],
		getCoreRowModel: getCoreRowModel(),
	});

	const pageNumber = useRef(1);
	const [logInfo, setLogInfo] = useState('');
	const currentRowId = useRef('');
	const [showMore, setShowMore] = useState(true);
	const getLog = useCallback(async () => {
		const { code, data } = await request({
			url: `/device-manger/device_run_log/log`,
			options: {
				method: 'post',
				body: JSON.stringify({
					deviceId: currentRowId.current,
					pageBean: {
						currentPage: pageNumber.current,
						pageSize: 10,
					},
				}),
			},
		});
		if (code == 200) {
			if (data) {
				setLogInfo((logInfo + data) as string);
			} else {
				setShowMore(false);
			}
		}
	}, [currentRowId, logInfo]);
	const handleLoadMore = useCallback(() => {
		pageNumber.current++;
		getLog();
	}, [getLog]);

	const handleLogClose = useCallback(() => {
		pageNumber.current = 1;
		setLogInfo('');
		onCloseLog();
		setShowMore(true);
	}, []);

	return (
		<>
			<TableContainer w="full" mt={2} ref={ref}>
				<Table
					variant="unstyled"
					textAlign={'center'}
					w={'full'}
					whiteSpace={'normal'}
					overflowX="auto"
				>
					<Thead h="11" position={'sticky'} top={0} zIndex={10}>
						{table.getHeaderGroups().map((headerGroup) => (
							<Tr
								bg={'pri.gray.200'}
								color="font.300"
								key={headerGroup.id}
								fontWeight={400}
								fontSize={'16px'}
							>
								{headerGroup.headers.map((header) => {
									return (
										<Th key={header.id} p={0} pr={3} fontSize={'16px'} textAlign={'center'}>
											{header.isPlaceholder
												? null
												: flexRender(header.column.columnDef.header, header.getContext())}
										</Th>
									);
								})}
							</Tr>
						))}
					</Thead>
					<Tbody
						onMouseLeave={() => {
							sethoverRowId('');
						}}
						overflowY="auto"
					>
						{table.getRowModel().rows.map((row) => {
							return (
								<Tr
									h={'11'}
									color="font.200"
									bg={hoverRowId === row.id ? 'backs.100' : 'backs.200'}
									onMouseEnter={() => {
										sethoverRowId(row.id);
									}}
									key={row.id}
									cursor={'pointer'}
								>
									{row.getVisibleCells().map((cell) => {
										return (
											<Td
												key={cell.id}
												textAlign={'center'}
												py="0"
												h={'11'}
												borderBottomWidth={'1px'}
												borderBottomColor={'border.100'}
												p={0}
												pr={3}
												bg={'backs.300'}
												// color={'font.400'}
												fontSize={'16px'}
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
				{/* {
          <Box textAlign="center" width={'48'} m="auto">
            // eslint-disable-next-line react/jsx-no-undef
            <Image src={Null} quality="100" objectFit="cover" alt="空状态" />
            <Text fontSize={'16px'} color="font.100">
              暂无数据
            </Text>
          </Box>
        } */}
			</TableContainer>
			<Flex w="full" h={'58px'} alignItems="center" justifyContent="flex-end" pr={2}>
				<Pagination
					defaultCurrent={data.current}
					current={data.current}
					total={data.total}
					paginationProps={{
						display: 'flex',
					}}
					onChange={(current, pages, size, total) => {
						getTableData({ currentPage: current!, pageSize: size! });
					}}
					pageSize={data.size}
					pageSizeOptions={[10, 25, 50]}
					onShowSizeChange={(current, size) => {
						getTableData({ currentPage: current!, pageSize: size! });
					}}
					showTotal={(total) => (
						<Box color="font.100" px="4" display="inline-flex">
							共
							<Text color={'black'} px="1">
								{total}
							</Text>
							条数据
						</Box>
					)}
					showSizeChanger
					pageNeighbours={1}
					showQuickJumper
				/>
			</Flex>
			{/* 日志 */}
			<Modal isOpen={isOpenLog} onClose={handleLogClose} size="4xl" scrollBehavior="inside">
				<ModalOverlay></ModalOverlay>
				<ModalContent>
					<ModalHeader>日志</ModalHeader>
					<ModalCloseButton></ModalCloseButton>
					<ModalBody pb={8}>
						<div dangerouslySetInnerHTML={{ __html: logInfo }}></div>
						{showMore && (
							<Center pos="relative" mt={4}>
								<Divider variant="dashed"></Divider>
								<Button
									variant="link"
									pos={'absolute'}
									top={-3}
									left="50%"
									onClick={handleLoadMore}
								>
									更多
								</Button>
							</Center>
						)}
						{!showMore && (
							<Center>
								<Text>暂无日志数据</Text>
							</Center>
						)}
					</ModalBody>
					<ModalFooter>
						<HStack justifyContent={'flex-end'} alignItems="center">
							<Button onClick={handleLogClose} colorScheme="blue">
								关闭
							</Button>
						</HStack>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

interface IDdelComponent {
	id: string;
	del: (id: string) => void;
}

const DelComponent = ({ id, del }: IDdelComponent) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const warp = useRef<HTMLDivElement | null>(null);
	const click = useMemoizedFn(() => {
		onOpen();
	});
	const del_ = useMemoizedFn(() => {
		del(id);
		onClose();
	});
	useOutsideClick({
		ref: warp,
		handler: () => {
			onClose();
		},
	});
	return (
		<Popover isOpen={isOpen}>
			<PopoverTrigger>
				<Button
					fontWeight={0}
					onClick={click}
					size="sm"
					color={'pri.white.100'}
					_hover={{
						bg: 'blue.400',
					}}
					bg="pri.red.100"
				>
					删除
				</Button>
			</PopoverTrigger>
			<PopoverContent w="max-content">
				{/* 
        <PopoverCloseButton /> */}

				<PopoverArrow />
				<Box ref={warp} cursor={'default'}>
					<PopoverHeader>确定要删除吗?</PopoverHeader>
					<PopoverBody>
						<Text cursor="pointer" onClick={del_} display="inline">
							确定
						</Text>
					</PopoverBody>
				</Box>
			</PopoverContent>
		</Popover>
	);
};

export default ProductTable;
