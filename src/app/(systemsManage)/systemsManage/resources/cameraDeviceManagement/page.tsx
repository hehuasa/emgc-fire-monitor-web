'use client';
import CustomSelect from '@/components/CustomSelect';
import Loading from '@/components/Loading/Spin';
import { IOritreeData } from '@/components/Montior/Tree';
import UploadBtn from '@/components/Upload/uploadBtn';
import { IArea } from '@/models/map';
import type { IDepartment, IDeviceType } from '@/models/system';
import { IDeviceListItem, ILayer } from '@/models/system';
import { initPageData, IPageData } from '@/utils/publicData';
import { request, requestDownload } from '@/utils/request';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useMemoizedFn, useMount, useSafeState } from 'ahooks';
import { stringify } from 'qs';
import { useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Edit from './add/page';
import ProductTable from './productTable';

interface ISearchKey {
  resourceName?: string;
  layerId?: string;
  areaId?: string;
  resourceNo?: string;
}

const ProductManage = () => {
  const methods = useForm();
  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = methods;
  const [deviceTypeList, setDeviceTypeList] = useSafeState<IDeviceType[]>([]);
  const [deviceList, setDeviceList] = useSafeState<IPageData<IDeviceListItem[]>>(initPageData);
  const [layerList, setLayerList] = useSafeState<IOritreeData[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const searchKey = useRef<ISearchKey>({});
  const [areaList, setAreaList] = useSafeState<IArea[]>([]);
  const [loading, setLoading] = useSafeState(false);
  const [depTree, setDepTree] = useSafeState<IOritreeData[]>([]);

  const [itemInfo, setItemInfo] = useSafeState<IDeviceListItem>();

  const [exportLoading, setExportLoading] = useSafeState(false);

  const toast = useToast();
  useMount(() => {
    getSourceList({ pageIndex: 1 });
    getLayerList();
    getCategoryList();
    getArea();
    getDepartment();
    getDeviceTypeList();
  });

  const getSourceList = useMemoizedFn(async ({ pageIndex }: { pageIndex: number }) => {
    const keyParam = {
      pageIndex,
      pageSize: 10,
      containPresetInf: false,
      ...searchKey.current,
    };

    setLoading(true);
    const { code, data } = await request<IPageData<IDeviceListItem[]>>({
      url: `/cx-alarm/device/manager/query-camera?${stringify(keyParam)}`,
    });
    if (code === 200) {
      setDeviceList(data);
    }
    setLoading(false);
  });

  const handleSearch = async (e: ISearchKey) => {
    searchKey.current = {
      ...e,
      resourceNo: e.resourceNo ? e.resourceNo.trim() : '',
      resourceName: e.resourceName ? e.resourceName.trim() : '',
    };

    getSourceList({ pageIndex: 1 });
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
        getSourceList({ pageIndex: 1 });
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
    const res = await requestDownload({
      url: '/cx-alarm/device/manager/downloadIotCameraRelevance',
      options: { name: '导入摄像头模版.xlsx' },
    });
  });

  const uploadFileSuccess = useMemoizedFn(async () => {
    getSourceList({ pageIndex: 1 });
  });

  return (
    <>
      <Loading spin={loading}>
        <Flex w="full" h="full" p={2} flexDirection="column">
          <Box w="full">
            <FormProvider {...methods}>
              <form>
                <Flex alignItems={'center'} flexWrap="wrap">
                  <FormControl w="unset">
                    <HStack alignItems="center">
                      <FormLabel mb="0" whiteSpace={'nowrap'} fontSize="14px">
                        资源名称
                      </FormLabel>
                      <Input
                        borderRadius="6px"
                        h="32px"
                        fontSize="14px"
                        w={'200px'}
                        placeholder="请输入资源名称"
                        {...register('resourceName')}
                      />
                    </HStack>
                  </FormControl>
                  <FormControl w="unset" ml={5}>
                    <HStack alignItems="center">
                      <FormLabel mb="0" whiteSpace={'nowrap'} fontSize="14px">
                        区域
                      </FormLabel>
                      <CustomSelect
                        {...register('areaId')}
                        w={'200px'}
                        fontSize="14px"
                        h="32px"
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
                  <FormControl w="unset" ml={5}>
                    <HStack alignItems="center">
                      <FormLabel mb="0" whiteSpace={'nowrap'} fontSize="14px">
                        设备编号/工艺位号
                      </FormLabel>
                      <Input
                        borderRadius="6px"
                        h="32px"
                        fontSize="14px"
                        placeholder="请输入设备编号/工艺位号"
                        {...register('resourceNo')}
                        w={'200px'}
                      />
                    </HStack>
                  </FormControl>
                  <FormControl w="unset" ml={5}>
                    <HStack mb="0" alignItems="center">
                      <Button
                        fontWeight="normal"
                        fontSize="14px"
                        borderRadius="2px"
                        color="#fff"
                        bg="#1677ff"
                        onClick={handleSubmit(handleSearch)}
                        h="32px"
                      >
                        查询
                      </Button>

                      <Button
                        h="32px"
                        fontWeight="normal"
                        fontSize="14px"
                        borderRadius="2px"
                        color="#fff"
                        bg="#389e0d"
                        onClick={handleAdd}
                      >
                        新增
                      </Button>
                      <Button
                        h="32px"
                        fontWeight="normal"
                        fontSize="14px"
                        borderRadius="2px"
                        color="#fff"
                        bg="#1677ff"
                        onClick={downloadTemplate}
                      >
                        模版下载
                      </Button>
                      {/* importIotDeviceRelevance */}
                      <UploadBtn
                        action="/cx-alarm/device/manager/importIotCameraRelevance"
                        onSuccess={uploadFileSuccess}
                      >
                        <Button
                          w="20"
                          h="8"
                          bg="pri.blue.100"
                          color="pri.white.100"
                          fontWeight="normal"
                          borderRadius="2px"
                          fontSize="14px"
                        >
                          上传
                        </Button>
                      </UploadBtn>
                    </HStack>
                  </FormControl>
                </Flex>
              </form>
            </FormProvider>
          </Box>

          <ProductTable
            itemInfo={itemInfo}
            data={deviceList}
            getTableData={getSourceList}
            goEdit={goEdit}
            del={del}
            setItemInfo={setItemInfo}
            deviceTypeList={deviceTypeList}
          />
        </Flex>
      </Loading>

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
    </>
  );
};

export default ProductManage;
