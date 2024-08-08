import {
	TableContainer,
	Table,
	Thead,
	Tr,
	Th,
	Tbody,
	Td,
	Text,
	Flex,
	Box,
	Button,
	FormControl,
	FormLabel,
	HStack,
	Input,
} from '@chakra-ui/react';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useMemo } from 'react';
import Null from '@/assets/layout/null.png';
import Image from 'next/image';
import Pagination from '@/components/Pagination';
import { useMount, useMemoizedFn, useSafeState } from 'ahooks';
import { request } from '@/utils/request';
import { stringify } from 'qs';
import { useForm } from 'react-hook-form';
import { useRef } from 'react';
import Spin from '@/components/Loading/Spin';

export interface IDevice {
	deviceId: string;
	name: string;
	subDeviceCode: string;
}

interface IKeyParam {
	name?: string;
}

interface IProps {
	selectDevice: (item: IDevice) => void;
}

const DeviceTable = ({ selectDevice }: IProps) => {
	const [hoverRowId, sethoverRowId] = useSafeState('');
	const methods = useForm();
	const { register, handleSubmit } = methods;
	const [data, setData] = useSafeState<IDevice[]>([]);
	const pagesize = 10;
	const [currentPage, setCurrentPage] = useSafeState(1);
	const keyParam = useRef<IKeyParam>({});
	const [loading, setLoading] = useSafeState(false);
	const columns = useMemo<ColumnDef<IDevice>[]>(() => {
		return [
			{
				id: 'name',
				accessorKey: 'name',
				header: '设备名称',
				cell: (row) => row.getValue(),
			},
			{
				id: 'deviceId',
				accessorKey: 'deviceId',
				header: '设备id',
				cell: (row) => row.getValue(),
			},
			{
				id: 'subDeviceCode',
				accessorKey: 'subDeviceCode',
				header: '子设备id',
				cell: (row) => row.getValue(),
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
								p="4px 15px"
								fontWeight="normal"
								onClick={() => {
									selectDevice(row.row.original);
								}}
							>
								选择
							</Button>
						</HStack>
					);
				},
			},
		];
	}, []);

	useMount(() => {
		geDeviceList({ current: 1 });
	});

	const geDeviceList = useMemoizedFn(async ({ current }: { current: number }) => {
		const obj = {
			current,
			size: 10,
			...keyParam.current,
		};
		if (keyParam.current.name && keyParam.current.name.trim()) {
			setCurrentPage(1);
			setLoading(true);
			const { code, data } = await request<IDevice[]>({
				url: `/device-manger/device/list_device_define?${stringify(obj)}`,
			});
			if (code === 200) {
				setData(data);
				setLoading(false);
			}
		} else {
			setData([]);
		}
	});

	const table = useReactTable({
		columns: columns,
		data: data || [],
		getCoreRowModel: getCoreRowModel(),
	});

	const headleSearch = useMemoizedFn((e: IKeyParam) => {
		keyParam.current = e;
		geDeviceList({ current: 1 });
	});

	return (
		<Spin spin={loading}>
			<HStack spacing={'20px'} alignItems="center">
				<FormControl>
					<HStack>
						<FormLabel w={'120px'}>设备名称：</FormLabel>
						<Input w="200px" {...register('name')} placeholder="请选择设备名称" />
					</HStack>
				</FormControl>
				<Button borderRadius="6px" color="#fff" bg="#1677ff" onClick={handleSubmit(headleSearch)}>
					查询
				</Button>
			</HStack>

			{data.length === 0 ? (
				<Box textAlign="center" width={'48'} m="auto">
					<Image src={Null} quality="100" objectFit="cover" alt="空状态" />
					<Text fontSize={'16px'} color="font.100">
						暂无数据
					</Text>
				</Box>
			) : (
				<>
					<TableContainer w="full" mt={2} h="full" overflowY="auto">
						<Table
							variant="unstyled"
							textAlign={'left'}
							w={'full'}
							whiteSpace={'normal'}
							overflowX="auto"
						>
							<Thead h="11" position={'sticky'} top={0} zIndex={10} bg="backs.100">
								{table.getHeaderGroups().map((headerGroup) => (
									<Tr key={headerGroup.id}>
										{headerGroup.headers.map((header) => {
											return (
												<Th
													fontWeight="normal"
													key={header.id}
													p="4px 6px"
													fontSize={'16px'}
													textAlign={'left'}
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
								{/* 0 10 
                      10 20
                  */}
								{table
									.getRowModel()
									.rows.slice((currentPage - 1) * pagesize, currentPage * pagesize)
									.map((row) => {
										return (
											<Tr
												h={'11'}
												onMouseEnter={() => {
													sethoverRowId(row.id);
												}}
												key={row.id}
											>
												{row.getVisibleCells().map((cell) => {
													return (
														<Td
															key={cell.id}
															textAlign={'left'}
															py="0"
															h={'11'}
															borderBottomWidth={'1px'}
															borderBottomColor={'border.100'}
															bg={'backs.300'}
															fontSize={'16px'}
															p="4px 6px"
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

					<Flex w="full" h={'58px'} alignItems="center" justifyContent="flex-end" pr={2}>
						<Pagination
							defaultCurrent={1}
							current={currentPage}
							total={data.length}
							paginationProps={{
								display: 'flex',
							}}
							onChange={(current, pages, size, total) => {
								setCurrentPage(current!);
							}}
							pageSize={pagesize}
							//pageSizeOptions={[10, 25, 50]}
							showTotal={(total) => (
								<Box color="font.100" px="4" display="inline-flex">
									共
									<Text color={'pri.blue.100'} px="1">
										{total}
									</Text>
									条数据
								</Box>
							)}
							pageNeighbours={1}
						/>
					</Flex>
				</>
			)}
		</Spin>
	);
};

export default DeviceTable;
