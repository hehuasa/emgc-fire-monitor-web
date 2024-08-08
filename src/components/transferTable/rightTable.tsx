'use client';
import Pagination from '@/components/Pagination';
import {
	Box,
	Flex,
	Highlight,
	Table,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
	Text,
	TableContainer,
	Button,
} from '@chakra-ui/react';

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import React, { useEffect, useMemo, useState } from 'react';
import { useMemoizedFn } from 'ahooks';
import Null from '@/assets/layout/null.png';
import Image from 'next/image';
import { IPageState } from '../../app/(sms)/sms/infoPush/rule/add';
import {
	allDeviceListModel,
	deviceType,
	filterDeviceModal,
	selectDeviceIdsModel,
} from '@/models/sms';
import { useRecoilState, useRecoilValue } from 'recoil';
import { cloneDeep } from 'lodash';
// import LoadingComponent from '@/components/Loading';

export interface rightTableRowType {
	resourceName: string;
	deviceName: string;
	iotDeviceId: string;
	iotSubDeviceId: string;
	id: string;
	areaId: string;
	cellId: string;
	deptId: string;
}

export type tableRequest<T> = {
	current: number;
	pages: number;
	records: [T];
	size: number;
	total: number;
};

const RuleTable = () => {
	const deviceData = useRecoilValue(allDeviceListModel);
	const [deviceIds, setDeviceIds] = useRecoilState(selectDeviceIdsModel);
	const [rightTable, setRightTable] = useRecoilState(filterDeviceModal);
	const [pageState, setPageState] = useState<IPageState>({ current: 1, size: 10, total: 0 });
	const [data, setData] = useState<deviceType[]>([]);

	useEffect(() => {
		getData(pageState.current);
	}, [deviceData, deviceIds]);

	const getData = useMemoizedFn((current: number) => {
		const data_ = deviceData.filter((device) => deviceIds.includes(device.id));
		const currentPageData = data_.slice((current - 1) * pageState.size, current * pageState.size);
		setData(currentPageData);
		console.log('右边table', data_);
		setRightTable(data_);
		setPageState({
			current,
			size: pageState.size,
			total: data_.length,
		});
	});

	const handleDel = useMemoizedFn((row: deviceType) => {
		const cloneIds = cloneDeep(deviceIds);
		const delItemIndex = cloneIds.findIndex((v) => v === row.id);

		if (delItemIndex !== -1) {
			cloneIds.splice(delItemIndex, 1);
			setDeviceIds(cloneIds);
		}
	});

	const columns = useMemo<ColumnDef<deviceType>[]>(() => {
		return [
			{
				id: 'resourceName',
				header: '点位名称',
				accessorKey: 'resourceName',
				cell: (info) => {
					return <Box>{info.getValue() as string}</Box>;
				},
			},
			{
				id: 'resourceNo',
				header: '点位编号',
				accessorKey: 'resourceNo',
				cell: (info) => {
					return <Box>{info.getValue() as string}</Box>;
				},
			},
			{
				id: 'tool',
				header: '',
				cell: ({ row }) => {
					return (
						<Button
							fontSize={'16px'}
							variant="ghost"
							colorScheme="blue"
							onClick={() => handleDel(row.original)}
						>
							清除
						</Button>
					);
				},
			},
		];
	}, []);

	const table = useReactTable({
		columns,
		data: data || [],
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<>
			<TableContainer
				w="full"
				overflowY="auto"
				flex={1}
				layerStyle="scrollbarStyle"
				maxH={'calc(100vh - 500px)'}
				border={'1px solid'}
				borderColor={'pri.gray.200'}
				borderRadius={'10px'}
			>
				<Table w="full" variant="unstyled" textAlign={'left'} overflowX="auto" whiteSpace="nowrap">
					<Thead>
						{table.getHeaderGroups().map((headerGroup) => (
							<Tr bg={'pri.gray.300'} color="pri.dark.100" key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									const headerKey = header.column.id;
									return (
										<Th
											key={header.id}
											p="2"
											paddingStart="0"
											paddingEnd="0"
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
								>
									{row.getVisibleCells().map((cell) => {
										const cellKey = cell.column.id;

										return (
											<Td
												py={0}
												px={1}
												h="10"
												paddingStart="2"
												paddingEnd="2"
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
				{!data.length && (
					<Box textAlign="center" width={'48'} m="auto">
						<Image src={Null} quality="100" objectFit="cover" alt="空状态" />
						<Text fontSize={'16px'} color="font.100">
							暂无数据
						</Text>
					</Box>
				)}
			</TableContainer>

			{data.length ? (
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
						defaultCurrent={pageState.current}
						current={pageState.current}
						total={pageState.total || 1}
						paginationProps={{
							display: 'flex',
						}}
						onChange={(current) => {
							if (current) {
								setPageState({ ...pageState });
								getData(current);
							}
						}}
						pageSize={pageState.size}
						pageSizeOptions={[10, 25, 50]}
						showTotal={(total) => (
							<Text color="pri.dark.100" px="4" fontSize={'12px'}>
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
			) : null}
		</>
	);
};

export default RuleTable;
