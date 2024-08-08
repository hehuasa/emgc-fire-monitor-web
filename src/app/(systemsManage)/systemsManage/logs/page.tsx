'use client';
import { systemTagModal, tagMap } from '@/models/system';
import { request } from '@/utils/request';
import { Box } from '@chakra-ui/react';
import { useMemoizedFn, useMount } from 'ahooks';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';

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
        url: '/systemsManage/logs/api/logPage',
        messages: {},
        replaceData: true,
        dataType: 'json',
        data: {
          pageIndex: '$current',
          pageSize: '$size',
          entityName: '${entityName|default}',
          // system: '${system|default}',
          startTime: '${dateTime|split|first|default}',
          endTime: '${dateTime|split|last|default}',
          entityType: '${entityType|default}',
        },
      },
      columns: [
        {
          name: 'index',
          label: '序号',
          type: 'text',
          id: 'u:c2fdef852ace',
        },
        {
          type: 'text',
          label: '操作者',
          name: 'username',
          id: 'u:9d355bcf0f19',
        },
        {
          type: 'static',
          label: '日志内容',
          id: 'u:d989337f90ee',
          name: 'entityName',
        },
        {
          type: 'text',
          label: '所属服务',
          name: 'system',
          id: 'u:a329cb0c0051',
        },
        {
          type: 'mapping',
          label: '所属模块',
          id: 'u:d989337f90ee',
          name: 'entityType',
          source: '${entityTypeList}',
        },
        {
          type: 'mapping',
          label: '操作状态',
          id: 'u:d989337f902121e',
          name: 'actionStatus',
          map: {
            SUCCESS: '成功',
            FAILE: '失败',
          },
        },
        {
          type: 'mapping',
          map: {
            INSERT: '插入',
            DELETE: '删除',
            UPDATE: '更新',
          },
          label: '操作类型',
          name: 'actionType',
          id: 'u:a329cb0c2693',
        },

        {
          type: 'text',
          label: 'IP',
          name: 'ip',
          id: 'u:a329cb0c2693',
        },
        {
          type: 'text',
          label: '操作系统',
          name: 'os',
          id: 'u:a329cb0c2693',
        },
        {
          type: 'text',
          label: '浏览器',
          name: 'client',
          id: 'u:a329cb0c2693',
        },
        {
          type: 'text',
          label: '操作时间',
          name: 'createdTime',
          id: 'u:c50e2d6d75e5',
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
            mode: 'inline',
            target: 'crud?entityName=${keywords}&dateTime=${dateTime}&entityType=${entityType}',
            body: [
              {
                type: 'input-text',
                name: 'keywords',
                label: '日志内容',
                id: 'u:51edadc81cbb',
                clearable: true,
                remark: '',
                placeholder: '请根据日志内容查询',
                mode: 'inline',
                horizontal: {
                  left: 1,
                  right: 11,
                },
              },
              // {
              //   type: 'select',
              //   label: '所属服务',
              //   name: 'system',
              //   clearable: true,
              //   source: '${systemList}',
              //   id: 'u:55846cf005a2',
              //   placeholder: '请选择所属服务查询',
              //   labelClassName: 'm-l',
              //   inputClassName: 'w',
              //   hideNodePathLabel: true,
              //   multiple: false,
              //   enableNodePath: false,
              //   showIcon: true,
              //   labelField: 'systemName',
              //   valueField: 'system',
              // },
              {
                type: 'select',
                label: '所属模块',
                id: 'u:d989337f213e',
                clearable: true,
                placeholder: '请选择所属模块查询',
                source: '${entityTypeList}',
                name: 'entityType',
                labelClassName: 'm-l',
                inputClassName: 'w',
                hideNodePathLabel: true,
                multiple: false,
                enableNodePath: false,
                showIcon: true,
              },
              {
                type: 'input-datetime-range',
                name: 'dateTime',
                label: '操作时间',
                format: 'YYYY-MM-DD HH:mm:ss',
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
        mode: 'line',
        horizontal: {
          leftFixed: 'normal',
        },
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
    },
  ],
  id: 'u:a5652b0c6352',
};

const Logs = () => {
  const [entityType, setEntityType] = useState<Array<{ label: string; value: string }>>();
  const [systemList, setSystenList] = useState<Array<{ system: string; systemName: string }>>();
  const moduleTag = useRecoilValue(systemTagModal);
  const getEntityType = useMemoizedFn(async () => {
    const { code, data } = await request<Array<{ label: string; type: string }>>({
      url: `/ms-system/sys_audit_log/entity_type`,
    });
    if (code === 200 && data) {
      const obj: { [k: string]: string } = {};
      const arr: Array<{ label: string; value: string }> = [];
      data.forEach((v, index) => {
        // obj[v.type] = v.label;
        arr.push({
          label: v.label,
          value: v.type,
        });
      });

      setEntityType(arr);
    }
  });

  const getTagList = async () => {
    const { code, data } = await request({
      url: `/ms-system/business_data/tag`,
    });
    if (code == 200) {
      const tagMap: Array<{ system: string; systemName: string }> = [];
      Object.entries(data as Map<string, tagMap>).forEach(([key, value]) => {
        console.log('key,value', key, value);
        tagMap.push({
          systemName: value.systemName,
          system: key,
        });
      });
      setSystenList(tagMap);
    }
  };
  useMount(() => {
    getEntityType();
    getTagList();
    console.log('moduleTag', moduleTag);
  });

  return (
    <Box h={'full'}>
      <AimsRender jsonView={data} props={{ entityTypeList: entityType, systemList: systemList }} />
    </Box>
  );
};

export default Logs;
