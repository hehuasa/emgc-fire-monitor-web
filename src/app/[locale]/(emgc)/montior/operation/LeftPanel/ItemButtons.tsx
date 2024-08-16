import Null from '@/assets/layout/null.png';
import {
  alarmListModel,
  checkedAlarmIdsModel,
  currentAlarmModel,
  dealAlarmModalVisibleModal,
  handleAlarmModel,
  IAlarmHistory,
  IAlarmStatus,
} from '@/models/alarm';
import { currentResModel } from '@/models/resource';
import { request } from '@/utils/request';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { IHisResData } from '.';

const AlarmHistory = dynamic(() => import('@/components/Alarm/AlarmHistory'), { ssr: false });
const AddAlarm = dynamic(() => import('@/components/Alarm/AddAlarm'), { ssr: false });
export interface propType {
  showAlarmDetail: boolean;
  showResDetail: boolean;
  alarmStatus: IAlarmStatus;
  setShowAlarmCharger: (arg: boolean) => void;
}

const ItemButton = ({
  showAlarmDetail,
  showResDetail,
  alarmStatus,
  setShowAlarmCharger,
}: propType) => {
  const { formatMessage } = useIntl();

  const [addAlarmOpen, setAlarmOpen] = useRecoilState(handleAlarmModel);

  const { isOpen: hisAlarmOpen, onOpen: openHisAlarm, onClose: closeHisAlarm } = useDisclosure();

  const [checkedAlarmIds, setCheckedAlarmIds] = useRecoilState(checkedAlarmIdsModel);
  const alarmList = useRecoilValue(alarmListModel);
  const [currentAlarm, setCurrentAlarm] = useRecoilState(currentAlarmModel);
  const [currentRes, setCurrentRes] = useRecoilState(currentResModel);

  const setDealAlarmVisible = useSetRecoilState(dealAlarmModalVisibleModal);

  const isAllChecked = alarmList.length === checkedAlarmIds.length && checkedAlarmIds.length > 0;
  const isIndeterminate = alarmList.length > checkedAlarmIds.length && checkedAlarmIds.length > 0;

  useEffect(() => {
    if (currentAlarm) {
      setCurrentRes(null);
    }
  }, [currentAlarm]);
  const handleAllCheck = (isAllChecked: boolean) => {
    if (isAllChecked) {
      setCheckedAlarmIds([]);
    } else {
      const array = [];
      for (const { alarmId } of alarmList) {
        array.push(alarmId);
      }
      setCheckedAlarmIds(array);
    }
  };

  const [alarmHistoryData, setAlarmHistory] = useState<IHisResData>({
    current: 1,
    size: 10,
    records: [],
    total: 0,
  });

  const getHisData = async (devId: string, current: number, size: number) => {
    const url = `/cx-alarm/alm/alarmHistory/findPageByDevice?devId=${devId}&current=${current}&size=${size}`;
    const res = await request<{
      current: number;
      size: number;
      records: IAlarmHistory[];
      total: number;
    }>({ url });

    setAlarmHistory(res.data);
  };

  return (
    <>
      <Flex
        pl="4"
        pr="5"
        py="2.5"
        h="15"
        mt="2.5"
        justify="space-between"
        align="center"
        borderRadius="10px"
        backgroundColor="pri.gray.600"
      >
        {showAlarmDetail ? (
          <>
            {/* 处理中的报警不显示报警处理 */}
            {currentAlarm?.status !== '02' && (
              <Button
                borderRadius="50px"
                fontWeight="400"
                bg="pri.white.100"
                color="pri.dark.500"
                py="2.5"
                _hover={{
                  color: 'pri.blue.100',
                }}
                px="4.5"
                onClick={() => {
                  setDealAlarmVisible({ visible: true });
                }}
              >
                {formatMessage({ id: 'alarm.deal' })}
              </Button>
            )}

            <Button
              borderRadius="50px"
              fontWeight="400"
              bg="pri.white.100"
              color="pri.dark.500"
              py="2.5"
              _hover={{
                color: 'pri.blue.100',
              }}
              px="4.5"
              onClick={() => {
                setShowAlarmCharger(true);
              }}
            >
              {formatMessage({ id: 'alarm.director.user' })}
            </Button>
            <Button
              borderRadius="50px"
              fontWeight="400"
              bg="pri.white.100"
              color="pri.dark.500"
              py="2.5"
              _hover={{
                color: 'pri.blue.100',
              }}
              px="4.5"
              disabled={!currentAlarm!.resourceId}
              onClick={() => {
                getHisData(currentAlarm!.resourceId!, 1, 10);
                openHisAlarm();
              }}
            >
              {formatMessage({ id: 'alarm.history' })}
            </Button>
          </>
        ) : showResDetail ? (
          <>
            <Box w="25" />
            <Button
              borderRadius="50px"
              fontWeight="400"
              bg="pri.white.100"
              color="pri.dark.500"
              py="2.5"
              _hover={{
                color: 'pri.blue.100',
              }}
              px="4.5"
              onClick={() => {
                setShowAlarmCharger(true);
              }}
            >
              {formatMessage({ id: 'alarm.director.user' })}
            </Button>
            <Button
              borderRadius="50px"
              fontWeight="400"
              bg="pri.white.100"
              color="pri.dark.500"
              py="2.5"
              _hover={{
                color: 'pri.blue.100',
              }}
              px="4.5"
              onClick={() => {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
                getHisData(currentRes?.id!, 1, 10);
                openHisAlarm();
              }}
            >
              {formatMessage({ id: 'alarm.history' })}
            </Button>
          </>
        ) : (
          <>
            <Checkbox
              colorScheme="blue"
              mr="2.5"
              isChecked={isAllChecked}
              isIndeterminate={isIndeterminate}
              onChange={() => {
                handleAllCheck(isAllChecked);
              }}
              color="pri.dark.100"
            >
              {formatMessage({ id: 'selectAll' })}
            </Checkbox>
            <Box>
              {alarmStatus == '01' && (
                <Button
                  borderRadius="50px"
                  py="2.5"
                  fontWeight="400"
                  px="4.5"
                  bg="pri.white.100"
                  color={checkedAlarmIds.length === 0 ? 'pri.dark.500' : 'pri.blue.100'}
                  isDisabled={checkedAlarmIds.length === 0}
                  onClick={() => {
                    setDealAlarmVisible({ visible: true });
                  }}
                >
                  {formatMessage({ id: 'alarm.deal.muti' })}
                </Button>
              )}

              <Button
                fontWeight="400"
                borderRadius="50px"
                ml="5"
                bg="pri.white.100"
                color="pri.dark.500"
                py="2.5"
                _hover={{
                  color: 'pri.blue.100',
                }}
                px="4.5"
                onClick={() => setAlarmOpen({ visible: true })}
              >
                {formatMessage({ id: 'alarm.addAlarmByUser' })}
              </Button>
            </Box>
          </>
        )}
      </Flex>

      {/*人工报警 */}
      <Modal
        size="6xl"
        isCentered
        isOpen={addAlarmOpen.visible}
        onClose={() => setAlarmOpen({ visible: false })}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            borderRadius="10px"
            py="0"
            textAlign="left"
            lineHeight="2.75rem"
            fontSize="lg"
            bg="pri.white.100"
          >
            {formatMessage({ id: 'alarm.addAlarmByUser' })}
          </ModalHeader>
          <ModalCloseButton h="11" top="0" lineHeight="2.75rem" />
          <ModalBody bg="pri.white.100" py="0" px="0" borderRadius="10px">
            <AddAlarm />
          </ModalBody>
        </ModalContent>
      </Modal>
      {/* 历史报警 */}
      <Modal size="6xl" isCentered isOpen={hisAlarmOpen} onClose={closeHisAlarm}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            borderTopRadius="10px"
            py="0"
            textAlign="left"
            lineHeight="2.75rem"
            fontSize="lg"
            bg="pri.gray.100"
          >
            {formatMessage({ id: 'alarm.historyRecords' })}
          </ModalHeader>
          <ModalCloseButton h="11" top="0" lineHeight="2.75rem" />
          <ModalBody backgroundColor="pri.white.100" px="5" py="0" borderBottomRadius="10px">
            {!alarmHistoryData.records.length ? (
              <Box textAlign="center" width={'48'} m="auto">
                <Image src={Null} quality="100" objectFit="cover" alt="空状态" />
                <Text fontSize={'16px'} color="font.100" mb="6">
                  {formatMessage({ id: 'alarm.nodata' })}
                </Text>
              </Box>
            ) : (
              <>
                {currentAlarm && (
                  <>
                    <HStack mt="4">
                      <Box color="pri.drak.500">{formatMessage({ id: 'alarm.res.name' })} : </Box>
                      <Box color="pri.drak.100">{currentAlarm?.devName}</Box>
                    </HStack>
                    <HStack my="4">
                      <Box color="pri.drak.500">{formatMessage({ id: 'alarm.place' })} : </Box>
                      <Box color="pri.drak.100">{currentAlarm?.address}</Box>
                    </HStack>
                  </>
                )}

                {/* 报警详细的历史 */}
                {currentAlarm && (
                  <AlarmHistory
                    getHisData={getHisData}
                    devId={currentAlarm.resourceId}
                    size={alarmHistoryData.size}
                    total={alarmHistoryData.total}
                    current={alarmHistoryData.current}
                    records={alarmHistoryData.records}
                  />
                )}

                {/* 资源的历史 */}
                {currentRes && (
                  <AlarmHistory
                    getHisData={getHisData}
                    devId={currentRes.id}
                    size={alarmHistoryData.size}
                    total={alarmHistoryData.total}
                    current={alarmHistoryData.current}
                    records={alarmHistoryData.records}
                  />
                )}
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ItemButton;
