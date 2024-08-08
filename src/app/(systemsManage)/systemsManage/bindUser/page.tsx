'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import { Box } from '@chakra-ui/react';
import { CurdAdaptor, DeleteRequestAdaptor } from '@/components/AmisAdaptor';

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
        method: 'post',
        url: '/cx-alarm/resource/pagePositionUser',
        messages: {},
        dataType: 'json',
        replaceData: true,
        data: {
          //'&': '$$',
          pageBean: {
            currentPage: '${currentPage}',
            pageSize: '${pageSize}',
          },
        },
      },
      columns: [
        {
          name: 'userName',
          label: '人员名称',
          type: 'text',
        },
        {
          name: 'resourceNo',
          label: '资源位号',
          type: 'text',
        },

        {
          type: 'operation',
          label: '操作',
          buttons: [
            {
              type: 'button',
              label: '解绑',
              level: 'danger',
              actionType: 'ajax',
              confirmText: '确定要解绑？',
              api: {
                url: '/cx-alarm/resource/unbindPositionUser',
                method: 'get',
                data: {
                  '&': '$$',
                },
                messages: {
                  success: '解绑成功',
                },
                adaptor: CurdAdaptor,
                requestAdaptor: DeleteRequestAdaptor,
              },
            },
          ],
          id: 'u:2bb7edd0b563',
        },
      ],
      bulkActions: [],
      itemActions: [],
      features: ['create', 'filter', 'update', 'delete'],
      filterColumnCount: 3,
      pageField: 'currentPage',
      perPageField: 'pageSize',
      headerToolbar: {
        type: 'button',
        actionType: 'dialog',
        label: '新增',
        icon: 'fa fa-plus pull-left',
        primary: true,
        dialog: {
          title: '新增',
          body: {
            type: 'form',
            name: 'sample-edit-form',
            api: {
              url: '/cx-alarm/resource/bindPositionUser',
              method: 'get',
              reload: 'crud',
              data: {
                '&': '$$',
              },

              adaptor: CurdAdaptor,
              requestAdaptor: DeleteRequestAdaptor,
              messages: {
                success: '新增成功',
              },
            },
            body: [
              {
                type: 'select',
                name: 'resourceId',
                label: '定位设备资源id',
                placeholder: '请选择定位设备资源id',
                required: true,
                validateOnChange: false,
                source: {
                  url: '/cx-alarm/resource/findPositionLayers',
                  messages: {},
                  replaceData: true,
                },
                labelField: 'resourceNo',
                valueField: 'id',
              },
              {
                type: 'select',
                name: 'userId',
                label: '人员id',
                placeholder: '请选择人员id',
                required: true,
                validateOnChange: false,
                source: {
                  url: '/ms-system/user/list',
                  method: 'post',
                  dataType: 'json',
                  messages: {},
                  replaceData: true,
                },
                labelField: 'userName',
                valueField: 'id',
                searchable: true,
              },
            ],
          },
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

const bindUser = () => {
  return (
    <Box h={'full'}>
      <AimsRender jsonView={data} />
    </Box>
  );
};

export default bindUser;
