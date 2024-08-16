import title from '@/assets/montior/title.png';
import { phoneSocket } from '@/components/CallPhone/CreateContainer';
import {
  CircleClose,
  FullBroadcastIcon,
  VideoPlay,
  VideoSuspend,
  VoiceIcon,
} from '@/components/Icons';
import BaseMap from '@/components/Map';
import { callNumberVisibleModel, ICallNumberVisibleModel } from '@/models/callNumber';
import { broadcastVisibleModel } from '@/models/map';
import { request } from '@/utils/request';
import { execOperate } from '@/utils/util';
import {
  Box,
  Button,
  Center,
  Checkbox,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
  useTheme,
  useToast,
} from '@chakra-ui/react';
import { Feature, Point } from '@turf/helpers';
import { center, featureCollection } from '@turf/turf';
import { useMemoizedFn, useMount, useSafeState, useUnmount } from 'ahooks';
import { Map, MapMouseEvent, Source } from 'maplibre-gl';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl'
import { SetterOrUpdater, useRecoilState, useRecoilValue } from 'recoil';

const ModalWarp = dynamic(() => import('@/components/emergencyCommand/modalWarp'), { ssr: false });

//地图需要隐藏style的id
const needHideId: string[] = [
  //'zhuangzhi_kuai_3_text_3',
  //'texts_3',
  //'zhuangzhi_circle_text_3',
  //'zhuangzhi_kuai_2_text_3',
  //'zhuangzhi_v1_text_3',
  //'texts_4',
  //'zhuangzhi_kuai_3_text_4',
  //'zhuangzhi_circle_text_4',
  //'zhuangzhi_kuai_2_text_4',
  //'zhuangzhi_v1_text_4',
  //'texts_bds2_4',
  //'texts_bds1_4',
  // 'xiaofanggw_3',
  // 'xiaofanggw_4',
];

interface IVoice {
  createDate: string;
  id: string;
  realFileName: string;
  url: string;
  voiceName: string;
}

export interface IBroadcastArea {
  areaPhoneNumber: string;
  boradcastAreaCode: string;
  boradcastAreaName: string;
  coordinate: { type: 'Polygon'; coordinates: number[] };
  id: string;
  jurisdiction: string;
}

interface Props {
  theme?: 'deep' | 'shallow';
  onClose: () => void;
}

