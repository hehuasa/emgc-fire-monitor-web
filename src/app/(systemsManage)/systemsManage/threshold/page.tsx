'use client';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Box } from '@chakra-ui/react';
import { DepartmentType } from '@/models/userManage';
import { useMemoizedFn, useMount } from 'ahooks';
import { request } from '@/utils/request';

const AimsRender = dynamic(() => import('@/components/AimsRender'), { ssr: false });

const data = {
  type: 'page',
  regions: ['body'],
  body: [
    {
      type: 'crud',
      name: 'crud',
      syncLocation: false,
      autoFillHeight: true,
      api: {
        method: 'post',
        url: '/systemsManage/threshold/api/thresholdPage',
        messages: {},
        replaceData: true,
        dataType: 'json',
        data: {
          pageBean: {
            currentPage: '$current',
            pageSize: '$size',
          },
          resourceNo: '${resourceNo|default}',
          equipmentId: '${equipmentId|default}',
          areaName: '${areaName|default}',
          orgName: '${orgName|default}',
        },
      },
      columns: [
        {
          name: 'index',
          label: '序号',
          id: 'u:c2fdef852ace',
          tpl: '${index + 1}',
          type: 'tpl',
        },
        {
          type: 'text',
          label: '部门',
          name: 'orgName',
          id: 'u:9d355bcf0f19',
        },
        {
          type: 'static',
          label: '装置',
          id: 'u:d989337f90ee',
          name: 'areaName',
        },
        {
          type: 'text',
          label: '生产单元',
          name: 'cellName',
          id: 'u:a329cb0c2693',
        },
        {
          type: 'text',
          label: '点位编号',
          name: 'resourceNo',
          id: 'u:a329cb0c2693',
        },
        {
          type: 'text',
          label: '设备编号',
          name: 'equipmentId',
          id: 'u:a329cb0c2693',
        },
        {
          type: 'text',
          label: '详细位置',
          name: 'address',
          id: 'u:c50e2d6d75e5',
        },
        {
          type: 'button-toolbar',
          label: '操作',
          id: 'u:d3424641af89',
          name: 'id',
          buttons: [
            {
              type: 'button',
              label: '详情',
              actionType: 'dialog',
              level: 'enhance',
              id: 'details',
              dialog: {
                type: 'dialog',
                title: '详情',
                body: {
                  type: 'form',
                  title: '详情',
                  mode: 'horizontal',
                  labelWidth: 150,
                  static: true,
                  body: [
                    {
                      type: 'input-text',
                      label: '部门',
                      name: 'orgName',
                    },
                    {
                      type: 'input-text',
                      label: '装置',
                      name: 'areaName',
                    },
                    {
                      type: 'input-text',
                      label: '生产单元',
                      name: 'cellName',
                    },
                    {
                      type: 'input-text',
                      label: '点位编号',
                      name: 'resourceNo',
                    },
                    {
                      type: 'input-text',
                      label: '设备编号',
                      name: 'equipmentId',
                    },
                    {
                      type: 'input-text',
                      label: '详细位置',
                      name: 'address',
                    },
                  ],
                  actions: [],
                },
                actions: [],
              },
            },
            {
              type: 'button',
              label: '修改',
              actionType: 'dialog',
              level: 'enhance',
              id: 'u:35f5d4a2acc5',
              dialog: {
                type: 'dialog',
                title: '修改',
                size: 'lg',
                body: [
                  {
                    type: 'my-threshold-add',
                    name: 'thresholdValue',
                    edit: true,
                  },
                ],
                id: 'u:df7b557b9a59',
                showCloseButton: true,
                closeOnEsc: false,
                showErrorMsg: false,
                showLoading: true,
                dataMapSwitch: false,
                actions: [],
              },
            },
            {
              type: 'button',
              label: '删除',
              id: 'u:8bd33adb5d8d',
              level: 'danger',
              onEvent: {
                click: {
                  actions: [
                    {
                      actionType: 'dialog',
                      dialog: {
                        type: 'dialog',
                        title: '删除',
                        body: [
                          {
                            type: 'static',
                            label: '',
                            tpl: '是否确认删除！',
                            id: 'u:129c99e4d3df',
                            borderMode: 'none',
                          },
                        ],
                        showCloseButton: true,
                        showErrorMsg: false,
                        showLoading: false,
                        id: 'u:d794473fc4b5',
                        actions: [
                          {
                            type: 'button-toolbar',
                            label: '',
                            buttons: [
                              {
                                type: 'button',
                                label: '取消',
                                onEvent: {
                                  click: {
                                    actions: [],
                                  },
                                },
                                id: 'u:4efd12b4290c',
                                close: true,
                                level: 'secondary',
                              },
                              {
                                type: 'button',
                                label: '确定',
                                onEvent: {
                                  click: {
                                    actions: [
                                      {
                                        args: {
                                          options: {
                                            silent: false,
                                          },
                                          api: {
                                            url: '/cx-alarm/alm/alarm_monitor/delete?id=${id}',
                                            method: 'get',
                                            dataType: 'form',
                                          },
                                        },
                                        outputVar: 'responseResult',
                                        actionType: 'ajax',
                                      },
                                      {
                                        actionType: 'toast',
                                        args: {
                                          msgType:
                                            '${event.data.responseStatus == 0?"success":"error"}',
                                          msg: '${event.data.responseMsg}',
                                        },
                                      },
                                      {
                                        componentId: 'u:3b9ae99790e9',
                                        args: {
                                          resetPage: false,
                                        },
                                        actionType: 'reload',
                                        data: null,
                                      },
                                    ],
                                  },
                                },
                                id: 'u:f425822a4e8a',
                                close: true,
                                level: 'primary',
                              },
                            ],
                            id: 'u:3f64f28b006f',
                          },
                        ],
                        size: 'sm',
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
      ],
      bulkActions: [],
      itemActions: [],
      features: ['filter'],
      filterColumnCount: 3,
      id: 'u:3b9ae99790e9',
      perPageAvailable: [10, 20, 50],
      messages: {},
      filter: {
        title: '查询条件',
        body: [
          {
            type: 'form',
            title: '查询条件',
            target:
              'crud?resourceNo=${resourceNo}&equipmentId=${equipmentId}&areaName=${areaNameObj.areaName}&orgName=${orgName}',
            body: [
              {
                type: 'tree-select',
                label: '部门',
                name: 'orgName',
                clearable: true,
                source: '${depart}',
                id: 'u:55846cf005a2',
                placeholder: '请选择部门',
                labelClassName: 'm-l',
                inputClassName: 'w',
                searchable: true,
                hideNodePathLabel: true,
                multiple: false,
                enableNodePath: false,
                showIcon: true,
                initiallyOpen: true,
                labelField: 'orgName',
                valueField: 'orgName',
              },
              {
                type: 'picker',
                label: '装置',
                name: 'areaNameObj',
                multiple: false,
                joinValues: false,
                valueField: 'areaName',
                labelField: 'areaName',
                source: {
                  method: 'get',
                  url: '/cx-alarm/dc/area/page',
                  messages: {},
                  dataType: 'json',
                  replaceData: true,
                  data: {
                    current: '${pageIndex}',
                    size: '${pageSize}',
                    areaName: '${keyword}',
                  },
                },
                // value: '${areaName}',
                size: 'md',
                pickerSchema: {
                  mode: 'table',
                  name: 'thelist',
                  headerToolbar: {
                    wrapWithPanel: false,
                    type: 'form',
                    className: 'text-right',
                    target: 'thelist',
                    mode: 'inline',
                    body: [
                      {
                        type: 'input-text',
                        name: 'keyword',
                        addOn: {
                          type: 'submit',
                          label: '查询',
                          level: 'primary',
                          icon: 'fa fa-search pull-left',
                          id: 'u:228612364ec4',
                        },
                        id: 'u:11c46f968fbf',
                        placeholder: '请根据装置名称查询',
                      },
                    ],
                    id: 'u:c9d4a9141c9b',
                  },
                  columns: [
                    {
                      name: 'areaId',
                      label: '序号',
                      sortable: true,
                      type: 'tpl',
                      tpl: '${index+1}',
                      toggled: true,
                      id: 'u:5daeec514e9c',
                    },
                    {
                      name: 'areaName',
                      label: '装置名称',
                      sortable: true,
                      type: 'text',
                      toggled: true,
                      id: 'u:5dfbd2a18c4b',
                    },
                  ],
                  id: 'u:f70f40efbcbb',
                  bulkActions: [],
                  alwaysShowPagination: true,
                  perPageAvailable: [10],
                  affixHeader: false,
                  messages: {},
                  pageField: 'pageIndex',
                  perPageField: 'pageSize',
                  footerToolbar: [
                    'statistics',
                    {
                      type: 'pagination',
                      align: 'left',
                    },
                    // {
                    //   type: 'button-toolbar',
                    //   align: 'right',
                    //   label: '',
                    //   buttons: [
                    //     {
                    //       type: 'button',
                    //       label: '取消',
                    //       onEvent: {
                    //         click: {
                    //           actions: [
                    //             {
                    //               args: {},
                    //               actionType: 'closeDialog',
                    //             },
                    //           ],
                    //         },
                    //       },
                    //       id: 'u:673f128bc908',
                    //       close: true,
                    //       level: 'secondary',
                    //     },
                    //     {
                    //       type: 'button',
                    //       label: '确定',
                    //       onEvent: {
                    //         click: {
                    //           actions: [
                    //             {
                    //               args: {
                    //                 options: {
                    //                   silent: false,
                    //                 },
                    //                 api: {
                    //                   url: '/api/system/role/setUser',
                    //                   method: 'post',
                    //                   messages: {
                    //                     success: '添加成功！',
                    //                     failed: '添加失败',
                    //                   },
                    //                   dataType: 'json',
                    //                   replaceData: false,
                    //                   data: {
                    //                     userIds: '${areaName|pick:id|map}',
                    //                     id: '${id}',
                    //                   },
                    //                 },
                    //               },
                    //               outputVar: 'responseResult',
                    //               actionType: 'ajax',
                    //             },
                    //             {
                    //               componentId: 'u:cdf19c33cba3',
                    //               args: {},
                    //               actionType: 'reload',
                    //             },
                    //           ],
                    //         },
                    //       },
                    //       id: 'u:876758fc163e',
                    //       close: true,
                    //       level: 'primary',
                    //     },
                    //   ],
                    //   id: 'u:3ac6b62100a1',
                    // },
                  ],
                },
                id: 'u:c16236fc3654',
                modalMode: 'dialog',
                labelClassName: 'm-l',
                inputClassName: 'w',
              },
              {
                type: 'input-text',
                label: '设备编号',
                name: 'equipmentId',
                id: 'u:91932ebc1a6b',
                className: 'm-l',
                inputClassName: 'w',
                placeholder: '请输入设备编号',
                clearable: true,
              },
              {
                name: 'resourceNo',
                type: 'input-text',
                label: '点位编号',
                id: 'u:5d7fe78661f6',
                className: 'm-l',
                inputClassName: 'w',
                placeholder: '请输入点位编号',
                clearable: true,
              },
            ],
            mode: 'inline',
            id: 'u:c4ad86e24b0a',
            rules: [],
            actions: [
              {
                type: 'container',
                body: [
                  {
                    type: 'container',
                    body: [
                      {
                        type: 'input-file',
                        label: '',
                        autoUpload: true,
                        proxy: false,
                        uploadType: 'fileReceptor',
                        name: 'file',
                        id: 'u:ba2dd3ff91a8',
                        btnLabel: '覆盖导入',
                        multiple: false,
                        useChunk: false,
                        accept: '',
                        drag: false,
                        btnUploadClassName: '',
                        btnClassName: 'bg-success text-white m-none',
                        mode: 'inline',
                        receiver: {
                          url: '/cx-alarm/alm/alarm_monitor/cover_import_monitor',
                          method: 'post',
                          requestAdaptor: '',
                          adaptor: '',
                          messages: {},
                          responseData: {
                            '&': '$$',
                          },
                          data: {
                            clearLinked: true,
                          },
                        },
                        onEvent: {
                          success: {
                            weight: 0,
                            actions: [
                              {
                                componentId: 'u:46a4edd368ea',
                                args: {
                                  resetPage: false,
                                },
                                actionType: 'reload',
                                data: null,
                              },
                            ],
                          },
                          fail: {
                            weight: 0,
                            actions: [
                              {
                                args: {
                                  msgType: 'error',
                                  position: 'top-right',
                                  closeButton: true,
                                  showIcon: true,
                                  msg: '上传失败',
                                  className: 'theme-toast-action-scope',
                                },
                                actionType: 'toast',
                              },
                            ],
                          },
                        },
                      },
                      {
                        type: 'input-file',
                        label: '',
                        autoUpload: true,
                        proxy: false,
                        uploadType: 'fileReceptor',
                        name: 'file',
                        id: 'u:db9b1617962d',
                        btnLabel: '追加导入',
                        multiple: false,
                        useChunk: false,
                        accept: '',
                        drag: false,
                        btnUploadClassName: '',
                        btnClassName: 'bg-success text-white m-r',
                        receiver: {
                          url: '/cx-alarm/alm/alarm_monitor/add_import_monitor',
                          method: 'post',
                          requestAdaptor: '',
                          adaptor: '',
                          messages: {},
                          data: {
                            clearLinked: false,
                          },
                        },
                        onEvent: {
                          success: {
                            weight: 0,
                            actions: [
                              {
                                componentId: 'u:46a4edd368ea',
                                actionType: 'reload',
                                args: {
                                  resetPage: false,
                                },
                                data: null,
                              },
                            ],
                          },
                          fail: {
                            weight: 0,
                            actions: [
                              {
                                args: {
                                  msgType: 'error',
                                  position: 'top-right',
                                  closeButton: true,
                                  showIcon: true,
                                  msg: '上传失败',
                                  className: 'theme-toast-action-scope',
                                },
                                actionType: 'toast',
                              },
                            ],
                          },
                        },
                      },
                      {
                        type: 'button',
                        label: '下载模板',
                        onEvent: {
                          click: {
                            actions: [
                              {
                                args: {
                                  api: {
                                    url: '/cx-alarm/alm/alarm_monitor/rule-template',
                                    method: 'get',
                                    requestAdaptor: '',
                                    adaptor: '',
                                    messages: {},
                                    responseType: 'blob',
                                    headers: {
                                      name: '监控项目导入模板.xlsx',
                                    },
                                  },
                                },
                                actionType: 'download',
                              },
                            ],
                          },
                        },
                        id: 'u:d11a34483c72',
                        level: 'enhance',
                        block: false,
                        icon: 'fa fa-download',
                        themeCss: {
                          className: {
                            'padding-and-margin:default': {
                              marginLeft: '0',
                              marginTop: '',
                              marginRight: '',
                              marginBottom: '',
                            },
                          },
                        },
                        className: 'className-d11a34483c72',
                      },
                    ],
                    style: {
                      position: 'static',
                      display: 'flex',
                      flex: '0 0 auto',
                      paddingTop: '4px',
                      overflowX: 'auto',
                      height: '40px',
                      overflowY: 'hidden',
                      flexWrap: 'nowrap',
                      justifyContent: 'center',
                    },
                    wrapperBody: false,
                    id: 'u:f74b2e7c73ee',
                    isFixedHeight: true,
                  },
                  {
                    type: 'container',
                    body: [
                      {
                        type: 'submit',
                        label: '查询',
                        id: 'u:57d6dfdfb28b',
                        level: 'primary',
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
                      {
                        type: 'button',
                        label: '新增',
                        actionType: 'dialog',
                        dialog: {
                          type: 'dialog',
                          title: '新增阈值',
                          size: 'lg',
                          body: [
                            {
                              type: 'my-threshold-add',
                              name: 'thresholdValue',
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
                        id: 'u:119c1c51d20c',
                        level: 'success',
                      },
                    ],
                    style: {
                      position: 'static',
                      display: 'flex',
                      flex: '0 0 auto',
                      flexWrap: 'nowrap',
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                    wrapperBody: false,
                    id: 'u:7b92d41aab8e',
                    isFixedHeight: false,
                  },
                ],
                style: {
                  position: 'static',
                  display: 'flex',
                  flexWrap: 'nowrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '0rem',
                  paddingRight: '2rem',
                  paddingBottom: '0rem',
                  paddingLeft: '2rem',
                  height: '40px',
                  overflowY: 'auto',
                },
                wrapperBody: false,
                id: 'u:5d6721174762',
                isFixedHeight: true,
                isFixedWidth: false,
                size: '',
              },
            ],
          },
        ],
        id: 'u:052aecbf1622',
        actions: [],
        wrapWithPanel: false,
        mode: 'inline',
        reload: 'crud',
      },
      initFetch: true,
      headerToolbar: [
        {
          type: 'filter-toggler',
          align: 'left',
        },
      ],
      alwaysShowPagination: true,
      pageField: 'current',
      perPageField: 'size',
      defaultParams: {
        current: 1,
        size: 10,
      },
      footerToolbar: [
        {
          type: 'statistics',
        },
        {
          type: 'pagination',
        },
        {
          id: 'u:4567916ff3cf',
          tpl: '内容',
          type: 'switch-per-page',
          align: 'right',
          wrapperComponent: '',
        },
      ],
    },
  ],
  id: 'u:a5652b0c6352',
  pullRefresh: {
    disabled: true,
  },
};

const Threshold = () => {
  const [departData, setDepartData] = useState<Array<DepartmentType>>([]);
  //请求部门数据
  const getDepartmentData = useMemoizedFn(async () => {
    const { data, code } = await request({
      url: `/ms-system/user/list-org-tree`,
      options: {
        method: 'GET',
      },
    });
    if (code == 200) {
      setDepartData(data as unknown as Array<DepartmentType>);
    }
  });

  useMount(() => {
    getDepartmentData();
  });

  return (
    <Box h={'full'}>
      <AimsRender jsonView={data} props={{ depart: departData }} />
    </Box>
  );
};

export default Threshold;
