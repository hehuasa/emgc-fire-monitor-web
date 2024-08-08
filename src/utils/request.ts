import { ToastId, UseToastOptions } from '@chakra-ui/react';
import { Schema } from 'amis/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { dev } from './util';
export interface IFetchOp extends RequestInit {
  name?: string;
  noheaders?: boolean;
  headers?: {
    [key: string]: string;
  };
  notoken?: boolean;
  ContentType?: boolean;
  type?: 'json' | 'form';
  clientType?:
    | 'web-show'
    | 'web-video'
    | 'big-screen-show'
    | 'big-screen-command'
    | 'dpCenter-show'
    | 'dpCenter-ctrl';
}

export interface IFetchParams {
  url: string;
  options?: IFetchOp;
  token?: string;
  reqType?: string;
}

export interface IFetchParamsAmis extends IFetchParams {
  toastMsg: (options?: UseToastOptions | undefined) => ToastId;
}

export interface IResBody {
  <T>(arg: T): T;
}
export interface IResData<T> {
  code: number;
  msg: string;
  data: T;
  noAuth: string;
}

export const clientType = 'web-show';

export const request = async <T>({
  url,
  options = { headers: {} },
}: IFetchParams): Promise<IResData<T>> => {
  const xtoken_ = localStorage.getItem(
    process.env.NEXT_PUBLIC_ANALYTICS_cx_factoryType
      ? `${process.env.NEXT_PUBLIC_ANALYTICS_cx_factoryType}_token`
      : 'cx_token'
  );

  if (!options.noheaders) {
    if (!options.headers) {
      options.headers = { 'content-type': 'application/json' };
    }
    if (options.headers) {
      if (options.headers['content-type'] === undefined) {
        options.headers['content-type'] = 'application/json';
      }
    }

    if (!options.notoken && xtoken_) {
      options.headers['x-auth-token'] = xtoken_;
    }
    if (!options.headers.reqType) {
      options.headers.reqType =
        localStorage.getItem(
          process.env.NEXT_PUBLIC_ANALYTICS_cx_factoryType
            ? `${process.env.NEXT_PUBLIC_ANALYTICS_cx_factoryType}_clientType`
            : 'clientType'
        ) || clientType;
    }
    options.headers.systemCode = 'SystemSign';
  }

  // if (url === '/ms-login/token/remoteAuthLogin' || url === '/cx-scws/dp/operation/execOperate') {
  //   console.log(
  //     '%c [ 333 请求 url ]-88',
  //     'font-size:13px; background:pink; color:#bf2c9f;',
  //     url,
  //     options?.headers['x-auth-token']
  //   );
  // }

  const res = await fetch(
    url.indexOf('http') === -1 ? (process.env.NEXT_PUBLIC_ANALYTICS_BasePath as string) + url : url,
    options
  );

  // if (!res.ok && url.indexOf('cx-largescreen') != -1) {
  // 	const reqErrorLog = {
  // 		reqUrl: url,
  // 		reqMethod: options.method,
  // 		reqHeader: JSON.stringify(options.headers),
  // 		respStatus: res.status,
  // 		reqTime: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
  // 	};
  // 	console.log('reqErrorLog', reqErrorLog);
  // 	postRequest('/cx-largescreen/ct/reqErrorLog/add', reqErrorLog);
  // }

  const resToken = res.headers.get('x-auth-token');

  // if (url === '/ms-login/token/remoteAuthLogin' || url === '/cx-scws/dp/operation/execOperate') {
  //   console.log(
  //     '%c [ 333 返回 url ]-88',
  //     'font-size:13px; background:pink; color:#bf2c9f;',
  //     url,
  //     resToken
  //   );
  // }

  if (resToken) {
    localStorage.setItem(
      process.env.NEXT_PUBLIC_ANALYTICS_cx_factoryType
        ? `${process.env.NEXT_PUBLIC_ANALYTICS_cx_factoryType}_token`
        : 'cx_token',
      resToken
    );
  }

  if (res.status === 401) {
    // console.log(
    //   '%c [ 333 删除  cx_token ]-110',
    //   'font-size:13px; background:pink; color:#bf2c9f;',
    //   url
    // );
    // const error = new Error('无权限')

    // throw error
    localStorage.setItem('Auth', 'f');

    // localStorage.removeItem(
    //   process.env.NEXT_PUBLIC_ANALYTICS_cx_factoryType
    //     ? `${process.env.NEXT_PUBLIC_ANALYTICS_cx_factoryType}_token`
    //     : 'cx_token'
    // );

    sessionStorage.setItem('login', 'f');

    if (process.env.NEXT_PUBLIC_ANALYTICS_Ms_type === 'yb') {
      window.location.replace(process.env.NEXT_PUBLIC_ANALYTICS_BasePath + '/NoAuth');
    }

    if (process.env.NEXT_PUBLIC_ANALYTICS_Ms_type === 'qs') {
      if (localStorage.getItem('loginMarker') === 'largeScreen') {
        window.location.replace(process.env.NEXT_PUBLIC_ANALYTICS_BasePath + '/loginqs');
      } else {
        window.location.replace(process.env.NEXT_PUBLIC_ANALYTICS_BasePath + '/qsManage/login');
      }
    }

    if (process.env.NEXT_PUBLIC_ANALYTICS_Ms_type === 'cx') {
      if (`${process.env.NEXT_PUBLIC_ANALYTICS_cx_factoryType}` === 'cx_dh') {
        window.location.replace(
          process.env.NEXT_PUBLIC_ANALYTICS_BasePath + '/securityControl/login'
        );
      } else if (`${process.env.NEXT_PUBLIC_ANALYTICS_cx_factoryType}` === 'cx_center') {
        window.location.replace(process.env.NEXT_PUBLIC_ANALYTICS_BasePath + '/dpCLogin');
      } else {
        window.location.replace(process.env.NEXT_PUBLIC_ANALYTICS_BasePath + '/login');
      }
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return { noAuth: true };
  }
  if (options.headers?.type === 'blob') {
    const blob = await res.blob();

    const newBlob = new Blob([blob], { type: 'application/pdf;chartset=UTF-8' });
    return new Promise<any>((resolve) => {
      resolve(newBlob);
    });
  }

  return res?.json?.();
};

export const amisRequest = async <T>({
  url,
  options = { headers: {} },
}: IFetchParams): Promise<IResData<T>> => {
  const xtoken_ = localStorage.getItem(
    // `${process.env.NEXT_PUBLIC_ANALYTICS_cx_factoryType}_token` || 'cx_token'
    process.env.NEXT_PUBLIC_ANALYTICS_cx_factoryType
      ? `${process.env.NEXT_PUBLIC_ANALYTICS_cx_factoryType}_token`
      : 'cx_token'
  );

  try {
    // if (!options.noheaders) {
    //   if (!options.headers) {
    //     options.headers = { 'content-type': 'application/json' };
    //   }
    //   if (options.headers['content-type']) {
    //     if (options.headers['content-type'] === undefined) {
    //       options.headers['content-type'] = 'application/json';
    //     }
    //   }

    //   if (xtoken_) {
    //     options.headers['x-auth-token'] = xtoken_;
    //   }
    //    options.headers.reqType = localStorage.getItem('clientType') || clientType;
    //   options.headers.systemCode = 'SystemSign';
    // }
    if (!options.headers && !options.ContentType) {
      options.headers = { 'Content-type': 'application/json' };
    }
    if (!options.headers) {
      options.headers = {};
    }
    // if (options.headers)
    Object.assign(options.headers, {
      'x-auth-token': xtoken_,
      reqType:
        localStorage.getItem(
          process.env.NEXT_PUBLIC_ANALYTICS_cx_factoryType
            ? `${process.env.NEXT_PUBLIC_ANALYTICS_cx_factoryType}_clientType`
            : 'clientType'
        ) || clientType,
    });
    const res = await fetch(
      url.indexOf('http') === -1
        ? (process.env.NEXT_PUBLIC_ANALYTICS_BasePath as string) + url
        : url,
      options
    );
    const resToken = res.headers.get('x-auth-token');
    if (resToken) {
      localStorage.setItem(
        // `${process.env.NEXT_PUBLIC_ANALYTICS_cx_factoryType}_token` || 'cx_token',
        process.env.NEXT_PUBLIC_ANALYTICS_cx_factoryType
          ? `${process.env.NEXT_PUBLIC_ANALYTICS_cx_factoryType}_token`
          : 'cx_token',
        resToken
      );
    }

    if (res.status === 401) {
      // const error = new Error('无权限')

      // throw error
      localStorage.setItem('Auth', 'f');
      localStorage.removeItem(
        // `${process.env.NEXT_PUBLIC_ANALYTICS_cx_factoryType}_token` || 'cx_token'
        process.env.NEXT_PUBLIC_ANALYTICS_cx_factoryType
          ? `${process.env.NEXT_PUBLIC_ANALYTICS_cx_factoryType}_token`
          : 'cx_token'
      );

      sessionStorage.setItem('login', 'f');

      // if(process.env.NEXT_PUBLIC_ANALYTICS_Ms_type === 'qs') {
      //   window.location.replace('/loginqs');
      // }
      // window.location.replace('/login');

      if (process.env.NEXT_PUBLIC_ANALYTICS_Ms_type === 'cx') {
        if (`${process.env.NEXT_PUBLIC_ANALYTICS_cx_factoryType}` === 'cx_dh') {
          window.location.replace(
            process.env.NEXT_PUBLIC_ANALYTICS_BasePath + '/securityControl/login'
          );
        } else if (`${process.env.NEXT_PUBLIC_ANALYTICS_cx_factoryType}` === 'cx_center') {
          window.location.replace(process.env.NEXT_PUBLIC_ANALYTICS_BasePath + '/dpCLogin');
        } else {
          window.location.replace(process.env.NEXT_PUBLIC_ANALYTICS_BasePath + '/login');
        }
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return { noAuth: true };
    }
    if (options.headers?.type === 'blob') {
      const blob = await res.blob();

      const newBlob = new Blob([blob], { type: 'application/pdf;chartset=UTF-8' });
      return new Promise<any>((resolve) => {
        resolve(newBlob);
      });
    }

    return res?.json?.();
  } catch (error) {
    console.log('err', error);
    return Promise.reject(false);
  }
};

export const aimsRequestDownload = async ({
  url,
  options = { headers: {} },
}: IFetchParams): Promise<any> => {
  const xtoken_ = localStorage.getItem(
    // `${process.env.NEXT_PUBLIC_ANALYTICS_cx_factoryType}_token` || 'cx_token'
    process.env.NEXT_PUBLIC_ANALYTICS_cx_factoryType
      ? `${process.env.NEXT_PUBLIC_ANALYTICS_cx_factoryType}_token`
      : 'cx_token'
  );

  if (!options.headers) {
    options.headers = { 'content-type': 'application/json' };
  }

  if (xtoken_) {
    options.headers['x-auth-token'] = xtoken_;
  }
  options.headers.reqType =
    localStorage.getItem(
      process.env.NEXT_PUBLIC_ANALYTICS_cx_factoryType
        ? `${process.env.NEXT_PUBLIC_ANALYTICS_cx_factoryType}_clientType`
        : 'clientType'
    ) || clientType;

  const res = await fetch(
    url.indexOf('http') === -1 ? (process.env.NEXT_PUBLIC_ANALYTICS_BasePath as string) + url : url,
    options
  );

  const resToken = res.headers.get('x-auth-token');
  if (resToken) {
    localStorage.setItem(
      process.env.NEXT_PUBLIC_ANALYTICS_cx_factoryType
        ? `${process.env.NEXT_PUBLIC_ANALYTICS_cx_factoryType}_token`
        : 'cx_token',
      resToken
    );
  }

  if (res.status === 401) {
    // const error = new Error('无权限')

    // throw error
    localStorage.setItem('Auth', 'f');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return new Promise<any>((resolve) => {
      resolve({ noAuth: true });
    });
  }

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
    staus: 0,
    data: {},
    msg: '',
  };
};

export const requestDownload = async ({
  url,
  options = { headers: {} },
}: IFetchParams): Promise<Blob> => {
  const xtoken_ = localStorage.getItem(
    process.env.NEXT_PUBLIC_ANALYTICS_cx_factoryType
      ? `${process.env.NEXT_PUBLIC_ANALYTICS_cx_factoryType}_token`
      : 'cx_token'
  );

  if (!options.headers) {
    options.headers = { 'content-type': 'application/json' };
  }

  if (xtoken_) {
    options.headers['x-auth-token'] = xtoken_;
  }
  options.headers.reqType =
    localStorage.getItem(
      process.env.NEXT_PUBLIC_ANALYTICS_cx_factoryType
        ? `${process.env.NEXT_PUBLIC_ANALYTICS_cx_factoryType}_clientType`
        : 'clientType'
    ) || clientType;

  const res = await fetch(
    url.indexOf('http') === -1 ? (process.env.NEXT_PUBLIC_ANALYTICS_BasePath as string) + url : url,
    options
  );

  const resToken = res.headers.get('x-auth-token');
  if (resToken) {
    localStorage.setItem(
      process.env.NEXT_PUBLIC_ANALYTICS_cx_factoryType
        ? `${process.env.NEXT_PUBLIC_ANALYTICS_cx_factoryType}_token`
        : 'cx_token',
      resToken
    );
  }

  if (res.status === 401) {
    // const error = new Error('无权限')

    // throw error
    localStorage.setItem('Auth', 'f');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return new Promise<any>((resolve) => {
      resolve({ noAuth: true });
    });
  }

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
  return blob;
};

export const requestUpload = async <T>({
  url,
  options = { headers: {} },
}: IFetchParams): Promise<IResData<T>> => {
  const xtoken_ = localStorage.getItem(
    process.env.NEXT_PUBLIC_ANALYTICS_cx_factoryType
      ? `${process.env.NEXT_PUBLIC_ANALYTICS_cx_factoryType}_token`
      : 'cx_token'
  );

  if (!options.headers) {
    options.headers = {};
  }

  if (xtoken_) {
    options.headers['x-auth-token'] = xtoken_;
  }
  options.headers.reqType =
    localStorage.getItem(
      process.env.NEXT_PUBLIC_ANALYTICS_cx_factoryType
        ? `${process.env.NEXT_PUBLIC_ANALYTICS_cx_factoryType}_clientType`
        : 'clientType'
    ) || clientType;
  options.headers.systemCode = 'SystemSign';

  const res = await fetch(
    url.indexOf('http') === -1 ? (process.env.NEXT_PUBLIC_ANALYTICS_BasePath as string) + url : url,
    options
  );

  const resToken = res.headers.get('x-auth-token');
  if (resToken) {
    localStorage.setItem(
      process.env.NEXT_PUBLIC_ANALYTICS_cx_factoryType
        ? `${process.env.NEXT_PUBLIC_ANALYTICS_cx_factoryType}_token`
        : 'cx_token',
      resToken
    );
  }

  if (res.status === 401) {
    // const error = new Error('无权限')

    // throw error
    localStorage.setItem('Auth', 'f');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return { noAuth: true };
  }
  return res?.json?.();
};

/**
 * 这是服务端请求，不能使用客户端api
 */
export const requestNode = async <T>({
  url,
  options = { headers: {} },
  token,
  reqType,
}: IFetchParams): Promise<IResData<T>> => {
  if (!options.noheaders) {
    if (!options.headers) {
      options.headers = { 'content-type': 'application/json' };
    }
    if (options.headers['content-type']) {
      if (options.headers['content-type'] === undefined) {
        options.headers['content-type'] = 'application/json';
      }
    }

    if (token) {
      options.headers['x-auth-token'] = token;
    }
    options.headers.reqType = reqType || clientType;
    options.headers.systemCode = 'SystemSign';
  }

  const res = await fetch(url, options);

  return res?.json?.();
};
/**
 * 服务端组件，请求aims内容时使用
 */
export const requestAims = async ({
  url,
  options = { headers: {} },
  token,
}: IFetchParams): Promise<{ data: { attributes: { content: Schema }; name: string } }> => {
  if (!options.noheaders) {
    if (!options.headers) {
      options.headers = { 'content-type': 'application/json' };
    }
    if (options.headers['content-type']) {
      if (options.headers['content-type'] === undefined) {
        options.headers['content-type'] = 'application/json';
      }
    }

    if (token) {
      options.headers['x-auth-token'] = token;
    }
    options.headers.reqType = clientType;
    options.headers.systemCode = 'SystemSign';
  }
  options.cache = dev ? 'no-store' : 'force-cache';

  const hash = `#${uuidv4()}`;

  const res = await fetch('http://192.168.0.240:1337' + url + hash, options);

  if (res.status === 401) {
    if (process.env.NEXT_PUBLIC_ANALYTICS_Ms_type === 'cx') {
      if (`${process.env.NEXT_PUBLIC_ANALYTICS_cx_factoryType}` === 'cx_dh') {
        window.location.replace(
          process.env.NEXT_PUBLIC_ANALYTICS_BasePath + '/securityControl/login'
        );
      } else if (`${process.env.NEXT_PUBLIC_ANALYTICS_cx_factoryType}` === 'cx_center') {
        window.location.replace(process.env.NEXT_PUBLIC_ANALYTICS_BasePath + '/dpCLogin');
      } else {
        window.location.replace(process.env.NEXT_PUBLIC_ANALYTICS_BasePath + '/login');
      }
    }
  }
  return res?.json?.();
};

export const getAmisJson = async (
  amisJsonId: number,
  isClient?: boolean,
  options = { headers: {} },
  token?: string
) => {
  if (isClient == undefined) {
    isClient = false;
  }
  const res = await requestAimsClient(
    {
      url: `/api/aims-lists/${amisJsonId}?fields[0]=content`,
      options,
      token,
    },
    isClient
  );
  return res.data.attributes.content;
};

/**
 * 请求aims内容时使用 isClient是否是客户端请求：true 是客户端url 使用：'/strapi' + url + hash,否则使用process.env.NEXT_PUBLIC_ANALYTICS_Strapi_Server + url + hash
 */
export const requestAimsClient = async (
  { url, options = { headers: {} }, token }: IFetchParams,
  isClient?: boolean
): Promise<{
  data: { attributes: { content: Schema }; name: string };
}> => {
  if (!options.noheaders) {
    if (!options.headers) {
      options.headers = { 'content-type': 'application/json' };
    }
    if (options.headers['content-type']) {
      if (options.headers['content-type'] === undefined) {
        options.headers['content-type'] = 'application/json';
      }
    }

    if (token) {
      options.headers['x-auth-token'] = token;
    }
    options.headers.reqType = clientType;
    // options.headers.systemCode = process.env.NEXT_PUBLIC_ANALYTICS_ProductCode as string;
    options.headers.systemCode = 'SystemSign';
  }
  options.cache = dev ? 'no-store' : 'force-cache';

  const hash = url.indexOf('?') === -1 ? `?cacheId=${uuidv4()}` : `&cacheId=${uuidv4()}`;

  const fetchUrl = isClient
    ? process.env.NEXT_PUBLIC_ANALYTICS_BasePath + '/strapi' + url + hash
    : process.env.NEXT_PUBLIC_ANALYTICS_Strapi_Server + url + hash;

  if (!dev) {
    console.info('=========requestAims===fetchUrl==============', fetchUrl);
  }
  const res = await fetch(
    // process.env.NEXT_PUBLIC_ANALYTICS_Strapi_Server + url + hash,
    // '/strapi' + url + hash,
    fetchUrl,

    options
  );

  const json = await res.json();
  if (json.status === undefined) {
    const obj = {
      status: 0,
      msg: json.msg,
      data: json.data,
    };
    return obj as any;
  }

  if (json.data && json.data.item) {
    const isObj = json.data.item instanceof Object && !(json.data.item instanceof Array);
    const obj = {
      status: json.status,
      msg: json.msg,
      data: isObj
        ? {
            ...json.data.item,
          }
        : { item: json.data.item },
    };
    return obj as any;
  }
  return json;
};
