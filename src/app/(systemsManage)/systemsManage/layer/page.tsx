'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import { Box } from '@chakra-ui/react';
import { useMount, useMemoizedFn, useSafeState } from 'ahooks';
import { request } from '@/utils/request';
import { ILayerItem, ISprite } from '@/components/MapTools/LayerList';
import { CurdAdaptor, DeleteRequestAdaptor } from '@/components/AmisAdaptor';

const AimsRender = dynamic(() => import('@/components/AimsRender'), { ssr: false });

const data = {
  type: 'page',
  body: [
    {
      type: 'crud',
      api: '/cx-alarm/layer-mange/list',
      keepItemSelectionOnPageChange: true,
      columns: [
        {
          name: 'layerName',
          label: '报警类型',
          type: 'text',
          id: 'u:ca6eba2b306d',
        },
        {
          name: 'hasLayer',
          label: '类型',
          type: 'mapping',
          map: {
            '0': '分类',
            '1': '图层',
          },
          id: 'u:0043d33d5216',
        },
        {
          name: 'icon',
          label: '图标',
          type: 'text',
          id: 'u:a3d2c0784cb0',
        },
        {
          name: 'sortNo',
          label: '排序',
          type: 'text',
          id: 'u:f48dc84b36e6',
        },
        {
          type: 'operation',
          label: '操作',
          buttons: [
            {
              label: '新增',
              type: 'button',
              actionType: 'dialog',
              level: 'enhance',
              id: 'u:4cf9dae5d4c6',
              dialog: {
                title: '新增',
                body: {
                  type: 'form',
                  body: [
                    {
                      name: 'layerCode_add',
                      label: '图层',
                      type: 'input-text',
                      placeholder: '请输入图层',
                      required: true,
                      validateOnChange: false,
                    },
                    {
                      label: '图层名称',
                      name: 'layerName_add',
                      type: 'input-text',
                      placeholder: '请输入类型名称',
                      required: true,
                      validateOnChange: false,
                    },
                    {
                      name: 'hasLayer_add',
                      type: 'radios',
                      label: '图层',
                      options: [
                        {
                          label: '图层',
                          value: 1,
                        },
                        {
                          label: '分类',
                          value: 0,
                        },
                      ],
                    },
                    {
                      label: '父节点',
                      name: 'parentName',
                      value: '${layerName}',
                      type: 'input-text',
                      placeholder: '请输入父节点',
                      disabled: true,
                    },
                    {
                      type: 'input-text',
                      label: '图标',
                      name: 'icon',
                      id: 'u:a24c9890f18d',
                      readOnly: true,
                      placeholder: '请选择图标',
                      onEvent: {
                        focus: {
                          weight: 0,
                          actions: [
                            {
                              actionType: 'dialog',
                              dialog: {
                                type: 'dialog',
                                title: '选择图标',
                                body: [
                                  {
                                    type: 'SpritePick',
                                    name: 'icon',
                                  },
                                ],
                                showCloseButton: true,
                                showErrorMsg: true,
                                showLoading: true,
                                className: 'app-popover',
                                id: 'u:2007d623928f',
                                closeOnEsc: false,
                                withDefaultData: false,
                                dataMapSwitch: false,
                                size: 'lg',
                                onEvent: {
                                  confirm: {
                                    weight: 0,
                                    actions: [
                                      {
                                        componentId: 'u:a24c9890f18d',
                                        actionType: 'setValue',
                                        args: {
                                          value: '${event.data["icon"]}',
                                        },
                                      },
                                    ],
                                  },
                                },
                              },
                            },
                          ],
                        },
                      },
                    },
                    {
                      label: '排序',
                      name: 'sortNo_add',
                      type: 'input-text',
                      placeholder: '请输入sortNo',
                    },
                  ],
                  api: {
                    url: '/cx-alarm/layer-mange/add',
                    method: 'post',
                    adaptor: CurdAdaptor,
                    messages: {
                      success: '新增成功',
                    },
                    dataType: 'json',
                    reload: 'crud',
                    data: {
                      sortNo: '$sortNo_add',
                      parentId: '$id',
                      layerName: '$layerName_add',
                      hasLayer: '$hasLayer_add',
                      icon: '$icon',
                      layerCode: '$layerCode_add',
                    },
                  },
                },
                id: 'u:49b0854305b2',
              },
            },
            {
              label: '编辑',
              type: 'button',
              actionType: 'dialog',
              level: 'enhance',
              id: 'u:4cf9dae5d4ce',
              dialog: {
                type: 'dialog',
                title: '编辑',
                body: [
                  {
                    type: 'form',
                    body: [
                      {
                        name: 'layerCode',
                        label: '图层code',
                        type: 'input-text',
                        placeholder: '请输入图层code',
                        required: true,
                        validateOnChange: false,
                        id: 'u:36b6446e2a4f',
                      },
                      {
                        label: '图层名称',
                        name: 'layerName',
                        type: 'input-text',
                        placeholder: '请输入类型名称',
                        required: true,
                        validateOnChange: false,
                        id: 'u:a0eb908aea41',
                      },
                      {
                        name: 'hasLayer',
                        type: 'radios',
                        label: '图层',
                        options: [
                          {
                            label: '图层',
                            value: 1,
                          },
                          {
                            label: '分类',
                            value: 0,
                          },
                        ],
                        id: 'u:3b4d04c945dd',
                      },
                      {
                        label: '父节点',
                        name: 'parentId',
                        value: '${parentId}',
                        type: 'input-text',
                        placeholder: '请输入父节点',
                        disabled: true,
                        id: 'u:7437b4da210d',
                      },
                      {
                        label: '排序',
                        name: 'sortNo',
                        type: 'input-text',
                        placeholder: '请输入sortNo',
                        id: 'u:0adc65c2c534',
                      },
                      {
                        type: 'input-text',
                        label: '图标',
                        name: 'icon',
                        id: 'u:a24c9890f18c',
                        placeholder: '请选择图标',
                        readOnly: true,
                        onEvent: {
                          focus: {
                            weight: 0,
                            actions: [
                              {
                                actionType: 'dialog',
                                dialog: {
                                  type: 'dialog',
                                  title: '选择图标',
                                  body: [
                                    {
                                      type: 'SpritePick',

                                      name: 'icon',
                                    },
                                  ],
                                  showCloseButton: true,
                                  showErrorMsg: true,
                                  showLoading: true,
                                  className: 'app-popover',
                                  id: 'u:2007d623928f',
                                  closeOnEsc: false,
                                  withDefaultData: false,
                                  dataMapSwitch: false,
                                  size: 'lg',
                                  onEvent: {
                                    confirm: {
                                      weight: 0,
                                      actions: [
                                        {
                                          componentId: 'u:a24c9890f18c',
                                          actionType: 'setValue',
                                          args: {
                                            value: '${event.data["icon"]}',
                                          },
                                        },
                                      ],
                                    },
                                  },
                                },
                              },
                            ],
                          },
                        },
                      },
                    ],
                    api: {
                      url: '/cx-alarm/layer-mange/update/${id}',
                      method: 'put',
                      adaptor: CurdAdaptor,
                      messages: {
                        success: '编辑成功',
                      },
                      dataType: 'json',
                      data: {
                        '&': '$$',
                      },
                    },
                    id: 'u:47d0b1a407ca',
                  },
                ],
                id: 'u:49b0854305b2',
              },
            },
            {
              type: 'button',
              label: '删除',
              level: 'danger',
              api: {
                url: '/cx-alarm/layer-mange/delete/${id}',
                method: 'DELETE',
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
          id: 'u:2bb7edd0b563',
        },
      ],
      syncLocation: false,
      headerToolbar: [
        {
          type: 'button',
          actionType: 'dialog',
          label: '新增',
          icon: 'fa fa-plus pull-left',
          primary: true,
          dialog: {
            title: '新增',
            body: {
              type: 'form',
              name: 'sample-edit-form',
              api: {
                url: '/cx-alarm/layer-mange/add',
                method: 'post',
                adaptor: CurdAdaptor,
                messages: {
                  success: '新增成功',
                },
                dataType: 'json',
                reload: 'crud',
                data: {
                  '&': '$$',
                },
              },
              body: [
                {
                  name: 'layerCode',
                  label: '图层code',
                  type: 'input-text',
                  placeholder: '请输入图层code',
                  required: true,
                  validateOnChange: false,
                },
                {
                  label: '图层名称',
                  name: 'layerName',
                  type: 'input-text',
                  placeholder: '请输入类型名称',
                  required: true,
                  validateOnChange: false,
                },
                {
                  name: 'hasLayer',
                  type: 'radios',
                  label: '图层',
                  required: true,
                  validateOnChange: false,
                  options: [
                    {
                      label: '图层',
                      value: 1,
                    },
                    {
                      label: '分类',
                      value: 0,
                    },
                  ],
                },
                {
                  type: 'input-text',
                  label: '图标',
                  name: 'icon',
                  id: 'u:a24c9890f18hz',
                  readOnly: true,
                  placeholder: '请选择图标',
                  onEvent: {
                    focus: {
                      weight: 0,
                      actions: [
                        {
                          actionType: 'dialog',
                          dialog: {
                            type: 'dialog',
                            title: '选择图标',
                            body: [
                              {
                                type: 'SpritePick',

                                name: 'icon',
                              },
                            ],
                            showCloseButton: true,
                            showErrorMsg: true,
                            showLoading: true,
                            className: 'app-popover',
                            id: 'u:2007d623928f',
                            closeOnEsc: false,
                            withDefaultData: false,
                            dataMapSwitch: false,
                            size: 'lg',
                            onEvent: {
                              confirm: {
                                weight: 0,
                                actions: [
                                  {
                                    componentId: 'u:a24c9890f18hz',
                                    actionType: 'setValue',
                                    args: {
                                      value: '${event.data["icon"]}',
                                    },
                                  },
                                ],
                              },
                            },
                          },
                        },
                      ],
                    },
                  },
                },
                {
                  label: '排序',
                  name: 'sortNo',
                  type: 'input-text',
                  placeholder: '请输入sortNo',
                },
              ],
            },
          },
          id: 'u:54af475bcb8b',
        },
      ],
      alwaysShowPagination: true,
      autoFillHeight: true,
      id: 'u:6ad3c470f50d',
    },
  ],
  id: 'u:f66441175c0a',
};

const Area = () => {
  const [icons, setIconss] = useSafeState<{ id: string; name: string }[]>([]);
  useMount(() => {
    getIconName();
  });
  //获取分类列表
  const getIconName = useMemoizedFn(async () => {
    const res = (await request<ILayerItem[]>({
      url: `/map-server/styles/baseMap/sprite.json`,
    })) as unknown as ISprite;

    if (res) {
      const arr = Object.keys(res).map((item) => ({ id: item, name: item }));
      setIconss(arr);
    }
  });

  return (
    <Box h="100%">
      <AimsRender jsonView={data} props={{ icons }} />
    </Box>
  );
};

export default Area;
