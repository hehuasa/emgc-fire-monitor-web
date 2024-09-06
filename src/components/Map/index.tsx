'use client';
import { Box, Flex, Stack } from '@chakra-ui/react';
import { useMount, useUnmount } from 'ahooks';
import maplibregl, { LngLatBounds, LngLatLike, MapOptions } from 'mapbox-gl';
import { useRef } from 'react';
// import popup from '@/assets/videoClient/center.png';
import { centerOfMass, point, polygon, rhumbBearing, transformTranslate } from '@turf/turf';
import { AiOutlineCompress } from 'react-icons/ai';
import { MapRotateIcon } from '../Icons';

import { clone } from 'lodash';

export const mapOp = {
  minClusterZoom: 15,
  clusterZoom: 19,
  flyToZoom: 20,
};

type ImapOp = {
  style: string;
  center: [number, number];
  pitch: number;
  // bounds: [number, number, number, number];
  bearing: number;
  zoom: number;
};

type mapCustomOp = {
  style?: string;
  center?: [number, number];
  pitch?: number;
  bearing?: number;
  zoom?: number;
  bounds?: [number, number, number, number];
};

interface IProps {
  getMapObj?: ({ map, miniMap }: { map: maplibregl.Map; miniMap?: maplibregl.Map }) => void;
  getMiniMapObj?: ({ map }: { map: maplibregl.Map }) => void;
  newMapOp?: mapCustomOp;
  isDark?: boolean;
  disableViewTools?: boolean;
  disableMiniMap?: boolean;
  disableWeatherButton?: boolean;
  initRain?: boolean;
  initSnow?: boolean;
  initWind?: boolean;
  //默认地图位置主要是zoom和center
  mapPosition?: Pick<MapOptions, 'center' | 'zoom'>;
}

const dev = process.env.NODE_ENV !== 'production';

const mapOps: ImapOp = {
  style: process.env.NEXT_PUBLIC_ANALYTICS_MAPURL as string,
  // style: dev ? (process.env.NEXT_PUBLIC_ANALYTICS_MAPURL as string) : (process.env.NEXT_PUBLIC_ANALYTICS_MAPURL as string),
  // style: 'https://api.maptiler.com/maps/3eb670bc-724c-46fc-adbc-48f2c5956bc8/style.json?key=mIkNLzkbhwfNopBXjt6d',
  center: [
    Number(process.env.NEXT_PUBLIC_ANALYTICS_MAPCenterLng),
    Number(process.env.NEXT_PUBLIC_ANALYTICS_MAPCenterLat),
  ],
  bearing: Number(process.env.NEXT_PUBLIC_ANALYTICS_MAPCenterBearing),
  zoom: Number(process.env.NEXT_PUBLIC_ANALYTICS_MAPCenterZoom),
  pitch: 0,
};

