import {
	TableContainer,
	Table,
	Thead,
	Tr,
	Th,
	Tbody,
	Td,
	HStack,
	Text,
	Flex,
	Box,
	Modal,
	useDisclosure,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Stack,
	Button,
} from '@chakra-ui/react';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useEffect, useMemo, useRef, useState } from 'react';
import Null from '@/assets/layout/null.png';
import Image from 'next/image';
import Pagination from '@/components/Pagination';
import { useMemoizedFn, useMount } from 'ahooks';
import { IPageData } from '@/utils/publicData';
import { TableAlertDelComponent as TableDel } from '@/components/TableDel';
import type { IDeviceType, IDeviceListItem, IAreaCell } from '@/models/system';
import { request } from '@/utils/request';
import { useSafeState } from 'ahooks';

type PropsType = {
	data: IPageData<IDeviceListItem[]>;
	getTableData: ({ pageIndex }: { pageIndex: number }) => void;
	goEdit: (item: IDeviceListItem) => void;
	setItemInfo: (item?: IDeviceListItem) => void;
	del: (id: string) => void;
	itemInfo?: IDeviceListItem;
	deviceTypeList: IDeviceType[];
};

const ProductTable = ({
	data,
	getTableData,
	goEdit,
	del,
	setItemInfo,
	itemInfo,
	deviceTypeList,
}: PropsType) => {
	const ref = useRef<HTMLDivElement | null>(null);
	const [showLeftPing, setShowLeftPing] = useState(false);
	const [showRightPing, setShowRightPing] = useState(false);
	const [hoverRowId, sethoverRowId] = useState('');
	const { isOpen: infoIsOpen, onClose: infoOnClose, onOpen: infoOnOpen } = useDisclosure();

	//生产单元
	const [areaCellList, setAreaCellList] = useSafeState<IAreaCell[]>([]);

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

	const columns = useMemo<ColumnDef<IDeviceListItem>[]>(() => {
		return [
			{
				id: 'index',
				accessorKey: 'index',
				header: '序号',

				cell: (row) => {
					return data.size! * (data.current! - 1) + row.row.index + 1;
				},
			},
			{
				id: 'resourceName',
				accessorKey: 'resourceName',
				header: '资源名称',

				cell: (row) => {
					return row.getValue();
				},
			},
			{
				id: 'deptName',
				accessorKey: 'deptName',
				header: '部门',

				cell: (row) => {
					return row.getValue();
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
				id: 'layerName',
				accessorKey: 'layerName',
				header: '图层',

				cell: (row) => {
					return row.getValue();
				},
			},
			{
				id: 'resourceNo',
				accessorKey: 'resourceNo',
				header: '工艺位号',

				cell: (row) => {
					return row.getValue();
				},
			},
			{
				id: 'address',
				accessorKey: 'address',
				header: '具体位置',

				cell: (row) => {
					return row.getValue();
				},
			},
			{
				id: 'operator',
				accessorKey: 'operator',
				header: '操作',
				cell: (row) => {
					return (
						<HStack spacing={2}>
							<Button
								borderRadius="6px"
								border="1px solid #1677ff"
								bg="#fff"
								color="#1677ff"
								_hover={{
									color: '#45a8ff',
								}}
								p="4px 12px"
								height={'32px'}
								fontWeight="normal"
								onClick={() => {
									setItemInfo(row.row.original);
									infoOnOpen();
								}}
								fontSize="14px"
							>
								详情
							</Button>
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
									goEdit(row.row.original);
								}}
								fontSize="14px"
							>
								修改
							</Button>
							<TableDel
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

	//查询生产单元
	const getareaCell = useMemoizedFn(async (areaId: string) => {
		const res = await request<IAreaCell[]>({
			url: `/cx-alarm/dc/area_cell/findByAreaId?areaId=${areaId}`,
		});
		if (res.code === 200) {
			setAreaCellList(res.data);
		}
	});

	const table = useReactTable({
		columns: columns as any,
		data: data.records || [],
		getCoreRowModel: getCoreRowModel(),
	});

	useEffect(() => {
		if (itemInfo?.areaId) {
			getareaCell(itemInfo.areaId);
		}
	}, [itemInfo]);

	return (
		<>
			<TableContainer w="full" mt={2} flex={1} overflowY="auto">
				<Table variant="unstyled" textAlign={'left'} w={'full'} whiteSpace={'normal'}>
					<Thead h="11" zIndex={10} bg="backs.100" position="sticky" top="0px">
						{table.getHeaderGroups().map((headerGroup) => (
							<Tr key={headerGroup.id} fontWeight="normal">
								{headerGroup.headers.map((header) => {
									return (
										<Th
											_notLast={{ borderRight: '1px solid #fff' }}
											bg="#f7f9fa"
											key={header.id}
											p="8px 15px"
											fontSize={'14px'}
											textAlign={'left'}
											fontWeight="normal"
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
									_hover={{ bg: '#e6f5ff' }}
								>
									{row.getVisibleCells().map((cell) => {
										return (
											<Td
												key={cell.id}
												textAlign={'left'}
												h={'11'}
												borderBottom="1px solid #e8e9eb"
												p="11px 15px"
												bg={'backs.300'}
												fontSize={'14px'}
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
				{!data.records.length ? (
					<Box textAlign="center" width={'48'} m="auto">
						<Image src={Null} quality="100" objectFit="cover" alt="空状态" />
						<Text fontSize={'16px'} color="font.100">
							暂无数据
						</Text>
					</Box>
				) : null}

				<Flex w="full" h={'58px'} alignItems="center" justifyContent="space-between" pr={2}>
					<Box>
						{data.current}/{data.pages} 总共：{data.total} 项
					</Box>
					<Pagination
						defaultCurrent={data.current}
						current={data.current}
						total={data.total}
						paginationProps={{
							display: 'flex',
						}}
						onChange={(current, pages, size, total) => {
							getTableData({ pageIndex: current! });
						}}
						pageSize={data.size}
						pageSizeOptions={[10, 25, 50]}
						onShowSizeChange={(current, size) => {
							getTableData({ pageIndex: current! });
						}}
						pageNeighbours={1}
						baseStyles={{
							background: '#fff',
							fontWeight: 'normal',
							p: '0px',
							w: '32px',
							h: '32px',
						}}
						activeStyles={{ border: '1px solid  #1677ff' }}
					/>
				</Flex>
			</TableContainer>

			<Modal
				isOpen={infoIsOpen}
				onClose={infoOnClose}
				onCloseComplete={() => setItemInfo(undefined)}
			>
				<ModalOverlay />
				<ModalContent maxW="800px">
					<ModalHeader>摄像头详情</ModalHeader>
					<ModalCloseButton />
					<ModalBody p="5">
						<Stack spacing={5}>
							<HStack>
								<Box flex={1}>资源(设备)名称:{itemInfo?.resourceName}</Box>
								<Box flex={1}>设备id:{itemInfo?.iotDeviceId}</Box>
							</HStack>
							<HStack>
								<Box flex={1}>子设备id:{itemInfo?.iotSubDeviceId}</Box>
								<Box flex={1} wordBreak="break-all">
									坐标或区域:{itemInfo?.coordinate ? JSON.stringify(itemInfo.coordinate) : ''}
								</Box>
							</HStack>
							<HStack>
								<Box flex={1}>工艺位号:{itemInfo?.resourceNo}</Box>
								<Box flex={1}>安装位置:{itemInfo?.address}</Box>
							</HStack>
							<HStack>
								<Box flex={1}>所属部门:{itemInfo?.deptName}</Box>
								<Box flex={1}>所属区域:{itemInfo?.areaName}</Box>
							</HStack>
							<HStack>
								<Box flex={1}>
									设备分类:
									{itemInfo?.productId
										? deviceTypeList.find((item) => item.id === itemInfo?.productId)?.productName
										: ''}
								</Box>
								<Box flex={1}>
									生产单元:
									{itemInfo?.cellId
										? areaCellList.find((item) => item.id === itemInfo.cellId)?.productionCellName
										: ''}
								</Box>
							</HStack>
							<HStack>
								<Box flex={1}>排序号:{itemInfo?.sortNo}</Box>
								<Box flex={1} wordBreak="break-all">
									图层:{itemInfo?.layerName}
								</Box>
							</HStack>
						</Stack>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export default ProductTable;
