'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import { Box, useToast } from '@chakra-ui/react';
import { DCItem, IDepartment } from '@/models/system';
import { useMemoizedFn, useMount, useSafeState } from 'ahooks';
import { request } from '@/utils/request';
import { getFileNameByUrl, downFileByUrl } from '@/utils/util';
import { Text } from '@chakra-ui/react';

const AimsRender = dynamic(() => import('@/components/AimsRender'), { ssr: false });

const TextPlan = (props: any) => {
  const toast = useToast();
  const filePath = props?.data?.filePath;
  const down = useMemoizedFn(() => {
    downFileByUrl(filePath).catch(() =>
      toast({
        title: '下载失败',
        status: 'error',
        position: 'top',
        duration: 2000,
        isClosable: true,
      })
    );
  });
  if (filePath) {
    return (
      <td>
        <Text onClick={down} cursor="pointer" color="pri.blue.100">
          {getFileNameByUrl(filePath)}
        </Text>
      </td>
    );
  }

  return <td></td>;
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
        method: 'POST',
        url: '/cx-scws/plan_text_info/page',
        dataType: 'form',
        messages: {},

        data: {
          current: '${pageNumber}',
          size: '${pageSize}',
          planName: '${planName_search}',
          deptId: '${deptId_search}',
        },
        replaceData: true,
      },
      columns: [
        {
          type: 'text',
          label: '预案名称',
          name: 'planName',
        },

        {
          type: 'text',
          label: '预案编号',
          name: 'planNo',
        },
        {
          type: 'text',
          label: '预案类别',
          name: 'planType',
          id: 'u:481a599b0c34',
        },
        {
          type: 'text',
          label: '当前版本',
          name: 'planVersion',
        },
        {
          type: 'text',
          label: '修订次数',
          name: 'updateTimes',
        },
        {
          type: 'custom',
          label: '文本预案',
          component: TextPlan,
        },
        {
          type: 'text',
          label: '发布日期',
          name: 'planTime',
        },
        {
          type: 'text',
          label: '最新修订日期',
          name: 'updateDate',
        },
        {
          label: '是否备案',
          name: 'records',
          type: 'mapping',
          map: {
            '1': '是',
            '0': '否',
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
              id: 'u:4cf9dae5d4ce',
              level: 'enhance',
              dialog: {
                type: 'dialog',
                title: '编辑预案',
                size: 'md',
                body: [
                  {
                    type: 'my-plan-add',
                    name: 'planValue',
                    planTypeList: '${planTypeList}',
                    edit: true,
                  },
                ],
                showCloseButton: true,
                showErrorMsg: false,
                showLoading: false,
                id: 'u:f513da49400e',
                closeOnEsc: true,
                dataMapSwitch: false,
                actions: [],
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
                                            url: '/cx-scws/plan_text_info/delete',
                                            method: 'get',
                                            dataType: 'form',
                                            data: {
                                              id: '${id}',
                                            },
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
      perPageField: 'pageSize',
      pageField: 'pageNumber',
      defaultParams: {
        pageNumber: 1,
        pageSize: 10,
      },
      filter: {
        title: '查询条件',
        body: [
          {
            type: 'form',
            title: '查询条件',

            body: [
              {
                name: 'planName_search',
                type: 'input-text',
                label: '预案名称',
                id: 'u:5d7fe78661f6',
                className: 'm-l',
                inputClassName: 'w',
                placeholder: '请输入预案名称',
                clearable: true,
              },
              {
                name: 'deptId_search',
                type: 'tree-select',
                label: '部门',
                id: 'u:5d7fe78661f6',
                className: 'm-l',
                inputClassName: 'w',
                placeholder: '请选择部门',
                clearable: true,
                source: '${depTree}',
              },
            ],
            mode: 'inline',
            id: 'u:c4ad86e24b0a',
            rules: [],
            actions: [
              {
                type: 'button',
                label: '查询',
                id: 'u:57d6dfdfb28b',
                level: 'primary',
                onEvent: {
                  click: {
                    actions: [
                      {
                        componentId: 'u:c8b1fa56558e',
                        groupType: 'component',
                        actionType: 'reload',
                        outputVar: 'responseResult',
                      },
                    ],
                  },
                },
              },
              {
                type: 'button',
                label: '新增',
                actionType: 'dialog',
                dialog: {
                  type: 'dialog',
                  title: '新增预案',
                  size: 'md',
                  body: [
                    {
                      type: 'my-plan-add',
                      name: 'planValue',
                      planTypeList: '${planTypeList}',
                      edit: false,
                    },
                  ],
                  showCloseButton: true,
                  showErrorMsg: false,
                  showLoading: false,
                  id: 'u:f513da49400e',
                  closeOnEsc: true,
                  dataMapSwitch: false,
                  actions: [],
                },
                id: 'u:119c1c51d20c',
                level: 'success',
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

interface ITree {
  label: string;
  value: string;
  children?: ITree[];
}

const Plan = () => {
  const [planTypeList, setPlanTypeList] = useSafeState<DCItem[]>([
    {
      cnName: '综合预案',
      defaulted: null,
      dictCode: '',
      enName: null,
      icon: null,
      id: '',
      remark: null,
      sort: 1,
      status: 0,
      value: '综合预案',
    },
    {
      cnName: '专项预案',
      defaulted: null,
      dictCode: '',
      enName: null,
      icon: null,
      id: '',
      remark: null,
      sort: 1,
      status: 0,
      value: '专项预案',
    },
    {
      cnName: '现在处置预案',
      defaulted: null,
      dictCode: '',
      enName: null,
      icon: null,
      id: '',
      remark: null,
      sort: 1,
      status: 0,
      value: '现在处置预案',
    },
  ]);
  const [depTree, setDepTree] = useSafeState<ITree[]>([]);
  useMount(() => {
    //getPlanTypeList();
    getDepartment();
  });
  const getPlanTypeList = useMemoizedFn(async () => {
    const res = await request<DCItem[]>({
      url: '/cx-alarm/dc_dict/list_item?dictCode=alarm_level',
    });
    if (res.code === 200) {
      setPlanTypeList(res.data);
    }
  });
  //获取部门
  const getDepartment = useMemoizedFn(async () => {
    const res = await request<IDepartment[]>({ url: '/ms-system/org/list-org-tree' });

    if (res.code === 200) {
      const fn = (list: IDepartment[]) => {
        const data: ITree[] = [];
        for (const item of list) {
          if (item.children && item.children.length) {
            data.push({
              label: item.orgName,
              value: item.id,
              children: fn(item.children),
            });
          } else {
            data.push({
              label: item.orgName,
              value: item.id,
            });
          }
        }
        return data;
      };

      const newData = fn(res.data);
      setDepTree(newData);
    }
  });
  console.log('planTypeListplanTypeList', planTypeList);
  return (
    <Box h={'full'}>
      <AimsRender jsonView={data} props={{ planTypeList, depTree }} />
    </Box>
  );
};

export default Plan;
