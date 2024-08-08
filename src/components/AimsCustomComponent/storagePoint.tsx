import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  Text,
  HStack,
  Stack,
  Input,
  InputGroup,
  InputRightAddon,
  Button,
  useDisclosure,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  ModalCloseButton,
  ModalHeader,
  FormLabel,
  useToast,
} from '@chakra-ui/react';
import { RendererProps, Renderer } from 'amis';
import React, { useRef } from 'react';
import BaseMap from '@/components/Map';
import { request } from '@/utils/request';
import { FeatureCollection, featureCollection, Polygon } from '@turf/turf';
import { FormProvider, useForm, useFieldArray } from 'react-hook-form';
import Maplibregl, { LngLat, MapMouseEvent, Marker as MarkerProps } from 'maplibre-gl';
import { useMemoizedFn, useMount, useSafeState, useUnmount } from 'ahooks';
import { IOritreeData } from '../Montior/Tree';
import { IDepartment } from '@/models/system';
import CustomSelect from '@/components/CustomSelect';
import { IPageData } from '@/utils/publicData';
import { stringify } from 'qs';
import { IArea } from '@/models/map';
import { Button as AmisButton } from 'amis';
import dynamic from 'next/dynamic';
import { forwardRef } from 'react';
import { blankSpace, cellphoneValidate } from '@/utils/rule';

const TreeSelect = dynamic(() => import('@/components/Montior/TreeSelect'), { ssr: false });

export interface MyRendererProps extends RendererProps {
  areaId?: string;
}

interface FormProps {
  userName: string;
  phoneNumber: string;
  orgId: string;
  areaId: string;
  emgcRepositoryGeoInfo: PositionItem[];
}

interface PositionItem {
  pointName: string;
  locationSaveInfo: string;
  id?: string;
}

