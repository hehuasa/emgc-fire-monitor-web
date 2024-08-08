'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import { Box } from '@chakra-ui/react';

const AimsRender = dynamic(() => import('@/components/AimsRender'), { ssr: false });

const data = {
  body: {
    type: 'crud',
    pageField: 'current',
    perPageField: 'size',
    defaultParams: {
      current: 1,
      size: 10,
    },
    debug: true,
    api: {
      method: 'post',
      url: '/cx-alarm/dc/area_cell/page',
      messages: {},
      dataType: 'json',
      data: {
        pageBean: {
          currentPage: '${current}',
          pageSize: '${size}',
        },
        areaId: '1',
      },
      replaceData: true,
    },

    keepItemSelectionOnPageChange: true,

    autoFillHeight: true,
    className: 'h-full',

    columns: [
      {
        name: 'layerName',
        label: '报警类型',
        type: 'text',
      },
      {
        name: 'hasLayer',
        label: '类型',
        type: 'mapping',
        map: {
          '0': '分类',
          '1': '图层',
        },
      },
      {
        name: 'icon',
        label: '图标',
        type: 'text',
      },
      {
        name: 'sortNo',
        label: '排序',
        type: 'text',
      },
      {
        type: 'operation',
        label: '操作',
        buttons: [
          {
            label: '编辑',
            type: 'button',
            actionType: 'dialog',
            level: 'link',
            id: 'u:4cf9dae5d4ce',
            dialog: {
              title: '编辑',
              body: {
                type: 'form',

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
                    name: 'parentId',
                    type: 'input-text',
                    placeholder: '请输入父节点',
                    disabled: true,
                  },
                  {
                    label: '图标',
                    name: 'icon',
                    type: 'input-text',
                    placeholder: '请输入图标',
                  },
                  {
                    label: '排序',
                    name: 'sortNo',
                    type: 'input-text',
                    placeholder: '请输入sortNo',
                  },
                ],
                api: {
                  url: '/cx-alarm/layer-mange/update/${id}',
                  method: 'put',
                  messages: {},
                  dataType: 'json',
                  data: {
                    '&': '$$',
                  },
                },
              },

              id: 'u:49b0854305b2',
            },
          },
          {
            type: 'button',
            label: '删除',
            id: 'u:8bd33adb5d8d',
            level: 'link',
            actionType: 'ajax',
            confirmText: '您确认要删除?',
            reload: 'crud',
            showLoading: true,
            api: {
              url: '/cx-alarm/layer-mange/delete/${id}',
              method: 'DELETE',
            },
          },
        ],
        id: 'u:2bb7edd0b563',
      },
    ],
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
            debug: true,
            name: 'sample-edit-form',
            api: {
              url: '/cx-alarm/layer-mange/add',
              method: 'post',
              messages: {},
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
                label: '图标',
                name: 'icon',
                type: 'input-text',
                placeholder: '请输入图标',
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
      },
    ],
  },
};

const Area = () => {
  return (
    <Box h="full" overflow="auto">
      <AimsRender jsonView={data} />
    </Box>
  );
};

export default Area;
