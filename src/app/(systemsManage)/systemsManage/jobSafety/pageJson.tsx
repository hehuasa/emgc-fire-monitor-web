'use client';
import UploadBtn from '@/components/Upload/uploadBtn';
import { IArea } from '@/models/map';
import { DCItem } from '@/models/system';
import { DepartmentType } from '@/models/userManage';
import { request } from '@/utils/request';
import { Button } from '@chakra-ui/react';
import { useMemoizedFn, useMount } from 'ahooks';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const AimsRender = dynamic(() => import('@/components/AimsRender'), { ssr: false });

const UploadComponent = (props: any) => {
  const reload = useMemoizedFn(() => {
    props.onAction(null, { actionType: 'reload', target: 'crud' });
  });

  return (
    <UploadBtn action={props.url} onSuccess={reload}>
      <Button
        w="20"
        h="8"
        mx={2}
        color="pri.white.100"
        fontWeight="normal"
        borderRadius="4px"
        fontSize="14px"
        bg={'#2468f2'}
      >
        上传
      </Button>
    </UploadBtn>
  );
};

// {
//   url: '/cx-alarm/prod/jobPlan/importExcel',
//   component: UploadComponent,
// },

const data = {
  type: 'page',
  body: [
    {
      type: 'crud',
      name: 'crud',
      syncLocation: false,
      api: {
        method: 'get',
        url: '/cx-alarm/prod/jobPlan/findPage?deptId=${currentDepId}',
        messages: {},
        dataType: 'form',
        data: {
          current: '${current}',
          size: '${size}',
          jobType: '${jobTypeName_search|default}',
        },
        replaceData: true,
      },
      perPageField: 'size',
      pageField: 'current',
      defaultParams: {
        current: 1,
        size: 10,
      },
      alwaysShowPagination: true,
      autoFillHeight: true,
      columns: [
        {
          name: 'id',
          label: '序号',
          type: 'tpl',
          tpl: '${(current - 1) * size + index +1}',
          id: 'u:bd428a4f7b15',
        },
        {
          name: 'planStartTime',
          label: '计划开始时间',
          type: 'text',
          id: 'u:3f456e9083c8',
        },
        {
          type: 'text',
          label: '计划结束时间',
          name: 'planEndTime',
          id: 'u:1c9c312e426c',
        },
        {
          type: 'text',
          name: 'constructionUnit',
          label: '施工单位',
          id: 'u:18daf3765bba',
        },
        {
          type: 'text',
          name: 'jobContent',
          label: '作业内容',
          id: 'u:e3c06c990915',
        },
        {
          type: 'text',
          name: 'jobTypeText',
          label: '作业类型',
          id: 'u:a739bce384fa',
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
                size: 'md',
                body: [
                  {
                    type: 'form',
                    labelWidth: 120,
                    mode: 'inline',
                    api: {
                      url: '/cx-alarm/prod/jobPlan/update/${id}',
                      method: 'put',
                      dataType: 'json',
                      data: {
                        '&': '$$',
                        deptId: '${currentDepId}',
                      },
                      messages: {
                        success: '编辑成功',
                      },
                      requestAdaptor: '',
                      adaptor:
                        'return {\r\n  msg: response.code === 200 ? api.messages.success : response.msg,\r\n  status: response.code === 200 ? 0 : response.code,\r\n  data: {\r\n    responseMsg: response.msg,\r\n  },\r\n};',
                    },
                    body: [
                      {
                        name: 'jobType',
                        type: 'select',
                        label: '作业类型',
                        id: 'u:b9442395c2c6',
                        placeholder: '请选择作业类型',
                        required: true,
                        validateOnChange: false,
                        source: '${jobTypeList}',
                        labelField: 'cnName',
                        valueField: 'value',
                        labelClassName: 'm-l',
                        inputClassName: 'w',
                        multiple: false,
                        mode: 'horizontal',
                        horizontal: {
                          leftFixed: 'normal',
                        },
                        labelAlign: 'left',
                      },
                      {
                        label: '计划开始时间',
                        type: 'input-datetime',
                        name: 'planStartTime',
                        id: 'u:7c17e477ad7c',
                        embed: false,
                        inputFormat: 'YYYY-MM-DD HH:mm:ss',
                        placeholder: '请选择日期以及时间',
                        format: 'YYYY-MM-DD HH:mm:ss',
                        required: true,
                        validateOnChange: false,
                        labelClassName: 'm-l',
                        inputClassName: 'w',
                      },
                      {
                        type: 'input-datetime',
                        label: '计划结束时间',
                        name: 'planEndTime',
                        id: 'u:d36247ac6237',
                        embed: false,
                        inputFormat: 'YYYY-MM-DD HH:mm:ss',
                        placeholder: '请选择日期以及时间',
                        format: 'YYYY-MM-DD HH:mm:ss',
                        required: true,
                        validateOnChange: false,
                        labelClassName: 'm-l',
                        inputClassName: 'w',
                      },
                      {
                        type: 'input-text',
                        name: 'jobTask',
                        label: '作业任务',
                        id: 'u:ef943d2bce1f',
                        placeholder: '请输入作业任务',
                        required: true,
                        validateOnChange: false,
                        labelClassName: 'm-l',
                        inputClassName: 'w',
                      },
                      {
                        type: 'input-text',
                        name: 'jobContent',
                        label: '作业内容',
                        id: 'u:jobContent',
                        placeholder: '请输入作业内容',
                        required: true,
                        validateOnChange: false,
                        labelClassName: 'm-l',
                        inputClassName: 'w',
                      },
                      {
                        type: 'input-text',
                        name: 'jobAddress',
                        label: '作业地点',
                        id: 'u:jobAddress',
                        placeholder: '请输入作业地点',
                        required: true,
                        validateOnChange: false,
                        labelClassName: 'm-l',
                        inputClassName: 'w',
                      },
                      {
                        name: 'jobAreaId',
                        type: 'select',
                        label: '作业区域',
                        id: 'u:e864ba0228a1',
                        placeholder: '请选择作业类型',
                        validateOnChange: false,
                        source: {
                          method: 'get',
                          url: '/cx-alarm/dc/area/findAll',
                          requestAdaptor: '',
                          adaptor: '',
                          messages: {},
                          dataType: 'form',
                        },
                        labelField: 'areaName',
                        valueField: 'areaId',
                        labelClassName: 'm-l',
                        inputClassName: 'w',
                        multiple: false,
                      },
                      {
                        type: 'input-text',
                        name: 'riskFactors',
                        label: '主要风险因素',
                        id: 'u:riskFactors',
                        placeholder: '请输入主要风险因素',
                        validateOnChange: false,
                        labelClassName: 'm-l',
                        inputClassName: 'w',
                      },
                      {
                        type: 'input-text',
                        name: 'controlMeasures',
                        label: '对应管控措施',
                        id: 'u:controlMeasures',
                        placeholder: '请输入对应管控措施',
                        validateOnChange: false,
                        labelClassName: 'm-l',
                        inputClassName: 'w',
                      },
                      {
                        type: 'input-text',
                        name: 'specialPlan',
                        label: '是否按要求制定专项方案',
                        id: 'u:specialPlan',
                        placeholder: '请输入是否按要求制定专项方案',
                        validateOnChange: false,
                        labelClassName: 'm-l',
                        inputClassName: 'w',
                      },
                      {
                        type: 'input-text',
                        name: 'constructionUnit',
                        label: '施工单位',
                        id: 'u:constructionUnit',
                        placeholder: '请输入施工单位',
                        validateOnChange: false,
                        labelClassName: 'm-l',
                        inputClassName: 'w',
                      },
                      {
                        type: 'input-text',
                        name: 'approver',
                        label: '审批人',
                        id: 'u:approver',
                        placeholder: '请输入审批人',
                        validateOnChange: false,
                        labelClassName: 'm-l',
                        inputClassName: 'w',
                      },
                      {
                        type: 'input-text',
                        name: 'guardian',
                        label: '监护人',
                        id: 'u:guardian',
                        placeholder: '请输入监护人',
                        validateOnChange: false,
                        labelClassName: 'm-l',
                        inputClassName: 'w',
                      },
                      {
                        type: 'input-text',
                        name: 'videoSurveillance',
                        label: '视频监护',
                        id: 'u:videoSurveillance',
                        placeholder: '请输入视频监护',
                        validateOnChange: false,
                        labelClassName: 'm-l',
                        inputClassName: 'w',
                      },
                      {
                        type: 'input-text',
                        name: 'dailyShiftLeader',
                        label: '日常带班',
                        id: 'u:dailyShiftLeader',
                        placeholder: '请输入日常带班',
                        validateOnChange: false,
                        labelClassName: 'm-l',
                        inputClassName: 'w',
                      },
                      {
                        type: 'input-text',
                        name: 'twoShiftLeader',
                        label: '两特两重带班',
                        id: 'u:twoShiftLeader',
                        placeholder: '请输入两特两重带班',
                        validateOnChange: false,
                        labelClassName: 'm-l',
                        inputClassName: 'w',
                      },
                      {
                        type: 'input-text',
                        name: 'filledBy',
                        label: '填表人',
                        id: 'u:filledBy',
                        placeholder: '请输入填表人',
                        validateOnChange: false,
                        labelClassName: 'm-l',
                        inputClassName: 'w',
                      },
                    ],
                    id: 'u:7c66867f6014',
                    actions: [
                      {
                        type: 'submit',
                        label: '提交',
                        primary: true,
                      },
                    ],
                    feat: 'Insert',
                    dsType: 'api',
                  },
                ],
                id: 'u:d76c7775a777',
                actions: [
                  {
                    type: 'button',
                    actionType: 'cancel',
                    label: '取消',
                    id: 'u:d2e28ec46ca6',
                  },
                  {
                    type: 'button',
                    actionType: 'confirm',
                    label: '确定',
                    primary: true,
                    id: 'u:02933a1b9df3',
                  },
                ],
                showCloseButton: true,
                closeOnOutside: false,
                closeOnEsc: false,
                showErrorMsg: true,
                showLoading: true,
                draggable: false,
              },
              id: 'u:7effc51da267',
            },
            {
              type: 'button',
              label: '删除',
              level: 'danger',
              api: {
                method: 'DELETE',
                url: '/cx-alarm/prod/jobPlan/delete/${id}',
                dataType: 'form',
                messages: {
                  success: '删除成功',
                },
              },
              actionType: '',
              confirmText: '',
              id: 'u:2bf04555cda7',
              onEvent: {
                click: {
                  weight: 0,
                  actions: [
                    {
                      ignoreError: false,
                      actionType: 'dialog',
                      dialog: {
                        type: 'dialog',
                        title: '系统提示',
                        body: [
                          {
                            type: 'tpl',
                            tpl: '确定要删除？',
                            wrapperComponent: '',
                            inline: false,
                            id: 'u:7c4d8601e943',
                          },
                        ],
                        showCloseButton: true,
                        showErrorMsg: true,
                        showLoading: true,
                        className: 'app-popover :AMISCSSWrapper',
                        actions: [
                          {
                            type: 'button',
                            actionType: 'cancel',
                            label: '取消',
                            id: 'u:35eed2a894fc',
                          },
                          {
                            type: 'button',
                            actionType: 'confirm',
                            label: '确认',
                            primary: true,
                            id: 'u:d6cc7d847a29',
                            onEvent: {
                              click: {
                                weight: 0,
                                actions: [
                                  {
                                    ignoreError: false,
                                    actionType: 'ajax',
                                    outputVar: 'responseResult',
                                    options: {},
                                    api: {
                                      url: '/cx-alarm/prod/jobPlan/delete/${id}',
                                      method: 'delete',
                                      requestAdaptor: '',
                                      adaptor:
                                        'return {\r\n  msg: response.code === 200 ? api.messages.success : response.msg,\r\n  status: response.code === 200 ? 0 : response.code,\r\n  data: {\r\n    responseMsg: response.msg,\r\n  },\r\n};',
                                      messages: {
                                        success: '删除成功',
                                      },
                                      dataType: 'form',
                                    },
                                  },
                                  {
                                    componentId: 'u:1edbd3430c64',
                                    groupType: 'component',
                                    actionType: 'reload',
                                  },
                                ],
                              },
                            },
                            level: 'danger',
                          },
                        ],
                        id: 'u:d3c3d9120fd4',
                      },
                    },
                  ],
                },
              },
            },
          ],
          id: 'u:a2d272b6d882',
        },
      ],
      bulkActions: [],
      itemActions: [],
      features: ['create', 'filter', 'update', 'delete'],
      filter: {
        title: '查询条件',
        body: [
          {
            type: 'select',
            name: 'jobTypeName_search',
            label: '作业类型',
            id: 'u:8dc6eb8917cd',
            placeholder: '请选择作业类型',
            className: '',
            labelClassName: 'm-l',
            inputClassName: 'w',
            clearable: true,
            source: '${jobTypeList}',
            labelField: 'cnName',
            valueField: 'value',
          },
        ],
        id: 'u:da05d02570a8',
        feat: 'Insert',
        actions: [
          {
            type: 'reset',
            label: '重置',
            id: 'u:c8b1fa56558l',
            level: 'default',
          },
          {
            type: 'submit',
            label: '搜索',
            id: 'u:11729d2c32dc',
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
              size: 'md',
              body: [
                {
                  type: 'form',
                  labelWidth: 120,
                  mode: 'inline',
                  name: 'sample-edit-form',
                  reload: 'crud',
                  api: {
                    url: '/cx-alarm/prod/jobPlan/add',
                    method: 'post',
                    dataType: 'json',
                    data: {
                      '&': '$$',
                    },
                    messages: {
                      success: '新增成功',
                    },
                    requestAdaptor: '',
                    adaptor:
                      'return {\r\n  msg: response.code === 200 ? api.messages.success : response.msg,\r\n  status: response.code === 200 ? 0 : response.code,\r\n  data: {\r\n    responseMsg: response.msg,\r\n  },\r\n};',
                  },
                  body: [
                    {
                      name: 'jobType',
                      type: 'select',
                      label: '作业类型',
                      id: 'u:8f0fef85fce5',
                      placeholder: '请选择作业类型',
                      required: true,
                      validateOnChange: false,
                      source: '${jobTypeList}',
                      labelField: 'cnName',
                      valueField: 'value',
                      labelClassName: 'm-l',
                      inputClassName: 'w',
                      multiple: false,
                      mode: 'horizontal',
                      horizontal: {
                        leftFixed: 'sm',
                      },
                      labelAlign: 'left',
                    },
                    {
                      label: '计划开始时间',
                      type: 'input-datetime',
                      name: 'planStartTime',
                      id: 'u:ae057e9cd277',
                      embed: false,
                      inputFormat: 'YYYY-MM-DD HH:mm:ss',
                      placeholder: '请选择日期以及时间',
                      format: 'YYYY-MM-DD HH:mm:ss',
                      required: true,
                      validateOnChange: false,
                      labelClassName: 'm-l',
                      inputClassName: 'w',
                    },
                    {
                      type: 'input-datetime',
                      label: '计划结束时间',
                      name: 'planEndTime',
                      id: 'u:d36247ac6237',
                      embed: false,
                      inputFormat: 'YYYY-MM-DD HH:mm:ss',
                      placeholder: '请选择日期以及时间',
                      format: 'YYYY-MM-DD HH:mm:ss',
                      required: true,
                      validateOnChange: false,
                      labelClassName: 'm-l',
                      inputClassName: 'w',
                    },
                    {
                      type: 'input-text',
                      name: 'jobTask',
                      label: '作业任务',
                      id: 'u:ef943d2bce1f',
                      placeholder: '请输入作业任务',
                      required: true,
                      validateOnChange: false,
                      labelClassName: 'm-l',
                      inputClassName: 'w',
                    },
                    {
                      type: 'input-text',
                      name: 'jobContent',
                      label: '作业内容',
                      id: 'u:jobContent',
                      placeholder: '请输入作业内容',
                      required: true,
                      validateOnChange: false,
                      labelClassName: 'm-l',
                      inputClassName: 'w',
                    },
                    {
                      type: 'input-text',
                      name: 'jobAddress',
                      label: '作业地点',
                      id: 'u:jobAddress',
                      placeholder: '请输入作业地点',
                      required: true,
                      validateOnChange: false,
                      labelClassName: 'm-l',
                      inputClassName: 'w',
                    },
                    {
                      name: 'jobAreaId',
                      type: 'select',
                      label: '作业区域',
                      id: 'u:90405e880321',
                      placeholder: '请选择作业类型',
                      validateOnChange: false,
                      source: {
                        method: 'get',
                        url: '/cx-alarm/dc/area/findAll',
                        requestAdaptor: '',
                        adaptor: '',
                        messages: {},
                        dataType: 'form',
                      },
                      labelField: 'areaName',
                      valueField: 'areaId',
                      labelClassName: 'm-l',
                      inputClassName: 'w',
                      multiple: false,
                    },
                    {
                      type: 'input-text',
                      name: 'riskFactors',
                      label: '主要风险因素',
                      id: 'u:riskFactors',
                      placeholder: '请输入主要风险因素',
                      validateOnChange: false,
                      labelClassName: 'm-l',
                      inputClassName: 'w',
                    },
                    {
                      type: 'input-text',
                      name: 'controlMeasures',
                      label: '对应管控措施',
                      id: 'u:controlMeasures',
                      placeholder: '请输入对应管控措施',
                      validateOnChange: false,
                      labelClassName: 'm-l',
                      inputClassName: 'w',
                    },
                    {
                      type: 'input-text',
                      name: 'specialPlan',
                      label: '是否按要求制定专项方案',
                      id: 'u:specialPlan',
                      placeholder: '请输入是否按要求制定专项方案',
                      validateOnChange: false,
                      labelClassName: 'm-l',
                      inputClassName: 'w',
                    },
                    {
                      type: 'input-text',
                      name: 'constructionUnit',
                      label: '施工单位',
                      id: 'u:constructionUnit',
                      placeholder: '请输入施工单位',
                      validateOnChange: false,
                      labelClassName: 'm-l',
                      inputClassName: 'w',
                    },
                    {
                      type: 'input-text',
                      name: 'approver',
                      label: '审批人',
                      id: 'u:approver',
                      placeholder: '请输入审批人',
                      validateOnChange: false,
                      labelClassName: 'm-l',
                      inputClassName: 'w',
                    },
                    {
                      type: 'input-text',
                      name: 'guardian',
                      label: '监护人',
                      id: 'u:guardian',
                      placeholder: '请输入监护人',
                      validateOnChange: false,
                      labelClassName: 'm-l',
                      inputClassName: 'w',
                    },
                    {
                      type: 'input-text',
                      name: 'videoSurveillance',
                      label: '视频监护',
                      id: 'u:videoSurveillance',
                      placeholder: '请输入视频监护',
                      validateOnChange: false,
                      labelClassName: 'm-l',
                      inputClassName: 'w',
                    },
                    {
                      type: 'input-text',
                      name: 'dailyShiftLeader',
                      label: '日常带班',
                      id: 'u:dailyShiftLeader',
                      placeholder: '请输入日常带班',
                      validateOnChange: false,
                      labelClassName: 'm-l',
                      inputClassName: 'w',
                    },
                    {
                      type: 'input-text',
                      name: 'twoShiftLeader',
                      label: '两特两重带班',
                      id: 'u:twoShiftLeader',
                      placeholder: '请输入两特两重带班',
                      validateOnChange: false,
                      labelClassName: 'm-l',
                      inputClassName: 'w',
                    },
                    {
                      type: 'input-text',
                      name: 'filledBy',
                      label: '填表人',
                      id: 'u:filledBy',
                      placeholder: '请输入填表人',
                      validateOnChange: false,
                      labelClassName: 'm-l',
                      inputClassName: 'w',
                    },
                  ],
                  id: 'u:31e61d0b74d7',
                  actions: [
                    {
                      type: 'submit',
                      label: '提交',
                      primary: true,
                    },
                  ],
                  feat: 'Insert',
                  dsType: 'api',
                },
              ],
              id: 'u:1ddb3ef68c49',
              actions: [
                {
                  type: 'button',
                  actionType: 'cancel',
                  label: '取消',
                  id: 'u:523e482f18cc',
                },
                {
                  type: 'button',
                  actionType: 'confirm',
                  label: '确定',
                  primary: true,
                  id: 'u:bb4c5db76f2d',
                },
              ],
            },
            id: 'u:079d6f62d869',
          },
          {
            url: '/cx-alarm/prod/jobPlan/importExcel',
            component: UploadComponent,
          },
          {
            type: 'button',
            label: '下载模板',
            onEvent: {
              click: {
                actions: [
                  {
                    args: {},
                    api: {
                      url: '/cx-alarm/prod/jobPlan/downloadTemplate',
                      method: 'get',
                      requestAdaptor: '',
                      adaptor: '',
                      messages: {},
                      responseType: 'blob',
                      headers: {
                        name: '作业计划导入模板.xlsx',
                      },
                    },
                    actionType: 'download',
                  },
                ],
              },
            },
            id: 'u:d11a34483c72',
            level: 'enhance',
            block: false,
            icon: 'fa fa-download',
            themeCss: {
              className: {
                'padding-and-margin:default': {
                  marginLeft: '0',
                  marginTop: '',
                  marginRight: '',
                  marginBottom: '',
                },
              },
            },
            className: 'className-d11a34483c72',
            style: {
              marginLeft: '0px',
            },
          },
        ],
      },
      id: 'u:1edbd3430c64',
      perPageAvailable: [10],
      messages: {},
    },
  ],
  id: 'u:c1db4315a8e6',
  asideResizor: false,
  pullRefresh: {
    disabled: true,
  },
  regions: ['body'],
};
interface Props {
  jobTypeList: DCItem[];
  riskList: DCItem[];
  currentDepId: string;
  areaList: IArea[];
}

const PageJson = ({ currentDepId, jobTypeList, riskList, areaList }: Props) => {
  const [departData, setDepartData] = useState<Array<DepartmentType>>([]);

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
  });

  return (
    <AimsRender
      jsonView={data}
      props={{ currentDepId, jobTypeList, riskList, areaList, depart: departData }}
    />
  );
};

export default PageJson;
