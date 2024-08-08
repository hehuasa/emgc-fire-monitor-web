'use client';

import { IOritreeData } from '@/components/Montior/Tree';
import { IArea } from '@/models/map';
import { DCItem } from '@/models/system';
import { initPageData, IPageData } from '@/utils/publicData';
import { request } from '@/utils/request';
import { Box, Flex } from '@chakra-ui/react';
import { useMemoizedFn, useMount, useSafeState } from 'ahooks';
import { stringify } from 'qs';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import PageJson from './pageJson';

export interface IJobPlanItem {
  // 承包单位名称
  contractingUnit: string;
  // 施工单位
  constructionUnit: string;
  // 作业类型
  jobType: string;
  // 作业区域
  jobAreaId: string;
  // 作业内容
  jobContent: string;

  // 风险等级
  riskLevel: string;

  //监护人承包商
  guardianContractor: string;
  //监护人业主单位
  guardianOwnerUnit: string;
  // 审批人承包商
  approverContractor: string;
  //审批人业主单位
  approverOwnerUnit: string;

  //承包商现场负责人
  contractorHead: string;

  //监理/驻井监督
  supervisor: string;
  //第三方监督
  thirdSupervisor: string;
  //现场负责
  sceneHead: string;
  //远程监控
  remoteMonitor: string;
  //负责领导（较大风险需填写）
  leader: string;
  //备注（计划当日完成工作量）
  remark: string;
  //计划开始时间
  planStartTime: string;

  //计划结束时间
  planEndTime: string;

  deptId: string;
}

export interface IItemInfo extends IJobPlanItem {
  id: string;
  jobAreaName: string;
  deptName: string;
  jobTypeText: string;
  riskLevelText: string;
}

interface FormItem {
  deptId: string;
  jobType: string;
}

interface IDepartment {
  id: string;
  orgCode: string;
  orgName: string;
  parentCode: null;
  shortIndex: number;
  shortName: null;
  children?: IDepartment[];
}

interface Ikey {
  current: number;
  size: number;
  deptId: string | null;
  jobType: string | null;
}

const Page = () => {
  const pageKey = useRef<Ikey>({
    current: 1,
    deptId: null,
    jobType: null,
    size: 10,
  });
  const [loading, setLoading] = useSafeState(false);
  const [data, setData] = useSafeState<IPageData<IItemInfo>>(initPageData);
  const [depTree, setDepTree] = useSafeState<IOritreeData[]>([]);
  const [areaList, setAreaList] = useSafeState<IArea[]>([]);
  const methods = useForm<FormItem>({});

  const [riskList, setRiskList] = useSafeState<DCItem[]>([]);
  const [jobTypeList, setJobTypeList] = useSafeState<DCItem[]>([]);
  const { setValue } = methods;
  const [treeDefaultValue, setTreeDefaultValue] = useSafeState<string[]>([]);
  const [currentDepId, setCurrentDepId] = useSafeState('');
  //获取风险等级列表riskLevel
  const getRiskList = useMemoizedFn(async () => {
    const res = await request<DCItem[]>({ url: '/cx-alarm/dc_dict/list_item?dictCode=risk_level' });
    if (res.code === 200) {
      setRiskList(res.data);
    }
  });

  //获取作业类型
  const getjobTypeList = useMemoizedFn(async () => {
    const res = await request<DCItem[]>({ url: '/cx-alarm/dc_dict/list_item?dictCode=job_type' });
    if (res.code === 200) {
      setJobTypeList(res.data);
    }
  });

  //获取部门
  const getDepartment = useMemoizedFn(async () => {
    const res = await request<IDepartment[]>({ url: '/ms-system/org/list-org-tree' });

    if (res.code === 200) {
      //默认选择最外层
      if (res.data?.length) {
        const outId = res.data[0].id;
        setValue('deptId', outId);
        setTreeDefaultValue([outId]);
        setCurrentDepId(outId);
      }

      const fn = (list: IDepartment[]) => {
        const data: IOritreeData[] = [];
        for (const item of list) {
          if (item.children && item.children.length) {
            data.push({
              name: item.orgName,
              id: item.id,
              children: fn(item.children),
            });
          } else {
            data.push({
              name: item.orgName,
              id: item.id,
            });
          }
        }
        return data;
      };

      const newData = fn(res.data);
      setDepTree(newData);
    }
  });

  //获取作业计划/cx-alarm/prod/jobPlan/findPage
  const getJobPlanList = useMemoizedFn(async ({ current }: { current?: number }) => {
    if (current !== undefined) {
      pageKey.current.current = current;
    }

    const str = stringify(pageKey.current, { skipNulls: true });
    setLoading(true);
    const res = await request<IPageData<IItemInfo>>({
      url: `/cx-alarm/prod/jobPlan/findPage?${str}`,
    });
    if (res.code === 200) {
      setData(res.data);
    }
    setLoading(false);
  });

  //获取作业区域
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
    getRiskList();
    getjobTypeList();
    getDepartment();
    getJobPlanList({ current: 1 });
    getArea();
  });

  return (
    <Flex w="full" h="full">
      <Box w="full" h="full" overflow="auto">
        <PageJson
          currentDepId={currentDepId}
          jobTypeList={jobTypeList}
          riskList={riskList}
          areaList={areaList}
        />
      </Box>
    </Flex>
  );
};

export default Page;
