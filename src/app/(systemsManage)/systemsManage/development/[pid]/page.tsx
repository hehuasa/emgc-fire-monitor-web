'use client';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { dev } from '@/utils/util';
import { DepartmentType } from '@/models/userManage';
import { request } from '@/utils/request';
import { useMemoizedFn, useMount } from 'ahooks';
import { IAlarmTypeItem } from '@/models/alarm';
import { CurdAdaptor, DeleteRequestAdaptor } from '@/components/AmisAdaptor';
import { stringify } from 'qs';
import { IPageData } from '@/utils/publicData';
import { IArea } from '@/models/map';
const AimsRender = dynamic(() => import('@/components/AimsRender'), { ssr: false });

const hash = new Date().getTime();

const getData = async () => {
  const json = await (
    await fetch(`${process.env.NEXT_PUBLIC_ANALYTICS_Aims_server}/getAimsJsonById?id=33#${hash}`, {
      cache: dev ? 'no-store' : 'force-cache',
    })
  ).json();
  return json.data.item.content;
};

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
        url: '/cx-alarm/dc/areaCharge/findPage',
        messages: {},
        dataType: 'form',
        data: {
          current: '${current}',
          size: '${size}',
          alarmType: '${alarmType_search|default}',
          areaId: '${areaId|default}',
          deptId: '${deptId|default}',
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
          label: '负责人姓名',
          name: 'chargeName',
          id: 'u:481a599b0c34',
        },
        {
          type: 'text',
          label: '负责人电话',
          name: 'chargePhone',
        },
        {
          type: 'text',
          label: '部门名称',
          name: 'deptName',
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
                    // {
                    //   type: 'select',
                    //   name: 'areaId',
                    //   label: '区域',
                    //   placeholder: '请选择区域',
                    //   required: true,
                    //   validateOnChange: false,
                    //   source: '${areaList}',
                    //   labelField: 'areaName',
                    //   valueField: 'areaId',
                    // },
                    // {
                    //   type: 'select',
                    //   name: 'alarmType',
                    //   label: '报警类型',
                    //   placeholder: '请选择报警类型',
                    //   required: true,
                    //   validateOnChange: false,
                    //   source: '${alarmTypeList}',
                    //   labelField: 'alarmTypeName',
                    //   valueField: 'alarmType',
                    // },
                    // {
                    //   type: 'tree-select',
                    //   label: '部门',
                    //   name: 'deptId',
                    //   clearable: true,
                    //   source: '${depart}',
                    //   id: 'u:55846cf005a2',
                    //   placeholder: '请选择部门',
                    //   labelClassName: 'm-l',
                    //   inputClassName: 'w',
                    //   searchable: true,
                    //   hideNodePathLabel: true,
                    //   multiple: false,
                    //   enableNodePath: false,
                    //   showIcon: true,
                    //   initiallyOpen: true,
                    //   labelField: 'orgName',
                    //   valueField: 'orgCode',
                    // },
                    {
                      type: 'input-text',
                      name: 'chargeName',
                      label: '负责人名称',
                      placeholder: '请输入负责人名称',
                      required: true,
                      validateOnChange: false,
                    },
                    {
                      type: 'input-text',
                      name: 'chargePhone',
                      label: '负责人电话',
                      placeholder: '请输入负责人电话',
                      required: true,
                      validateOnChange: false,
                    },
                  ],
                  api: {
                    url: '/cx-alarm/dc/areaCharge/update',
                    method: 'post',
                    dataType: 'json',
                    messages: {
                      success: '修改成功',
                    },
                    adaptor: CurdAdaptor,
                    data: {
                      id: '${id}',
                      userName: '${chargeName}',
                      userPhone: '${chargePhone}',
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
                url: '/cx-alarm/dc/areaCharge/delete',
                method: 'DELETE',
                dataType: 'json',
                adaptor: CurdAdaptor,
                data: '${id|asArray}',
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
            target: 'crud?alarmType_search=${alarmType_search}&deptId=${deptId}&areaId=${areaId}',
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
              {
                type: 'select',
                name: 'areaId',
                label: '区域',
                placeholder: '请选择区域',
                validateOnChange: false,
                source: '${areaList}',
                labelField: 'areaName',
                valueField: 'areaId',
                labelClassName: 'm-l',
                inputClassName: 'w',
              },
              {
                type: 'tree-select',
                label: '所属部门',
                name: 'deptId',
                clearable: true,
                source: '${depart}',
                id: 'u:55846cf005a2',
                placeholder: '请选择部门',
                labelClassName: 'm-l',
                inputClassName: 'w',
                searchable: true,
                hideNodePathLabel: true,
                multiple: false,
                enableNodePath: false,
                showIcon: true,
                initiallyOpen: true,
                labelField: 'orgName',
                valueField: 'orgCode',
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
                type: 'reset',
                label: '重置',
                id: 'u:ec33662e8cd8',
                level: 'secondary',
                onEvent: {
                  click: {
                    actions: [
                      {
                        componentId: 'u:c4ad86e24b0a',
                        actionType: 'clear',
                      },
                      {
                        componentId: 'u:c4ad86e24b0a',
                        actionType: 'submit',
                      },
                    ],
                  },
                },
              },
              {
                type: 'button',
                actionType: 'dialog',
                label: '新增',
                level: 'primary',
                dialog: {
                  title: '新增',
                  body: {
                    type: 'form',
                    name: 'form',
                    reload: 'crud',
                    api: {
                      url: '/cx-alarm/dc/areaCharge/add',
                      method: 'post',
                      dataType: 'json',
                      data: {
                        alarmType: '${alarmType}',
                        areaId: '${areaId}',
                        changeInfo: [
                          {
                            deptId: '${deptData.orgCode}',
                            deptName: '${deptData.orgName}',
                            userName: '${userName}',
                            userPhone: '${userPhone}',
                          },
                        ],
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
                        validateOnChange: false,
                        required: true,
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
                        type: 'tree-select',
                        label: '所属部门',
                        name: 'deptData',
                        joinValues: false,
                        clearable: true,
                        source: '${depart}',
                        id: 'u:55846cf005a2',
                        placeholder: '请选择部门',
                        searchable: true,
                        required: true,
                        hideNodePathLabel: true,
                        multiple: false,
                        enableNodePath: false,
                        showIcon: true,
                        initiallyOpen: true,
                        labelField: 'orgName',
                        valueField: 'orgCode',
                      },
                      {
                        type: 'input-text',
                        name: 'userName',
                        label: '负责人姓名',
                        required: true,
                        placeholder: '请输入负责人姓名',
                      },
                      {
                        type: 'input-text',
                        name: 'userPhone',
                        label: '负责人电话',
                        required: true,
                        placeholder: '请输入负责人电话',
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

const Page = () => {
  // const data = await getData();

  const [depart, setDepart] = useState<Array<DepartmentType>>([]);
  const [alarmTypeList, setAlarmTypeList] = useState<IAlarmTypeItem[]>([]);
  const [areaList, setAreaList] = useState<IArea[]>([]);
  //请求部门数据
  const getDepartmentData = useMemoizedFn(async () => {
    const { data, code } = await request({
      url: `/ms-system/user/list-org-tree`,
      options: {
        method: 'GET',
      },
    });
    if (code == 200) {
      setDepart(data as unknown as Array<DepartmentType>);
    }
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

  useMount(() => {
    getAlarmTypeList();
    getArea();
    getDepartmentData();
  });
  return (
    <AimsRender
      jsonView={data}
      props={{ depart, alarmTypeList: [{ alarmTypeName: '测试', alarmType: '1' }], areaList }}
    />
  );
};

export default Page;
