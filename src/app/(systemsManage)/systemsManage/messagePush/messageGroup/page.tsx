import { requestAims } from '@/utils/request';
import dynamic from 'next/dynamic';
const AimsRender = dynamic(() => import('@/components/AimsRender'), { ssr: false });

const MessageGroup = async () => {
  const json = await requestAims({ url: '/api/aims-lists/125?fields[0]=content' });
  return <AimsRender jsonView={json.data.attributes.content} />;
};

export default MessageGroup;
