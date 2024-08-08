'use client';
import { CurdAdaptor, DeleteRequestAdaptor } from '@/components/AmisAdaptor';
import { IAlarmType, IRoleType } from '@/models/system';
import { DepartmentType } from '@/models/userManage';
import { IPageData } from '@/utils/publicData';
import { request } from '@/utils/request';
import { Box } from '@chakra-ui/react';
import { useMemoizedFn, useMount } from 'ahooks';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const AimsRender = dynamic(() => import('@/components/AimsRender'), { ssr: false });

const data = {
  type: 'page',
  title: '数据权限管理',
  body: [
    {
      type: 'crud',
      name: 'crud',
      syncLocation: false,
      autoFillHeight: true,
      api: {
        method: 'post',
        url: '/cx-alarm/alm/alarm_auth/page',
        messages: {},
        dataType: 'json',
        replaceData: true,
        data: {
          '&': '$$',
          pageBean: {
            currentPage: '${currentPage}',
            pageSize: '${pageSize}',
          },
        },
      },
      columns: [
        {
          name: 'roleName',
          label: '角色名称',
          type: 'text',
          id: 'u:88d5a9e5e30e',
          width: 200,
        },
        {
          type: 'tpl',
          name: 'orgNames',
          label: '处理部门',
          id: 'u:437ff78a62d0',
          width: '40%',
          tpl: '${orgNames|join|truncate:50}',
          popOver: {
            trigger: 'hover',
            showIcon: false,
            body: '${orgNames}',
            popOverClassName: 'min-w-0',
            position: 'left-center-right-center right-center-left-center',
          },
        },
        {
          name: 'alarmTypeNames',
          label: '数据类型',
          type: 'text',
          id: 'u:437ff78a621211',
        },
        {
          type: 'button-toolbar',
          label: '操作',
          id: 'u:d3424641af89',
          name: 'id',
          buttons: [
            {
              type: 'button',
              label: '修改',
              actionType: 'dialog',
              level: 'enhance',
              id: 'u:35f5d4a2acc5',
              dialog: {
                type: 'dialog',
                title: '数据权限配置',
                size: 'md',
                body: [
                  {
                    type: 'form',
                    api: {
                      url: '/cx-alarm/alm/alarm_auth/update',
                      dataType: 'json',
                      method: 'post',
                      adaptor: CurdAdaptor,
                      messages: {
                        success: '修改成功',
                      },
                      data: {
                        roleId: '${roleId}',
                        orgIds: '${orgIds|split}',
                        alarmTypes: '${alarmTypes|split}',
                      },
                    },
                    title: '',
                    mode: 'horizontal',
                    body: [
                      {
                        type: 'select',
                        name: 'roleId',
                        label: '角色',
                        source: '${roleList}',
                        labelField: 'roleName',
                        valueField: 'id',
                        disabled: true,
                      },
                      {
                        type: 'tree-select',
                        label: '部门',
                        name: 'orgIds',
                        clearable: true,
                        source: '${depart}',
                        id: 'u:55846cf005a2',
                        placeholder: '请选择部门',
                        searchable: true,
                        hideNodePathLabel: true,
                        multiple: true,
                        enableNodePath: false,
                        showIcon: true,
                        initiallyOpen: true,
                        cascade: true,
                        labelField: 'orgName',
                        valueField: 'id',
                      },
                      {
                        type: 'checkboxes',
                        name: 'alarmTypes',
                        label: '数据类型',
                        source: '${typeList}',
                        labelField: 'alarmTypeName',
                        valueField: 'alarmType',
                      },
                    ],
                  },
                ],
                showCloseButton: true,
                showErrorMsg: false,
                showLoading: false,
                id: 'u:f513da49400e',
                closeOnEsc: true,
                dataMapSwitch: false,
              },
            },
            {
              type: 'button',
              id: 'u:8bd33adb5d8d',
              api: {
                url: '/cx-alarm/alm/alarm_auth/delete?roleId=${roleId}',
                method: 'get',
                dataType: 'form',
                adaptor: CurdAdaptor,
                messages: {
                  success: '删除成功',
                },
                requestAdaptor: DeleteRequestAdaptor,
              },
              label: '删除',
              level: 'danger',
              actionType: 'ajax',
              confirmText: '确定要删除？',
            },
          ],
        },
      ],
      bulkActions: [],
      itemActions: [],
      features: ['filter'],
      id: 'u:ae3c08295bd7',
      filter: {
        title: '查询条件',
        body: [
          {
            type: 'form',
            title: '查询条件',
            target: 'crud?roleName=${roleName}',
            body: [
              {
                name: 'roleName',
                type: 'input-text',
                label: '角色名称',
                id: 'u:5d7fe78661f6',
                className: 'm-l',
                inputClassName: 'w',
                placeholder: '请输入角色名称',
                clearable: true,
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
                id: 'u:ec33662e8cd8',
                level: 'secondary',
              },

              {
                type: 'button',
                label: '新增',
                actionType: 'dialog',
                dialog: {
                  type: 'dialog',
                  title: '数据权限配置',
                  size: 'md',
                  body: [
                    {
                      type: 'form',
                      reload: 'crud',
                      api: {
                        url: '/cx-alarm/alm/alarm_auth/add',
                        dataType: 'json',
                        method: 'post',
                        adaptor: CurdAdaptor,
                        messages: {
                          success: '新增成功',
                        },
                        data: {
                          roleId: '${roleId}',
                          orgIds: '${orgIds|split}',
                          alarmTypes: '${alarmTypes|split}',
                        },
                      },
                      title: '',
                      mode: 'horizontal',
                      body: [
                        {
                          type: 'select',
                          name: 'roleId',
                          label: '角色',
                          source: '${roleList}',
                          labelField: 'roleName',
                          valueField: 'id',
                          required: true,
                        },
                        {
                          type: 'tree-select',
                          label: '部门',
                          name: 'orgIds',
                          clearable: true,
                          required: true,
                          source: '${depart}',
                          id: 'u:55846cf005a2',
                          placeholder: '请选择部门',
                          searchable: true,
                          hideNodePathLabel: true,
                          multiple: true,
                          enableNodePath: false,
                          showIcon: true,
                          initiallyOpen: true,
                          cascade: true,
                          labelField: 'orgName',
                          valueField: 'id',
                        },
                        {
                          type: 'checkboxes',
                          name: 'alarmTypes',
                          label: '数据类型',
                          required: true,
                          source: '${typeList}',
                          labelField: 'alarmTypeName',
                          valueField: 'alarmType',
                        },
                      ],
                    },
                  ],
                  showCloseButton: true,
                  showErrorMsg: false,
                  showLoading: false,
                  id: 'u:f513da49400e',
                  closeOnEsc: true,
                  dataMapSwitch: false,
                },
                id: 'u:119c1c51d20c',
                level: 'success',
              },
            ],
          },
        ],
        id: 'u:052aecbf1622',
        actions: [],
        wrapWithPanel: false,
        mode: 'inline',
        reload: 'crud',
      },
      perPageAvailable: [10, 20, 50],
      messages: {},
      alwaysShowPagination: true,
      initFetch: true,
      pageField: 'currentPage',
      perPageField: 'pageSize',
      defaultParams: {
        currentPage: 1,
        pageSize: 10,
      },
      headerToolbar: [],
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
    },
  ],
  id: 'u:b994f0f68edf',
  pullRefresh: {
    disabled: true,
  },
  regions: ['body'],
};

