'use client';
import { Box } from '@chakra-ui/react';
import { Point } from '@turf/turf';
import dynamic from 'next/dynamic';
import { useRef } from 'react';

const BaseMap = dynamic(() => import('@/components/Map'), { ssr: false });

export interface IAlarmClusterItem {
  alarmCount: number;
  areaId: string;
  areaName: string;
  centralPoint: Point;
  floorLevel: string;
  areaCode: string;
  countDetails: {
    alarmType: string;
    alarmTypeName: string;
    count: number;
  }[];
  deptName: string;
}

const Page = () => {
  const mapRef = useRef<any>();

  const getMapObj = ({ map }: { map: maplibregl.Map }) => {
    mapRef.current = map;
    map.setBearing(7.39);
    map.setZoom(19);
    map.setCenter([103.92780465964438, 31.08296552358881]);
    process.env.NEXT_PUBLIC_ANALYTICS_MAPHideTextLayer?.split(',').forEach((layer) => {
      if (map.getLayer(layer)) {
        map.setLayoutProperty(layer, 'visibility', 'none');
      }
    });

    console.log('111', [
      [map.unproject([0, 0]).lng, map.unproject([0, 0]).lat],
      [map.unproject([3840, 0]).lng, map.unproject([3840, 0]).lat],
      [map.unproject([3840, 2160]).lng, map.unproject([3840, 2160]).lat],
      [map.unproject([0, 2160]).lng, map.unproject([0, 2160]).lat],
    ]);
    console.log('长', map.unproject([0, 0]).distanceTo(map.unproject([3840, 0])));
    console.log('长', map.unproject([3840, 2160]).distanceTo(map.unproject([0, 2160])));

    console.log('宽', map.unproject([0, 2160]).distanceTo(map.unproject([0, 0])));
    console.log('宽', map.unproject([3840, 2160]).distanceTo(map.unproject([3840, 0])));

    map.addSource('myBaseMapSource', {
      type: 'image',
      url: '/baseMap5.png',
      coordinates: [
        [map.unproject([0, 0]).lng, map.unproject([0, 0]).lat],
        [map.unproject([3840, 0]).lng, map.unproject([3840, 0]).lat],
        [map.unproject([3840, 2160]).lng, map.unproject([3840, 2160]).lat],
        [map.unproject([0, 2160]).lng, map.unproject([0, 2160]).lat],
      ],
    });

    map.addLayer({
      id: 'myBaseMap',
      type: 'raster',
      source: 'myBaseMapSource',
    });
  };

  return (
    <Box h="full" position="relative">
      <BaseMap getMapObj={getMapObj} disableMiniMap disableViewTools />
      <Box
        pos={'absolute'}
        top="0px"
        left={'0px'}
        zIndex={9}
        w={'100px'}
        h="100px"
        bgColor={'#f00'}
        onClick={() => {
          if (mapRef.current.getLayer('myBaseMap').visibility === 'visible') {
            mapRef.current?.setLayoutProperty('myBaseMap', 'visibility', 'none');
          } else {
            mapRef.current?.setLayoutProperty('myBaseMap', 'visibility', 'visible');
          }
        }}
      ></Box>
    </Box>
  );
};

export default Page;
