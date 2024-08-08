import { requestAims } from '@/utils/request';
import dynamic from 'next/dynamic';
const AimsRender = dynamic(() => import('@/components/AimsRender'), { ssr: false });

const PushRules = async () => {
  const json = await requestAims({ url: '/api/aims-lists/109?fields[0]=content' });
  return <AimsRender jsonView={json.data.attributes.content} />;
};

export default PushRules;
