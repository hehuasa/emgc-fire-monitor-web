// 'use client';
// import { CurdAdaptor } from '@/components/AmisAdaptor';
// import { Box } from '@chakra-ui/react';
// import dynamic from 'next/dynamic';

// const AimsRender = dynamic(() => import('@/components/AimsRender'), { ssr: false });

// const data = {
//   type: 'page',
//   title: '',
//   data: {},
//   aside: [],
//   toolbar: [],
//   body: [
//     {
//       type: 'crud',
//       name: 'crud',
//       syncLocation: false,
//       api: {
//         method: 'get',
//         url: '/cx-scws/emgc_resource_info/page',
//         messages: {},
//         dataType: 'form',
//         data: {
//           pageNum: '${pageNum}',
//           pageSize: '${pageSize}',
//           resTypeId: '${resTypeId_search}',
//         },
//         replaceData: true,
//       },
//       columns: [
//         {
//           name: 'resName',
//           label: '资源名称',
//           type: 'text',
//         },
//         {
//           type: 'text',
//           label: '资源类别',
//           name: 'resTypeName',
//         },
//         {
//           type: 'text',
//           label: '报警种类名称',
//           name: 'specifications',
//         },
//         {
//           type: 'text',
//           label: '单位',
//           name: 'unit',
//         },
//         {
//           type: 'operation',
//           label: '操作',
//           buttons: [
//             {
//               label: '编辑',
//               type: 'button',
//               actionType: 'dialog',
//               id: 'u:4cf9dae5d4ce',
//               level: 'enhance',
//               dialog: {
//                 title: '编辑',
//                 body: {
//                   type: 'form',

//                   body: [
//                     {
//                       type: 'input-text',
//                       name: 'resName',
//                       label: '资源名称',
//                       placeholder: '请输入资源名称',
//                       required: true,
//                       validateOnChange: false,
//                     },
//                     {
//                       type: 'select',
//                       name: 'resTypeId',
//                       label: '资源类别',
//                       placeholder: '请选择资源类别',
//                       required: true,
//                       validateOnChange: false,
//                       source: {
//                         url: '/cx-scws/dc_dict/list_item',
//                         method: 'get',
//                         messages: {},
//                         dataType: 'json',
//                         data: {
//                           dictCode: 'resource_type',
//                         },
//                         replaceData: true,
//                       },
//                       labelField: 'cnName',
//                       valueField: 'value',
//                     },
//                     {
//                       type: 'input-text',
//                       name: 'specifications',
//                       label: '规格型号',
//                       placeholder: '请输入规格型号',
//                       required: true,
//                       validateOnChange: false,
//                     },
//                     {
//                       type: 'input-text',
//                       name: 'unit',
//                       label: '单位',
//                       placeholder: '请输入单位',
//                       required: true,
//                       validateOnChange: false,
//                     },
//                   ],
//                   api: {
//                     url: '/cx-scws/emgc_resource_info/update',
//                     method: 'post',
//                     dataType: 'json',
//                     messages: {
//                       success: '修改成功',
//                     },
//                     adaptor: CurdAdaptor,
//                     data: {
//                       '&': '$$',
//                       id: '${id}',
//                     },
//                   },
//                 },

//                 id: 'u:49b0854305b2',
//               },
//             },
//             {
//               type: 'button',
//               label: '删除',
//               level: 'danger',
//               onEvent: {
//                 click: {
//                   actions: [
//                     {
//                       actionType: 'dialog',
//                       dialog: {
//                         type: 'dialog',
//                         title: '删除',
//                         body: [
//                           {
//                             type: 'static',
//                             label: '',
//                             tpl: '是否确认删除！',
//                             id: 'u:129c99e4d3df',
//                             borderMode: 'none',
//                           },
//                         ],
//                         showCloseButton: true,
//                         showErrorMsg: false,
//                         showLoading: false,
//                         id: 'u:d794473fc4b5',
//                         actions: [
//                           {
//                             type: 'button-toolbar',
//                             label: '',
//                             buttons: [
//                               {
//                                 type: 'button',
//                                 label: '取消',
//                                 onEvent: {
//                                   click: {
//                                     actions: [],
//                                   },
//                                 },
//                                 id: 'u:4efd12b4290c',
//                                 close: true,
//                                 level: 'secondary',
//                               },
//                               {
//                                 type: 'button',
//                                 label: '确定',
//                                 onEvent: {
//                                   click: {
//                                     actions: [
//                                       {
//                                         args: {
//                                           options: {
//                                             silent: false,
//                                           },
//                                           api: {
//                                             url: '/cx-scws/emgc_resource_info/delete?id=${id}',
//                                             method: 'get',
//                                           },
//                                         },
//                                         outputVar: 'responseResult',
//                                         actionType: 'ajax',
//                                       },
//                                       {
//                                         componentId: 'u:c8b1fa56558e',
//                                         args: {
//                                           resetPage: false,
//                                         },
//                                         actionType: 'reload',
//                                         data: null,
//                                       },
//                                     ],
//                                   },
//                                 },
//                                 id: 'u:f425822a4e8a',
//                                 close: true,
//                                 level: 'danger',
//                               },
//                             ],
//                             id: 'u:3f64f28b006f',
//                           },
//                         ],
//                         size: 'sm',
//                       },
//                     },
//                   ],
//                 },
//               },
//             },
//           ],
//           id: 'u:2bb7edd0b563',
//         },
//       ],
//       bulkActions: [],
//       itemActions: [],
//       features: ['create', 'filter', 'update', 'delete'],
//       filterColumnCount: 3,

