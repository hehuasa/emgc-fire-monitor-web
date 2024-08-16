import title from '@/assets/montior/title.png';
import { CloseIcon, SearchIcon } from '@/components/Icons';
import { localesModal } from '@/models/global';
import { MapContext } from '@/models/map';
import {
  checkedLayersModel,
  currentGpsInfoModel,
  currentGpsListModel,
  emgcGpsTimerModel,
  IGpsDetail,
  IGpsInfo,
  IGpsList,
} from '@/models/resource';
import { request } from '@/utils/request';
import { Box, Flex, HStack, Input } from '@chakra-ui/react';
import { featureCollection } from '@turf/turf';
import { GeoJSONSource } from 'maplibre-gl';
import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRecoilState, useRecoilValue } from 'recoil';

interface IProps {
  fold: boolean;
}

export const getGpsList = async () => {
  const { code, data } = await request<IGpsInfo[]>({
    url: '/cx-alarm/resource/findPositionLayers',
  });
  const gpsList: IGpsList[] = [];
  if (code === 200 && data) {
    for (let i = 0; i < data.length; i++) {
      gpsList.push({
        userName: data[i].userName || data[i].resourceName,
        resourceNo: data[i].resourceNo,
        department: '--',
        resourceId: data[i].id,
      });
    }
  }
  return gpsList;
};

const GpsLocationList = ({ fold }: IProps) => {
  const formatMessage = useTranslations("base");
  const locales = useRecoilValue(localesModal);

  const map = useContext(MapContext);
  const [inputVal, setInputVal] = useState('');
  const [gpsListLast, setGpsListLast] = useState<IGpsList[] | null>(null);
  const [currentGpsList, setCurrentGpsList] = useRecoilState(currentGpsListModel);
  const [currentGpsInfo, setCurrentGpsInfo] = useRecoilState(currentGpsInfoModel);
  const [checkedLayers, setCheckedLayers] = useRecoilState(checkedLayersModel);
  const [emgcGpsTimer, setEmgcGpsTimer] = useRecoilState(emgcGpsTimerModel);

  useEffect(() => {
    getGpsLocationList();
  }, [currentGpsList]);

  const handleClose = async () => {
    let ids = [...checkedLayers];
    ids = ids.filter((item) => item !== '163');
    setCheckedLayers(ids);

    const source = map?.getSource('gps') as GeoJSONSource;
    source?.setData(featureCollection([]));
    setCurrentGpsList(null);
    emgcGpsTimer && clearInterval(emgcGpsTimer);
  };

  // 获取人员定位列表
  const getGpsLocationList = async () => {
    const gpsList = await getGpsList();
    setGpsListLast(gpsList);
  };

  const search = () => {
    const newGpsList: IGpsList[] = [];
    if (inputVal !== '') {
      gpsListLast?.map((item) => {
        if (
          item.userName.indexOf(inputVal) !== -1 ||
          item.department.indexOf(inputVal) !== -1 ||
          item.resourceNo.indexOf(inputVal) !== -1
        ) {
          newGpsList.push(item);
        }
      });
      setCurrentGpsList(newGpsList);
    } else {
      setCurrentGpsList(gpsListLast);
    }
  };

  const trackClick = async (resourceId: string) => {
    const url = `/cx-alarm/resource/findPositionUserInfo?resourceId=${resourceId}`;
    const res = await request<IGpsDetail>({ url });

    if (res.code === 200) {
      const detail = { ...res.data, id: resourceId };
      setCurrentGpsInfo(detail);
    }
  };

  return (
    <Box
      position="relative"
      p="3.5"
      w="full"
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
      <Box
        pos="relative"
        w="100%"
        h="5%"
        bg="pri.white.100"
        px="4"
        py="3.5"
        borderTopRadius="10px"
        bgColor="#fff"
      >
        <HStack>
          <Image alt="title" src={title} />
          <Box fontSize="lg" fontWeight="bold" color="pri.dark.100">
            {formatMessage('personnelLocate.Title')}
          </Box>
        </HStack>
      </Box>
      <Flex
        pos="relative"
        w="100%"
        h="10%"
        justifyContent="space-around"
        alignItems="center"
        bgColor="#fff"
      >
        <Input
          cursor="pointer"
          borderRadius="10px"
          color="emgc.black.100"
          borderWidth="1px"
          placeholder={formatMessage('personnelLocate.Seach')}
          h="30px"
          w="80%"
          maxLength={50}
          // onFocus={() => {
          //   if (searchRes.length === 0) {
          //     setShowType('history');
          //   }
          // }}
          value={inputVal}
          onChange={(e) => {
            setInputVal(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              search();
            }
          }}
          _placeholder={{ color: 'emgc.black.500' }}
        />
        <SearchIcon
          cursor="pointer"
          _hover={{ fill: 'pri.blue.100' }}
          onClick={search}
          color="emgc.black.100"
        />
      </Flex>
      <Box pos="relative" w="100%" h="85%">
        <Flex
          pos="relative"
          w="100%"
          h="6%"
          bgColor="pri.blue.100"
          textAlign="center"
          justifyContent="center"
          alignItems="center"
          color="pri.white.100"
        >
          <Box w="15%">{formatMessage('personnelLocate.Index')}</Box>
          <Box w="20%">{formatMessage('personnelLocate.Name')}</Box>
          <Box w="25%">{formatMessage('personnelLocate.Card')}</Box>
          <Box w="30%">{formatMessage('personnelLocate.Department')}</Box>
          <Box w="20%">{formatMessage('personnelLocate.Track')}</Box>
        </Flex>
        <Box
          pos="relative"
          w="calc(100% + 6px)"
          h="94%"
          overflow="hidden"
          overflowY="scroll"
          css={{
            '&::-webkit-scrollbar': {
              width: '6px',
              background: '#dddddd00',
            },
            '&::-webkit-scrollbar-track': {
              width: '6px',
              background: '#dddddd00',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#c1c1c1',
            },
          }}
        >
          {currentGpsList &&
            currentGpsList.map((item, index) => (
              <Box key={index} pos="relative">
                <Flex
                  pos="relative"
                  w="100%"
                  h="40px"
                  bgColor="pri.white.100"
                  textAlign="center"
                  justifyContent="center"
                  alignItems="center"
                  borderBottomWidth="1px"
                >
                  <Box w="15%">{index + 1}</Box>
                  <Box w="20%">{item.userName}</Box>
                  <Box w="25%">{item.resourceNo}</Box>
                  <Box w="30%">{item.department}</Box>
                  <Box
                    w="20%"
                    color="#00BFBF"
                    cursor="pointer"
                    onClick={() => {
                      trackClick(item.resourceId);
                    }}
                  >
                    轨迹
                  </Box>
                </Flex>
              </Box>
            ))}
        </Box>
      </Box>
    </Box>
  );
};

export default GpsLocationList;
