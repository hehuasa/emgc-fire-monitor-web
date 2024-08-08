'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import { Box } from '@chakra-ui/react';
import { Text } from '@chakra-ui/react';

const TextPlan = (props: any) => {
  const autoCloseTime = props?.data?.autoCloseTime;
  if (autoCloseTime) {
    return (
      <td>
        <Text>{autoCloseTime}秒</Text>
      </td>
    );
  }

  return <td></td>;
};

const IsContinuousText = (props: any) => {
  const isContinuous = props?.data?.isContinuous;
  return <td>{isContinuous === 1 ? '是' : '否'}</td>;
};

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
        url: '/cx-alarm/alm/lampScheme/findPage',
        messages: {},
        dataType: 'form',
        data: {
          current: '${current}',
          size: '${size}',
        },
        replaceData: true,
      },
      columns: [
        {
          name: 'schemeName',
          label: '方案名称',
          type: 'text',
        },
        {
          label: '灯配置',
          name: 'lightColor',
          type: 'mapping',
          map: {
            '01': '红色',
            '02': '黄色',
            '03': '绿色',
            '04': '蓝色',
          },
        },
        {
          label: '灯光闪烁频率',
          name: 'lightFrequency',
          type: 'mapping',
          map: {
            '00': '不闪烁',
            '01': '快闪',
            '02': '慢闪',
          },
        },
        {
          label: '是否开启灯光',
          name: 'openLight',
          type: 'mapping',
          map: {
            '1': '是',
            '0': '否',
          },
        },
        {
          label: '是否开启声音',
          name: 'openSound',
          type: 'mapping',
          map: {
            '1': '是',
            '0': '否',
          },
        },
        {
          label: '音量',
          name: 'volume',
          type: 'mapping',
          map: {
            '01': '高',
            '02': '中',
            '03': '低',
          },
        },
        {
          label: '声音频率',
          name: 'soundFrequency',
          type: 'mapping',
          map: {
            '01': '高',
            '02': '中',
            '03': '低',
          },
        },
        {
          label: '是否持续触发报警',
          name: 'isContinuous',
          component: IsContinuousText,
        },
        {
          label: '自动关闭时间',
          name: 'autoCloseTime',

          component: TextPlan,
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
                      type: 'input-text',
                      name: 'schemeName',
                      label: '报警灯方案名称',
                      placeholder: '请输入报警灯方案名称',
                      required: true,
                      validateOnChange: false,
                    },
                    {
                      type: 'radios',
                      name: 'lightColor',
                      label: '灯配置',
                      required: true,
                      validateOnChange: false,
                      options: [
                        {
                          label: '红色',
                          value: '01',
                        },
                        {
                          label: '黄色',
                          value: '02',
                        },
                        {
                          label: '绿色',
                          value: '03',
                        },
                        {
                          label: '蓝色',
                          value: '04',
                        },
                      ],
                    },
                    {
                      label: '闪烁频率',
                      name: 'lightFrequency',
                      type: 'radios',

                      options: [
                        {
                          label: '不闪烁',
                          value: '00',
                        },
                        {
                          label: '快闪',
                          value: '01',
                        },
                        {
                          label: '慢闪',
                          value: '02',
                        },
                      ],

                      required: true,
                      validateOnChange: false,
                    },
                    {
                      label: '是否开启灯光',
                      name: 'openLight',
                      type: 'radios',
                      options: [
                        {
                          label: '是',
                          value: '1',
                        },
                        {
                          label: '否',
                          value: '0',
                        },
                      ],

                      required: true,
                      validateOnChange: false,
                    },
                    {
                      label: '是否开启声音',
                      name: 'openSound',
                      type: 'radios',
                      options: [
                        {
                          label: '是',
                          value: '1',
                        },
                        {
                          label: '否',
                          value: '0',
                        },
                      ],

                      required: true,
                      validateOnChange: false,
                    },
                    {
                      label: '音量',
                      name: 'volume',
                      type: 'radios',
                      placeholder: '请选择报警级别',
                      required: true,
                      validateOnChange: false,
                      options: [
                        {
                          label: '高',
                          value: '01',
                        },
                        {
                          label: '中',
                          value: '02',
                        },
                        {
                          label: '低',
                          value: '03',
                        },
                      ],
                    },
                    {
                      label: '声音频率',
                      name: 'soundFrequency',
                      type: 'radios',

                      required: true,
                      validateOnChange: false,
                      options: [
                        {
                          label: '高',
                          value: '01',
                        },
                        {
                          label: '中',
                          value: '02',
                        },
                        {
                          label: '低',
                          value: '03',
                        },
                      ],
                    },
                    {
                      label: '自动关闭时间',
                      name: 'autoCloseTime',
                      type: 'input-number',

                      placeholder: '请输入自动关闭时间(秒)',
                      min: 0,
                      //visibleOn: '${schemeName == 1}',
                    },
                    {
                      label: '是否持续触发报警',
                      name: 'isContinuous',
                      type: 'checkbox',
                      trueValue: '1',
                      falseValue: '0',
                    },
                  ],
                  api: {
                    url: '/cx-alarm/alm/lampScheme/update/${id}',
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
              onEvent: {
                click: {
                  actions: [
                    {
                      actionType: 'dialog',
                      dialog: {
                        type: 'dialog',
                        title: '删除',
                        body: [
                          {
                            type: 'static',
                            label: '',
                            tpl: '是否确认删除！',
                            id: 'u:129c99e4d3df',
                            borderMode: 'none',
                          },
                        ],
                        showCloseButton: true,
                        showErrorMsg: false,
                        showLoading: false,
                        id: 'u:d794473fc4b5',
                        actions: [
                          {
                            type: 'button-toolbar',
                            label: '',
                            buttons: [
                              {
                                type: 'button',
                                label: '取消',
                                onEvent: {
                                  click: {
                                    actions: [],
                                  },
                                },
                                id: 'u:4efd12b4290c',
                                close: true,
                                level: 'secondary',
                              },
                              {
                                type: 'button',
                                label: '确定',
                                onEvent: {
                                  click: {
                                    actions: [
                                      {
                                        args: {
                                          options: {
                                            silent: false,
                                          },
                                          api: {
                                            url: '/cx-alarm/alm/lampScheme/delete/${id}',
                                            method: 'DELETE',
                                          },
                                        },
                                        outputVar: 'responseResult',
                                        actionType: 'ajax',
                                      },
                                      {
                                        componentId: 'u:c8b1fa56558e',
                                        args: {
                                          resetPage: false,
                                        },
                                        actionType: 'reload',
                                        data: null,
                                      },
                                    ],
                                  },
                                },
                                id: 'u:f425822a4e8a',
                                close: true,
                                level: 'danger',
                              },
                            ],
                            id: 'u:3f64f28b006f',
                          },
                        ],
                        size: 'sm',
                      },
                    },
                  ],
                },
              },
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
      headerToolbar: {
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
              url: '/cx-alarm/alm/lampScheme/add',
              method: 'post',
              dataType: 'json',
              reload: 'crud',
              data: {
                '&': '$$',
              },
            },
            body: [
              {
                type: 'input-text',
                name: 'schemeName',
                label: '报警灯方案名称',
                placeholder: '请输入报警灯方案名称',
                required: true,
                validateOnChange: false,
              },
              {
                type: 'radios',
                name: 'lightColor',
                label: '灯配置',
                required: true,
                validateOnChange: false,
                options: [
                  {
                    label: '红色',
                    value: '01',
                  },
                  {
                    label: '黄色',
                    value: '02',
                  },
                  {
                    label: '绿色',
                    value: '03',
                  },
                  {
                    label: '蓝色',
                    value: '04',
                  },
                ],
              },
              {
                label: '闪烁频率',
                name: 'lightFrequency',
                type: 'radios',

                options: [
                  {
                    label: '不闪烁',
                    value: '00',
                  },
                  {
                    label: '快闪',
                    value: '01',
                  },
                  {
                    label: '慢闪',
                    value: '02',
                  },
                ],

                required: true,
                validateOnChange: false,
              },
              {
                label: '是否开启灯光',
                name: 'openLight',
                type: 'radios',
                options: [
                  {
                    label: '是',
                    value: '1',
                  },
                  {
                    label: '否',
                    value: '0',
                  },
                ],

                required: true,
                validateOnChange: false,
              },
              {
                label: '是否开启声音',
                name: 'openSound',
                type: 'radios',
                options: [
                  {
                    label: '是',
                    value: '1',
                  },
                  {
                    label: '否',
                    value: '0',
                  },
                ],

                required: true,
                validateOnChange: false,
              },
              {
                label: '音量',
                name: 'volume',
                type: 'radios',
                placeholder: '请选择报警级别',
                required: true,
                validateOnChange: false,
                options: [
                  {
                    label: '高',
                    value: '01',
                  },
                  {
                    label: '中',
                    value: '02',
                  },
                  {
                    label: '低',
                    value: '03',
                  },
                ],
              },
              {
                label: '声音频率',
                name: 'soundFrequency',
                type: 'radios',

                required: true,
                validateOnChange: false,
                options: [
                  {
                    label: '高',
                    value: '01',
                  },
                  {
                    label: '中',
                    value: '02',
                  },
                  {
                    label: '低',
                    value: '03',
                  },
                ],
              },
              {
                label: '自动关闭时间',
                name: 'autoCloseTime',
                type: 'input-number',

                placeholder: '请输入自动关闭时间(秒)',
                min: 0,
                //visibleOn: '${schemeName == 1}',
              },
              {
                label: '是否持续触发报警',
                name: 'isContinuous',
                type: 'checkbox',
                trueValue: '1',
                falseValue: '0',
              },
            ],
          },
        },
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
