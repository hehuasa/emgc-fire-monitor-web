'use client';

import CannonPanel from '@/components/CannonPanel';
import Ptz from '@/components/Video/Ptz';

const Page = () => {
  return (
    <div className="w-screen h-screen bg-gray-100">
      <CannonPanel />
      <Ptz closePtz={() => {}} cameraId={'1'} />
    </div>
  );
};
export default Page;
