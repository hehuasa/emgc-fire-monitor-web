/* eslint-disable @typescript-eslint/no-explicit-any */
import { message } from 'antd';

// import { Toast } from 'antd-mobile';

export interface IFetchOp extends RequestInit {
  name?: string; // 下载文件必填
  noheaders?: boolean;
  headers?: {
    [key: string]: string;
  };
  notoken?: boolean;
  ContentType?: boolean;
  type?: 'json' | 'form';
  clientType?: string;

  //数据返回配置
  dataReturnConfig?: {
    //是否只返回code为200的数据
    onlyReturnSuccess?: boolean;
    //code不为200的数据是否需要错误提示
    showErrorTip?: boolean;
  };
  isAppRequest?: boolean;
}
export interface IFetchParams {
  url: string;
  options?: IFetchOp;
}

export interface IResData<T = any> {
  code: number;
  msg: string;
  data: T;
  noAuth: boolean;
  status: number;
}

export interface IRecordsData<T> {
  records: T[];
  total: number;
  pages: number;
  current: number;
  size: number;
}

export interface AmisResponseType {
  status: number;
  msg: string;
  data: {
    item?: any;
    msg?: string;
    [key: string]: unknown;
  };
}

export const clientType = 'emgc_client_type';

export const appClientType = 'emgc_client_app_type';

/**
 *
 * 设置请求头
 * 流程的接口需要额外请求头
 * 所以web请求添加reqtype参数请求
 */
const setHeader = (url: string, options: any) => {
  if (!options.headers.reqType) {
    // 判断是否为移动端
    const isMobile = /Mobile|Android|iPhone/i.test(navigator.userAgent);

    options.headers.reqType = isMobile ? appClientType : clientType;
  }

  const path = location.pathname;
  if (!path.includes('/system/process')) {
    return;
  }
  const Tenant_Id = localStorage.getItem('tenant_id');
  const System_Sign = localStorage.getItem('system_sign');
  const isLoginApi = url.includes('/ms-system/login/login');
  if (!isLoginApi && Tenant_Id && Tenant_Id !== 'null' && Tenant_Id !== 'undefined') {
    options.headers['tenant-id'] = Tenant_Id;
  }

  if (System_Sign && System_Sign !== 'null' && System_Sign !== 'undefined') {
    options.headers['system-sign'] = System_Sign;
  }
};

const appSetHeader = (options: IFetchOp) => {
  if (options.headers) {
    options.headers.reqType = appClientType;
  } else {
    options.headers = { reqType: appClientType };
  }

  options.isAppRequest = true;
};

//跳转到401页面
const go401 = () => {
  return;
  const intl = `/${localStorage.getItem('intl') || 'zh'}`;

  const newUrl =
    window.location.origin + process.env.NEXT_PUBLIC_ANALYTICS_BasePath + intl + '/NoAuth';
  window.location.href = newUrl;

  return Promise.reject();
};

/**
 *
 * @description web不分使用的接口
 *
 */
export const amisRequest = async <T>({
  url,
  options = { headers: {} },
}: IFetchParams): Promise<IResData<T> | AmisResponseType | Blob> => {
  const xtoken_ = localStorage.getItem(`x-auth-token`);

  try {
    if (!options.headers && !options.ContentType) {
      options.headers = { 'Content-type': 'application/json' };
    }
    if (!options.headers) {
      options.headers = {};
    }

    setHeader(url, options);

    Object.assign(options.headers, {
      'x-auth-token': xtoken_,
    });

    const res = await fetch(
      url.indexOf('http') === -1
        ? (process.env.NEXT_PUBLIC_ANALYTICS_BasePath as string) + url
        : url,
      options
    );
    const resToken = res.headers.get('x-auth-token');
    if (resToken) {
      localStorage.setItem(`x-auth-token`, resToken);
    }

    if (res.status === 401) {
      go401();
    }
    if (options.headers?.type === 'blob') {
      const blob = await res.blob();

      const newBlob = new Blob([blob], {
        type: 'application/pdf;chartset=UTF-8',
      });
      return Promise.resolve(newBlob);
    }

    const json = await res.json();

    if (json.status === undefined) {
      const isObj = json.data instanceof Object;
      const isArray = json.data instanceof Array;
      const obj = {
        status: json.code === 200 ? 0 : json.code,
        msg:
          json.code === 200
            ? (json.msg as string).length === 0
              ? '操作成功'
              : json.msg
            : json.msg,
        data:
          json.code === 200
            ? isObj
              ? isArray
                ? {
                    items: json.data,
                  }
                : {
                    ...json.data,
                    items: json.data.records,
                  }
              : { item: json.data }
            : false,
        dataMsg: json.data,
      };

      return Promise.resolve(obj);
    }
    if (json.data && json.data.item !== undefined && json.data.item !== 'undefined') {
      if (json.data.item === null) {
        json.data.item = '';
      }

      const isObj = json.data.item instanceof Object && !(json.data.item instanceof Array);
      const obj = {
        status: json.status,
        msg: json.msg,
        data: isObj
          ? {
              ...json.data.item,
            }
          : { item: json.data.item, msg: json.msg },
      };

      return Promise.resolve(obj);
      // return obj as any;
    }

    return json;
  } catch (error) {
    return Promise.reject(false);
  }
};

