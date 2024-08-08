'use client';
import { aimsRequestDownload, amisRequest } from '@/utils/request';
import { useMount } from 'ahooks';
import {
  AlertComponent,
  render as renderAmis,
  Schema,
  toast,
  ToastComponent,
  ToastConf,
  ToastLevel,
} from 'amis';
import 'amis/lib/helper.css';
import 'amis/lib/themes/cxd.css';
import 'amis/sdk/iconfont.css';
import { useState } from 'react';

// addRule(
//   // 校验名
//   'isZXS',
//   // 校验函数，values 是表单里所有表单项的值，可用于做联合校验；value 是当前表单项的值
//   (values, value) => {
//     if (value === '北京' || value === '上海' || value === '天津' || value === '重庆') {
//       // return true 表示校验通过
//       return true;
//     }
//     // return false 表示校验不通过，会进行错误提示
//     return false;
//   },
//   // 出错时的报错信息
//   '输入正确的电话'
// );

import '@/components/AmisFilter';
import '@fortawesome/fontawesome-free/css/all.css';
const theme = 'cxd';

interface IProps {
  jsonView: Schema;
  props?: any;
}
const AimsRender = ({ jsonView, props }: IProps) => {
  const [showPage, setshowPage] = useState(false);
  useMount(() => {
    setshowPage(true);
    import('@/components/AimsCustomComponent/SpritePick'); //图层管理---雪碧图编辑
    import('@/app/(systemsManage)/systemsManage/resources/linkeditWithform/EditModal'); // 联动配置---编辑
    import('@/app/(systemsManage)/systemsManage/threshold/add'); // 阈值管理----新增
    import('@/app/(systemsManage)/systemsManage/plan/add'); // 预案---- 新增
    import('@/app/(systemsManage)/systemsManage/broadcastVoice/add'); // 广播语音---- 新增
    // import('@/components/AimsCustomComponent/AreaModal');
    import('@/app/(systemsManage)/systemsManage/area/areaMap'); // 区域管理-地图选择
    import('@/components/AimsCustomComponent/storagePoint'); //应急存放点
    import('@/app/(emgcPreparation)/emgcPreparation/emgcDrill/drillPlan/iconAndText'); // 文字加图标
    import('@/components/AimsCustomComponent/CustomCalendar/index'); // 自定义上传按钮
    import('@/app/(dataManage)/dataManage/organization/area/areaMap'); // 区域管理-地图选择
  });

  return (
    <>
      <ToastComponent theme={theme} key="toast" position={'top-center'} locale={'zh-CN'} />
      <AlertComponent theme={theme} key="alert" locale={'zh-CN'} />
      {showPage
        ? renderAmis(
            jsonView,
            {
              data: {
                ...props,
              },
              // props...
              // locale: 'en-US' // 请参考「多语言」的文档
              // scopeRef: (ref: any) => (amisScoped = ref)  // 功能和前面 SDK 的 amisScoped 一样
            },
            {
              // 下面三个接口必须实现
              fetcher: ({
                url, // 接口地址
                method, // 请求方法 get、post、put、delete
                data, // 请求数据
                responseType,
                config, // 其他配置
                headers, // 请求头
              }: any): any => {
                config = config || {};
                config.withCredentials = true;
                responseType && (config.responseType = responseType);

                console.info('============method==============', method);
                console.info('============config==============', config);
                console.info('============data==============', data, headers);
                if (method !== 'put' && method !== 'patch' && method !== 'delete') {
                  if (data) {
                    config.params = data;
                  }
                  if (config.responseType == 'blob') {
                    return aimsRequestDownload({
                      url,
                      options: {
                        name: headers.name,
                        body: method === 'post' ? data : JSON.stringify(data),
                        method,
                      },
                    });
                  }

                  if (method === 'post') {
                    if (data && data instanceof FormData) {
                      headers = config.headers || {};
                    }
                    return amisRequest({
                      url,
                      options: { method, headers, body: data },
                    });
                  } else {
                    return amisRequest({
                      url,
                      options: { method, headers, ...config },
                    });
                  }
                } else if (data && data instanceof FormData) {
                  console.info('FormData');
                  headers = config.headers || {};
                  // headers = headers || {};
                }
                // else if (
                //   data &&
                //   typeof data !== 'string' &&
                //   !(data instanceof Blob) &&
                //   !(data instanceof ArrayBuffer)
                // ) {
                //  //
                // }
                return amisRequest({
                  url,
                  options: { method, headers, body: data },
                });
              },
              isCancel: (value: any) => false,
              copy: (content) => {
                // copy(content);
                // toast.success('内容已复制到粘贴板');
              },
              theme,
              // 后面这些接口可以不用实现

              // 默认是地址跳转
              jumpTo: (location: string /*目标地址*/, action: any /* action对象*/) => {
                if (action.blank) {
                  window.open(location);
                } else {
                  window.location.href = location;
                }

                // 用来实现页面跳转, actionType:link、url 都会进来。
              },

              // updateLocation: (
              //   location: string /*目标地址*/,
              //   replace: boolean /*是replace，还是push？*/
              // ) => {
              //   // 地址替换，跟 jumpTo 类似
              // },

              // isCurrentUrl: (
              //   url: string /*url地址*/,
              // ) => {
              //   // 用来判断是否目标地址当前地址
              // },

              notify: (type: ToastLevel, msg: string, conf?: ToastConf) => {
                console.log('notifynotifynotify', type, msg, conf);
                return toast[type](msg, { ...conf, closeButton: true });
              },
              alert,
              // confirm,
              // tracker: (eventTracke) => {}
            }
          )
        : null}
    </>
  );
};

export default AimsRender;
