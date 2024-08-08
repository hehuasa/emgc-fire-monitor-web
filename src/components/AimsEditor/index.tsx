import React from 'react';

import { Editor } from 'amis-editor';

// import 'amis-editor/dist/style.css';
import 'amis/lib/themes/cxd.css';
import 'amis/lib/helper.css';
import 'amis/sdk/iconfont.css';
import 'amis-editor-core/lib/style.css';
import '@fortawesome/fontawesome-free/css/all.css';
import { Box, UseToastOptions, useToast } from '@chakra-ui/react';
import { amisRequest, aimsRequestDownload } from '@/utils/request';
import { useMemoizedFn, useMount } from 'ahooks';
import { LinkeditWithformEditPlugin } from '../AimsCustomComponent/LinkeditWithformEditPlugin';
import { SpritePickPlugin } from '../AimsCustomComponent/SpritePickPlugin';
import { AlertComponent, ToastComponent, toast } from 'amis-ui';
import { ToastConf, ToastLevel } from 'amis-core';
const theme = 'cxd';
const AimsEditor = (props: any) => {
  const ChakraToast = useToast();

  const toastMsg = useMemoizedFn((option?: UseToastOptions) => {
    return ChakraToast(option);
  });

  useMount(() => {
    import('@/components/AimsCustomComponent/SpritePick'); //图层管理---雪碧图编辑
    import('@/app/(systemsManage)/systemsManage/resources/linkeditWithform/EditModal'); // 联动配置---编辑
  });
  return (
    <Box h="full">
      <ToastComponent theme={theme} key="toast" position={'top-center'} locale={'zh-CN'} />
      <AlertComponent theme={theme} key="alert" locale={'zh-CN'} />
      <Editor
        {...props}
        theme={'cxd'}
        plugins={[LinkeditWithformEditPlugin, SpritePickPlugin]}
        showCustomRenderersPanel={true}
        amisEnv={{
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

            // if (config.cancelExecutor) {
            //================todo============= 取消请求=============todo=============
            // config.cancelToken = new (axios as any).CancelToken(
            //   config.cancelExecutor
            // );
            // }

            console.info('============method==============', method);
            if (
              method !== 'post' &&
              method !== 'put' &&
              method !== 'patch' &&
              method !== 'delete'
            ) {
              if (data) {
                config.params = data;
              }
              if (config.responseType == 'blob') {
                console.info('========responseType==================', config.responseType);
                return aimsRequestDownload({
                  url,
                  options: {
                    name: headers.name,
                    body: JSON.stringify(data),
                  },
                });
              }
              return amisRequest({ url, options: { method, headers, ...config } });
            } else if (data && data instanceof FormData) {
              console.info('FormData');
              headers = config.headers || {};
              // headers['content-type'] = 'multipart/form-data';
            }
            // else if (
            //   data &&
            //   typeof data !== 'string' &&
            //   !(data instanceof Blob) &&
            //   !(data instanceof ArrayBuffer)
            // ) {
            //   if (headers['content-type']) {
            //     if (headers['content-type'] === 'application/x-www-form-urlencoded') {
            //       data = qs.stringify(data);
            //     } else {
            //       data = JSON.stringify(data);
            //     }
            //   }
            // }
            return amisRequest({
              url,
              options: { method, headers, body: data },
            });
          },
          notify: (type: ToastLevel, msg: string, conf?: ToastConf) => {
            console.log('notifynotifynotify', type, msg, conf);
            return toast[type](msg);
          },
          alert,
        }}
      />
    </Box>
  );
};

export default AimsEditor;
