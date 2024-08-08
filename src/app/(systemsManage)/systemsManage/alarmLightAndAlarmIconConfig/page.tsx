'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import { Box } from '@chakra-ui/react';
import { CurdAdaptor, DeleteRequestAdaptor } from '@/components/AmisAdaptor';

const AimsRender = dynamic(() => import('@/components/AimsRender'), { ssr: false });

const data = {
  type: 'page',
  title: '',
  data: {},
  aside: [],
  toolbar: [],
  body: [
    {
      type: 'crud',
      name: 'crud',
      syncLocation: false,
      api: {
        method: 'get',
        url: '/cx-alarm/alm/iconLamp/findPage',
        messages: {},
        dataType: 'form',
        data: {
          current: '${current}',
          size: '${size}',
          alarmType: '${alarmType_search|default}',
          alarmLevel: '${alarmLevel_search|default}',
        },
        replaceData: true,
      },
      columns: [
        {
          name: 'lampSchemeName',
          label: '方案名称',
          type: 'text',
        },
        {
          label: '报警等级',
          name: 'alarmLevelText',
          type: 'text',
        },
        {
          label: '图标闪烁频率',
          name: 'iconFlickerFrequency',
          type: 'text',
        },
        {
          label: '图标颜色',
          name: 'iconColor',
          type: 'color',
        },
        {
          label: '报警灯方案',
          name: 'lampSchemeName',
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
              id: 'u:4cf9dae5d4ce',
              level: 'enhance',
              dialog: {
                title: '编辑',
                body: {
                  type: 'form',

                  body: [
                    {
                      type: 'select',
                      name: 'lampScheme',
                      label: '报警灯方案名称',
                      placeholder: '请选择报警灯方案名称',
                      required: true,
                      validateOnChange: false,
                      source: '/cx-alarm/alm/lampScheme/findAll',
                      labelField: 'schemeName',
                      valueField: 'id',
                    },

                    {
                      type: 'select',
                      name: 'alarmLevel',
                      label: '报警级别',
                      placeholder: '请选择报警级别',
                      required: true,
                      validateOnChange: false,
                      source: '/cx-alarm/dc_dict/list_item?dictCode=alarm_level',
                      labelField: 'cnName',
                      valueField: 'value',
                    },
                    {
                      type: 'select',
                      name: 'alarmType',
                      label: '报警类别',
                      placeholder: '请选报警类别',
                      required: true,
                      validateOnChange: false,
                      source: '/cx-alarm/alm/alarm-type/list',
                      labelField: 'alarmTypeName',
                      valueField: 'alarmType',
                    },
                    {
                      type: 'input-number',
                      name: 'iconFlickerFrequency',
                      label: '图标闪烁频率',
                      placeholder: '请输入图标闪烁频率(数字越高频率越快)',
                    },
                    {
                      type: 'input-color',
                      name: 'iconColor',
                      label: '图标颜色',
                      placeholder: '请选报图标颜色',
                    },
                  ],
                  api: {
                    url: '/cx-alarm/alm/iconLamp/update/${id}',
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
              level: 'danger',
              api: {
                url: '/cx-alarm/alm/iconLamp/delete/${id}',
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
      bulkActions: [],
      itemActions: [],
      features: ['create', 'filter', 'update', 'delete'],
      filterColumnCount: 3,

      id: 'u:c8b1fa56558e',
      perPageField: 'size',
      pageField: 'current',
      defaultParams: {
        current: 1,
        size: 10,
      },

      filter: {
        title: '查询条件',
        body: [
          {
            type: 'form',
            title: '查询条件',
            target:
              'curd?alarmType_search=${alarmType_search}&alarmLevel_search=${alarmLevel_search}',
            body: [
              {
                name: 'alarmType_search',
                type: 'select',
                label: '报警类别',
                className: 'm-l',
                inputClassName: 'w',
                placeholder: '请选择报警类别',
                clearable: true,
                source: '/cx-alarm/alm/alarm-type/list',
                labelField: 'alarmTypeName',
                valueField: 'alarmType',
              },
              {
                name: 'alarmLevel_search',
                type: 'select',
                label: '报警级别',
                className: 'm-l',
                inputClassName: 'w',
                placeholder: '请选择报警级别',
                clearable: true,
                source: '/cx-alarm/dc_dict/list_item?dictCode=alarm_level',
                labelField: 'cnName',
                valueField: 'value',
              },
            ],
            mode: 'inline',
            id: 'u:c4ad86e24b0a',
            rules: [],
            actions: [
              {
                type: 'submit',
                label: '查询',
                id: 'u:57d6dfdfb28b',
                level: 'primary',
              },
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
                    reload: 'crud',
                    api: {
                      url: '/cx-alarm/alm/iconLamp/add',
                      method: 'post',
                      dataType: 'json',
                      data: {
                        '&': '$$',
                      },
                    },
                    body: [
                      {
                        type: 'select',
                        name: 'lampScheme',
                        label: '报警灯方案名称',
                        placeholder: '请选择报警灯方案名称',
                        required: true,
                        validateOnChange: false,
                        source: '/cx-alarm/alm/lampScheme/findAll',
                        labelField: 'schemeName',
                        valueField: 'id',
                      },

                      {
                        type: 'select',
                        name: 'alarmLevel',
                        label: '报警级别',
                        placeholder: '请选择报警级别',
                        required: true,
                        validateOnChange: false,
                        source: '/cx-alarm/dc_dict/list_item?dictCode=alarm_level',
                        labelField: 'cnName',
                        valueField: 'value',
                      },
                      {
                        type: 'select',
                        name: 'alarmType',
                        label: '报警类别',
                        placeholder: '请选报警类别',
                        required: true,
                        validateOnChange: false,
                        source: '/cx-alarm/alm/alarm-type/list',
                        labelField: 'alarmTypeName',
                        valueField: 'alarmType',
                      },
                      {
                        type: 'input-number',
                        name: 'iconFlickerFrequency',
                        label: '图标闪烁频率',
                        placeholder: '请输入图标闪烁频率(数字越高频率越快)',
                      },
                      {
                        type: 'input-color',
                        name: 'iconColor',
                        label: '图标颜色',
                        placeholder: '请选报图标颜色',
                      },
                    ],
                  },
                },
              },
            ],
          },
        ],

        actions: [],
        wrapWithPanel: false,
        mode: 'inline',
        reload: 'crud',
      },

      alwaysShowPagination: true,
      autoFillHeight: true,
    },
  ],
  id: 'u:7951bf1a715e',
  asideResizor: false,
  pullRefresh: {
    disabled: true,
  },
};

interface IAlarmKind {
  alarmLevel: string;
  alarmLevelName: string;
  alarmType: string;
  id: string;
}

const Area = () => {
  return (
    <Box h={'full'}>
      <AimsRender jsonView={data} />
    </Box>
  );
};

export default Area;
