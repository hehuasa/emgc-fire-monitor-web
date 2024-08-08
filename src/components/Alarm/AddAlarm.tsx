import {
  Box,
  VStack,
  HStack,
  InputGroup,
  Input,
  InputRightElement,
  IconButton,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  useToast,
  useTheme,
} from '@chakra-ui/react';
import React, { useRef } from 'react';
import Map from '@/components/Map';
import SearchInput from '@/components/SearchInput';

import Maplibregl, { LngLatLike, MapMouseEvent, Marker as MarkerProps } from 'maplibre-gl';
import { LocationIcon, MicrophoneIconS } from '../Icons';
import { request } from '@/utils/request';
import { useForm, FormProvider } from 'react-hook-form';
import { useSafeState, useDebounceFn, useMemoizedFn, useMount } from 'ahooks';
import { FeatureCollection, featureCollection, Polygon } from '@turf/turf';
import { IArea, IAreaFloorCounts } from '@/models/map';
import { startRecording } from '../Wenet/event';
import { teleOrPhone } from '@/utils/rule';
import SmoothScrollbar from 'smooth-scrollbar';
import RecordAnimatedComponent from '../RecordAnimatedComponent';
import { handleAlarmModel } from '@/models/alarm';
import { useRecoilState } from 'recoil';
import Popup from '@/components/Map/popup';
import { CircleClose } from '@/components/Icons';

type UserForm = {
  address: string;
  alarmUserName: string;
  linkPhone: string;
  supplement: string;
  alarmUserId: string;
  alarmAreaId: string;
};

interface IPositionSearch {
  areaCode: string;
  areaId: string;
  areaName: string;
  areaType: null;
  areaTypeView: null;
  floorLevel: string;
  location: { type: 'Polygon' };
  mapLayer: string;
  parentAreaId: string;
  parentAreaName: null;
  remark: null;
}

export interface IUserSearchData {
  address: null;
  email: null;
  id: string;
  idCardNo: null;
  loginAccount: string;
  mobile: string;
  orgId: null;
  orgName: null;
  positionId: null;
  positionName: null;
  shortNum: null;
  userCode: string;
  userName: string;
  userState: number;
}
interface propType {
  onOpen?: () => void;
}

