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
	ModalFooter,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	Radio,
	RadioGroup,
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	useToast,
	Checkbox,
} from '@chakra-ui/react';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import Null from '@/assets/layout/null.png';
import Image from 'next/image';
import Pagination from '@/components/Pagination';
import { useLocalStorageState, useMemoizedFn, useMount } from 'ahooks';
import { IPageData } from '@/utils/publicData';
import { TableAlertDelComponent as TableDel } from '@/components/TableDel';
import type { IDeviceType, IDeviceListItem, IAreaCell } from '@/models/system';
import { request } from '@/utils/request';
import { useSafeState } from 'ahooks';
import { Controller, useForm } from 'react-hook-form';
import moment from 'moment';
import React from 'react';
import { buttonAuthMenus, IUserInfo } from '@/models/user';
import { useRecoilValue } from 'recoil';

type PropsType = {
	data: IPageData<IDeviceListItem>;
	getTableData: ({ pageIndex, pageSize }: { pageIndex: number; pageSize?: number }) => void;
	goEdit: (item: IDeviceListItem) => void;
	setItemInfo: (item?: IDeviceListItem) => void;
	del: (id: string) => void;
	itemInfo?: IDeviceListItem;
	deviceTypeList: IDeviceType[];
	getSourceList: ({ pageIndex, pageSize }: { pageIndex: number; pageSize?: number }) => void;
	currentPageChecked: string[];
	setCurrentPageChecked: (data: string[]) => void;
	isBatch: boolean;
	setIsBatch: (data: boolean) => void;
	getTableObj: (closeDeviceOnOpen: () => void, openDeviceOnOpen: () => void) => void;
};

