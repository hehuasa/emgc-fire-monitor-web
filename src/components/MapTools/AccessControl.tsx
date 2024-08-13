import { confirmModal } from '@/components/Confirm';
import { CircleClose } from '@/components/Icons';
import BaseMap from '@/components/Map';
import { localesModal } from '@/models/global';
import { accessControltVisibleModel } from '@/models/map';
import { IResItem } from '@/models/resource';
import { request } from '@/utils/request';
import { execOperate } from '@/utils/util';
import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  useTheme,
} from '@chakra-ui/react';
import { featureCollection, point } from '@turf/turf';
import { Point, FeatureCollection } from 'geojson'
import { useMemoizedFn } from 'ahooks';
import { stringify } from 'qs';
import { useRef } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { ILayerItem } from './LayerList';

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';

const ModalWarp = dynamic(() => import('@/components/emergencyCommand/modalWarp'), { ssr: false });

interface Props {
  theme?: 'deep' | 'shallow';
  onCloseFn?: () => void;
  eventId?: string;
}
const AccessControl = ({ theme = 'shallow', onCloseFn, eventId }: Props) => {
  const locales = useRecoilValue(localesModal);
  const [visible, setVisible] = useRecoilState(accessControltVisibleModel);
  const mapRef = useRef<maplibregl.Map | null>(null);

  const t = useTranslations('map');

  const iconIsHover = useRef(false);
  const themeStyle = useTheme();

  const onClose = useMemoizedFn(() => {
    setVisible(false);
    onCloseFn?.();
  });

  //获取门禁数据;
  const getLayerDatas = async () => {
    const obj = { layerIds: ['110'], location: '', radius: 0 };
    const param = stringify(obj, { indices: false });
    const url = `/cx-alarm/resource/list-resource?${param}`;
    const res = (await request<ILayerItem[]>({ url })) as unknown as FeatureCollection<
      Point,
      IResItem & { open: boolean }
    >;

    if (res.features) {
      res.features = res.features.filter((val) => val.geometry.coordinates);

      const source = mapRef.current?.getSource(
        'accessControlLayers_source'
      ) as maplibregl.GeoJSONSource;
      for (const item of res.features) {
        item.properties.open = false;
      }
      console.log('门禁res', res);
      source.setData?.(res);
    }
  };

  const getMapObj_ = ({ map }: { map: maplibregl.Map }) => {
    mapRef.current = map;
    genAccessControlLayers();
    getLayerDatas();
  };

  //注册门禁图层
  const genAccessControlLayers = () => {
    const source: maplibregl.GeoJSONSourceSpecification = {
      type: 'geojson',

      data: featureCollection([]),
    };

    //普通图层
    const accessControlLayers: maplibregl.LayerSpecification = {
      id: 'accessControlLayers',
      type: 'symbol',
      source: 'accessControlLayers_source',

      layout: {
        'icon-image': ['case', ['get', 'open'], 'res_Acces_open', 'res_Acces_close'],
        //'icon-image': 'res_Acces_close',
        'icon-allow-overlap': true,
      },
    };
    mapRef.current?.addSource('accessControlLayers_source', source);

    //hover图层
    const accessControlLayers_h: maplibregl.LayerSpecification = {
      id: 'accessControlLayers_h',
      type: 'symbol',
      source: 'accessControlLayers_source_h',

      layout: {
        'icon-image': ['case', ['get', 'open'], 'res_Acces_open_h', 'res_Acces_close_h'],
        'icon-allow-overlap': true,
      },
    };
    mapRef.current?.addSource('accessControlLayers_source_h', source);

    mapRef.current?.on('click', 'accessControlLayers', resLayerClick);
    mapRef.current?.on('mouseenter', 'accessControlLayers', () => (iconIsHover.current = true));
    mapRef.current?.on('mouseleave', 'accessControlLayers', () => (iconIsHover.current = false));
    mapRef.current?.addLayer(accessControlLayers);
    //mapRef.current?.addLayer(accessControlLayers_h);

    //地图事件，点击空白隐藏hover图标
    mapRef.current?.on('click', (e) => {
      //当前鼠标没有hover在普通图标上才点击空白隐藏hover图标

      if (!iconIsHover.current) {
        const source = mapRef.current?.getSource(
          'accessControlLayers_source_h'
        ) as maplibregl.GeoJSONSource;
        const sourcedata = featureCollection([]);
        source.setData(sourcedata as unknown as GeoJSON.GeoJSON);
      }
    });
  };

  const resLayerClick = (e: { features: unknown[]; }) => {
    if (e.features && e.features[0]) {
      const res = e.features[0] as unknown as {
        properties: { open: boolean };
        geometry: { coordinates: number[] };
      };
      const coordinates = res.geometry.coordinates;

      //普通门禁图层变成hover样式
      const source = mapRef.current?.getSource(
        'accessControlLayers_source_h'
      ) as maplibregl.GeoJSONSource;
      const sourcedata = featureCollection([
        point(coordinates, {
          ...res.properties,
        }),
      ]);
      //mapRef.current?.flyTo({ center: coordinates as LngLatLike });
      source.setData(sourcedata as unknown as GeoJSON.GeoJSON);

      //打开确认弹窗
      // confirmModal({
      //   title: `是否确定${res.properties.open ? '关闭' : '打开'}门禁？`,
      // });
    }
  };

  const _renderBody = useMemoizedFn(() => {
    return (
      <Box h="710px" borderBottomRadius="10px" overflow="hidden">
        <BaseMap getMapObj={getMapObj_} isDark={theme === 'deep'} disableMiniMap />
        <Button
          position="absolute"
          top="73px"
          right="15px"
          zIndex={100}
          p="10px 14px"
          borderRadius="10px"
          bg={theme === 'deep' ? 'emgc.blue.400' : 'pri.white.100'}
          fontSize="14px"
          boxShadow="0px 3px 6px 1px rgba(0,0,0,0.16)"
          color={theme === 'deep' ? 'pri.white.100' : 'emgc.blue.400'}
          _hover={{}}
          onClick={() => {
            confirmModal({
              title: t('accessConfirm'),
              theme: themeStyle,
              locales: locales,
              isDark: theme === 'deep',
              ok: async () => {
                const { code } = await request({
                  url: '/cx-alarm/ext/personnelRecord/remoteOpenDoorOneKey',
                  options: {
                    method: 'post',
                  },
                });
                if (code === 200 && theme === 'deep') {
                  execOperate({ incidentId: eventId!, operationAction: 'DOOR' });
                }
              },
            });
          }}
        >
          {t('oneKeyForOpening')}
        </Button>
      </Box>
    );
  });

  return (
    <>
      <Modal isOpen={visible} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          h={760}
          maxW="unset"
          w={1400}
          borderRadius="10px"
          bg={theme === 'shallow' ? '#fff' : 'transparent'}
        >
          <ModalBody p={0} h="full">
            {theme === 'shallow' ? (
              <Flex
                display="flex"
                h="50px"
                justifyContent="space-between"
                alignItems="center"
                p="0 20px"
              >
                <Box fontSize={'18px'} fontWeight="bold" userSelect="none">
                  {t('accessControl')}
                </Box>
                <CircleClose onClick={onClose} fontSize="24px" cursor="pointer" />
              </Flex>
            ) : null}
            {theme === 'shallow' ? (
              _renderBody()
            ) : (
              <ModalWarp onClose={onClose} title={t("accessControl")}>
                {_renderBody()}
              </ModalWarp>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AccessControl;
