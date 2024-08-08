// // 'use client';
// import React from 'react';
// import dynamic from 'next/dynamic';
// import { dev } from '@/utils/util';
// const AimsRender = dynamic(() => import('@/components/AimsRender'), { ssr: false });

// // console.info('===========data1===============', JSON.stringify(data1));
// const hash = new Date().getTime();
// const getData = async () => {
//   const json = await (
//     await fetch(`${process.env.NEXT_PUBLIC_ANALYTICS_Aims_server}/getAimsJsonById?id=4#${hash}`, {
//       cache: dev ? 'no-store' : 'force-cache',
//     })
//   ).json();
//   return json.data.item.content;
// };
// const LinkEdit = async () => {
//   const json = await getData();

//   //     const res = await aimsRequest({ url: '/cx-alarm/device/manager/downloadRelevance' });
//   //     console.info('============res==============', res);
//   // })

//   //     const res = await aimsRequest({ url: '/cx-alarm/device/manager/downloadRelevance' });
//   //     console.info('============res==============', res);
//   // })

//   return <AimsRender jsonView={json} />;
// };

// export default LinkEdit;

import { requestAims } from '@/utils/request';
import dynamic from 'next/dynamic';
const AimsRender = dynamic(() => import('@/components/AimsRender'), { ssr: false });

const LinkEdit = async () => {
  const json = await requestAims({ url: '/api/aims-lists/29?fields[0]=content' });
  return <AimsRender jsonView={json.data.attributes.content} />;
};

export default LinkEdit;