const AddAlarm = ({ onOpen }: propType) => {
  const [{ param }, setAlarmOpen] = useRecoilState(handleAlarmModel);
  const theme = useTheme();
  const mapRef = useRef<maplibregl.Map | null>(null);

  const methods = useForm<UserForm>({
    defaultValues: {},
  });

  const domWarp = useRef<HTMLDivElement | null>(null);
  const toast = useToast();
  const [isLoading, setIsLoading] = useSafeState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    getValues,
    setError,
    clearErrors,
  } = methods;

  const [userSearchData, setUserSearchData] = useSafeState<IUserSearchData[]>([]);
  const [positionSearchData, setPositionSearchData] = useSafeState<IPositionSearch[]>([]);
  //当前报警点位信息，目前只有经纬度和区域id

  const [currentAreaFloors, setCurrentAreaFloors] = useSafeState<
    Pick<IAreaFloorCounts, 'areaId' | 'areaName' | 'isChecked'>[]
  >([]);
  const [showAreaFloors, setShowAreaFloors] = useSafeState(false);

  const [showRecord, setShowRecord] = useSafeState(false);
  const [recordText, setRecordText] = useSafeState('请开始说话');
  const currentLngLat = useRef<maplibregl.LngLat | null>(null);
  const [position, setPosition] = useSafeState<number[]>([]);
  const marker = useRef<MarkerProps>();
  const handleClose = useMemoizedFn(() => {
    setAlarmOpen({ visible: false });
  });

  const showPicImg = useMemoizedFn((lngLat) => {
    const arr = [lngLat.lng, lngLat.lat];
    setPosition(arr);
    currentLngLat.current = lngLat;
    const warp = document.createElement('div');
    warp.className = 'map-pick-img';
    if (!marker.current) {
      marker.current = new Maplibregl.Marker({ element: warp, offset: [0, -36 / 2] });
      marker.current.setLngLat(lngLat).addTo(mapRef.current!);
    } else {
      marker.current.setLngLat(lngLat);
    }
  });

  const getMapObj = ({ map }: { map: maplibregl.Map }) => {
    mapRef.current = map;
    genAreaLayers();
    getAreaDatas();

    map.on('click', (e) => {
      console.log('eeeeeeee', e.lngLat);
      showPicImg(e.lngLat);
      setShowAreaFloors(false);
    });

    //地图右键人工报警坐标回填
    if (param && Object.keys(param).length) {
      const { latlng, areaId, areaName } = param;
      setPosition(latlng);
      setValue('address', areaName);
      setValue('alarmAreaId', areaId);
      map.flyTo({ center: latlng as LngLatLike });
      showPicImg({ lat: latlng[1], lng: latlng[0] });
      getAreaFloors({ areaId, areaName }, areaId);
    }
  };
  useMount(() => {
    if (domWarp.current) {
      SmoothScrollbar.init(domWarp.current);
    }
  });

  //提交报警
  const submit = useMemoizedFn(async (param: UserForm) => {
    const lngLat = position;
    if (!lngLat.length) {
      toast({
        title: '请在地图上选择报警位置',
        status: 'error',
        position: 'top',

        duration: 2000,
        isClosable: true,
      });
      return;
    }
    setIsLoading(true);
    const url = '/cx-alarm/alm/alarm/manualAlarm';
    const obj = {
      ...param,
      location: '',
    };

    //保存经纬度和区域
    if (lngLat) {
      obj.location = lngLat.toString();
    }

    const res = await request({ url, options: { method: 'post', body: JSON.stringify(obj) } });

    if (res.code === 200) {
      handleClose();

      if (process.env.NEXT_PUBLIC_ANALYTICS_Ms_type === 'yb') {
        // 元坝提交之后是否跳转发送短信
        onOpen && onOpen();
      }
    } else {
      toast({
        title: res.msg,
        status: 'error',
        position: 'top',

        duration: 2000,
        isClosable: true,
      });
    }

    setIsLoading(false);
  });

  //模糊查询人员添加一个防抖
  const { run: search } = useDebounceFn(
    async (keyWord: string) => {
      if (keyWord.trim() === '') {
        setUserSearchData([]);
        return;
      }
      const data = await request<IUserSearchData[]>({
        url: `/ms-system/user/get/user-list?userName=${keyWord.trim()}`,
        options: {
          method: 'get',
        },
      });
      if (data.code === 200) {
        setUserSearchData(data.data);
      }
    },
    {
      wait: 250,
    }
  );

  //模糊查询人员添加一个防抖
  const { run: searchPosition } = useDebounceFn(
    async (keyWord: string) => {
      if (keyWord.trim() === '') {
        setPositionSearchData([]);
        return;
      }
      const data = await request<IPositionSearch[]>({
        url: `/cx-alarm/dc/area/query?areaName=${keyWord.trim()}`,
      });
      if (data.code === 200) {
        setPositionSearchData(data.data);
      }
    },
    {
      wait: 250,
    }
  );

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

        const aaa = mapRef.current.getSource('area_source_') as maplibregl.GeoJSONSource;

        console.log('aaa', aaa);
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
      console.log('区域图层点击事件', e.features);
      if (e.features && e.features.length > 0) {
        const area = e.features[0].properties as IArea;
        const { areaId, areaName } = area;
        areaName && setValue('address', area.areaName, { shouldValidate: true });
        setValue('alarmAreaId', areaId);

        getAreaFloors(area, areaId);
        console.log('图层点击=============', area);
      }
    }
  );

  // 语音识别结束，展示识别结果，并执行查询
  const [showAn, setShowAn] = useSafeState(true);
  const dealRecord = useMemoizedFn((text: string) => {
    let newText: string = text;
    if (text.indexOf(',')) {
      newText = text.substring(0, text.length - 1);
    }
    setRecordText(newText);
    setTimeout(() => {
      setShowRecord(false);
      setValue('supplement', newText);
      setRecordText('请开始说话');
    }, 3 * 100);
  });
  const handleRecordSucess = () => {
    setRecordText('请开始说话');
    setShowAn(true);
  };
  const handleRecordError = () => {
    setRecordText('未检测到麦克风，无法使用语音查询');
    setShowAn(false);
    setTimeout(() => {
      setShowRecord(false);
      setRecordText('请开始说话');
    }, 1 * 2000);
  };

  //鼠标光标移动到最后
  const keepLastIndex = (obj: HTMLDivElement) => {
    if (window.getSelection) {
      obj.focus();
      const range = window.getSelection();
      range?.selectAllChildren(obj);
      range?.collapseToEnd();
    }
  };

  //获取区域楼层数据，如果是多层 打开楼层选择弹窗
  const getAreaFloors = useMemoizedFn(
    async (_area: Pick<IArea, 'areaId' | 'areaName'>, areaId: string) => {
      const areaMapRes = (await request({
        url: `/cx-alarm/dc/area/areaMap/floors?areaId=${areaId}`,
      })) as unknown as FeatureCollection<Polygon, IArea>;
      if (areaMapRes?.features?.length) {
        setShowAreaFloors(true);
        // 默认一楼选中
        const areas = [{ ..._area, isChecked: true }];
        if (!areaMapRes.features) {
          return;
        }

        for (const area of areaMapRes.features) {
          const constNewArea = { ...area.properties, isChecked: false };
          areas.push(constNewArea);
        }

        setCurrentAreaFloors(areas);
      }
    }
  );

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

        setValue('address', item.areaName);
        setValue('alarmAreaId', item.areaId);
      }
    }
  );

  return (
    <>
      <FormProvider {...methods}>
        <Box
          w="full"
          h="43rem"
          position="relative"
          borderRadius="3.5"
          overflow="hidden"
          css={{
            '.maplibregl-canvas': { borderBottomRightRadius: '5px', borderBottomLeftRadius: '5px' },
          }}
        >
          <Box
            position="absolute"
            top="0"
            left="0"
            w="82"
            h="full"
            px="2.5"
            py="4"
            backdropFilter="blur(20px)"
            zIndex={2}
            bg="pri.white.01"
          >
            <Box bg="pri.white.100" p="4" h="calc(100% - 50px)" ref={domWarp} borderTopRadius="3.5">
              <VStack align="flex-start" mb="4">
                <HStack>
                  <Box color="pri.red.100">*</Box>
                  <Box>报警位置</Box>
                </HStack>
                <FormControl alignItems="center" mb="20px" isInvalid={!!errors.address} isRequired>
                  <InputGroup isolation="unset">
                    <SearchInput
                      placeholder="请输入报警位置"
                      {...register('address', {
                        required: '请输入报警位置',
                      })}
                      w="100%"
                      data={positionSearchData.map((item) => ({
                        name: item.areaName,
                        id: item.areaId,
                      }))}
                      onChange={(e) => searchPosition(e.target.value)}
                      saveInput
                    />
                    <InputRightElement w="8" right={1}>
                      <IconButton
                        aria-label="Search database"
                        icon={<LocationIcon fill="pri.dark.500" />}
                      />
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage mt={0}>
                    {errors.address ? (errors.address.message as unknown as string) : null}
                  </FormErrorMessage>
                </FormControl>
              </VStack>
              <VStack align="flex-start" mb="4">
                <Box>报警人</Box>
                <FormControl alignItems="center" mb="20px">
                  <SearchInput
                    placeholder="请输入报警人"
                    {...register('alarmUserName', {
                      required: false,
                    })}
                    w="100%"
                    data={userSearchData.map((item) => ({ name: item.userName, id: item.id }))}
                    onChange={(e) => {
                      search(e.target.value);
                      setValue('alarmUserId', '');
                    }}
                    saveInput
                    onItemClick={(e) => {
                      const person = userSearchData.find((item) => e.id === item.id);
                      //保存电话和用户id
                      if (person?.mobile) {
                        setValue('linkPhone', person?.mobile);
                      }
                      if (person?.id) {
                        setValue('alarmUserId', person?.id);
                      }
                    }}
                  />
                </FormControl>
              </VStack>

              <VStack align="flex-start" mb="4">
                <Box>联系电话</Box>
                <FormControl alignItems="center" mb="20px" isInvalid={!!errors.linkPhone}>
                  <Input
                    type="number"
                    placeholder="请输入联系电话"
                    {...register('linkPhone', {
                      required: false,
                      validate: teleOrPhone,
                    })}
                  />
                  <FormErrorMessage mt={0}>
                    {errors.linkPhone ? (errors.linkPhone.message as unknown as string) : null}
                  </FormErrorMessage>
                </FormControl>
              </VStack>
              <VStack align="flex-start">
                <Flex alignItems="center" justifyContent="space-between" w="full">
                  <Box>警情补充</Box>
                  <Flex
                    cursor="pointer"
                    ml="10px"
                    alignItems="center"
                    onClick={() => {
                      setShowRecord(true);
                      startRecording(
                        dealRecord,
                        handleRecordSucess,
                        handleRecordError,
                        setRecordText
                      );
                    }}
                  >
                    <Box mr="2" fontSize={'12px'}>
                      语音
                    </Box>
                    <MicrophoneIconS fill="pri.dark.500" />
                  </Flex>
                </Flex>
                <FormControl alignItems="center" mb="20px" isInvalid={!!errors.supplement}>
                  {/* 用div模拟areaInput */}
                  <Box
                    onInput={(e) => {
                      const box = e.target as HTMLDivElement;
                      const v = box.innerText;

                      const maxLength = 1000;
                      //最多输入1000个字符
                      if (v.trim().length > maxLength) {
                        setError('supplement', { message: `最多输入${maxLength}个字符` });
                      } else {
                        clearErrors('supplement');
                      }

                      setValue('supplement', v);
                      keepLastIndex(box);
                    }}
                    suppressContentEditableWarning
                    borderColor={errors.supplement ? theme.colors.pri['red.100'] : 'pri.border.100'}
                    borderWidth={1}
                    contentEditable
                    w="full"
                    outline="none"
                    px="16px"
                    py="7px"
                    userSelect="none"
                    _empty={{
                      _before: {
                        content: `"请输入警情补充"`,
                        color: 'pri.gray.800',
                        fontSize: '16px',
                      },
                    }}
                    _focusVisible={{
                      zIndex: 1,
                      borderColor: 'pri.blue.100',
                      boxShadow: '0 0 0 1px rgb(0 120 236)',
                    }}
                    borderRadius="6px"
                    css={{
                      '>span': {
                        color: 'rgb(102,102,102)  !important',
                        fontSize: '16px !important',
                      },
                    }}
                    boxShadow={
                      errors.supplement ? `0 0 0 1px ${theme.colors.pri['red.100']}` : undefined
                    }
                    minH="100px"
                  />
                  <FormErrorMessage>
                    {errors.supplement ? (errors.supplement.message as unknown as string) : null}
                  </FormErrorMessage>
                </FormControl>
              </VStack>
            </Box>
            <Flex
              pb="10px"
              bg="pri.white.100"
              w="full"
              px="2.5"
              justify="center"
              align="center"
              borderBottomRadius="3.5"
            >
              <Button
                fontWeight="400"
                mr="2.5"
                bg="pri.gray.200"
                color="pri.dark.100"
                borderColor="pri.dark.400"
                borderWidth="1px"
                borderRadius="20px"
                w="20"
                onClick={handleClose}
              >
                取消
              </Button>

              <Button
                fontWeight="400"
                ml="2.5"
                onClick={handleSubmit(submit)}
                //onClick={() => console.log('ww', getValues(), errors)}
                bg="pri.blue.100"
                color="pri.white.100"
                borderRadius="20px"
                w="20"
                isLoading={isLoading}
              >
                提交
              </Button>
            </Flex>
          </Box>

          <Map getMapObj={getMapObj} disableViewTools disableMiniMap />
        </Box>
      </FormProvider>

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
      {showRecord && (
        <RecordAnimatedComponent
          recordText={recordText}
          showAn={showAn}
          setShowRecord={setShowRecord}
        />
      )}
    </>
  );
};

export default AddAlarm;
