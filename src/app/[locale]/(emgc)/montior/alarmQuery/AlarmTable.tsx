'use client';
import Pagination from '@/components/Pagination';
import {
  checkedAlarmIdsModel,
  currentAlarmModel,
  dealAlarmModalVisibleModal,
  IAlarmDetail,
} from '@/models/alarm';
import { request } from '@/utils/request';
import {
  Flex,
  Highlight,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { Table, TableColumnsType } from 'antd';

import AlarmDetail from '@/components/Alarm/AlarmDetail';
import LoadingComponent from '@/components/Loading';
import { IPageData } from '@/utils/publicData';
import { useMemoizedFn, useMount, useUnmount } from 'ahooks';
import { useTranslations } from 'next-intl';
import { memo, useEffect, useRef, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import SmoothScrollbar from 'smooth-scrollbar';
import AlarmDealModal from '../operation/LeftPanel/AlarmDeal';
import TableSetting from './TableSetting';

interface IProps {
  isLoading: boolean;
  data: IPageData<IAlarmDetail>;
  getPage: (current: number, size?: number) => void;
}

//需要展示的项
const initFilterColumns: string[] = [
  'checked',
  'No',
  'alarmNo',
  'alarmTypeName',
  'resourceNo',
  'alarmLevelName',
  // 'deptName',
  // 'alarmAreaName',
  'address',
  // 'way',
  'alarmFirstTime',
  'alarmLastTime',
  'statusView',
  'dealResultView',
  'dealUserName',
  'dealTime',
  'operator',
];

// interface DataType {
//   key: React.Key;
//   alarmId: string;
//   alarmType: string;
// }

// const TableData: DataType[] = [
//   {
//     key: '1',
//     alarmId: '1111',
//     alarmType: '火灾报警',
//   },
//   {
//     key: '2',
//     alarmId: '2222',
//     alarmType: '火灾报警',
//   },
//   {
//     key: '3',
//     alarmId: '3333',
//     alarmType: '火灾报警',
//   },
//   {
//     key: '4',
//     alarmId: '4444',
//     alarmType: '火灾报警',
//   },
// ];

const AlarmTable = ({ isLoading, data, getPage }: IProps) => {
  const [filterColumns, setfilterColumns] = useState<string[]>(initFilterColumns);
  const domWarp = useRef<HTMLDivElement | null>(null);
  const scrollbar = useRef<SmoothScrollbar | null>(null);
  const [currentPageChecked, setCurrentPageChecked] = useRecoilState(checkedAlarmIdsModel);
  const [currentAlarmDetail, setCurrentAlarmDetail] = useRecoilState<IAlarmDetail | null>(
    currentAlarmModel
  );

  const setDealAlarmVisible = useSetRecoilState(dealAlarmModalVisibleModal);
  const formatMessage = useTranslations('alarm');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [columns, setColumns] = useState<TableColumnsType<IAlarmDetail>>([]);

  const showAlalrmDetail = async (id: string) => {
    const res = await request<IAlarmDetail>({ url: `/cx-alarm/alm/alarm/find/${id}` });
    if (res.code === 200) {
      setCurrentAlarmDetail(res.data);
      onOpen();

      return;
    }
  };

  useMount(() => {
    if (domWarp.current) {
      scrollbar.current = SmoothScrollbar.init(domWarp.current);
    }
  });

  useUnmount(() => {
    setCurrentAlarmDetail(null);
    setCurrentPageChecked([]);
  });

  const checkBoxOnChang = useMemoizedFn((checked: boolean, alarmId: string) => {
    let newArr = [...currentPageChecked];
    if (checked) {
      newArr.push(alarmId);
    } else {
      newArr = newArr.filter((item) => item != alarmId);
    }

    setCurrentPageChecked(newArr);
  });

  const checkBoxAllOnChang = useMemoizedFn((checked: boolean) => {
    if (checked) {
      setCurrentPageChecked(data.records.map((item) => item.alarmId));
    } else {
      setCurrentPageChecked([]);
    }
  });

  const initColumns: TableColumnsType<IAlarmDetail> = [
    {
      title: () => <div className="text-nowrap">{formatMessage('alarm-no')}</div>,
      dataIndex: 'No',
      render: (text, record, index) => <div className="text-nowrap">{index + 1}</div>,
    },
    {
      title: () => <div className="text-nowrap">{formatMessage('alarm-id')}</div>,
      dataIndex: 'alarmNo',
      render: (text) => <a>{text}</a>,
    },
    {
      title: () => <div className="text-nowrap">{formatMessage('alarm-type')}</div>,
      dataIndex: 'alarmTypeName',
      render: (text) => <div className="text-nowrap">{text}</div>,
    },
    {
      title: () => <div className="text-nowrap">{formatMessage('alarm-director-org')}</div>,
      dataIndex: 'deptName',
      render: (text) => <div className="text-nowrap">{text}</div>,
    },
    {
      title: () => <div className="text-nowrap">{formatMessage('alarm-areaName')}</div>,
      dataIndex: 'alarmAreaName',
      render: (text) => <div className="text-nowrap">{text}</div>,
    },
    {
      title: () => <div className="text-nowrap">{formatMessage('alarm-res-proNum')}</div>,
      dataIndex: 'resourceNo',
      render: (text) => <div className="text-nowrap">{text}</div>,
    },
    {
      title: () => <div className="text-nowrap">{formatMessage('alarm-level')}</div>,
      dataIndex: 'alarmLevelName',
      render: (text) => <div className="text-nowrap">{text}</div>,
    },
    {
      title: () => <div className="text-nowrap">{formatMessage('alarm-place')}</div>,
      dataIndex: 'address',
      render: (text) => <div className="text-nowrap">{text}</div>,
    },
    {
      title: () => <div className="text-nowrap">{formatMessage('alarm-way')}</div>,
      dataIndex: 'alarmWayView',
      render: (text) => <div className="text-nowrap">{text}</div>,
    },
    {
      title: () => <div className="text-nowrap">{formatMessage('alarm-startTime')}</div>,
      dataIndex: 'alarmFirstTime',
      render: (text) => <div className="text-nowrap">{text}</div>,
    },
    {
      title: () => <div className="text-nowrap">{formatMessage('alarm-endTime')}</div>,
      dataIndex: 'alarmLastTime',
      render: (text) => <div className="text-nowrap">{text}</div>,
    },
    {
      title: () => <div className="text-nowrap">{formatMessage('alarm-status')}</div>,
      dataIndex: 'statusView',
      render: (text) => <div className="text-nowrap">{text}</div>,
    },
    {
      title: () => <div className="text-nowrap">{formatMessage('alarm-deal-result')}</div>,
      dataIndex: 'dealResultView',
      render: (text) => <div className="text-nowrap">{text}</div>,
    },
    {
      title: () => <div className="text-nowrap">{formatMessage('alarm-deal-user')}</div>,
      dataIndex: 'dealUserName',
      render: (text) => <div className="text-nowrap">{text}</div>,
    },
    {
      title: () => <div className="text-nowrap">{formatMessage('alarm-deal-time')}</div>,
      dataIndex: 'dealTime',
      render: (text) => <div className="text-nowrap">{text}</div>,
    },
    {
      title: () => <div className="text-nowrap">{formatMessage('alarm-operator')}</div>,
      dataIndex: 'operator',
      render: (text) => <a>{'处理'}</a>,
    },
    {
      title: <TableSetting filterColumns={filterColumns} setfilterColumns={setfilterColumns} />,
      dataIndex: 'tool',
    },
  ];

  useEffect(() => {
    const newColumns = initColumns.filter(
      (val: any) =>
        val.dataIndex === 'tool' || (val.dataIndex && filterColumns.includes(val.dataIndex))
    );

    setColumns(newColumns);
  }, [filterColumns]);

  const dealCallBack = useMemoizedFn(() => {
    getPage(1);
  });

  useEffect(() => {
    if (currentPageChecked.length) {
      setCurrentPageChecked([]);
    }
  }, [data.records]);

  return (
    <>
      <Flex bg="pri.white.100" h="full" flexDirection="column">
        {isLoading ? (
          <LoadingComponent />
        ) : (
          <Table
            rowSelection={{
              type: 'checkbox',
              onSelect: (record, selected) => {
                checkBoxOnChang(selected, record.alarmId);
              },
              onSelectAll: (selected) => {
                checkBoxAllOnChang(selected);
              },
            }}
            columns={columns}
            dataSource={data.records}
            scroll={{ x: 1920 }}
            pagination={false}
            className="flex-1 h-900 w-full"
          />
        )}

        {data.records?.length ? (
          <Flex
            w="full"
            h="12"
            py="8"
            pr={5}
            borderTop="1px"
            borderColor="pri.gray.200"
            alignItems="center"
            justifyContent="right"
          >
            <Pagination
              defaultCurrent={data.current}
              current={data.current}
              total={data.total || 1}
              paginationProps={{
                display: 'flex',
              }}
              onChange={(current) => {
                if (current) {
                  getPage(current);
                }
              }}
              pageSize={data.size}
              pageSizeOptions={[10, 25, 50]}
              onShowSizeChange={(current, size) => {
                getPage(current!, size);
              }}
              showTotal={(total) => (
                <Text color="pri.dark.100" px="4">
                  <Highlight
                    query={String(total)}
                    styles={{ px: '1', py: '1', color: 'pri.blue.100' }}
                  >
                    {` ${total}  ${formatMessage('alarm-records')}`}
                  </Highlight>
                </Text>
              )}
              showSizeChanger
              pageNeighbours={1}
              showQuickJumper
            />
          </Flex>
        ) : null}
      </Flex>

      <Modal size={'4xl'} isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            py="0"
            textAlign="left"
            lineHeight="2.75rem"
            fontSize="lg"
            fontWeight="normal"
            bg="pri.gray.100"
            borderRadius="10px"
          >
            {formatMessage('alarm-detail')}
          </ModalHeader>
          <ModalCloseButton h="11" top="0" lineHeight="2.75rem" />
          <ModalBody color="pri.dark.100" bg="pri.white.100" py="5" borderRadius="10px">
            {currentAlarmDetail && <AlarmDetail alarmDetail={currentAlarmDetail} />}
          </ModalBody>
        </ModalContent>
      </Modal>

      <AlarmDealModal dealCallBack={dealCallBack} />
    </>
  );
};

export default memo(AlarmTable);
