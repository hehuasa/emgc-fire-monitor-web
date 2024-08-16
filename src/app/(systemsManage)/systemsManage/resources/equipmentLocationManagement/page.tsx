'use client';

import UploadBtn from '@/components/Upload/uploadBtn';
import {
	Button,
	Flex,
	FormControl,
	FormLabel,
	HStack,
	Input,
	useDisclosure,
	useToast,
	Grid,
	GridItem,
} from '@chakra-ui/react';
import { useLocalStorageState, useMemoizedFn, useMount, useSafeState } from 'ahooks';
import { request, requestDownload } from '@/utils/request';
import { IPageData, initPageData } from '@/utils/publicData';
import Loading from '@/components/Loading/Spin';
import CustomSelect from '@/components/CustomSelect';
import Edit from './add/page';
import { IDeviceListItem, ILayer } from '@/models/system';
import ProductTable from './productTable';
import { IOritreeData } from '@/components/Montior/Tree';
import { IArea } from '@/models/map';
import type { IDeviceType, IDepartment } from '@/models/system';
import dynamic from 'next/dynamic';
import { stringify } from 'qs';
import { ChangeEvent, useRef, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useRecoilValue } from 'recoil';
import { IUserInfo, buttonAuthMenus } from '@/models/user';
import CustomSwitch from '@/components/customSwitch';
const TreeSelect = dynamic(() => import('@/components/Montior/TreeSelect'), { ssr: false });
type userInfoType = {
	userName?: string;
	loginAccount?: string;
	mobile?: string;
	orgId: string;
	orgName?: string;
	positionName?: string;
};
interface ISearchKey {
	resourceName?: string;
	layerId?: string;
	areaId?: string;
	resourceNo?: string;
	switchStatus?: number;
	equipmentId?: string;
	alarmDevice?: boolean;
	swithRadio?: boolean;
}

