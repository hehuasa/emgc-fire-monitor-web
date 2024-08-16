'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import { Box } from '@chakra-ui/react';
import Tree from '@/components/Montior/Tree';
import { useSafeState } from 'ahooks';

const AimsRender = dynamic(() => import('@/components/AimsRender'), { ssr: false });

const json1 = [
  {
    id: '1',
    name: '1',
    children: [
      { id: '1-1', name: '1-1', param: '我是1-1' },
      { id: '1-2', name: '1-2', param: '我是1-2' },
      { id: '1-3', name: '22222222222', param: '我是1-1' },
      { id: '1-4', name: '55555555555', param: '我是1-2' },
      { id: '1-5', name: '22222222222', param: '我是1-1' },
      { id: '1-6', name: '55555555555', param: '我是1-2' },
      { id: '1-7', name: '22222222222', param: '我是1-1' },
      { id: '1-8', name: '55555555555', param: '我是1-2' },
      { id: '1-9', name: '22222222222', param: '我是1-1' },
      { id: '1-10', name: '55555555555', param: '我是1-2' },
    ],
  },
];

const data = {
  type: 'page',
  title: '',
  body: [
    {
      type: 'crud',
      id: 'u:9955923c25d9',
      name: 'crud',
      syncLocation: false,
      api: {
        method: 'get',
        //url: '/ms-system/user/list/page?id=${id|join}',
        url: '/cx-alarm/alm/turnoff/page',
        messages: {
          success: '配置成功',
        },
        dataType: 'json',
        replaceData: true,
        data: {
          areaIds: '${area}',
          pageIndex: '${pageIndex}',
          pageSize: '${pageSize}',
          userCode: '${userCode}',
          //id: '${id|join}',
        },
      },
      columns: [
        // {
        //   name: 'id',
        //   label: '序号',
        //   type: 'text',
        //   id: 'u:345baa7e6a6b',
        // },
        {
          name: 'engine',
          label: '平台设备ID',
          type: 'text',
          id: 'u:40309f33879a',
        },
        {
          type: 'text',
          label: '设备编号',
          name: 'resourceNo',
          id: 'u:9ca351d80d91',
        },
        {
          type: 'text',
          label: '设备名称',
          name: 'resourceName',
          id: 'u:3c05f5663add',
        },
        {
          type: 'text',
          label: '所属产品',
          name: 'productName',
          id: 'u:cc0cd152baa4',
        },
        {
          type: 'text',
          label: '工艺位号',
          name: 'resourceNo',
          id: 'u:842cd33e01cb',
        },
        {
          type: 'text',
          label: '安装位置',
          name: 'engine',
          id: 'u:8c1ca08fe718',
        },
        {
          type: 'text',
          label: '设备状态',
          name: 'engine',
          id: 'u:32fe94b7aaa1',
        },
        {
          type: 'text',
          label: '开关状态',
          name: 'turnOffStatus',
          id: 'u:21fb19a964d6',
        },
        {
          type: 'operation',
          label: '操作',
          buttons: [],
          id: 'u:996ba4cb60e6',
        },
      ],
      bulkActions: [
        {
          type: 'button',
          label: '批量开关',
          id: 'u:e49d7bd2dc7f',
          onEvent: {
            click: {
              actions: [
                {
                  dialog: {
                    type: 'dialog',
                    title: '设置开关',
                    body: [
                      {
                        type: 'form',
                        id: 'u:07a4fad40269',
                        title: '表单',

                        mode: 'horizontal',
                        horizontal: {
                          leftFixed: 'sm',
                        },
                        body: [
                          {
                            label: '开关设置',
                            type: 'select',
                            name: 'turnoff',
                            id: 'u:abfbf8c1e5b2',
                            multiple: false,
                            required: true,
                            options: [
                              {
                                label: '开',
                                value: false,
                              },
                              {
                                label: '关',
                                value: true,
                              },
                            ],
                          },
                          {
                            type: 'checkbox',
                            name: 'switch',
                            label: '开启定时',
                          },
                          {
                            type: 'input-datetime',
                            inputFormat: 'YYYY-MM-DD HH:mm:ss',
                            label: '开始时间',
                            name: 'startTime',
                            id: 'u:c21504d2fe9c',
                            visibleOn: '${switch}',
                            required: true,
                            format: 'YYYY-MM-DD HH:mm:ss',
                          },
                          {
                            type: 'input-datetime',
                            inputFormat: 'YYYY-MM-DD HH:mm:ss',
                            label: '结束时间',
                            name: 'endTime',
                            id: 'u:85c949b391e1',
                            visibleOn: '${switch}',
                            required: true,
                            format: 'YYYY-MM-DD HH:mm:ss',
                          },
                        ],
                        onEvent: {
                          validateSucc: {
                            weight: 0,
                            actions: [
                              //提交
                              {
                                args: {
                                  api: {
                                    url: '/cx-alarm/alm/turnoff/setting',
                                    method: 'post',
                                    dataType: 'json',
                                    data: {
                                      '&': '$$',
                                      ids: '${ids | asArray}',
                                    },
                                  },
                                },
                                outputVar: 'responseResult',
                                actionType: 'ajax',
                              },
                              //关闭Dialog
                              // {
                              //   args: {},
                              //   actionType: 'closeDialog',
                              // },
                              //重新获列表取数据
                              {
                                componentId: 'u:9955923c25d9',
                                actionType: 'reload',
                                groupType: 'component',
                              },
                            ],
                          },
                        },
                      },
                    ],
                    showCloseButton: true,
                    showErrorMsg: true,
                    showLoading: true,
                    id: 'u:70f513d937df',
                    closeOnEsc: false,
                    dataMapSwitch: false,
                    actions: [
                      {
                        type: 'button',
                        label: '取消',
                        onEvent: {
                          click: {
                            actions: [],
                          },
                        },
                        id: 'u:e7a83b55b267',
                        close: true,
                        level: 'secondary',
                      },
                      {
                        type: 'button',
                        label: '确定',
                        loadingOn: true,
                        onEvent: {
                          click: {
                            actions: [
                              //提交的时候先验证表单
                              {
                                componentId: 'u:07a4fad40269',

                                actionType: 'submit',
                              },
                              {
                                actionType: 'toast', // 执行toast提示动作
                                args: {
                                  // 动作参数
                                  msgType: 'info',
                                  msg: '派发点击事件',
                                },
                              },
                            ],
                          },
                        },
                        id: 'u:a2d7947a1fd8',
                        level: 'primary',
                      },
                    ],
                  },
                  actionType: 'dialog',
                },
                {
                  actionType: 'clear',
                  componentId: 'u:07a4fad40269',
                },
              ],
            },
          },
        },
      ],
      itemActions: [],
      features: ['bulkDelete', 'bulkUpdate', 'filter'],
      filterColumnCount: 1,
      perPageAvailable: [10],
      messages: {},
      keepItemSelectionOnPageChange: true,
      alwaysShowPagination: true,
      headerToolbar: [
        {
          type: 'bulk-actions',
        },
      ],
      filter: {
        title: '查询条件',
        body: [
          {
            type: 'input-text',
            name: 'userCode',
            label: '设备编号',
            id: 'u:f4db433b6939',
            clearable: true,
            placeholder: ' 设备编号',
          },
          {
            type: 'button-toolbar',
            label: '',
            buttons: [
              {
                type: 'button',
                label: '查询',
                onEvent: {
                  click: {
                    actions: [
                      {
                        componentId: 'u:9955923c25d9',
                        actionType: 'reload',
                        groupType: 'component',
                      },
                    ],
                  },
                },
                id: 'u:b77266c5b239',
                level: 'primary',
              },
              {
                type: 'button',
                label: '设置记录',
                onEvent: {
                  click: {
                    actions: [
                      {
                        args: {},
                        dialog: {
                          type: 'dialog',
                          title: '设置记录',
                          size: 'md',
                          body: [
                            {
                              type: 'crud',
                              id: 'u:3431d5392946',
                              syncLocation: false,
                              api: {
                                method: 'get',
                                url: '/cx-alarm/alm/turnoff/page/log',
                                messages: {},
                                dataType: 'json',
                                replaceData: true,
                                data: {
                                  '&': '$$',
                                },
                              },
                              columns: [
                                {
                                  name: 'id',
                                  label: 'ID',
                                  type: 'text',
                                  id: 'u:d18eb55f7aa5',
                                },
                                {
                                  name: 'deptName',
                                  label: '部门',
                                  type: 'text',
                                  id: 'u:c58e98a5b157',
                                },
                                {
                                  type: 'text',
                                  label: '区域',
                                  name: 'areaName',
                                  id: 'u:1f01bdee2604',
                                },
                                {
                                  type: 'text',
                                  label: '设备名称',
                                  name: 'resourceName',
                                  id: 'u:5ef4dacf7948',
                                },
                                {
                                  type: 'text',
                                  label: '工艺位号',
                                  name: 'resourceNo',
                                  id: 'u:20f3173a8544',
                                },
                              ],
                              bulkActions: [],
                              itemActions: [],
                              perPageField: 'pageSize',
                              pageField: 'pageIndex',
                              defaultParams: {
                                pageIndex: 1,
                                pageSize: 10,
                              },
                            },
                          ],
                          showCloseButton: true,
                          showErrorMsg: true,
                          showLoading: true,
                          id: 'u:f997c28b94a1',
                          closeOnEsc: false,
                          dataMapSwitch: false,
                        },
                        actionType: 'dialog',
                      },
                    ],
                  },
                },
                id: 'u:ac59197d28db',
              },
            ],
            id: 'u:2de96a5750c7',
            className: 'm-l',
          },
        ],
        id: 'u:ed5798412d44',
        wrapWithPanel: false,
        mode: 'inline',
        panelClassName: 'border-0 no-border',
        className: 'border-0',
      },
      perPageField: 'pageSize',
      pageField: 'pageIndex',
      defaultParams: {
        pageIndex: 1,
        pageSize: 10,
      },
    },
  ],
  id: 'u:7951bf1a715e',

  // aside: {
  //   type: 'form',
  //   wrapWithPanel: false,
  //   target: 'window',
  //   submitOnInit: true,

  //   body: [
  //     {
  //       type: 'input-tree',
  //       name: 'area',
  //       inputClassName: 'no-border',
  //       submitOnChange: true,
  //       selectFirst: true,

  //       options: [
  //         {
  //           label: '分类1',
  //           value: 'cat1',
  //         },
  //         {
  //           label: '分类2',
  //           value: 'cat2',
  //           children: [
  //             {
  //               label: '分类 2.1',
  //               value: 'cat2.1',
  //             },
  //             {
  //               label: '分类 2.2',
  //               value: 'cat2.2',
  //             },
  //           ],
  //         },
  //         {
  //           label: '分类3',
  //           value: 'cat3',
  //         },
  //         {
  //           label: '分类4',
  //           value: 'cat4',
  //         },
  //       ],
  //       id: 'u:3032490c0d58',
  //       multiple: true,
  //       enableNodePath: false,
  //       initiallyOpen: true,
  //       cascade: true,
  //       autoCheckChildren: true,
  //       hideRoot: true,
  //       showIcon: true,
  //       size: 'full',
  //       onEvent: {
  //         change: {
  //           actions: [
  //             {
  //               componentId: 'u:9955923c25d9',
  //               actionType: 'reload',
  //               groupType: 'component',
  //             },
  //           ],
  //         },
  //       },
  //     },
  //   ],
  //   id: 'u:0fe197113089',
  // },

  asideResizor: false,
  pullRefresh: {
    disabled: true,
  },
};

const Logs = () => {
  const [id, setId] = useSafeState<string[]>([]);
  return (
    <Box h={'full'} w="full" display="flex">
      <Box h="full" px="4" py="3" w="70" borderRadius="10px" mr="4">
        <Tree defaultExpandAll data={json1} multiple onSelect={(ids) => setId(ids)} />
      </Box>
      <Box flex={1}>
        <AimsRender jsonView={data} props={{ id }} />
      </Box>
    </Box>
  );
};

export default Logs;