export const aimsRequestDownload = async ({
  url,
  options = { headers: {} },
}: IFetchParams): Promise<any> => {
  const xtoken_ = localStorage.getItem(`x-auth-token`);

  if (!options.headers) {
    options.headers = {};
  }

  if (options.method === 'post') {
    options.headers = { 'content-type': 'application/json' };
  }

  if (options.headers.name) {
    delete options.headers.name;
  }
  if (xtoken_) {
    options.headers['x-auth-token'] = xtoken_;
  }

  setHeader(url, options);

  const res = await fetch(
    url.indexOf('http') === -1 ? (process.env.NEXT_PUBLIC_ANALYTICS_BasePath as string) + url : url,
    options
  );

  const resToken = res.headers.get('x-auth-token');
  if (resToken) {
    localStorage.setItem(`x-auth-token`, resToken);
  }

  if (res.status === 401) {
    go401();
  }

  if (res.status === 200) {
    const blob = await res.blob();
    if (options.name) {
      const a = document.createElement('a');
      // 通过 blob 对象获取对应的 url
      const url_ = window.URL.createObjectURL(blob);

      a.href = url_;
      a.download = options.name;
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url_);
    }
    return {
      status: 0,
      data: {},
      msg: '下载成功',
    };
  } else {
    return {
      status: res.status,
      data: {},
      msg: '下载失败',
    };
  }
};

export const request = async <T>({
  url,
  options = { headers: {} },
}: IFetchParams): Promise<IResData<T>> => {
  const xtoken_ = localStorage.getItem(`x-auth-token`);

  const { dataReturnConfig, isAppRequest } = options;

  try {
    if (!options.headers) {
      options.headers = {};
    }

    if (!options.headers['Content-type'] && !options.headers['content-type']) {
      if (!(options.body instanceof FormData)) {
        // options.headers = { 'Content-type': 'application/json' };
        options.headers['Content-type'] = 'application/json';
      }
    }
    setHeader(url, options);
    Object.assign(options.headers, {
      'x-auth-token': xtoken_,
    });

    const res = await fetch(
      url.indexOf('http') === -1
        ? (process.env.NEXT_PUBLIC_ANALYTICS_BasePath as string) + url
        : url,
      options
    );
    const resToken = res.headers.get('x-auth-token');

    if (resToken) {
      localStorage.setItem(`x-auth-token`, resToken);
    }

    if (res.status === 401) {
      go401();
    }

    const json = (await res.json()) as IResData;

    if (dataReturnConfig && dataReturnConfig.onlyReturnSuccess) {
      if (json.code === 200) {
        return json;
      } else {
        if (dataReturnConfig.showErrorTip) {
          if (isAppRequest) {
            // Toast.show({ content: json.msg });
          } else {
            message.error(json.msg);
          }
        }
        return Promise.reject(json.msg);
      }
    }

    return json;
  } catch (error) {
    return Promise.reject(false);
  }
};

/**
 * @description app部分的接口 需要不同的reqType
 * @description 重新设置app的 appClientType
 */
export const appRequest = async <T>({
  url,
  options = { headers: {} },
}: IFetchParams): Promise<IResData<T>> => {
  appSetHeader(options);

  return request({ url, options });
};

export const downloadRequest = async ({
  url,
  options = { headers: {} },
}: IFetchParams): Promise<any> => {
  const xtoken_ = localStorage.getItem(`x-auth-token`);

  try {
    if (!options.headers) {
      options.headers = {};
    }

    if (!options.headers['Content-type'] && !options.headers['content-type']) {
      if (!(options.body instanceof FormData)) {
        // options.headers = { 'Content-type': 'application/json' };
        options.headers['Content-type'] = 'application/json';
      }
    }
    setHeader(url, options);
    Object.assign(options.headers, {
      'x-auth-token': xtoken_,
      reqType: clientType,
    });
    const res = await fetch(
      url.indexOf('http') === -1
        ? (process.env.NEXT_PUBLIC_ANALYTICS_BasePath as string) + url
        : url,
      options
    );
    const resToken = res.headers.get('x-auth-token');
    if (resToken) {
      localStorage.setItem(`x-auth-token`, resToken);
    }

    if (res.status === 401) {
      go401();
    }

    if (res.status === 200) {
      const blob = await res.blob();
      if (options.name) {
        const a = document.createElement('a');
        // 通过 blob 对象获取对应的 url
        const url_ = window.URL.createObjectURL(blob);

        a.href = url_;
        a.download = options.name;
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url_);
      }
      return {
        status: 0,
        msg: '下载成功',
        data: {},
      };
    } else {
      return {
        status: res.status,
        msg: '下载失败',
        data: {},
      };
    }
  } catch (error) {
    return Promise.reject(false);
  }
};
