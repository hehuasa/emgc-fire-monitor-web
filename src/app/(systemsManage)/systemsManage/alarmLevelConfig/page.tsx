'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import { Box } from '@chakra-ui/react';
import { useMemoizedFn, useMount, useSafeState } from 'ahooks';
import { request } from '@/utils/request';
import { IAlarmTypeItem } from '@/models/alarm';
import { DCItem } from '@/models/system';
import { IArea } from '@/models/map';
import { IPageData } from '@/utils/publicData';
import { stringify } from 'qs';
import { CurdAdaptor, DeleteRequestAdaptor } from '@/components/AmisAdaptor';

const AimsRender = dynamic(() => import('@/components/AimsRender'), { ssr: false });

interface IDevideType {
  id: string;
  productName: string;
}

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
        url: '/cx-alarm/alm/levelSetting/findPage',
        messages: {},
        dataType: 'form',
        data: {
          current: '${current}',
          size: '${size}',
          alarmType: '${alarmType_search}',
        },
        replaceData: true,
      },
      columns: [
        {
          name: 'areaName',
          label: '区域名称',
          type: 'text',
        },
        {
          type: 'text',
          label: '报警类型名称',
          name: 'alarmTypeName',
          id: 'u:9251387455ed',
        },
        {
          type: 'text',
          label: '报警种类名称',
          name: 'alarmTypeLevelName',
          id: 'u:481a599b0c34',
        },
        {
          type: 'text',
          label: '报警级别',
          name: 'alarmLevelText',
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
                      name: 'areaId',
                      label: '区域',
                      placeholder: '请选择区域',
                      required: true,
                      validateOnChange: false,
                      source: '${areaList}',
                      labelField: 'areaName',
                      valueField: 'areaId',
                    },
                    {
                      type: 'select',
                      name: 'alarmType',
                      label: '报警类型',
                      placeholder: '请选择报警类型',
                      required: true,
                      validateOnChange: false,
                      source: '${alarmTypeList}',
                      labelField: 'alarmTypeName',
                      valueField: 'alarmType',
                    },
                    {
                      label: '报警种类',
                      name: 'alarmTypeLevel',
                      type: 'select',
                      placeholder: '请选择报警种类',
                      source:
                        '/cx-alarm/alm/levelSetting/findAlarmTypeLevels?alarmType=${alarmType}',
                      labelField: 'alarmLevelName',
                      valueField: 'alarmLevel',
                      required: true,
                      validateOnChange: false,
                    },
                    {
                      label: '报警级别',
                      name: 'alarmLevel',
                      type: 'select',
                      placeholder: '请选择报警级别',
                      source: '${alarmLevelList}',
                      labelField: 'cnName',
                      valueField: 'value',
                      required: true,
                      validateOnChange: false,
                    },
                  ],
                  api: {
                    url: '/cx-alarm/alm/levelSetting/update/${id}',
                    method: 'put',
                    dataType: 'json',
                    messages: {
                      success: '修改成功',
                    },
                    adaptor: CurdAdaptor,
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
                url: '/cx-alarm/alm/levelSetting/delete/${id}',
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
            target: 'crud?alarmType_search=${alarmType_search}',
            body: [
              {
                name: 'alarmType_search',
                type: 'select',
                label: '报警类型',
                id: 'u:5d7fe78661f6',
                className: 'm-l',
                inputClassName: 'w',
                placeholder: '请选择报警类型',
                clearable: true,
                source: '${alarmTypeList}',
                labelField: 'alarmTypeName',
                valueField: 'alarmType',
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
                      url: '/cx-alarm/alm/levelSetting/add',
                      method: 'post',
                      dataType: 'json',
                      data: {
                        '&': '$$',
                      },
                      adaptor: CurdAdaptor,
                      messages: {
                        success: '新增成功',
                      },
                    },
                    body: [
                      {
                        type: 'select',
                        name: 'areaId',
                        label: '区域',
                        placeholder: '请选择区域',
                        required: true,
                        validateOnChange: false,
                        source: '${areaList}',
                        labelField: 'areaName',
                        valueField: 'areaId',
                      },
                      {
                        type: 'select',
                        name: 'alarmType',
                        label: '报警类型',
                        placeholder: '请选择报警类型',
                        required: true,
                        validateOnChange: false,
                        source: '${alarmTypeList}',
                        labelField: 'alarmTypeName',
                        valueField: 'alarmType',
                      },
                      {
                        label: '报警种类',
                        name: 'alarmTypeLevel',
                        type: 'select',
                        placeholder: '请选择报警种类',
                        source:
                          '/cx-alarm/alm/levelSetting/findAlarmTypeLevels?alarmType=${alarmType}',
                        labelField: 'alarmLevelName',
                        valueField: 'alarmLevel',
                        required: true,
                        validateOnChange: false,
                      },
                      {
                        label: '报警级别',
                        name: 'alarmLevel',
                        type: 'select',
                        placeholder: '请选择报警级别',
                        source: '${alarmLevelList}',
                        labelField: 'cnName',
                        valueField: 'value',
                        required: true,
                        validateOnChange: false,
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
      // headerToolbar: {
      //   type: 'button',
      //   actionType: 'dialog',
      //   label: '新增',
      //   icon: 'fa fa-plus pull-left',
      //   primary: true,
      //   dialog: {
      //     title: '新增',
      //     body: {
      //       type: 'form',
      //       name: 'sample-edit-form',
      //       api: {
      //         url: '/cx-alarm/alm/levelSetting/add',
      //         method: 'post',
      //         dataType: 'json',
      //         reload: 'crud',
      //         data: {
      //           '&': '$$',
      //         },
      //       },
      //       body: [
      //         {
      //           type: 'select',
      //           name: 'areaId',
      //           label: '区域',
      //           placeholder: '请选择区域',
      //           required: true,
      //           validateOnChange: false,
      //           source: '${areaList}',
      //           labelField: 'areaName',
      //           valueField: 'areaId',
      //         },
      //         {
      //           type: 'select',
      //           name: 'alarmType',
      //           label: '报警类型',
      //           placeholder: '请选择报警类型',
      //           required: true,
      //           validateOnChange: false,
      //           source: '${alarmTypeList}',
      //           labelField: 'alarmTypeName',
      //           valueField: 'alarmType',
      //         },
      //         {
      //           label: '报警种类',
      //           name: 'alarmTypeLevel',
      //           type: 'select',
      //           placeholder: '请选择报警种类',
      //           source: '/cx-alarm/alm/levelSetting/findAlarmTypeLevels?alarmType=${alarmType}',
      //           labelField: 'alarmLevelName',
      //           valueField: 'id',
      //           required: true,
      //           validateOnChange: false,
      //         },
      //         {
      //           label: '报警级别',
      //           name: 'alarmLevel',
      //           type: 'select',
      //           placeholder: '请选择报警级别',
      //           source: '${alarmLevelList}',
      //           labelField: 'cnName',
      //           valueField: 'value',
      //           required: true,
      //           validateOnChange: false,
      //         },
      //       ],
      //     },
      //   },
      // },
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
  const [alarmTypeList, setAlarmTypeList] = useSafeState<IAlarmTypeItem[]>([]);
  const [alarmLevelList, setAlarmLevelList] = useSafeState<DCItem[]>([]);
  const [areaList, setAreaList] = useSafeState<IArea[]>([]);

  useMount(() => {
    getAlarmTypeList();
    getAlarmLevel();
    getArea();
  });
  //获取报警类型
  const getAlarmTypeList = useMemoizedFn(async () => {
    const { code, data } = await request<IAlarmTypeItem[]>({
      url: `/cx-alarm/alm/alarm-type/list`,
    });

    if (code === 200) {
      setAlarmTypeList(data);
    }
  });
  const getAlarmLevel = useMemoizedFn(async () => {
    const res = await request<DCItem[]>({
      url: '/cx-alarm/dc_dict/list_item?dictCode=alarm_level',
    });
    if (res.code === 200) {
      setAlarmLevelList(res.data);
    }
  });
  //获取区域
  const getArea = useMemoizedFn(async () => {
    const obj = {
      size: 1000,
      //deptId: getLeftDepId(),
    };
    const str = stringify(obj, { skipNulls: true });
    const res = await request<IPageData<IArea>>({ url: `/cx-alarm/dc/area/page?${str}` });
    if (res.code === 200) {
      setAreaList(res.data.records);
    }
  });

  return (
    <Box h={'full'}>
      <AimsRender jsonView={data} props={{ alarmTypeList, alarmLevelList, areaList }} />
    </Box>
  );
};

export default Area;
