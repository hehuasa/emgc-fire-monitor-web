'use client';
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  CloseButton,
  Divider,
  Flex,
  Heading,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Radio,
  RadioGroup,
  SimpleGrid,
  Stack,
  StackDivider,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import React, { useEffect, useRef, useState } from 'react';
import LayerList, { ILayerItem } from '@/components/MapTools/LayerList';
import { MapContext } from '@/models/map';
import { request } from '@/utils/request';
import { stringify } from 'qs';
import {
  Feature,
  FeatureCollection,
  LineString,
  Point,
  Polygon,
  featureCollection,
} from '@turf/turf';
import { IResAreaCount, IResItem } from '@/models/resource';
import { useMount, useSafeState, useSize, useUnmount } from 'ahooks';
import { LngLatLike, Map, MapMouseEvent } from 'maplibre-gl';
import { initGeoJson } from '@/utils/mapUtils';
import { useIntl } from 'react-intl';
import Spin from '@/components/Loading/Spin';
import SmoothScrollbar from 'smooth-scrollbar';
import { mapOp } from '@/components/Map';

const BaseMap = dynamic(() => import('@/components/Map'), { ssr: false });

export interface IResPresets {
  address: string;

  cameraResourceId: string;
  resourceName: string;
  resourceNo: string;
  rotatable?: 0 | 1;

  presets: {
    id: string;
    presetId: string;
    presetIndex: number;
    presetName: string;
    rotatable?: 0 | 1;
  }[];
}

export interface IPresets {
  address: string;
  cameraResourceId: string;
  id: string;
  presetId: string;
  presetIndex: number;
  presetName: string;
  resourceName: string;
  resourceNo: string;
  rotatable?: 0 | 1;
}

export interface IVideoPresets {
  iotCameraId: string;
  presetId: string;
  presetIndex: number;
  presetName: string;
  cameraResourceId: string;
}

