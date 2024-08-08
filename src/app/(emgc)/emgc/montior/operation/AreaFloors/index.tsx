import { alarmListModel, IAlarm } from '@/models/alarm';
import { currentAreaFloorsModel, IAreaFloorCounts } from '@/models/map';
import { IResItem, resAreaCountModel } from '@/models/resource';
import { Box, Flex, HStack } from '@chakra-ui/react';
import { useMount, useUnmount } from 'ahooks';
import React, { useRef } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

const cloneArray: <T>(array: T[]) => T[] = (array) => {
  const cache = [];
  for (const item of array) {
    cache.push({ ...item, isChecked: false });
  }

  return cache;
};
// 获取报警统计
const getAlarmCount = (alarmList: IAlarm[], areaId: string, floor: string) => {
  return alarmList.filter((val) => val.alarmAreaId === areaId && val.floorLevel === floor).length;
};
// 获取资源统计
const getResCount = (searchRes: IResItem[], areaId: string, floor: string) => {
  return searchRes.filter((val) => val.areaId === areaId && val.floorLevel === floor).length;
};

const AreaFloors = ({ map }: { map: maplibregl.Map }) => {
  const alarmList = useRecoilValue(alarmListModel);
  const [currentAreaFloors, setCurrentAreaFloors] = useRecoilState(currentAreaFloorsModel);
  const resAreaCount = useRecoilValue(resAreaCountModel);

  const domRef = useRef(null);

  useUnmount(() => {
    resetFloor();
  });

  useMount(() => {
    const hideAreas = changeLayerShow(
      currentAreaFloors.find((val) => val.isChecked)!.floorLevel,
      currentAreaFloors
    );
    changeAlarmAndResIcon(hideAreas);
  });

  const resetFloor = () => {
    if (map) {
      changeLayerShow('1', currentAreaFloors);

      changeAlarmAndResIcon([]);
    }
  };
  // 遍历区域的图层，显示选中的图层，隐藏未选中的图层
  const changeLayerShow = (level: string, currentAreaFloors: IAreaFloorCounts[]) => {
    const hideAreas: string[] = [];

    if (map) {
      for (const floor of currentAreaFloors) {
        if (!floor.mapLayer) {
          break;
        }
        const layerids = floor.mapLayer.split(',');
        const visible = level === floor.floorLevel ? 'visible' : 'none';
        if (level !== floor.floorLevel) {
          hideAreas.push(floor.areaId);
        }
        if (layerids.length > 0) {
          for (const layerid of layerids) {
            map.setLayoutProperty?.(layerid, 'visibility', visible);
          }
        }
      }
    }
    return hideAreas;
  };

  // 筛选报警与资源

  const changeAlarmAndResIcon = async (hideAreas: string[]) => {
    if (map) {
      map.setFilter('alarmIcon', ['!in', 'alarmAreaId', ...hideAreas]);
      // map.setFilter('alarmIcon1', ['!in', 'alarmAreaId', ...hideAreas]);
      map.setFilter('animateCircle', ['!in', 'alarmAreaId', ...hideAreas]);

      // reslayer图层只有一个，所以采用setFilter方式
      map.setFilter('reslayer', ['!in', 'area_id', ...hideAreas]);
    }
  };

  return (
    <HStack color="pri.dark.100" bg="pri.white.100" borderRadius="10px" px="2" ref={domRef}>
      {currentAreaFloors.map((item, index) => {
        return (
          <Box
            py="2"
            cursor="pointer"
            borderBottomWidth="1px"
            borderBottomStyle="dashed"
            borderBottomColor="pri.gray.700"
            onClick={() => {
              if (item.isChecked) {
                return;
              }

              const hideAreas = changeLayerShow(item.floorLevel, currentAreaFloors);
              changeAlarmAndResIcon(hideAreas);
              const cacheData = cloneArray(currentAreaFloors);
              cacheData[index].isChecked = !cacheData[index].isChecked;
              setCurrentAreaFloors(cacheData);
            }}
            key={item.floorLevel}
            _hover={{ color: 'pri.blue.100' }}
            color={item.isChecked ? 'pri.blue.100' : ''}
          >
            <Box fontSize="18px" fontWeight="bold">
              {item.areaName}
            </Box>
            <Flex align="center" justify="space-between">
              <Box>报警({getAlarmCount(alarmList, item.areaId, item.floorLevel)})</Box>
              <Box>资源({resAreaCount[item.areaId] || 0})</Box>
            </Flex>
          </Box>
        );
      })}
    </HStack>
  );
};

export default AreaFloors;
