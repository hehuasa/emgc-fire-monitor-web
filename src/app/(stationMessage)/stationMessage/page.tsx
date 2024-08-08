'use client';

import { Box, Tab, TabList, TabPanel, TabPanels, Tabs, useToast } from '@chakra-ui/react';
import { useMemoizedFn, useMount } from 'ahooks';
import { useState } from 'react';

import MessageItem, { pageStateType } from '@/components/stationMessage';
import { notReadNumberModel } from '@/models/global';
import { messageItemType } from '@/models/stationMessage';
import { IPageData } from '@/utils/publicData';
import { request } from '@/utils/request';
import { useRecoilState } from 'recoil';

const MessageList = () => {
  const toast = useToast();
  const [messagesList, setMessagesList] = useState<messageItemType[]>([]);
  const [notReadNumber, setNotReadNumber] = useRecoilState(notReadNumberModel);
  const [pageState, setPageState] = useState<pageStateType>({
    currentPage: 1,
    pageSize: 10,
    total: 0,
  });

  useMount(() => {
    getData();
    getUnRead();
  });
  const getData = useMemoizedFn(async (type?: boolean) => {
    const params = {
      pageBean: {
        currentPage: pageState.currentPage,
        pageSize: pageState.pageSize,
      },
    };
    if (typeof type === 'boolean') {
      Object.assign(params, {
        haveRead: type,
      });
    }
    const { code, data } = await request<IPageData<messageItemType>>({
      url: `/ms-system/sys/message/query_page_message`,
      options: {
        method: 'post',
        body: JSON.stringify(params),
      },
    });
    if (code == 200) {
      const { records, total, current, size } = data;
      setMessagesList(records);
      setPageState({ total, currentPage: current, pageSize: size });
    }
  });

  const setAllRead = useMemoizedFn(async () => {
    await request({
      url: `/ms-system/sys/message/all_set_read`,
    });
    getData();
    getUnRead();
    setNotReadNumber(0);
  });

  const setItemRead = useMemoizedFn(async (id: string) => {
    await request({
      url: `/ms-system/sys/message/set_read`,
      options: {
        method: 'post',
        body: JSON.stringify([id]),
      },
    });
    getData();
    getUnRead();
  });

  const deleteItem = useMemoizedFn(async (id: string) => {
    const { code } = await request({
      url: `/ms-system/sys/message/dustbin_message`,
      options: {
        method: 'post',
        body: JSON.stringify([id]),
      },
    });
    if (code === 200) {
      toast({
        title: '删除成功',
        status: 'success',
        position: 'top',
        duration: 1000,
      });
    }
    getData();
  });

  const readMessage = useMemoizedFn(async (msgId: string, recId: string) => {
    setItemRead(recId);
  });

  // 获取未读消息数量
  const getUnRead = useMemoizedFn(async () => {
    const { code, data } = await request<number>({
      url: `/ms-system/sys/message/query_no_read_count`,
    });
    if (code === 200) {
      setNotReadNumber(data);
    }
  });

  return (
    <Box margin={'0 auto'} w={'1200px'} h={'full'} p={4} position={'relative'}>
      <Box
        position={'absolute'}
        top={4}
        right={4}
        color={'pri.blue.100'}
        cursor={'pointer'}
        fontSize={'12px'}
        onClick={setAllRead}
      >
        全部设为已读
      </Box>
      <Tabs variant="unstyled" size="sm" isLazy lazyBehavior="keepMounted">
        <TabList>
          <Tab
            borderWidth={'1px'}
            borderStyle={'solid'}
            borderColor={'pri.gray.100'}
            borderRadius={2}
            _selected={{ color: 'pri.blue.100', borderColor: 'pri.blue.100' }}
            onClick={() => getData()}
          >
            全部
          </Tab>
          <Tab
            borderWidth={'1px'}
            borderStyle={'solid'}
            borderColor={'pri.gray.100'}
            borderRadius={2}
            _selected={{ color: 'pri.blue.100', borderColor: 'pri.blue.100' }}
            onClick={() => getData(false)}
          >
            未读
            {notReadNumber > 0 && (
              <Box display={'inline'} pl={1} fontSize={'xx-small'}>
                {notReadNumber}
              </Box>
            )}
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <MessageItem
              messagesList={messagesList}
              pageState={pageState}
              type="all"
              getData={getData}
              setPageState={setPageState}
              handleSetRead={setItemRead}
              handleDelete={deleteItem}
              handleReadDetail={readMessage}
            />
          </TabPanel>
          <TabPanel>
            <MessageItem
              messagesList={messagesList}
              type="unRead"
              getData={getData}
              pageState={pageState}
              setPageState={setPageState}
              handleSetRead={setItemRead}
              handleDelete={deleteItem}
              handleReadDetail={readMessage}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};
export default MessageList;
