// import React from 'react';
// import dynamic from 'next/dynamic';
// import { dev } from '@/utils/util';
// const AimsRender = dynamic(() => import('@/components/AimsRender'), { ssr: false });

// const hash = new Date().getTime();

// const getData = async () => {
//   const json = await (
//     await fetch(`${process.env.NEXT_PUBLIC_ANALYTICS_Aims_server}/getAimsJsonById?id=7#${hash}`, {
//       cache: dev ? 'no-store' : 'force-cache',
//       next: {
//         tags: ['0x7user'],
//       },
//     })
//   ).json();
//   return json.data.item.content;
// };

// // const data = {
// //   id: 'u:024a4cea59db',
// //   body: [
// //     {
// //       id: 'u:7419d6c03f5a',
// //       api: {
// //         url: '/systemsManage/users/api/getUserPage',
// //         data: { '&': '$$' },
// //         method: 'get',
// //         dataType: 'json',
// //         messages: {},
// //         replaceData: true,
// //       },
// //       name: 'crud',
// //       type: 'crud',
// //       filter: {
// //         id: 'u:ed5798412d44',
// //         body: [
// //           {
// //             id: 'u:c4ad86e24b0a',
// //             body: [
// //               {
// //                 id: 'u:f4db433b6939',
// //                 name: 'userCode',
// //                 type: 'input-text',
// //                 label: '用户编码',
// //                 clearable: true,
// //                 placeholder: '请输入用户编码',
// //                 inputClassName: 'w',
// //               },
// //               {
// //                 id: 'u:5ad9bd34b4bf',
// //                 name: 'orgId',
// //                 type: 'tree-select',
// //                 label: '所属部门',
// //                 source: {
// //                   url: '/systemsManage/users/api/getOrgTree',
// //                   method: 'get',
// //                   adaptor: '',
// //                   messages: {},
// //                 },
// //                 multiple: false,
// //                 showIcon: false,
// //                 className: 'm-l',
// //                 clearable: false,
// //                 labelField: 'orgName',
// //                 valueField: 'id',
// //                 placeholder: '请选择所属部门',
// //                 initiallyOpen: true,
// //                 enableNodePath: false,
// //                 inputClassName: 'w',
// //                 hideNodePathLabel: true,
// //                 treeContainerClassName: '',
// //               },
// //               {
// //                 id: 'u:569333ba7a58',
// //                 name: 'positionId',
// //                 type: 'select',
// //                 label: '岗位',
// //                 source: {
// //                   url: '/systemsManage/users/api/getPositions?orgId=${orgId}',
// //                   method: 'get',
// //                 },
// //                 multiple: false,
// //                 className: 'm-l',
// //                 labelField: 'positionName',
// //                 valueField: 'id',
// //                 placeholder: '请选择岗位',
// //                 inputClassName: 'w',
// //               },
// //               {
// //                 id: 'u:0f961f2a86be',
// //                 name: 'mobile',
// //                 type: 'input-text',
// //                 label: '手机号',
// //                 className: 'm-l',
// //                 clearable: true,
// //                 placeholder: '请输入手机号',
// //                 inputClassName: 'w',
// //               },
// //               {
// //                 id: 'u:dbb52238d7e3',
// //                 name: 'userName',
// //                 type: 'input-text',
// //                 label: '用户姓名',
// //                 className: 'm-l',
// //                 clearable: true,
// //                 placeholder: '请输入用户姓名',
// //                 inputClassName: 'w',
// //               },
// //             ],
// //             mode: 'inline',
// //             type: 'form',
// //             title: '查询条件',
// //             target: 'crud',
// //             actions: [
// //               { id: 'u:57d6dfdfb28b', type: 'submit', label: '查询', level: 'primary' },
// //               {
// //                 id: 'u:ec33662e8cd8',
// //                 type: 'reset',
// //                 label: '重置',
// //                 level: 'secondary',
// //                 onEvent: {
// //                   click: {
// //                     actions: [
// //                       { actionType: 'clear', componentId: 'u:c4ad86e24b0a' },
// //                       { actionType: 'submit', componentId: 'u:c4ad86e24b0a' },
// //                     ],
// //                   },
// //                 },
// //               },
// //               {
// //                 id: 'u:8428f7e1e0cc',
// //                 type: 'button',
// //                 label: '新增',
// //                 level: 'success',
// //                 dialog: {
// //                   id: 'u:dc9e8c74297f',
// //                   body: [
// //                     {
// //                       id: 'u:28f2db5c4cc2',