const Broadcast = ({ theme = 'shallow', onClose }: Props) => {
  const themeStyle = useTheme();
  const toast = useToast();
  const visible = useRecoilValue(broadcastVisibleModel);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [area, setArea] = useSafeState<IBroadcastArea[]>([]);
  const [areaSelected, setAreaSelected] = useSafeState<string[]>([]);

  const areaSelectedRef = useRef<string[]>([]);
  const [showPlay, setShowPlay] = useSafeState(false);
  const [callNumberShow, setCallNumberShow] = useRecoilState(callNumberVisibleModel);
  const formatMessage = useTranslations("base");
  const [voiceList, setVoiceList] = useSafeState<IVoice[]>([]);

  const searchParams = useSearchParams();
  const eventId = searchParams?.get('eventId');

  useMount(() => {
    getVoiceList();
  });

  const getMapObj_ = ({ map }: { map: maplibregl.Map }) => {
    mapRef.current = map;
    genBroadcastLayers();
    getAreaDatas();
    hideMapText();
    genBroadcastTextLayers();
    map.setPadding({ left: 0, top: 0, bottom: 0, right: 200 });
    //map.setZoom(17.68996489492907);
  };
  // 广播区域图层
  const genBroadcastLayers = async () => {
    const source: maplibregl.GeoJSONSourceSpecification = {
      type: 'geojson',

      data: featureCollection([]),
    };

    mapRef.current?.addSource('broadcast_source', source);
    const broadcast_fill: maplibregl.LayerSpecification = {
      id: 'broadcast_fill',
      type: 'fill',
      source: 'broadcast_source',

      paint: {
        'fill-color': 'rgba(0, 120, 236, 0.50)',
        'fill-outline-color': theme === 'deep' ? 'rgba(52, 211, 153,1)' : 'rgba(0, 120, 236, 1)',
        'fill-opacity': 0.6,
      },
      filter: ['==', 'areaId', ''],
    };

    const broadcast_fill_hide: maplibregl.LayerSpecification = {
      id: 'broadcast_fill_hide',
      type: 'fill',
      source: 'broadcast_source',
      paint: {
        'fill-opacity': 0,
      },
    };

    mapRef.current?.on('click', 'broadcast_fill_hide', handleAreaClick);
    mapRef.current?.addLayer(broadcast_fill);
    mapRef.current?.addLayer(broadcast_fill_hide);
  };

  //广播文字图层
  const genBroadcastTextLayers = async () => {
    const source: maplibregl.GeoJSONSourceSpecification = {
      type: 'geojson',

      data: featureCollection([]),
    };
    mapRef.current?.addSource('broadcastText_source', source);
    //普通图层
    const broadcastLayers_text: maplibregl.LayerSpecification = {
      id: 'broadcastLayers_text',
      type: 'symbol',
      source: 'broadcastText_source',

      layout: {
        'text-field': '{boradcastAreaName}',
        'text-font': ['Open Sans Regular'],
        'text-allow-overlap': true,
        'text-size': 18,
      },
      paint: {
        'text-color': 'rgba(0, 216, 255, 1)',
        'text-halo-blur': 0.5,
        'text-halo-color': '#fff',
        'text-halo-width': 0.5,
      },

      filter: ['==', 'areaId', ''],
    };

    mapRef.current?.addLayer(broadcastLayers_text);
  };

  const hideMapText = () => {
    if (mapRef.current) {
      for (const item of needHideId) {
        mapRef.current.setLayoutProperty(item, 'visibility', 'none');
      }
    }
  };
  // 获取广播区域数据
  const getAreaDatas = async () => {
    if (mapRef.current) {
      const res = await request<IBroadcastArea[]>({
        url: '/cx-alarm/resource/list-broadcast-area',
      });
      const broadcastData = {
        type: 'FeatureCollection',
        features: res.data?.map((item) => {
          return {
            geometry: item.coordinate ?? null,
            type: 'Feature',
            properties: {
              ...item,
            },
          };
        }),
      };

      //可能有些数据没有地图坐标，过滤一下
      const broadcastData_haveData = {
        type: 'FeatureCollection',
        features: broadcastData.features.filter((item) => item.geometry),
      };

      const broadcast_source = mapRef.current.getSource(
        'broadcast_source'
      ) as maplibregl.GeoJSONSource;
      broadcast_source.setData(broadcastData_haveData as unknown as GeoJSON.GeoJSON);
      if (res && broadcastData.features) {
        setArea(res.data);
        updateAreaPlayingText(res.data);
      }
    }
  };

  const handleAreaClick = (
    e: MapMouseEvent & {
      features?: any;
    }
  ) => {
    if (e.features && e.features.length > 0) {
      const areaPhoneNumber = e.features[0].properties.areaPhoneNumber;
      // const copyValue = [...areaSelectedRef.current];
      // const has = copyValue.includes(areaPhoneNumber);
      // if (has) {
      //   const index = copyValue.indexOf(areaPhoneNumber);
      //   copyValue.splice(index, 1);
      // } else {
      //   copyValue.push(areaPhoneNumber);
      // }
      //setAreaSelected(copyValue);

      setAreaSelected([areaPhoneNumber]);
    }
  };

  const areaOnChange = useMemoizedFn((type: boolean, id: string) => {
    // const value = [...areaSelected];
    // if (type) {
    //   value.push(id);
    // } else {
    //   const index = value.indexOf(id);
    //   value.splice(index, 1);
    // }
    setAreaSelected([id]);
  });

  const areaAllOnCheck = useMemoizedFn((type: boolean) => {
    if (type) {
      const ids = area.map((item) => item.areaPhoneNumber);
      setAreaSelected(ids);
    } else {
      setAreaSelected([]);
    }
  });

  useEffect(() => {
    const source = mapRef.current?.getSource('broadcast_source') as
      | (Source & { map: Map })
      | undefined;
    const map = source?.map as unknown as Map;
    console.log('areaSelected', areaSelected);

    map?.setFilter?.('broadcast_fill', ['in', 'areaPhoneNumber', ...areaSelected]);
    map?.setFilter?.('broadcastLayers_text', ['in', 'areaPhoneNumber', ...areaSelected]);
    areaSelectedRef.current = areaSelected;
  }, [areaSelected]);

  const oepnPlayList = useMemoizedFn(() => {
    //临时用于测试使用
    setShowPlay(true);
  });

  const closePlayList = useMemoizedFn(() => {
    setShowPlay(false);
  });

  //区域所有的正在播放的视频名称展示
  const updateAreaPlayingText = useMemoizedFn((data: IBroadcastArea[]) => {
    //每个图层创建一个markey
    const arr: Feature<Point, IBroadcastArea>[] = [];
    for (const item of data) {
      if (item.coordinate) {
        const center_ = center(item.coordinate, {
          properties: {
            ...item,
          },
        });

        arr.push(center_);
      }
    }
    const source = mapRef.current?.getSource('broadcastText_source') as maplibregl.GeoJSONSource;
    source?.setData(featureCollection(arr));
  });

  //获取语音列表
  const getVoiceList = useMemoizedFn(async () => {
    // const res = await request<IVoice[]>({
    //   url: '/cx-alarm/alm/broadcast-voice/list',
    // });
    // if (res.code === 200) {
    //   setVoiceList(res.data);
    // }

    const res = await request<IVoice[]>({ url: '/cx-alarm/alm/broadcast-voice/list' });
    console.log('广播语音', res.data);
    if (res.code === 200) {
      const newData: IVoice[] = res.data.map((item) => {
        const newItem = { ...item };
        const path = new URL(newItem.url);
        //const newImgUrl = 'https://' + path.hostname + '/minio' + path.pathname;
        const newImgUrl = '/minio' + path.pathname;
        newItem.url = newImgUrl;
        return newItem;
      });
      console.log('新语音文件', newData);
      setVoiceList(newData);
    }
  });

  //区域全选checkBox状态
  const areaAllChecked = area.length === areaSelected.length && areaSelected.length > 0;
  const areaIndeterminate = area.length > areaSelected.length && areaSelected.length > 0;

  //全场喊话
  const playSlefCoice = useMemoizedFn(() => {
    console.log('phoneSocket', phoneSocket);
    if (!areaSelected.length) {
      toast({
        position: 'top',
        title: '请选择区域',
        duration: 2000,
        status: 'error',
        isClosable: true,
      });
      return;
    }
    if (callNumberShow.visible) {
      toast({
        position: 'top',
        title: '已存在正在播放的语音或广播',
        duration: 2000,
        status: 'error',
        isClosable: true,
      });
      return;
    }
    if (phoneSocket?.readyState !== 1) {
      toast({
        title: '电话服务连接失败',
        status: 'error',
        position: 'top',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const areaName: string[] = [];

    area.forEach((item) => {
      areaSelected.forEach((subItem) => {
        if (subItem === item.areaPhoneNumber) {
          areaName.push(item.boradcastAreaName);
        }
      });
    });
    setCallNumberShow({
      visible: true,
      name: areaName.join(','),
      number: areaSelected.join(','),
    });
  });

  const _renderBody = useMemoizedFn(() => {
    return (
      <>
        {theme === 'shallow' ? (
          <Flex
            display="flex"
            h="50px"
            justifyContent="space-between"
            alignItems="center"
            p="0 20px"
          >
            <Box fontSize={'18px'} fontWeight="bold">
              {formatMessage('broadcasting')}
            </Box>
            <CircleClose onClick={onClose} fontSize="24px" cursor="pointer" />
          </Flex>
        ) : null}

        <Flex display="flex" p={0} h="calc(100% - 60px)">
          <Box w={330} bg="rgba(0, 0, 0, 0.1)" p="15px">
            <Box
              bg={theme === 'shallow' ? 'pri.gray.500' : ''}
              h={605}
              borderRadius={10}
              p="0 10px 10px 10px"
            >
              <Flex h="44px" alignItems="center">
                <Image alt="title" src={title} />
                <Box ml="10px" color={theme === 'deep' ? 'rgba(0, 216, 255, 1)' : ''}>
                  {formatMessage('area')}
                </Box>
              </Flex>
              <Box h={546} borderRadius="10px" overflow="hidden">
                <Box overflow="auto" h="100%" layerStyle="scrollbarStyle">
                  {area.map((item) => {
                    const id = item.id;
                    return (
                      <Flex
                        key={id}
                        alignItems="center"
                        p="5px 15px"
                        color={theme === 'deep' ? 'pri.white.100' : ''}
                      >
                        <Checkbox
                          mr={3}
                          defaultChecked
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          isChecked={areaSelected.includes(item.areaPhoneNumber)}
                          onChange={(e) => areaOnChange(e.target.checked, item.areaPhoneNumber)}
                          css={{
                            '>span':
                              theme === 'deep'
                                ? {
                                  background: `${themeStyle.colors.emgc.black['200']}`,
                                  border: 'none',
                                }
                                : {},
                          }}
                        />
                        {item.boradcastAreaName}
                        {item.jurisdiction ? `(${item.jurisdiction})` : ''}
                      </Flex>
                    );
                  })}
                </Box>
              </Box>
            </Box>
            <Flex
              color={theme === 'deep' ? '#fff' : ''}
              h="50px"
              mt="15px"
              borderRadius={10}
              alignItems="center"
              p="0 20px"
              bg={theme === 'deep' ? 'rgba(10, 45, 74, 1)' : 'pri.gray.500'}
            >
              {/* <Checkbox
                mr={3}
                defaultChecked
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                isChecked={areaAllChecked}
                isIndeterminate={areaIndeterminate}
                onChange={(e) => areaAllOnCheck(e.target.checked)}
                css={{
                  '>span':
                    theme === 'deep'
                      ? { background: `${themeStyle.colors.emgc.black['200']}`, border: 'none' }
                      : {},
                }}
              /> */}
              {/* <Box fontSize="14px" mr="42px">
                {formatMessage('selectAll' )}
              </Box> */}
              <Box fontSize="14px" mr="10px">
                {formatMessage('broadcastMode')}：
              </Box>
              <Center
                mr="15px"
                w="32px"
                h="32px"
                bg={theme === 'deep' ? 'emgc.black.100' : 'pri.white.100'}
                borderRadius="10px"
                onClick={playSlefCoice}
                cursor="pointer"
              >
                <VoiceIcon />
              </Center>
              <Center
                w="32px"
                h="32px"
                bg={theme === 'deep' ? 'emgc.black.100' : 'pri.white.100'}
                borderRadius="10px"
                cursor="pointer"
                onClick={oepnPlayList}
              >
                <FullBroadcastIcon />
              </Center>
            </Flex>
          </Box>
          <Box flex={1} borderEndEndRadius="10px" overflow="hidden" position="relative">
            <BaseMap
              getMapObj={getMapObj_}
              disableMiniMap
              isDark={theme === 'deep'}
            //mapPosition={{ zoom: 17.68996489492907, center: { lng: 103.90443759038135, lat: 31.052100731325638 } }}
            />
            {showPlay ? (
              <Right
                areaSelected={areaSelected}
                voiceList={voiceList}
                closePlayList={closePlayList}
                setCallNumberShow={setCallNumberShow}
                callNumberShow={callNumberShow}
                theme={theme}
                eventId={eventId ?? undefined}
                area={area}
              />
            ) : null}
          </Box>
        </Flex>
      </>
    );
  });

  return (
    <Modal isOpen={visible} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW="1400px" borderRadius="10px" bg="transparent" boxShadow="none">
        <ModalBody borderRadius="10px" p="0" bg={theme === 'shallow' ? 'pri.white.100' : ''}>
          {theme === 'shallow' ? (
            _renderBody()
          ) : (
            <ModalWarp onClose={onClose} title="扩音广播">
              {_renderBody()}
            </ModalWarp>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

interface IProps {
  closePlayList: () => void;
  setCallNumberShow: SetterOrUpdater<ICallNumberVisibleModel>;
  areaSelected: string[];
  voiceList: IVoice[];
  callNumberShow: ICallNumberVisibleModel;
  theme?: 'deep' | 'shallow';
  eventId?: string;
  area: IBroadcastArea[];
}

const Right = ({
  closePlayList,
  setCallNumberShow,
  areaSelected,
  voiceList,
  callNumberShow,
  theme,
  eventId,
  area,
}: IProps) => {
  const formatMessage = useTranslations("base");
  const [animating, setAnimating] = useSafeState(false);
  const [voicePath, setVoicePath] = useSafeState<string>();
  const [testPlayingUrl, setTestPlayingUrl] = useSafeState('');
  const toast = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setAnimating(true);
  }, []);

  const endAnimate = useMemoizedFn(() => {
    setAnimating(false);
  });

  const onTransitionEnd = useMemoizedFn((e) => {
    const warp = e.target as unknown as HTMLDivElement;
    if (parseFloat(warp.style.right) !== 0 && e.propertyName === 'right') {
      closePlayList();
    }
  });

  const paly = useMemoizedFn(() => {
    if (phoneSocket?.readyState !== 1) {
      toast({
        title: '电话服务连接失败',
        status: 'error',
        position: 'top',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!areaSelected.length) {
      toast({
        position: 'top',
        title: '请选择区域',
        duration: 2000,
        status: 'error',
        isClosable: true,
      });
      return;
    }
    if (!voicePath) {
      toast({
        position: 'top',
        title: '请选择语音文件',
        duration: 2000,
        status: 'error',
        isClosable: true,
      });
      return;
    }
    if (callNumberShow.visible) {
      toast({
        position: 'top',
        title: '已存在正在播放的语音或广播',
        duration: 2000,
        status: 'error',
        isClosable: true,
      });
      return;
    }
    execOperate({
      incidentId: eventId!,
      operationAction: 'BROADCAST',
      param: { partitionIds: areaSelected },
    });
    const areaName: string[] = [];

    area.forEach((item) => {
      areaSelected.forEach((subItem) => {
        if (subItem === item.areaPhoneNumber) {
          areaName.push(item.boradcastAreaName);
        }
      });
    });

    phoneSocket?.send(
      JSON.stringify({
        head: { subMsg: 11, subType: 1 },
        state: 0,
        phoneNum: areaSelected.join(','),
        path: voicePath,
        name: areaName.join(','),
      })
    );
    setCallNumberShow({
      visible: true,
      number: areaSelected.join(','),
      name: areaName.join(','),
      path: voicePath,
      isbroadcast: true,
      eventId,
    });
    toast({ position: 'top', title: '已播放', duration: 2000, isClosable: true });
  });

  //试听
  const testPlay = useMemoizedFn((url: string) => {
    if (!url) {
      toast({
        position: 'top',
        title: '暂无试听地址',
        duration: 2000,
        status: 'error',
        isClosable: true,
      });
      return;
    }
    setTestPlayingUrl(url);
  });

  //关闭试听
  const closeTestPlay = useMemoizedFn(() => {
    setTestPlayingUrl('');
    audioRef.current?.pause();
  });

  useEffect(() => {
    if (testPlayingUrl && audioRef.current) {
      audioRef.current.muted = false;
      audioRef.current?.play();
    }
  }, [testPlayingUrl]);

  useUnmount(() => {
    audioRef.current?.pause();
  });

  console.log('voiceListvoiceList', voiceList);

  return (
    <Box
      backdropFilter="blur(20px)"
      w="330px"
      style={{ right: animating ? '0px' : '-330px' }}
      bg={theme === 'deep' ? 'emgc.blue.600' : 'rgba(0, 0, 0, 0.1)'}
      p="15px"
      position="absolute"
      top="0px"
      zIndex={100}
      transition="right 0.15s"
      onTransitionEnd={onTransitionEnd}
      color={theme === 'deep' ? 'pri.white.100' : ''}
      h="100%"
    >
      <Box
        bg={theme === 'deep' ? 'emgc.blue.600' : 'pri.gray.500'}
        h="calc(100% - 60px)"
        borderRadius={10}
        p="0 0px 10px 10px"
      >
        <Flex h="44px" alignItems="center" justifyContent="space-between" pr="10px">
          <Flex alignItems="center">
            <Image alt="title" src={title} />
            <Box ml="10px" color={theme === 'deep' ? 'rgba(0, 216, 255, 1)' : ''}>
              {formatMessage('toPlayVoiceFiles')}
            </Box>
          </Flex>
          <CircleClose onClick={endAnimate} cursor="pointer" />
        </Flex>
        <Box
          bg={theme === 'shallow' ? '#fff' : ''}
          borderRadius={10}
          p="15px"
          pr="0"
          h="calc(100% - 44px)"
        >
          <Box overflow="auto" h="100%" layerStyle="scrollbarStyle">
            <RadioGroup value={voicePath} onChange={(e) => setVoicePath(e)}>
              <Stack>
                {voiceList.map((item) => (
                  <Flex alignItems="center" pr="15px" key={item.id} justifyContent="space-between">
                    <Radio value={item.realFileName}>{item.voiceName}</Radio>
                    <Center cursor="pointer">
                      {testPlayingUrl === item.url ? (
                        <VideoSuspend w="18px" h="18px" onClick={closeTestPlay} />
                      ) : (
                        <VideoPlay w="18px" h="18px" onClick={() => testPlay(item.url)} />
                      )}
                    </Center>
                  </Flex>
                ))}
              </Stack>
            </RadioGroup>
            <audio ref={audioRef} preload="auto" id="broadcastTestPlay" src={testPlayingUrl} />
          </Box>
        </Box>
      </Box>
      <Button
        bg="pri.blue.100"
        h="50px"
        mt="15px"
        borderRadius={10}
        alignItems="center"
        p="0 20px"
        color="pri.white.100"
        justifyContent="center"
        _hover={{ bg: 'pri.blue.200' }}
        w="full"
        fontWeight={400}
        onClick={paly}
      >
        {formatMessage('confirmBroadcasting')}
      </Button>
    </Box>
  );
};

export default Broadcast;
