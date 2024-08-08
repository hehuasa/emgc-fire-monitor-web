import { ArrayToTree } from '@/utils/util';

interface responseBodyPageBeanType {
  size: number;
  total: number;
  records: Array<unknown>;
  current: number;
}

interface responseType {
  code: number;
  data: unknown;
  msg: string;
  status?: number;
}

interface pageBeanResponse extends responseType {
  data: responseBodyPageBeanType;
}
interface ListResponse extends responseType {
  data: Array<unknown>;
}

interface apiType {
  body: unknown;
  config: object;
  data: string;
  dataType: string;
  headers: object;
  messages: {
    success: string;
    failed: string;
  };
  method: 'get' | 'post' | 'put' | 'delete';
  replaceData: boolean;
  url: string;
}

// 分页适配器
export const PageBeanAdaptor = (
  responseBody: responseBodyPageBeanType,
  response: pageBeanResponse,
  api: apiType
) => {
  return {
    msg: response.code === 200 ? '' : response.msg,
    status: response.code === 200 ? 0 : response.code,
    data: {
      items: response.data ? response.data.records : [],
      total: response.data ? response.data.total : 0,
    },
  };
};
// list适配器
export const ListAdaptor = (responseBody: Array<unknown>, response: ListResponse, api: apiType) => {
  return {
    msg: response.code === 200 ? '' : response.msg,
    status: response.code === 200 ? 0 : response.code,
    data: {
      items: response.data ? response.data : [],
    },
  };
};

// 数组转为树 的list适配器
export const ArrayToTreeListAdaptor = (
  responseBody: Array<unknown>,
  response: ListResponse,
  api: apiType
) => {
  const resData = ArrayToTree(response.data, '0');
  return {
    msg: response.code === 200 ? '' : response.msg,
    status: response.code === 200 ? 0 : response.code,
    data: {
      items: resData?.children ? resData.children : [],
    },
  };
};

// 增删改适配器
export const CurdAdaptor = (responseBody: unknown, response: ListResponse, api: apiType) => {
  console.log('CurdAdaptor', responseBody, response, api);

  return {
    msg: response.code === 200 ? api.messages.success : response.msg,
    status: response.code === 200 ? 0 : response.code,
    data: {
      responseMsg: response.msg,
      responseData: response.data === null ? 'true' : 'false',
    },
  };
};

// 请求适配器(目前只用于删除)
export const DeleteRequestAdaptor = (api: apiType) => {
  console.log('DeleteRequestAdaptor', api);

  return {
    ...api,
    config: {
      ...api.config,
      method: api.method,
    },
  };
};
