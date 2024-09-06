'use client';

import AlarmPanel from '@/components/AlarmPanel';

// import CannonPanel from '@/components/CannonPanel';
// import PTZPanel from '@/components/PTZPanel';

const Page = () => {
  return (
    <div className="w-screen h-screen bg-gray-100">
      {/* <CannonPanel />
      <PTZPanel closePtz={() => {}} cameraId={'1'} /> */}
      <AlarmPanel />
    </div>
  );
};
export default Page;
