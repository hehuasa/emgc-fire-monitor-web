'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import { Box } from '@chakra-ui/react';
import { CurdAdaptor } from '@/components/AmisAdaptor';

const AimsRender = dynamic(() => import('@/components/AimsRender'), { ssr: false });

const data = {
  type: 'page',
  title: '设备开关管理',
  data: {
    resourceList: [],
  },
  body: [
    {
      type: 'crud',
      name: 'crud',
      mode: 'table',
      syncLocation: false,
      autoFillHeight: true,
      loadDataOnce: true,
      defaultParams: {
        current: 1,
        size: 500,
      },
      pageField: 'current',
      perPageField: 'size',
      combineNum: 2,
      api: {
        method: 'post',
        url: '/systemsManage/deviceSwitch/api/queryDevice',
        messages: {},
        replaceData: true,
        dataType: 'json',
        data: {
          equipmentId: '${equipmentId|default}',
          switchStatus: '${switchStatus|default}',
        },
        responseData: {
          resourceList: '${items}',
        },
      },
      columns: [
        {
          name: 'equipmentId',
          label: '关键设备位号',
          type: 'text',
          id: 'u:88d5a9e5e30e',
        },
        {
          name: 'resourceNo',
          label: '子设备位号',
          type: 'text',
          id: 'u:88d5215e30e',
        },
        {
          name: 'switchStatus',
          label: '开关状态',
          type: 'map',
          id: 'u:437ff78a621d0',
          map: {
            1: '开启',
            0: '关闭',
          },
        },
        {
          name: 'id',
          label: 'ID',
          type: 'text',
          id: 'u:437ff712621d0',
          hidden: true,
        },
        {
          name: 'switchStatus',
          label: '操作',
          type: 'switch',
          id: 'u:30a36768acce',
          onText: '开启',
          offText: '关闭',
          inline: true,
          onEvent: {
            change: {
              actions: [
                {
                  actionType: 'confirmDialog',
                  dialog: {
                    type: 'dialog',
                    title: '切换开关',
                    body: [
                      {
                        type: 'tpl',
                        tpl: '是否确认切换开关状态？',
                        wrapperComponent: '',
                        inline: false,
                        id: 'u:1965506c7599',
                      },
                    ],
                    showCloseButton: true,
                    showErrorMsg: true,
                    showLoading: true,
                    className: 'app-popover',
                    id: 'u:d9783223df98',
                    actions: [
                      {
                        type: 'button',
                        actionType: 'cancel',
                        label: '取消',
                        id: 'u:302efee8613b',
                      },
                      {
                        type: 'button',
                        actionType: 'confirm',
                        label: '确定',
                        primary: true,
                        id: 'u:4a4d63cf35e1',
                      },
                    ],
                  },
                },
                {
                  actionType: 'switch',
                  children: [
                    {
                      expression: '${switchStatus == 1}',

                      args: {
                        options: {
                          silent: false,
                        },
                        api: {
                          url: '/systemsManage/deviceSwitch/api/turnOn',
                          method: 'post',
                          adaptor: CurdAdaptor,
                          messages: {
                            success: '配置成功',
                          },
                          dataType: 'json',
                          data: {
                            id: '${id}',
                            resourceIds: '${resourceList}',
                          },
                        },
                      },
                      outputVar: 'responseResult',
                      actionType: 'ajax',
                    },
                    {
                      expression: '${switchStatus == 0}',
                      args: {
                        options: {
                          silent: false,
                        },
                        api: {
                          url: '/systemsManage/deviceSwitch/api/turnOff',
                          method: 'post',
                          adaptor: CurdAdaptor,
                          messages: {
                            success: '配置成功',
                          },
                          dataType: 'json',
                          data: {
                            turnOffWay: 2,
                            resourceIds: '${resourceList}',
                            id: '${id}',
                          },
                        },
                      },
                      outputVar: 'responseResult',
                      actionType: 'ajax',
                    },
                  ],
                },
                {
                  componentId: 'u:ae3c08295bd7',
                  args: {
                    resetPage: false,
                  },
                  actionType: 'reload',
                  data: null,
                },
              ],
            },
          },
        },
      ],
      bulkActions: [],
      itemActions: [],
      features: ['update', 'delete', 'create'],
      id: 'u:ae3c08295bd7',
      filter: {
        title: '',
        body: [
          {
            type: 'form',
            title: '查询条件',
            mode: 'inline',
            target: 'crud?equipmentId=${equipmentId}&switchStatus=${switchStatus}',
            body: [
              {
                type: 'input-text',
                name: 'equipmentId',
                label: '设备位号',
                id: 'u:55846cf005a2',
                clearable: true,
                remark: '',
                placeholder: '请根据位号查询',
                labelClassName: 'm-l',
                inputClassName: 'w',
                mode: 'inline',
                horizontal: {
                  left: 1,
                  right: 11,
                },
              },
              {
                type: 'select',
                label: '开关状态',
                id: 'u:d989337f213e',
                clearable: true,
                placeholder: '请选择开关状态查询',
                name: 'switchStatus',
                labelClassName: 'm-l',
                inputClassName: 'w',
                hideNodePathLabel: true,
                multiple: false,
                enableNodePath: false,
                showIcon: true,
                extractValue: true,
                options: [
                  { label: '开启', value: '1' },
                  { label: '关闭', value: '0' },
                ],
              },
            ],
            id: 'u:c4ad86e24b0a',
            actions: [
              {
                type: 'submit',
                label: '查询',
                id: 'u:ec887911ac2f',
                level: 'primary',
                className: 'r',
                onEvent: {
                  click: {
                    actions: [
                      {
                        actionType: 'setValue',
                        componentId: 'ae3c08295bd7',
                        dataMergeMode: 'override',
                      },
                    ],
                  },
                },
              },
              {
                type: 'reset',
                label: '重置',
                onEvent: {
                  click: {
                    actions: [
                      {
                        componentId: 'u:c4ad86e24b0a',
                        actionType: 'clear',
                      },
                      {
                        componentId: 'u:c4ad86e24b0a',
                        actionType: 'submit',
                      },
                    ],
                  },
                },
                id: 'u:ec33662e8cd8',
                level: 'secondary',
              },
            ],
          },
        ],
        id: 'u:2231678bc574',
        reload: 'crud',
        submitText: '',
        mode: 'line',
        horizontal: {
          leftFixed: 'normal',
        },
        wrapWithPanel: false,
      },
      perPageAvailable: [10, 20, 50],
      messages: {},
      alwaysShowPagination: false,
      headerToolbar: ['bulkActions'],
    },
  ],
  id: 'u:b994f0f68edf',
  pullRefresh: {
    disabled: true,
  },
  regions: ['body'],
};

const Departs = () => {
  return (
    <Box h={'full'}>
      <AimsRender jsonView={data} />
    </Box>
  );
};

export default Departs;