const ProductTable = ({
	data,
	getTableData,
	goEdit,
	del,
	setItemInfo,
	itemInfo,
	deviceTypeList,
	getSourceList,
	currentPageChecked,
	setCurrentPageChecked,
	getTableObj,
	setIsBatch,
	isBatch,
}: PropsType) => {
	const [hoverRowId, sethoverRowId] = useState('');
	const { isOpen: infoIsOpen, onClose: infoOnClose, onOpen: infoOnOpen } = useDisclosure();
	const toast = useToast();
	const [switchDeviceLoading, setSwitchDeviceLoading] = useSafeState(false);
	const openCancelRef = React.useRef<HTMLButtonElement>(null);
	const methods = useForm();
	const [currentUserInfo] = useLocalStorageState<null | IUserInfo>('currentUserInfo_cx_alarm');
	const buttonAuth = useRecoilValue(buttonAuthMenus);
	// 按钮权限

	const isEidt = buttonAuth.findIndex((auth) =>
		['/systemsManage/resources/equipmentLocationManagement/edit'].includes(auth.url)
	);

	const isDel = buttonAuth.findIndex((auth) =>
		['/systemsManage/resources/equipmentLocationManagement/del'].includes(auth.url)
	);
	const {
		register,
		getValues,
		setValue,
		formState: { errors, isSubmitted },
		handleSubmit,
		reset,
		watch,
		control,
	} = methods;

	//关闭设备弹窗
	const {
		isOpen: closeDeviceisOpen,
		onClose: closeDeviceOnClose,
		onOpen: closeDeviceOnOpen,
	} = useDisclosure();

	//开启设备弹窗
	const {
		isOpen: openDeviceisOpen,
		onClose: openDeviceOnClose,
		onOpen: openDeviceOnOpen,
	} = useDisclosure();

	const turnOffWay = watch('turnOffWay');

	//生产单元
	const [areaCellList, setAreaCellList] = useSafeState<IAreaCell[]>([]);
	const [hasRoot, setHasRoot] = useState(false);

	const checkBoxOnChang = useMemoizedFn((checked: boolean, id: string) => {
		let newArr = [...currentPageChecked];
		if (checked) {
			newArr.push(id);
		} else {
			newArr = newArr.filter((item) => item != id);
		}
		setCurrentPageChecked(newArr);
	});

	const checkBoxAllOnChang = useMemoizedFn((checked: boolean) => {
		if (checked) {
			setCurrentPageChecked(data.records.map((item) => item.id));
		} else {
			setCurrentPageChecked([]);
		}
	});

	useMount(() => {
		getTableObj(closeDeviceOnOpen, openDeviceOnOpen);
	});

	useEffect(() => {
		setCurrentPageChecked([]);
	}, [data.records]);

	const columns = useMemo<ColumnDef<IDeviceListItem>[]>(() => {
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
					const { id } = row.original;
					return (
						<Checkbox
							onChange={(e) => checkBoxOnChang(e.target.checked, row.original.id)}
							isChecked={currentPageChecked.includes(id)}
						/>
					);
				},
			},
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
				header: '点位位号',

				cell: (row) => {
					return row.getValue();
				},
			},
			{
				id: 'equipmentId',
				accessorKey: 'equipmentId',
				header: '设备位号',

				cell: (row) => {
					return row.getValue();
				},
			},
			{
				id: 'switchStatus',
				accessorKey: 'switchStatus',
				header: '设备开关状态',

				cell: (row) => {
					const v = row.getValue();
					return (
						<Box
							color="pri.blue.100"
							cursor="pointer"
							onClick={() => {
								setValue('resourceId', row.row.original.id);
								if (v === 1) {
									closeDeviceOnOpen();
								} else {
									openDeviceOnOpen();
								}
							}}
						>
							{v === 1 ? '开启' : '关闭'}
						</Box>
					);
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
							{isEidt > -1 && (
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
							)}
							{isDel > -1 && (
								<TableDel
									confirm={() => {
										del(row.row.original.id);
									}}
									buttonProps={{ fontSize: '14px', p: '4px 12px', height: '32px' }}
								/>
							)}
						</HStack>
					);
				},
			},
		];
	}, [data, currentPageChecked, isEidt, isDel]);

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

	const closeDevice = useMemoizedFn(async (e) => {
		setSwitchDeviceLoading(true);

		const obj = { ...e, resourceIds: isBatch ? currentPageChecked : [e.resourceId] };
		if (e.startTime && e.endTime) {
			const startTime = moment(e.startTime).format('YYYY-MM-DD HH:mm:ss');
			const endTime = moment(e.endTime).format('YYYY-MM-DD HH:mm:ss');
			obj.startTime = startTime;
			obj.endTime = endTime;
		}

		const { code, msg } = await request<IDeviceType[]>({
			url: `/cx-alarm/alm/turnoff/turnOffResource`,
			options: {
				method: 'put',
				body: JSON.stringify({
					...obj,
				}),
			},
		});
		setSwitchDeviceLoading(false);

		if (code === 200) {
			getSourceList({ pageIndex: data.current, pageSize: data.size });
			closeDeviceOnClose();
		} else {
			toast({ position: 'top', title: msg, status: 'error', duration: 2000, isClosable: true });
		}
	});

	const openDevice = useMemoizedFn(async () => {
		setSwitchDeviceLoading(true);
		const param = isBatch ? currentPageChecked : [getValues('resourceId')];
		const { code, msg } = await request<IDeviceType[]>({
			url: `/cx-alarm/alm/turnoff/turnOnResource`,
			options: {
				method: 'put',
				body: JSON.stringify(param),
			},
		});
		if (code === 200) {
			getSourceList({ pageIndex: data.current, pageSize: data.size });
			openDeviceOnClose();
		} else {
			toast({ position: 'top', title: msg, status: 'error', duration: 2000, isClosable: true });
		}
		setSwitchDeviceLoading(false);
	});

	return (
		<>
			<TableContainer w="full" mt={2} flex={1} overflowY="auto">
				<Table variant="unstyled" textAlign={'left'} w={'full'} whiteSpace={'normal'}>
					<Thead
						h="11"
						position={'sticky'}
						top={0}
						zIndex={10}
						//bg="backs.100"
						//bg="red"
					>
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
						defaultCurrent={1}
						current={data.current}
						total={data.total}
						paginationProps={{
							display: 'flex',
						}}
						onChange={(current, pages, size, total) => {
							getTableData({ pageIndex: current! });
						}}
						pageSize={50}
						pageSizeOptions={[50, 100, 150]}
						onShowSizeChange={(current, size) => {
							getTableData({ pageIndex: current!, pageSize: size });
						}}
						pageNeighbours={1}
						showSizeChanger
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
					<ModalHeader>设备详情</ModalHeader>
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
							<HStack>
								<Box flex={1}>设备开启状态:{itemInfo?.switchStatus === 1 ? '开启' : '关闭'}</Box>
							</HStack>
						</Stack>
					</ModalBody>
				</ModalContent>
			</Modal>

			<Modal
				isOpen={closeDeviceisOpen}
				onClose={closeDeviceOnClose}
				size="lg"
				onCloseComplete={() => {
					reset();
					closeDeviceOnClose();
					setIsBatch(false);
				}}
			>
				<ModalOverlay></ModalOverlay>
				<ModalContent w="500px" maxW="unset" pb="20px">
					<ModalHeader>关闭设备资源</ModalHeader>
					<ModalCloseButton></ModalCloseButton>
					<ModalBody>
						<FormControl
							mt={2}
							isRequired={turnOffWay === '1'}
							isInvalid={(errors as unknown as any).startTime}
						>
							<Flex>
								<FormLabel w={'120px'} mr={0}>
									关闭生效开始时间：
								</FormLabel>

								<Input
									type="datetime-local"
									{...register('startTime', {
										required: turnOffWay === '1' ? '请选择开始时间' : undefined,
									})}
									placeholder="请选择开始时间"
									w="300px"
								/>
							</Flex>
							{turnOffWay === '1' ? (
								<FormErrorMessage mt={0} pl="120px">
									{(errors as unknown as any).startTime?.message}
								</FormErrorMessage>
							) : null}
						</FormControl>
						<FormControl
							mt={2}
							isRequired={turnOffWay === '1'}
							isInvalid={(errors as unknown as any).endTime}
						>
							<Flex>
								<FormLabel w={'120px'} mr={0}>
									关闭生效结束时间：
								</FormLabel>

								<Input
									type="datetime-local"
									{...register('endTime', {
										required: turnOffWay === '1' ? '请选择结束时间' : undefined,
									})}
									placeholder="请选择结束时间"
									w="300px"
								/>
							</Flex>
							{turnOffWay === '1' ? (
								<FormErrorMessage mt={0} pl="120px">
									{(errors as unknown as any).endTime?.message}
								</FormErrorMessage>
							) : null}
						</FormControl>
						<FormControl isInvalid={!!errors.turnOffWay} mb="10">
							<Flex>
								<FormLabel w={'120px'} mr={0}>
									关闭方式
								</FormLabel>
								<Controller
									control={control}
									rules={{
										required: {
											value: true,
											message: '请选择关闭方式',
										},
									}}
									render={({ field: { onChange, onBlur, value } }) => (
										<RadioGroup onChange={onChange} value={value} onBlur={onBlur}>
											<Stack direction="row">
												<Radio value={'1'}>定时关闭</Radio>
												<Radio value={'2'}>永久关闭</Radio>
											</Stack>
										</RadioGroup>
									)}
									name="turnOffWay"
								/>
							</Flex>

							<FormErrorMessage pl="120px">
								{errors.turnOffWay ? (errors.turnOffWay.message as unknown as string) : null}
							</FormErrorMessage>
						</FormControl>
					</ModalBody>
					<ModalFooter>
						<HStack justifyContent={'flex-end'} alignItems="center">
							<Button onClick={closeDeviceOnClose}>取消</Button>
							<Button
								colorScheme={'blue'}
								isLoading={switchDeviceLoading}
								onClick={handleSubmit(closeDevice)}
							>
								确定
							</Button>
						</HStack>
					</ModalFooter>
				</ModalContent>
			</Modal>

			{/* 开启设备弹窗 */}
			<AlertDialog
				isOpen={openDeviceisOpen}
				leastDestructiveRef={openCancelRef}
				onClose={openDeviceOnClose}
				onCloseComplete={() => {
					setIsBatch(false);
				}}
			>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader fontSize="lg" fontWeight="bold">
							开启设备
						</AlertDialogHeader>
						<AlertDialogBody>确定要开启设备吗?</AlertDialogBody>
						<AlertDialogFooter>
							<Button ref={openCancelRef} onClick={openDeviceOnClose}>
								取消
							</Button>
							<Button onClick={openDevice} ml={3} isLoading={switchDeviceLoading}>
								确定
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</>
	);
};

export default ProductTable;
