'use client';

import NodeMediaPlayer from '../Video/NodeMediaPlayer';
import { IVideoItem, VideoList } from './VideoList';
import ptz from '@/assets/panel/PTZ.png';
import ptzActive from '@/assets/panel/PTZActive.png';
import cannon from '@/assets/panel/cannon.png';
import cannonActive from '@/assets/panel/cannonActive.png';
import exit from '@/assets/panel/exit.png';
import exitActive from '@/assets/panel/exitActive.png';
import Image from 'next/image';
import { useState } from 'react';
import PTZPanel from '../PTZPanel';
import CannonPanel from '../CannonPanel';

const videoItems: IVideoItem[] = [
  {
    index: 1,
    cameraId: 'camera-001',
    isNVR: true,
    rtspIndex: -1,
  },
  {
    index: 2,
    cameraId: '',
    isNVR: false,
    rtspIndex: 1002,
  },
  {
    index: 3,
    cameraId: 'camera-003',
    isNVR: true,
    rtspIndex: -1,
  },
  {
    index: 4,
    cameraId: '',
    isNVR: false,
    rtspIndex: 1004,
  },
];
const VideoPanel = () => {
  const [ptzPanel, setPtzPanel] = useState(false);
  const [cannonPanel, setCannonPanel] = useState(false);

  return (
    <div className="w-full h-full z-10 absolute top-0 left-0">
      {ptzPanel && <PTZPanel closePtz={() => {}} cameraId={''} />}
      {cannonPanel && <CannonPanel />}
      <NodeMediaPlayer cameraId={''} isNVR={false} rtspIndex={1} />
      <div className="absolute bottom-[24px] left-[27px] z-10">
        <VideoList videoList={videoItems} direction="row" />
      </div>
      <div className="absolute bottom-[24px] right-[83px] z-10 text-14px text-white flex flex-row gap-x-8">
        <div
          className="flex flex-row gap-x-4 cursor-pointer "
          onClick={() => {
            setPtzPanel(!ptzPanel);
          }}
        >
          {ptzPanel ? (
            <Image width={26} height={26} src={ptzActive} alt="PTZ" />
          ) : (
            <Image width={26} height={26} src={ptz} alt="PTZ" />
          )}
          <div className={`${ptzPanel ? 'text-[#0078EC]' : 'text-white'}`}>云台</div>
        </div>
        <div
          className="flex flex-row gap-x-4 cursor-pointer"
          onClick={() => {
            setCannonPanel(!cannonPanel);
          }}
        >
          {cannonPanel ? (
            <Image width={26} height={26} src={cannonActive} alt="cannon" />
          ) : (
            <Image width={26} height={26} src={cannon} alt="cannon" />
          )}
          <div className={`${cannonPanel ? 'text-[#0078EC]' : 'text-white'}`}>消防炮</div>
        </div>
        <div className="flex flex-row gap-x-4">
          <Image width={26} height={26} src={exit} alt="exit" />
          退出
        </div>
      </div>
    </div>
  );
};
export default VideoPanel;
