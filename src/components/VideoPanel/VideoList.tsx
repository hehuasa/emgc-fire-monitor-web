'use client';

import NodeMediaPlayer from '../Video/NodeMediaPlayer';
import { IoIosClose } from 'react-icons/io';
export interface IVideoItem {
  index: number;
  cameraId: string;
  isNVR: boolean;
  rtspIndex: number;
}
export interface ListProps {
  videoList: IVideoItem[];
  direction: 'row' | 'col';
}
export const VideoList = ({ videoList, direction }: ListProps) => {
  return (
    <div
      className={`flex ${direction === 'row' ? 'w-full h-[135px] flex-row' : 'h-full w-[224px] flex-col'} gap-4`}
    >
      {videoList.map(({ cameraId, isNVR, rtspIndex }) => (
        <div
          key={`video-${isNVR ? cameraId : rtspIndex}`}
          className="rounded-lg w-[224px] h-[135px] relative "
        >
          <IoIosClose className="absolute top-2 right-2 text-white text-2xl z-10" />
          <NodeMediaPlayer cameraId={cameraId} isNVR={isNVR} rtspIndex={rtspIndex} />
        </div>
      ))}
    </div>
  );
};
