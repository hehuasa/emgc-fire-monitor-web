// import React from 'react';
// import dynamic from 'next/dynamic';

// const AimsRender = dynamic(() => import('@/components/AimsRender'), { ssr: false });

// const getData = async () => {
//   const json = await (
//     await fetch(`${process.env.NEXT_PUBLIC_ANALYTICS_Aims_server}/getAimsJsonById?id=23`)
//   ).json();
//   return json.data.item.content;
// };
// const Test = async () => {
//   const json = await getData();

//   return <AimsRender jsonView={json} />;
// };

// export default Test;

import { requestAims } from '@/utils/request';
import dynamic from 'next/dynamic';
const AimsRender = dynamic(() => import('@/components/AimsRender'), { ssr: false });

const Test = async () => {
  const json = await requestAims({ url: '/api/aims-lists/151?fields[0]=content' });
  return <AimsRender jsonView={json.data.attributes.content} />;
};

export default Test;
