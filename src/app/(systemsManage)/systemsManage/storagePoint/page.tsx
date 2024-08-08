'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import { Box } from '@chakra-ui/react';
import { useMemoizedFn, useMount, useSafeState } from 'ahooks';
import { request } from '@/utils/request';
import { IArea } from '@/models/map';
import { IPageData } from '@/utils/publicData';
import { stringify } from 'qs';
import { CurdAdaptor, DeleteRequestAdaptor, PageBeanAdaptor } from '@/components/AmisAdaptor';
const AimsRender = dynamic(() => import('@/components/AimsRender'), { ssr: false });

const PointerName = (props: any) => {
  const emgcRepositoryGeomVoList = props.data.emgcRepositoryGeomVoList;
  const arr: string[] = [];
  emgcRepositoryGeomVoList?.forEach?.((item: { pointName: string }) => {
    arr.push(item.pointName);
  });

  return <td>{arr.join(',')}</td>;
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
        url: '/cx-scws/emgc_repository/query_page',
        messages: {},
        dataType: 'form',
        data: {
          pageNum: '${current}',
          pageSize: '${size}',

          orgId: '${orgId_search}',
        },
        adaptor: PageBeanAdaptor,
        replaceData: true,
      },
      columns: [
        {
          name: 'areaName',
          label: '区域',
          type: 'text',
        },
        {
          name: 'pointer',
          label: '存放点名称',
          component: PointerName,
        },
        {
          name: 'userName',
          label: '责任人',
          type: 'text',
        },
        {
          name: 'phoneNumber',
          label: '联系电话',
          type: 'text',
        },

        {
          type: 'operation',
          label: '操作',
          buttons: [
            {
              type: 'button',
              actionType: 'dialog',
              label: '编辑',
              primary: true,
              dialog: {
                type: 'dialog',
                title: '编辑',
                size: 'md',
                body: [
                  {
                    type: 'storagePoint',
                    name: 'thresholdValue',
                    edit: true,
                    areaId: '${areaId}',
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
              api: {
                method: 'get',
                url: '/cx-scws/emgc_repository/delete_by_id?id=${id}',

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
            target: 'crud?orgId_search=${orgId_search}',
            body: [
              {
                type: 'tree-select',
                label: '部门',
                name: 'orgId_search',
                clearable: false,
                id: 'u:86b978b87c2e',
                multiple: false,
                enableNodePath: false,
                showIcon: false,
                initiallyOpen: true,
                className: 'm-l',
                inputClassName: 'w',
                placeholder: '请选择部门',
                source: {
                  url: '/ms-system/org/list-org-tree',
                  method: 'get',
                },
                labelField: 'orgName',
                valueField: 'id',
                hideNodePathLabel: true,
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
                primary: true,
                dialog: {
                  type: 'dialog',
                  title: '新增',
                  size: 'md',
                  body: [
                    {
                      type: 'storagePoint',
                      name: 'thresholdValue',
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
  const [areaList, setAreaList] = useSafeState<IArea[]>([]);
  //获取区域
  const getArea = useMemoizedFn(async () => {
    const obj = {
      size: 1000,
    };

    const res = await request<IPageData<IArea>>({
      url: `/cx-alarm/dc/area/page?${stringify(obj)}`,
    });
    if (res.code === 200) {
      setAreaList(res.data.records);
    }
  });

  useMount(() => {
    getArea();
  });
  return (
    <Box h={'full'}>
      <AimsRender jsonView={data} props={{ areaList }} />
    </Box>
  );
};

export default Page;
