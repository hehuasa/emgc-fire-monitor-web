// import React from 'react';
// import dynamic from 'next/dynamic';

// const AimsRender = dynamic(() => import('@/components/AimsRender'), { ssr: false });
// const hash = new Date().getTime();
// const getData = async () => {
//   const json = await (
//     await fetch(`${process.env.NEXT_PUBLIC_ANALYTICS_Aims_server}/getAimsJsonById?id=22#${hash}`, {
//       //cache: dev ? 'no-store' : 'force-cache',
//     })
//   ).json();
//   return json.data.item.content;
// };
// const Area = async () => {
//   const data = await getData();

//   return <AimsRender jsonView={data} />;
// };

// export default Area;

import { requestAims } from '@/utils/request';
import dynamic from 'next/dynamic';
const AimsRender = dynamic(() => import('@/components/AimsRender'), { ssr: false });

const AlarmType = async () => {
  const json = await requestAims({ url: '/api/aims-lists/35?fields[0]=content' });
  return <AimsRender jsonView={json.data.attributes.content} />;
};

export default AlarmType;
