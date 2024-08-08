// 'use client';
// import { CurdAdaptor, DeleteRequestAdaptor } from '@/components/AmisAdaptor';
// import { Box } from '@chakra-ui/react';
// import dynamic from 'next/dynamic';

// const AimsRender = dynamic(() => import('@/components/AimsRender'), { ssr: false });

// const data = {
//   type: 'page',
//   title: '部门管理',
//   body: [
//     {
//       type: 'crud',
//       syncLocation: false,
//       autoFillHeight: true,
//       className: 'm-b-none',
//       columnsTogglable: false,
//       api: {
//         method: 'get',
//         url: '/systemsManage/departs/api/getList',
//         messages: {},
//         replaceData: true,
//         dataType: 'json',
//         data: {
//           '&': '$$',
//         },
//       },
//       columns: [
//         {
//           name: 'orgName',
//           label: '部门名称',
//           type: 'text',
//           id: 'u:88d5a9e5e30e',
//           className: 'tableTreeNode',
//         },
//         {
//           name: 'orgCode',
//           label: '部门编码',
//           type: 'text',
//           id: 'u:437ff78a62d0',
//         },
//         {
//           type: 'button-toolbar',
//           label: '操作',
//           id: 'u:d3424641af89',
//           name: 'id',
//           buttons: [
//             {
//               type: 'button',
//               label: '新增下级',
//               id: 'u:0e48f0cfad25',
//               actionType: 'dialog',
//               level: 'enhance',
//               dialog: {
//                 type: 'dialog',
//                 title: '新增下级',
//                 data: {
//                   id: '${id}',
//                 },
//                 body: [
//                   {
//                     type: 'form',
//                     title: '表单',
//                     reload: 'crud',
//                     body: [
//                       {
//                         label: '上级部门',
//                         type: 'tree-select',
//                         name: 'parentId',
//                         id: 'u:05134f295e37',
//                         hideNodePathLabel: true,
//                         multiple: false,
//                         enableNodePath: false,
//                         value: '${id}',
//                         source: {
//                           url: '/ms-system/user/list-org-tree',
//                           method: 'get',
//                           dataType: 'form',
//                         },
//                         labelField: 'orgName',
//                         valueField: 'id',
//                         disabled: true,
//                       },
//                       {
//                         label: '部门名称',
//                         name: 'orgName1',
//                         type: 'input-text',
//                         id: 'u:77cfb9dd9e2c',
//                         placeholder: '请输入部门名称',
//                         required: true,
//                       },
//                       {
//                         label: '部门编码',
//                         name: 'orgCode1',
//                         type: 'input-text',
//                         id: 'u:a9dac16c92ff',
//                         placeholder: '请输入部门编码',
//                         required: true,
//                         validations: 'minLength:2',
//                       },
//                     ],
//                     mode: 'horizontal',
//                     id: 'u:7efebb10eca0',
//                   },
//                 ],
//                 showCloseButton: true,
//                 showErrorMsg: true,
//                 showLoading: true,
//                 id: 'u:db7301496d4c',
//                 closeOnEsc: false,
//                 dataMapSwitch: false,
//                 actions: [
//                   {
//                     type: 'button-toolbar',
//                     label: '',
//                     buttons: [
//                       {
//                         type: 'button',
//                         label: '取消',
//                         id: 'u:2770982ca897',
//                         close: true,
//                         level: 'secondary',
//                       },
//                       {
//                         type: 'submit',
//                         label: '确定',
//                         onEvent: {
//                           click: {
//                             actions: [
//                               {
//                                 args: {
//                                   options: {
//                                     silent: false,
//                                   },
//                                   api: {
//                                     url: '/ms-system/org/add',
//                                     method: 'post',
//                                     messages: {
//                                       success: '新增成功',
//                                     },
//                                     adaptor: CurdAdaptor,
//                                     replaceData: true,
//                                     dataType: 'json',
//                                     data: {
//                                       orgName: '${orgName1}',
//                                       orgCode: '${orgCode1}',
//                                       parentId: '${parentId}',
//                                     },
//                                   },
//                                 },
//                                 outputVar: 'responseResult',
//                                 actionType: 'ajax',
//                               },
//                               {
//                                 componentId: 'u:ae3c08295bd7',
//                                 args: {
//                                   resetPage: false,
//                                 },
//                                 actionType: 'reload',
//                                 data: null,
//                               },
//                             ],
//                           },
//                         },
//                         id: 'u:8ed4e99c4512',
//                         close: true,
//                         level: 'primary',
//                       },
//                     ],
//                     id: 'u:5a465611545f',
//                   },
//                 ],
//               },
//             },
//             {
//               type: 'button',
//               label: '修改',
//               actionType: 'dialog',
//               level: 'enhance',
//               id: 'u:35f5d4a2acc5',
//               dialog: {
//                 type: 'dialog',
//                 title: '修改',
//                 data: {
//                   '&': '$$',
//                 },
//                 body: [
//                   {
//                     type: 'form',
//                     body: [
//                       {
//                         name: 'orgName',
//                         label: '部门名称',
//                         type: 'input-text',
//                         id: 'u:31111956d760',
//                         required: true,
//                       },
//                       {
//                         label: '部门编码',
//                         name: 'orgCode',
//                         type: 'input-text',
//                         id: 'u:418b4bc28e9e',
//                         required: true,
//                       },
//                     ],
//                     id: 'u:61e26d678b99',
//                   },
//                 ],
//                 id: 'u:df7b557b9a59',
//                 showCloseButton: true,
//                 closeOnEsc: false,
//                 showErrorMsg: false,
//                 showLoading: true,
//                 dataMapSwitch: false,
//                 actions: [
//                   {
//                     type: 'button-toolbar',
//                     label: '',
//                     buttons: [
//                       {
//                         type: 'button',
//                         label: '取消',
//                         id: 'u:2770982ca897',
//                         close: true,
//                         level: 'secondary',
//                       },
//                       {
//                         type: 'submit',
//                         label: '确定',
//                         onEvent: {
//                           click: {
//                             actions: [
//                               {
//                                 args: {
//                                   options: {
//                                     silent: false,
//                                   },
//                                   api: {
//                                     url: '/ms-system/org/update/${id}',
//                                     adaptor: CurdAdaptor,
//                                     messages: {
//                                       success: '修改成功',
//                                     },
//                                     method: 'post',
//                                     dataType: 'json',
//                                     replaceData: true,
//                                     data: {
//                                       '&': '$$',
//                                       parentId: '${parentCode}',
//                                     },
//                                   },
//                                 },
//                                 outputVar: 'responseResult',
//                                 actionType: 'ajax',
//                               },
//                               {
//                                 componentId: 'u:ae3c08295bd7',
//                                 args: {
//                                   resetPage: false,
//                                 },
//                                 actionType: 'reload',
//                                 data: null,
//                               },
//                             ],
//                           },
//                         },
//                         id: 'u:8ed4e99c4512',
//                         close: true,
//                         level: 'primary',
//                       },
//                     ],
//                     id: 'u:5a465611545f',
//                   },
//                 ],
//               },
//             },
//             {
//               type: 'button',
//               label: '删除',
//               id: 'u:8bd33adb5d8d',
//               level: 'danger',
//               confirmText: '确定要删除？',
//               confirmTitle: '删除',
//               actionType: 'ajax',
//               api: {
//                 url: '/ms-system/org/delete/${id}',
//                 method: 'post',
//                 adaptor: CurdAdaptor,
//                 requestAdaptor: DeleteRequestAdaptor,
//                 dataType: 'form',
//                 messages: {
//                   success: '删除成功',
//                 },
//               },
//             },
//             {
//               type: 'button',
//               label: '配置岗位',
//               onEvent: {
//                 click: {
//                   actions: [
//                     {
//                       dialog: {
//                         type: 'dialog',
//                         title: '配置岗位',
//                         size: 'lg',
//                         body: [
//                           {
//                             type: 'service',
//                             id: 'u:3a4c84769914',
//                             api: {
//                               url: '/ms-system/org/list-position?orgId=${id}',
//                               method: 'get',
//                               dataType: 'form',
//                               replaceData: true,
//                               responseData: {
//                                 posIdList: '${items}',
//                               },
//                             },
//                             body: [
//                               {
//                                 type: 'picker',
//                                 label: '',
//                                 name: 'posList',
//                                 multiple: true,
//                                 embed: true,
//                                 joinValues: false,
//                                 valueField: 'id',
//                                 labelField: 'positionName',
//                                 source: {
//                                   method: 'get',
//                                   url: '/ms-system/position/list/page',
//                                   messages: {},
//                                   dataType: 'json',
//                                   replaceData: true,
//                                   data: {
//                                     pageIndex: '${pageIndex}',
//                                     pageSize: '${pageSize}',
//                                     positionName: '${positionName|default}',
//                                   },
//                                 },
//                                 value: '${posIdList}',
//                                 size: 'lg',
//                                 pickerSchema: {
//                                   mode: 'table',
//                                   name: 'thelist',
//                                   headerToolbar: {
//                                     wrapWithPanel: false,
//                                     type: 'form',
//                                     className: 'text-right',
//                                     target: 'thelist',
//                                     mode: 'inline',
//                                     body: [
//                                       {
//                                         type: 'input-text',
//                                         name: 'positionName',
//                                         addOn: {
//                                           type: 'submit',
//                                           label: '查询',
//                                           level: 'primary',
//                                           id: 'u:228612364ec4',
//                                         },
//                                         id: 'u:11c46f968fbf',
//                                         placeholder: '请根据岗位名称查询',
//                                       },
//                                     ],
//                                     id: 'u:c9d4a9141c9b',
//                                   },
//                                   footerToolbar: [
//                                     {
//                                       type: 'pagination',
//                                       align: 'left',
//                                     },
//                                     {
//                                       type: 'button-toolbar',
//                                       align: 'right',
//                                       label: '',
//                                       buttons: [
//                                         {
//                                           type: 'button',
//                                           label: '取消',
//                                           onEvent: {
//                                             click: {
//                                               actions: [],
//                                             },
//                                           },
//                                           id: 'u:d112ecfe784e',
//                                           close: true,
//                                           level: 'secondary',
//                                         },
//                                         {
//                                           type: 'button',
//                                           label: '确定',
//                                           onEvent: {
//                                             click: {
//                                               actions: [
//                                                 {
//                                                   args: {
//                                                     options: {
//                                                       silent: false,
//                                                     },
//                                                     api: {
//                                                       url: '/api/system/depart/addPosition',
//                                                       method: 'post',
//                                                       replaceData: true,
//                                                       messages: {
//                                                         success: '操作成功',
//                                                         failed: '操作失败',
//                                                       },
//                                                       dataType: 'json',
//                                                       data: {
//                                                         posIds: '${posList|pick:id|map}',
//                                                         id: '${id}',
//                                                       },
//                                                     },
//                                                   },
//                                                   outputVar: 'responseResult',
//                                                   actionType: 'ajax',
//                                                 },
//                                                 {
//                                                   args: {
//                                                     resetPage: true,
//                                                   },
//                                                   actionType: 'reload',
//                                                   componentId: 'u:f70f40efbcbb',
//                                                   dataMergeMode: 'override',
//                                                 },
//                                               ],
//                                             },
//                                           },
//                                           id: 'u:95bff1fd962d',
//                                           close: true,
//                                           level: 'primary',
//                                         },
//                                       ],
//                                       id: 'u:a87b4199106f',
//                                     },
//                                   ],
//                                   columns: [
//                                     {
//                                       name: 'positionName',
//                                       label: '岗位名称',
//                                       type: 'text',
//                                       id: 'u:0f4f7ed52428',
//                                     },
//                                     {
//                                       type: 'text',
//                                       label: '岗位编码',
//                                       name: 'positionCode',
//                                       id: 'u:12d6f7ffb2cb',
//                                     },
//                                     {
//                                       type: 'text',
//                                       name: 'positionDuty',
//                                       label: '岗位职责',
//                                       id: 'u:4acc8b7f8a0a',
//                                     },
//                                   ],
//                                   id: 'u:f70f40efbcbb',
//                                   bulkActions: [],
//                                   alwaysShowPagination: true,
//                                   perPageAvailable: [10],
//                                   affixHeader: false,
//                                   defaultParams: {
//                                     pageIndex: 1,
//                                     pageSize: 10,
//                                   },
//                                   messages: {},
//                                   pageField: 'pageIndex',
//                                   perPageField: 'pageSize',
//                                 },
//                                 id: 'u:c16236fc3654',
//                                 modalMode: 'dialog',
//                               },
//                             ],
//                           },
//                         ],
//                         showCloseButton: true,
//                         showErrorMsg: false,
//                         showLoading: false,
//                         id: 'u:6b690577a600',
//                         closeOnEsc: true,
//                         actions: [],
//                       },
//                       actionType: 'dialog',
//                     },
//                   ],
//                 },
//               },
//               id: 'u:ba6d914b137a',
//               level: 'enhance',
//             },
//           ],
//         },
//       ],
//       bulkActions: [],
//       itemActions: [],
//       features: ['update', 'delete', 'create'],
//       id: 'u:ae3c08295bd7',
//       filter: null,
//       perPageAvailable: [10, 20, 50],
//       messages: {},
//       alwaysShowPagination: false,
//       pageField: '',
//       headerToolbar: ['bulkActions'],
//     },
//   ],
//   id: 'u:b994f0f68edf',
//   pullRefresh: {
//     disabled: true,
//   },
//   regions: ['body'],
// };
// const jsonStr = JSON.stringify(data);
// console.log(jsonStr);

// const Departs = () => {
//   return (
//     <Box h={'full'} overflowY={'auto'} layerStyle={'scrollbarStyle'}>
//       <AimsRender jsonView={data} />
//     </Box>
//   );
// };

// export default Departs;

import { requestAims } from '@/utils/request';
import dynamic from 'next/dynamic';
const AimsRender = dynamic(() => import('@/components/AimsRender'), { ssr: false });

const Departs = async () => {
  const json = await requestAims({ url: '/api/aims-lists/49?fields[0]=content' });
  return <AimsRender jsonView={json.data.attributes.content} />;
};

export default Departs;
