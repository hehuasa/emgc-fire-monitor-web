// import React from 'react';
// import dynamic from 'next/dynamic';
// import { dev } from '@/utils/util';
// const AimsRender = dynamic(() => import('@/components/AimsRender'), { ssr: false });
// const hash = new Date().getTime();
// const getData = async () => {
//   const json = await (
//     await fetch(`${process.env.NEXT_PUBLIC_ANALYTICS_Aims_server}/getAimsJsonById?id=5#${hash}`, {
//       cache: dev ? 'no-store' : 'force-cache',
//       next: {
//         tags: ['0x5roles'],
//       },
//     })
//   ).json();
//   return json.data.item.content;
// };

// // const data = {
// //   type: 'page',
// //   id: 'u:32d6139f9389',
// //   body: [
// //     {
// //       id: 'u:cdf19c33cba3',
// //       api: {
// //         url: '/ms-system/role/list/page',
// //         data: {
// //           '&': '$$',
// //         },
// //         method: 'get',
// //         dataType: 'form',
// //         replaceData: true,
// //       },
// //       name: 'crud',
// //       type: 'crud',
// //       filter: {
// //         id: 'u:9b2e28948abd',
// //         body: [
// //           {
// //             id: 'u:052aecbf1622',
// //             body: [
// //               {
// //                 id: 'u:aaaa38885ce1',
// //                 name: 'roleName',
// //                 type: 'input-text',
// //                 label: '角色名称',
// //                 className: 'm-l',
// //                 placeholder: '请输入角色名称',
// //                 inputClassName: 'w',
// //               },
// //               {
// //                 id: 'u:2fbaebfd7141',
// //                 name: 'roleDes',
// //                 type: 'input-text',
// //                 label: '角色描述',
// //                 className: 'm-l',
// //                 placeholder: '请输入角色描述',
// //                 inputClassName: 'w',
// //               },
// //               {
// //                 id: 'u:105a9e43d09d',
// //                 name: 'isEnable',
// //                 type: 'radios',
// //                 label: '是否启用',
// //                 value: '1',
// //                 options: [
// //                   {
// //                     label: '启用',
// //                     value: '1',
// //                   },
// //                   {
// //                     label: '禁用',
// //                     value: '0',
// //                   },
// //                 ],
// //                 className: 'm-l',
// //                 inputClassName: '',
// //               },
// //             ],
// //             mode: 'inline',
// //             type: 'form',
// //             title: '查询条件',
// //             reload: 'crud',
// //             target:
// //               'crud?isEnable=${isEnable}&roleName=${roleName|default}&roleDes=${roleDes|default}',
// //             actions: [
// //               {
// //                 id: 'u:ab0cfbf262c8',
// //                 type: 'submit',
// //                 label: '查询',
// //                 level: 'primary',
// //               },
// //               {
// //                 id: 'u:1527db35bf5f',
// //                 type: 'reset',
// //                 label: '重置',
// //                 level: 'secondary',
// //                 onEvent: {
// //                   click: {
// //                     actions: [
// //                       {
// //                         args: {},
// //                         actionType: 'clear',
// //                         componentId: 'u:052aecbf1622',
// //                       },
// //                       {
// //                         args: {
// //                           value: '1',
// //                         },
// //                         actionType: 'setValue',
// //                         componentId: 'u:105a9e43d09d',
// //                       },
// //                       {
// //                         actionType: 'submit',
// //                         componentId: 'u:052aecbf1622',
// //                       },
// //                     ],
// //                   },
// //                 },
// //               },
// //               {
// //                 id: 'u:4b9180a43c79',
// //                 type: 'button',
// //                 label: '新增',
// //                 level: 'success',
// //                 dialog: {
// //                   id: 'u:f513da49400e',
// //                   body: [
// //                     {
// //                       id: 'u:ab0cfa666c71',
// //                       body: [
// //                         {
// //                           id: 'u:d6c78a60ae46',
// //                           name: 'roleName',
// //                           type: 'input-text',
// //                           label: '角色名称',
// //                           required: true,
// //                           clearable: true,
// //                           placeholder: '请输入角色名称',
// //                           className: 'm-l',
// //                           inputClassName: 'w',
// //                         },
// //                         {
// //                           id: 'u:b5013d98ec5f',
// //                           name: 'roleCode',
// //                           type: 'input-text',
// //                           label: '角色编码',
// //                           required: true,
// //                           clearable: true,
// //                           placeholder: '请输入角色编码',
// //                           className: 'm-l',
// //                           inputClassName: 'w',
// //                         },
// //                         {
// //                           id: 'u:105cdf8a593c',
// //                           name: 'isEnable',
// //                           type: 'radios',
// //                           label: '是否启用',
// //                           value: '1',
// //                           className: 'm-l',
// //                           inputClassName: 'w',
// //                           options: [
// //                             {
// //                               label: '启用',
// //                               value: '1',
// //                             },
// //                             {
// //                               label: '禁用',
// //                               value: '0',
// //                             },
// //                           ],
// //                         },
// //                         {
// //                           id: 'u:05a9316192ad',
// //                           name: 'roleDes',
// //                           type: 'textarea',
// //                           label: '角色描述',
// //                           maxRows: 20,
// //                           minRows: 3,
// //                           className: 'm-l',
// //                           inputClassName: 'w',
// //                           placeholder: '请输入角色描述',
// //                         },
// //                       ],
// //                       mode: 'inline',
// //                       type: 'form',
// //                       title: '',
// //                       actions: [],
// //                       wrapWithPanel: false,
// //                     },
// //                   ],
// //                   size: 'md',
// //                   type: 'dialog',
// //                   title: '新增角色',
// //                   actions: [
// //                     {
// //                       id: 'u:5a465611545f',
// //                       type: 'button-toolbar',
// //                       label: '',
// //                       buttons: [
// //                         {
// //                           id: 'u:2770982ca897',
// //                           type: 'button',
// //                           close: true,
// //                           label: '取消',
// //                           level: 'secondary',
// //                         },
// //                         {
// //                           id: 'u:8ed4e99c4512',
// //                           type: 'submit',
// //                           close: true,
// //                           label: '确定',
// //                           level: 'primary',
// //                           onEvent: {
// //                             click: {
// //                               actions: [
// //                                 {
// //                                   args: {
// //                                     api: {
// //                                       url: '/ms-system/role/add',
// //                                       data: {
// //                                         '&': '$$',
// //                                       },
// //                                       method: 'post',
// //                                       adaptor:
// //                                         'return {\r\n    msg: response.code === 200 ? api.messages.success : response.msg,\r\n    status: response.code === 200 ? 0 : response.code,\r\n    data: {\r\n      responseMsg: response.msg,\r\n    },\r\n  };',
// //                                       dataType: 'json',
// //                                       messages: {
// //                                         success: '新增成功',
// //                                       },
// //                                       requestAdaptor: '',
// //                                     },
// //                                     options: {},
// //                                   },
// //                                   outputVar: 'responseResult',
// //                                   actionType: 'ajax',
// //                                 },
// //                                 {
// //                                   args: {},
// //                                   actionType: 'reload',
// //                                   componentId: 'u:cdf19c33cba3',
// //                                 },
// //                               ],
// //                             },
// //                           },
// //                         },
// //                       ],
// //                     },
// //                   ],
// //                   closeOnEsc: true,
// //                   showLoading: false,
// //                   showErrorMsg: false,
// //                   dataMapSwitch: false,
// //                   showCloseButton: true,
// //                 },
// //                 actionType: 'dialog',
// //               },
// //             ],
// //             submitText: '',
// //             submitOnInit: true,
// //             wrapWithPanel: true,
// //           },
// //         ],
// //         title: '',
// //         reload: 'crud',
// //         actions: [],
// //         wrapWithPanel: false,
// //       },
// //       columns: [
// //         {
// //           id: 'u:a2da6992c65c',
// //           tpl: '${index + 1}',
// //           type: 'tpl',
// //           label: '序号',
// //         },
// //         {
// //           id: 'u:715bb0f9c341',
// //           name: 'roleName',
// //           type: 'text',
// //           label: '角色名称',
// //         },
// //         {
// //           id: 'u:856951312f3a',
// //           map: {
// //             '0': '禁用',
// //             '1': '启用',
// //           },
// //           name: 'isEnable',
// //           type: 'mapping',
// //           label: '是否启用',
// //         },
// //         {
// //           id: 'u:e0833258b1ac',
// //           name: 'roleDes',
// //           type: 'text',
// //           label: '角色描述',
// //         },
// //         {
// //           id: 'u:746429a05667',
// //           name: 'id',
// //           type: 'button-toolbar',
// //           label: '操作',
// //           buttons: [
// //             {
// //               id: 'u:e1b0463dc978',
// //               type: 'button',
// //               label: '配置用户',
// //               level: 'enhance',
// //               onEvent: {
// //                 click: {
// //                   weight: 0,
// //                   actions: [
// //                     {
// //                       dialog: {
// //                         id: 'u:85e7da4bae66',
// //                         data: {
// //                           userName: '',
// //                           id: '${id}',
// //                         },
// //                         body: [
// //                           {
// //                             id: 'u:3a4c84769914',
// //                             api: {
// //                               url: '/ms-system/role/get-role-users?roleId=${id}',
// //                               method: 'get',
// //                               dataType: 'form',
// //                               replaceData: true,
// //                               responseData: {
// //                                 userIdList: '${items}',
// //                               },
// //                             },
// //                             body: [
// //                               {
// //                                 id: 'u:c16236fc3654',
// //                                 name: 'userList',
// //                                 size: 'lg',
// //                                 type: 'picker',
// //                                 embed: true,
// //                                 label: '',
// //                                 value: '${userIdList}',
// //                                 source: {
// //                                   url: '/ms-system/user/list/page',
// //                                   data: {
// //                                     pageSize: '${pageSize}',
// //                                     userName: '${userName|default}',
// //                                     pageIndex: '${pageIndex}',
// //                                   },
// //                                   method: 'get',
// //                                   dataType: 'json',
// //                                   messages: {},
// //                                   replaceData: true,
// //                                 },
// //                                 multiple: true,
// //                                 modalMode: 'dialog',
// //                                 joinValues: false,
// //                                 labelField: 'userName',
// //                                 valueField: 'id',
// //                                 pickerSchema: {
// //                                   id: 'u:f70f40efbcbb',
// //                                   mode: 'table',
// //                                   name: 'thelist',
// //                                   columns: [
// //                                     {
// //                                       id: 'u:5daeec514e9c',
// //                                       tpl: '${index+1}',
// //                                       name: 'id',
// //                                       type: 'tpl',
// //                                       label: '序号',
// //                                       toggled: true,
// //                                       sortable: true,
// //                                     },
// //                                     {
// //                                       id: 'u:5dfbd2a18c4b',
// //                                       name: 'userName',
// //                                       type: 'text',
// //                                       label: '用户姓名',
// //                                       toggled: true,
// //                                       sortable: true,
// //                                     },
// //                                     {
// //                                       id: 'u:c6f61743855d',
// //                                       name: 'userCode',
// //                                       type: 'text',
// //                                       label: '用户编码',
// //                                       toggled: true,
// //                                       sortable: true,
// //                                     },
// //                                     {
// //                                       id: 'u:027d3c680b1a',
// //                                       name: 'mobile',
// //                                       type: 'text',
// //                                       label: '手机号',
// //                                       toggled: true,
// //                                     },
// //                                   ],
// //                                   messages: {},
// //                                   pageField: 'pageIndex',
// //                                   affixHeader: false,
// //                                   bulkActions: [],
// //                                   perPageField: 'pageSize',
// //                                   footerToolbar: [
// //                                     {
// //                                       type: 'pagination',
// //                                       align: 'left',
// //                                     },
// //                                     {
// //                                       id: 'u:3ac6b62100a1',
// //                                       type: 'button-toolbar',
// //                                       align: 'right',
// //                                       label: '',
// //                                       buttons: [
// //                                         {
// //                                           id: 'u:673f128bc908',
// //                                           type: 'button',
// //                                           close: true,
// //                                           label: '取消',
// //                                           level: 'secondary',
// //                                           onEvent: {
// //                                             click: {
// //                                               actions: [
// //                                                 {
// //                                                   args: {},
// //                                                   actionType: 'closeDialog',
// //                                                 },
// //                                               ],
// //                                             },
// //                                           },
// //                                         },
// //                                         {
// //                                           id: 'u:876758fc163e',
// //                                           type: 'button',
// //                                           close: true,
// //                                           label: '确定',
// //                                           level: 'primary',
// //                                           onEvent: {
// //                                             click: {
// //                                               actions: [
// //                                                 {
// //                                                   args: {
// //                                                     api: {
// //                                                       url: '/ms-system/role/set-users/${id}',
// //                                                       data: '${userList|pick:id|map}',
// //                                                       method: 'post',
// //                                                       adaptor:
// //                                                         'return {\r\n    msg: response.code === 200 ? api.messages.success : response.msg,\r\n    status: response.code === 200 ? 0 : response.code,\r\n    data: {\r\n      responseMsg: response.msg\r\n    },\r\n  };',
// //                                                       dataType: 'json',
// //                                                       messages: {
// //                                                         failed: '',
// //                                                         success: '配置成功',
// //                                                       },
// //                                                       replaceData: false,
// //                                                       requestAdaptor: '',
// //                                                     },
// //                                                     options: {
// //                                                       silent: false,
// //                                                     },
// //                                                   },
// //                                                   outputVar: 'responseResult',
// //                                                   actionType: 'ajax',
// //                                                 },
// //                                                 {
// //                                                   args: {},
// //                                                   actionType: 'reload',
// //                                                   componentId: 'u:cdf19c33cba3',
// //                                                 },
// //                                               ],
// //                                             },
// //                                           },
// //                                         },
// //                                       ],
// //                                     },
// //                                   ],
// //                                   headerToolbar: {
// //                                     id: 'u:c9d4a9141c9b',
// //                                     body: [
// //                                       {
// //                                         id: 'u:11c46f968fbf',
// //                                         name: 'keywords',
// //                                         type: 'input-text',
// //                                         placeholder: '请根据用户名查询',
// //                                         clearable: true,
// //                                         clearValueOnEmpty: true,
// //                                       },
// //                                       {
// //                                         id: 'u:228612364ec4',
// //                                         icon: 'fa fa-search pull-left',
// //                                         type: 'submit',
// //                                         label: '查询',
// //                                         level: 'primary',
// //                                         onEvent: {
// //                                           click: {
// //                                             actions: [
// //                                               {
// //                                                 args: {
// //                                                   resetPage: false,
// //                                                   value: {
// //                                                     userName: '${keywords}',
// //                                                   },
// //                                                 },
// //                                                 actionType: 'setValue',
// //                                                 componentId: 'u:85e7da4bae66',
// //                                               },
// //                                             ],
// //                                           },
// //                                         },
// //                                       },
// //                                     ],
// //                                     mode: 'inline',
// //                                     type: 'form',
// //                                     target: 'thelist',
// //                                     className: 'text-right',
// //                                     wrapWithPanel: false,
// //                                   },
// //                                   perPageAvailable: [10],
// //                                   alwaysShowPagination: true,
// //                                 },
// //                               },
// //                             ],
// //                             type: 'service',
// //                           },
// //                         ],
// //                         size: 'lg',
// //                         type: 'dialog',
// //                         title: '配置用户',
// //                         actions: [],
// //                         closeOnEsc: false,
// //                         showLoading: false,
// //                         showErrorMsg: false,
// //                         showCloseButton: true,
// //                       },
// //                       actionType: 'dialog',
// //                     },
// //                   ],
// //                 },
// //               },
// //             },
// //             {
// //               id: 'u:da96a4fcca02',
// //               type: 'button',
// //               label: '配置功能权限',
// //               level: 'enhance',
// //               hidden: false,
// //               onEvent: {
// //                 click: {
// //                   actions: [
// //                     {
// //                       dialog: {
// //                         id: 'u:6e64d10a67aa',
// //                         data: {
// //                           routeUrl: [],
// //                           id: '${id}',
// //                         },
// //                         body: [
// //                           {
// //                             id: 'u:5ec618c6fbf1',
// //                             api: {
// //                               url: '/ms-system/role/set-fun/${id}',
// //                               data: '${routeUrl|flat:1}',
// //                               method: 'post',
// //                               adaptor:
// //                                 'return {\r\n    msg: response.code === 200 ? api.messages.success : response.msg,\r\n    status: response.code === 200 ? 0 : response.code,\r\n    data: {\r\n      responseMsg: response.msg,\r\n    },\r\n  };',
// //                               headers: {
// //                                 systemCode: 'SystemSign',
// //                               },
// //                               dataType: 'json',
// //                               messages: {
// //                                 success: '配置成功',
// //                               },
// //                               requestAdaptor: '',
// //                             },
// //                             body: [
// //                               {
// //                                 id: 'u:5c1db442855d',
// //                                 name: 'treeDatas',
// //                                 type: 'input-tree',
// //                                 label: '请选择菜单',
// //                                 source: {
// //                                   url: '/systemsManage/roles/api/getMenus?systemCode=SystemSign',
// //                                   method: 'get',
// //                                   adaptor: '',
// //                                   dataType: 'form',
// //                                   messages: {},
// //                                   replaceData: true,
// //                                   requestAdaptor: '',
// //                                 },
// //                                 cascade: true,
// //                                 hideRoot: true,
// //                                 multiple: true,
// //                                 onlyLeaf: false,
// //                                 showIcon: false,
// //                                 joinValues: false,
// //                                 labelField: 'functionName',
// //                                 valueField: 'id',
// //                                 initiallyOpen: true,
// //                                 enableNodePath: false,
// //                                 autoCheckChildren: true,
// //                                 onEvent: {
// //                                   change: {
// //                                     actions: [
// //                                       {
// //                                         args: {
// //                                           resetPage: false,
// //                                           value: {
// //                                             routeUrl:
// //                                               '${UNIQ(${CONCAT(${treeDatas|pick:id},${treeDatas|pick:parentIds})})}',
// //                                           },
// //                                         },
// //                                         actionType: 'setValue',
// //                                         componentId: 'u:6e64d10a67aa',
// //                                       },
// //                                     ],
// //                                   },
// //                                 },
// //                               },
// //                             ],
// //                             type: 'form',
// //                             title: '表单',
// //                             initApi: {
// //                               url: '/ms-system/role/get-fun?roleId=${id}&systemCode=SystemSign',
// //                               method: 'get',
// //                               adaptor: '',
// //                               messages: {},
// //                               responseData: {
// //                                 treeDatas: '${items}',
// //                                 routeUrl: '${items|pick:id}',
// //                               },
// //                               requestAdaptor: '',
// //                             },
// //                             submitText: '提交',
// //                           },
// //                         ],
// //                         size: 'md',
// //                         type: 'dialog',
// //                         title: '功能权限配置',
// //                         className: 'app-popover',
// //                         closeOnEsc: false,
// //                         showLoading: true,
// //                         showErrorMsg: true,
// //                         dataMapSwitch: false,
// //                         showCloseButton: true,
// //                         withDefaultData: false,
// //                       },
// //                       actionType: 'dialog',
// //                     },
// //                   ],
// //                 },
// //               },
// //             },
// //             {
// //               id: 'u:f33f28a31770',
// //               type: 'button',
// //               label: '修改',
// //               level: 'enhance',
// //               onEvent: {
// //                 click: {
// //                   actions: [
// //                     {
// //                       dialog: {
// //                         id: 'u:f513da49400e',
// //                         body: [
// //                           {
// //                             id: 'u:ab0cfa666c71',
// //                             body: [
// //                               {
// //                                 id: 'u:d6c78a60ae46',
// //                                 name: 'roleName',
// //                                 type: 'input-text',
// //                                 label: '角色名称',
// //                                 required: true,
// //                                 clearable: true,
// //                                 placeholder: '请输入角色名称',
// //                               },
// //                               {
// //                                 id: 'u:b5013d98ec5f',
// //                                 name: 'roleCode',
// //                                 type: 'input-text',
// //                                 label: '角色编码',
// //                                 required: true,
// //                                 clearable: true,
// //                                 placeholder: '请输入角色编码',
// //                               },
// //                               {
// //                                 id: 'u:105cdf8a593c',
// //                                 name: 'isEnable',
// //                                 type: 'radios',
// //                                 label: '是否启用',
// //                                 value: '1',
// //                                 options: [
// //                                   {
// //                                     label: '启用',
// //                                     value: '1',
// //                                   },
// //                                   {
// //                                     label: '禁用',
// //                                     value: '0',
// //                                   },
// //                                 ],
// //                               },
// //                               {
// //                                 id: 'u:05a9316192ad',
// //                                 name: 'roleDes',
// //                                 type: 'textarea',
// //                                 label: ' 角色描述',
// //                                 maxRows: 20,
// //                                 minRows: 3,
// //                                 placeholder: '请输入角色描述',
// //                               },
// //                             ],
// //                             type: 'form',
// //                             title: '',
// //                             actions: [],
// //                             wrapWithPanel: false,
// //                           },
// //                         ],
// //                         size: 'md',
// //                         type: 'dialog',
// //                         title: '修改角色',
// //                         actions: [
// //                           {
// //                             id: 'u:5a465611545f',
// //                             type: 'button-toolbar',
// //                             label: '',
// //                             buttons: [
// //                               {
// //                                 id: 'u:2770982ca897',
// //                                 type: 'button',
// //                                 close: true,
// //                                 label: '取消',
// //                                 level: 'secondary',
// //                                 onEvent: {
// //                                   click: {
// //                                     actions: [],
// //                                   },
// //                                 },
// //                               },
// //                               {
// //                                 id: 'u:8ed4e99c4512',
// //                                 type: 'button',
// //                                 close: true,
// //                                 label: '提交',
// //                                 level: 'primary',
// //                                 onEvent: {
// //                                   click: {
// //                                     actions: [
// //                                       {
// //                                         args: {
// //                                           api: {
// //                                             url: '/ms-system/role/edit/${id}',
// //                                             data: {
// //                                               '&': '$$',
// //                                             },
// //                                             method: 'post',
// //                                             adaptor:
// //                                               'return {\r\n    msg: response.code === 200 ? api.messages.success : response.msg,\r\n    status: response.code === 200 ? 0 : response.code,\r\n    data: {\r\n      responseMsg: response.msg\r\n    },\r\n  };',
// //                                             dataType: 'json',
// //                                             messages: {
// //                                               success: '修改成功',
// //                                             },
// //                                             requestAdaptor: '',
// //                                           },
// //                                           options: {
// //                                             silent: false,
// //                                           },
// //                                         },
// //                                         outputVar: 'responseResult',
// //                                         actionType: 'ajax',
// //                                       },
// //                                       {
// //                                         args: {
// //                                           resetPage: false,
// //                                         },
// //                                         data: null,
// //                                         actionType: 'reload',
// //                                         componentId: 'u:cdf19c33cba3',
// //                                       },
// //                                     ],
// //                                   },
// //                                 },
// //                               },
// //                             ],
// //                           },
// //                         ],
// //                         showLoading: true,
// //                         showErrorMsg: false,
// //                         dataMapSwitch: false,
// //                         showCloseButton: true,
// //                       },
// //                       actionType: 'dialog',
// //                     },
// //                   ],
// //                 },
// //               },
// //             },
// //             {
// //               id: 'u:8bd33adb5d8d',
// //               api: {
// //                 url: '/ms-system/role/delete/${id}',
// //                 method: 'post',
// //                 adaptor:
// //                   'return {\r\n    msg: response.code === 200 ? api.messages.success : response.msg,\r\n    status: response.code === 200 ? 0 : response.code,\r\n    data: {\r\n      responseMsg: response.msg\r\n    },\r\n  };',
// //                 dataType: 'json',
// //                 messages: {
// //                   success: '删除成功',
// //                 },
// //                 requestAdaptor:
// //                   'return {\r\n    ...api,\r\n    config: {\r\n      ...api.config,\r\n      method: api.method,\r\n    },\r\n  };',
// //               },
// //               type: 'button',
// //               label: '删除',
// //               level: 'danger',
// //               reload: 'crud',
// //               actionType: 'ajax',
// //               confirmText: '确定要删除？',
// //               confirmTitle: '删除',
// //             },
// //           ],
// //         },
// //       ],
// //       messages: {},
// //       initFetch: true,
// //       pageField: 'pageIndex',
// //       bulkActions: [],
// //       itemActions: [],
// //       perPageField: 'pageSize',
// //       syncLocation: false,
// //       defaultParams: {
// //         pageSize: 10,
// //         pageIndex: 1,
// //       },
// //       footerToolbar: [
// //         {
// //           type: 'statistics',
// //         },
// //         {
// //           type: 'pagination',
// //         },
// //         {
// //           id: 'u:4567916ff3cf',
// //           tpl: '内容',
// //           type: 'switch-per-page',
// //           align: 'right',
// //           wrapperComponent: '',
// //         },
// //       ],
// //       autoFillHeight: true,
// //       perPageAvailable: [10, 20, 50],
// //       alwaysShowPagination: true,
// //     },
// //   ],
// //   style: {
// //     boxShadow: ' 0px 0px 0px 0px transparent',
// //   },
// //   title: '角色管理',
// //   regions: ['body'],
// //   pullRefresh: {
// //     disabled: true,
// //   },
// // };
// // console.log('data---\n', JSON.stringify(data));

// const Roles = async () => {
//   const data = await getData();

//   return <AimsRender jsonView={data} />;
// };

// export default Roles;

import { requestAims } from '@/utils/request';
import dynamic from 'next/dynamic';
const AimsRender = dynamic(() => import('@/components/AimsRender'), { ssr: false });

const Roles = async () => {
  const json = await requestAims({ url: '/api/aims-lists/30?fields[0]=content' });
  return <AimsRender jsonView={json.data.attributes.content} />;
};

export default Roles;
