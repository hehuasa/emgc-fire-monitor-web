'use client';
import Pagination from '@/components/Pagination';
import {
	checkedAlarmIdsModel,
	currentAlarmModel,
	dealAlarmModalVisibleModal,
	IAlarmDetail,
} from '@/models/alarm';
import { request } from '@/utils/request';
import {
	Box,
	Checkbox,
	Flex,
	Highlight,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Table,
	TableContainer,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	useDisclosure,
} from '@chakra-ui/react';

import AlarmDealModal from '@/app/(emgc)/emgc/montior/operation/LeftPanel/AlarmDeal';
import Null from '@/assets/layout/null.png';
import AlarmDetail from '@/components/Alarm/AlarmDetail';
import LoadingComponent from '@/components/Loading';
import { IPageData } from '@/utils/publicData';
import { alarmStatusText } from '@/utils/util';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useMemoizedFn, useMount, useUnmount } from 'ahooks';
import Image from 'next/image';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useRecoilState, useSetRecoilState } from 'recoil';
import SmoothScrollbar from 'smooth-scrollbar';
import TableSetting from './TableSetting';

interface IProps {
	isLoading: boolean;
	data: IPageData<IAlarmDetail>;
	getPage: (current: number, size?: number) => void;
}

//需要展示的项
const initFilterColumns: string[] = [
	'checked',
	'No',
	'alarmNo',
	'alarmTypeName',
	'resourceNo',

	'alarmLevelName',
	// 'deptName',
	// 'alarmAreaName',
	'address',
	// 'way',
	'alarmFirstTime',
	'alarmLastTime',
	'statusView',
	'dealResultView',
	'dealUserName',
	'dealTime',
	'operator',
];

