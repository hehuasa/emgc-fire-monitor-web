'use client';
import { objectType } from '@/models/global';
import { DepartmentType } from '@/models/userManage';
import { request } from '@/utils/request';
import { Box } from '@chakra-ui/react';
import { useMount } from 'ahooks';
import dynamic from 'next/dynamic';
import { useCallback, useState } from 'react';

const AimsRender = dynamic(() => import('@/components/AimsRender'), { ssr: false });

const data = {
  type: 'page',
  id: 'u:a1da8635b7de',
  pullRefresh: {
    disabled: true,
  },
  regions: ['body'],
  title: '区域管理',
  body: [
    {
      type: 'crud',
      syncLocation: false,
      autoFillHeight: true,
      api: {
        method: 'get',
        url: '/cx-alarm/dc/area/page',
        messages: {},
        dataType: 'form',
        data: {
          current: '${current}',
          size: '${size}',
          areaName: '${areaName|default}',
          deptId: '${deptId|default}',
        },
        replaceData: true,
        requestAdaptor: '',
        adaptor:
          "const newItems = []\r\nfor (let i = 0; i < response.data?.records?.length; i++) {\r\n  const temp = {\r\n    mapName: response.data.records[i].areaName,\r\n    ...response.data.records[i]\r\n  }\r\n  newItems.push(temp)\r\n}\r\n\r\nreturn {\r\n  msg: response.code === 200 ? '' : response.msg,\r\n  status: response.code === 200 ? 0 : response.code,\r\n  data: {\r\n    items: newItems,\r\n    total: response.data ? response.data.total : 0,\r\n  },\r\n};",
      },
      columns: [
        {
          label: '序号',
          type: 'tpl',
          tpl: '${index + 1}',
          id: 'u:63cb0b13beb3',
        },
        {
          name: 'areaCode',
          label: '区域编号',
          type: 'text',
          id: 'u:b7d97b59a450',
        },
        {
          type: 'text',
          label: '区域名称',
          name: 'areaName',
          id: 'u:48e3affb59a4',
        },
        {
          type: 'text',
          label: '上级区域',
          name: 'parentAreaName',
          id: 'u:2414130a93c1',
        },
        {
          type: 'text',
          label: '地图位置',
          name: 'areaName',
          id: 'u:dd2e25cc4386',
        },
        {
          type: 'text',
          label: '区域类型',
          name: 'areaTypeView',
          id: 'u:d4e7fea37e30',
        },
        {
          type: 'text',
          label: '备注',
          name: 'remark',
          id: 'u:d25c53c4a00b',
        },
        {
          type: 'button-toolbar',
          label: '操作',
          name: 'areaId',
          buttons: [
            {
              type: 'button',
              label: '修改',
              id: 'u:cb2e18ce404d',
              level: 'enhance',
              dialog: {
                type: 'dialog',
                title: '修改区域',
                size: 'md',
                body: [
                  {
                    type: 'form',
                    title: '表单',
                    reload: 'crud',
                    api: {
                      url: '/cx-alarm/dc/area/update/${areaId}',
                      method: 'put',
                      messages: {
                        success: '修改成功',
                      },
                      dataType: 'json',
                      data: {
                        '&': '$$',
                        deptId: '${deptId || 1}',
                      },
                      requestAdaptor: '',
                      adaptor:
                        'return {\r\n  msg: response.code === 200 ? api.messages.success : response.msg,\r\n  status: response.code === 200 ? 0 : response.code,\r\n  data: {\r\n    responseMsg: response.msg,\r\n  },\r\n};',
                    },
                    body: [
                      {
                        type: 'input-text',
                        label: '地图位置',
                        name: 'mapName',
                        id: 'u:e3ecaf0eea45',
                        labelClassName: 'm-l',
                        inputClassName: 'w',
                        clearable: true,
                        placeholder: '请选择地图位置',
                        readOnly: true,
                        onEvent: {
                          focus: {
                            actions: [
                              {
                                actionType: 'dialog',
                                dialog: {
                                  type: 'dialog',
                                  title: '位置选择',
                                  size: 'xl',
                                  body: [
                                    {
                                      type: 'area-map',
                                      name: 'position',
                                      id: 'u:a2576ae98bec',
                                      stationFlag: '${stationFlag}',
                                      areaId: '${areaId}',
                                    },
                                  ],
                                  showCloseButton: true,
                                  showErrorMsg: true,
                                  showLoading: true,
                                  id: 'u:1c2f5bb02fad',
                                  onEvent: {
                                    confirm: {
                                      weight: 0,
                                      actions: [
                                        {
                                          actionType: 'setValue',
                                          componentId: 'u:e3ecaf0eea45',
                                          args: {
                                            value: '${event.data["position"]["mapName"]}',
                                          },
                                        },
                                        {
                                          componentId: 'u:863243204346',
                                          actionType: 'setValue',
                                          args: {
                                            value: '${event.data["position"]["location"]}',
                                          },
                                        },
                                        {
                                          componentId: 'u:dd90f1909b57',
                                          actionType: 'setValue',
                                          args: {
                                            value: '${event.data["position"]["mapName"]}',
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  actions: [
                                    {
                                      type: 'button',
                                      actionType: 'cancel',
                                      label: '取消',
                                      id: 'u:e98e3ef85f87',
                                    },
                                    {
                                      type: 'button',
                                      actionType: 'confirm',
                                      label: '确定',
                                      primary: true,
                                      id: 'u:b49f5206b52f',
                                    },
                                  ],
                                  closeOnOutside: false,
                                  closeOnEsc: false,
                                  draggable: false,
                                  data: {
                                    '&': '$$',
                                    areaId: '${areaId}',
                                  },
                                  dataMap: {
                                    areaId: '${areaId}',
                                  },
                                  withDefaultData: true,
                                  dataMapSwitch: true,
                                },
                              },
                            ],
                          },
                        },
                        visible: true,
                        strictMode: false,
                        required: true,
                      },
                      {
                        type: 'input-text',
                        label: '区域名称',
                        name: 'areaName',
                        id: 'u:dd90f1909b57',
                        labelClassName: 'm-l',
                        inputClassName: 'w',
                        clearable: true,
                        placeholder: '请输入区域名称',
                        required: true,
                        validateOnChange: false,
                      },
                      {
                        label: '区域编码',
                        type: 'input-text',
                        name: 'areaCode',
                        id: 'u:a1ae45d44de0',
                        labelClassName: 'm-l',
                        inputClassName: 'w',
                        clearable: true,
                        placeholder: '请输入区域编码',
                        required: true,
                        validateOnChange: false,
                      },
                      {
                        type: 'select',
                        label: '区域类型',
                        name: 'areaType',
                        id: 'u:545989b85ac0',
                        multiple: false,
                        labelClassName: 'm-l',
                        inputClassName: 'w',
                        placeholder: '请选择区域类型',
                        clearable: true,
                        required: true,
                        validateOnChange: false,
                        source: '${areaTypeList}',
                      },
                      {
                        type: 'select',
                        label: '上级区域',
                        name: 'parentAreaId',
                        id: 'u:f7e1d6826e89',
                        multiple: false,
                        labelClassName: 'm-l',
                        inputClassName: 'w',
                        placeholder: '请选择上级区域',
                        source: {
                          url: '/cx-alarm/dc/area/getChildren?areaId=0',
                          method: 'get',
                          messages: {},
                          dataType: 'form',
                        },
                        labelField: 'areaName',
                        valueField: 'areaId',
                      },
                      {
                        type: 'input-number',
                        label: '总楼层数',
                        name: 'hasMulFloors',
                        id: 'u:c85a94f0a8e8',
                        placeholder: '请输入总楼层数',
                        keyboard: false,
                        labelClassName: 'm-l',
                        inputClassName: 'w',
                        kilobitSeparator: false,
                      },
                      {
                        type: 'input-number',
                        label: '当前楼层',
                        name: 'floorLevel',
                        placeholder: '请输入当前楼层',
                        id: 'u:867f2f504346',
                        keyboard: false,
                        labelClassName: 'm-l',
                        inputClassName: 'w',
                      },
                      {
                        type: 'input-group',
                        label: '3D高度',
                        name: 'd3Height',
                        id: 'u:867f2f504346',
                        keyboard: false,
                        body: [
                          {
                            type: 'input-number',
                            label: '3D高度',
                            name: 'd3Height',
                            placeholder: '请输入楼层高度',
                            id: 'u:867f2f504346',
                            step: 0.01,
                            keyboard: false,
                            labelClassName: 'm-l',
                            inputClassName: 'w mr-2',
                          },
                          {
                            type: 'static',
                            value: '米',
                            id: 'u:9fa1cfe25d17',
                          },
                        ],
                      },
                      {
                        type: 'hidden',
                        label: '',
                        name: 'location',
                        id: 'u:863243204346',
                      },
                      {
                        type: 'textarea',
                        label: '备注',
                        name: 'remark',
                        id: 'u:d32c03704907',
                        minRows: 3,
                        maxRows: 20,
                        labelClassName: 'm-l',
                        mode: 'normal',
                        placeholder: '请输入备注',
                      },
                    ],
                    mode: 'inline',
                    id: 'u:f5cc2d799d8e',
                    actions: [
                      {
                        type: 'submit',
                        label: '提交',
                        primary: true,
                      },
                    ],
                    feat: 'Insert',
                    dsType: 'api',
                    onEvent: {
                      submitSucc: {
                        weight: 0,
                        actions: [
                          {
                            componentId: 'u:5aa2afb49e5d',
                            groupType: 'component',
                            actionType: 'reload',
                          },
                        ],
                      },
                    },
                  },
                ],
                showCloseButton: true,
                showErrorMsg: false,
                showLoading: true,
                id: 'u:15ac3e1b49ff',
                closeOnEsc: true,
                actions: [
                  {
                    type: 'button',
                    actionType: 'cancel',
                    label: '取消',
                    id: 'u:773c20c1c70e',
                  },
                  {
                    type: 'button',
                    actionType: 'confirm',
                    label: '确定',
                    primary: true,
                    id: 'u:997be856d268',
                  },
                ],
              },
              actionType: 'dialog',
            },
            {
              type: 'button',
              label: '删除',
              id: 'u:8bd33adb5d8d',
              level: 'danger',
              actionType: 'ajax',
              confirmText: '确定要删除？',
              api: {
                url: '/cx-alarm/dc/area/delete',
                method: 'delete',
                dataType: 'json',
                data: '${areaId|asArray}',
                messages: {
                  success: '删除成功',
                },
                adaptor:
                  'return {\r\n  msg: response.code === 200 ? api.messages.success : response.msg,\r\n  status: response.code === 200 ? 0 : response.code,\r\n  data: {\r\n    responseMsg: response.msg,\r\n  },\r\n};',
              },
              reload: 'u:5aa2afb49e5d',
            },
          ],
          id: 'u:d5bc8790d1e8',
        },
      ],
      bulkActions: [],
      itemActions: [],
      features: ['filter'],
      headerToolbar: ['bulkActions'],
      id: 'u:5aa2afb49e5d',
      perPageAvailable: [10, 20, 50],
      messages: {},
      footerToolbar: [
        {
          type: 'statistics',
        },
        {
          type: 'pagination',
        },
        {
          id: 'u:4567916ff3cf',
          tpl: '内容',
          type: 'switch-per-page',
          align: 'right',
          wrapperComponent: '',
        },
      ],
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
            type: 'input-text',
            name: 'areaName',
            label: '区域名称',
            id: 'u:8dc6eb8917cd',
            placeholder: '请根据区域名称查询',
            className: '',
            labelClassName: 'm-l',
            inputClassName: 'w',
            clearable: true,
          },
          {
            type: 'button-toolbar',
            label: '',
            buttons: [
              {
                type: 'submit',
                label: '查询',
                id: 'u:57d6dfdfb28b',
                level: 'primary',
              },
              {
                type: 'reset',
                label: '重置',
                id: 'u:ec33662e8cd8',
                level: 'secondary',
                onEvent: {
                  click: {
                    actions: [
                      {
                        componentId: 'u:010c87ecb51c',
                        actionType: 'clear',
                      },
                      {
                        componentId: 'u:010c87ecb51c',
                        actionType: 'submit',
                      },
                    ],
                  },
                },
              },
              {
                type: 'button',
                label: '新增',
                id: 'u:48b4e461b161',
                level: 'success',
                dialog: {
                  type: 'dialog',
                  title: '新增区域',
                  size: 'md',
                  body: [
                    {
                      type: 'form',
                      name: 'addForm',
                      title: '表单',
                      reload: 'crud',
                      api: {
                        url: '/cx-alarm/dc/area/add',
                        method: 'post',
                        messages: {
                          success: '新增成功',
                        },
                        dataType: 'json',
                        data: {
                          '&': '$$',
                          deptId: '${deptId || 1}',
                        },
                        requestAdaptor: '',
                        adaptor:
                          'return {\r\n  msg: response.code === 200 ? api.messages.success : response.msg,\r\n  status: response.code === 200 ? 0 : response.code,\r\n  data: {\r\n    responseMsg: response.msg,\r\n  },\r\n};',
                      },
                      body: [
                        {
                          type: 'input-text',
                          id: 'u:66b8fab259a2',
                          label: '地图位置',
                          labelClassName: 'm-l',
                          inputClassName: 'w',
                          name: 'mapName',
                          placeholder: '请选择地图位置',
                          required: true,
                          clearable: true,
                          readOnly: true,
                          onEvent: {
                            focus: {
                              actions: [
                                {
                                  actionType: 'dialog',
                                  dialog: {
                                    type: 'dialog',
                                    title: '位置选择',
                                    size: 'xl',
                                    body: [
                                      {
                                        type: 'area-map',
                                        name: 'position',
                                        id: 'u:35fa0ae57713',
                                      },
                                    ],
                                    showCloseButton: true,
                                    showErrorMsg: true,
                                    showLoading: true,
                                    id: 'u:e438ded7d3ef',
                                    onEvent: {
                                      confirm: {
                                        weight: 0,
                                        actions: [
                                          {
                                            componentId: 'u:66b8fab259a2',
                                            actionType: 'setValue',
                                            args: {
                                              value: '${event.data["position"]["mapName"]}',
                                            },
                                          },
                                          {
                                            componentId: 'u:863243204346',
                                            actionType: 'setValue',
                                            args: {
                                              value: '${event.data["position"]["location"]}',
                                            },
                                          },
                                          {
                                            componentId: 'u:044e4a43c89c',
                                            actionType: 'setValue',
                                            args: {
                                              value: '${event.data["position"]["mapName"]}',
                                            },
                                          },
                                        ],
                                      },
                                    },
                                    actions: [
                                      {
                                        type: 'button',
                                        actionType: 'cancel',
                                        label: '取消',
                                        id: 'u:1e5ffd4e09a2',
                                      },
                                      {
                                        type: 'button',
                                        actionType: 'confirm',
                                        label: '确定',
                                        primary: true,
                                        id: 'u:047b15a47b7c',
                                      },
                                    ],
                                  },
                                },
                              ],
                            },
                          },
                        },
                        {
                          type: 'input-text',
                          label: '区域名称',
                          name: 'areaName',
                          id: 'u:044e4a43c89c',
                          labelClassName: 'm-l',
                          inputClassName: 'w',
                          clearable: true,
                          placeholder: '请输入区域名称',
                          required: true,
                          validateOnChange: false,
                        },
                        {
                          label: '区域编码',
                          type: 'input-text',
                          name: 'areaCode',
                          id: 'u:a1ae45d44de0',
                          labelClassName: 'm-l',
                          inputClassName: 'w',
                          clearable: true,
                          placeholder: '请输入区域编码',
                          required: true,
                          validateOnChange: false,
                        },
                        {
                          type: 'select',
                          label: '区域类型',
                          name: 'areaType',
                          id: 'u:545989b85ac0',
                          multiple: false,
                          labelClassName: 'm-l',
                          inputClassName: 'w',
                          placeholder: '请选择区域类型',
                          clearable: true,
                          required: true,
                          validateOnChange: false,
                          source: '${areaTypeList}',
                        },
                        {
                          type: 'select',
                          label: '上级区域',
                          name: 'parentAreaId',
                          id: 'u:f7e1d6826e89',
                          multiple: false,
                          labelClassName: 'm-l',
                          inputClassName: 'w',
                          placeholder: '请选择上级区域',
                          source: {
                            url: '/cx-alarm/dc/area/getChildren?areaId=0',
                            method: 'get',
                            messages: {},
                            dataType: 'form',
                          },
                          labelField: 'areaName',
                          valueField: 'areaId',
                        },
                        {
                          type: 'input-number',
                          label: '总楼层数',
                          name: 'hasMulFloors',
                          id: 'u:c85a94f0a8e8',
                          placeholder: '请输入总楼层数',
                          keyboard: false,
                          labelClassName: 'm-l',
                          inputClassName: 'w',
                          kilobitSeparator: false,
                        },
                        {
                          type: 'input-number',
                          label: '当前楼层',
                          name: 'floorLevel',
                          placeholder: '请输入当前楼层',
                          id: 'u:867f2f504346',
                          keyboard: false,
                          labelClassName: 'm-l',
                          inputClassName: 'w',
                        },
                        {
                          type: 'input-number',
                          label: '3D高度',
                          name: 'd3Height',
                          placeholder: '请输入楼层高度',
                          id: 'u:867f2f504346',
                          keyboard: false,
                          step: 0.01,
                          labelClassName: 'm-l',
                          inputClassName: 'w',
                        },
                        {
                          type: 'hidden',
                          label: '',
                          name: 'location',
                          id: 'u:863243204346',
                        },
                        {
                          type: 'textarea',
                          label: '备注',
                          name: 'remark',
                          id: 'u:d32c03704907',
                          minRows: 3,
                          maxRows: 20,
                          labelClassName: 'm-l',
                          mode: 'normal',
                          placeholder: '请输入备注',
                        },
                      ],
                      mode: 'inline',
                      id: 'u:f5cc2d799d8e',
                      actions: [
                        {
                          type: 'submit',
                          label: '提交',
                          primary: true,
                        },
                      ],
                      feat: 'Insert',
                      dsType: 'api',
                      onEvent: {
                        submitSucc: {
                          weight: 0,
                          actions: [
                            {
                              componentId: 'u:5aa2afb49e5d',
                              groupType: 'component',
                              actionType: 'reload',
                            },
                          ],
                        },
                      },
                    },
                  ],
                  showCloseButton: true,
                  showErrorMsg: false,
                  showLoading: true,
                  id: 'u:15ac3e1b49ff',
                  closeOnEsc: true,
                  actions: [
                    {
                      type: 'button',
                      actionType: 'cancel',
                      label: '取消',
                      id: 'u:db378c189ffc',
                    },
                    {
                      type: 'button',
                      actionType: 'confirm',
                      label: '确定',
                      primary: true,
                      id: 'u:d343311f77f4',
                    },
                  ],
                },
                actionType: 'dialog',
              },
              {
                label: '导出',
                id: 'u:cfb379db1b3a',
                level: 'primary',
                type: 'action',
                actionType: 'download',
                api: {
                  url: '/cx-alarm/dc/area/exportExcel',
                  method: 'get',
                  messages: {},
                  headers: {
                    name: '区域列表.xlsx',
                  },
                  data: {
                    areaName: '${areaName|default}',
                    deptId: '${deptId|default}',
                  },
                  dataType: 'form',
                },
              },
            ],
            id: 'u:e80563d30f0a',
          },
        ],
        id: 'u:010c87ecb51c',
        wrapWithPanel: false,
        feat: 'Insert',
      },
      alwaysShowPagination: true,
    },
  ],
};

console.log('data', JSON.stringify(data));

const Area = () => {
  const [departData, setDepartData] = useState<Array<DepartmentType>>([]);
  const [dictData, setDictData] = useState<Array<unknown>>([]);

  //请求部门数据
  const getDepartmentData = useCallback(async () => {
    const { data, code } = await request({
      url: `/ms-system/user/list-org-tree`,
      options: {
        method: 'GET',
      },
    });
    if (code == 200) {
      setDepartData(data as unknown as Array<DepartmentType>);
    }
  }, []);

  const getDict = async () => {
    const { data, code } = await request<objectType>({
      url: `/cx-alarm/dc_dict/dictionary`,
    });
    if (code === 200) {
      const alarmStatusList = data['area_type'];
      const areaTypeList =
        alarmStatusList &&
        Object.entries(alarmStatusList).map(([key, value]) => {
          return {
            label: value,
            value: key,
          };
        });
      setDictData(areaTypeList);
    }
  };

  useMount(() => {
    getDepartmentData();
    getDict();
  });

  return (
    <Box h={'full'}>
      <AimsRender jsonView={data} props={{ depart: departData, areaTypeList: dictData }} />
    </Box>
  );
};

export default Area;
