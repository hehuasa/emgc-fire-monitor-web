'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import { Box } from '@chakra-ui/react';

const AimsRender = dynamic(() => import('@/components/AimsRender'), { ssr: false });

const data = {
  type: 'page',
  regions: ['body'],
  body: [
    {
      type: 'crud',
      name: 'crud',
      syncLocation: false,
      autoFillHeight: true,
      api: {
        method: 'post',
        url: '/systemsManage/loginLogs/api/getLogs',
        messages: {},
        replaceData: true,
        dataType: 'json',
        data: {
          pageIndex: '$current',
          pageSize: '$size',
          userName: '${userName|default}',
        },
      },
      columns: [
        {
          name: 'index',
          label: '序号',
          id: 'u:c2fdef852ace',
          tpl: '${index + 1}',
          type: 'tpl',
        },
        {
          type: 'text',
          label: '登录类型',
          name: 'clientType',
          id: 'u:9d355bcf0f19',
        },
        {
          type: 'static',
          label: '登录账号',
          id: 'u:d989337f90ee',
          name: 'loginAccount',
        },
        {
          type: 'text',
          label: '登录时间',
          name: 'loginTime',
          id: 'u:a329cb0c2693',
        },
        {
          type: 'text',
          label: '用户名称',
          name: 'userName',
          id: 'u:a329cb0c2693',
        },
      ],
      bulkActions: [],
      itemActions: [],
      features: ['filter'],
      filterColumnCount: 3,
      id: 'u:3b9ae99790e9',
      perPageAvailable: [10, 20, 50],
      messages: {},
      filter: {
        title: '',
        body: [
          {
            type: 'form',
            title: '查询条件',
            target: 'crud?userName=${keywords}',
            body: [
              {
                type: 'input-text',
                name: 'keywords',
                label: '',
                id: 'u:51edadc81cbb',
                clearable: true,
                remark: '',
                placeholder: '请输入关键字查询',
                horizontal: {
                  left: 1,
                  right: 11,
                },
                labelClassName: 'w-0',
                inputClassName: 'w-lg',
              },
            ],
            id: 'u:c4ad86e24b0a',
            actions: [
              {
                type: 'submit',
                label: '查询',
                id: 'u:ec887911ac2f',
                level: 'primary',
                className: 'r',
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
            ],
          },
        ],
        id: 'u:2231678bc574',
        reload: 'crud',
        submitText: '',
        mode: 'inline',
        wrapWithPanel: false,
      },
      initFetch: true,
      headerToolbar: [
        {
          type: 'filter-toggler',
          align: 'left',
        },
      ],
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
      alwaysShowPagination: true,
      pageField: 'current',
      perPageField: 'size',
      defaultParams: {
        current: 1,
        size: 10,
      },
    },
  ],
  id: 'u:a5652b0c6352',
};

const Logs = () => {
  return (
    <Box h={'full'}>
      <AimsRender jsonView={data} />
    </Box>
  );
};

export default Logs;
