'use client';
import { PageBeanAdaptor } from '@/components/AmisAdaptor';
import dynamic from 'next/dynamic';
const AimsRender = dynamic(() => import('@/components/AimsRender'), { ssr: false });
const NodeMediaPlayer = dynamic(() => import('./NodeMediaPlayer'), { ssr: false });

const data = {
  type: 'page',
  id: 'u:752d91cd3d15',
  body: [
    {
      id: 'u:5e8134488ce7',
      body: [
        {
          id: 'u:60baa699e403',
          body: [
            {
              id: 'u:8ae25e14b524',
              api: {
                url: '/qs-dp/dpCameraConfig/page?pageNum=${pageNum}&pageSize=${pageSize}',
                method: 'post',
                data: {
                  panelId: 1,
                },
                adaptor: PageBeanAdaptor,
                dataType: 'json',
                messages: {},
                requestAdaptor: '',
              },
              type: 'crud',
              name: 'crud1',
              columns: [
                {
                  id: 'u:dabd2284fa97',
                  tpl: '${index+1}',
                  name: '',
                  type: 'tpl',
                  label: '序号',
                },
                {
                  id: 'u:f2d07be7215a5',
                  name: 'cameraName',
                  type: 'text',
                  label: '摄像头名称',
                },
                {
                  id: 'u:f2d07115a5',
                  name: 'cameraType',
                  type: 'text',
                  label: '摄像头类型',
                },
                {
                  id: 'u:f2d07115a5',
                  name: 'cameraState',
                  type: 'map',
                  label: '状态',
                  map: {
                    true: '在线',
                    false: '离线',
                  },
                },
                {
                  id: 'u:f2d07be7c5a5',
                  name: 'cameraId',
                  type: 'text',
                  label: '摄像头id',
                },
                {
                  id: 'u:45827c269f7e',
                  type: 'operation',
                  label: '操作',
                  buttons: [
                    {
                      id: 'u:b1fc6d2240c0',
                      api: {
                        url: '/qs-dp/dpCameraConfig/delete?id=${id}',
                        method: 'get',
                        adaptor:
                          'return {\r\n    msg: response.code === 200 ? api.messages.success : response.msg,\r\n    status: response.code === 200 ? 0 : response.code,\r\n    data: {\r\n      responseMsg: response.msg\r\n    },\r\n  };',
                        dataType: 'json',
                        messages: {
                          success: '删除成功',
                        },
                        requestAdaptor:
                          'return {\r\n    ...api,\r\n    config: {\r\n      ...api.config,\r\n      method: api.method,\r\n    },\r\n  };',
                      },
                      type: 'button',
                      label: '删除',
                      level: 'danger',
                      reload: 'crud1',
                      actionType: 'ajax',
                      confirmText: '确定要删除？',
                      confirmTitle: '删除',
                    },
                  ],
                },
              ],
              features: ['create', 'delete'],
              messages: {},
              initFetch: true,
              pageField: 'pageNum',
              affixHeader: false,
              bulkActions: [],
              itemActions: [],
              perPageField: 'pageSize',
              syncLocation: false,
              headerToolbar: [
                {
                  id: 'u:88fae22bbf39',
                  type: 'button',
                  label: '配置',
                  level: 'primary',
                  onEvent: {
                    click: {
                      weight: 0,
                      actions: [
                        {
                          args: {
                            api: {
                              url: '/qs-dp/dpCameraConfig/list_by_panel_id',
                              method: 'post',
                              dataType: 'json',
                              replaceData: true,
                              data: {
                                panelId: 1,
                              },
                              responseData: {
                                carmeraIdList: '${items}',
                              },
                            },
                            options: { silent: false },
                          },
                          outputVar: 'responseResult',
                          actionType: 'ajax',
                        },
                        {
                          dialog: {
                            id: 'u:6c716e329b61',
                            body: [
                              {
                                id: 'u:8212sbbf39',
                                type: 'button',
                                label: '同步海康视频数据',
                                level: 'primary',
                                className: 'mb-4',
                                onEvent: {
                                  click: {
                                    actions: [
                                      {
                                        args: {
                                          api: {
                                            url: '/device-manger/camera/sync_camera',
                                            method: 'get',
                                            dataType: 'form',
                                            replaceData: true,
                                            adaptor:
                                              'return {\r\n    msg: response.code === 200 ? api.messages.success : response.msg,\r\n    status: response.code === 200 ? 0 : response.code,\r\n    data: {\r\n      responseMsg: response.msg\r\n    },\r\n  };',
                                            messages: {
                                              success: '同步完成',
                                            },
                                          },
                                          options: { silent: false },
                                        },
                                        actionType: 'ajax',
                                      },
                                      {
                                        args: {},
                                        actionType: 'reload',
                                        componentId: 'u:85d024b4bbc2',
                                      },
                                    ],
                                  },
                                },
                              },
                              {
                                id: 'u:85d024b4bbc2',
                                name: 'carmeraList',
                                label: '生产工艺摄像头',
                                type: 'transfer',
                                modalMode: 'dialog',
                                embed: true,
                                multiple: true,
                                joinValues: false,
                                searchable: true,
                                selectMode: 'table',
                                resultSearchable: true,
                                resultListModeFollowSelect: true,
                                value: '${carmeraIdList}',
                                itemHeight: 50,
                                source: {
                                  url: '/systemsManage/qsManage/videoConfig/api/getCarmeraList',
                                  method: 'get',
                                  dataType: 'form',
                                  replaceData: true,
                                },
                                searchApi:
                                  '/systemsManage/qsManage/videoConfig/api/getCarmeraList?cameraName=${term|trim}',
                                labelField: 'cameraName',
                                valueField: 'cameraId',
                                searchPlaceholder: '请根据摄像头名称搜索',
                                resultSearchPlaceholder: '请根据摄像头名称搜索',
                                columns: [
                                  {
                                    id: 'u:2ae125133bf3',
                                    name: 'index',
                                    type: 'text',
                                    label: '序号',
                                    labelClassName: 'text-center',
                                  },
                                  {
                                    id: 'u:1121',
                                    name: 'cameraName',
                                    type: 'text',
                                    label: '摄像头名称',
                                    labelClassName: 'text-center',
                                  },
                                  {
                                    id: 'u:1dsa213sa',
                                    name: 'cameraType',
                                    type: 'text',
                                    label: '摄像头类型',
                                    labelClassName: 'text-center',
                                  },
                                  {
                                    id: 'u:d6683a00c292',
                                    name: 'id',
                                    type: 'text',
                                    label: '摄像头ID',
                                    labelClassName: 'text-center white-space-nowrap ',
                                  },
                                  {
                                    id: 'u:a7067f81f3e8',
                                    name: 'online',
                                    type: 'map',
                                    label: '状态',
                                    labelClassName: 'text-center',
                                    map: {
                                      true: '在线',
                                      false: '离线',
                                    },
                                  },
                                  {
                                    id: 'u:45827c269f7e',
                                    type: 'operation',
                                    label: '操作',
                                    buttons: [
                                      {
                                        type: 'button',
                                        label: '预览',

                                        onEvent: {
                                          click: {
                                            actions: [
                                              {
                                                dialog: {
                                                  type: 'dialog',
                                                  title: '预览',
                                                  body: [
                                                    {
                                                      type: 'flex',
                                                      id: 'u:23c74e51b1bf',
                                                      className: 'p-1',
                                                      items: [
                                                        {
                                                          type: 'wrapper',
                                                          body: [
                                                            {
                                                              name: 'mycustom',
                                                              asFormItem: true,
                                                              children: ({ value }: any) => {
                                                                return (
                                                                  <NodeMediaPlayer
                                                                    cameraId={value}
                                                                  />
                                                                );
                                                              },

                                                              value: '${cameraId}',
                                                              id: 'u:a322298bd705',
                                                            },
                                                          ],
                                                          size: 'lg',
                                                          style: {
                                                            position: 'static',
                                                            display: 'flex',
                                                            flex: '1 1 auto',
                                                            flexGrow: 1,
                                                            flexBasis: '680px',
                                                            flexDirection: 'row',
                                                            flexWrap: 'nowrap',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                          },
                                                          isFixedHeight: false,
                                                          isFixedWidth: false,
                                                          id: 'u:b7a1f993e42d',
                                                        },
                                                      ],
                                                      style: {
                                                        position: 'static',
                                                      },
                                                      direction: 'row',
                                                      justify: 'flex-start',
                                                      alignItems: 'stretch',
                                                    },
                                                  ],
                                                  showCloseButton: true,
                                                  showErrorMsg: true,
                                                  showLoading: true,
                                                  id: 'u:4e43f1d2eb96',
                                                  closeOnEsc: false,
                                                  dataMapSwitch: false,
                                                  size: 'lg',
                                                  actions: [],
                                                },
                                                actionType: 'dialog',
                                              },
                                            ],
                                          },
                                        },
                                        id: 'u:9cb28ae6c433',
                                        level: 'link',
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                            size: 'xl',
                            type: 'dialog',
                            title: '配置',
                            className: 'app-popover',
                            closeOnEsc: false,
                            showLoading: true,
                            showErrorMsg: true,
                            closeOnOutside: false,
                            showCloseButton: true,
                            onEvent: {
                              cancel: {
                                weight: 0,
                                actions: [{ args: {}, actionType: 'closeDialog' }],
                              },
                              confirm: {
                                weight: 0,
                                actions: [
                                  {
                                    args: {
                                      api: {
                                        url: '/qs-dp/dpCameraConfig/add',
                                        data: {
                                          panelId: 1,
                                          cameraIds:
                                            '${carmeraList|pick:cameraId,cameraName,cameraType,cameraState|map}',
                                        },
                                        method: 'post',
                                        adaptor:
                                          'return {\r\n    msg: response.code === 200 ? api.messages.success : response.msg,\r\n    status: response.code === 200 ? 0 : response.code,\r\n    data: {\r\n      responseMsg: api.messages.success,\r\n    },\r\n  };',
                                        dataType: 'json',
                                        messages: { success: '配置成功', failed: '配置失败' },
                                        replaceData: true,
                                        requestAdaptor: '',
                                      },
                                      options: {},
                                    },
                                    outputVar: 'responseResult',
                                    actionType: 'ajax',
                                  },
                                  { args: {}, actionType: 'closeDialog' },
                                  {
                                    args: {},
                                    actionType: 'reload',
                                    componentId: 'u:8ae25e14b524',
                                  },
                                ],
                              },
                            },
                          },
                          actionType: 'dialog',
                        },
                      ],
                    },
                  },
                },
                'bulkActions',
              ],
              perPageAvailable: [10],
              alwaysShowPagination: true,
            },
          ],
          type: 'panel',
          title: '工艺生产视频',
          actions: [],
          affixFooter: false,
        },
        {
          id: 'u:51d7b71a5ff3',
          body: [
            {
              id: 'u:0685f0cde132',
              api: {
                url: '/qs-dp/dpCameraConfig/page?pageNum=${pageNum}&pageSize=${pageSize}',
                method: 'post',
                data: {
                  panelId: 2,
                },
                adaptor: PageBeanAdaptor,
                dataType: 'json',
                messages: {},
                requestAdaptor: '',
              },
              type: 'crud',
              name: 'crud2',
              columns: [
                {
                  id: 'u:dabd2284fa97',
                  tpl: '${index+1}',
                  name: '',
                  type: 'tpl',
                  label: '序号',
                },
                {
                  id: 'u:f2d07be7215a5',
                  name: 'cameraName',
                  type: 'text',
                  label: '摄像头名称',
                },
                {
                  id: 'u:f2d07115a5',
                  name: 'cameraType',
                  type: 'text',
                  label: '摄像头类型',
                },
                {
                  id: 'u:f2d07115a5',
                  name: 'cameraState',
                  type: 'map',
                  label: '状态',
                  map: {
                    true: '在线',
                    false: '离线',
                  },
                },
                {
                  id: 'u:f2d07be7c5a5',
                  name: 'cameraId',
                  type: 'text',
                  label: '摄像头id',
                },
                {
                  id: 'u:45827c269f7e',
                  type: 'operation',
                  label: '操作',
                  buttons: [
                    {
                      id: 'u:b1fc6d2240c0',
                      api: {
                        url: '/qs-dp/dpCameraConfig/delete?id=${id}',
                        method: 'get',
                        adaptor:
                          'return {\r\n    msg: response.code === 200 ? api.messages.success : response.msg,\r\n    status: response.code === 200 ? 0 : response.code,\r\n    data: {\r\n      responseMsg: response.msg\r\n    },\r\n  };',
                        dataType: 'json',
                        messages: {
                          success: '删除成功',
                        },
                        requestAdaptor:
                          'return {\r\n    ...api,\r\n    config: {\r\n      ...api.config,\r\n      method: api.method,\r\n    },\r\n  };',
                      },
                      type: 'button',
                      label: '删除',
                      level: 'danger',
                      reload: 'crud2',
                      actionType: 'ajax',
                      confirmText: '确定要删除？',
                      confirmTitle: '删除',
                    },
                  ],
                },
              ],
              features: ['create', 'update', 'delete'],
              messages: {},
              initFetch: true,
              pageField: 'pageNum',
              affixHeader: false,
              bulkActions: [],
              itemActions: [],
              perPageField: 'pageSize',
              syncLocation: false,
              headerToolbar: [
                {
                  id: 'u:88fae22bbf39',
                  type: 'button',
                  label: '配置',
                  level: 'primary',
                  onEvent: {
                    click: {
                      weight: 0,
                      actions: [
                        {
                          args: {
                            api: {
                              url: '/qs-dp/dpCameraConfig/list_by_panel_id',
                              method: 'post',
                              dataType: 'json',
                              replaceData: true,
                              data: {
                                panelId: 2,
                              },
                              responseData: {
                                carmeraIdList: '${items}',
                              },
                            },
                            options: { silent: false },
                          },
                          outputVar: 'responseResult',
                          actionType: 'ajax',
                        },
                        {
                          dialog: {
                            id: 'u:6c7321b61',

                            body: [
                              {
                                id: 'u:8212sbbf39',
                                type: 'button',
                                label: '同步海康视频数据',
                                level: 'primary',
                                className: 'mb-4',
                                onEvent: {
                                  click: {
                                    actions: [
                                      {
                                        args: {
                                          api: {
                                            url: '/device-manger/camera/sync_camera',
                                            method: 'get',
                                            dataType: 'form',
                                            replaceData: true,
                                            adaptor:
                                              'return {\r\n    msg: response.code === 200 ? api.messages.success : response.msg,\r\n    status: response.code === 200 ? 0 : response.code,\r\n    data: {\r\n      responseMsg: response.msg\r\n    },\r\n  };',
                                            messages: {
                                              success: '同步完成',
                                            },
                                          },
                                          options: { silent: false },
                                        },
                                        actionType: 'ajax',
                                      },
                                      {
                                        args: {},
                                        actionType: 'reload',
                                        componentId: 'u:85d024b4bbc2',
                                      },
                                    ],
                                  },
                                },
                              },
                              {
                                id: 'u:85d024b4bbc2',
                                name: 'carmeraList',
                                type: 'transfer',
                                label: '排放系统监控摄像头',
                                modalMode: 'dialog',
                                embed: true,
                                multiple: true,
                                joinValues: false,
                                searchable: true,
                                selectMode: 'table',
                                resultSearchable: true,
                                resultListModeFollowSelect: true,
                                itemHeight: 50,
                                value: '${carmeraIdList}',
                                source: {
                                  url: '/systemsManage/qsManage/videoConfig/api/getCarmeraList',
                                  method: 'get',
                                  dataType: 'form',
                                  replaceData: true,
                                },
                                searchApi:
                                  '/systemsManage/qsManage/videoConfig/api/getCarmeraList?cameraName=${term|trim}',
                                labelField: 'cameraName',
                                valueField: 'cameraId',
                                searchPlaceholder: '请根据摄像头名称搜索',
                                resultSearchPlaceholder: '请根据摄像头名称搜索',
                                autoFillHeight: true,
                                columns: [
                                  {
                                    id: 'u:2ae125133bf3',
                                    name: 'index',
                                    type: 'text',
                                    label: '序号',
                                    labelClassName: 'text-center',
                                  },
                                  {
                                    id: 'u:1121',
                                    name: 'cameraName',
                                    type: 'text',
                                    label: '摄像头名称',
                                    labelClassName: 'text-center',
                                  },
                                  {
                                    id: 'u:1dsa213sa',
                                    name: 'cameraType',
                                    type: 'text',
                                    label: '摄像头类型',
                                    labelClassName: 'text-center',
                                  },
                                  {
                                    id: 'u:d6683a00c292',
                                    name: 'id',
                                    type: 'text',
                                    label: '摄像头ID',
                                    labelClassName: 'text-center white-space-nowrap ',
                                  },
                                  {
                                    id: 'u:a7067f81f3e8',
                                    name: 'online',
                                    type: 'map',
                                    label: '状态',
                                    labelClassName: 'text-center',
                                    map: {
                                      true: '在线',
                                      false: '离线',
                                    },
                                  },
                                  {
                                    id: 'u:45827c269f7e',
                                    type: 'operation',
                                    label: '操作',
                                    buttons: [
                                      {
                                        type: 'button',
                                        label: '预览',

                                        onEvent: {
                                          click: {
                                            actions: [
                                              {
                                                dialog: {
                                                  type: 'dialog',
                                                  title: '预览',
                                                  body: [
                                                    {
                                                      type: 'flex',
                                                      id: 'u:23c74e51b1bf',
                                                      className: 'p-1',
                                                      items: [
                                                        {
                                                          type: 'wrapper',
                                                          body: [
                                                            {
                                                              name: 'mycustom',
                                                              asFormItem: true,
                                                              children: ({ value }: any) => {
                                                                return (
                                                                  <NodeMediaPlayer
                                                                    cameraId={value}
                                                                  />
                                                                );
                                                              },

                                                              value: '${cameraId}',
                                                              id: 'u:a322298bd705',
                                                            },
                                                          ],
                                                          size: 'lg',
                                                          style: {
                                                            position: 'static',
                                                            display: 'flex',
                                                            flex: '1 1 auto',
                                                            flexGrow: 1,
                                                            flexBasis: '680px',
                                                            flexDirection: 'row',
                                                            flexWrap: 'nowrap',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                          },
                                                          isFixedHeight: false,
                                                          isFixedWidth: false,
                                                          id: 'u:b7a1f993e42d',
                                                        },
                                                      ],
                                                      style: {
                                                        position: 'static',
                                                      },
                                                      direction: 'row',
                                                      justify: 'flex-start',
                                                      alignItems: 'stretch',
                                                    },
                                                  ],
                                                  showCloseButton: true,
                                                  showErrorMsg: true,
                                                  showLoading: true,
                                                  id: 'u:4e43f1d2eb96',
                                                  closeOnEsc: false,
                                                  dataMapSwitch: false,
                                                  size: 'lg',
                                                  actions: [],
                                                },
                                                actionType: 'dialog',
                                              },
                                            ],
                                          },
                                        },
                                        id: 'u:9cb28ae6c433',
                                        level: 'link',
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                            size: 'xl',
                            type: 'dialog',
                            title: '配置',
                            className: 'app-popover',
                            closeOnEsc: false,
                            showLoading: true,
                            showErrorMsg: true,
                            closeOnOutside: false,
                            showCloseButton: true,
                            onEvent: {
                              cancel: {
                                weight: 0,
                                actions: [{ args: {}, actionType: 'closeDialog' }],
                              },
                              confirm: {
                                weight: 0,
                                actions: [
                                  {
                                    args: {
                                      api: {
                                        url: '/qs-dp/dpCameraConfig/add',
                                        data: {
                                          panelId: 2,
                                          cameraIds:
                                            '${carmeraList|pick:cameraId,cameraName,cameraType,cameraState|map}',
                                        },
                                        method: 'post',
                                        adaptor:
                                          'return {\r\n    msg: response.code === 200 ? api.messages.success : response.msg,\r\n    status: response.code === 200 ? 0 : response.code,\r\n    data: {\r\n      responseMsg: api.messages.success,\r\n    },\r\n  };',
                                        dataType: 'json',
                                        messages: { success: '配置成功', failed: '配置失败' },
                                        replaceData: true,
                                        requestAdaptor: '',
                                      },
                                      options: {},
                                    },
                                    outputVar: 'responseResult',
                                    actionType: 'ajax',
                                  },
                                  { args: {}, actionType: 'closeDialog' },
                                  {
                                    args: {},
                                    actionType: 'reload',
                                    componentId: 'u:0685f0cde132',
                                  },
                                ],
                              },
                            },
                          },
                          actionType: 'dialog',
                        },
                      ],
                    },
                  },
                },
                'bulkActions',
              ],
              perPageAvailable: [10],
              alwaysShowPagination: true,
            },
          ],
          type: 'panel',
          title: '排放系统监控视频',
          actions: [],
          affixFooter: false,
        },
        {
          id: 'u:9d250058539e',
          body: [
            {
              id: 'u:403fae6c21a4',
              api: {
                url: '/qs-dp/dpCameraConfig/page?pageNum=${pageNum}&pageSize=${pageSize}',
                method: 'post',
                data: {
                  panelId: 3,
                },
                adaptor: PageBeanAdaptor,
                dataType: 'json',
                messages: {},
                requestAdaptor: '',
              },
              type: 'crud',
              name: 'crud3',
              columns: [
                {
                  id: 'u:dabd2284fa97',
                  tpl: '${index+1}',
                  name: '',
                  type: 'tpl',
                  label: '序号',
                },
                {
                  id: 'u:f2d07be7215a5',
                  name: 'cameraName',
                  type: 'text',
                  label: '摄像头名称',
                },
                {
                  id: 'u:f2d07115a5',
                  name: 'cameraType',
                  type: 'text',
                  label: '摄像头类型',
                },
                {
                  id: 'u:f2d07115a5',
                  name: 'cameraState',
                  type: 'map',
                  label: '状态',
                  map: {
                    true: '在线',
                    false: '离线',
                  },
                },
                {
                  id: 'u:f2d07be7c5a5',
                  name: 'cameraId',
                  type: 'text',
                  label: '摄像头id',
                },
                {
                  id: 'u:45827c269f7e',
                  type: 'operation',
                  label: '操作',
                  buttons: [
                    {
                      id: 'u:b1fc6d2240c0',
                      api: {
                        url: '/qs-dp/dpCameraConfig/delete?id=${id}',
                        method: 'get',
                        adaptor:
                          'return {\r\n    msg: response.code === 200 ? api.messages.success : response.msg,\r\n    status: response.code === 200 ? 0 : response.code,\r\n    data: {\r\n      responseMsg: response.msg\r\n    },\r\n  };',
                        dataType: 'json',
                        messages: {
                          success: '删除成功',
                        },
                        requestAdaptor:
                          'return {\r\n    ...api,\r\n    config: {\r\n      ...api.config,\r\n      method: api.method,\r\n    },\r\n  };',
                      },
                      type: 'button',
                      label: '删除',
                      level: 'danger',
                      reload: 'crud3',
                      actionType: 'ajax',
                      confirmText: '确定要删除？',
                      confirmTitle: '删除',
                    },
                  ],
                },
              ],
              features: ['create', 'update', 'delete'],
              messages: {},
              initFetch: true,
              pageField: 'pageNum',
              affixHeader: false,
              bulkActions: [],
              itemActions: [],
              perPageField: 'pageSize',
              syncLocation: false,
              headerToolbar: [
                {
                  id: 'u:88fae22bbf39',
                  type: 'button',
                  label: '配置',
                  level: 'primary',
                  onEvent: {
                    click: {
                      weight: 0,
                      actions: [
                        {
                          args: {
                            api: {
                              url: '/qs-dp/dpCameraConfig/list_by_panel_id',
                              method: 'post',
                              dataType: 'json',
                              replaceData: true,
                              data: {
                                panelId: 3,
                              },
                              responseData: {
                                carmeraIdList: '${items}',
                              },
                            },
                            options: { silent: false },
                          },
                          outputVar: 'responseResult',
                          actionType: 'ajax',
                        },
                        {
                          dialog: {
                            id: 'u:6c1dab61',
                            body: [
                              {
                                id: 'u:8212sbbf39',
                                type: 'button',
                                label: '同步海康视频数据',
                                level: 'primary',
                                className: 'mb-4',
                                onEvent: {
                                  click: {
                                    actions: [
                                      {
                                        args: {
                                          api: {
                                            url: '/device-manger/camera/sync_camera',
                                            method: 'get',
                                            dataType: 'form',
                                            replaceData: true,
                                            adaptor:
                                              'return {\r\n    msg: response.code === 200 ? api.messages.success : response.msg,\r\n    status: response.code === 200 ? 0 : response.code,\r\n    data: {\r\n      responseMsg: response.msg\r\n    },\r\n  };',
                                            messages: {
                                              success: '同步完成',
                                            },
                                          },
                                          options: { silent: false },
                                        },
                                        actionType: 'ajax',
                                      },
                                      {
                                        args: {},
                                        actionType: 'reload',
                                        componentId: 'u:85d024b4bbc2',
                                      },
                                    ],
                                  },
                                },
                              },

                              {
                                id: 'u:85d024b4bbc2',
                                name: 'carmeraList',
                                type: 'transfer',
                                label: '红外监控摄像头',
                                modalMode: 'dialog',
                                embed: true,
                                multiple: true,
                                joinValues: false,
                                searchable: true,
                                selectMode: 'table',
                                resultSearchable: true,
                                resultListModeFollowSelect: true,
                                itemHeight: 50,
                                value: '${carmeraIdList}',
                                source: {
                                  url: '/systemsManage/qsManage/videoConfig/api/getCarmeraList',
                                  method: 'get',
                                  dataType: 'form',
                                  replaceData: true,
                                },
                                searchApi:
                                  '/systemsManage/qsManage/videoConfig/api/getCarmeraList?cameraName=${term|trim}',
                                labelField: 'cameraName',
                                valueField: 'cameraId',
                                columns: [
                                  {
                                    id: 'u:2ae125133bf3',
                                    name: 'index',
                                    type: 'text',
                                    label: '序号',
                                    labelClassName: 'text-center',
                                  },
                                  {
                                    id: 'u:1121',
                                    name: 'cameraName',
                                    type: 'text',
                                    label: '摄像头名称',
                                    labelClassName: 'text-center',
                                  },
                                  {
                                    id: 'u:1dsa213sa',
                                    name: 'cameraType',
                                    type: 'text',
                                    label: '摄像头类型',
                                    labelClassName: 'text-center',
                                  },
                                  {
                                    id: 'u:d6683a00c292',
                                    name: 'id',
                                    type: 'text',
                                    label: '摄像头ID',
                                    labelClassName: 'text-center white-space-nowrap ',
                                  },
                                  {
                                    id: 'u:a7067f81f3e8',
                                    name: 'online',
                                    type: 'map',
                                    label: '状态',
                                    labelClassName: 'text-center',
                                    map: {
                                      true: '在线',
                                      false: '离线',
                                    },
                                  },
                                  {
                                    id: 'u:45827c269f7e',
                                    type: 'operation',
                                    label: '操作',
                                    buttons: [
                                      {
                                        type: 'button',
                                        label: '预览',

                                        onEvent: {
                                          click: {
                                            actions: [
                                              {
                                                dialog: {
                                                  type: 'dialog',
                                                  title: '预览',
                                                  body: [
                                                    {
                                                      type: 'flex',
                                                      id: 'u:23c74e51b1bf',
                                                      className: 'p-1',
                                                      items: [
                                                        {
                                                          type: 'wrapper',
                                                          body: [
                                                            {
                                                              name: 'mycustom',
                                                              asFormItem: true,
                                                              children: ({ value }: any) => {
                                                                return (
                                                                  <NodeMediaPlayer
                                                                    cameraId={value}
                                                                  />
                                                                );
                                                              },

                                                              value: '${cameraId}',
                                                              id: 'u:a322298bd705',
                                                            },
                                                          ],
                                                          size: 'lg',
                                                          style: {
                                                            position: 'static',
                                                            display: 'flex',
                                                            flex: '1 1 auto',
                                                            flexGrow: 1,
                                                            flexBasis: '680px',
                                                            flexDirection: 'row',
                                                            flexWrap: 'nowrap',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                          },
                                                          isFixedHeight: false,
                                                          isFixedWidth: false,
                                                          id: 'u:b7a1f993e42d',
                                                        },
                                                      ],
                                                      style: {
                                                        position: 'static',
                                                      },
                                                      direction: 'row',
                                                      justify: 'flex-start',
                                                      alignItems: 'stretch',
                                                    },
                                                  ],
                                                  showCloseButton: true,
                                                  showErrorMsg: true,
                                                  showLoading: true,
                                                  id: 'u:4e43f1d2eb96',
                                                  closeOnEsc: false,
                                                  dataMapSwitch: false,
                                                  size: 'lg',
                                                  actions: [],
                                                },
                                                actionType: 'dialog',
                                              },
                                            ],
                                          },
                                        },
                                        id: 'u:9cb28ae6c433',
                                        level: 'link',
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                            size: 'xl',
                            type: 'dialog',
                            title: '配置',
                            className: 'app-popover',
                            closeOnEsc: false,
                            showLoading: true,
                            showErrorMsg: true,
                            closeOnOutside: false,
                            showCloseButton: true,
                            onEvent: {
                              cancel: {
                                weight: 0,
                                actions: [{ args: {}, actionType: 'closeDialog' }],
                              },
                              confirm: {
                                weight: 0,
                                actions: [
                                  {
                                    args: {
                                      api: {
                                        url: '/qs-dp/dpCameraConfig/add',
                                        data: {
                                          panelId: 3,
                                          cameraIds:
                                            '${carmeraList|pick:cameraId,cameraName,cameraType,cameraState|map}',
                                        },
                                        method: 'post',
                                        adaptor:
                                          'return {\r\n    msg: response.code === 200 ? api.messages.success : response.msg,\r\n    status: response.code === 200 ? 0 : response.code,\r\n    data: {\r\n      responseMsg: api.messages.success,\r\n    },\r\n  };',
                                        dataType: 'json',
                                        messages: { success: '配置成功', failed: '配置失败' },
                                        replaceData: true,
                                        requestAdaptor: '',
                                      },
                                      options: {},
                                    },
                                    outputVar: 'responseResult',
                                    actionType: 'ajax',
                                  },
                                  { args: {}, actionType: 'closeDialog' },
                                  {
                                    args: {},
                                    actionType: 'reload',
                                    componentId: 'u:403fae6c21a4',
                                  },
                                ],
                              },
                            },
                          },
                          actionType: 'dialog',
                        },
                      ],
                    },
                  },
                },
                'bulkActions',
              ],
              perPageAvailable: [10],
              alwaysShowPagination: true,
            },
          ],
          type: 'panel',
          title: '红外监控视频',
          actions: [],
          affixFooter: false,
        },
        {
          id: 'u:020c0da483eb',
          body: [
            {
              id: 'u:eae0c5946462',
              api: {
                url: '/qs-dp/dpCameraConfig/page?pageNum=${pageNum}&pageSize=${pageSize}',
                method: 'post',
                data: {
                  panelId: 4,
                },
                adaptor: PageBeanAdaptor,
                dataType: 'json',
                messages: {},
                requestAdaptor: '',
              },
              type: 'crud',
              name: 'crud4',
              columns: [
                {
                  id: 'u:dabd2284fa97',
                  tpl: '${index+1}',
                  name: '',
                  type: 'tpl',
                  label: '序号',
                },
                {
                  id: 'u:f2d07be7215a5',
                  name: 'cameraName',
                  type: 'text',
                  label: '摄像头名称',
                },
                {
                  id: 'u:f2d07115a5',
                  name: 'cameraType',
                  type: 'text',
                  label: '摄像头类型',
                },
                {
                  id: 'u:f2d07115a5',
                  name: 'cameraState',
                  type: 'map',
                  label: '状态',
                  map: {
                    true: '在线',
                    false: '离线',
                  },
                },
                {
                  id: 'u:f2d07be7c5a5',
                  name: 'cameraId',
                  type: 'text',
                  label: '摄像头id',
                },
                {
                  id: 'u:45827c269f7e',
                  type: 'operation',
                  label: '操作',
                  buttons: [
                    {
                      id: 'u:b1fc6d2240c0',
                      api: {
                        url: '/qs-dp/dpCameraConfig/delete?id=${id}',
                        method: 'get',
                        adaptor:
                          'return {\r\n    msg: response.code === 200 ? api.messages.success : response.msg,\r\n    status: response.code === 200 ? 0 : response.code,\r\n    data: {\r\n      responseMsg: response.msg\r\n    },\r\n  };',
                        dataType: 'json',
                        messages: {
                          success: '删除成功',
                        },
                        requestAdaptor:
                          'return {\r\n    ...api,\r\n    config: {\r\n      ...api.config,\r\n      method: api.method,\r\n    },\r\n  };',
                      },
                      type: 'button',
                      label: '删除',
                      level: 'danger',
                      reload: 'crud4',
                      actionType: 'ajax',
                      confirmText: '确定要删除？',
                      confirmTitle: '删除',
                    },
                  ],
                },
              ],
              features: ['create', 'update', 'delete'],
              messages: {},
              initFetch: true,
              pageField: 'pageNum',
              affixHeader: false,
              bulkActions: [],
              itemActions: [],
              perPageField: 'pageSize',
              syncLocation: false,
              headerToolbar: [
                {
                  id: 'u:88fae22bbf39',
                  type: 'button',
                  label: '配置',
                  level: 'primary',
                  onEvent: {
                    click: {
                      weight: 0,
                      actions: [
                        {
                          args: {
                            api: {
                              url: '/qs-dp/dpCameraConfig/list_by_panel_id',
                              method: 'post',
                              dataType: 'json',
                              replaceData: true,
                              data: {
                                panelId: 4,
                              },
                              responseData: {
                                carmeraIdList: '${items}',
                              },
                            },
                            options: { silent: false },
                          },
                          outputVar: 'responseResult',
                          actionType: 'ajax',
                        },
                        {
                          dialog: {
                            id: 'u:6c1dab612121',

                            body: [
                              {
                                id: 'u:8212sbbf39',
                                type: 'button',
                                label: '同步海康视频数据',
                                level: 'primary',
                                className: 'mb-4',
                                onEvent: {
                                  click: {
                                    actions: [
                                      {
                                        args: {
                                          api: {
                                            url: '/device-manger/camera/sync_camera',
                                            method: 'get',
                                            dataType: 'form',
                                            replaceData: true,
                                            adaptor:
                                              'return {\r\n    msg: response.code === 200 ? api.messages.success : response.msg,\r\n    status: response.code === 200 ? 0 : response.code,\r\n    data: {\r\n      responseMsg: response.msg\r\n    },\r\n  };',
                                            messages: {
                                              success: '同步完成',
                                            },
                                          },
                                          options: { silent: false },
                                        },
                                        actionType: 'ajax',
                                      },
                                      {
                                        args: {},
                                        actionType: 'reload',
                                        componentId: 'u:85d024b4bbc2',
                                      },
                                    ],
                                  },
                                },
                              },
                              {
                                id: 'u:85d024b4bbc2',
                                name: 'carmeraList',
                                type: 'transfer',
                                label: '视频监控看板1区摄像头',
                                modalMode: 'dialog',
                                embed: true,
                                multiple: true,
                                strictMode: false,
                                joinValues: false,
                                searchable: true,
                                selectMode: 'table',
                                resultSearchable: true,
                                resultListModeFollowSelect: true,
                                itemHeight: 50,
                                value: '${carmeraIdList}',
                                source: {
                                  url: '/systemsManage/qsManage/videoConfig/api/getCarmeraList',
                                  method: 'get',
                                  dataType: 'form',
                                  replaceData: true,
                                },
                                searchApi:
                                  '/systemsManage/qsManage/videoConfig/api/getCarmeraList?cameraName=${term|trim}',
                                labelField: 'cameraName',
                                valueField: 'cameraId',
                                searchPlaceholder: '请根据摄像头名称搜索',
                                resultSearchPlaceholder: '请根据摄像头名称搜索',
                                columns: [
                                  {
                                    id: 'u:2ae125133bf3',
                                    name: 'index',
                                    type: 'text',
                                    label: '序号',
                                    labelClassName: 'text-center',
                                  },
                                  {
                                    id: 'u:1121',
                                    name: 'cameraName',
                                    type: 'text',
                                    label: '摄像头名称',
                                    labelClassName: 'text-center',
                                  },
                                  {
                                    id: 'u:1dsa213sa',
                                    name: 'cameraType',
                                    type: 'text',
                                    label: '摄像头类型',
                                    labelClassName: 'text-center',
                                  },
                                  {
                                    id: 'u:d6683a00c292',
                                    name: 'id',
                                    type: 'text',
                                    label: '摄像头ID',
                                    labelClassName: 'text-center white-space-nowrap ',
                                  },
                                  {
                                    id: 'u:a7067f81f3e8',
                                    name: 'online',
                                    type: 'map',
                                    label: '状态',
                                    labelClassName: 'text-center',
                                    map: {
                                      true: '在线',
                                      false: '离线',
                                    },
                                  },
                                  {
                                    id: 'u:45827c269f7e',
                                    type: 'operation',
                                    label: '操作',
                                    buttons: [
                                      {
                                        type: 'button',
                                        label: '预览',

                                        onEvent: {
                                          click: {
                                            actions: [
                                              {
                                                dialog: {
                                                  type: 'dialog',
                                                  title: '预览',
                                                  body: [
                                                    {
                                                      type: 'flex',
                                                      id: 'u:23c74e51b1bf',
                                                      className: 'p-1',
                                                      items: [
                                                        {
                                                          type: 'wrapper',
                                                          body: [
                                                            {
                                                              name: 'mycustom',
                                                              asFormItem: true,
                                                              children: ({ value }: any) => {
                                                                return (
                                                                  <NodeMediaPlayer
                                                                    cameraId={value}
                                                                  />
                                                                );
                                                              },

                                                              value: '${cameraId}',
                                                              id: 'u:a322298bd705',
                                                            },
                                                          ],
                                                          size: 'lg',
                                                          style: {
                                                            position: 'static',
                                                            display: 'flex',
                                                            flex: '1 1 auto',
                                                            flexGrow: 1,
                                                            flexBasis: '680px',
                                                            flexDirection: 'row',
                                                            flexWrap: 'nowrap',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                          },
                                                          isFixedHeight: false,
                                                          isFixedWidth: false,
                                                          id: 'u:b7a1f993e42d',
                                                        },
                                                      ],
                                                      style: {
                                                        position: 'static',
                                                      },
                                                      direction: 'row',
                                                      justify: 'flex-start',
                                                      alignItems: 'stretch',
                                                    },
                                                  ],
                                                  showCloseButton: true,
                                                  showErrorMsg: true,
                                                  showLoading: true,
                                                  id: 'u:4e43f1d2eb96',
                                                  closeOnEsc: false,
                                                  dataMapSwitch: false,
                                                  size: 'lg',
                                                  actions: [],
                                                },
                                                actionType: 'dialog',
                                              },
                                            ],
                                          },
                                        },
                                        id: 'u:9cb28ae6c433',
                                        level: 'link',
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                            size: 'xl',
                            type: 'dialog',
                            title: '配置',
                            className: 'app-popover',
                            closeOnEsc: false,
                            showLoading: true,
                            showErrorMsg: true,
                            closeOnOutside: false,
                            showCloseButton: true,
                            onEvent: {
                              cancel: {
                                weight: 0,
                                actions: [{ args: {}, actionType: 'closeDialog' }],
                              },
                              confirm: {
                                weight: 0,
                                actions: [
                                  {
                                    args: {
                                      api: {
                                        url: '/qs-dp/dpCameraConfig/add',
                                        data: {
                                          panelId: 4,
                                          cameraIds:
                                            '${carmeraList|pick:cameraId,cameraName,cameraType,cameraState|map}',
                                        },
                                        method: 'post',
                                        adaptor:
                                          'return {\r\n    msg: response.code === 200 ? api.messages.success : response.msg,\r\n    status: response.code === 200 ? 0 : response.code,\r\n    data: {\r\n      responseMsg: api.messages.success,\r\n    },\r\n  };',
                                        dataType: 'json',
                                        messages: { success: '配置成功', failed: '配置失败' },
                                        replaceData: true,
                                        requestAdaptor: '',
                                      },
                                      options: {},
                                    },
                                    outputVar: 'responseResult',
                                    actionType: 'ajax',
                                  },
                                  { args: {}, actionType: 'closeDialog' },
                                  {
                                    args: {},
                                    actionType: 'reload',
                                    componentId: 'u:eae0c5946462',
                                  },
                                ],
                              },
                            },
                          },
                          actionType: 'dialog',
                        },
                      ],
                    },
                  },
                },
                'bulkActions',
              ],
              perPageAvailable: [10],
              alwaysShowPagination: true,
            },
          ],
          type: 'panel',
          title: '视频监控看板1区',
          actions: [],
          affixFooter: false,
        },
        {
          id: 'u:5a5d590632b4',
          body: [
            {
              id: 'u:a23f058dc3f8',
              api: {
                url: '/qs-dp/dpCameraConfig/page?pageNum=${pageNum}&pageSize=${pageSize}',
                method: 'post',
                data: {
                  panelId: 5,
                },
                adaptor: PageBeanAdaptor,
                dataType: 'json',
                messages: {},
                requestAdaptor: '',
              },
              type: 'crud',
              name: 'crud5',
              columns: [
                {
                  id: 'u:dabd2284fa97',
                  tpl: '${index+1}',
                  name: '',
                  type: 'tpl',
                  label: '序号',
                },
                {
                  id: 'u:f2d07be7215a5',
                  name: 'cameraName',
                  type: 'text',
                  label: '摄像头名称',
                },
                {
                  id: 'u:f2d07115a5',
                  name: 'cameraType',
                  type: 'text',
                  label: '摄像头类型',
                },
                {
                  id: 'u:f2d07115a5',
                  name: 'cameraState',
                  type: 'map',
                  label: '状态',
                  map: {
                    true: '在线',
                    false: '离线',
                  },
                },
                {
                  id: 'u:f2d07be7c5a5',
                  name: 'cameraId',
                  type: 'text',
                  label: '摄像头id',
                },
                {
                  id: 'u:45827c269f7e',
                  type: 'operation',
                  label: '操作',
                  buttons: [
                    {
                      id: 'u:b1fc6d2240c0',
                      api: {
                        url: '/qs-dp/dpCameraConfig/delete?id=${id}',
                        method: 'get',
                        adaptor:
                          'return {\r\n    msg: response.code === 200 ? api.messages.success : response.msg,\r\n    status: response.code === 200 ? 0 : response.code,\r\n    data: {\r\n      responseMsg: response.msg\r\n    },\r\n  };',
                        dataType: 'json',
                        messages: {
                          success: '删除成功',
                        },
                        requestAdaptor:
                          'return {\r\n    ...api,\r\n    config: {\r\n      ...api.config,\r\n      method: api.method,\r\n    },\r\n  };',
                      },
                      type: 'button',
                      label: '删除',
                      level: 'danger',
                      reload: 'crud5',
                      actionType: 'ajax',
                      confirmText: '确定要删除？',
                      confirmTitle: '删除',
                    },
                  ],
                },
              ],
              features: ['create', 'update', 'delete'],
              messages: {},
              initFetch: true,
              pageField: 'pageNum',
              affixHeader: false,
              bulkActions: [],
              itemActions: [],
              perPageField: 'pageSize',
              syncLocation: false,
              headerToolbar: [
                {
                  id: 'u:88fae22bbf39',
                  type: 'button',
                  label: '配置',
                  level: 'primary',
                  onEvent: {
                    click: {
                      weight: 0,
                      actions: [
                        {
                          args: {
                            api: {
                              url: '/qs-dp/dpCameraConfig/list_by_panel_id',
                              method: 'post',
                              dataType: 'json',
                              replaceData: true,
                              data: {
                                panelId: 5,
                              },
                              responseData: {
                                carmeraIdList: '${items}',
                              },
                            },
                            options: { silent: false },
                          },
                          outputVar: 'responseResult',
                          actionType: 'ajax',
                        },
                        {
                          dialog: {
                            id: 'u:2c1dab612121',

                            body: [
                              {
                                id: 'u:8212sbbf39',
                                type: 'button',
                                label: '同步海康视频数据',
                                level: 'primary',
                                className: 'mb-4',
                                onEvent: {
                                  click: {
                                    actions: [
                                      {
                                        args: {
                                          api: {
                                            url: '/device-manger/camera/sync_camera',
                                            method: 'get',
                                            dataType: 'form',
                                            replaceData: true,
                                            adaptor:
                                              'return {\r\n    msg: response.code === 200 ? api.messages.success : response.msg,\r\n    status: response.code === 200 ? 0 : response.code,\r\n    data: {\r\n      responseMsg: response.msg\r\n    },\r\n  };',
                                            messages: {
                                              success: '同步完成',
                                            },
                                          },
                                          options: { silent: false },
                                        },
                                        actionType: 'ajax',
                                      },
                                      {
                                        args: {},
                                        actionType: 'reload',
                                        componentId: 'u:85d024b4bbc2',
                                      },
                                    ],
                                  },
                                },
                              },
                              {
                                id: 'u:85d024b4bbc2',
                                name: 'carmeraList',
                                type: 'transfer',
                                label: '视频监控看板2区摄像头',
                                modalMode: 'dialog',
                                embed: true,
                                multiple: true,
                                strictMode: false,
                                joinValues: false,
                                searchable: true,
                                selectMode: 'table',
                                resultSearchable: true,
                                resultListModeFollowSelect: true,
                                itemHeight: 50,
                                value: '${carmeraIdList}',
                                source: {
                                  url: '/systemsManage/qsManage/videoConfig/api/getCarmeraList',
                                  method: 'get',
                                  dataType: 'form',
                                  replaceData: true,
                                },
                                searchApi:
                                  '/systemsManage/qsManage/videoConfig/api/getCarmeraList?cameraName=${term|trim}',
                                labelField: 'cameraName',
                                valueField: 'cameraId',
                                columns: [
                                  {
                                    id: 'u:2ae125133bf3',
                                    name: 'index',
                                    type: 'text',
                                    label: '序号',
                                    labelClassName: 'text-center',
                                  },
                                  {
                                    id: 'u:1121',
                                    name: 'cameraName',
                                    type: 'text',
                                    label: '摄像头名称',
                                    labelClassName: 'text-center',
                                  },
                                  {
                                    id: 'u:1dsa213sa',
                                    name: 'cameraType',
                                    type: 'text',
                                    label: '摄像头类型',
                                    labelClassName: 'text-center',
                                  },
                                  {
                                    id: 'u:d6683a00c292',
                                    name: 'id',
                                    type: 'text',
                                    label: '摄像头ID',
                                    labelClassName: 'text-center white-space-nowrap ',
                                  },
                                  {
                                    id: 'u:a7067f81f3e8',
                                    name: 'online',
                                    type: 'map',
                                    label: '状态',
                                    labelClassName: 'text-center',
                                    map: {
                                      true: '在线',
                                      false: '离线',
                                    },
                                  },
                                  {
                                    id: 'u:45827c269f7e',
                                    type: 'operation',
                                    label: '操作',
                                    buttons: [
                                      {
                                        type: 'button',
                                        label: '预览',

                                        onEvent: {
                                          click: {
                                            actions: [
                                              {
                                                dialog: {
                                                  type: 'dialog',
                                                  title: '预览',
                                                  body: [
                                                    {
                                                      type: 'flex',
                                                      id: 'u:23c74e51b1bf',
                                                      className: 'p-1',
                                                      items: [
                                                        {
                                                          type: 'wrapper',
                                                          body: [
                                                            {
                                                              name: 'mycustom',
                                                              asFormItem: true,
                                                              children: ({ value }: any) => {
                                                                return (
                                                                  <NodeMediaPlayer
                                                                    cameraId={value}
                                                                  />
                                                                );
                                                              },

                                                              value: '${cameraId}',
                                                              id: 'u:a322298bd705',
                                                            },
                                                          ],
                                                          size: 'lg',
                                                          style: {
                                                            position: 'static',
                                                            display: 'flex',
                                                            flex: '1 1 auto',
                                                            flexGrow: 1,
                                                            flexBasis: '680px',
                                                            flexDirection: 'row',
                                                            flexWrap: 'nowrap',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                          },
                                                          isFixedHeight: false,
                                                          isFixedWidth: false,
                                                          id: 'u:b7a1f993e42d',
                                                        },
                                                      ],
                                                      style: {
                                                        position: 'static',
                                                      },
                                                      direction: 'row',
                                                      justify: 'flex-start',
                                                      alignItems: 'stretch',
                                                    },
                                                  ],
                                                  showCloseButton: true,
                                                  showErrorMsg: true,
                                                  showLoading: true,
                                                  id: 'u:4e43f1d2eb96',
                                                  closeOnEsc: false,
                                                  dataMapSwitch: false,
                                                  size: 'lg',
                                                  actions: [],
                                                },
                                                actionType: 'dialog',
                                              },
                                            ],
                                          },
                                        },
                                        id: 'u:9cb28ae6c433',
                                        level: 'link',
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                            size: 'xl',
                            type: 'dialog',
                            title: '配置',
                            className: 'app-popover',
                            closeOnEsc: false,
                            showLoading: true,
                            showErrorMsg: true,
                            closeOnOutside: false,
                            showCloseButton: true,
                            onEvent: {
                              cancel: {
                                weight: 0,
                                actions: [{ args: {}, actionType: 'closeDialog' }],
                              },
                              confirm: {
                                weight: 0,
                                actions: [
                                  {
                                    args: {
                                      api: {
                                        url: '/qs-dp/dpCameraConfig/add',
                                        data: {
                                          panelId: 5,
                                          cameraIds:
                                            '${carmeraList|pick:cameraId,cameraName,cameraType,cameraState|map}',
                                        },
                                        method: 'post',
                                        adaptor:
                                          'return {\r\n    msg: response.code === 200 ? api.messages.success : response.msg,\r\n    status: response.code === 200 ? 0 : response.code,\r\n    data: {\r\n      responseMsg: api.messages.success,\r\n    },\r\n  };',
                                        dataType: 'json',
                                        messages: { success: '配置成功', failed: '配置失败' },
                                        replaceData: true,
                                        requestAdaptor: '',
                                      },
                                      options: {},
                                    },
                                    outputVar: 'responseResult',
                                    actionType: 'ajax',
                                  },
                                  { args: {}, actionType: 'closeDialog' },
                                  {
                                    args: {},
                                    actionType: 'reload',
                                    componentId: 'u:a23f058dc3f8',
                                  },
                                ],
                              },
                            },
                          },
                          actionType: 'dialog',
                        },
                      ],
                    },
                  },
                },
                'bulkActions',
              ],
              perPageAvailable: [10],
              alwaysShowPagination: true,
            },
          ],
          type: 'panel',
          title: '视频监控看板2区',
          actions: [],
          affixFooter: false,
        },
        {
          id: 'u:d816ff298610',
          body: [
            {
              id: 'u:a728a2e5a2ed',
              api: {
                url: '/qs-dp/dpCameraConfig/page?pageNum=${pageNum}&pageSize=${pageSize}',
                method: 'post',
                data: {
                  panelId: 6,
                },
                adaptor: PageBeanAdaptor,
                dataType: 'json',
                messages: {},
                requestAdaptor: '',
              },
              type: 'crud',
              name: 'crud6',
              columns: [
                {
                  id: 'u:dabd2284fa97',
                  tpl: '${index+1}',
                  name: '',
                  type: 'tpl',
                  label: '序号',
                },
                {
                  id: 'u:f2d07be7215a5',
                  name: 'cameraName',
                  type: 'text',
                  label: '摄像头名称',
                },
                {
                  id: 'u:f2d07115a5',
                  name: 'cameraType',
                  type: 'text',
                  label: '摄像头类型',
                },
                {
                  id: 'u:f2d07115a5',
                  name: 'cameraState',
                  type: 'map',
                  label: '状态',
                  map: {
                    true: '在线',
                    false: '离线',
                  },
                },
                {
                  id: 'u:f2d07be7c5a5',
                  name: 'cameraId',
                  type: 'text',
                  label: '摄像头id',
                },
                {
                  id: 'u:45827c269f7e',
                  type: 'operation',
                  label: '操作',
                  buttons: [
                    {
                      id: 'u:b1fc6d2240c0',
                      api: {
                        url: '/qs-dp/dpCameraConfig/delete?id=${id}',
                        method: 'get',
                        adaptor:
                          'return {\r\n    msg: response.code === 200 ? api.messages.success : response.msg,\r\n    status: response.code === 200 ? 0 : response.code,\r\n    data: {\r\n      responseMsg: response.msg\r\n    },\r\n  };',
                        dataType: 'json',
                        messages: {
                          success: '删除成功',
                        },
                        requestAdaptor:
                          'return {\r\n    ...api,\r\n    config: {\r\n      ...api.config,\r\n      method: api.method,\r\n    },\r\n  };',
                      },
                      type: 'button',
                      label: '删除',
                      level: 'danger',
                      reload: 'crud6',
                      actionType: 'ajax',
                      confirmText: '确定要删除？',
                      confirmTitle: '删除',
                    },
                  ],
                },
              ],
              features: ['create', 'update', 'delete'],
              messages: {},
              initFetch: true,
              pageField: 'pageNum',
              affixHeader: false,
              bulkActions: [],
              itemActions: [],
              perPageField: 'pageSize',
              syncLocation: false,
              headerToolbar: [
                {
                  id: 'u:88fae22bbf39',
                  type: 'button',
                  label: '配置',
                  level: 'primary',
                  onEvent: {
                    click: {
                      weight: 0,
                      actions: [
                        {
                          args: {
                            api: {
                              url: '/qs-dp/dpCameraConfig/list_by_panel_id',
                              method: 'post',
                              dataType: 'json',
                              replaceData: true,
                              data: {
                                panelId: 6,
                              },
                              responseData: {
                                carmeraIdList: '${items}',
                              },
                            },
                            options: { silent: false },
                          },
                          outputVar: 'responseResult',
                          actionType: 'ajax',
                        },
                        {
                          dialog: {
                            id: 'u:2c1dab612121',

                            body: [
                              {
                                id: 'u:8212sbbf39',
                                type: 'button',
                                label: '同步海康视频数据',
                                level: 'primary',
                                className: 'mb-4',
                                onEvent: {
                                  click: {
                                    actions: [
                                      {
                                        args: {
                                          api: {
                                            url: '/device-manger/camera/sync_camera',
                                            method: 'get',
                                            dataType: 'form',
                                            replaceData: true,
                                            adaptor:
                                              'return {\r\n    msg: response.code === 200 ? api.messages.success : response.msg,\r\n    status: response.code === 200 ? 0 : response.code,\r\n    data: {\r\n      responseMsg: response.msg\r\n    },\r\n  };',
                                            messages: {
                                              success: '同步完成',
                                            },
                                          },
                                          options: { silent: false },
                                        },
                                        actionType: 'ajax',
                                      },
                                      {
                                        args: {},
                                        actionType: 'reload',
                                        componentId: 'u:85d024b4bbc2',
                                      },
                                    ],
                                  },
                                },
                              },
                              {
                                id: 'u:85d024b4bbc2',
                                name: 'carmeraList',
                                type: 'transfer',
                                label: '视频监控看板3区摄像头',
                                modalMode: 'dialog',
                                embed: true,
                                multiple: true,
                                strictMode: false,
                                joinValues: false,
                                value: '${carmeraIdList}',
                                searchable: true,
                                selectMode: 'table',
                                resultSearchable: true,
                                resultListModeFollowSelect: true,
                                itemHeight: 50,
                                source: {
                                  url: '/systemsManage/qsManage/videoConfig/api/getCarmeraList',
                                  method: 'get',
                                  dataType: 'form',
                                  replaceData: true,
                                },
                                searchApi:
                                  '/systemsManage/qsManage/videoConfig/api/getCarmeraList?cameraName=${term|trim}',
                                labelField: 'cameraName',
                                valueField: 'cameraId',
                                searchPlaceholder: '请根据摄像头名称搜索',
                                resultSearchPlaceholder: '请根据摄像头名称搜索',

                                columns: [
                                  {
                                    id: 'u:2ae125133bf3',
                                    name: 'index',
                                    type: 'text',
                                    label: '序号',
                                    labelClassName: 'text-center',
                                  },
                                  {
                                    id: 'u:1121',
                                    name: 'cameraName',
                                    type: 'text',
                                    label: '摄像头名称',
                                    labelClassName: 'text-center',
                                  },
                                  {
                                    id: 'u:1dsa213sa',
                                    name: 'cameraType',
                                    type: 'text',
                                    label: '摄像头类型',
                                    labelClassName: 'text-center',
                                  },
                                  {
                                    id: 'u:d6683a00c292',
                                    name: 'id',
                                    type: 'text',
                                    label: '摄像头ID',
                                    labelClassName: 'text-center white-space-nowrap ',
                                  },
                                  {
                                    id: 'u:a7067f81f3e8',
                                    name: 'online',
                                    type: 'map',
                                    label: '状态',
                                    labelClassName: 'text-center',
                                    map: {
                                      true: '在线',
                                      false: '离线',
                                    },
                                  },
                                  {
                                    id: 'u:45827c269f7e',
                                    type: 'operation',
                                    label: '操作',
                                    buttons: [
                                      {
                                        type: 'button',
                                        label: '预览',

                                        onEvent: {
                                          click: {
                                            actions: [
                                              {
                                                dialog: {
                                                  type: 'dialog',
                                                  title: '预览',
                                                  body: [
                                                    {
                                                      type: 'flex',
                                                      id: 'u:23c74e51b1bf',
                                                      className: 'p-1',
                                                      items: [
                                                        {
                                                          type: 'wrapper',
                                                          body: [
                                                            {
                                                              name: 'mycustom',
                                                              asFormItem: true,
                                                              children: ({ value }: any) => {
                                                                return (
                                                                  <NodeMediaPlayer
                                                                    cameraId={value}
                                                                  />
                                                                );
                                                              },

                                                              value: '${cameraId}',
                                                              id: 'u:a322298bd705',
                                                            },
                                                          ],
                                                          size: 'lg',
                                                          style: {
                                                            position: 'static',
                                                            display: 'flex',
                                                            flex: '1 1 auto',
                                                            flexGrow: 1,
                                                            flexBasis: '680px',
                                                            flexDirection: 'row',
                                                            flexWrap: 'nowrap',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                          },
                                                          isFixedHeight: false,
                                                          isFixedWidth: false,
                                                          id: 'u:b7a1f993e42d',
                                                        },
                                                      ],
                                                      style: {
                                                        position: 'static',
                                                      },
                                                      direction: 'row',
                                                      justify: 'flex-start',
                                                      alignItems: 'stretch',
                                                    },
                                                  ],
                                                  showCloseButton: true,
                                                  showErrorMsg: true,
                                                  showLoading: true,
                                                  id: 'u:4e43f1d2eb96',
                                                  closeOnEsc: false,
                                                  dataMapSwitch: false,
                                                  size: 'lg',
                                                  actions: [],
                                                },
                                                actionType: 'dialog',
                                              },
                                            ],
                                          },
                                        },
                                        id: 'u:9cb28ae6c433',
                                        level: 'link',
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                            size: 'xl',
                            type: 'dialog',
                            title: '配置',
                            className: 'app-popover',
                            closeOnEsc: false,
                            showLoading: true,
                            showErrorMsg: true,
                            closeOnOutside: false,
                            showCloseButton: true,
                            onEvent: {
                              cancel: {
                                weight: 0,
                                actions: [{ args: {}, actionType: 'closeDialog' }],
                              },
                              confirm: {
                                weight: 0,
                                actions: [
                                  {
                                    args: {
                                      api: {
                                        url: '/qs-dp/dpCameraConfig/add',
                                        data: {
                                          panelId: 6,
                                          cameraIds:
                                            '${carmeraList|pick:cameraId,cameraName,cameraType,cameraState|map}',
                                        },
                                        method: 'post',
                                        adaptor:
                                          'return {\r\n    msg: response.code === 200 ? api.messages.success : response.msg,\r\n    status: response.code === 200 ? 0 : response.code,\r\n    data: {\r\n      responseMsg: api.messages.success,\r\n    },\r\n  };',
                                        dataType: 'json',
                                        messages: { success: '配置成功', failed: '配置失败' },
                                        replaceData: true,
                                        requestAdaptor: '',
                                      },
                                      options: {},
                                    },
                                    outputVar: 'responseResult',
                                    actionType: 'ajax',
                                  },
                                  { args: {}, actionType: 'closeDialog' },
                                  {
                                    args: {},
                                    actionType: 'reload',
                                    componentId: 'u:a728a2e5a2ed',
                                  },
                                ],
                              },
                            },
                          },
                          actionType: 'dialog',
                        },
                      ],
                    },
                  },
                },
                'bulkActions',
              ],
              perPageAvailable: [10],
              alwaysShowPagination: true,
            },
          ],
          type: 'panel',
          title: '视频监控看板3区',
          actions: [],
          affixFooter: false,
        },
      ],
      type: 'service',
    },
  ],
  regions: ['body'],
  pullRefresh: {
    disabled: true,
  },
  asideResizor: false,
};

const VideoConfig = () => {
  return (
    <div
      style={{
        overflowY: 'auto',
        height: '100%',
      }}
    >
      <AimsRender jsonView={data} />
    </div>
  );
};

export default VideoConfig;
