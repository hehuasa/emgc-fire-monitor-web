'use client';
import dynamic from 'next/dynamic';
const AimsRender = dynamic(() => import('@/components/AimsRender'), { ssr: false });

const data = {
  type: 'page',
  id: 'u:325b82d29deb',
  asideResizor: false,
  pullRefresh: {
    disabled: true,
  },
  regions: ['body'],
  body: [
    {
      type: 'crud',
      syncLocation: false,
      api: {
        method: 'get',
        url: '/cx-alarm/query_config/list',
        messages: {},
        requestAdaptor: '',
        adaptor:
          "return {\r\n    msg: response.code === 200 ? '' : response.msg,\r\n    status: response.code === 200 ? 0 : response.code,\r\n    data: {\r\n      items: response.data ? response.data : [],\r\n    },\r\n  };",
        dataType: 'form',
      },
      columns: [
        {
          name: '${index+1}',
          label: '序号',
          type: 'text',
          id: 'u:4810e54de01b',
        },
        {
          name: 'name',
          label: '组合查询名称',
          type: 'text',
          id: 'u:902462abd779',
        },
        {
          type: 'mapping',
          label: '报警状态',
          name: 'status',
          id: 'u:b9d1b23f8001',
          map: {
            '01': '未响应',
            '02': '未处理',
            '04': '处理中',
          },
        },
        {
          type: 'mapping',
          label: '处理结果',
          name: 'troubleshooting',
          id: 'u:828a6ec30a37',
          map: {
            false: '非故障维修',
            true: '故障维修',
          },
        },
        {
          type: 'mapping',
          label: '是否恢复',
          name: 'restore',
          id: 'u:dcf7e2d11703',
          map: {
            true: '是',
            false: '否',
          },
        },
        {
          type: 'operation',
          label: '操作',
          buttons: [
            {
              type: 'button',
              label: '删除',
              actionType: 'ajax',
              level: 'link',
              className: 'text-danger',
              confirmText: '确定要删除？',
              api: {
                method: 'get',
                url: '/cx-alarm/query_config/delete?queryConfigId=${queryConfigId}',
                messages: {},
                requestAdaptor:
                  'return {\r\n    ...api,\r\n    config: {\r\n      ...api.config,\r\n      method: api.method,\r\n    },\r\n  };',
                adaptor:
                  "return {\r\n    msg: response.code === 200 ? '' : response.msg,\r\n    status: response.code === 200 ? 0 : response.code,\r\n    data: {\r\n      items: response.data ? response.data : [],\r\n    },\r\n  };",
                dataType: 'form',
              },
              editorSetting: {
                behavior: 'delete',
              },
              id: 'u:ff66aaff6f70',
            },
          ],
          id: 'u:cbc650c6a092',
        },
      ],
      bulkActions: [],
      itemActions: [],
      headerToolbar: [
        {
          label: '新增',
          type: 'button',
          level: 'primary',
          editorSetting: {
            behavior: 'create',
          },
          id: 'u:b6f826430252',
          onEvent: {
            click: {
              weight: 0,
              actions: [],
            },
          },
          actionType: 'dialog',
          dialog: {
            type: 'dialog',
            title: '新增',
            body: [
              {
                id: 'u:c6c3e3fe728a',
                type: 'form',
                title: '表单',
                mode: 'horizontal',
                dsType: 'api',
                feat: 'Insert',
                body: [
                  {
                    name: 'name',
                    label: '组合名称',
                    type: 'input-text',
                    id: 'u:e2f4898278f3',
                    required: true,
                    placeholder: '请输入组合名称',
                  },
                  {
                    type: 'select',
                    label: '报警状态',
                    name: 'status',
                    options: [
                      {
                        label: '未响应',
                        value: '01',
                      },
                      {
                        label: '未处理',
                        value: '02',
                      },
                      {
                        label: '处理中',
                        value: '04',
                      },
                    ],
                    id: 'u:c77541a5abf9',
                    multiple: false,
                    value: '',
                  },
                  {
                    type: 'select',
                    label: '处理结果',
                    name: 'troubleshooting',
                    options: [
                      {
                        label: '非故障维修',
                        value: 'false',
                      },
                      {
                        label: '故障维修',
                        value: 'true',
                      },
                    ],
                    id: 'u:97660e0b7158',
                    multiple: false,
                    value: '',
                  },
                  {
                    type: 'select',
                    label: '是否恢复',
                    name: 'restore',
                    options: [
                      {
                        label: '否',
                        value: 'false',
                      },
                      {
                        label: '是',
                        value: 'true',
                      },
                    ],
                    id: 'u:35e21cbf6d0a',
                    multiple: false,
                    value: '',
                  },
                ],
                api: {
                  url: '/cx-alarm/query_config/add',
                  method: 'post',
                  requestAdaptor: '',
                  adaptor:
                    "return {\r\n    msg: response.code === 200 ? api.messages.success : response.msg,\r\n    status: response.code === 200 ? 0 : response.code,\r\n    data: {\r\n      responseMsg: response.msg,\r\n      responseData: response.data === null ? 'true' : 'false',\r\n    },\r\n  };",
                  messages: {
                    success: '新增成功',
                  },
                  dataType: 'json',
                  data: {
                    status: '${status|default}',
                    troubleshooting: '${troubleshooting|default}',
                    restore: '${restore|default}',
                    name: '${name}',
                  },
                },
                actions: [
                  {
                    type: 'button',
                    label: '提交',
                    onEvent: {
                      click: {
                        actions: [
                          {
                            actionType: 'submit',
                            componentId: 'u:c6c3e3fe728a',
                          },
                        ],
                      },
                    },
                    level: 'primary',
                  },
                ],
                resetAfterSubmit: true,
              },
            ],
            showCloseButton: true,
            showErrorMsg: true,
            showLoading: true,
            className: 'app-popover :AMISCSSWrapper',
            actions: [
              {
                type: 'button',
                actionType: 'cancel',
                label: '取消',
                id: 'u:9136f2a77846',
              },
              {
                type: 'button',
                actionType: 'confirm',
                label: '确认',
                primary: true,
                id: 'u:5d3abdc89fc2',
              },
            ],
            id: 'u:b6e43c2e8957',
          },
        },
        {
          type: 'bulk-actions',
        },
      ],
      id: 'u:6f3a360f9cb8',
      perPageAvailable: [10],
      messages: {},
      autoFillHeight: true,
      alwaysShowPagination: true,
    },
  ],
};

const QueryConfig = () => {
  return <AimsRender jsonView={data} />;
};

export default QueryConfig;
