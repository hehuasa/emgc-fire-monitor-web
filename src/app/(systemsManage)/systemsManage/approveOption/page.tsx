import React from 'react';
import dynamic from 'next/dynamic';
import { dev } from '@/utils/util';

const AimsRender = dynamic(() => import('@/components/AimsRender'), { ssr: false });
const hash = new Date().getTime();
const getData = async () => {
  const json = await (
    await fetch(`${process.env.NEXT_PUBLIC_ANALYTICS_Aims_server}/getAimsJsonById?id=21#${hash}`, {
      cache: dev ? 'no-store' : 'force-cache',
      next: {
        tags: ['0x21appover'],
      },
    })
  ).json();
  return json.data.item.content;
};

const data = {
  type: 'page',
  id: 'u:b994f0f68edf',
  body: [
    {
      id: 'u:ae3c08295bd7',
      api: {
        url: '/systemsManage/approveOption/api/getOptionList',
        data: {
          '&': '$$',
          pageBean: {
            pageSize: '${pageSize}',
            currentPage: '${currentPage}',
          },
        },
        method: 'post',
        dataType: 'json',
        messages: {},
        replaceData: true,
      },
      name: 'crud',
      type: 'crud',
      filter: {
        id: 'u:052aecbf1622',
        body: [
          {
            id: 'u:c4ad86e24b0a',
            body: [
              {
                id: 'u:5d7fe78661f6',
                name: 'areaName',
                type: 'input-text',
                label: '装置',
                className: 'm-l',
                clearable: true,
                placeholder: '请输入装置名称',
                inputClassName: 'w',
              },
            ],
            mode: 'inline',
            type: 'form',
            rules: [],
            title: '查询条件',
            target: 'crud?areaName=${areaName}',
            actions: [
              {
                id: 'u:57d6dfdfb28b',
                type: 'submit',
                label: '查询',
                level: 'primary',
              },
              {
                id: 'u:ec33662e8cd8',
                type: 'reset',
                label: '重置',
                level: 'secondary',
                onEvent: {
                  click: {
                    actions: [
                      {
                        actionType: 'clear',
                        componentId: 'u:c4ad86e24b0a',
                      },
                      {
                        actionType: 'submit',
                        componentId: 'u:c4ad86e24b0a',
                      },
                    ],
                  },
                },
              },
              {
                id: 'u:119c1c51d20c',
                type: 'button',
                label: '新增',
                level: 'success',
                dialog: {
                  id: 'u:f513da49400e',
                  body: [
                    {
                      id: 'u:7920e65177ff',
                      body: [
                        {
                          id: 'u:c16236fc3654',
                          name: 'areaList',
                          size: 'lg',
                          type: 'picker',
                          label: '装置',
                          source: {
                            url: '/cx-alarm/dc/area/page',
                            data: {
                              size: '${size}',
                              current: '${current}',
                              areaName: '${keyword}',
                            },
                            method: 'get',
                            dataType: 'json',
                            messages: {},
                            replaceData: true,
                          },
                          multiple: true,
                          modalMode: 'dialog',
                          joinValues: false,
                          labelField: 'areaName',
                          valueField: 'areaId',
                          pickerSchema: {
                            id: 'u:f70f40efbcbb',
                            mode: 'table',
                            name: 'thelist',
                            columns: [
                              {
                                id: 'u:5daeec514e9c',
                                tpl: '${index+1}',
                                name: 'areaId',
                                type: 'tpl',
                                label: '序号',
                                toggled: true,
                                sortable: true,
                              },
                              {
                                id: 'u:5dfbd2a18c4b',
                                name: 'areaName',
                                type: 'text',
                                label: '装置名称',
                                toggled: true,
                                sortable: true,
                              },
                              {
                                id: 'u:5dfbd2ac4b12',
                                name: 'areaCode',
                                type: 'text',
                                label: '装置编号',
                                toggled: true,
                                sortable: true,
                              },
                            ],
                            messages: {},
                            pageField: 'current',
                            affixHeader: false,
                            bulkActions: [],
                            perPageField: 'size',
                            defaultParams: {
                              size: 10,
                              current: 1,
                            },
                            footerToolbar: [
                              'statistics',
                              {
                                type: 'pagination',
                                align: 'left',
                              },
                            ],
                            headerToolbar: {
                              id: 'u:c9d4a9141c9b',
                              body: [
                                {
                                  id: 'u:11c46f968fbf',
                                  name: 'keyword',
                                  type: 'input-text',
                                  addOn: {
                                    id: 'u:228612364ec4',
                                    icon: 'fa fa-search pull-left',
                                    type: 'submit',
                                    label: '查询',
                                    level: 'primary',
                                  },
                                  placeholder: '请根据装置名称查询',
                                },
                              ],
                              mode: 'inline',
                              type: 'form',
                              target: 'thelist',
                              className: 'text-right',
                              wrapWithPanel: false,
                            },
                            perPageAvailable: [10],
                            alwaysShowPagination: true,
                          },
                        },
                        {
                          id: 'u:c16236fc3654',
                          name: 'userList',
                          size: 'lg',
                          type: 'picker',
                          label: '配置用户',
                          source: {
                            url: '/ms-system/user/list/page',
                            data: {
                              pageSize: '${size}',
                              userName: '${keywords}',
                              pageIndex: '${current}',
                            },
                            method: 'get',
                            adaptor:
                              'return {\r\n    msg: response.code === 200 ? api.messages.success : response.msg,\r\n    status: response.code === 200 ? 0 : response.code,\r\n    data: {\r\n      items: response.data ? response.data.records : [],total: response.data ? response.data.total : 0, \r\n    },\r\n  };',
                            dataType: 'form',
                            messages: {},
                            replaceData: true,
                          },
                          multiple: true,
                          modalMode: 'dialog',
                          joinValues: true,
                          labelField: 'userName',
                          valueField: 'id',
                          pickerSchema: {
                            id: 'u:f70f40efbcbb',
                            mode: 'table',
                            name: 'theuserlist',
                            columns: [
                              {
                                id: 'u:5daeec514e9c',
                                tpl: '${index+1}',
                                name: 'id',
                                type: 'tpl',
                                label: '序号',
                                toggled: true,
                                sortable: true,
                              },
                              {
                                id: 'u:5dfbd2a18c4b',
                                name: 'userName',
                                type: 'text',
                                label: '用户姓名',
                                toggled: true,
                                sortable: true,
                              },
                              {
                                id: 'u:c6f61743855d',
                                name: 'userCode',
                                type: 'text',
                                label: '用户编码',
                                toggled: true,
                                sortable: true,
                              },
                              {
                                id: 'u:027d3c680b1a',
                                name: 'mobile',
                                type: 'text',
                                label: '手机号',
                                toggled: true,
                              },
                            ],
                            messages: {},
                            pageField: 'current',
                            affixHeader: false,
                            bulkActions: [],
                            perPageField: 'size',
                            defaultParams: {
                              size: 10,
                              current: 1,
                            },
                            footerToolbar: [
                              'statistics',
                              {
                                type: 'pagination',
                                align: 'left',
                              },
                            ],
                            headerToolbar: {
                              id: 'u:c9d4a9141c9b',
                              body: [
                                {
                                  id: 'u:11c46f968fbf',
                                  name: 'keywords',
                                  type: 'input-text',
                                  addOn: {
                                    id: 'u:228612364ec4',
                                    icon: 'fa fa-search pull-left',
                                    type: 'submit',
                                    label: '查询',
                                    level: 'primary',
                                  },
                                  placeholder: '请根据用户名查询',
                                },
                              ],
                              mode: 'inline',
                              type: 'form',
                              target: 'theuserlist',
                              className: 'text-right',
                              wrapWithPanel: false,
                            },
                            perPageAvailable: [10],
                            alwaysShowPagination: true,
                          },
                        },
                      ],
                      mode: 'horizontal',
                      type: 'form',
                      reload: 'crud',
                      target: 'crud',
                    },
                  ],
                  size: 'md',
                  type: 'dialog',
                  title: '故障审批',
                  actions: [
                    {
                      id: 'u:2770982ca897',
                      type: 'button',
                      close: true,
                      label: '取消',
                      level: 'secondary',
                    },
                    {
                      id: 'u:8ed4e99c4512',
                      type: 'submit',
                      close: true,
                      label: '确定',
                      level: 'primary',
                      onEvent: {
                        click: {
                          actions: [
                            {
                              args: {
                                api: {
                                  url: '/cx-alarm/alm/troubleshooting/add_or_update_approves',
                                  data: {
                                    areaIds: '${areaList|pick:areaId|map}',
                                    userIds: '${userList|split}',
                                  },
                                  method: 'post',
                                  adaptor:
                                    'return {\r\n    msg: response.code === 200 ? api.messages.success : response.msg,\r\n    status: response.code === 200 ? 0 : response.code,\r\n    data: {\r\n      responseMsg: response.msg,\r\n    },\r\n  };',
                                  dataType: 'json',
                                  messages: {
                                    success: '新增成功',
                                  },
                                },
                                options: {},
                              },
                              outputVar: 'responseResult',
                              actionType: 'ajax',
                            },
                            {
                              args: {},
                              actionType: 'reload',
                              componentId: 'u:ae3c08295bd7',
                            },
                          ],
                        },
                      },
                    },
                  ],
                  closeOnEsc: true,
                  showLoading: false,
                  showErrorMsg: false,
                  dataMapSwitch: false,
                  showCloseButton: true,
                },
                actionType: 'dialog',
              },
            ],
          },
        ],
        mode: 'inline',
        title: '查询条件',
        reload: 'crud',
        actions: [],
        wrapWithPanel: false,
      },
      columns: [
        {
          id: 'u:88d5a9e5e30e',
          name: 'areaName',
          type: 'text',
          label: '装置',
          width: 200,
        },
        {
          id: 'u:88d5a9e5e30e',
          name: 'areaCode',
          type: 'text',
          label: '装置编号',
          width: 200,
        },
        {
          id: 'u:437ff78a62d0',
          name: 'userNames',
          type: 'text',
          label: '用户姓名',
          width: '40%',
        },
        {
          id: 'u:d3424641af89',
          name: 'id',
          type: 'button-toolbar',
          label: '操作',
          buttons: [
            {
              id: 'u:35f5d4a2acc5',
              type: 'button',
              label: '修改',
              level: 'enhance',
              dialog: {
                id: 'u:f513da49400e',
                body: [
                  {
                    body: [
                      {
                        id: 'u:3a4c84769914',
                        body: [
                          {
                            id: 'u:c16236fc3654',
                            name: 'areaList',
                            size: 'lg',
                            type: 'picker',
                            label: '装置',
                            value: '${items|nth:${index}}',
                            source: {
                              url: '/cx-alarm/dc/area/page',
                              data: {
                                size: '${size}',
                                current: '${current}',
                                areaName: '${keyword|default}',
                              },
                              method: 'get',
                              dataType: 'json',
                              messages: {},
                              replaceData: true,
                            },
                            multiple: true,
                            modalMode: 'dialog',
                            joinValues: false,
                            labelField: 'areaName',
                            valueField: 'areaId',
                            pickerSchema: {
                              id: 'u:f70f40efbcbb',
                              mode: 'table',
                              name: 'thelist',
                              columns: [
                                {
                                  id: 'u:5daeec514e9c',
                                  tpl: '${index+1}',
                                  name: 'areaId',
                                  type: 'tpl',
                                  label: '序号',
                                  toggled: true,
                                  sortable: true,
                                },
                                {
                                  id: 'u:5dfbd2a18c4b',
                                  name: 'areaName',
                                  type: 'text',
                                  label: '装置名称',
                                  toggled: true,
                                  sortable: true,
                                },
                                {
                                  id: 'u:5dfbd2ac4b12',
                                  name: 'areaCode',
                                  type: 'text',
                                  label: '装置编号',
                                  toggled: true,
                                  sortable: true,
                                },
                              ],
                              messages: {},
                              pageField: 'current',
                              affixHeader: false,
                              bulkActions: [],
                              perPageField: 'size',
                              defaultParams: {
                                size: 10,
                                current: 1,
                              },
                              footerToolbar: [
                                'statistics',
                                {
                                  type: 'pagination',
                                  align: 'left',
                                },
                              ],
                              headerToolbar: {
                                id: 'u:c9d4a9141c9b',
                                body: [
                                  {
                                    id: 'u:11c46f968fbf',
                                    name: 'keyword',
                                    type: 'input-text',
                                    addOn: {
                                      id: 'u:228612364ec4',
                                      icon: 'fa fa-search pull-left',
                                      type: 'submit',
                                      label: '查询',
                                      level: 'primary',
                                      clearable: true,
                                    },
                                    placeholder: '请根据装置名称查询',
                                  },
                                ],
                                mode: 'inline',
                                type: 'form',
                                target: 'thelist',
                                className: 'text-right',
                                wrapWithPanel: false,
                              },
                              perPageAvailable: [10],
                              alwaysShowPagination: true,
                            },
                          },
                          {
                            id: 'u:c16236fc3654',
                            name: 'userList',
                            size: 'lg',
                            type: 'picker',
                            label: '配置用户',
                            value: '${items|nth:${index}|pick:userIds|join}',
                            source: {
                              url: '/ms-system/user/list',
                              method: 'post',
                              dataType: 'json',
                              messages: {},
                              replaceData: true,
                            },

                            multiple: true,
                            modalMode: 'dialog',
                            joinValues: true,
                            labelField: 'userName',
                            valueField: 'id',
                            pickerSchema: {
                              id: 'u:f70f40efbcbb',
                              mode: 'table',
                              name: 'theuserlist',
                              loadDataOnce: true,
                              columns: [
                                {
                                  id: 'u:5daeec514e9c',
                                  tpl: '${index+1}',
                                  name: 'id',
                                  type: 'tpl',
                                  label: '序号',
                                  toggled: true,
                                  sortable: true,
                                },
                                {
                                  id: 'u:5dfbd2a18c4b',
                                  name: 'userName',
                                  type: 'text',
                                  label: '用户姓名',
                                  toggled: true,
                                  sortable: true,
                                  searchable: {
                                    type: 'input-text',
                                    name: 'userName',
                                    label: '用户姓名：',
                                    clearable: true,
                                  },
                                },
                                {
                                  id: 'u:c6f61743855d',
                                  name: 'userCode',
                                  type: 'text',
                                  label: '用户编码',
                                  toggled: true,
                                  sortable: true,
                                },
                                {
                                  id: 'u:027d3c680b1a',
                                  name: 'mobile',
                                  type: 'text',
                                  label: '手机号',
                                  toggled: true,
                                },
                              ],
                              messages: {},
                              pageField: 'currentPage',
                              affixHeader: false,
                              bulkActions: [],
                              perPageField: 'pageSize',
                              defaultParams: {
                                pageSize: 10,
                                currentPage: 1,
                              },
                              footerToolbar: [
                                'statistics',
                                {
                                  type: 'pagination',
                                  align: 'left',
                                },
                              ],
                              // headerToolbar: {
                              //   id: 'u:c9d4a9141c9b',
                              //   body: [
                              //     {
                              //       id: 'u:11c46f968fbf',
                              //       name: 'keywords',
                              //       type: 'input-text',
                              //       addOn: {
                              //         id: 'u:228612364ec4',
                              //         icon: 'fa fa-search pull-left',
                              //         type: 'submit',
                              //         label: '查询',
                              //         level: 'primary',
                              //       },
                              //       placeholder: '请根据用户名查询',
                              //     },
                              //   ],
                              //   mode: 'inline',
                              //   type: 'form',
                              //   target: 'theuserlist',
                              //   className: 'text-right',
                              //   wrapWithPanel: false,
                              // },
                              perPageAvailable: [10],
                              alwaysShowPagination: true,
                            },
                          },
                        ],

                        type: 'service',
                      },
                    ],
                    mode: 'horizontal',
                    type: 'form',
                    title: '',
                    reload: 'crud',
                  },
                ],
                size: 'md',
                type: 'dialog',
                title: '修改故障审批',
                actions: [
                  {
                    id: 'u:2770982ca897',
                    type: 'button',
                    close: true,
                    label: '取消',
                    level: 'secondary',
                  },
                  {
                    id: 'u:8ed4e99c4512',
                    type: 'submit',
                    close: true,
                    label: '确定',
                    level: 'primary',
                    onEvent: {
                      click: {
                        actions: [
                          {
                            args: {
                              api: {
                                url: '/cx-alarm/alm/troubleshooting/add_or_update_approves',
                                data: {
                                  areaIds: '${areaList|pick:areaId|map}',
                                  userIds: '${userList|split}',
                                },
                                method: 'post',
                                adaptor:
                                  'return {\r\n    msg: response.code === 200 ? api.messages.success : response.msg,\r\n    status: response.code === 200 ? 0 : response.code,\r\n    data: {\r\n      responseMsg: response.msg,\r\n    },\r\n  };',
                                dataType: 'json',
                                messages: {
                                  success: '修改成功',
                                },
                              },
                              options: {},
                            },
                            outputVar: 'responseResult',
                            actionType: 'ajax',
                          },
                          {
                            args: {},
                            actionType: 'reload',
                            componentId: 'u:ae3c08295bd7',
                          },
                        ],
                      },
                    },
                  },
                ],
                closeOnEsc: true,
                showLoading: false,
                showErrorMsg: false,
                dataMapSwitch: false,
                showCloseButton: true,
              },
              actionType: 'dialog',
            },
            {
              id: 'u:8bd33adb5d8d',
              api: {
                url: '/cx-alarm/alm/troubleshooting/delete_approves?areaId=${areaId}',
                method: 'get',
                adaptor:
                  'return {\r\n    msg: response.code === 200 ? api.messages.success : response.msg,\r\n    status: response.code === 200 ? 0 : response.code,\r\n    data: {\r\n      responseMsg: response.msg,\r\n    },\r\n  };',
                dataType: 'form',
                messages: {
                  success: '删除成功',
                },
                requestAdaptor:
                  'return {\r\n    ...api,\r\n    config: {\r\n      ...api.config,\r\n      method: api.method,\r\n    },\r\n  };',
              },
              type: 'button',
              label: '删除',
              level: 'danger',
              actionType: 'ajax',
              confirmText: '确定要删除？',
            },
          ],
        },
      ],
      features: ['filter'],
      messages: {},
      initFetch: true,
      pageField: 'currentPage',
      bulkActions: [],
      itemActions: [],
      perPageField: 'pageSize',
      syncLocation: false,
      defaultParams: {
        pageSize: 10,
        currentPage: 1,
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
      headerToolbar: [
        {
          type: 'filter-toggler',
          align: 'left',
        },
      ],
      autoFillHeight: true,
      perPageAvailable: [10, 20, 50],
      alwaysShowPagination: true,
    },
  ],
  style: {
    boxShadow: ' 0px 0px 0px 0px transparent',
  },
  title: '审批配置管理',
  regions: ['body'],
  pullRefresh: {
    disabled: true,
  },
};

const ApproveOption = async () => {
  // const data = await getData();
  return <AimsRender jsonView={data} />;
};

export default ApproveOption;
