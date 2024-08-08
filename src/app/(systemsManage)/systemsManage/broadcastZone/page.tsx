'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import { Box } from '@chakra-ui/react';
import { Text } from '@chakra-ui/react';
import { phoneReg } from '@/utils/rule';
import { CurdAdaptor, DeleteRequestAdaptor } from '@/components/AmisAdaptor';

const TextPlan = (props: any) => {
  const autoCloseTime = props?.data?.autoCloseTime;
  if (autoCloseTime) {
    return (
      <td>
        <Text>{autoCloseTime}秒</Text>
      </td>
    );
  }

  return <td></td>;
};

const IsContinuousText = (props: any) => {
  const isContinuous = props?.data?.isContinuous;
  return <td>{isContinuous === 1 ? '是' : '否'}</td>;
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
        url: '/cx-alarm/broadcast-area/list',
        messages: {},
        dataType: 'form',

        replaceData: true,
      },
      columns: [
        {
          name: 'areaPhoneNumber',
          label: '区域号码(客户端拨打电话号码)',
          type: 'text',
        },
        {
          name: 'boradcastAreaCode',
          label: '广播区域',
          type: 'text',
        },
        {
          name: 'boradcastAreaName',
          label: '广播区域名称',
          type: 'text',
        },
        {
          name: 'telStationNumber',
          label: '话站号码',
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
                      name: 'boradcastAreaCode',
                      label: '广播分区',
                      placeholder: '请输入广播分区',
                      required: true,
                      validateOnChange: false,
                    },
                    {
                      type: 'input-text',
                      name: 'boradcastAreaName',
                      label: '广播区域名称',
                      placeholder: '请输入广播区域名称',
                      required: true,
                      validateOnChange: false,
                    },
                    {
                      type: 'input-text',
                      name: 'areaPhoneNumber',
                      label: '区域号码(客户端拨打号码)',
                      placeholder: '请输入区域号码(客户端拨打号码)',
                      required: true,
                      validateOnChange: false,
                    },
                    {
                      type: 'input-text',
                      name: 'telStationNumber',
                      label: '话站号码',
                      placeholder: '请输入话站号码',
                      required: true,
                      validateOnChange: false,
                      validations: {
                        matchRegexp: phoneReg,
                      },
                      validationErrors: {
                        matchRegexp: '请输入正确的电话格式',
                      },
                    },
                  ],
                  api: {
                    url: '/cx-alarm/broadcast-area/update',
                    method: 'POST',
                    dataType: 'json',
                    data: {
                      '&': '$$',
                      id: '$id',
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
                url: '/cx-alarm/broadcast-area/delete/${id}',
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
          title: '新增',
          body: {
            type: 'form',
            name: 'sample-edit-form',
            api: {
              url: '/cx-alarm/broadcast-area/add',
              method: 'post',
              dataType: 'json',
              reload: 'crud',
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
                name: 'boradcastAreaCode',
                label: '广播分区',
                placeholder: '请输入广播分区',
                required: true,
                validateOnChange: false,
              },
              {
                type: 'input-text',
                name: 'boradcastAreaName',
                label: '广播区域名称',
                placeholder: '请输入广播区域名称',
                required: true,
                validateOnChange: false,
              },
              {
                type: 'input-text',
                name: 'areaPhoneNumber',
                label: '区域号码(客户端拨打号码)',
                placeholder: '请输入区域号码(客户端拨打号码)',
                required: true,
                validateOnChange: false,
              },
              {
                type: 'input-text',
                name: 'telStationNumber',
                label: '话站号码',
                placeholder: '请输入话站号码',
                required: true,
                validateOnChange: false,
                validations: {
                  matchRegexp: phoneReg,
                },
                validationErrors: {
                  matchRegexp: '请输入正确的电话格式',
                },
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

const Area = () => {
  return (
    <Box h={'full'}>
      <AimsRender jsonView={data} />
    </Box>
  );
};

export default Area;
