'use client';

import {
  ModalOverlay,
  ModalContent,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  Box,
  Input,
  useDisclosure,
  Flex,
  InputGroup,
  InputRightAddon,
  useToast,
} from '@chakra-ui/react';
import { FormProvider, useForm } from 'react-hook-form';
import { Modal } from '@chakra-ui/react';
import DeviceTable from '../deviceTable';
import Map from '@/components/Map';
import { useMemoizedFn, useSafeState } from 'ahooks';
import Maplibregl, { MapMouseEvent, Marker as MarkerProps } from 'maplibre-gl';
import { request } from '@/utils/request';
import { FeatureCollection, Point, Polygon, featureCollection } from '@turf/turf';
import Popup from '@/components/Map/popup';
import { CircleClose } from '@/components/Icons';
import { useEffect, useRef } from 'react';
import CustomSelect from '@/components/CustomSelect';
import { IOritreeData } from '@/components/Montior/Tree';
import type { ICamera } from '../deviceTable';
import { IDeviceType, IAreaCell } from '@/models/system';
import { RightIcon } from '@/components/Icons';
import { IDeviceListItem } from '@/models/system';
import { IPageData, initPageData } from '@/utils/publicData';

import dynamic from 'next/dynamic';

const TreeSelect = dynamic(() => import('@/components/Montior/TreeSelect'), { ssr: false });

export interface IArea {
  areaId: string;
  areaName: string;
  centralPoint: Point;
  chargeInfo: string;
  chargePhone: string; // 电话号码
  deptName: string;
  floorLevel: string;
  areaCode: string;
  hasMulFloors: number;
  mapLayer: string;
}

export interface IAreaFloorCounts extends IArea {
  isChecked: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  areaList: IArea[];
  layerList: IOritreeData[];
  deviceTypeList: IDeviceType[];
  getSourceList: ({ pageIndex }: { pageIndex: number }) => void;
  deviceList: IPageData<IDeviceListItem[]>;
  depTree: IOritreeData[];
  itemInfo?: IDeviceListItem;
  setItemInfo: (item?: IDeviceListItem) => void;
}

type IFloor = Pick<IAreaFloorCounts, 'areaId' | 'areaName' | 'isChecked'>;

