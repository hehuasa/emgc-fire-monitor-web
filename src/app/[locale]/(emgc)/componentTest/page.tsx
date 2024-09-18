'use client';

const VideoPanel = dynamic(() => import('@/components/VideoPanel'), { ssr: false });

import CannonPanel from '@/components/CannonPanel';
import PTZPanel from '@/components/PTZPanel';
import dynamic from 'next/dynamic';

const Page = () => {
  return (
    <div className="w-full h-full bg-gray-100 relative">
      <VideoPanel />
      <CannonPanel />
      <PTZPanel closePtz={() => {}} cameraId={'1'} />
    </div>
  );
};
export default Page;
