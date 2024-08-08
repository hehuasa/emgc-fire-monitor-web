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
import { IPageData, initPageData } from '@/utils/publicData';
import { useMount, useMemoizedFn, useSafeState } from 'ahooks';
import { request } from '@/utils/request';
import { useForm } from 'react-hook-form';
import { useRef } from 'react';
import {} from '@/models/system';

export interface ICamera {
	accessPlatform: string;
	cameraCode: string;
	cameraName: string;
	cameraParam: null;
	cameraScreenCode: string;
	cameraType: string;
	createTime: string;
	id: string;
	manufacturer: null;
	online: false;
}

interface IKeyParam {
	cameraName?: string;
}

interface IProps {
	selectDevice: (item: ICamera) => void;
}

const DeviceTable = ({ selectDevice }: IProps) => {
	const [hoverRowId, sethoverRowId] = useSafeState('');
	const methods = useForm();
	const { register, handleSubmit } = methods;
	const [data, setData] = useSafeState<IPageData<ICamera>>(initPageData);

	const keyParam = useRef<IKeyParam>({});
	const columns = useMemo<ColumnDef<ICamera>[]>(() => {
		return [
			{
				id: 'cameraName',
				accessorKey: 'cameraName',
				header: '摄像头名称',
				cell: (row) => row.getValue(),
			},
			{
				id: 'id',
				accessorKey: 'id',
				header: '设备id',
				cell: (row) => row.getValue(),
			},
			{
				id: 'cameraCode',
				accessorKey: 'cameraCode',
				header: '摄像头编号',
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

		const { code, data } = await request<IPageData<ICamera>>({
			url: `/device-manger/camera/page`,
			options: {
				method: 'post',
				body: JSON.stringify({
					// accessPlatform: '',
					// cameraName: '',
					// manufacturer: '',
					// online: false,
					...keyParam.current,
					pageBean: {
						currentPage: current,
						pageSize: 10,
					},
				}),
			},
		});
		if (code === 200) {
			setData(data);
		}
	});

	const table = useReactTable({
		columns: columns,
		data: data.records || [],
		getCoreRowModel: getCoreRowModel(),
	});

	const headleSearch = useMemoizedFn((e: IKeyParam) => {
		keyParam.current = e;
		geDeviceList({ current: 1 });
	});

	return (
		<Box>
			<HStack spacing={'20px'} alignItems="center">
				<FormControl>
					<HStack>
						<FormLabel w={'120px'}>摄像头名称：</FormLabel>
						<Input w="200px" {...register('cameraName')} placeholder="请输入摄像头" />
					</HStack>
				</FormControl>
				<Button borderRadius="6px" color="#fff" bg="#1677ff" onClick={handleSubmit(headleSearch)}>
					查询
				</Button>
			</HStack>

			{data.total === 0 ? (
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
									<Tr bg={'pri.gray.100'} key={headerGroup.id}>
										{headerGroup.headers.map((header) => {
											return (
												<Th
													fontWeight="normal"
													p="4px 6px"
													key={header.id}
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
														p="4px 6px"
														bg={'backs.300'}
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
						{!data.records.length && (
							<Box textAlign="center" width={'48'} m="auto">
								<Image src={Null} quality="100" objectFit="cover" alt="空状态" />
								<Text fontSize={'16px'} color="font.100">
									暂无数据
								</Text>
							</Box>
						)}
					</TableContainer>

					<Flex w="full" h={'58px'} alignItems="center" justifyContent="flex-end" pr={2}>
						<Pagination
							defaultCurrent={1}
							current={data.current}
							total={data.total}
							paginationProps={{
								display: 'flex',
							}}
							onChange={(current, pages, size, total) => {
								geDeviceList({ current: current! });
							}}
							pageSize={data.size}
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
		</Box>
	);
};

export default DeviceTable;
