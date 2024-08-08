import { requestAims } from '@/utils/request';
import dynamic from 'next/dynamic';
const AimsRender = dynamic(() => import('@/components/AimsRender'), { ssr: false });

const emissionConfig = async () => {
  const json = await requestAims({ url: '/api/aims-lists/25?fields[0]=content' });
  return (
    <>
      {/* <div
        style={{
          position: 'absolute',
          width: '100px',
          height: '100px',
          backgroundColor: '#f00',
        }}
      ></div> */}
      <AimsRender jsonView={json.data.attributes.content} />
    </>
  );
};

export default emissionConfig;
