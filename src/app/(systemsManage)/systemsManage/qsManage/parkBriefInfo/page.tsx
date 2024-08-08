import { requestAims } from '@/utils/request';
import dynamic from 'next/dynamic';
const AimsRender = dynamic(() => import('@/components/AimsRender'), { ssr: false });

const ParkBriefInfo = async () => {
  const json = await requestAims({ url: '/api/aims-lists/13?fields[0]=content' });

  return (
    <div
      style={{
        overflowY: 'auto',
        height: '100%',
      }}
    >
      <AimsRender jsonView={json.data.attributes.content} />
    </div>
  );
};

export default ParkBriefInfo;