const Edit = ({
  isOpen,
  onClose,
  layerList = [],
  areaList = [],
  deviceTypeList = [],
  getSourceList,
  deviceList = initPageData,
  depTree = [],
  itemInfo,
  setItemInfo,
}: Props) => {
  const { isOpen: deviceIsOpen, onOpen: deviceOnOpen, onClose: deviceOnClose } = useDisclosure();
  const { isOpen: mapIsOpen, onOpen: mapOnOpen, onClose: mapOnClose } = useDisclosure();
  const [position, setPosition] = useSafeState<number[]>([]);

  const toast = useToast();

  //生产单元
  const [areaCellList, setAreaCellList] = useSafeState<IAreaCell[]>([]);
  //当前报警点位信息，目前只有经纬度和区域id

  const [loading, setLoading] = useSafeState(false);

  const [currentAreaFloors, setCurrentAreaFloors] = useSafeState<IFloor[]>([]);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const currentLngLat = useRef<maplibregl.LngLat | null>(null);
  const marker = useRef<MarkerProps>();
  const methods = useForm();
  const [showAreaFloors, setShowAreaFloors] = useSafeState(false);
  const {
    register,
    getValues,
    setValue,
    formState: { errors, isSubmitted },
    handleSubmit,
    reset,
    watch,
  } = methods;

  const mapSelectedArea = useRef<{ areaId: string; areaName: string }>({
    areaId: '',
    areaName: '',
  });

  const location = watch('location');

  const getMapObj = useMemoizedFn(async ({ map }: { map: maplibregl.Map }) => {
    mapRef.current = map;
    genAreaLayers();
    getAreaDatas();

    map.on('click', (e) => {
      showPicImg(e.lngLat);
      setShowAreaFloors(false);
    });

    //回填
    if (getValues('location')) {
      const coordinate = getValues('location').coordinate;
      const areaId = getValues('areaId');
      const area = areaList.find((item) => item.areaId === areaId);
      const floorLevel = area?.floorLevel;

      setTimeout(() => {
        setShowAreaFloors(false);
        showPicImg({ lat: coordinate[1], lng: coordinate[0] });
        getAreaAllFloor(areaId, floorLevel ? Number(floorLevel) : 1);
      }, 100);
    }
  });

  // 获取区域数据并且给地图添加新的区域图层数据
  const getAreaDatas = useMemoizedFn(async () => {
    if (mapRef.current) {
      const url = `/cx-alarm/dc/area/areaMap`;
      const res = (await request({ url })) as unknown as FeatureCollection<Polygon, IArea>;
      res.features = res.features.filter((item) => item.geometry.type);
      const area_source_ = mapRef.current.getSource('area_source_') as maplibregl.GeoJSONSource;
      res.features = res.features.filter((item) => item.geometry.type);
      if (res && res.features) {
        res && res.features && area_source_.setData(res as GeoJSON.GeoJSON);
      }
    }
  });

  // 区域图层定义
  const genAreaLayers = useMemoizedFn(async () => {
    const source: maplibregl.GeoJSONSourceSpecification = {
      type: 'geojson',

      data: featureCollection([]),
    };
    mapRef.current?.addSource('area_source_', source);
    const area_source_: maplibregl.LayerSpecification = {
      id: 'area_source_',
      type: 'fill',
      source: 'area_source_',
      paint: {
        'fill-opacity': 0,
      },
    };
    mapRef.current?.on('click', 'area_source_', handleAreaClick);
    mapRef.current?.addLayer(area_source_);
  });

  //区域图层点击事件
  const handleAreaClick = useMemoizedFn(
    (
      e: MapMouseEvent & {
        features?: any;
      }
    ) => {
      if (e.features && e.features.length > 0) {
        const area = e.features[0].properties as IArea;
        const { areaId, areaName } = area;
        console.log('点击图层', area);
        mapSelectedArea.current = { areaName, areaId };
        getAreaAllFloor(areaId);
      }
    }
  );

  //查询生产单元
  const getareaCell = useMemoizedFn(async (areaId: string) => {
    const res = await request<IAreaCell[]>({
      url: `/cx-alarm/dc/area_cell/findByAreaId?areaId=${areaId}`,
    });
    if (res.code === 200) {
      setAreaCellList(res.data);
    }
  });

  const showPicImg = useMemoizedFn((lngLat) => {
    const arr = [lngLat.lng, lngLat.lat];
    setPosition(arr);
    currentLngLat.current = lngLat;
    if (!marker.current) {
      const warp = document.createElement('div');
      warp.className = 'map-pick-img';
      marker.current = new Maplibregl.Marker({ element: warp, offset: [0, -36 / 2] });
      marker.current.setLngLat(lngLat).addTo(mapRef.current!);
    } else {
      marker.current.setLngLat(lngLat);
    }
  });

  const handleAPopupClose = useMemoizedFn(() => {
    setShowAreaFloors(false);
  });

  const changeFloor = useMemoizedFn(
    (item: Pick<IAreaFloorCounts, 'areaId' | 'areaName' | 'isChecked'>, index: number) => {
      if (!item.isChecked) {
        const cacheData = JSON.parse(JSON.stringify(currentAreaFloors)) as IAreaFloorCounts[];
        for (const area of cacheData) {
          area.isChecked = false;
        }
        cacheData[index].isChecked = !cacheData[index].isChecked;
        setCurrentAreaFloors(cacheData);
        mapSelectedArea.current = { areaId: item.areaId, areaName: item.areaName };
      }
    }
  );

  const selectPosition = useMemoizedFn(() => {
    const { areaId, areaName } = mapSelectedArea.current;
    console.log('mapSelectedArea.current', mapSelectedArea.current);
    getareaCell(areaId);
    setValue('areaId', areaId, { shouldValidate: isSubmitted ? true : false });
    setValue('address', areaName);
    //由于后端接口原因 新增的时候coordinate没有s,
    setValue(
      'location',
      { coordinate: position, type: 'Point' },
      { shouldValidate: isSubmitted ? true : false }
    );
    mapOnClose();
  });

  useEffect(() => {
    register('location', {
      required: '请选择地图坐标',
    });
  }, [register]);

  const selectDevice = useMemoizedFn((item: ICamera) => {
    deviceOnClose();
    setValue('resourceName', item.cameraName, { shouldValidate: isSubmitted ? true : false });
    setValue('iotDeviceId', item.id, { shouldValidate: isSubmitted ? true : false });
    setValue('iotSubDeviceId', '', { shouldValidate: isSubmitted ? true : false });
  });

  const handleOk = useMemoizedFn(async (e) => {
    const isEdit = itemInfo?.id !== undefined;

    setLoading(true);

    const res = await request({
      ///cx-alarm/device/manager/update
      url: `/cx-alarm/device/manager/${!isEdit ? 'add' : 'update'}`,
      options: {
        method: 'post',
        body: JSON.stringify({
          ...e,
          hasVideo: 1,
          icon3dOffset: e.icon3dOffset || null,
          icon3dVisualAngle: e.icon3dVisualAngle || null,
          //编辑的时候需要id
          id: isEdit ? itemInfo?.id : undefined,
        }),
      },
    });

    if (res.code === 200) {
      toast({
        title: '操作成功',
        position: 'top',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      if (!isEdit) {
        getSourceList({ pageIndex: 1 });
      } else {
        getSourceList({ pageIndex: deviceList.current });
      }

      onClose();
    } else {
      toast({
        title: res.msg || '操作失败',
        position: 'top',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
    setLoading(false);
  });

  const closeModal = useMemoizedFn(() => {
    reset();
    setPosition([]);
    handleAPopupClose();
    setItemInfo(undefined);
  });

  useEffect(() => {
    //编辑的时候回填
    if (itemInfo && isOpen) {
      setValue('resourceName', itemInfo.resourceName);
      setValue('iotDeviceId', itemInfo.iotDeviceId);
      setValue('iotSubDeviceId', itemInfo.iotSubDeviceId);
      setValue('resourceNo', itemInfo.resourceNo);
      setValue('address', itemInfo.address);
      setValue('areaId', itemInfo.areaId);
      setValue('deptId', itemInfo.deptId);
      setValue('sortNo', itemInfo.sortNo);
      setValue('productId', itemInfo.productId);
      setValue('layerId', itemInfo.layerId);
      setValue('equipmentId', itemInfo.equipmentId);
      if (itemInfo.coordinate) {
        setValue('location', {
          coordinate: itemInfo.coordinate.coordinates,
          type: 'Point',
        });
      }
    }
  }, [itemInfo, isOpen]);

  //获取区域所有楼层数据/cx-alarm/dc/area/areaMap/allFloors
  const getAreaAllFloor = useMemoizedFn(async (areaId: string, floor = 1) => {
    const url = `/cx-alarm/dc/area/areaMap/allFloors?areaId=${areaId}`;
    const res = (await request({
      url,
    })) as unknown as FeatureCollection<Polygon, IArea>;

    //重新排序
    if (res.features && res.features.length) {
      const data = res.features
        .sort((a, b) => {
          const f1 = +a.properties.floorLevel;
          const f2 = +b.properties.floorLevel;
          return f1 - f2;
        })
        .map((item, index) => {
          const isChecked = floor - 1 === index;
          const obj: IFloor = {
            areaId: item.properties.areaId,
            areaName: item.properties.areaName,
            isChecked,
          };
          return obj;
        });
      setShowAreaFloors(true);
      setCurrentAreaFloors(data);
    } else {
      setCurrentAreaFloors([]);
    }
  });

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="lg" onCloseComplete={closeModal}>
        <ModalOverlay></ModalOverlay>
        <ModalContent w="1000px" maxW="unset" pb="20px">
          <ModalHeader>摄像头管理</ModalHeader>
          <ModalCloseButton></ModalCloseButton>
          <ModalBody>
            <FormProvider {...methods}>
              <HStack spacing={'20px'}>
                <Box flex={1}>
                  <FormControl
                    mt={2}
                    isRequired
                    isInvalid={(errors as unknown as any).resourceName}
                  >
                    <Flex>
                      <FormLabel w={'120px'} mr={0}>
                        摄像头名称：
                      </FormLabel>

                      <InputGroup w="300px">
                        <Input
                          _readOnly={{ boxShadow: '' }}
                          {...register('resourceName', { required: '请选择摄像头名称' })}
                          placeholder="请选择摄像头名称"
                        />
                        {/* eslint-disable react/no-children-prop */}
                        <InputRightAddon
                          p={0}
                          children={<Button onClick={deviceOnOpen}>选择</Button>}
                        />
                      </InputGroup>
                    </Flex>
                    <FormErrorMessage mt={0} pl="120px">
                      {(errors as unknown as any).resourceName?.message}
                    </FormErrorMessage>
                  </FormControl>
                </Box>
                <Box flex={1}>
                  <FormControl mt={2} isRequired isInvalid={(errors as unknown as any).iotDeviceId}>
                    <Flex>
                      <FormLabel w={'120px'} mr={0}>
                        设备id：
                      </FormLabel>
                      <Input
                        w="300px"
                        _readOnly={{ boxShadow: '' }}
                        {...register('iotDeviceId', { required: '请选择设备id' })}
                        placeholder="请选择设备编号"
                      />
                    </Flex>
                    <FormErrorMessage mt={0} pl="120px">
                      {(errors as unknown as any).iotDeviceId?.message}
                    </FormErrorMessage>
                  </FormControl>
                </Box>
              </HStack>
              <HStack spacing={'20px'}>
                <Box flex={1}>
                  <FormControl mt={2}>
                    <Flex>
                      <FormLabel w={'120px'} mr={0}>
                        子设备id：
                      </FormLabel>
                      <Input
                        w="300px"
                        _readOnly={{ boxShadow: '' }}
                        {...register('iotSubDeviceId')}
                        placeholder="请选择子设备编码"
                      />
                    </Flex>
                    <FormErrorMessage mt={0} pl="120px">
                      {(errors as unknown as any).iotSubDeviceId?.message}
                    </FormErrorMessage>
                  </FormControl>
                </Box>
                <Box flex={1}>
                  <FormControl isRequired mt={2} isInvalid={(errors as unknown as any).resourceNo}>
                    <Flex>
                      <FormLabel w={'120px'} mr={0}>
                        设备编号/工艺位号：
                      </FormLabel>
                      <Input
                        w="300px"
                        {...register('resourceNo', { required: '请输入设备编号/工艺位号' })}
                        placeholder="请输入设备编号/工艺位号"
                      />
                    </Flex>
                    <FormErrorMessage mt={0} pl="120px">
                      {(errors as unknown as any).resourceNo?.message}
                    </FormErrorMessage>
                  </FormControl>
                </Box>
              </HStack>
              <HStack spacing={'20px'}>
                <Box flex={1}>
                  <FormControl mt={2} isRequired isInvalid={(errors as unknown as any).layerId}>
                    <Flex>
                      <FormLabel w={'120px'} mr={0}>
                        图层：
                      </FormLabel>
                      <TreeSelect
                        placeholder="请选择图层"
                        data={layerList}
                        {...register('layerId', { required: '请选择图层' })}
                        w="300px"
                        ref={undefined}
                        allNodeCanSelect
                      />
                    </Flex>
                    <FormErrorMessage mt={0} pl="120px">
                      {(errors as unknown as any).layerId?.message}
                    </FormErrorMessage>
                  </FormControl>
                </Box>

                <Box flex={1}>
                  <FormControl mt={2} isRequired isInvalid={(errors as unknown as any).address}>
                    <Flex>
                      <FormLabel mr={0} w={'120px'}>
                        安装位置：
                      </FormLabel>
                      <Input
                        w="300px"
                        {...register('address', { required: '请选择安装位置' })}
                        placeholder="请选择安装位置"
                      />
                    </Flex>
                    <FormErrorMessage mt={0} pl="120px">
                      {(errors as unknown as any).address?.message}
                    </FormErrorMessage>
                  </FormControl>
                </Box>
              </HStack>
              <HStack spacing={'20px'}>
                <Box flex={1}>
                  <FormControl mt={2} isRequired>
                    <Flex alignItems="center">
                      <FormLabel w={'120px'} mr={0}>
                        坐标：
                      </FormLabel>
                      <Button
                        onClick={mapOnOpen}
                        borderRadius="6px"
                        border="1px solid #1677ff"
                        bg="#fff"
                        color="#1677ff"
                        _hover={{
                          color: '#45a8ff',
                        }}
                        p="4px 15px"
                        fontWeight="normal"
                      >
                        打开地图
                      </Button>
                      {(errors as unknown as any).location ? (
                        <Box color="pri.red.100">
                          {(errors as unknown as any).location?.message}
                        </Box>
                      ) : null}

                      {location ? <RightIcon ml="2" color="pri.green.200" /> : null}
                    </Flex>
                  </FormControl>
                </Box>
                <Box flex={1} />
              </HStack>
              <HStack spacing={'20px'}>
                <Box flex={1}>
                  <FormControl mt={2} isRequired>
                    <Flex>
                      <FormLabel mr={0} w={'120px'}>
                        部门：
                      </FormLabel>
                      <TreeSelect
                        placeholder="请选择部门"
                        data={depTree}
                        {...register('deptId', { required: '请选择部门' })}
                        w="300px"
                        ref={undefined}
                        allNodeCanSelect
                      />
                    </Flex>
                  </FormControl>
                </Box>
                <Box flex={1}>
                  <FormControl mt={2} isRequired isInvalid={(errors as unknown as any).areaId}>
                    <Flex>
                      <FormLabel mr={0} w={'120px'}>
                        区域：
                      </FormLabel>
                      <CustomSelect {...register('areaId')} w="300px">
                        <>
                          <option value={''}>请选择区域</option>
                          {areaList.map((item) => (
                            <option key={item.areaId} value={item.areaId}>
                              {item.areaName}
                            </option>
                          ))}
                        </>
                      </CustomSelect>
                    </Flex>
                    <FormErrorMessage mt={0} pl="120px">
                      {(errors as unknown as any).areaId?.message}
                    </FormErrorMessage>
                  </FormControl>
                </Box>
              </HStack>
              <HStack spacing={'20px'}>
                <Box flex={1}>
                  <FormControl mt={2} isInvalid={(errors as unknown as any).cellId}>
                    <Flex>
                      <FormLabel mr={0} w={'120px'}>
                        生产单元：
                      </FormLabel>
                      <CustomSelect {...register('cellId')} w="300px">
                        <>
                          <option value={''}>请选择生产单元</option>
                          {areaCellList.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.productionCellName}
                            </option>
                          ))}
                        </>
                      </CustomSelect>
                    </Flex>
                    <FormErrorMessage mt={0} pl="120px">
                      {(errors as unknown as any).cellId?.message}
                    </FormErrorMessage>
                  </FormControl>
                </Box>
                <Box flex={1}>
                  <FormControl mt={2} isInvalid={(errors as unknown as any).sortNo}>
                    <Flex>
                      <FormLabel mr={0} w={'120px'}>
                        排序号：
                      </FormLabel>
                      <Input
                        type="number"
                        w="300px"
                        {...register('sortNo')}
                        placeholder="请选择排序号"
                      ></Input>
                    </Flex>
                    <FormErrorMessage mt={0} pl="120px">
                      {(errors as unknown as any).sortNo?.message}
                    </FormErrorMessage>
                  </FormControl>
                </Box>
              </HStack>
              <HStack spacing={'20px'}>
                <Box flex={1}>
                  <FormControl mt={2}>
                    <Flex>
                      <FormLabel mr={0} w={'120px'}>
                        设备分类：
                      </FormLabel>
                      <CustomSelect {...register('productId')} w="300px">
                        <>
                          <option value={''}>请选择分类</option>
                          {deviceTypeList.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.productName}
                            </option>
                          ))}
                        </>
                      </CustomSelect>
                    </Flex>
                    <FormErrorMessage mt={0} pl="120px">
                      {(errors as unknown as any).productId?.message}
                    </FormErrorMessage>
                  </FormControl>
                </Box>
                <Box flex={1}>
                  <FormControl mt={2} isInvalid={(errors as unknown as any).equipmentId}>
                    <Flex>
                      <FormLabel mr={0} w={'120px'}>
                        设备硬件id：
                      </FormLabel>
                      <Input
                        w="300px"
                        {...register('equipmentId')}
                        placeholder="请选择设备硬件id"
                      ></Input>
                    </Flex>
                    <FormErrorMessage mt={0} pl="120px">
                      {(errors as unknown as any).equipmentId?.message}
                    </FormErrorMessage>
                  </FormControl>
                </Box>
                {/* <Box flex={1}>
                  <FormControl mt={2} isInvalid={(errors as unknown as any).icon3dOffset}>
                    <Flex>
                      <FormLabel mr={0} w={'120px'}>
                        3d图标偏移参数：
                      </FormLabel>
                      <Input w="300px" {...register('icon3dOffset')} placeholder="请选择3d图标偏移参数"></Input>
                    </Flex>
                    <FormErrorMessage mt={0} pl="120px">
                      {(errors as unknown as any).icon3dOffset?.message}
                    </FormErrorMessage>
                  </FormControl>
                </Box> */}
              </HStack>
              <HStack spacing={'20px'}>
                {/* <Box flex={1}>
                  <FormControl mt={2} isInvalid={(errors as unknown as any).icon3dVisualAngle}>
                    <Flex>
                      <FormLabel mr={0} w={'120px'}>
                        3d图标场景观察视角参数：
                      </FormLabel>
                      <Input w="300px" {...register('icon3dVisualAngle')} placeholder="请选择3d图标场景观察视角参数"></Input>
                    </Flex>
                    <FormErrorMessage mt={0} pl="120px">
                      {(errors as unknown as any).icon3dVisualAngle?.message}
                    </FormErrorMessage>
                  </FormControl>
                </Box> */}
              </HStack>
            </FormProvider>
          </ModalBody>
          <ModalFooter>
            <HStack justifyContent={'flex-end'} alignItems="center">
              <Button onClick={onClose}>取消</Button>
              <Button colorScheme={'blue'} isLoading={loading} onClick={handleSubmit(handleOk)}>
                确定
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* 摄像头modal */}
      <Modal isOpen={deviceIsOpen} onClose={deviceOnClose} size="lg">
        <ModalOverlay></ModalOverlay>
        <ModalContent w="1000px" maxW="unset" pb="20px">
          <ModalHeader> </ModalHeader>
          <ModalCloseButton></ModalCloseButton>
          <ModalBody>
            <DeviceTable selectDevice={selectDevice} />
          </ModalBody>
        </ModalContent>
      </Modal>
      {/* 选择坐标 */}
      <Modal
        isOpen={mapIsOpen}
        onClose={mapOnClose}
        size="lg"
        onCloseComplete={() => (marker.current = undefined)}
        closeOnOverlayClick={false}
      >
        <ModalOverlay></ModalOverlay>
        <ModalContent w="1000px" maxW="unset" pb="20px">
          <ModalHeader> </ModalHeader>
          <ModalCloseButton></ModalCloseButton>
          <ModalBody>
            <Box h="600px">
              <Map
                getMapObj={getMapObj}
                disableViewTools
                disableMiniMap
                mapPosition={{ zoom: 16.68996489492907 }}
              />
            </Box>
          </ModalBody>
          <ModalFooter>
            <HStack justifyContent={'flex-end'} alignItems="center">
              <Button onClick={mapOnClose}>取消</Button>
              <Button colorScheme={'blue'} onClick={selectPosition}>
                确定
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {showAreaFloors && mapRef.current && (
        <Popup
          maxWidth="none"
          closeButton={false}
          map={mapRef.current}
          onClose={handleAPopupClose}
          closeOnClick={false}
          longitude={position[0]}
          latitude={position[1]}
          offset={[0, -36 / 2]}
        >
          <Box fontSize="16px" borderRadius="10px" w="75" width="unset">
            <Flex
              bg="pri.yellow.200"
              justify="space-between"
              align="center"
              color="pri.dark.100"
              h="10"
              px="2.5"
              overflow="hidden"
              whiteSpace="nowrap"
              fontWeight="bold"
              borderTopRadius="10px"
            >
              {currentAreaFloors.map((item, index) => {
                return (
                  <Box
                    py="2"
                    cursor="pointer"
                    borderBottomWidth="1px"
                    borderBottomStyle="dashed"
                    borderBottomColor="pri.gray.700"
                    mr={2}
                    onClick={() => changeFloor(item, index)}
                    key={item.areaName}
                    _hover={{ color: 'pri.blue.100' }}
                    color={item.isChecked ? 'pri.blue.100' : ''}
                    userSelect="none"
                  >
                    <Box fontSize="18px" fontWeight="bold">
                      {item.areaName}
                    </Box>
                  </Box>
                );
              })}
              <CircleClose
                _hover={{ fill: 'pri.blue.100' }}
                w={4}
                h={4}
                fill="pri.dark.100"
                cursor="pointer"
                opacity="0.8"
                onClick={handleAPopupClose}
              />
            </Flex>
          </Box>
        </Popup>
      )}
    </>
  );
};

export default Edit;
