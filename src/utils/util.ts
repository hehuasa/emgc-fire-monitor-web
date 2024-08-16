/* eslint-disable @typescript-eslint/no-explicit-any */
import { IMenuItem, IUserRes } from '../models/user';
import { parse } from 'qs';

export const dev = process.env.NODE_ENV !== 'production';

/**
 * @description 获取当前的国际化
 */

export const getCurrentIntl = () => {
  const intl = localStorage.getItem('intl') || 'zh';
  return intl;
};

//根据地址直接下载文件
export const downFileByUrl = async (url: string, name: string) => {
  return new Promise<void>((reslove, reject) => {
    fetch(url)
      .then((res) => res.blob())
      .then((bolb) => {
        reslove();
        const downloadElement = document.createElement('a');
        const href = window.URL.createObjectURL(bolb);
        downloadElement.href = href;
        downloadElement.download = name;
        document.body.appendChild(downloadElement);
        downloadElement.click();
        document.body.removeChild(downloadElement);
        window.URL.revokeObjectURL(href);
      })
      .catch(reject);
  });
};

export const privateKey = `-----BEGIN RSA PRIVATE KEY-----
      MIICWQIBAAKBgQCDbioYTFK221ZOzUnPNOqYe7b5F3BbVn/7io+mGlKJB9mIVbH+
      gsD0oyKVjdzjNo7OnReZzx1ds6jy9b6ka/1bKgqjybmCEWKAq/O+rjqo6aCuJpZV
      P2+PVZFV7YF8n6PomiGSfMfsYPQBMBLAxxyVUcw//ONricuHtPCTIlNlOwIDAQAB
      An8LS2xSqjxxemfwXbP6GpIOiJMw1NLTBpv5Ae9WVuzA2evXy4WAWbw7ScmvEIHr
      BMVA/D8K+MGNS+M4/eVkO+OJ0Qg/5sugYnck6MTQLRxtMdaMdd5lZ/g2xg6XrP/N
      GwMC4YAa73MdppcEFWvPPiwjOreEetDAjwU4OGEl0ABRAkEA+c0uwtcMDbE8V+ZZ
      dw1Fi9lHwu6tTE5KIhhrOAtNhX2Iq/qULW5o75BBq57urL+NRoC+w2tcqJsZJkvV
      2yBZfwJBAIaxDRH/ObzOBcltt09U63H47o1X3u7f33YjM6Lwoj88SegyyrGevHTQ
      Wpajm9TBVNLOc0zeFimnYB7x6ZbrukUCQB65sx+6Dbx9aVuydJylIEHEVwROETjK
      hGnPMRjyovVhbHci2ikAZJ3a04kFgnvzD7B1U4F76ii+8wf32fUa9IcCQCskiws4
      tUXEuBXNDupaSRA4rDCZ9M6O5wTwQZnvegjHRuUZX9OFBNhl5J5byY5cXs8nUcdN
      W8v70M4YrrmoyAECQHRx3u9OLA1sqq3ViAyZZT9IX5SfaOB9DflNz+a2TLto7O7R
      f88QlHpLO+xtB/AceDu8tVfXsxcsSdap9/a8Cyc=
      -----END RSA PRIVATE KEY-----`;

export const publicKey = `-----BEGIN PUBLIC KEY-----
        MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCDbioYTFK221ZOzUnPNOqYe7b5
        F3BbVn/7io+mGlKJB9mIVbH+gsD0oyKVjdzjNo7OnReZzx1ds6jy9b6ka/1bKgqj
        ybmCEWKAq/O+rjqo6aCuJpZVP2+PVZFV7YF8n6PomiGSfMfsYPQBMBLAxxyVUcw/
        /ONricuHtPCTIlNlOwIDAQAB
        -----END PUBLIC KEY-----`;

export const baseUploadType = 'image/*,audio/*,video/*,.pdf,.xlsx,.xls,.doc,.docx';

//保存用户信息
export const formatUserInfo = (data: IUserRes) => {
  const newData = JSON.parse(JSON.stringify(data)) as IUserRes;
  //把权限转换成对象，方便获取
  const permissions = newData.permissions;
  const permissionsObj: { [key: string]: any } = {};
  permissions.forEach((item) => (permissionsObj[item] = true));
  newData.permissionsObj = permissionsObj;
  newData.permissions = [];
  //setUserInfo(data);
  return newData;
};

//wen端默认所有用户都有的权限
export const webDefaultMenus = ['/personal-center/basic-info', '/personal-center/modify-password'];

//app端默认所有用户都有的权限
export const appDefaultMenus = [];

export function hasCameraAccess() {
  return new Promise((resolve, reject) => {
    const constraints = { video: true };

    if (navigator?.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // 尝试访问用户的摄像头
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          // 如果能够访问，则释放流并返回true
          stream.getTracks().forEach((track) => track.stop());
          resolve(true);
        })
        .catch((error) => {
          // 如果抛出错误，则可能是因为没有权限

          reject(error);
        });
    } else {
      reject();
    }
  });
}

//systemSign业务名称
export const systemSignNameObj: { [key: string]: string } = {
  'ms-access-control': '门禁',
  'ms-system': '人员管理',
  'cpecc-zyxk': '作业许可',
  'ms-exam': '培训管理',
  fivestarplan: '五星计划',
  'ms-fsp': '五星计划',
  optimizeinnovationteam: '优创班组服务',
  'cpecc-yhpc': '隐患排查',
};

/**
 * 重新拼接文件地址
 * 主要处理minio 和 basepath的代理问题
 * 拼接后子项目也可以使用
 * 例如 上传的图片前缀为/wisdom-matrix/minio/.....  想要在wisdom-matrix-m项目使用就用此方法
 */
export const formatFileUrl = (originUrl: string) => {
  if (originUrl && originUrl.includes('/minio')) {
    const startIndex = originUrl.indexOf('/minio');
    const res = originUrl.substring(startIndex);
    const realUrl = process.env.NEXT_PUBLIC_ANALYTICS_BasePath + res;
    return realUrl;
  } else {
    return originUrl && originUrl.length > 0 ? originUrl : '';
  }
};

// 判断是否为移动端
export const isMobile = /Mobile|Android|iPhone/i.test(globalThis?.navigator?.userAgent);

//解析url表单上面以后的参数
export const analysisUrlFormParam = (iframeUrl: string) => {
  const origin = iframeUrl.split('?')[0];
  const param = parse(iframeUrl.split('?')[1]) || {};

  return {
    url: origin,
    param,
  };
};

//扁平化菜单结构
export const flagMenuFn = (data: IMenuItem[]) => {
  const obj: { [key: string]: IMenuItem } = {};
  const fn = (data_: IMenuItem[]) => {
    for (const item of data_) {
      obj[item.functionCode!] = item;
      if (item.children && item.children.length) {
        fn(item.children);
      }
    }
  };
  fn(data);
  return obj;
};
//获取扁平化数据最外层的父节点functionCode
export const menuGetOutNode = (flagData: { [key: string]: IMenuItem }, currentData: IMenuItem) => {
  let father = currentData;

  while (flagData[father.parentId]) {
    father = flagData[father.parentId];
  }

  return father;
};
