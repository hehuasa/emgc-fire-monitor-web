import { Box } from '@chakra-ui/react';
import Map from '@/components/Map';
import { FormItem, FormItemProps } from 'amis';
import { useRef } from 'react';
import { FeatureCollection, Polygon, featureCollection } from '@turf/turf';
import { IArea } from '@/models/map';
import { request } from '@/utils/request';
import { MapMouseEvent } from 'maplibre-gl';
import { useMemoizedFn } from 'ahooks';

interface IProps extends FormItemProps {
  areaId?: string;
}

const AreaSelect = (props: IProps) => {
  const mapRef = useRef<maplibregl.Map | null>(null);
  // const [areaId, setAreaId] = useState('');

  const getMapObj = ({ map }: { map: maplibregl.Map }) => {
    mapRef.current = map;
    genAreaLayers();
    getAreaDatas();
    if (props.areaId)
      mapRef.current?.setFilter('broadcast_fill_select', ['==', 'areaId', props.areaId]);
    // map.on('click', (e) => {
    //   // showPicImg(e.lngLat);
    //   console.log('选中地图', e);
    //   if (e.features && e.features.length > 0) {
    //     const areaId = e.features[0].properties.areaId;

    //     setAreaId(areaId);
    //     // e.target.setFilter('broadcast_fill', ['==', 'areaId', areaId]);
    //   }
    // });
  };

  // const showPicImg = (lngLat: LngLat) => {
  //   const arr = [lngLat.lng, lngLat.lat];
  //   setPos(arr);

  //   // sessionStorage.setItem('pos', JSON.stringify(arr));

  //   const warp = document.createElement('div');
  //   warp.className = 'map-pick-img';
  //   if (!marker.current) {
  //     marker.current = new Maplibregl.Marker({ element: warp, offset: [0, -36 / 2] });
  //     marker.current.setLngLat(lngLat).addTo(mapRef.current!);
  //   } else {
  //     marker.current.setLngLat(lngLat);
  //   }
  // };

  // 区域图层定义
  const genAreaLayers = async () => {
    const source: maplibregl.GeoJSONSourceSpecification = {
      type: 'geojson',

      data: featureCollection([]),
    };
    mapRef.current?.addSource('area_source_', source);

    const broadcast_fill: maplibregl.LayerSpecification = {
      id: 'broadcast_fill',
      type: 'fill',
      source: 'area_source_',
      // maxzoom: clusterZoom,

      paint: {
        'fill-color': 'rgba(0, 120, 236, 0.50)',
        'fill-outline-color': 'rgba(0, 120, 236, 1)',
        'fill-opacity': 1,
      },
      filter: ['==', 'areaId', ''],
    };

    const broadcast_fill_select: maplibregl.LayerSpecification = {
      id: 'broadcast_fill_select',
      type: 'fill',
      source: 'area_source_',
      paint: {
        'fill-color': 'rgba(0, 120, 236, 0.50)',
        'fill-outline-color': 'rgba(0, 120, 236, 1)',
        'fill-opacity': 1,
      },
      filter: ['==', 'areaId', ''],
    };

    const broadcast_fill_hide: maplibregl.LayerSpecification = {
      id: 'broadcast_fill_hide',
      type: 'fill',
      source: 'area_source_',
      paint: {
        'fill-opacity': 0,
      },
    };

    mapRef.current?.on('mousemove', 'broadcast_fill_hide', handleAreaMousemove);
    mapRef.current?.on('mouseleave', 'broadcast_fill_hide', handleAreaMouseleave);

    mapRef.current?.on('click', 'broadcast_fill_hide', handleAreaClick);
    mapRef.current?.addLayer(broadcast_fill);
    mapRef.current?.addLayer(broadcast_fill_hide);
    mapRef.current?.addLayer(broadcast_fill_select);
  };

  // 鼠标移入区域，高亮
  const handleAreaMousemove = (
    e: MapMouseEvent & {
      features?: any;
    }
  ) => {
    // if (isSpaceQueryingRef.current) {
    //   return;
    // }
    if (e.features && e.features.length > 0) {
      const areaId = e.features[0].properties.areaId;
      e.target.setFilter('broadcast_fill', ['==', 'areaId', areaId]);
    }
  };
  // 鼠标移出区域，取消高亮
  const handleAreaMouseleave = (
    e: MapMouseEvent & {
      features?: any;
    }
  ) => {
    // if (isSpaceQueryingRef.current) {
    //   return;
    // }
    e.target.setFilter('broadcast_fill', ['==', 'areaId', '']);
  };

  // 获取区域数据并且给地图添加新的区域图层数据
  const getAreaDatas = async () => {
    if (mapRef.current) {
      const url = `/cx-alarm/dc/area/areaMap`;
      const res = (await request({ url })) as unknown as FeatureCollection<Polygon, IArea>;
      res.features = res.features.filter((item) => item.geometry.type);
      const area_source_ = mapRef.current.getSource('area_source_') as maplibregl.GeoJSONSource;
      if (res && res.features) {
        res && res.features && area_source_.setData(res as GeoJSON.GeoJSON);
      }
    }
  };

  const //区域图层点击事件
    handleAreaClick = useMemoizedFn(
      (
        e: MapMouseEvent & {
          features?: any;
        }
      ) => {
        if (e.features && e.features.length > 0) {
          const area = e.features[0].properties as IArea;
          const { areaId, areaName } = area;
          e.target.setFilter('broadcast_fill_select', ['==', 'areaId', areaId]);
          props.onChange({
            mapName: areaName,
            location: e.features[0].geometry,
          });
        }
      }
    );

  return (
    <Box w={'full'} h={'70vh'}>
      <Map getMapObj={getMapObj} disableViewTools disableMiniMap />
    </Box>
  );
};

export default FormItem({
  type: 'area-map',
  autoVar: true,
})(AreaSelect);