interface IsaveItem {
  almResourceId: string;
  cameraPresets: { cameraResourceId: string; presetIds: string[] }[];
}
const LinkeditWithmap = () => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<null | maplibregl.Map>(null);
  const warpRef = useRef<null | HTMLDivElement>(null);
  const domRef = useRef<null | HTMLDivElement>(null);
  const videodomRef = useRef<null | HTMLDivElement>(null);

  const gpsTimer = useRef<NodeJS.Timer>(null);

  const [loading, setloading] = useState(false);

  const size = useSize(warpRef);
  const [layers, setLayers] = useState<ILayerItem[]>([]);
  const checkedLayerIdsRef = useRef<string[]>([]);
  const [layerListExpandedIndex, setLayerListExpandedIndex] = useSafeState<number | number[]>([]);
  const [currentRes, setCurrentRes] = useState<IResItem | null>(null);
  const [currentVideo, setCurrentVideo_] = useState<Feature<Point, IResItem>[]>([]);
  const currentVideoRef = useRef<Feature<Point, IResItem>[]>([]);

  const [checkedLayers, setCheckedLayers] = useState<string[]>([]);
  const [currentVideoPresets, setCurrentVideoPresets_] = useState<{
    [key: string]: IVideoPresets[];
  }>({});

  const [currentPresets, setcurrentPresets] = useState<IPresets[]>([]);

  const currentVideoPresetsRef = useRef<{ [key: string]: IVideoPresets[] }>({});

  const [currentResPresets, setcurrentResPresets] = useState<IResPresets[]>([]);

  const changeRotatable = async (id: string, rotatable: number) => {
    const url = `/cx-alarm/device/manager/changeRotatable?id=${id}&rotatable=${rotatable}`;

    await request({
      url,
      options: {
        method: 'put',
      },
    });
    getResPreset(id);
  };
  const setCurrentVideo = (videos: Feature<Point, IResItem>[]) => {
    console.info('============videos==============', videos);

    setCurrentVideo_([...videos]);

    if (mapRef.current) {
      const fes = [];
      for (const fe of videos) {
        fes.push(fe);
      }
      const sourcedata = featureCollection<LineString | Point | Polygon>(fes);
      const source = mapRef.current.getSource('currentVideoReslayer') as maplibregl.GeoJSONSource;
      if (source) {
        source.setData(sourcedata);
      }
    }
  };

  const setCurrentVideoPresets = ({ id, presets }: { id: string; presets: IVideoPresets[] }) => {
    currentVideoPresetsRef.current[id] = presets;
    setCurrentVideoPresets_({ ...currentVideoPresetsRef.current });
  };
  // const { isOpen, onToggle, onClose } = useDisclosure()
  const toast = useToast();

  const { formatMessage } = useIntl();

  const getMapObj_ = ({ map }: { map: Map }) => {
    setMapLoaded(true);
    genResLayers(map);
    mapRef.current = map;
  };

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.resize();
    }
  }, [size]);

  useMount(() => {
    getLayers();

    setTimeout(() => {
      if (domRef.current) {
        SmoothScrollbar.init(domRef.current);
      }

      if (videodomRef.current) {
        SmoothScrollbar.init(videodomRef.current);
      }
    }, 500);
  });

  useUnmount(() => {
    // if (mapRef.current) {
    //     mapRef.current.remove()
    // }
  });
  const genResLayers = (map: Map) => {
    const source = initGeoJson();

    map.addSource('reslayer', source);
    map.addSource('currentReslayer', source);
    map.addSource('currentVideoReslayer', source);

    const reslayer: maplibregl.LayerSpecification = {
      id: 'reslayer',
      type: 'symbol',
      source: 'reslayer',

      layout: {
        'icon-image': '{icon}',
        'icon-allow-overlap': true,
        'icon-offset': [0, -15],
      },
    };
    const currentReslayer: maplibregl.LayerSpecification = {
      id: 'currentReslayer',
      type: 'symbol',
      source: 'currentReslayer',

      layout: {
        'icon-image': '{icon}',
        'icon-allow-overlap': true,
        'icon-offset': [0, -30],
      },
    };
    const currentVideoReslayer: maplibregl.LayerSpecification = {
      id: 'currentVideoReslayer',
      type: 'symbol',
      source: 'currentVideoReslayer',

      layout: {
        'icon-image': '{icon}',
        'icon-allow-overlap': true,
        'icon-offset': [0, -30],
      },
    };
    map.on('click', 'reslayer', resLayerClick);

    map.addLayer(reslayer);
    map.addLayer(currentReslayer);
    map.addLayer(currentVideoReslayer);
  };

  const getVideoPreset = async (id: string) => {
    setloading(true);
    request<IVideoPresets[]>({
      url: '/cx-alarm/device/manager/camera/preset?resourceId=' + id,
    }).then((res) => {
      console.info('===========preset=res==============', res);
      setCurrentVideoPresets({ id, presets: res.data });
      setloading(false);
    });
  };
  const getResPreset = async (id: string) => {
    setloading(true);

    request<IPresets[]>({
      url: '/cx-alarm/device/manager/list-camera-preset?resourceId=' + id,
      options: {
        method: 'post',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
      },
    }).then((res) => {
      const array: IResPresets[] = [];
      setcurrentPresets(res.data);

      for (const {
        resourceNo,
        presetId,
        presetIndex,
        presetName,
        address,
        resourceName,
        cameraResourceId,
        id,
      } of res.data) {
        const index = array.findIndex((val) => val.resourceNo === resourceNo);

        if (index !== -1) {
          array[index].presets.push({
            id,
            presetId,
            presetIndex,
            presetName,
          });
        } else {
          array.push({
            cameraResourceId,
            address,
            resourceName,
            resourceNo,
            presets: [
              {
                id,
                presetId,
                presetIndex,
                presetName,
              },
            ],
          });
        }
      }
      console.info('============array==============', array);

      setcurrentResPresets(array);
      setloading(false);
    });
  };
  const resLayerClick: any = (
    ev: MapMouseEvent & {
      features?: Feature<Point, IResItem>[];
    }
  ) => {
    if (ev.features && ev.features[0]) {
      const fe = ev.features[0];
      if (fe.properties.hasVideo) {
        const index = currentVideoRef.current.findIndex(
          (val) => val.properties.id === fe.properties.id
        );

        if (index === -1) {
          fe.properties.icon = fe.properties.icon + '_h';

          currentVideoRef.current.push(fe);
        }

        setCurrentVideo(currentVideoRef.current);
        getVideoPreset(fe.properties.id);

        // 被选中的视频点位
      } else {
        setCurrentRes(fe.properties);
        getResPreset(fe.properties.id);

        // 被选中的非视频点位
        const isPoint = fe.geometry.type === 'Point';

        if (isPoint) {
          fe.properties.icon = fe.properties.icon + '_h';
          const sourcedata = featureCollection<LineString | Point | Polygon>([fe]);

          const source = ev.target.getSource('currentReslayer') as maplibregl.GeoJSONSource;
          if (source) {
            source.setData(sourcedata);
          }
        }
      }
    }
  };
  // 获取图层列表
  const getLayers = async () => {
    const res = await request<ILayerItem[]>({ url: '/cx-alarm/resource/list-layer' });

    if (res.code === 200) {
      setLayers(res.data);
    }
  };
  const dealCheckIds = (item: ILayerItem) => {
    const index = checkedLayerIdsRef.current.findIndex((val) => val === item.id);

    if (index === -1) {
      checkedLayerIdsRef.current.push(item.id);
    } else {
      checkedLayerIdsRef.current.splice(index, 1);
    }
  };
  // 图层点击
  const hanldeLayerShow = async (layer: ILayerItem | null, layers: ILayerItem[], index: number) => {
    // 临时用于返回被选中的图层
    if (!layer) {
      return checkedLayerIdsRef.current;
    }
    dealCheckIds(layer);

    if (checkedLayerIdsRef.current.length === 0) {
      if (mapRef.current) {
        const source = mapRef.current.getSource('reslayer') as maplibregl.GeoJSONSource;
        if (source) {
          source.setData(featureCollection([]));
        }
      }
    } else {
      const res = await getLayerDatas();

      if (res.type && res.features) {
        // 计算区域资源统计,同时增加一个坐标属性，便于操作
        const obj: IResAreaCount = {};
        for (const fe of res.features) {
          fe.properties.coordinate = fe.geometry;
          if (obj[fe.properties.areaId]) {
            obj[fe.properties.areaId] += 1;
          } else {
            obj[fe.properties.areaId] = 1;
          }

          //暂时写死门禁图片
          if (fe.properties.layerId === '110') {
            fe.properties.icon = fe.properties.icon ?? 'res_Acces_close';
          }
        }

        // setResAreaCount(obj);

        if (mapRef.current) {
          const source = mapRef.current.getSource('reslayer') as maplibregl.GeoJSONSource;
          if (source) {
            console.log('接口获取图层', res);
            source.setData(res);
          }
        }
      }
    }
    const newLayers = [...layers];
    newLayers[index].isChecked = !newLayers[index].isChecked;
    setLayers(newLayers);
    return checkedLayerIdsRef.current;
  };

  const getLayerDatas = async () => {
    const obj = { layerIds: checkedLayerIdsRef.current, location: '', radius: 0 };
    const param = stringify(obj, { indices: false });
    const url = `/cx-alarm/resource/list-resource?${param}`;
    const res = (await request<ILayerItem[]>({ url })) as unknown as FeatureCollection<
      Point,
      IResItem
    >;
    res.features = res.features.filter((val) => val.geometry.coordinates);

    return res;
  };

  const setLayerVisible = (name: string, visibility: 'visible' | 'none') => {
    if (mapRef.current) {
      mapRef.current.setLayoutProperty(name, 'visibility', visibility);
    }
  };

  const addPreset = async (
    almResourceId: string,
    cameraPresets: { cameraResourceId: string; presetIds: string[] }[]
  ) => {
    const url = `/cx-alarm/device/manager/add-camera-preset`;
    const obj = {
      almResourceId,
      cameraPresets,
    };
    setloading(true);

    const res = await request({ url, options: { method: 'post', body: JSON.stringify(obj) } });
    setloading(false);

    getResPreset(almResourceId);
  };

  // 定位至视频

  const flyToVideo = async (resNo: string) => {
    if (mapRef.current) {
      const fes = mapRef.current.querySourceFeatures('reslayer', {
        sourceLayer: 'reslayer',
        filter: ['==', ['get', 'resourceNo'], resNo],
      });

      if (fes && fes.length > 0) {
        const fe = fes[0] as unknown as Feature<Point, IResItem>;

        const source = mapRef.current.getSource('currentVideoReslayer') as maplibregl.GeoJSONSource;
        if (source) {
          mapRef.current.flyTo({
            center: fe.geometry.coordinates as LngLatLike,
            zoom: mapOp.flyToZoom,
          });

          const index = currentVideoRef.current.findIndex(
            (val) => val.properties.id === fe.properties.id
          );

          if (index === -1) {
            fe.properties.icon = fe.properties.icon + '_h';

            currentVideoRef.current.push(fe);
          }
          setCurrentVideo(currentVideoRef.current);
          getVideoPreset(fe.properties.id);
        }
      } else {
        toast({
          title: '无法定位至摄像头',
          description: '未打开摄像头图层，或摄像头资源未找到',
        });
      }
    }
  };

  // 删除预置位
  const delPreset = async (id: string, resourceId: string) => {
    const url = `/cx-alarm/device/manager/delete-camera-preset/${id}`;

    const res = await request({
      url,
      options: {
        method: 'post',
      },
    });
    getResPreset(resourceId);
    return res;
  };
  // 删除整个摄像头的关联
  const delLinkedVideo = async (videoId: string, resourceId: string) => {
    const url = `/cx-alarm/device/manager/deleteLinkedCamera?almResourceId=${resourceId}&cameraResourceId=${videoId}`;
    const res = await request({
      url,
      options: {
        method: 'delete',
      },
    });
    getResPreset(resourceId);
    return res;
  };

  const delcurrentVideo = async (id: string) => {
    const index = currentVideoRef.current.findIndex((val) => val.properties.id === id);

    if (index !== -1) {
      currentVideoRef.current.splice(index, 1);
      setCurrentVideo(currentVideoRef.current);
    }
  };
  return (
    <Box ref={warpRef} position="relative" h="full" overflow="hidden" w="full">
      <BaseMap getMapObj={getMapObj_} />

      {mapLoaded && mapRef.current && (
        <MapContext.Provider value={mapRef.current}>
          <Box position="absolute" top="-10" left="4">
            <LayerList
              layers={layers}
              setLayerVisible={setLayerVisible}
              layerListExpandedIndex={layerListExpandedIndex}
              setLayerListExpandedIndex={setLayerListExpandedIndex}
              spriteJson={{}}
              gpsTimer={gpsTimer}
              checkedLayers={checkedLayers}
              setCheckedLayers={setCheckedLayers}
            />
          </Box>
        </MapContext.Provider>
      )}
      <Box position="absolute" right="4" top="4" zIndex={5} w="100">
        <Spin spin={loading}>
          <Card>
            <CardHeader py="3">
              <Heading size="md">联动信息配置</Heading>
            </CardHeader>

            <CardBody py="1">
              <Stack divider={<StackDivider />} spacing="4">
                <Box>
                  <Heading size="xs">已选中点位信息</Heading>
                  {currentRes && (
                    <Box py="1.5" px="4" mt="2" textAlign="left">
                      <Flex>
                        <Box w="18" whiteSpace="nowrap" color="pri.dark.100">
                          {formatMessage({ id: 'emgc.res.name' })} :
                        </Box>
                        <Box flex={1} color="pri.dark.500">
                          {currentRes.resourceName}
                          {currentRes.equipmentId}
                        </Box>
                      </Flex>

                      <Flex>
                        <Box w="18" whiteSpace="nowrap" color="pri.dark.100">
                          {formatMessage({ id: 'resource.processNum' })} :
                        </Box>
                        <Box flex={1} color="pri.dark.500">
                          {currentRes.resourceNo}
                        </Box>
                      </Flex>

                      <Flex>
                        <Box w="18" whiteSpace="nowrap">
                          {formatMessage({ id: 'resource.area' })} :
                        </Box>
                        <Box flex={1} color="pri.dark.500">
                          {currentRes.areaName}
                        </Box>
                      </Flex>
                      <Flex>
                        <Box w="18" whiteSpace="nowrap">
                          {formatMessage({ id: 'resource.install' })} :
                        </Box>
                        <Box flex={1} color="pri.dark.500">
                          {currentRes.address}
                        </Box>
                      </Flex>
                      {currentRes?.layerId === '110' ? (
                        <Flex>
                          <Box w="18" whiteSpace="nowrap">
                            {formatMessage({ id: 'resource.door.status' })} :
                          </Box>
                          <Box flex={1} color="pri.dark.500">
                            关
                          </Box>
                        </Flex>
                      ) : null}
                    </Box>
                  )}
                </Box>
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    已配置联动
                  </Heading>
                  <Box ref={domRef}>
                    <SimpleGrid columns={2} spacing={2} w="full" h="50">
                      {currentResPresets.map((video) => {
                        return (
                          <Card key={video.resourceNo} borderWidth="1px" borderColor="pri.gray.100">
                            {/* <CardHeader>
                                                        <Heading size='xs' onClick={() => {
                                                            flyToVideo(video.resourceNo)
                                                        }} cursor="pointer" _hover={{ color: "pri.blue.100" }}>{video.address + "-" + video.resourceName}</Heading>
                                                    </CardHeader> */}
                            <Popover
                              returnFocusOnClose={false}
                              closeOnBlur={false}
                              placement="auto"
                            >
                              {({ onClose }) => {
                                return (
                                  <>
                                    <PopoverTrigger>
                                      <CloseButton
                                        position="absolute"
                                        right="0.75"
                                        top="0.75"
                                        size="sm"
                                      />
                                    </PopoverTrigger>
                                    <PopoverContent>
                                      <PopoverArrow />
                                      <PopoverCloseButton />
                                      <PopoverHeader>确认</PopoverHeader>
                                      <PopoverBody>请确认是否删除整个摄像头关联?</PopoverBody>
                                      <PopoverFooter display="flex" justifyContent="flex-end">
                                        <ButtonGroup size="sm">
                                          <Button variant="outline" onClick={onClose}>
                                            取消
                                          </Button>
                                          <Button
                                            colorScheme="red"
                                            onClick={() => {
                                              delLinkedVideo(
                                                video.cameraResourceId,
                                                currentRes!.id!
                                              ).then(() => {
                                                onClose();
                                              });
                                            }}
                                          >
                                            确认
                                          </Button>
                                        </ButtonGroup>
                                      </PopoverFooter>
                                    </PopoverContent>
                                  </>
                                );
                              }}
                            </Popover>

                            <CardBody py="0">
                              <VStack align="flex-start">
                                <Box w="18" whiteSpace="nowrap" color="pri.dark.100">
                                  工艺位号 :
                                </Box>
                                <Box mt="0px !important" color="pri.dark.500">
                                  {video.resourceNo}
                                </Box>
                              </VStack>

                              <VStack align="flex-start">
                                <Box w="18" whiteSpace="nowrap" color="pri.dark.100">
                                  {formatMessage({ id: 'emgc.res.name' })} :
                                </Box>
                                <Box mt="0px !important" color="pri.dark.500">
                                  {video.resourceName}
                                </Box>
                              </VStack>

                              <VStack align="flex-start">
                                <Box w="18" whiteSpace="nowrap" color="pri.dark.100">
                                  预置位 :
                                </Box>
                                <Box mt="0px !important" color="pri.dark.500">
                                  {video.presets.map((preset) => {
                                    return (
                                      <Box
                                        key={preset.presetId}

                                      // borderColor="pri.gray.100"
                                      // borderWidth="1px" p="1"
                                      >
                                        <Text>{preset.presetName}</Text>
                                        {/* <Popover
                                                                returnFocusOnClose={false}
                                                                closeOnBlur={false}
                                                                placement="auto"
                                                            >
                                                                {({ onClose }) => {
                                                                    return <>
                                                                        <PopoverTrigger>
                                                                            <Button colorScheme='red' variant='link' >
                                                                                删除
                                                                            </Button>
                                                                        </PopoverTrigger>
                                                                        <PopoverContent>
                                                                            <PopoverArrow />
                                                                            <PopoverCloseButton />
                                                                            <PopoverHeader>确认</PopoverHeader>
                                                                            <PopoverBody>请确认是否删除?</PopoverBody>
                                                                            <PopoverFooter display='flex' justifyContent='flex-end'>
                                                                                <ButtonGroup size='sm'>
                                                                                    <Button variant='outline' onClick={onClose}>取消</Button>
                                                                                    <Button colorScheme='red' onClick={() => {
                                                                                        delPreset(preset.id, resourceId).then(() => {
                                                                                            onClose()
                                                                                        })
                                                                                    }}>确认</Button>
                                                                                </ButtonGroup>
                                                                            </PopoverFooter>
                                                                        </PopoverContent></>
                                                                }}
                                                            </Popover> */}
                                      </Box>
                                    );
                                  })}
                                </Box>
                              </VStack>
                              {/* {
                                                            video.presets.map((preset) => {

                                                                return <HStack key={preset.presetId}>
                                                                    <Text>{preset.presetName}</Text>
                                                                    <Popover
                                                                        returnFocusOnClose={false}
                                                                        closeOnBlur={false}
                                                                        placement="auto"
                                                                    >
                                                                        {({ onClose }) => {
                                                                            return <>
                                                                                <PopoverTrigger>
                                                                                    <Button colorScheme='red' variant='link' >
                                                                                        删除
                                                                                    </Button>
                                                                                </PopoverTrigger>
                                                                                <PopoverContent>
                                                                                    <PopoverArrow />
                                                                                    <PopoverCloseButton />
                                                                                    <PopoverHeader>确认</PopoverHeader>
                                                                                    <PopoverBody>请确认是否删除?</PopoverBody>
                                                                                    <PopoverFooter display='flex' justifyContent='flex-end'>
                                                                                        <ButtonGroup size='sm'>
                                                                                            <Button variant='outline' onClick={onClose}>取消</Button>
                                                                                            <Button colorScheme='red' onClick={() => {
                                                                                                delPreset(preset.id, currentRes!.id!).then(() => {
                                                                                                    onClose()
                                                                                                })
                                                                                            }}>确认</Button>
                                                                                        </ButtonGroup>
                                                                                    </PopoverFooter>
                                                                                </PopoverContent></>
                                                                        }}
                                                                    </Popover>

                                                                </HStack>
                                                            })
                                                        } */}
                              <VStack align="flex-start">
                                <Box w="20" whiteSpace="nowrap" color="pri.dark.100">
                                  预置位旋转 :
                                </Box>
                                <Box color="pri.dark.500">
                                  <RadioGroup
                                    onChange={(val) => {
                                      // const url = '/cx-alarm/device/manager/changeRotatable'
                                      changeRotatable(currentRes!.id!, Number(val));
                                    }}
                                    value={
                                      video.rotatable !== null && video.rotatable !== undefined
                                        ? String(video.rotatable)
                                        : undefined
                                    }
                                  >
                                    <Radio mr="1" value="1">
                                      启用
                                    </Radio>
                                    <Radio value="0">禁用</Radio>
                                  </RadioGroup>
                                </Box>
                              </VStack>
                            </CardBody>
                            {/* <CardFooter>
                                                        <Button></Button>
                                                    </CardFooter> */}
                          </Card>
                        );
                      })}
                    </SimpleGrid>
                  </Box>
                </Box>
                <Box>
                  <Heading size="xs">已选中摄像头信息</Heading>
                  <Box py="1.5" px="4" mt="2" textAlign="left" h="70" ref={videodomRef}>
                    <Box>
                      {currentVideo.map((video) => {
                        const videoId = video.properties.id as string;

                        const checkedVideo = currentResPresets.find(
                          (val) =>
                            val.cameraResourceId === video.properties.id &&
                            val.presets.find((preset) => preset.presetId === null)
                        );
                        const isEmptyChecked = Boolean(checkedVideo);
                        return (
                          <Box key={video.properties.id} position="relative">
                            <CloseButton
                              position="absolute"
                              right="-2"
                              top="-1"
                              size="sm"
                              onClick={() => {
                                delcurrentVideo(videoId);
                              }}
                            />
                            <Flex pr="2">
                              <Box w="18" whiteSpace="nowrap" color="pri.dark.100">
                                {formatMessage({ id: 'emgc.res.name' })} :
                              </Box>
                              <Box flex={1} color="pri.dark.500">
                                {video.properties.resourceName}
                                {video.properties.equipmentId}
                              </Box>
                            </Flex>
                            <Flex>
                              <Box w="18" whiteSpace="nowrap" color="pri.dark.100">
                                预置位 :
                              </Box>
                              <VStack>
                                <Checkbox
                                  isChecked={isEmptyChecked}
                                  disabled={currentRes === null}
                                  onChange={() => {
                                    for (const item of currentPresets.filter(
                                      (val) => val.cameraResourceId === video.properties.id
                                    )) {
                                      delPreset(item.id, currentRes!.id);
                                    }
                                    if (isEmptyChecked) {
                                      delPreset(video.properties.id, currentRes!.id);
                                    } else {
                                      // 只能单选

                                      addPreset(currentRes!.id, [
                                        { cameraResourceId: video.properties.id, presetIds: [] },
                                      ]);
                                    }
                                  }}
                                >
                                  仅关联不选预置位
                                </Checkbox>

                                {currentVideoPresets[videoId] &&
                                  currentVideoPresets[videoId].length > 0 ? (
                                  <Box flex={1} color="pri.dark.500">
                                    {currentVideoPresets[videoId].map((preset) => {
                                      const currentPreset = currentPresets.find(
                                        (val) => val.presetId === preset.presetId
                                      );
                                      const isChecked = Boolean(currentPreset);
                                      return (
                                        <Checkbox
                                          mx="1"
                                          disabled={currentRes === null}
                                          onChange={() => {
                                            if (currentPreset) {
                                              delPreset(currentPreset.id, currentRes!.id!);
                                            } else {
                                              // 只能单选
                                              for (const item of currentPresets.filter(
                                                (val) =>
                                                  val.cameraResourceId === video.properties.id
                                              )) {
                                                delPreset(item.id, currentRes!.id!);
                                              }
                                              addPreset(currentRes!.id, [
                                                {
                                                  cameraResourceId: videoId,
                                                  presetIds: [preset.presetId],
                                                },
                                              ]);
                                            }
                                          }}
                                          key={preset.presetId}
                                          isChecked={isChecked}
                                        >
                                          {preset.presetName}
                                        </Checkbox>
                                      );
                                    })}
                                  </Box>
                                ) : (
                                  <Box flex={1} color="pri.dark.500">
                                    暂无预置位信息
                                  </Box>
                                )}
                              </VStack>
                            </Flex>

                            <Divider mb="1" />
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                </Box>
              </Stack>
            </CardBody>
            {/* <CardFooter py="1">
                            <Button size="sm" colorScheme='blue' mx="2">保存</Button>
                            <Button size="sm" mx="2">重置</Button>

                        </CardFooter> */}
          </Card>
        </Spin>
      </Box>
    </Box>
  );
};

export default LinkeditWithmap;
