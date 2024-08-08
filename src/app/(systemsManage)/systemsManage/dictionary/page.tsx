'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import { Box } from '@chakra-ui/react';
import { ILayerItem, ISprite } from '@/components/MapTools/LayerList';
import { useMount, useMemoizedFn } from 'ahooks';
import { request } from '@/utils/request';
import { CurdAdaptor, DeleteRequestAdaptor } from '@/components/AmisAdaptor';

interface I {
  cnName: string;
  code: string;
  enName: null;
  id: string;
  remark: null;
}

const AimsRender = dynamic(() => import('@/components/AimsRender'), { ssr: false });

const data = {
  type: 'page',
  id: 'my-page',
  data: {
    selectedCode: '',
  },
  body: {
    type: 'flex',
    items: [
      {
        type: 'grid',
        columns: [
          {
            md: 4,
            body: [
              {
                type: 'crud',
                api: {
                  method: 'get',
                  url: '/cx-alarm/dc_dict/all_dc_dict',
                  messages: {},
                  dataType: 'form',
                  replaceData: true,
                },
                itemAction: {
                  type: 'action',
                  actionType: 'reload',
                  target: 'my-right-crud?dictCode=$code,my-page?selectedCode=$code',
                },
                name: 'my-left-crud',
                id: 'my-left-crud',
                columns: [
                  {
                    name: 'cnName',
                    label: '产品分类',
                    type: 'text',
                    id: 'u:5a1d67f7f386',
                  },
                  {
                    type: 'operation',
                    label: '操作',

                    buttons: [
                      {
                        label: '编辑',
                        type: 'button',
                        actionType: 'dialog',
                        level: 'enhance',
                        dialog: {
                          title: '编辑',
                          body: {
                            type: 'form',
                            api: {
                              url: '/cx-alarm/dc_dict/updateType/${id}',
                              method: 'put',
                              dataType: 'json',
                              reload: 'my-left-crud',
                              data: {
                                '&': '$$',
                                id: '$id',
                              },
                              adaptor: CurdAdaptor,
                              messages: {
                                success: '编辑成功',
                              },
                            },
                            body: [
                              {
                                type: 'input-text',
                                name: 'code',
                                label: '字典类型编码',
                                placeholder: '请输入字典类型编码',
                                required: true,
                                validateOnChange: false,
                              },
                              {
                                type: 'input-text',
                                name: 'cnName',
                                label: '名称',
                                placeholder: '请输入名称',
                                required: true,
                                validateOnChange: false,
                              },
                              {
                                type: 'input-text',
                                name: 'enName',
                                label: '英文名称',
                                placeholder: '请输入英文名称',
                              },
                              {
                                type: 'input-text',
                                name: 'remark',
                                label: '备注',
                                placeholder: '请输入备注',
                              },
                            ],
                          },
                        },
                        id: 'u:fd5d9a58d99a',
                      },
                      {
                        type: 'button',
                        label: '删除',
                        id: 'u:8bd33adb5d8d',
                        level: 'danger',
                        api: {
                          method: 'delete',
                          url: '/cx-alarm/dc_dict/deleteType/${id}',
                          dataType: 'form',
                          adaptor: CurdAdaptor,
                          messages: {
                            success: '删除成功',
                          },
                          requestAdaptor: DeleteRequestAdaptor,
                        },
                        actionType: 'ajax',
                        confirmText: '确定要删除？',
                      },
                    ],
                  },
                ],

                bulkActions: [],
                itemActions: [],
                features: ['create', 'delete', 'update'],
                headerToolbar: [
                  {
                    label: '新增分类',
                    type: 'button',
                    actionType: 'dialog',
                    level: 'primary',
                    dialog: {
                      title: '新增字段分类',
                      body: {
                        type: 'form',
                        api: {
                          url: '/cx-alarm/dc_dict/addType',
                          method: 'post',
                          adaptor: CurdAdaptor,
                          messages: {
                            success: '新增成功',
                          },
                          dataType: 'json',
                          reload: 'my-left-crud',
                          data: {
                            '&': '$$',
                          },
                        },
                        body: [
                          {
                            type: 'input-text',
                            name: 'code',
                            label: '字典类型编码',
                            placeholder: '请输入字典类型编码',
                            required: true,
                            validateOnChange: false,
                          },
                          {
                            type: 'input-text',
                            name: 'cnName',
                            label: '名称',
                            placeholder: '请输入名称',
                            required: true,
                            validateOnChange: false,
                          },
                          {
                            type: 'input-text',
                            name: 'enName',
                            label: '英文名称',
                            placeholder: '请输入英文名称',
                          },
                          {
                            type: 'input-text',
                            name: 'remark',
                            label: '备注',
                            placeholder: '请输入备注',
                          },
                        ],
                      },
                    },
                    id: 'u:16c933d5ae8d',
                    onEvent: {
                      click: {
                        actions: [
                          {
                            args: {},
                            dialog: {
                              type: 'dialog',
                              title: '弹框标题',
                              body: [
                                {
                                  type: 'tpl',
                                  tpl: '<p>对，你刚刚点击了</p>',
                                  inline: false,
                                  id: 'u:a528f8ed1bdd',
                                },
                                {
                                  type: 'form',
                                  title: '表单',
                                  body: [
                                    {
                                      label: '文本框',
                                      type: 'input-text',
                                      name: 'text',
                                      id: 'u:473b448b21a1',
                                    },
                                  ],
                                  id: 'u:885b26a0d0b7',
                                },
                              ],
                              showCloseButton: true,
                              showErrorMsg: true,
                              showLoading: true,
                              id: 'u:642741c5f384',
                            },
                            actionType: 'dialog',
                          },
                        ],
                        weight: 0,
                      },
                    },
                  },
                  'bulkActions',
                ],

                pageField: 'current',
                perPageField: 'size',
                defaultParams: {
                  current: 1,
                  size: 10,
                },
                alwaysShowPagination: true,
                autoFillHeight: true,
              },
            ],
          },
          {
            md: 8,
            body: [
              {
                name: 'my-right-crud',
                type: 'crud',
                id: 'my-right-crud',
                syncLocation: false,
                api: {
                  method: 'get',
                  url: '/cx-alarm/dc_dict/page_item',
                  messages: {},
                  dataType: 'json',
                  data: {
                    current: '${current}',
                    size: '${size}',
                    dictCode: '${dictCode}',
                  },
                  replaceData: true,
                },
                columns: [
                  {
                    name: 'cnName',
                    label: '名称',
                    type: 'text',
                  },
                  {
                    type: 'text',
                    label: '值',
                    name: 'value',
                  },

                  {
                    type: 'mapping',
                    label: '状态',
                    name: 'status',
                    map: {
                      '0': '正常',
                      '1': '停用',
                    },
                  },

                  {
                    type: 'operation',
                    label: '操作',
                    buttons: [
                      {
                        label: '编辑',
                        type: 'button',
                        actionType: 'dialog',
                        level: 'enhance',
                        dialog: {
                          title: '编辑',
                          body: {
                            type: 'form',
                            api: {
                              method: 'post',
                              url: '/cx-alarm/dc_dict/update_item',
                              adaptor: CurdAdaptor,
                              messages: {
                                success: '编辑成功',
                              },
                              dataType: 'json',
                              reload: 'my-right-crud',
                              data: {
                                '&': '$$',
                                dictCode: '${dictCode}',
                                id: '${id}',
                              },
                            },
                            body: [
                              {
                                type: 'input-text',
                                name: 'cnName',
                                label: '字典项名称',
                                placeholder: '请输入字典项名称',
                                required: true,
                                validateOnChange: false,
                              },
                              {
                                type: 'input-text',
                                name: 'value',
                                label: '字典项值',
                                placeholder: '请输入字典项值',
                                required: true,
                                validateOnChange: false,
                              },
                            ],
                          },
                        },
                        id: 'u:e5e0aa650d51',
                      },
                      {
                        type: 'button',
                        label: '删除',
                        actionType: 'ajax',
                        level: 'danger',
                        confirmText: '确定要删除？',
                        api: {
                          method: 'post',
                          url: '/cx-alarm/dc_dict/delete_item',
                          dataType: 'form',
                          data: {
                            id: '${id}',
                          },
                          adaptor: CurdAdaptor,
                          messages: {
                            success: '删除成功',
                          },
                          requestAdaptor: DeleteRequestAdaptor,
                        },
                        id: 'u:e86a9fbf5b99',
                      },
                    ],
                    id: 'u:31d3098631e3',
                  },
                ],
                bulkActions: [],
                itemActions: [],
                features: ['create', 'update', 'delete'],
                headerToolbar: [
                  {
                    label: '新增字典项',
                    type: 'button',
                    actionType: 'dialog',
                    level: 'primary',
                    visibleOn: '${dictCode}',
                    dialog: {
                      title: '新增字典项',
                      body: {
                        type: 'form',
                        api: {
                          method: 'post',
                          url: '/cx-alarm/dc_dict/add_item',
                          adaptor: CurdAdaptor,
                          messages: {
                            success: '新增成功',
                          },
                          dataType: 'json',
                          reload: 'my-right-crud',
                          data: {
                            '&': '$$',
                            dictCode: '${dictCode}',
                          },
                        },
                        body: [
                          {
                            type: 'input-text',
                            name: 'cnName',
                            label: '字典项名称',
                            placeholder: '请输入字典项名称',
                            required: true,
                            validateOnChange: false,
                          },
                          {
                            type: 'input-text',
                            name: 'value',
                            label: '字典项值',
                            placeholder: '请输入字典项值',
                            required: true,
                            validateOnChange: false,
                          },
                        ],
                      },
                    },
                    id: 'u:8003ef133180',
                  },
                  'bulkActions',
                ],
                //id: 'u:6bfc72f5c565',
                pageField: 'current',
                perPageField: 'size',
                defaultParams: {
                  current: 1,
                  size: 10,
                },
                alwaysShowPagination: true,
                autoFillHeight: true,
              },
            ],
          },
        ],
      },
    ],
    id: 'u:fa72c3cbec52',
  },
};

const Area = () => {
  useMount(() => {
    getIconName();
  });
  //获取分类列表
  const getIconName = useMemoizedFn(async () => {
    const res = (await request<ILayerItem[]>({
      url: `/cx-alarm/dc_dict/all_dc_dict`,
    })) as unknown as ISprite;
  });
  return (
    <Box h="full">
      <AimsRender jsonView={data} />
    </Box>
  );
};

export default Area;