//       id: 'u:c8b1fa56558e',
//       perPageField: 'pageSize',
//       pageField: 'pageNum',
//       defaultParams: {
//         pageNum: 1,
//         pageSize: 10,
//       },
//       filter: {
//         title: '查询条件',
//         body: [
//           {
//             type: 'form',
//             title: '查询条件',
//             target: 'crud?resTypeId_search=${resTypeId_search}',
//             body: [
//               {
//                 name: 'resTypeId_search',
//                 type: 'select',
//                 label: '资源类别',
//                 id: 'u:5d7fe78661f6',
//                 className: 'm-l',
//                 inputClassName: 'w',
//                 placeholder: '请选择资源类别',
//                 clearable: true,
//                 source: {
//                   url: '/cx-scws/dc_dict/list_item',
//                   method: 'get',
//                   messages: {},
//                   dataType: 'json',
//                   data: {
//                     dictCode: 'resource_type',
//                   },
//                   replaceData: true,
//                 },
//                 labelField: 'cnName',
//                 valueField: 'value',
//               },
//             ],
//             mode: 'inline',
//             id: 'u:c4ad86e24b0a',
//             rules: [],
//             actions: [
//               {
//                 type: 'submit',
//                 label: '查询',
//                 level: 'primary',
//               },
//               {
//                 type: 'button',
//                 actionType: 'dialog',
//                 label: '新增',
//                 icon: 'fa fa-plus pull-left',
//                 primary: true,
//                 dialog: {
//                   title: '新增',
//                   body: {
//                     type: 'form',
//                     name: 'sample-edit-form',
//                     reload: 'crud',
//                     api: {
//                       url: '/cx-scws/emgc_resource_info/add',
//                       method: 'post',
//                       dataType: 'json',
//                       data: {
//                         '&': '$$',
//                       },
//                     },
//                     body: [
//                       {
//                         type: 'input-text',
//                         name: 'resName',
//                         label: '资源名称',
//                         placeholder: '请输入资源名称',
//                         required: true,
//                         validateOnChange: false,
//                       },
//                       {
//                         type: 'select',
//                         name: 'resTypeId',
//                         label: '资源类别',
//                         placeholder: '请选择资源类别',
//                         required: true,
//                         validateOnChange: false,
//                         source: {
//                           url: '/cx-scws/dc_dict/list_item',
//                           method: 'get',
//                           messages: {},
//                           dataType: 'json',
//                           data: {
//                             dictCode: 'resource_type',
//                           },
//                           replaceData: true,
//                         },
//                         labelField: 'cnName',
//                         valueField: 'value',
//                       },
//                       {
//                         type: 'input-text',
//                         name: 'specifications',
//                         label: '规格型号',
//                         placeholder: '请输入规格型号',
//                         required: true,
//                         validateOnChange: false,
//                       },
//                       {
//                         type: 'input-text',
//                         name: 'unit',
//                         label: '单位',
//                         placeholder: '请输入单位',
//                         required: true,
//                         validateOnChange: false,
//                       },
//                     ],
//                   },
//                 },
//               },
//             ],
//           },
//         ],

//         actions: [],
//         wrapWithPanel: false,
//         mode: 'inline',
//         reload: 'crud',
//       },

//       alwaysShowPagination: true,
//       autoFillHeight: true,
//     },
//   ],
//   id: 'u:7951bf1a715e',
//   asideResizor: false,
//   pullRefresh: {
//     disabled: true,
//   },
// };

// const emgcResources = () => {
//   return (
//     <Box h={'full'}>
//       <AimsRender jsonView={data} props={{ alarmTypeList: [], alarmLevelList: [], areaList: [] }} />
//     </Box>
//   );
// };

// export default emgcResources;

import { requestAims } from '@/utils/request';
import dynamic from 'next/dynamic';
const AimsRender = dynamic(() => import('@/components/AimsRender'), { ssr: false });

const emgcResources = async () => {
  const json = await requestAims({ url: '/api/aims-lists/84?fields[0]=content' });
  return <AimsRender jsonView={json.data.attributes.content} />;
};

export default emgcResources;