// //                       body: [
// //                         {
// //                           id: 'u:25b4251a0a14',
// //                           name: 'userName',
// //                           type: 'input-text',
// //                           label: '用户姓名',
// //                           required: true,
// //                           className: 'm-l',
// //                           placeholder: '请输入用户姓名',
// //                           inputClassName: 'w',
// //                           labelClassName: '',
// //                         },
// //                         {
// //                           id: 'u:cb850fafe541',
// //                           name: 'userCode',
// //                           type: 'input-text',
// //                           label: '用户编码',
// //                           required: true,
// //                           className: 'm-l',
// //                           placeholder: '请输入用户编码',
// //                           inputClassName: 'w',
// //                           labelClassName: '',
// //                         },
// //                         {
// //                           id: 'u:cb60ecfa381d',
// //                           name: 'orgId',
// //                           type: 'tree-select',
// //                           label: '所属部门',
// //                           source: {
// //                             url: '/systemsManage/users/api/getOrgTree',
// //                             method: 'get',
// //                             adaptor: '',
// //                             messages: {},
// //                             requestAdaptor: '',
// //                           },
// //                           multiple: false,
// //                           required: true,
// //                           showIcon: false,
// //                           className: 'm-l',
// //                           clearable: false,
// //                           labelField: 'orgName',
// //                           valueField: 'id',
// //                           placeholder: '请选择所属部门',
// //                           initiallyOpen: true,
// //                           enableNodePath: false,
// //                           inputClassName: 'w',
// //                           labelClassName: '',
// //                           hideNodePathLabel: true,
// //                         },
// //                         {
// //                           id: 'u:71e2fe665250',
// //                           name: 'positionId',
// //                           type: 'select',
// //                           label: '岗位',
// //                           source: {
// //                             url: '/systemsManage/users/api/getPositions?orgId=${orgId}',
// //                             method: 'get',
// //                           },
// //                           multiple: true,
// //                           required: true,
// //                           className: 'm-l-lg',
// //                           labelField: 'positionName',
// //                           valueField: 'id',
// //                           maxTagCount: 2,
// //                           placeholder: '请选择岗位',
// //                           inputClassName: 'w',
// //                           labelClassName: 'm-l-sm',
// //                         },
// //                         {
// //                           id: 'u:009dfa212733',
// //                           name: 'officeNum',
// //                           type: 'input-text',
// //                           label: '办公电话',
// //                           className: 'm-l',
// //                           placeholder: '请输入办公电话',
// //                           inputClassName: 'w',
// //                         },
// //                         {
// //                           id: 'u:009dfa97c733',
// //                           name: 'mobile',
// //                           type: 'input-text',
// //                           label: '手机号',
// //                           className: 'm-l-lg',
// //                           placeholder: '请输入手机号',
// //                           inputClassName: 'w',
// //                         },
// //                         {
// //                           id: 'u:1c81636b1bd5',
// //                           name: 'shortNum',
// //                           type: 'input-text',
// //                           label: '短号',
// //                           className: 'm-l-lg',
// //                           placeholder: '请输入短号',
// //                           inputClassName: 'w',
// //                           labelClassName: 'm-l-sm',
// //                         },
// //                         {
// //                           id: 'u:3181f0447b57',
// //                           name: 'email',
// //                           type: 'input-text',
// //                           label: '邮箱',
// //                           className: 'm-l-lg',
// //                           placeholder: '请输入邮箱',
// //                           inputClassName: 'w',
// //                           labelClassName: 'm-l-sm',
// //                         },
// //                         {
// //                           id: 'u:106216d5560a',
// //                           mode: 'inline',
// //                           name: 'loginAccount',
// //                           type: 'input-text',
// //                           label: '登陆账户',
// //                           required: true,
// //                           className: 'm-l',
// //                           placeholder: '请输入账户名称',
// //                           inputClassName: 'w',
// //                         },
// //                         {
// //                           id: 'u:110750adc7aa',
// //                           mode: 'inline',
// //                           name: 'password',
// //                           type: 'input-password',
// //                           label: '密码',
// //                           required: true,
// //                           className: 'm-l-lg',
// //                           placeholder: '请输入密码',
// //                           showCounter: false,
// //                           validations: {},
// //                           inputClassName: 'w',
// //                           labelClassName: 'm-l-sm',
// //                           validationErrors: {},
// //                         },
// //                         {
// //                           id: 'u:c689eca19e7e',
// //                           mode: 'inline',
// //                           name: 'confirmPassword',
// //                           type: 'input-password',
// //                           label: '确认密码',
// //                           required: true,
// //                           className: 'm-l',
// //                           placeholder: '请输入密码',
// //                           showCounter: false,
// //                           validations: { equalsField: 'password' },
// //                           inputClassName: 'w',
// //                           validateOnChange: true,
// //                         },
// //                         {
// //                           id: 'u:1613ad730037',
// //                           name: 'sex',
// //                           type: 'radios',
// //                           label: '性别',
// //                           value: '1',
// //                           options: [
// //                             { label: '男', value: '1' },
// //                             { label: '女', value: '0' },
// //                           ],
// //                           className: 'm-l-lg',
// //                           inputClassName: 'w',
// //                           labelClassName: 'm-l',
// //                         },
// //                         {
// //                           id: 'u:0278221d0449',
// //                           name: 'userState',
// //                           type: 'radios',
// //                           label: '用户状态',
// //                           value: '1',
// //                           options: [
// //                             { label: '启用', value: '1' },
// //                             { label: '停用', value: '0' },
// //                           ],
// //                           className: 'm-l',
// //                           inputClassName: 'w',
// //                         },
// //                       ],
// //                       mode: 'inline',
// //                       type: 'form',
// //                       title: '',
// //                       actions: [],
// //                       wrapWithPanel: false,
// //                       resetAfterSubmit: true,
// //                     },
// //                   ],
// //                   size: 'md',
// //                   type: 'dialog',
// //                   title: '新增用户',
// //                   closeOnEsc: false,
// //                   showLoading: false,
// //                   showErrorMsg: false,
// //                   dataMapSwitch: false,
// //                   showCloseButton: true,
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
// //                                       url: '/ms-system/user/save',
// //                                       data: { '&': '$$', positionId: '${positionId|split}' },
// //                                       method: 'post',
// //                                       adaptor:
// //                                         'return {\r\n    msg: response.code === 200 ? api.messages.success : response.msg,\r\n    status: response.code === 200 ? 0 : response.code,\r\n    data: {\r\n      responseMsg: response.msg,\r\n    },\r\n  };',
// //                                       dataType: 'json',
// //                                       messages: { success: '成功添加人员' },
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
// //                                   componentId: 'u:7419d6c03f5a',
// //                                 },
// //                               ],
// //                             },
// //                           },
// //                         },
// //                       ],
// //                     },
// //                   ],
// //                 },
// //                 actionType: 'dialog',
// //               },
// //             ],
// //             className: '',
// //             submitText: '',
// //             wrapWithPanel: true,
// //             panelClassName: '',
// //           },
// //         ],
// //         mode: 'inline',
// //         title: ' 查询条件',
// //         reload: 'crud',
// //         actions: [],
// //         wrapWithPanel: false,
// //       },
// //       columns: [
// //         { id: 'u:63cb0b13beb3', tpl: '${index + 1}', type: 'tpl', label: '序号' },
// //         { id: 'u:9b3fda592bb1', name: 'userName', type: 'text', label: '用户姓 名' },
// //         { id: 'u:0398c2d2724e', name: 'userCode', type: 'text', label: '用户编码' },
// //         { id: 'u:01381073d6fd', name: 'loginAccount', type: 'text', label: '登陆账号' },
// //         {
// //           id: 'u:6ad99a601741',
// //           map: { '0': '女', '1': '男' },
// //           name: 'sex',
// //           type: 'mapping',
// //           label: '性别',
// //         },
// //         { id: 'u:647acc10adce', name: 'mobile', type: 'text', label: '手机号' },
// //         {
// //           id: 'u:bb6916fe8958',
// //           tpl: '${positionName|join}',
// //           name: 'positionName',
// //           type: 'tpl',
// //           label: '部门岗位',
// //         },
// //         { id: 'u:bcf6ecea3115', name: 'email', type: 'text', label: '邮箱' },
// //         { id: 'u:9b1bf32bc204', name: 'shortNum', type: 'text', label: '短号' },
// //         {
// //           id: 'u:807578b42cf7',
// //           map: { '0': '禁用', '1': '启用' },
// //           name: 'userState',
// //           type: 'mapping',
// //           label: '用户状态',
// //         },
// //         {
// //           id: 'u:79aa5a684b3c',
// //           name: 'id',
// //           type: 'button-toolbar',
// //           label: '操作',
// //           buttons: [
// //             {
// //               id: 'u:02ff49c703c4',
// //               type: 'button',
// //               label: '修改',
// //               level: 'enhance',
// //               onEvent: {
// //                 click: {
// //                   actions: [
// //                     {
// //                       dialog: {
// //                         id: 'u:035b0c4432c6',
// //                         body: [
// //                           {
// //                             id: 'u:28f2db5c4cc2',
// //                             body: [
// //                               {
// //                                 id: 'u:25b4251a0a14',
// //                                 name: 'userName',
// //                                 type: 'input-text',
// //                                 label: '用户姓名',
// //                                 required: true,
// //                                 className: 'm-l',
// //                                 placeholder: '请输入用户姓名',
// //                                 inputClassName: 'w',
// //                                 labelClassName: '',
// //                               },
// //                               {
// //                                 id: 'u:cb850fafe541',
// //                                 name: 'userCode',
// //                                 type: 'input-text',
// //                                 label: '用户编码',
// //                                 required: true,
// //                                 className: 'm-l',
// //                                 placeholder: '请输入用户编码',
// //                                 inputClassName: 'w',
// //                                 labelClassName: '',
// //                               },
// //                               {
// //                                 id: 'u:cb60ecfa381d',
// //                                 name: 'orgId',
// //                                 type: 'tree-select',
// //                                 label: '所属部门',
// //                                 source: '/systemsManage/users/api/getOrgTree',
// //                                 multiple: false,
// //                                 required: true,
// //                                 showIcon: false,
// //                                 className: 'm-l',
// //                                 clearable: false,
// //                                 labelField: 'orgName',
// //                                 valueField: 'id',
// //                                 placeholder: '请选择所属部门',
// //                                 initiallyOpen: true,
// //                                 enableNodePath: false,
// //                                 inputClassName: 'w',
// //                                 labelClassName: '',
// //                                 hideNodePathLabel: true,
// //                               },
// //                               {
// //                                 id: 'u:71e2fe665250',
// //                                 name: 'positionId',
// //                                 type: 'select',
// //                                 label: '岗位',
// //                                 source: {
// //                                   url: '/ms-system/org/list-position?orgId=${orgId}',
// //                                   method: 'get',
// //                                 },
// //                                 multiple: true,
// //                                 required: true,
// //                                 className: 'm-l-lg',
// //                                 labelField: 'positionName',
// //                                 valueField: 'id',
// //                                 maxTagCount: 2,
// //                                 placeholder: '请选择岗位',
// //                                 inputClassName: 'w',
// //                                 labelClassName: 'm-l-sm',
// //                               },
// //                               {
// //                                 id: 'u:009dfa2121733',
// //                                 name: 'officeNum',
// //                                 type: 'input-text',
// //                                 label: '办公电话',
// //                                 className: 'm-l',
// //                                 placeholder: '请输入办公电话',
// //                                 inputClassName: 'w',
// //                               },
// //                               {
// //                                 id: 'u:009dfa97c733',
// //                                 name: 'mobile',
// //                                 type: 'input-text',
// //                                 label: '手机号',
// //                                 className: 'm-l-lg',
// //                                 placeholder: '请输入手机号',
// //                                 inputClassName: 'w',
// //                               },
// //                               {
// //                                 id: 'u:1c81636b1bd5',
// //                                 name: 'shortNum',
// //                                 type: 'input-text',
// //                                 label: '短号',
// //                                 className: 'm-l-lg',
// //                                 placeholder: '请输入短号',
// //                                 inputClassName: 'w',
// //                                 labelClassName: 'm-l-sm',
// //                               },
// //                               {
// //                                 id: 'u:3181f0447b57',
// //                                 name: 'email',
// //                                 type: 'input-text',
// //                                 label: '邮箱',
// //                                 className: 'm-l-lg',
// //                                 placeholder: '请输入邮箱',
// //                                 inputClassName: 'w',
// //                                 labelClassName: 'm-l-sm',
// //                               },
// //                               {
// //                                 id: 'u:1613ad730037',
// //                                 name: 'sex',
// //                                 type: 'radios',
// //                                 label: '性别',
// //                                 value: '1',
// //                                 options: [
// //                                   { label: '男', value: '1' },
// //                                   { label: '女', value: '0' },
// //                                 ],
// //                                 className: 'm-l-lg',
// //                                 inputClassName: 'w',
// //                                 labelClassName: 'm-l',
// //                               },
// //                               {
// //                                 id: 'u:0278221d0449',
// //                                 name: 'userState',
// //                                 type: 'radios',
// //                                 label: '用户状态',
// //                                 value: '1',
// //                                 options: [
// //                                   { label: '启用', value: '1' },
// //                                   { label: '停用', value: '0' },
// //                                 ],
// //                                 className: 'm-l',
// //                                 inputClassName: 'w',
// //                               },
// //                               {
// //                                 id: 'u:106216d5560a',
// //                                 mode: 'inline',
// //                                 name: 'loginAccount',
// //                                 type: 'hidden',
// //                                 label: '登陆账户',
// //                                 required: true,
// //                                 className: 'm-l',
// //                                 placeholder: '请输入账户名称',
// //                                 inputClassName: 'w',
// //                               },
// //                               {
// //                                 id: 'u:110750adc7aa',
// //                                 mode: 'inline',
// //                                 name: 'password',
// //                                 type: 'hidden',
// //                                 label: '密码',
// //                                 required: true,
// //                                 className: 'm-l-lg',
// //                                 placeholder: '请输入账户名称',
// //                                 showCounter: false,
// //                                 validations: {},
// //                                 inputClassName: 'w',
// //                                 labelClassName: 'm-l-sm',
// //                                 validationErrors: {},
// //                               },
// //                             ],
// //                             mode: 'inline',
// //                             type: 'form',
// //                             title: '',
// //                             actions: [],
// //                             wrapWithPanel: false,
// //                           },
// //                         ],
// //                         size: 'md',
// //                         type: 'dialog',
// //                         title: '修改用户信息',
// //                         actions: [
// //                           {
// //                             id: 'u:e3cf45a65b12',
// //                             type: 'button-toolbar',
// //                             label: '',
// //                             buttons: [
// //                               {
// //                                 id: 'u:72eb4d16b58c',
// //                                 type: 'button',
// //                                 close: true,
// //                                 label: '取消',
// //                                 level: 'secondary',
// //                                 onEvent: { click: { actions: [] } },
// //                               },
// //                               {
// //                                 id: 'u:e7374baf18ff',
// //                                 type: 'button',
// //                                 close: true,
// //                                 label: '确定',
// //                                 level: 'primary',
// //                                 onEvent: {
// //                                   click: {
// //                                     actions: [
// //                                       {
// //                                         args: {
// //                                           api: {
// //                                             url: '/ms-system/user/modify/${id}',
// //                                             data: {
// //                                               '&': '$$',
// //                                               positionId: '${positionId|split}',
// //                                             },
// //                                             method: 'post',
// //                                             adaptor:
// //                                               'return {\r\n    msg: response.code === 200 ? api.messages.success : response.msg,\r\n    status: response.code === 200 ? 0 : response.code,\r\n    data: {\r\n      responseMsg: response.msg,\r\n    },\r\n  };',
// //                                             dataType: 'json',
// //                                             messages: { success: '修改成功' },
// //                                             requestAdaptor: '',
// //                                           },
// //                                           options: { silent: false },
// //                                         },
// //                                         outputVar: 'responseResult',
// //                                         actionType: 'ajax',
// //                                       },
// //                                       {
// //                                         args: { resetPage: false },
// //                                         data: null,
// //                                         actionType: 'reload',
// //                                         componentId: 'u:7419d6c03f5a',
// //                                       },
// //                                     ],
// //                                   },
// //                                 },
// //                               },
// //                             ],
// //                           },
// //                         ],
// //                         closeOnEsc: false,
// //                         showLoading: true,
// //                         showErrorMsg: true,
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
// //               id: 'u:e0e709aa8fe4',
// //               type: 'button',
// //               label: '注销',
// //               level: 'danger',
// //               onEvent: {
// //                 click: {
// //                   actions: [
// //                     {
// //                       dialog: {
// //                         id: 'u:17c5d555bf7c',
// //                         body: [
// //                           {
// //                             id: 'u:1564b72fe28c',
// //                             tpl: '是否注销该用户！',
// //                             type: 'static',
// //                             label: '',
// //                             borderMode: 'none',
// //                           },
// //                         ],
// //                         type: 'dialog',
// //                         title: '注销用户',
// //                         actions: [
// //                           {
// //                             id: 'u:31c270d81fe4',
// //                             type: 'button-toolbar',
// //                             label: '',
// //                             buttons: [
// //                               {
// //                                 id: 'u:14f346d6cadf',
// //                                 type: 'button',
// //                                 close: true,
// //                                 label: '取消',
// //                                 level: 'secondary',
// //                                 onEvent: { click: { actions: [] } },
// //                               },
// //                               {
// //                                 id: 'u:83deb5a33bc9',
// //                                 type: 'button',
// //                                 close: true,
// //                                 label: '确定',
// //                                 level: 'primary',
// //                                 onEvent: {
// //                                   click: {
// //                                     actions: [
// //                                       {
// //                                         args: {
// //                                           api: {
// //                                             url: '/ms-system/user/close/${id}',
// //                                             method: 'post',
// //                                             adaptor:
// //                                               'return {\r\n    msg: response.code === 200 ? api.messages.success : response.msg,\r\n    status: response.code === 200 ? 0 : response.code,\r\n    data: {\r\n      responseMsg: response.msg\r\n    },\r\n  };',
// //                                             dataType: 'json',
// //                                             messages: { success: '注销成功' },
// //                                             requestAdaptor: '',
// //                                           },
// //                                           options: { silent: false },
// //                                         },
// //                                         outputVar: 'responseResult',
// //                                         actionType: 'ajax',
// //                                       },
// //                                       {
// //                                         args: { resetPage: false },
// //                                         data: null,
// //                                         actionType: 'reload',
// //                                         componentId: 'u:7419d6c03f5a',
// //                                       },
// //                                     ],
// //                                   },
// //                                 },
// //                               },
// //                             ],
// //                           },
// //                         ],
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
// //               id: 'u:1f13ab039a67',
// //               type: 'button',
// //               label: '重置密码',
// //               level: 'enhance',
// //               onEvent: {
// //                 click: {
// //                   actions: [
// //                     {
// //                       dialog: {
// //                         id: 'u:57665b7de38a',
// //                         body: [
// //                           {
// //                             id: 'u:5a7261d5ca1a',
// //                             tpl: '是否重置密码！',
// //                             type: 'static',
// //                             label: '',
// //                             borderMode: 'none',
// //                           },
// //                         ],
// //                         type: 'dialog',
// //                         title: '是否重置密码',
// //                         actions: [
// //                           {
// //                             id: 'u:de71ee14a09e',
// //                             type: 'button-toolbar',
// //                             label: '',
// //                             buttons: [
// //                               {
// //                                 id: 'u:a588074ba422',
// //                                 type: 'button',
// //                                 close: true,
// //                                 label: '取消',
// //                                 level: 'secondary',
// //                                 onEvent: { click: { actions: [] } },
// //                               },
// //                               {
// //                                 id: 'u:7262b43918a2',
// //                                 type: 'button',
// //                                 close: true,
// //                                 label: '确定',
// //                                 level: 'primary',
// //                                 onEvent: {
// //                                   click: {
// //                                     actions: [
// //                                       {
// //                                         args: {
// //                                           api: {
// //                                             url: '/ms-system/user/reset-pwd/${id}',
// //                                             method: 'post',
// //                                             adaptor:
// //                                               'return {\r\n    msg: response.code === 200 ? api.messages.success : response.msg,\r\n    status: response.code === 200 ? 0 : response.code,\r\n    data: {\r\n      responseMsg: response.msg\r\n    },\r\n  };',
// //                                             dataType: 'form',
// //                                             messages: {success: '重置成功'},
// //                                             requestAdaptor: '',
// //                                           },
// //                                           options: { silent: false },
// //                                         },
// //                                         outputVar: 'responseResult',
// //                                         actionType: 'ajax',
// //                                       },
// //                                       {
// //                                         args: { resetPage: false },
// //                                         data: null,
// //                                         actionType: 'reload',
// //                                         componentId: 'u:7419d6c03f5a',
// //                                       },
// //                                     ],
// //                                   },
// //                                 },
// //                               },
// //                             ],
// //                           },
// //                         ],
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
// //               id: 'u:3e59a5a6bed6',
// //               type: 'button',
// //               label: '配置角色',
// //               level: 'enhance',
// //               onEvent: {
// //                 click: {
// //                   actions: [
// //                     {
// //                       args: {
// //                         api: {
// //                           url: '/ms-system/user/get-roles/${id}',
// //                           method: 'get',
// //                           dataType: 'form',
// //                           responseData: { idList: '${items}' },
// //                         },
// //                         options: { silent: false },
// //                       },
// //                       outputVar: 'responseResult',
// //                       actionType: 'ajax',
// //                     },
// //                     {
// //                       dialog: {
// //                         id: 'u:22ba987e9d8f',
// //                         body: [
// //                           {
// //                             id: 'u:5687313dac1d',
// //                             name: 'roleList',
// //                             type: 'transfer',
// //                             label: '',
// //                             value: '${idList|join}',
// //                             source: {
// //                               url: '/api/system/users/roleList',
// //                               data: { isEnable: 1, pageSize: 999, pageIndex: 1 },
// //                               method: 'get',
// //                               dataType: 'form',
// //                               replaceData: true,
// //                             },
// //                             columns: [
// //                               { id: 'u:d2fe4b5fafff', name: 'roleName', label: '角色名称' },
// //                               { id: 'u:e8c0998fb864', name: 'roleDes', label: '角色描述' },
// //                             ],
// //                             labelField: 'roleName',
// //                             searchable: true,
// //                             selectMode: 'table',
// //                             valueField: 'id',
// //                             resultSearchable: true,
// //                             resultListModeFollowSelect: true,
// //                           },
// //                         ],
// //                         size: 'xl',
// //                         type: 'dialog',
// //                         title: '角色列表',
// //                         onEvent: {
// //                           cancel: {
// //                             weight: 0,
// //                             actions: [{ args: {}, actionType: 'closeDialog' }],
// //                           },
// //                           confirm: {
// //                             weight: 0,
// //                             actions: [
// //                               {
// //                                 args: {
// //                                   api: {
// //                                     url: '/ms-system/user/set-roles/${id}',
// //                                     data: '${roleList|split}',
// //                                     method: 'post',
// //                                     adaptor:
// //                                       'return {\r\n    msg: response.code === 200 ? api.messages.success : response.msg,\r\n    status: response.code === 200 ? 0 : response.code,\r\n    data: {\r\n      responseMsg: api.messages.success,\r\n    },\r\n  };',
// //                                     dataType: 'json',
// //                                     messages: { success: '配置成功' },
// //                                     replaceData: true,
// //                                     requestAdaptor: '',
// //                                   },
// //                                   options: {},
// //                                 },
// //                                 outputVar: 'responseResult',
// //                                 actionType: 'ajax',
// //                               },
// //                               { args: {}, actionType: 'closeDialog' },
// //                             ],
// //                           },
// //                         },
// //                         closeOnEsc: false,
// //                         showLoading: true,
// //                         showErrorMsg: true,
// //                         dataMapSwitch: false,
// //                         showCloseButton: true,
// //                       },
// //                       actionType: 'dialog',
// //                     },
// //                   ],
// //                 },
// //               },
// //             },
// //           ],
// //         },
// //       ],
// //       features: ['filter'],
// //       messages: {},
// //       draggable: false,
// //       initFetch: true,
// //       pageField: 'pageIndex',
// //       affixHeader: false,
// //       bulkActions: [],
// //       itemActions: [],
// //       perPageField: 'pageSize',
// //       syncLocation: false,
// //       defaultParams: { pageSize: 10, pageIndex: 1 },
// //       footerToolbar: [
// //         { type: 'statistics' },
// //         { type: 'pagination', align: 'right' },
// //         {
// //           id: 'u:51410ee1ae5e',
// //           tpl: '内容',
// //           type: 'switch-per-page',
// //           align: 'right',
// //           wrapperComponent: '',
// //         },
// //       ],
// //       headerToolbar: [],
// //       autoFillHeight: true,
// //       perPageAvailable: [10, 20, 50],
// //       alwaysShowPagination: true,
// //     },
// //   ],
// //   type: 'page',
// //   style: { boxShadow: ' 0px 0px 0px 0px transparent' },
// //   title: '用户管理',
// //   regions: ['body'],
// // };

// // console.log('data------\n', JSON.stringify(data));

// const Users = async () => {
//   const data = await getData();

//   return <AimsRender jsonView={data} />;
// };

// export default Users;

import { requestAims } from '@/utils/request';
import dynamic from 'next/dynamic';
const AimsRender = dynamic(() => import('@/components/AimsRender'), { ssr: false });

const Users = async () => {
  const json = await requestAims({ url: '/api/aims-lists/31?fields[0]=content' });
  return <AimsRender jsonView={json.data.attributes.content} />;
};

export default Users;