const AddPointer = (props: MyRendererProps, refs: any) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentPointInfo, setCurrentPointerInfo] = useSafeState<PositionItem>();
  const currentPointerIndex = useRef(0);
  const marker = useRef<MarkerProps | undefined>();
  const methods = useForm<FormProps>({ defaultValues: {} });
  const [areaList, setAreaList] = useSafeState<IArea[]>([]);
  const mapRef = useRef<maplibregl.Map | null>(null);

  const [areaId, setAreaId] = useSafeState<string>();

  const {
    formState: { errors },
    register,
    watch,
    control,
    setValue,
    getValues,
    handleSubmit,
    reset,
  } = methods;

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'emgcRepositoryGeoInfo',
  });

  const [depTree, setDepTree] = useSafeState<IOritreeData[]>([]);
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

  //获取区域
  const getArea = useMemoizedFn(async () => {
    const obj = {
      size: 1000,
    };
    const str = stringify(obj, { skipNulls: true });
    const res = await request<IPageData<IArea>>({ url: `/cx-alarm/dc/area/page?${str}` });
    if (res.code === 200) {
      setAreaList(res.data.records);
    }
  });

  useMount(() => {
    getDepartment();
    getArea();
  });

  const closeModal = useMemoizedFn(() => {
    props.onAction(null, { actionType: 'cancel', componentId: 'u:f513da49400e' });
  });

  const reload = useMemoizedFn(() => {
    props.onAction(null, { actionType: 'reload', target: 'crud' });
  });

  const getMapObj_ = ({ map }: { map: maplibregl.Map }) => {
    mapRef.current = map;
    genAreaLayers();
    getAreaDatas();
    genPointerLayers();
    positionBackfill();
  };

  //整个表单回填
  useMount(() => {
    if (props.edit && props.data) {
      setValue('areaId', props.data.areaId + '');
      setValue('phoneNumber', props.data.phoneNumber);
      setValue('userName', props.data.userName);
      setValue('orgId', props.data.orgId);

      props.data.areaId && setAreaId(props.data.areaId);
      if (props.data.emgcRepositoryGeomVoList) {
        const emgcRepositoryGeomVoList = props.data.emgcRepositoryGeomVoList;
        const position = emgcRepositoryGeomVoList?.map?.(
          (item: {
            pointName: string;
            locationInfo: { coordinates: number[]; type: 'Point' };
            id: string;
          }) => ({
            pointName: item.pointName,
            locationSaveInfo: JSON.stringify(item.locationInfo.coordinates),
            id: item.id,
          })
        );
        replace(position);
      }
    }
  });

  //坐标数据回填
  const positionBackfill = useMemoizedFn(() => {
    if (
      currentPointInfo?.locationSaveInfo &&
      typeof currentPointInfo?.locationSaveInfo === 'string'
    ) {
      const ps = JSON.parse(currentPointInfo.locationSaveInfo) as unknown as number[];
      const lngLat = { lng: ps[0], lat: ps[1] } as LngLat;
      showPicImg(lngLat);
    }
  });

  // 获取区域map数据
  const getAreaDatas = async () => {
    if (mapRef.current) {
      const url = `/cx-alarm/dc/area/areaMap`;
      const res = (await request({ url })) as unknown as FeatureCollection<Polygon, IArea>;
      if (res && res.features) {
        res.features = res.features.filter((item) => item.geometry.type);
        const area_source = mapRef.current.getSource('area_source') as maplibregl.GeoJSONSource;
        res && res.features && area_source.setData(res as GeoJSON.GeoJSON);
      }
    }
  };

  // 区域图层
  const genAreaLayers = async () => {
    console.log('props.areaIdprops.areaId', props.areaId);
    const source: maplibregl.GeoJSONSourceSpecification = {
      type: 'geojson',

      data: featureCollection([]),
    };

    mapRef.current?.addSource('area_source', source);

    const area_fill: maplibregl.LayerSpecification = {
      id: 'area_fill',
      type: 'fill',
      source: 'area_source',

      paint: {
        'fill-color': 'rgba(0, 120, 236, 0.50)',
        'fill-outline-color': 'rgba(0, 120, 236, 1)',
        'fill-opacity': 1,
      },
      filter: ['==', 'areaId', props.areaId!],
    };

    //mapRef.current?.on('click', 'area_fill', handleAreaClick);
    mapRef.current?.addLayer(area_fill);
    mapRef.current?.on('click', handleAreaClick);
  };

  //注册点图层
  const genPointerLayers = useMemoizedFn(() => {
    const source: maplibregl.GeoJSONSourceSpecification = {
      type: 'geojson',
      data: featureCollection([]),
    };
    mapRef.current?.addSource('pointer_source', source);

    const pointerLayers: maplibregl.LayerSpecification = {
      id: 'pointerLayers',
      type: 'symbol',
      source: 'pointer_source',

      layout: {
        'icon-image': 'popup',
        'icon-allow-overlap': true,
        'icon-offset': [0, -16],
      },
    };

    mapRef.current?.addLayer(pointerLayers);
  });

  const handleAreaClick = (
    e: MapMouseEvent & {
      features?: any;
    }
  ) => {
    // const coordinates = [e.lngLat.lng, e.lngLat.lat];
    //const source = mapRef.current?.getSource('pointer_source') as maplibregl.GeoJSONSource;

    // const sourcedata = featureCollection([
    //   point(coordinates, {
    //     //...res.properties,
    //   }),
    // ]);
    // console.log('sssss', sourcedata);
    // source.setData(sourcedata as unknown as GeoJSON.GeoJSON);
    showPicImg(e.lngLat);
  };

  const showPicImg = (lngLat: LngLat) => {
    const warp = document.createElement('div');
    warp.className = 'map-pick-img';

    if (!marker.current) {
      marker.current = new Maplibregl.Marker({ element: warp, offset: [0, -36 / 2] });
      marker.current.setLngLat(lngLat).addTo(mapRef.current!);
      marker.current.setDraggable(true);
    } else {
      marker.current!.setLngLat(lngLat);
    }
  };

  const onCloseComplete = useMemoizedFn(() => {
    setCurrentPointerInfo(undefined);
    removeMark();
  });

  const removeMark = useMemoizedFn(() => {
    marker.current?.remove();
    marker.current = undefined;
  });

  useUnmount(() => {
    removeMark();
  });

  const selectPointerSubmit = useMemoizedFn(() => {
    if (marker.current?._lngLat) {
      const data = [marker.current._lngLat.lng, marker.current._lngLat.lat];
      setValue(
        `emgcRepositoryGeoInfo.${currentPointerIndex.current}.locationSaveInfo`,
        JSON.stringify(data),
        {
          shouldValidate: true,
        }
      );
    }

    onClose();
  });

  const submit = useMemoizedFn(async (e: FormProps) => {
    const isEdit = !!props.edit;

    const url = !isEdit
      ? '/cx-scws/emgc_repository/add_repository_info'
      : '/cx-scws/emgc_repository/update_repository_info';

    if (!e.emgcRepositoryGeoInfo.length) {
      toast({
        title: '请添加存放点位',
        position: 'top',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      });
    } else {
      //判断存放点名称是否唯一

      const newArr: { [key: string]: string } = {};

      e.emgcRepositoryGeoInfo.forEach((item) => {
        if (!newArr[item.pointName.trim()]) {
          newArr[item.pointName] = item.pointName;
        }
      });

      if (Object.keys(newArr).length !== e.emgcRepositoryGeoInfo.length) {
        toast({
          title: '存放点名称不能相同',
          status: 'error',
          position: 'top',
          duration: 2000,
          isClosable: true,
        });
        return;
      }

      const sourceData = e.emgcRepositoryGeoInfo.map((item) => {
        return {
          pointName: item.pointName,
          locationSaveInfo: {
            coordinates: JSON.parse(item.locationSaveInfo),
            type: 'Point',
          },
          id: item.id,
          //locationSaveInfo: point(JSON.parse(item.locationSaveInfo)),
        };
      });

      const { code, msg } = await request({
        url,
        options: {
          method: 'post',
          body: JSON.stringify({
            ...e,
            emgcRepositoryGeoInfo: JSON.stringify(sourceData),
            id: isEdit ? props.data.id : undefined,
          }),
        },
      });
      if (code === 200) {
        closeModal();
        reload();
      } else {
        toast({
          title: msg || '操作失败',
          status: 'error',
          position: 'top',
          duration: 2000,
          isClosable: true,
        });
      }
    }
  });

  return (
    <>
      <FormProvider {...methods}>
        <Stack spacing="2.5">
          <HStack px="2.5" borderRadius="10px">
            <FormControl mt={0} isRequired isInvalid={!!errors?.orgId}>
              <Flex alignItems="center">
                <Flex w="100px" whiteSpace="nowrap" alignItems="center">
                  <Text color="pri.red.100">*</Text>部门:
                </Flex>

                <TreeSelect
                  placeholder="请选择部门"
                  data={depTree}
                  {...register('orgId', { required: '请选择部门' })}
                  w="260px"
                  ref={undefined}
                  allNodeCanSelect
                />
              </Flex>
              <FormErrorMessage mb={2} pl="120px">
                {errors.orgId?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl mt={0} isRequired isInvalid={!!errors?.areaId}>
              <Flex alignItems="center">
                <Flex w="100px" whiteSpace="nowrap" alignItems="center">
                  <Text color="pri.red.100">*</Text>区域:
                </Flex>

                <CustomSelect
                  flex={1}
                  _hover={{}}
                  {...register('areaId', { required: '请选择区域' })}
                  mr={1}
                  w="260px"
                  onChange={(e) => {
                    setAreaId(e.target.value);
                    replace([]);
                  }}
                >
                  <>
                    <option value={''}>请选择区域</option>
                    {areaList.map((item) => (
                      <option value={item.areaId} key={item.areaId}>
                        {item.areaName}
                      </option>
                    ))}
                  </>
                </CustomSelect>
              </Flex>
              <FormErrorMessage mb={2} pl="120px">
                {errors.areaId?.message}
              </FormErrorMessage>
            </FormControl>
          </HStack>
          <HStack px="2.5" borderRadius="10px">
            <FormControl mt={0} isRequired isInvalid={!!errors?.userName}>
              <Flex alignItems="center">
                <Flex w="100px" whiteSpace="nowrap" alignItems="center">
                  <Text color="pri.red.100">*</Text>负责人姓名:
                </Flex>

                <Input
                  placeholder="请选择负责人姓名"
                  {...register('userName', {
                    required: '请选择负责人姓名',
                    validate: (content, fieldValues) =>
                      blankSpace(content, fieldValues, '请选择负责人姓名'),
                  })}
                  w="260px"
                />
              </Flex>
              <FormErrorMessage mb={2} pl="120px">
                {errors.userName?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl mt={0} isRequired isInvalid={!!errors?.phoneNumber}>
              <Flex alignItems="center">
                <Flex w="100px" whiteSpace="nowrap" alignItems="center">
                  <Text color="pri.red.100">*</Text>负责人电话:
                </Flex>

                <Input
                  placeholder="负责人电话"
                  {...register('phoneNumber', {
                    required: '请输入负责人电话',
                    validate: (content, fieldValues) =>
                      cellphoneValidate(content, fieldValues, '请正确的负责人电话'),
                  })}
                  w="260px"
                />
              </Flex>
              <FormErrorMessage mb={2} pl="120px">
                {errors.phoneNumber?.message}
              </FormErrorMessage>
            </FormControl>
          </HStack>
          <HStack px="2.5" borderRadius="10px">
            <Button
              onClick={() => {
                append({ pointName: '', locationSaveInfo: '' });
              }}
              isDisabled={!areaId}
            >
              新增点位
            </Button>
          </HStack>

          {fields.map((item, index) => {
            return (
              <React.Fragment key={item.id}>
                <HStack alignItems="center">
                  <FormControl
                    pr={2}
                    isRequired
                    isInvalid={!!errors.emgcRepositoryGeoInfo?.[index]?.pointName}
                  >
                    <Flex alignItems="center">
                      <FormLabel textAlign="right" w="120px" mr={'2'}>
                        存放点名称({index + 1}):
                      </FormLabel>
                      <Box flex={1}>
                        <Input
                          w="500px"
                          _readOnly={{ boxShadow: '' }}
                          {...register(`emgcRepositoryGeoInfo.${index}.pointName`, {
                            required: '请输入存放点名称',
                          })}
                          placeholder="请输入存放点名称"
                        />
                      </Box>
                    </Flex>
                    <FormErrorMessage pl="30%" mt={0}>
                      {errors?.emgcRepositoryGeoInfo?.[index]?.pointName?.message}
                    </FormErrorMessage>
                  </FormControl>

                  <AmisButton level="danger" onClick={() => remove(index)}>
                    删除
                  </AmisButton>
                </HStack>

                <HStack>
                  <FormControl
                    pr={2}
                    isRequired
                    isInvalid={!!errors.emgcRepositoryGeoInfo?.[index]?.locationSaveInfo}
                    key={item.id}
                  >
                    <Flex alignItems="center">
                      <FormLabel textAlign="right" w="120px" mr={'2'}>
                        坐标({index + 1})：
                      </FormLabel>
                      <Box flex={1}>
                        <InputGroup w="500px">
                          <Input
                            _readOnly={{ boxShadow: '' }}
                            {...register(`emgcRepositoryGeoInfo.${index}.locationSaveInfo`, {
                              required: '请选择坐标',
                            })}
                            placeholder="请选择坐标"
                            readOnly
                          />
                          {/* eslint-disable react/no-children-prop */}
                          <InputRightAddon
                            p={0}
                            children={
                              <Button
                                onClick={() => {
                                  const newData = getValues('emgcRepositoryGeoInfo')[index];
                                  onOpen();
                                  setCurrentPointerInfo(newData);
                                  currentPointerIndex.current = index;
                                }}
                                isDisabled={!areaId}
                              >
                                选择
                              </Button>
                            }
                          />
                        </InputGroup>
                      </Box>
                    </Flex>
                    <FormErrorMessage pl="30%" mt={0}>
                      {errors?.emgcRepositoryGeoInfo?.[index]?.locationSaveInfo?.message}
                    </FormErrorMessage>
                  </FormControl>
                </HStack>
              </React.Fragment>
            );
          })}

          <Flex justifyContent="flex-end">
            <Box mr="2">
              <AmisButton onClick={closeModal}>取消</AmisButton>
            </Box>

            <AmisButton level="primary" onClick={handleSubmit(submit)}>
              确定
            </AmisButton>
          </Flex>
        </Stack>
      </FormProvider>
      <Modal isCentered isOpen={isOpen} onClose={onClose} onCloseComplete={onCloseComplete}>
        <ModalOverlay />
        <ModalContent maxW="750px" maxH="full" borderRadius="10px">
          <ModalHeader
            borderTopRadius="10px"
            py="0"
            textAlign="left"
            lineHeight="2.75rem"
            fontSize="lg"
            bg="pri.gray.100"
          >
            选择点位
          </ModalHeader>
          <ModalCloseButton h="11" top="0" lineHeight="2.75rem" />
          <ModalBody bg="pri.white.100" p="15px" borderBottomRadius="10px">
            <Box w={'full'}>
              <Box h="600">
                <BaseMap getMapObj={getMapObj_} disableMiniMap disableViewTools />
              </Box>

              <Flex justifyContent="flex-end" mt="2">
                <AmisButton level="primary" onClick={selectPointerSubmit}>
                  确定
                </AmisButton>
              </Flex>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

const AddPointer_ = forwardRef(AddPointer);

Renderer({
  test: /\bstoragePoint$/,
  name: 'storagePoint',
  autoVar: true,
})(AddPointer_);