const DataAuth = () => {
  const [departData, setDepartData] = useState<Array<DepartmentType>>([]);

  const [rolesId, setRolesId] = useState<Array<IRoleType>>();
  const [typeList, setTypeList] = useState<IAlarmType[]>([]);
  //获取角色id
  const getRole = useMemoizedFn(async () => {
    const { code, data } = await request<IPageData<Array<IRoleType>>>({
      url: `/ms-system/role/list/page?pageIndex=1&pageSize=100&isEnable=1`,
    });
    if (code == 200) {
      setRolesId(data.records as unknown as Array<IRoleType>);
    }
  });
  // 查询报警类型
  const getAlarmType = useMemoizedFn(async () => {
    const { code, data } = await request<IAlarmType[]>({
      url: `/cx-alarm/alm/alarm-type/list`,
    });
    if (code == 200) {
      setTypeList(data);
    }
  });

  //请求部门数据
  const getDepartmentData = useMemoizedFn(async () => {
    const { data, code } = await request({
      url: `/ms-system/user/list-org-tree`,
      options: {
        method: 'GET',
      },
    });
    if (code == 200) {
      setDepartData(data as unknown as Array<DepartmentType>);
    }
  });

  useMount(() => {
    getDepartmentData();
    getRole();
    getAlarmType();
  });

  return (
    <Box h={'full'}>
      <AimsRender
        jsonView={data}
        props={{ depart: departData, roleList: rolesId, typeList: typeList }}
      />
    </Box>
  );
};

export default DataAuth;
