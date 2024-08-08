import gpsLocation_green from '@/assets/map/gpsLocation_green.svg';
import gpsLocation_red from '@/assets/map/gpsLocation_red.svg';
import title from '@/assets/montior/title.png';
import { CloseIcon } from '@/components/Icons';
import { Box, Center, FormControl, FormErrorMessage, HStack, Input } from '@chakra-ui/react';
import Image from 'next/image';

import Marker from '@/components/Map/marker';
import { MapContext } from '@/models/map';
import { currentGpsInfoModel, currentGpsListModel } from '@/models/resource';
import { request } from '@/utils/request';
import { featureCollection, lineString, point, Point } from '@turf/turf';
import { useMount } from 'ahooks';
import { GeoJSONSource } from 'maplibre-gl';
import moment from 'moment';
import { stringify } from 'qs';
import { useContext, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { useRecoilState } from 'recoil';
import SmoothScrollbar from 'smooth-scrollbar';
import { getGpsList } from './GpsLocationList';

const ori = [103.94880019908584, 31.102668139905433];
interface IForm {
  startTime: string;
  endTime: string;
}

interface IProps {
  fold: boolean;
}
const GpsLocation = ({ fold }: IProps) => {
  const { formatMessage } = useIntl();
  const [currentGpsInfo, setCurrentGpsInfo] = useRecoilState(currentGpsInfoModel);
  const [currentGpsList, setCurrentGpsList] = useRecoilState(currentGpsListModel);
  const map = useContext(MapContext);
  const [showMarker, setShowMarker] = useState(false);
  //轨迹开始坐标
  const startCordRef = useRef([0, 0]);
  //轨迹结束坐标
  const endCrodRef = useRef([0, 0]);
  const warp = useRef<HTMLDivElement | null>(null);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IForm>({ defaultValues: {} });

  const scrollbar = useRef<SmoothScrollbar | null>(null);

  useMount(() => {
    addHoverLayer();
    if (warp.current) {
      scrollbar.current = SmoothScrollbar.init(warp.current);
    }
  });

  const addHoverLayer = () => {
    if (currentGpsInfo) {
      try {
        const currentPoint = JSON.parse(currentGpsInfo.coordinate as unknown as string);
        if (map) {
          const source = map.getSource('gps_h') as GeoJSONSource;
          if (source) {
            source.setData(featureCollection([point(currentPoint.coordinates)]));
          }
        }
      } catch (e) {
        //
      }
    }
  };

  const handleClose = async () => {
    const gpsList = await getGpsList();
    setCurrentGpsList(gpsList);
    setCurrentGpsInfo(null);
  };

  const submit = async (e: IForm) => {
    const { startTime, endTime } = e;

    const param = {
      startTime: moment(startTime).format('YYYY-MM-DD HH:mm:ss'),
      endTime: endTime ? moment(endTime).format('YYYY-MM-DD HH:mm:ss') : '',
      resourceId: currentGpsInfo?.id,
    };

    const url = `/cx-alarm/resource/findPersonTrack?${stringify(param)}`;

    // startCordRef.current = [103.8239386391013, 30.992030185222617];
    // endCrodRef.current = [103.82308012, 30.993280032];
    const { code, data } = await request<Point[]>({ url });

    // const data = [
    //   {
    //     coordinates: [103.90407468080633, 31.05262697441188],
    //     type: 'Point',
    //   },
    //   {
    //     coordinates: [103.90448810464176, 31.05155610370369],
    //     type: 'Point',
    //   },
    // ];

    if (map && code === 200) {
      const gpsLocation_line = map.getSource('gpsLocation_line') as maplibregl.GeoJSONSource;

      let line: any = featureCollection([]);
      if (data.length) {
        startCordRef.current = data[0].coordinates;
        endCrodRef.current = data[data.length - 1].coordinates;
        line = lineString(data.map((item) => item.coordinates));

        setShowMarker(true);

        if (gpsLocation_line) {
          gpsLocation_line.setData(featureCollection([line]));
        } else {
          map.addSource('gpsLocation_line', {
            type: 'geojson',
            data: featureCollection([line]),
          });

          map.addLayer({
            id: 'gpsLocation_line',
            type: 'line',
            source: 'gpsLocation_line',
            paint: {
              'line-width': 3,
              'line-color': 'RGBA(255, 136, 0, 1)',
              'line-dasharray': [2, 2],
            },
          });
        }
      } else {
        setShowMarker(false);
        removeLayer();
      }
    }
  };

  const removeLayer = async () => {
    if (map) {
      // 人员定位轨迹图层撒移除
      if (map?.getLayer('gpsLocation_line')) {
        map?.removeLayer('gpsLocation_line');
      }
      // 人员定位轨迹图层资源撒移除
      if ( map?.getSource('gpsLocation_line')) {
        map?.removeSource('gpsLocation_line');
      }
      // 人员定位图标图层数据设空
      const source = map?.getSource('gps_h') as GeoJSONSource;
      if (source) {
        source.setData(featureCollection([]));
      }
    }
  };

  useMount(() => {
    removeLayer();
  });

  return (
    <>
      <Box
        position="relative"
        p="3.5"
        h="full"
        opacity={fold ? 0 : 1}
        zIndex={fold ? -1 : 1}
        borderRadius="10px"
        backgroundColor="pri.gray.500"
      >
        <Box
          position="absolute"
          right={0}
          top={0}
          w="0"
          h="0"
          borderWidth="1.75rem"
          borderColor="pri.blue.100"
          borderBottomColor="transparent"
          borderLeftColor="transparent"
          borderTopRightRadius="0.625rem"
          zIndex={2}
          cursor="pointer"
          onClick={handleClose}
        >
          <CloseIcon
            _hover={{ opacity: 0.8 }}
            position="absolute"
            right="-20px"
            top="-20px"
            color="pri.white.100"
            zIndex={2}
          />
        </Box>

        <Box h="full" ref={warp}>
          <Box bg="pri.white.100" px="4" py="3.5" borderTopRadius="10px" mb="1px">
            <HStack>
              <Image alt="title" src={title} />
              <Box fontSize="lg" fontWeight="bold" color="pri.dark.100">
                {formatMessage({ id: 'personnelLocate.Positioning' })}
              </Box>
            </HStack>
          </Box>
          <Box
            bg="pri.white.100"
            px="4"
            pt="4"
            borderBottomRadius="10px"
            borderTopColor="pri.dark.500"
            borderTopStyle="dashed"
            borderTopWidth="1px"
          >
            <Box color="pri.dark.100" lineHeight="30px" mb="3.5">
              <Box paddingRight="10px" whiteSpace="nowrap">
                {formatMessage({ id: 'personnelLocate.StartDate' })}
              </Box>
              <FormControl mr="28px" alignItems="center" isInvalid={!!errors.startTime} w="auto">
                <Input
                  type="datetime-local"
                  {...register('startTime', {
                    required: '请选择开始日期：',
                  })}
                />
                <FormErrorMessage mt={0}>{errors.startTime?.message}</FormErrorMessage>
              </FormControl>
              <Box paddingRight="10px" whiteSpace="nowrap">
                {formatMessage({ id: 'personnelLocate.EndDate' })}
              </Box>
              <FormControl mr="28px" alignItems="center" w="auto">
                <Input type="datetime-local" {...register('endTime')} />
              </FormControl>
              <Center
                borderRadius="10px"
                h="12.5"
                w="full"
                bg="pri.blue.100"
                color="pri.white.100"
                cursor="pointer"
                mt="4"
                mb="6"
                _hover={{
                  bg: 'pri.blue.200',
                }}
                onClick={handleSubmit(submit)}
              >
                {formatMessage({ id: 'personnelLocate.SearchTrack' })}
              </Center>

              <HStack>
                <Box paddingRight="10px" whiteSpace="nowrap">
                  {formatMessage({ id: 'personnelLocate.detail.JobNo' })}
                </Box>
                <Box>{currentGpsInfo?.idCardNo}</Box>
              </HStack>
              <HStack>
                <Box paddingRight="10px" whiteSpace="nowrap">
                  {formatMessage({ id: 'personnelLocate.detail.Name' })}
                </Box>
                <Box>{currentGpsInfo?.userName}</Box>
              </HStack>
              <HStack>
                <Box paddingRight="10px" whiteSpace="nowrap">
                  {formatMessage({ id: 'personnelLocate.detail.Sex' })}
                </Box>
                <Box>{currentGpsInfo?.sex === '1' ? '男' : '女'}</Box>
              </HStack>
              <HStack>
                <Box paddingRight="10px" whiteSpace="nowrap">
                  {formatMessage({ id: 'personnelLocate.detail.Department' })}
                </Box>
                <Box>{currentGpsInfo?.orgName}</Box>
              </HStack>
              <HStack>
                <Box paddingRight="10px" whiteSpace="nowrap">
                  {formatMessage({ id: 'personnelLocate.detail.Post' })}
                </Box>
                <Box>{currentGpsInfo?.positionName ? currentGpsInfo?.positionName.join() : ''}</Box>
              </HStack>
              <HStack>
                <Box paddingRight="10px" whiteSpace="nowrap">
                  {formatMessage({ id: 'personnelLocate.detail.Phone' })}
                </Box>
                <Box>{currentGpsInfo?.mobile}</Box>
              </HStack>
              {/* <HStack>
              <Box paddingRight="10px" whiteSpace="nowrap">
                人员类型 :
              </Box>
              <Box></Box>
            </HStack> */}
            </Box>
          </Box>
        </Box>
      </Box>
      {/* <Marker map={map} longitude={ori[0]} latitude={ori[1]} >
        <Box transform={'translateY(-24px)'}>
          <Image src={gpsLocation_green} alt='' />
        </Box>

      </Marker> */}
      {map && showMarker && (
        <>
          <Marker map={map} longitude={startCordRef.current[0]} latitude={startCordRef.current[1]}>
            <Box transform={'translateY(-24px)'}>
              <Image src={gpsLocation_green} alt="" />
            </Box>
          </Marker>
          <Marker map={map} longitude={endCrodRef.current[0]} latitude={endCrodRef.current[1]}>
            <Box transform={'translateY(-24px)'}>
              <Image src={gpsLocation_red} alt="" />
            </Box>
          </Marker>
        </>
      )}
    </>
  );
};

export default GpsLocation;
