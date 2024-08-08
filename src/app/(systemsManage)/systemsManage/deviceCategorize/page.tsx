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
        method: 'get',
        url: '/cx-alarm/deviceType/page',
        messages: {},
        dataType: 'form',
        data: {
          pageIndex: '${pageIndex}',
          pageSize: '${pageSize}',
          searchText: '${searchText_search|default}',
        },
        replaceData: true,
      },
      columns: [
        {
          name: 'productName',
          label: '产品名称',
          type: 'text',
        },

        {
          type: 'operation',
          label: '操作',
          buttons: [
            {
              label: '编辑',
              type: 'button',
              actionType: 'dialog',
              id: 'u:4cf9dae5d4ce',
              level: 'enhance',
              dialog: {
                title: '编辑',
                body: {
                  type: 'form',

                  body: [
                    {
                      type: 'input-text',
                      name: 'productName',
                      label: '产品名称',
                      placeholder: '请输入产品名称',
                      required: true,
                      validateOnChange: false,
                    },
                  ],
                  api: {
                    url: '/cx-alarm/deviceType/edit',
                    method: 'post',
                    dataType: 'json',
                    data: {
                      '&': '$$',
                      id: '${id}',
                    },
                    adaptor: CurdAdaptor,
                    messages: {
                      success: '编辑成功',
                    },
                  },
                },

                id: 'u:49b0854305b2',
              },
            },
            {
              type: 'button',
              label: '删除',
              level: 'danger',
              api: {
                url: '/cx-alarm/deviceType/delete/${id}',
                method: 'post',
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
      headerToolbar: [],
      id: 'u:c8b1fa56558e',
      perPageField: 'pageSize',
      pageField: 'pageIndex',
      defaultParams: {
        pageIndex: 1,
        pageSize: 10,
      },
      filter: {
        title: '查询条件',
        body: [
          {
            type: 'form',
            title: '查询条件',
            target: 'crud?searchText_search=${searchText_search}',
            body: [
              {
                name: 'searchText_search',
                type: 'input-text',
                label: '产品名称',
                className: 'm-l',
                inputClassName: 'w',
                placeholder: '请输入产品名称',
                clearable: true,
              },
            ],
            mode: 'inline',
            id: 'u:c4ad86e24b0a',
            rules: [],
            actions: [
              {
                type: 'submit',
                label: '查询',
                id: 'u:57d6dfdfb28b',
                level: 'primary',
              },
              {
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
                    reload: 'crud',
                    api: {
                      url: '/cx-alarm/deviceType/add',
                      method: 'post',
                      dataType: 'json',
                      data: {
                        '&': '$$',
                      },
                      adaptor: CurdAdaptor,
                      messages: {
                        success: '新增成功',
                      },
                    },
                    body: [
                      {
                        type: 'input-text',
                        name: 'productName',
                        label: '产品名称',
                        placeholder: '请输入产品名称',
                        required: true,
                        validateOnChange: false,
                      },
                    ],
                  },
                },
              },
            ],
          },
        ],

        actions: [],
        wrapWithPanel: false,
        mode: 'inline',
        reload: 'crud',
      },

      alwaysShowPagination: true,
      autoFillHeight: true,
    },
  ],
  id: 'u:7951bf1a715e',
  asideResizor: false,
  pullRefresh: {
    disabled: true,
  },
};

const DeviceCategorize = () => {
  return (
    <Box h={'full'}>
      <AimsRender jsonView={data} />
    </Box>
  );
};

export default DeviceCategorize;
