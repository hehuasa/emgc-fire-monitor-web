'use client';
import React, { useRef } from 'react';
import dynamic from 'next/dynamic';

import { Text, useToast, Box } from '@chakra-ui/react';
import { downFileByUrl } from '@/utils/util';
import { useMemoizedFn, useSafeState, useUnmount } from 'ahooks';
import { createContext, useContext } from 'react';
import { CurdAdaptor, DeleteRequestAdaptor } from '@/components/AmisAdaptor';

const Customcontext = createContext({
  playing: '',
  setPlaying: (data: string) => {
    //
  },
});

const TextName = (props: any) => {
  const oldFilePath = props?.data?.url;
  const path = new URL(oldFilePath);
  const filePath = '/minio' + path.pathname;

  const toast = useToast();
  const down = useMemoizedFn(() => {
    downFileByUrl(filePath, props.data.realFileName).catch(() =>
      toast({
        title: '下载失败',
        status: 'error',
        position: 'top',
        duration: 2000,
        isClosable: true,
      })
    );
  });
  if (filePath) {
    return (
      <td>
        <Text onClick={down} cursor="pointer" color="pri.blue.100">
          {props?.data?.realFileName}
        </Text>
      </td>
    );
  }

  return <td></td>;
};

const PlayVoice = (props: any) => {
  console.log('ppp', props.data);
  const { playing, setPlaying } = useContext(Customcontext);
  const audioRef = useRef<null | HTMLAudioElement>(null);

  const oldUrl = props.data.url;
  const path = new URL(oldUrl);
  const newUrl = '/minio' + path.pathname;

  const play = useMemoizedFn(() => {
    audioRef.current = document.getElementById('systemAudio') as HTMLAudioElement;

    if (audioRef.current) {
      if (playing === newUrl) {
        audioRef.current?.pause();
        setPlaying('');
      } else {
        audioRef.current.src = newUrl;
        audioRef.current.muted = false;
        audioRef.current.play();
        setPlaying(newUrl);
      }
    }
  });
  useUnmount(() => {
    audioRef.current?.pause();
    if (audioRef.current && audioRef.current.src) {
      audioRef.current.muted = true;
    }
  });
  return (
    <td>
      <Text onClick={play} cursor="pointer" color="pri.blue.100">
        {playing === newUrl ? '暂停' : '播放'}
      </Text>
    </td>
  );
};

const AimsRender = dynamic(() => import('@/components/AimsRender'), { ssr: false });

const data = {
  type: 'page',
  title: '',
  data: {},
  aside: [],
  toolbar: [],
  body: [
    {
      type: 'crud',
      name: 'crud',
      syncLocation: false,
      api: {
        method: 'get',
        url: '/cx-alarm/alm/broadcast-voice/list',
        //url: '/systemsManage/broadcastVoice/api/getVoiceList',
        messages: {},
        dataType: 'form',

        replaceData: true,
      },
      columns: [
        {
          name: 'voiceName',
          label: '语音文件名称',
          type: 'text',
        },
        {
          name: 'url',
          label: '文件名称',
          component: TextName,
        },
        {
          name: 'play',
          label: '播放',
          component: PlayVoice,
        },

        {
          type: 'operation',
          label: '操作',
          buttons: [
            {
              label: '修改',
              type: 'button',
              actionType: 'dialog',
              id: 'u:4cf9dae5d4ce',
              level: 'enhance',
              dialog: {
                type: 'dialog',
                title: '修改语音文件',
                size: 'md',
                body: [
                  {
                    type: 'my-broadcastVoice-add',
                    name: 'broadcastVoiceValue',

                    edit: true,
                  },
                ],
                showCloseButton: true,
                showErrorMsg: false,
                showLoading: false,
                id: 'u:f513da49400e',
                closeOnEsc: true,
                dataMapSwitch: false,
                actions: [],
              },
            },
            {
              type: 'button',
              label: '删除',
              level: 'danger',
              api: {
                url: '/cx-alarm/alm/broadcast-voice/delete/${id}',
                method: 'POST',
                dataType: 'form',
                adaptor: CurdAdaptor,
                messages: {
                  success: '删除成功',
                },
                requestAdaptor: DeleteRequestAdaptor,
              },
              actionType: 'ajax',
              confirmText: '确定要删除？',
            },
          ],
          id: 'u:2bb7edd0b563',
        },
      ],
      bulkActions: [],
      itemActions: [],
      features: ['create', 'filter', 'update', 'delete'],
      filterColumnCount: 3,

      id: 'u:c8b1fa56558e',
      perPageField: 'size',
      pageField: 'current',
      defaultParams: {
        current: 1,
        size: 10,
      },
      headerToolbar: {
        type: 'button',
        actionType: 'dialog',
        label: '新增',
        icon: 'fa fa-plus pull-left',
        primary: true,
        dialog: {
          type: 'dialog',
          title: '新增语音文件',
          size: 'md',
          body: [
            {
              type: 'my-broadcastVoice-add',
              name: 'broadcastVoiceValue',

              edit: false,
            },
          ],
          showCloseButton: true,
          showErrorMsg: false,
          showLoading: false,
          id: 'u:f513da49400e',
          closeOnEsc: true,
          dataMapSwitch: false,
          actions: [],
        },
      },
      alwaysShowPagination: true,
      autoFillHeight: true,
      footerToolbar: [],
    },
  ],
  id: 'u:7951bf1a715e',
  asideResizor: false,
  pullRefresh: {
    disabled: true,
  },
};

const Area = () => {
  const [playing, setPlaying] = useSafeState('');
  return (
    <Customcontext.Provider value={{ playing, setPlaying }}>
      <Box h={'full'}>
        <AimsRender jsonView={data} />
      </Box>
    </Customcontext.Provider>
  );
};

export default Area;
