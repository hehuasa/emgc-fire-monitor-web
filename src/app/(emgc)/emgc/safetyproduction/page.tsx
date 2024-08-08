'use client';
import React from 'react';
import dynamic from 'next/dynamic';

const AimsRender = dynamic(() => import('@/components/AimsRender'), { ssr: false });
const ReactPDF = dynamic(() => import('@/components/AimsCustomComponent/pdfView'), { ssr: false });

const data = {
  type: 'page',
  title: '预案名称',
  body: [
    {
      type: 'crud',
      id: 'u: 75380b086142',
      name: 'crud',
      filter: {
        title: '',
        mode: 'inline',
        wrapWithPanel: false,
        submitText: '',
        className: 'm-b m-r m-t m m-l p p-t p-r p-b p-l',
        id: 'u: 6a96830bb29a',
        body: [
          {
            type: 'input-text',
            label: '预案名称',
            name: 'planName',
            id: 'u: 64c6eb1eda3c',
            placeholder: '请输入预案名称',
            validations: {
              maxLength: 20,
            },
            mode: 'inline',
            size: 'md',
            clearable: true,
          },
          {
            type: 'button',
            label: '搜索',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'broadcast',
                    args: {
                      eventName: 'search',
                    },
                    data: {
                      planName: '${planName}',
                    },
                  },
                ],
              },
            },
            id: 'u: 87342d9f3e62',
            level: 'primary',
            icon: 'fa fa-search',
          },
          {
            type: 'button',
            label: '新增',
            actionType: 'dialog',
            dialog: {
              title: '新增预案',
              body: {
                type: 'form',
                body: [
                  {
                    type: 'input-text',
                    label: '预案名称',
                    name: 'planName',
                    id: 'u:a9d8743449b5',
                    mode: 'horizontal',
                    size: 'md',
                  },
                  {
                    type: 'select',
                    label: '预案类型',
                    name: 'planType',
                    source: {
                      url: '/api/alarmPlanEntity/dict',
                      method: 'get',
                      messages: {},
                      dataType: 'json',
                      data: {
                        dictCode: 'alarm_type',
                      },
                      replaceData: true,
                    },
                    id: 'u: 815a61c19f3e',
                    multiple: false,
                    mode: 'horizontal',
                    size: 'md',
                  },
                  {
                    type: 'input-file',
                    label: '预案附件',
                    autoUpload: true,
                    proxy: true,
                    asBlob: false,
                    fileField: 'multipartFile',
                    receiver: {
                      url: '/api/alarmPlanEntity/upload',
                      method: 'post',
                      dataType: 'form-data',
                    },
                    id: 'u:71eafc6a697a',
                    btnLabel: '上传预案附件',
                    multiple: false,
                    useChunk: false,
                    accept: '.txt,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf',
                    drag: false,
                    mode: 'horizontal',
                    autoFill: {
                      realFileName: '${realFileName}',
                      planFileAddr: '${url}',
                    },
                  },
                ],
                showCloseButton: true,
                showErrorMsg: false,
                showLoading: true,
              },
              actions: [
                {
                  type: 'button',
                  label: '取消',
                  id: 'u: 4c0c3da0ff2f',
                  actionType: 'cancel',
                },
                {
                  type: 'button',
                  label: '提交',
                  primary: true,
                  close: true,
                  reload: 'crud',
                  actionType: 'ajax',
                  api: {
                    url: '/api/alarmPlanEntity/add',
                    method: 'post',
                    dataType: 'json',
                    data: {
                      '&': '$$',
                      realFileName: '${realFileName}',
                      planFileAddr: '${planFileAddr}',
                    },
                  },
                },
              ],
            },
            id: 'u:cb7f0f596403',
            level: 'success',
            icon: 'fa fa-plus',
            block: false,
            size: 'md',
          },
          // {
          //   type: 'button',
          //   level: 'danger',
          //   label: '批量删除',
          //   actionType: 'ajax',
          //   confirmText: '确定要删除？',
          //   api: {
          //     url: '/api/alarmPlanEntity/delete',
          //     method: 'post',
          //     dataType: 'json',
          //     data: {
          //       strings: '${id|asArray}',
          //     },
          //   },
          //   id: 'u:671c6d80f03b',
          // },
        ],
      },
      columns: [
        {
          name: 'index',
          type: 'tpl',
          label: '序号',
          sortable: true,
          id: 'u:362eb544292e',
          tpl: '${index+1}',
        },
        {
          name: 'planName',
          label: '预案名称',
          sortable: true,
          id: 'u: 0c7e527fa3c5',
          placeholder: '-',
        },
        {
          name: 'planType',
          label: '预案类型',
          sortable: true,
          id: 'u: 1e46d74eac05',
          placeholder: '-',
        },
        {
          name: 'realFileName',
          label: '文件名称',
        },
        {
          name: 'createdTime',
          label: '上传时间',
          id: 'u:a84c101f8fb3',
          placeholder: '-',
          type: 'tpl',
          tpl: "<%= formatDate(data.createdTime, format='LLL') %>",
        },
        {
          name: 'createdBy',
          label: '上传人',
          id: 'u: 1c170525a038',
          placeholder: '-',
        },
        {
          type: 'operation',
          label: '操作',
          width: '',
          name: 'id',
          buttons: [
            {
              type: 'button-group',
              buttons: [
                {
                  type: 'button',
                  label: '预览',
                  level: 'info',
                  actionType: 'dialog',
                  dialog: {
                    title: '预览',
                    size: 'xl',
                    body: [
                      {
                        type: 'custom',
                        label: '自定义组件',
                        component: ReactPDF,
                      },
                    ],
                  },
                },
                {
                  type: 'button',
                  label: '修改',
                  level: 'info',
                  actionType: 'dialog',
                  id: 'u: 2a074567d955',
                  className: 'r',
                  dialog: {
                    title: '修改预案',
                    body: {
                      type: 'form',
                      label: '',
                      title: '',
                      body: [
                        {
                          type: 'input-text',
                          label: '预案名称',
                          name: 'planName',
                          id: 'u:a9d8743449b5',
                          mode: 'horizontal',
                          size: 'md',
                        },
                        {
                          type: 'select',
                          label: '预案类型',
                          name: 'planType',
                          source: {
                            url: '/api/alarmPlanEntity/dict',
                            method: 'get',
                            dataType: 'json',
                            data: {
                              dictCode: 'alarm_type',
                            },
                            replaceData: true,
                          },
                          id: 'u: 815a61c19f3e',
                          multiple: false,
                          mode: 'horizontal',
                          size: 'md',
                        },
                        {
                          type: 'input-file',
                          label: '预案附件',
                          autoUpload: true,
                          proxy: true,
                          asBlob: false,
                          fileField: 'multipartFile',
                          receiver: {
                            url: '/api/alarmPlanEntity/upload',
                            method: 'post',
                            dataType: 'form-data',
                          },
                          id: 'u:71eafc6a697a',
                          btnLabel: '上传预案附件',
                          multiple: false,
                          useChunk: false,
                          accept: '.txt,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf',
                          drag: false,
                          mode: 'horizontal',
                          autoFill: {
                            realFileName: '${realFileName}',
                            planFileAddr: '${url}',
                          },
                        },
                      ],
                      showCloseButton: true,
                      actions: [],
                      wrapperBody: false,
                      isFixedWidth: false,
                      wrapperComponent: 'div',
                      mode: 'inline',
                      className: '',
                      panelClassName: '',
                      wrapWithPanel: false,
                    },
                    actions: [
                      {
                        type: 'button',
                        label: '取消',
                        id: 'u: 4c0c3da0ff2f',
                        actionType: 'cancel',
                      },
                      {
                        type: 'button',
                        label: '提交',
                        actionType: 'ajax',
                        primary: true,
                        close: true,
                        reload: 'crud',
                        api: {
                          url: '/api/alarmPlanEntity/update',
                          method: 'post',
                          dataType: 'json',
                          data: {
                            '&': '$$',
                            id: '${id}',
                            realFileName: '${realFileName}',
                            planFileAddr: '${planFileAddr}',
                          },
                        },
                      },
                    ],
                    closeOnEsc: true,
                    dataMapSwitch: false,
                    dataMap: null,
                    data: null,
                  },
                },
                {
                  type: 'button',
                  label: '删除',
                  level: 'danger',
                  actionType: 'ajax',
                  confirmText: '您确认要删除?',
                  className: 'r',
                  reload: 'crud',
                  api: {
                    url: '/api/alarmPlanEntity/delete',
                    method: 'post',
                    dataType: 'json',
                    data: {
                      strings: '${id|asArray}',
                    },
                  },
                },
              ],
              id: 'u: 4566566b8124',
              tiled: false,
              btnClassName: 'm',
            },
          ],
          placeholder: '-',
          fixed: 'right',
          id: 'u:f96cc5f32544',
        },
      ],
      className: 'p-0',
      bulkActions: [],
      affixHeader: true,
      columnsTogglable: false,
      placeholder: '暂无数据',
      tableClassName: 'table-db table-striped',
      headerClassName: 'crud-table-header',
      footerClassName: 'crud-table-footer',
      toolbarClassName: 'crud-table-toolbar',
      bodyClassName: 'panel-default',
      defaultParams: {
        current: 1,
        size: 10,
      },
      pageField: 'current',
      perPageField: 'size',
      perPageAvailable: [10, 20],
      syncLocation: false,
      api: {
        url: '/api/alarmPlanEntity/page',
        method: 'post',
        dataType: 'json',
        data: {
          planType: '${tree}',
          planName: '${planName}',
          page: {
            current: '${current}',
            size: '${size}',
          },
        },
        replaceData: true,
      },
      initFetch: true,
      itemActions: [],
      footerToolbar: ['switch-per-page', 'statistics', 'pagination'],
      autoJumpToTopOnPagerChange: true,
      alwaysShowPagination: true,
      onEvent: {
        search: {
          actions: [
            {
              actionType: 'reload',
              data: {
                planName: '${planName}',
                page: {
                  current: '${current}',
                  size: '${size}',
                },
              },
            },
          ],
        },
      },
    },
  ],
  className: 'p-0',
  toolbar: [],
  remark: null,
  name: 'planname',
  asideResizor: false,
  pullRefresh: {
    disabled: true,
  },
  regions: ['body', 'header', 'aside'],
  affixHeader: false,

  id: 'u:968dc3a83714',
  asideClassName: 'w-md',
  aside: {
    type: 'form',
    wrapWithPanel: false,
    target: 'crud',
    submitOnInit: true,
    body: [
      {
        type: 'input-tree',
        name: 'tree',
        label: '',
        inputClassName: 'no-border',
        showIcon: false,
        submitOnChange: true,
        labelField: 'label',
        valueField: 'value',
        source: {
          url: '/api/alarmPlanEntity/dict',
          method: 'get',
          messages: {},
          dataType: 'json',
          data: {
            dictCode: 'alarm_type',
          },
          replaceData: true,
        },
        // onEvent: {
        //   change: {
        //     actions: [
        //       {
        //         type: 'action',
        //         actionType: 'reload',
        //         target: 'crud?name=${dictCode}',
        //       },
        //     ],
        //   },
        // },
      },
    ],
  },
};
const Safetyproduction = () => {
  return <AimsRender jsonView={data} />;
};

export default Safetyproduction;