const Map = ({
  getMapObj,
  newMapOp,
  disableViewTools,
  disableMiniMap,
  // disableWeatherButton,
  getMiniMapObj,
  isDark = false,
  mapPosition,
}: IProps) => {
  const mapDom = useRef<HTMLDivElement | null>(null);
  const minimapDom = useRef<HTMLDivElement | null>(null);
  const compassDom = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  const newOps = useRef(clone(mapOps));

  const initMap = async () => {
    newOps.current.style = isDark
      ? (process.env.NEXT_PUBLIC_ANALYTICS_MAPURLDARK as string)
      : newOps.current.style;

    if (mapDom.current && !mapRef.current) {
      const map = (mapRef.current = new maplibregl.Map({
        container: mapDom.current,
        ...newOps.current,
        ...newMapOp,
        maxPitch: 85,
        attributionControl: false,
        antialias: true,
        ...mapPosition,
        bearingSnap: 0,
      }));

      /**
       * 添加自定义图层，结合threejs
       */
      const addCustomLayer = () => {};

      map.on('load', () => {
        // map.addSource('terrainSource', {
        //   type: 'raster-dem',
        //   url: 'https://www.greatech.com.cn:2403/dems/2023-4-6/layer.json',
        //   // encoding: 'terrarium',
        //   tileSize: 256
        // })
        // map.addSource('hillshadeSource', {
        //   type: 'raster-dem',
        //   url: 'https://www.greatech.com.cn:2403/dems/2023-4-6/layer.json',
        //   // encoding: 'terrarium',

        //   tileSize: 256
        // })

        // map.addLayer({
        //   id: "hills",
        //   type: 'hillshade',
        //   source: 'hillshadeSource',
        //   layout: { visibility: 'visible' },
        //   paint: { 'hillshade-shadow-color': '#473B24' }
        // })

        // map.setTerrain({
        //   source: 'terrainSource',
        //   exaggeration: 1
        // })
        // map.addSource(
        //   'erban',
        //   {
        //     type: 'geojson',
        //     data: window.location.origin +
        //       process.env.NEXT_PUBLIC_ANALYTICS_BasePath +
        //       '/geojsons/erban_line_FeaturesToJSON.geojson',
        //   }
        // );
        // map.addLayer(
        //   {
        //     type: 'line',
        //     id: 'erban',
        //     source: 'erban',
        //     paint: { 'line-color': 'rgba(77, 111, 168, 1)' },
        //     layout: {
        //       visibility: "none"
        //     }
        //   }
        // );
        map.addSource('escape', {
          type: 'geojson',
          data: [],
        });
        map.addLayer({
          type: 'symbol',
          id: 'escape',
          source: 'escape',
          layout: { 'icon-image': 'arrow', 'symbol-spacing': 40, 'symbol-placement': 'line' },
        });

        try {
          if (!disableMiniMap) {
            genMiniMap(map);
          }

          if (getMapObj) {
            getMapObj({ map });
          }

          map.addLayer(addCustomLayer() as maplibregl.CustomLayerInterface);
        } catch (e) {
          console.log('eeeeee qqqqqqqqqq', e);
        }
      });

      // 指北针交互

      map.on('rotate', () => {
        if (compassDom.current) {
          compassDom.current.style.transform = `scale(${
            1 / Math.pow(Math.cos(map.transform.pitch * (Math.PI / 180)), 0.5)
          }) rotateX(${map.transform.pitch}deg) rotateZ(${
            map.transform.angle * (180 / Math.PI)
          }deg)`;
        }
      });

      if (dev) {
        map.on('click', (e) => {
          console.info('============e.lngLat==============', e, e.lngLat);
          console.info('============map.getBounds==============', map.getBounds());
          console.info('============map.getPitch==============', map.getPitch());
          console.info('============map.getBearing==============', map.getBearing());
          console.info('============map.getZoom==============', map.getZoom());
          console.info('============map.getCenter==============', map.getCenter());
        });
      }
    }
  };

  useMount(initMap);
  useUnmount(() => {
    try {
      if (mapRef.current) {
        mapRef.current?.remove();
      }
    } catch (error) {
      console.info(error);
    }
  });
  const genMiniMap = (map: maplibregl.Map) => {
    if (minimapDom.current) {
      const minimap = new maplibregl.Map({
        container: minimapDom.current,
        ...newOps.current,
        touchZoomRotate: false,
        touchPitch: false,
        doubleClickZoom: false,
        keyboard: false,
        dragPan: false,
        dragRotate: false,
        boxZoom: false,
        scrollZoom: false,
        // pitch: 0,
        // bearing: 0,
        zoom: 14.5,
      });

      minimap.dragPan.disable();
      let idDragging = false;

      let currentPoint: number[];
      let cachePoint: number[];
      let minimapCanvas: HTMLElement;
      let sourceBounds: LngLatBounds;

      const boundsCoordinates = [[[], [], [], [], []]];

      const getPolygon = (bounds: LngLatBounds) => {
        const polygon_ = polygon([
          [
            bounds.getSouthEast().toArray(),
            bounds.getNorthEast().toArray(),
            bounds.getNorthWest().toArray(),
            bounds.getSouthWest().toArray(),
            bounds.getSouthEast().toArray(),
          ],
        ]);

        return polygon_;
      };

      const bounds = (sourceBounds = map.getBounds());

      const source: maplibregl.GeoJSONSourceSpecification = {
        type: 'geojson',
        data: getPolygon(bounds),
      };

      minimap.on('load', () => {
        minimapCanvas = minimap.getCanvasContainer();
        minimapCanvas.addEventListener('wheel', (e) => [e.preventDefault()]);
        minimapCanvas.addEventListener('mousewheel', (e) => {
          e.preventDefault();
        });
        if (process.env.NEXT_PUBLIC_ANALYTICS_Ms_type === 'cx') {
          process.env.NEXT_PUBLIC_ANALYTICS_MAPHideTextLayer?.split(',').forEach((layer) => {
            if (minimap.getLayer(layer)) {
              minimap.setLayoutProperty(layer, 'visibility', 'none');
            }
          });
        }

        // minimap.setLayoutProperty('zhuangzhi_v1_text_4', 'visibility', 'none');
        // minimap.setLayoutProperty('zhuangzhi_v1_text_3', 'visibility', 'none');
        // minimap.setLayoutProperty('zhuangzhi_kuai_v2_text_4', 'visibility', 'none');
        // minimap.setLayoutProperty('zhuangzhi_kuai_v2_text_3', 'visibility', 'none');
        // minimap.setLayoutProperty('jianzhu_v1_text_4', 'visibility', 'none');
        // minimap.setLayoutProperty('zhuangzhi_circle_text_4', 'visibility', 'none');
        // minimap.setLayoutProperty('zhuangzhi_kuai_v3_text_4', 'visibility', 'none');
        // minimap.setLayoutProperty('door_text_4', 'visibility', 'none');
        // minimap.setLayoutProperty('jianzhu_v1_text_3', 'visibility', 'none');
        // minimap.setLayoutProperty('zhuangzhi_circle_text_3', 'visibility', 'none');
        // minimap.setLayoutProperty('zhuangzhi_kuai_v3_text_3', 'visibility', 'none');

        if (getMiniMapObj) {
          getMiniMapObj({ map: minimap });
        }
        minimap.addSource('bounds', source);
        minimap.addLayer({
          id: 'bounds',
          type: 'fill',
          source: 'bounds',
          paint: {
            'fill-color': 'rgba(255, 179, 27, 1)',
            'fill-opacity': 0.8,
          },
        });
      });

      map.on('move', () => {
        if (idDragging) {
          return;
        }
        const bounds = (sourceBounds = map.getBounds());

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const source = minimap.getSource('bounds') as maplibregl.GeoJSONSource;
        source?.setData(getPolygon(bounds));
      });
      minimap.on('mouseenter', 'bounds', () => {
        minimapCanvas.style.cursor = 'move';
      });
      minimap.on('mouseleave', 'bounds', function () {
        minimapCanvas.style.cursor = '';
      });
      minimap.on('mousemove', (e) => {
        if (idDragging) {
          cachePoint = currentPoint;
          currentPoint = e.lngLat.toArray();
          const length = e.lngLat.distanceTo(new maplibregl.LngLat(cachePoint[0], cachePoint[1]));

          const angel = rhumbBearing(point(cachePoint), point(currentPoint));

          const polygon_ = getPolygon(sourceBounds);

          const polygon = transformTranslate(polygon_, length / 1000, Math.floor(angel));

          const center = centerOfMass(polygon_);

          const newBounds = new maplibregl.LngLatBounds(
            polygon.geometry.coordinates[0][0],
            polygon.geometry.coordinates[0][2]
          );
          sourceBounds = newBounds;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          minimap.getSource('bounds')?.setData(polygon);
          map.setCenter(center.geometry.coordinates as LngLatLike, { duration: 80 });
        }
      });
      minimap.on('mousedown', 'bounds', (e) => {
        idDragging = true;
        cachePoint = currentPoint;
        currentPoint = e.lngLat.toArray();
      });

      minimap.on('mouseup', () => {
        idDragging = false;
      });

      return minimap;
    }
  };
  // const reset = () => {
  //   if (mapRef.current) {
  //     const { pitch, center, zoom } = mapOps;
  //     mapRef.current.flyTo({
  //       pitch,
  //       bearing,
  //       center,
  //       zoom,
  //     });
  //   }
  // };

  const roMap = () => {
    if (mapRef.current) {
      const bearing = mapRef.current.getBearing();
      const newB = bearing + 90;
      mapRef.current.setBearing(newB > 360 ? newB - 360 : newB);
    }
  };

  const resetMap = () => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: newOps.current.center,
        zoom: newOps.current.zoom,
        bearing: newOps.current.bearing,
      });
    }
  };

  return (
    <Box h="full" position="relative" w={'full'}>
      <Box ref={mapDom} position={'absolute'} top={0} left={0} w="full" h="full" zIndex={1}></Box>
      {/* {disableWeatherButton && (
        <WeatherSetButton
          top="1.5%"
          right="1.1%"
          isRain={isRain}
          isSnow={isSnow}
          isWind={isWind}
          changRain={(isRain) => {
            setIsRain(!isRain);
            if (!isRain) {
              customLayer.current?.addRain();
            } else {
              customLayer.current?.removeRain();
            }
          }}
          changSnow={(isSnow) => {
            setIsSnow(!isSnow);
            if (!isSnow) {
              customLayer.current?.addSnow();
            } else {
              customLayer.current?.removeSnow();
            }
          }}
          changWind={(isWind) => {
            setIsWind(!isWind);
            if (!isWind) {
              customLayer.current?.addWind();
            } else {
              customLayer.current?.removeWind();
            }
          }}
        />
      )} */}

      {!disableMiniMap && (
        <Box
          position={'absolute'}
          bottom={9}
          right="6"
          px="3"
          borderRadius="5px"
          py="3"
          bgColor="rgba(0, 0, 0, 0.1)"
          backdropFilter="blur(20px)"
          // border="1px"
          // borderColor="pri.blue.100"
          zIndex={2}
        >
          <Box ref={minimapDom} w="42" h="22"></Box>
        </Box>
      )}
      {!disableViewTools && (
        <Stack position="absolute" right={9} bottom={'160px'}>
          <Flex
            boxShadow="0px 3px 6px 1px rgba(0,0,0,0.16)"
            borderRadius="10px"
            justifyContent="center"
            align="center"
            w="10"
            h="10"
            zIndex={2}
            bg={isDark ? 'emgc.blue.400' : 'pri.white.100'}
            cursor="pointer"
            onClick={roMap}
          >
            <MapRotateIcon transform="rotateY(180deg)" fill={isDark ? 'pri.white.100' : ''} />
          </Flex>

          <Flex
            boxShadow="0px 3px 6px 1px rgba(0,0,0,0.16)"
            borderRadius="10px"
            justifyContent="center"
            align="center"
            w="10"
            h="10"
            zIndex={2}
            bg={isDark ? 'emgc.blue.400' : 'pri.white.100'}
            cursor="pointer"
            onClick={resetMap}
          >
            <AiOutlineCompress fill={isDark ? '#fff' : ''} />
          </Flex>
        </Stack>
        // <Box position={'absolute'} bottom={6} right={9} zIndex={2} w="16" h="35" cursor="pointer">
        //   {/* <Box
        //     position="relative"
        //     w="full"
        //     h="full"
        //     onClick={() => {
        //       if (mapRef.current) {
        //         const b = mapRef.current.getBearing();
        //         mapRef.current.setBearing(b === 0 ? bearing : 0);
        //       }
        //     }}
        //   >
        //     <Box position="absolute" zIndex={1} w="70px" h="70px" top="0" left="0">
        //       <Image src={compass} alt="罗盘" />
        //     </Box>
        //     <Box ref={compassDom} position="absolute" zIndex={2} top="16px" left="30px">
        //       <Box
        //         borderTop="5px solid"
        //         borderLeft="5px solid"
        //         borderBottom="13px solid"
        //         borderRight="5px solid"
        //         borderColor="transparent"
        //         borderBottomColor="pri.blue.100"
        //         // backgroundColor="blue.200"
        //       ></Box>
        //       <Box
        //         borderTop="13px solid"
        //         borderLeft="5px solid"
        //         borderBottom="5px solid"
        //         borderRight="5px solid"
        //         borderColor="transparent"
        //         borderTopColor="#fff"
        //         filter="drop-shadow(2px 2px 3px rgba(0,0,0,0.2))"
        //       ></Box>
        //     </Box>
        //   </Box> */}
        //   {/* <Flex
        //     position="absolute"
        //     top="-18"
        //     left="4"
        //     boxShadow="0px 3px 6px 1px rgba(0,0,0,0.16)"
        //     borderRadius="5px"
        //     justifyContent="center"
        //     p="2"
        //     w="10"
        //     h="10"
        //     backgroundColor="backs.200"
        //   >
        //     <Image
        //       src={fullscreen}
        //       alt="全屏"
        //       onClick={() => {
        //         if (mapRef.current) {
        //           const vis = mapRef.current.getLayoutProperty('tdI', 'visibility');
        //           mapRef.current.setLayoutProperty('tdI', 'visibility', vis === 'none' ? 'visible' : 'none');
        //           mapRef.current.setLayoutProperty('tdText', 'visibility', vis === 'none' ? 'visible' : 'none');
        //         }
        //       }}
        //     />
        //   </Flex> */}
        //   <Flex
        //     position="absolute"
        //     top="18"
        //     left="4"
        //     boxShadow="0px 3px 6px 1px rgba(0,0,0,0.16)"
        //     borderRadius="5px"
        //     justifyContent="center"
        //     w="10"
        //     h="10"
        //   >
        //     <MapRotateIcon onClick={reset} />
        //   </Flex>

        //   <Flex
        //     position="absolute"
        //     top="18"
        //     left="4"
        //     boxShadow="0px 3px 6px 1px rgba(0,0,0,0.16)"
        //     borderRadius="5px"
        //     justifyContent="center"
        //     w="10"
        //     h="10"
        //     backgroundColor="backs.200"
        //   >
        //     <Image src={fullscreen} alt="全屏" onClick={reset} />
        //   </Flex>
        // </Box>
      )}
    </Box>
  );
};

export default Map;