const ProductManage = () => {
	const methods = useForm<ISearchKey>({ defaultValues: {} });
	const { register, handleSubmit, control, setValue, getValues, reset } = methods;
	const [deviceTypeList, setDeviceTypeList] = useSafeState<IDeviceType[]>([]);
	const [deviceList, setDeviceList] = useSafeState<IPageData<IDeviceListItem>>(initPageData);
	const [layerList, setLayerList] = useSafeState<IOritreeData[]>([]);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const searchKey = useRef<ISearchKey>({});
	const [areaList, setAreaList] = useSafeState<IArea[]>([]);
	const [loading, setLoading] = useSafeState(false);
	const [depTree, setDepTree] = useSafeState<IOritreeData[]>([]);
	//是否是批量操作
	const [isBatch, setIsBatch] = useSafeState(false);
	//当前页面page选中的项
	const [currentPageChecked, setCurrentPageChecked] = useSafeState<string[]>([]);
	const [downloadLoading, setDownloadLoading] = useSafeState(false);

	const [itemInfo, setItemInfo] = useSafeState<IDeviceListItem>();

	const tableRef = useRef<{ closeDeviceOnOpen: () => void; openDeviceOnOpen: () => void }>();
	const buttonAuth = useRecoilValue(buttonAuthMenus);
	// 按钮权限

	const isAuth = buttonAuth.findIndex((auth) =>
		['/systemsManage/resources/equipmentLocationManagement/switch'].includes(auth.url)
	);

	const [status, setStatus] = useState<boolean>(false);

	const [pageState, setPageState] = useSafeState({
		pageIndex: 1,
		pageSize: 50,
	});

	const [currentUserInfo, setCurrentUserInfo] = useLocalStorageState<null | IUserInfo>(
		'emgc_web_currentUserInfo',
		{
			defaultValue: null,
		}
	);

	const toast = useToast();
	useMount(() => {
		getSourceList({ pageIndex: 1 });
		getLayerList();
		// getCategoryList();
		getArea();
		getDepartment();
		getDeviceTypeList();
		getSwitchStatus();
	});

	const getTableObj = useMemoizedFn(
		(closeDeviceOnOpen: () => void, openDeviceOnOpen: () => void) => {
			tableRef.current = { closeDeviceOnOpen, openDeviceOnOpen };
		}
	);

	const getUserInfo = useMemoizedFn(async () => {
		const { code, data } = await request<userInfoType>({
			url: `/ms-system/user/get/detail/${currentUserInfo?.userId}`,
		});
		if (code === 200) {
			return data;
		}
	});

	const getSourceList = useMemoizedFn(
		async ({ pageIndex, pageSize = 50 }: { pageIndex: number; pageSize?: number }) => {
			// const userInfo = await getUserInfo();
			const keyParam = {
				pageIndex,
				pageSize,
				...searchKey.current,
			};
			// if (userInfo) {
			// 	Object.assign(keyParam, {
			// 		orgId: userInfo?.orgId,
			// 	});
			// }

			setLoading(true);
			const { code, data } = await request<IPageData<IDeviceListItem>>({
				url: `/cx-alarm/device/manager/page?${stringify(keyParam)}`,
			});
			if (code === 200) {
				setDeviceList(data);
				setPageState({
					pageIndex: data.current,
					pageSize: data.size,
				});
			}
			setLoading(false);
		}
	);

	const handleSearch = async (e: ISearchKey) => {
		searchKey.current = {
			...e,
			switchStatus: e.switchStatus,
			resourceNo: e.resourceNo ? e.resourceNo.trim() : '',
			resourceName: e.resourceName ? e.resourceName.trim() : '',
			equipmentId: e.equipmentId ? e.equipmentId.trim() : '',
			//alarmDevice: true,
		};

		// if (getValues('alarmDevice')) {
		//   Object.assign(searchKey.current, {
		//     alarmDevice: getValues('alarmDevice'),
		//   });
		// }

		getSourceList({ pageIndex: 1, pageSize: pageState.pageSize });
	};

	const handleAdd = useMemoizedFn(() => {
		onOpen();
	});

	const del = useMemoizedFn(async (id: string) => {
		try {
			const { code, msg } = await request<IDeviceType[]>({
				url: `/cx-alarm/device/manager/delete/${id}`,
				options: { method: 'post' },
			});
			if (code === 200) {
				console.log('成功');
				toast({
					title: `删除成功`,
					status: 'success',
					position: 'top',
					duration: 2000,
					isClosable: true,
				});
				getSourceList({ pageIndex: 1, pageSize: pageState.pageSize });
			} else {
				toast({
					title: msg,
					status: 'error',
					position: 'top',
					duration: 2000,
					isClosable: true,
				});
			}
		} catch (err) {
			//
		}
	});
	//获取分类列表
	const getCategoryList = useMemoizedFn(async () => {
		const { code, data } = await request<any>({
			url: `/cx-alarm/device/manager/category`,
		});
	});

	const getLayerList = useMemoizedFn(async () => {
		const { code, data } = await request<ILayer[]>({
			url: `/cx-alarm/layer-mange/list`,
		});
		const fn = (list: ILayer[]) => {
			const data: IOritreeData[] = [];
			for (const item of list) {
				if (item.children && item.children.length) {
					data.push({
						name: item.layerName,
						id: item.id,
						children: fn(item.children),
					});
				} else {
					data.push({
						name: item.layerName,
						id: item.id,
					});
				}
			}
			return data;
		};
		if (code === 200) {
			setLayerList(fn(data));
		}
	});

	//获取区域
	const getArea = useMemoizedFn(async () => {
		const obj = {
			size: 1000,
			//deptId: getLeftDepId(),
		};
		const str = stringify(obj, { skipNulls: true });
		const res = await request<IPageData<IArea>>({ url: `/cx-alarm/dc/area/page?${str}` });
		if (res.code === 200) {
			setAreaList(res.data.records);
		}
	});

	//获取部门
	const getDepartment = useMemoizedFn(async () => {
		const res = await request<IDepartment[]>({ url: '/ms-system/org/list-org-tree' });

		if (res.code === 200) {
			const fn = (list: IDepartment[]) => {
				const data: IOritreeData[] = [];
				for (const item of list) {
					if (item.children && item.children.length) {
						data.push({
							name: item.orgName,
							id: item.id,
							children: fn(item.children),
						});
					} else {
						data.push({
							name: item.orgName,
							id: item.id,
						});
					}
				}
				return data;
			};

			const newData = fn(res.data);
			setDepTree(newData);
		}
	});

	//获取设备分类/cx-alarm/deviceType/list-all
	const getDeviceTypeList = useMemoizedFn(async () => {
		const res = await request<IDeviceType[]>({ url: '/cx-alarm/deviceType/list-all' });
		if (res.code === 200) {
			setDeviceTypeList(res.data);
		}
	});

	const goEdit = (item: IDeviceListItem) => {
		setItemInfo(item);
		onOpen();
	};

	const downloadTemplate = useMemoizedFn(async () => {
		setDownloadLoading(true);
		const res = await requestDownload({
			url: '/cx-alarm/device/manager/downloadIotDeviceRelevance',
			options: { name: '导入设备模版.xlsx' },
		});
		setDownloadLoading(false);
	});

	const uploadFileSuccess = useMemoizedFn(async () => {
		getSourceList({ pageIndex: 1, pageSize: pageState.pageSize });
	});

	const batchOpen = useMemoizedFn(() => {
		setIsBatch(true);
		tableRef.current?.openDeviceOnOpen();
	});

	const batchClose = useMemoizedFn(() => {
		setIsBatch(true);
		tableRef.current?.closeDeviceOnOpen();
	});

	// 获取开关状态
	const getSwitchStatus = useMemoizedFn(async () => {
		const { code, data } = await request<boolean>({
			url: `/cx-alarm/alm/turnoff/getMasterSwitchStatus`,
		});
		if (code === 200) {
			setStatus(data);
			//setValue('swithRadio', data);
		}
	});

	const handleChangeSwitch = useMemoizedFn((val: string | string[]) => {
		if (val === 'true') {
			setStatus(true);
		}
		if (val === 'false') {
			setStatus(false);
		}
		getSwitchOnorOff(val as string);
	});

	const handleChangeDeviceSwitch = useMemoizedFn((e: ChangeEvent<HTMLInputElement>) => {
		setValue('swithRadio', e.target.checked);
		if (e.target.checked) {
			setStatus(true);
		} else {
			setStatus(false);
		}
		getSwitchOnorOff(e.target.checked ? 'true' : 'false');
	});

	const getSwitchOnorOff = useMemoizedFn(async (type: string) => {
		let url = '';
		const options = {
			method: 'put',
		};
		if (type === 'true') {
			url = `/cx-alarm/alm/turnoff/turnOnAll`;
		} else {
			url = '/cx-alarm/alm/turnoff/turnOffAll';
		}
		const { code } = await request({
			url,
			options,
		});
		if (code === 200) {
			toast({
				title: '设置成功',
				duration: 1000,
				status: 'success',
				position: 'top',
			});
		}
		getSourceList({ pageIndex: 1, pageSize: pageState.pageSize });
	});

	const handleReset = useMemoizedFn(() => {
		reset({
			resourceName: '',
			areaId: '',
			layerId: '',
			equipmentId: '',
			resourceNo: '',
		});
		searchKey.current = {};
		getSourceList({ pageIndex: 1, pageSize: pageState.pageSize });
	});

	return (
		<Loading spin={loading}>
			<Flex w="full" h="full" p={2} direction="column" position={'relative'}>
				<FormProvider {...methods}>
					<Grid w={'full'} templateColumns="repeat(5,1fr)" alignItems={'center'}>
						<GridItem>
							<FormControl w="unset" mr={5} mt={2}>
								<HStack alignItems="center">
									<FormLabel w={26} mb="0" whiteSpace={'nowrap'} fontSize="14px" textAlign={'end'}>
										设备开关状态：
									</FormLabel>
									<CustomSelect
										w={'40'}
										fontSize="14px"
										h="8"
										borderRadius="6px"
										placeholder="请选择设备开关状态"
										{...register('switchStatus')}
									>
										<option value={''}>全部</option>
										<option value={1}>开</option>
										<option value={0}>关</option>
									</CustomSelect>
								</HStack>
							</FormControl>
						</GridItem>
						<GridItem>
							<FormControl w="unset" mr={5} mt={2}>
								<HStack alignItems="center">
									<FormLabel w={26} mb="0" whiteSpace={'nowrap'} fontSize="14px" textAlign={'end'}>
										资源名称:
									</FormLabel>
									<Input
										w={'40'}
										fontSize="14px"
										h="8"
										borderRadius="6px"
										placeholder="请输入资源名称"
										{...register('resourceName')}
									/>
								</HStack>
							</FormControl>
						</GridItem>

						<GridItem>
							<FormControl w="unset" mr={5} mt={2}>
								<HStack alignItems="center">
									<FormLabel w={26} mb="0" whiteSpace={'nowrap'} fontSize="14px" textAlign={'end'}>
										设备位号：
									</FormLabel>
									<Input
										placeholder="请输入设备位号"
										{...register('equipmentId')}
										w={'40'}
										fontSize="14px"
										h="8"
										borderRadius="6px"
									/>
								</HStack>
							</FormControl>
						</GridItem>
						<GridItem>
							<FormControl w="unset" mr={5} mt={2}>
								<HStack alignItems="center">
									<FormLabel w={26} mb="0" whiteSpace={'nowrap'} fontSize="14px" textAlign={'end'}>
										点位位号：
									</FormLabel>
									<Input
										placeholder="请输入点位位号"
										{...register('resourceNo')}
										w={'40'}
										fontSize="14px"
										h="8"
										borderRadius="6px"
									/>
								</HStack>
							</FormControl>
						</GridItem>
						<GridItem>
							<Button
								fontWeight="normal"
								fontSize="14px"
								borderRadius="2px"
								color="#fff"
								bg="#1677ff"
								onClick={handleSubmit(handleSearch)}
								h="8"
								mt={2}
								mr={2}
							>
								查询
							</Button>
						</GridItem>
					</Grid>
					<Grid w={'full'} templateColumns="repeat(5, 1fr)" alignItems={'center'}>
						<GridItem>
							<FormControl w="unset" mr={5} mt={2}>
								<HStack alignItems="center">
									<FormLabel w={26} mb="0" whiteSpace={'nowrap'} textAlign={'end'}>
										区域：
									</FormLabel>
									<CustomSelect
										{...register('areaId')}
										w={'40'}
										fontSize="14px"
										h="8"
										borderRadius="6px"
									>
										<>
											<option value={''}>请选择区域</option>
											{areaList.map((item) => (
												<option key={item.areaId} value={item.areaId}>
													{item.areaName}
												</option>
											))}
										</>
									</CustomSelect>
								</HStack>
							</FormControl>
						</GridItem>
						<GridItem>
							<FormControl w="unset" mr={5} mt={2}>
								<HStack alignItems="center">
									<FormLabel w={26} mb="0" whiteSpace={'nowrap'} fontSize="14px" textAlign={'end'}>
										图层：
									</FormLabel>
									<TreeSelect
										placeholder="请选择图层"
										data={layerList}
										{...register('layerId')}
										w={'40'}
										ref={undefined}
										allNodeCanSelect
										fontSize="14px"
										h="8"
										lineHeight={8}
										borderRadius="6px"
										minH={8}
										dropStyle={{
											w: '250px',
										}}
									/>
								</HStack>
							</FormControl>
						</GridItem>
						<GridItem colStart={3} colEnd={6}>
							<Button
								fontWeight="normal"
								fontSize="14px"
								borderRadius="2px"
								color="#fff"
								bg="#84878c"
								onClick={handleReset}
								h="8"
								mt={2}
							>
								重置
							</Button>

							<Button
								h="8"
								fontWeight="normal"
								fontSize="14px"
								borderRadius="2px"
								color="#fff"
								bg="#1677ff"
								mt={2}
								ml={2}
								onClick={downloadTemplate}
								isLoading={downloadLoading}
							>
								模版下载
							</Button>
							<UploadBtn
								action="/cx-alarm/device/manager/importIotDeviceRelevance"
								onSuccess={uploadFileSuccess}
								ml={2}
								btnText="上传"
								h={8}
								fontSize={'14px'}
								borderRadius={'2px'}
								marginTop="0.5rem"
								marginLeft="0.5rem"
								color="pri.white.100"
								bg="#1677ff"
								fontWeight="normal"
								isLoading={loading}
							/>
							<Button
								h="8"
								fontWeight="normal"
								fontSize="14px"
								borderRadius="2px"
								color="#fff"
								bg="#389e0d"
								mt={2}
								ml={2}
								isDisabled={!currentPageChecked.length}
								onClick={batchOpen}
							>
								批量开启
							</Button>
							<Button
								h="8"
								fontWeight="normal"
								fontSize="14px"
								borderRadius="2px"
								color="#fff"
								mt={2}
								ml={2}
								bg="#389e0d"
								isDisabled={!currentPageChecked.length}
								onClick={batchClose}
							>
								批量关闭
							</Button>
							{
								// handleAdd
								process.env.NEXT_PUBLIC_ANALYTICS_Ms_type === 'cx' && (
									<Button
										fontWeight="normal"
										fontSize="14px"
										borderRadius="2px"
										color="#fff"
										bg="#1677ff"
										onClick={handleAdd}
										h="8"
										mt={2}
										mr={2}
										ml={2}
									>
										新增
									</Button>
								)
							}
							{/* {process.env.NEXT_PUBLIC_ANALYTICS_Ms_type !== 'yb' && (
                <Menu closeOnSelect={false}>
                  <MenuButton
                    as={Button}
                    colorScheme="blue"
                    ml={2}
                    borderRadius="2px"
                    fontWeight="normal"
                    h="8"
                    mt={2}
                  >
                    总开关
                  </MenuButton>
                  <MenuList zIndex={20}>
                    <MenuOptionGroup
                      type="radio"
                      value={status ? 'true' : 'false'}
                      onChange={handleChangeSwitch}
                    >
                      <MenuItemOption value="true">开</MenuItemOption>
                      <MenuItemOption value="false">关</MenuItemOption>
                    </MenuOptionGroup>
                  </MenuList>
                </Menu>
              )} */}
						</GridItem>
					</Grid>
					{isAuth > -1 && (
						<FormControl w="unset" mr={5} mt={2} position={'absolute'} top={-8} right={6}>
							<HStack alignItems="center">
								<FormLabel mb="0" whiteSpace={'nowrap'} fontSize="14px">
									设备总开关：
								</FormLabel>
								<Controller
									control={control}
									name="swithRadio"
									defaultValue={true}
									render={({ field: { onChange, onBlur, value } }) => {
										return (
											<CustomSwitch
												isChecked={status === true ? true : false}
												defaultChecked={status === true ? true : false}
												value={status === true ? 'true' : 'false'}
												onChange={handleChangeDeviceSwitch}
												onBlur={onBlur}
											></CustomSwitch>
										);
									}}
								/>
							</HStack>
						</FormControl>
					)}
				</FormProvider>
				<ProductTable
					currentPageChecked={currentPageChecked}
					setCurrentPageChecked={setCurrentPageChecked}
					itemInfo={itemInfo}
					data={deviceList}
					getTableData={getSourceList}
					goEdit={goEdit}
					del={del}
					setItemInfo={setItemInfo}
					deviceTypeList={deviceTypeList}
					getSourceList={getSourceList}
					isBatch={isBatch}
					setIsBatch={setIsBatch}
					getTableObj={getTableObj}
				/>
			</Flex>

			<Edit
				isOpen={isOpen}
				onClose={onClose}
				areaList={areaList}
				layerList={layerList}
				deviceTypeList={deviceTypeList}
				getSourceList={getSourceList}
				deviceList={deviceList}
				depTree={depTree}
				itemInfo={itemInfo}
				setItemInfo={setItemInfo}
			/>
		</Loading>
	);
};

export default ProductManage;
