import { isSpaceQueryingModel, MapContext } from '@/models/map';
import {
  Box,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  Text,
  useOutsideClick,
  Tooltip,
  Center,
} from '@chakra-ui/react';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import nodata from '@/assets/montior/nodata.png';

import { SearchIcon } from '../Icons';
import Pagination from '../Pagination';
import { featureCollection } from '@turf/turf';
import { request } from '@/utils/request';
import { useMemoizedFn, useUnmount } from 'ahooks';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  currentResModel,
  IResourcePage,
  searchHoverResIdModel,
  searchParamModel,
  searchResModel,
  clearMapSearchModel,
  emgcCommandFooterActiveModel,
} from '@/models/resource';
import { CloseIcon } from '@chakra-ui/icons';
import popup from '@/assets/map/popup.svg';
import popup_h from '@/assets/map/popup_h.svg';
import RecordAnimatedComponent from '@/components/RecordAnimatedComponent';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl'
import { genSearchResIcons } from '@/utils/mapUtils';

const getHistory = () => {
  const arraystr = localStorage.getItem('searchHistory');
  const array = arraystr ? (JSON.parse(arraystr) as string[]) : [];
  return array;
};

const setHistory_ = (str: string) => {
  if (str) {
    const history = getHistory();
    if (history.length === 0) {
      history.unshift(str);
    }
    if (history.length > 0) {
      // 去重
      if (!history.includes(str)) {
        history.unshift(str);

        if (history.length >= 6) {
          history.pop();
        }
      }
    }
    localStorage.setItem('searchHistory', JSON.stringify(history));
  }
};
const resetHistory_ = () => {
  localStorage.setItem('searchHistory', JSON.stringify([]));
};