const AlarmTable = ({ isLoading, data, getPage }: IProps) => {
	const [filterColumns, setfilterColumns] = useState<string[]>(initFilterColumns);
	const domWarp = useRef<HTMLDivElement | null>(null);
	const scrollbar = useRef<SmoothScrollbar | null>(null);
	const [currentPageChecked, setCurrentPageChecked] = useRecoilState(checkedAlarmIdsModel);
	const [currentAlarmDetail, setCurrentAlarmDetail] = useRecoilState<IAlarmDetail | null>(
		currentAlarmModel
	);

	const setDealAlarmVisible = useSetRecoilState(dealAlarmModalVisibleModal);
	const { formatMessage } = useIntl();
	const { isOpen, onOpen, onClose } = useDisclosure();

	const showAlalrmDetail = async (id: string) => {
		const res = await request<IAlarmDetail>({ url: `/cx-alarm/alm/alarm/find/${id}` });
		if (res.code === 200) {
			setCurrentAlarmDetail(res.data);
			onOpen();

			return;
		}
	};

	useMount(() => {
		if (domWarp.current) {
			scrollbar.current = SmoothScrollbar.init(domWarp.current);
		}
	});

	useUnmount(() => {
		setCurrentAlarmDetail(null);
		setCurrentPageChecked([]);
	});

	const checkBoxOnChang = useMemoizedFn((checked: boolean, alarmId: string) => {
		let newArr = [...currentPageChecked];
		if (checked) {
			newArr.push(alarmId);
		} else {
			newArr = newArr.filter((item) => item != alarmId);
		}
		setCurrentPageChecked(newArr);
	});

	const checkBoxAllOnChang = useMemoizedFn((checked: boolean) => {
		if (checked) {
			setCurrentPageChecked(data.records.map((item) => item.alarmId));
		} else {
			setCurrentPageChecked([]);
		}
	});

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const columns = useMemo<ColumnDef<IAlarmDetail>[]>(() => {
		return [
			{
				id: 'checked',
				header: ({ table }) => {
					return (
						<Checkbox
							onChange={(e) => checkBoxAllOnChang(e.target.checked)}
							isChecked={
								!!currentPageChecked.length && currentPageChecked.length === data.records.length
							}
							isIndeterminate={
								!!currentPageChecked.length && currentPageChecked.length !== data.records.length
							}
						/>
					);
				},
				cell: ({ row }) => {
					const { alarmId } = row.original;
					return (
						<Checkbox
							onChange={(e) => checkBoxOnChang(e.target.checked, row.original.alarmId)}
							isChecked={currentPageChecked.includes(alarmId)}
						/>
					);
				},
			},
			{
				id: 'No',
				header: formatMessage({ id: 'no' }),
				cell: (info) => <Box w="15">{info.row.index + 1}</Box>,
			},
			{
				id: 'alarmNo',
				header: formatMessage({ id: 'alarm.id' }),
				accessorKey: 'alarmNo',

				cell: (info) => {
					return (
						<Box
							cursor="pointer"
							color="pri.blue.100"
							_hover={{ color: 'pri.blue.200' }}
							onClick={() => {
								showAlalrmDetail(info.row.original.alarmId);
							}}
						>
							{info.getValue() as string}
						</Box>
					);
				},
			},
			{
				id: 'alarmTypeName',
				header: formatMessage({ id: 'alarm.type' }),
				accessorKey: 'alarmTypeName',

				cell: (info) => {
					return <Box>{info.getValue() as string}</Box>;
				},
			},
			{
				id: 'deptName',
				header: formatMessage({ id: 'alarm.director.org' }),
				accessorKey: 'deptName',

				cell: (info) => {
					return <Box>{info.getValue() as string}</Box>;
				},
			},
			{
				id: 'alarmAreaName',
				header: formatMessage({ id: 'alarm.areaName' }),
				accessorKey: 'alarmAreaName',

				cell: (info) => {
					return <Box>{info.getValue() as string}</Box>;
				},
			},

			{
				id: 'resourceNo',
				header: formatMessage({ id: 'alarm.res.proNum' }),
				accessorKey: 'resourceNo',

				cell: (info) => {
					return <Box>{info.getValue() as string}</Box>;
				},
			},
			{
				id: 'alarmLevelName',
				header: formatMessage({ id: 'alarm.level' }),
				accessorKey: 'alarmLevelName',

				cell: (info) => {
					return <Box>{info.getValue() as string}</Box>;
				},
			},
			{
				id: 'address',
				header: formatMessage({ id: 'alarm.place' }),
				accessorKey: 'address',

				cell: (info) => {
					return <Box>{info.getValue() as string}</Box>;
				},
			},
			{
				id: 'alarmWayView',
				header: '报警方式',
				accessorKey: 'alarmWayView',

				cell: (info) => {
					return <Box>{info.getValue() as string}</Box>;
				},
			},
			{
				id: 'alarmFirstTime',
				header: formatMessage({ id: 'alarm.startTime' }),
				accessorKey: 'alarmFirstTime',

				cell: (info) => {
					return <Box>{info.getValue() as string}</Box>;
				},
			},
			{
				id: 'alarmLastTime',
				header: formatMessage({ id: 'alarm.endTime' }),
				accessorKey: 'alarmLastTime',

				cell: (info) => {
					return <Box>{info.getValue() as string}</Box>;
				},
			},

			{
				id: 'statusView',
				header: formatMessage({ id: 'alarm.status' }),
				accessorKey: 'statusView',

				cell: (info) => {
					const status = info.row.original.status;
					return alarmStatusText(status);
				},
			},

			{
				id: 'dealResultView',
				header: formatMessage({ id: 'alarm.deal.result' }),
				accessorKey: 'dealResultView',

				cell: (info) => {
					return <Box>{info.getValue() as string}</Box>;
				},
			},

			{
				id: 'dealUserName',
				header: formatMessage({ id: 'alarm.deal.user' }),
				accessorKey: 'dealUserName',

				cell: (info) => {
					return <Box>{info.getValue() as string}</Box>;
				},
			},
			{
				id: 'dealTime',
				header: formatMessage({ id: 'alarm.deal.time' }),
				accessorKey: 'dealTime',

				cell: (info) => {
					return <Box>{info.getValue() as string}</Box>;
				},
			},
			{
				id: 'operator',
				accessorKey: 'operator',
				header: '操作',
				cell: (row) => {
					const status = row.row.original.status;
					if (status === '01' && process.env.NEXT_PUBLIC_ANALYTICS_Ms_type != 'qs') {
						return (
							<Box
								onClick={() => {
									setCurrentAlarmDetail(row.row.original);
									setDealAlarmVisible({ visible: true });
								}}
								cursor="pointer"
								border="none"
								bg="unset"
								color="pri.blue.100"
								fontWeight="normal"
							>
								处理
							</Box>
						);
					}
					return <Box>-</Box>;
				},
			},

			{
				id: 'tool',
				cell: '',
			},
		];
	}, [filterColumns, currentPageChecked]);

	const dealCallBack = useMemoizedFn(() => {
		getPage(1);
	});

	useEffect(() => {
		if (currentPageChecked.length) {
			setCurrentPageChecked([]);
		}
	}, [data.records]);

	const table = useReactTable({
		columns,
		data: data.records,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<>
			<Flex bg="pri.white.100" h="full" flexDirection="column">
				{isLoading ? (
					<LoadingComponent />
				) : (
					<TableContainer
						position="relative"
						w="full"
						px="2"
						overflowY="auto"
						flex={1}
						layerStyle="scrollbarStyle"
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
										bg={'pri.blue.400'}
										color="pri.dark.100"
										key={headerGroup.id}
										position="sticky"
										top="0px"
									>
										{headerGroup.headers
											.filter(
												(val) => val.column.id === 'tool' || filterColumns.includes(val.column.id)
											)
											.map((header) => {
												const headerKey = header.column.id;

												if (headerKey === 'tool') {
													return (
														<Th
															p="2"
															key={header.id}
															left={0}
															right={0}
															zIndex={2}
															textAlign={'center'}
															h="10"
														>
															<TableSetting
																filterColumns={filterColumns}
																setfilterColumns={setfilterColumns}
															/>
														</Th>
													);
												}
												return (
													<Th
														key={header.id}
														p="2"
														paddingStart="0"
														paddingEnd="0"
														fontWeight="500"
														textAlign={headerKey === 'No' ? 'center' : 'left'}
														fontSize="md"
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
							<Tbody>
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
											borderBottom="1px"
											borderColor="pri.gray.100"
										>
											{row
												.getVisibleCells()
												.filter(
													(val) => val.column.id === 'tool' || filterColumns.includes(val.column.id)
												)
												.map((cell) => {
													const cellKey = cell.column.id;

													return (
														<Td
															p="2"
															h="14"
															paddingStart="0"
															paddingEnd="0"
															key={cell.id}
															fontSize="md"
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
						{!data?.records?.length && (
							<Box textAlign="center" width={'48'} m="auto">
								<Image src={Null} quality="100" objectFit="cover" alt="空状态" />
								<Text fontSize={'16px'} color="font.100">
									{formatMessage({ id: 'alarm.nodata' })}
								</Text>
							</Box>
						)}
					</TableContainer>
				)}

				{data.records?.length ? (
					<Flex
						w="full"
						h="12"
						py="8"
						pr={5}
						borderTop="1px"
						borderColor="pri.gray.200"
						alignItems="center"
						justifyContent="right"
					>
						<Pagination
							defaultCurrent={data.current}
							current={data.current}
							total={data.total || 1}
							paginationProps={{
								display: 'flex',
							}}
							onChange={(current) => {
								if (current) {
									getPage(current);
								}
							}}
							pageSize={data.size}
							pageSizeOptions={[10, 25, 50]}
							onShowSizeChange={(current, size) => {
								getPage(current!, size);
							}}
							showTotal={(total) => (
								<Text color="pri.dark.100" px="4">
									<Highlight
										query={String(total)}
										styles={{ px: '1', py: '1', color: 'pri.blue.100' }}
									>
										{` ${total}  ${formatMessage({ id: 'records' })}`}
									</Highlight>
								</Text>
							)}
							showSizeChanger
							pageNeighbours={1}
							showQuickJumper
						/>
					</Flex>
				) : null}
			</Flex>

			<Modal size={'4xl'} isOpen={isOpen} onClose={onClose} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader
						py="0"
						textAlign="left"
						lineHeight="2.75rem"
						fontSize="lg"
						fontWeight="normal"
						bg="pri.gray.100"
						borderRadius="10px"
					>
						{formatMessage({ id: 'alarm.detail' })}
					</ModalHeader>
					<ModalCloseButton h="11" top="0" lineHeight="2.75rem" />
					<ModalBody color="pri.dark.100" bg="pri.white.100" py="5" borderRadius="10px">
						{currentAlarmDetail && <AlarmDetail alarmDetail={currentAlarmDetail} />}
					</ModalBody>
				</ModalContent>
			</Modal>

			<AlarmDealModal dealCallBack={dealCallBack} />
		</>
	);
};

export default memo(AlarmTable);
