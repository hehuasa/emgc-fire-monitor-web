'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import { Box } from '@chakra-ui/react';
import { CurdAdaptor, DeleteRequestAdaptor, PageBeanAdaptor } from '@/components/AmisAdaptor';

const AimsRender = dynamic(() => import('@/components/AimsRender'), { ssr: false });

const data = {
  type: 'page',
  title: '岗位管理',
  body: [
    {
      type: 'crud',
      syncLocation: false,
      autoFillHeight: true,
      api: {
        method: 'get',
        url: '/ms-system/position/list/page',
        adaptor: PageBeanAdaptor,
        messages: {},
        replaceData: true,
        data: {
          '&': '$$',
          pageIndex: '${pageIndex}',
          pageSize: '${pageSize}',
        },
      },
      columns: [
        {
          name: 'id',
          label: '序号',
          type: 'tpl',
          tpl: '${index+1}',
          id: 'u:6b9b16059b99',
        },
        {
          name: 'positionName',
          label: '岗位名称',
          type: 'text',
          id: 'u:6176e7010e37',
        },
        {
          type: 'text',
          label: '岗位职责',
          name: 'positionDuty',
          id: 'u:410709b53a12',
          width: '40%',
        },
        {
          type: 'text',
          label: '备注',
          name: 'remark',
          id: 'u:d24e8792a5d2',
          width: '40%',
        },
        {
          type: 'operation',
          label: '操作',
          name: 'id',
          buttons: [
            {
              label: '修改',
              type: 'button',
              level: 'enhance',
              id: 'u:363f6bc3980c',
              onEvent: {
                click: {
                  actions: [
                    {
                      dialog: {
                        type: 'dialog',
                        title: '修改岗位',
                        body: [
                          {
                            type: 'form',
                            id: 'u:68ba0fcca01e',
                            title: '表单',
                            body: [
                              {
                                label: '岗位名称',
                                type: 'input-text',
                                name: 'positionName',
                                id: 'u:9df2eeffba69',
                                clearable: true,
                                required: true,
                                placeholder: '请输入岗位名称',
                              },
                              {
                                type: 'input-text',
                                label: '岗位编码',
                                name: 'positionCode',
                                id: 'u:e58bad14b345',
                                clearable: true,
                                required: true,
                                placeholder: '请输入岗位编码',
                              },
                              {
                                type: 'textarea',
                                label: '岗位职责',
                                name: 'positionDuty',
                                id: 'u:21bb965dad1f',
                                minRows: 3,
                                maxRows: 20,
                                placeholder: '请输入岗位职责',
                              },
                              {
                                type: 'textarea',
                                label: '备注',
                                name: 'remark',
                                id: 'u:22b9fd94d53a',
                                minRows: 3,
                                maxRows: 20,
                                placeholder: '请输入备注',
                              },
                            ],

                            mode: 'horizontal',
                            reload: 'schema',
                            resetAfterSubmit: true,
                          },
                        ],
                        showCloseButton: true,
                        showErrorMsg: false,
                        showLoading: false,
                        id: 'u:20adaef30ebe',
                        closeOnEsc: true,
                        actions: [
                          {
                            type: 'button-toolbar',
                            label: '',
                            buttons: [
                              {
                                type: 'button',
                                label: '取消',
                                id: 'u:80969c5ab8b9',
                                close: true,
                                level: 'secondary',
                              },
                              {
                                type: 'submit',
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
                                            url: '/ms-system/position/edit/${id}',
                                            method: 'post',
                                            messages: {
                                              success: '修改成功',
                                            },
                                            adaptor: CurdAdaptor,
                                            dataType: 'json',
                                            data: {
                                              '&': '$$',
                                            },
                                          },
                                        },
                                        actionType: 'ajax',
                                      },
                                      {
                                        componentId: 'u:f0098fabb968',
                                        args: {
                                          resetPage: false,
                                        },
                                        actionType: 'reload',
                                        data: null,
                                      },
                                    ],
                                  },
                                },
                                id: 'u:3bee5671ce33',
                                close: true,
                                level: 'primary',
                              },
                            ],
                            id: 'u:9fd623256dd2',
                          },
                        ],
                      },
                      actionType: 'dialog',
                    },
                  ],
                  weight: 0,
                },
              },
            },
            {
              type: 'button',
              label: '删除',
              actionType: 'ajax',
              id: 'u:8bd33adb5d8d',
              level: 'danger',
              confirmText: '确定要删除？',
              confirmTitle: '删除',
              api: {
                url: '/ms-system/position/delete/${id}',
                method: 'post',
                adaptor: CurdAdaptor,
                requestAdaptor: DeleteRequestAdaptor,
                dataType: 'form',
                messages: {
                  success: '删除成功',
                },
              },
            },
          ],
          id: 'u:ba70544b8743',
        },
      ],
      bulkActions: [],
      itemActions: [],
      features: ['filter', 'update', 'delete'],
      filterColumnCount: 3,
      headerToolbar: ['bulkActions'],
      id: 'u:f0098fabb968',
      perPageAvailable: [10, 20, 50],
      messages: {},
      filter: {
        title: '查询条件',
        body: [
          {
            type: 'form',
            title: '查询条件',
            target: 'crud?positionName=${positionName_search}',
            mode: 'inline',
            id: 'u:c4ad86e24b0a',
            body: [
              {
                type: 'input-text',
                name: 'positionName_search',
                label: '岗位名称',
                id: 'u:601b1bb3e0fa',
                placeholder: '请输入岗位名称',
                className: 'm-l',
                inputClassName: 'w',
                clearable: true,
              },
            ],
            actions: [
              {
                type: 'submit',
                label: '查询',
                id: 'u:57d6dfdfb28b',
                level: 'primary',
              },
              {
                type: 'reset',
                label: '重置',
                id: 'u:ec33662e8cd8',
                level: 'secondary',
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
              },
              {
                type: 'button',
                label: '新增',
                id: 'u:1382db7671ba',
                level: 'success',
                actionType: 'dialog',
                dialog: {
                  type: 'dialog',
                  title: '新增岗位',
                  body: [
                    {
                      type: 'form',
                      title: '表单',
                      reload: 'crud',
                      api: {
                        url: '/ms-system/position/add',
                        adaptor: CurdAdaptor,
                        method: 'post',
                        dataType: 'json',
                        messages: {
                          success: '新增成功',
                        },
                        replaceData: true,
                        data: {
                          '&': '$$',
                        },
                      },
                      body: [
                        {
                          label: '岗位名称',
                          type: 'input-text',
                          name: 'positionName',
                          id: 'u:9df2eeffba69',
                          clearable: true,
                          required: true,
                          placeholder: '请输入岗位名称',
                        },
                        {
                          type: 'input-text',
                          label: '岗位编码',
                          name: 'positionCode',
                          id: 'u:e58bad14b345',
                          clearable: true,
                          required: true,
                          placeholder: '请输入岗位编码',
                        },
                        {
                          type: 'textarea',
                          label: '岗位职责',
                          name: 'positionDuty',
                          id: 'u:21bb965dad1f',
                          minRows: 3,
                          maxRows: 20,
                          placeholder: '请输入岗位职责',
                        },
                        {
                          type: 'textarea',
                          label: '备注',
                          name: 'remark',
                          id: 'u:22b9fd94d53a',
                          minRows: 3,
                          maxRows: 20,
                          placeholder: '请输入备注',
                        },
                      ],
                      mode: 'horizontal',
                      id: 'u:68ba0fcca01e',
                      resetAfterSubmit: true,
                    },
                  ],
                  showCloseButton: true,
                  showErrorMsg: false,
                  showLoading: false,
                  id: 'u:20adaef30ebe',
                  closeOnEsc: true,
                },
              },
            ],
          },
          // {
          //   type: 'tree-select',
          //   label: '部门',
          //   name: 'orgId',
          //   clearable: false,
          //   id: 'u:86b978b87c2e',
          //   multiple: false,
          //   enableNodePath: false,
          //   showIcon: false,
          //   initiallyOpen: true,
          //   className: 'm-l',
          //   inputClassName: 'w',
          //   placeholder: '请选择部门',
          //   source: {
          //     url: '/ms-system/org/list-org-tree',
          //     method: 'get',
          //   },
          //   labelField: 'orgName',
          //   valueField: 'id',
          //   hideNodePathLabel: true,
          // },
        ],
        id: 'u:f1fda294d358',
        wrapWithPanel: false,
        mode: 'inline',
      },
      name: 'crud',
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
      alwaysShowPagination: true,
      initFetch: true,
      pageField: 'pageIndex',
      perPageField: 'pageSize',
      defaultParams: {
        pageIndex: 1,
        pageSize: 10,
      },
    },
  ],
  id: 'u:17ae50cc8708',
  pullRefresh: {
    disabled: true,
  },
  regions: ['body'],
};

const Pos = () => {
  return (
    <Box h={'full'}>
      <AimsRender jsonView={data} />
    </Box>
  );
};

export default Pos;