interface IProps {
  theme?: 'deep' | 'shallow';
}
const Search = ({ theme = 'shallow' }: IProps) => {
  // 查周边矩形
  const spaceQuerySquare = useRecoilValue(isSpaceQueryingModel);
  const map = useContext(MapContext);
  const setCurrentRes = useSetRecoilState(currentResModel);
  const emgcCommandFooterActive = useRecoilValue(emgcCommandFooterActiveModel);
  const clearMapSearch = useRecoilValue(clearMapSearchModel);

  const [searchParam, setSearchParam] = useRecoilState(searchParamModel);

  const [searchHoverResId, setSearchHoverResId] = useRecoilState(searchHoverResIdModel);
  const [showType, setShowType] = useState<'history' | 'serchRes' | ''>('');
  const searchRef = useRef<HTMLInputElement | null>(null);
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>(getHistory());

  const [keyWords, setkeyWords] = useState('');
  const [pageState, setPageState] = useState({
    current: 1,
    pages: 1,
    size: 10,
    total: 10,
    seatchText: '',
  });
  const [searchRes, setSearchRes] = useRecoilState(searchResModel);
  const [showRecord, setShowRecord] = useState(false);
  const [recordText, setRecordText] = useState('请开始说话');
  useUnmount(() => {
    setShowType('');
    setInputVal('');
  });
  useOutsideClick({
    ref: searchRef,
    handler: () => {
      if (searchRes.length === 0 || showType === 'history') {
        setShowType('');
      }
    },
  });

  // 监听搜索参数，执行搜索（地图查周边，最终也会在这里执行）
  useEffect(() => {
    const pa = JSON.parse(searchParam);
    if (!pa.pageIndex) {
      return;
    }
    const url = spaceQuerySquare
      ? '/cx-alarm/resource/page-resource-polygon'
      : `/cx-alarm/resource/page-resource-search?searchText=${pa.searchText}&pageIndex=${pa.pageIndex}&pageSize=${pa.pageSize}`;

    request<IResourcePage>({
      url,
      options: spaceQuerySquare ? { method: 'post', body: searchParam } : undefined,
    }).then((res) => {
      if (res.code === 200) {
        setShowType('serchRes');
        const { current, total, size, pages } = res.data;

        setPageState({
          ...pageState,
          current,
          pages,
          size,
          total,
        });
        const searchDatas = [...res.data.records];
        if (map) {
          const source = map.getSource('serachRes') as maplibregl.GeoJSONSource;
          if (source) {
            source.setData(genSearchResIcons(searchDatas));
          }
        }
        setSearchRes(searchDatas);
      }
    });
  }, [searchParam]);

  const updateHistory = (str: string) => {
    setHistory_(str);
    setHistory(getHistory());
  };
  const resetHistory = () => {
    resetHistory_();
    setHistory(getHistory());
  };

  // 执行查询，调整为修改搜索参数
  const doQuery = useMemoizedFn(async (searchText: string, pageSize: number, pageIndex: number) => {
    setkeyWords(searchText);
    setSearchParam(JSON.stringify({ pageIndex, pageSize, searchText }));
  });

  //关闭框选和圈选时清空搜索列表
  useEffect(() => {
    if (clearMapSearch) {
      empty();
      setShowType('');
    }
  }, [clearMapSearch]);

  const empty = () => {
    setInputVal('');
    setSearchRes([]);
    setShowType('history');
    setSearchParam(JSON.stringify({}));
    setPageState({
      ...pageState,
      current: 1,
    });

    if (map) {
      const source = map.getSource('serachRes') as maplibregl.GeoJSONSource;
      if (source) {
        source.setData(featureCollection([]) as unknown as GeoJSON.GeoJSON);
      }
    }
  };

  // 语音识别结束，展示识别结果，并执行查询
  const [showAn, setShowAn] = useState(true);
  const dealRecord = useCallback(
    (text: string) => {
      let newText: string = text;
      if (text.indexOf(',')) {
        newText = text.substring(0, text.length - 1);
      }
      setRecordText(newText);
      setTimeout(() => {
        setShowRecord(false);
        setInputVal(newText);
        updateHistory(newText);
        doQuery(newText, pageState.size, pageState.current);
        setRecordText('请开始说话');
      }, 3 * 100);
    },
    [pageState]
  );
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

  const search = useMemoizedFn(() => {
    setPageState({
      ...pageState,
      current: 1,
    });
    updateHistory(inputVal);
    doQuery(inputVal, pageState.size, pageState.current);
  });
  const formatMessage = useTranslations("base");

  const onMouseEnter = useMemoizedFn((resourceNo: string) => {
    setSearchHoverResId(resourceNo);
    const copyData = JSON.parse(JSON.stringify(searchRes));
    const data = genSearchResIcons(copyData, resourceNo);
    const source = map?.getSource('serachRes') as maplibregl.GeoJSONSource;
    if (source) {
      source.setData(data);
    }
  });

  const onMouseLeave = useMemoizedFn(() => {
    onMouseEnter('');
  });

  /* 开启圈选和框选的时候禁用 应急指挥页面打开查周边的时候禁用*/
  const disabledInput = useMemo(() => {
    if (emgcCommandFooterActive) {
      return true;
    } else if (spaceQuerySquare) {
      return true;
    } else {
      return false;
    }
  }, [spaceQuerySquare, emgcCommandFooterActive]);

  return (
    <>
      <VStack w="80" ref={searchRef}>
        <InputGroup>
          <Input
            disabled={disabledInput}
            _disabled={{ opacity: 1 }}
            cursor={disabledInput ? 'not-allowed' : 'pointer'}
            boxShadow={theme === 'deep' ? '' : '0px 3px 6px 1px rgba(0,0,0,0.16)'}
            //bg="pri.white.100"
            bg={theme === 'deep' ? 'emgc.blue.800' : 'pri.white.100'}
            borderRadius={theme === 'deep' ? '0' : '10px'}
            onFocus={() => {
              if (searchRes.length === 0) {
                setShowType('history');
              }
            }}
            value={inputVal}
            onChange={(e) => {
              setInputVal(e.target.value);
            }}
            placeholder={formatMessage({ id: 'searchPlaceHoder' })}
            h="10"
            pr="20"
            maxLength={50}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                search();
              }
            }}
            _placeholder={{ color: theme === 'deep' ? 'emgc.white.100' : '' }}
            color={theme === 'deep' ? 'emgc.white.100' : ''}
            borderWidth={0}
          />

          {!disabledInput ? (
            <InputRightElement>
              {process.env.NEXT_PUBLIC_ANALYTICS_Ms_type !== 'yb' && (
                <Box
                  position="absolute"
                  right="10"
                  borderRightWidth="1px"
                  borderRightColor="pri.dark.500"
                  h="6"
                  my="1"
                ></Box>
              )}

              {searchRes.length > 0 || inputVal.length > 0 ? (
                <>
                  <CloseIcon
                    position="absolute"
                    _hover={{ color: 'pri.blue.100' }}
                    top="50%"
                    transform="translateY(-50%)"
                    w="3"
                    h="3"
                    right="13"
                    cursor="pointer"
                    onClick={empty}
                    color={theme === 'deep' ? 'emgc.white.100' : 'pri.dark.200'}
                  />
                </>
              ) : null}
              {/* {process.env.NEXT_PUBLIC_ANALYTICS_Ms_type === 'cx' && (
              <MicrophoneIconS
                position="absolute"
                _hover={{ fill: 'pri.blue.100' }}
                top="50%"
                transform="translateY(-50%)"
                w="5"
                h="5"
                right="9"
                cursor="pointer"
                onClick={() => {
                  setShowRecord(true);
                  startRecording(dealRecord, handleRecordSucess, handleRecordError, setRecordText);
                }}
                color={theme === 'deep' ? 'emgc.white.100' : 'pri.dark.200'}
              />
            )} */}
              <SearchIcon
                position="absolute"
                top="50%"
                transform="translateY(-50%)"
                right="3"
                cursor="pointer"
                _hover={{ fill: 'pri.blue.100' }}
                onClick={search}
                color={theme === 'deep' ? 'emgc.white.100' : 'pri.dark.200'}
              />
            </InputRightElement>
          ) : null}
        </InputGroup>

        {showType === 'history' ? (
          history.length > 0 ? (
            <Flex
              px="4"
              py="3"
              flexDir="column"
              boxShadow="0px 2px 6px 1px rgba(119,140,162,0.1);"
              justify="space-between"
              borderRadius={theme === 'deep' ? '0' : '20px'}
              w="full"
              bg={theme === 'deep' ? 'emgc.blue.800' : 'pri.white.100'}
              color={theme === 'deep' ? 'emgc.white.100' : 'pri.dark.200'}
            >
              <Box fontSize="lg" mb="3" fontWeight={500}>
                {formatMessage({ id: 'searchHistory' })}
              </Box>
              <Box maxH="500px" overflowY="auto" layerStyle="scrollbarStyle">
                {history.map((item, index) => {
                  return (
                    <HStack
                      onClick={() => {
                        setPageState({
                          ...pageState,
                          current: 1,
                        });
                        doQuery(item, pageState.size, pageState.current);
                        setInputVal(item);
                      }}
                      mb="3"
                      key={item + index}
                      _hover={{ fill: 'pri.blue.100', color: 'pri.blue.100' }}
                      cursor="pointer"
                    >
                      <SearchIcon />
                      <Tooltip label={item}>
                        <Box whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden">
                          {item}
                        </Box>
                      </Tooltip>
                    </HStack>
                  );
                })}
              </Box>

              <Flex
                justify="flex-end"
                _hover={{ color: 'pri.blue.100' }}
                cursor="pointer"
                onClick={resetHistory}
              >
                {formatMessage({ id: 'clearSearch' })}
              </Flex>
            </Flex>
          ) : (
            <Flex
              flexDir="column"
              justify="center"
              align="center"
              h="50"
              boxShadow="0px 2px 6px 1px rgba(119,140,162,0.1);"
              borderRadius={theme === 'deep' ? '0' : '10px'}
              w="full"
              bg={theme === 'deep' ? 'emgc.blue.800' : 'pri.white.100'}
              color={theme === 'deep' ? 'emgc.white.100' : 'pri.dark.200'}
            >
              <Image width={154} height={124} src={nodata} alt="noSearchData" />
              <Box fontSize="14px">暂无搜索记录</Box>
            </Flex>
          )
        ) : null}
        {showType === 'serchRes' ? (
          <Flex
            flexDir="column"
            py="3"
            justify="space-between"
            boxShadow="0px 2px 6px 1px rgba(119,140,162,0.1);"
            borderRadius={theme === 'deep' ? '0' : '10px'}
            w="full"
            bg={theme === 'deep' ? 'emgc.blue.800' : 'pri.white.100'}
            color={theme === 'deep' ? 'emgc.white.100' : 'pri.dark.200'}
          >
            <Box
              onMouseLeave={() => {
                setSearchHoverResId('');
              }}
            >
              {searchRes.length > 0 ? (
                searchRes.map((item, index) => {
                  const newName = item.resourceName + item.equipmentId;
                  return (
                    <Flex
                      key={item.resourceNo}
                      px="3"
                      _hover={{ bg: 'pri.blue.400', color: 'pri.blue.100' }}
                      cursor="pointer"
                      onClick={() => setCurrentRes({ ...item })}
                      onMouseEnter={() => onMouseEnter(item.resourceNo)}
                      onMouseLeave={onMouseLeave}
                      mb="2"
                    >
                      <Center position="relative">
                        <Image
                          width={18}
                          height={28}
                          src={searchHoverResId === item.resourceNo ? popup_h : popup}
                          alt=""
                        />
                        <Box
                          fontSize="12px"
                          color="pri.white.100"
                          position="absolute"
                          top="40%"
                          left="50%"
                          transform="translate(-50%, -50%)"
                        >
                          {index + 1}
                        </Box>
                      </Center>
                      <Box ml="2">
                        <Flex flex={1} w="65" title={newName} whiteSpace="nowrap">
                          <Text>{newName.substring(0, newName.indexOf(keyWords))}</Text>
                          <Text color="pri.blue.100">
                            {newName.substring(
                              newName.indexOf(keyWords),
                              newName.indexOf(keyWords) + keyWords.length
                            )}
                          </Text>
                          <Text overflow="hidden" textOverflow="ellipsis">
                            {newName.substring(newName.indexOf(keyWords) + keyWords.length)}
                          </Text>
                        </Flex>
                        <Box color="pri.blue.100" fontSize="13px">
                          {item.address}
                        </Box>
                      </Box>
                    </Flex>
                  );
                })
              ) : (
                <Flex
                  flexDir="column"
                  justify="center"
                  align="center"
                  h="50"
                  borderRadius="10px"
                  w="full"
                  backgroundColor={theme === 'deep' ? '' : 'pri.white.100'}
                >
                  <Image width={154} height={124} src={nodata} alt="noSearchData" />
                  <Box fontSize="14px" color={theme === 'deep' ? 'pri.white.100' : 'font.300'}>
                    暂无搜索结果
                  </Box>
                </Flex>
              )}
            </Box>

            <Flex
              py="3"
              w="full"
              borderTop="1px"
              borderColor="border.200"
              alignItems="center"
              justifyContent="center"
            >
              {searchRes.length > 0 && (
                <Pagination
                  current={pageState.current}
                  size="smal"
                  total={pageState.total}
                  paginationProps={{
                    display: 'flex',
                  }}
                  baseStyles={{
                    borderRadius: `${theme === 'deep' ? '0' : '2px'}`,
                    border: `${theme === 'deep' ? 'none' : '1px solid #1080FF'}`,
                  }}
                  onChange={(current, pages, size, total) => {
                    if (current) {
                      pageState.current = current;
                      setPageState({
                        ...pageState,
                      });
                      const pa = JSON.parse(searchParam);
                      pa.pageIndex = current;
                      setSearchParam(JSON.stringify(pa));
                    }
                  }}
                  pageSize={pageState.size}
                />
              )}
            </Flex>
          </Flex>
        ) : null}
      </VStack>
      {showRecord &&
        createPortal(
          <RecordAnimatedComponent
            recordText={recordText}
            showAn={showAn}
            setShowRecord={setShowRecord}
          />,
          document.body
        )}
    </>
  );
};

export default Search;
