'use client';

import { useState } from 'react';
import NodeMediaPlayer from '../Video/NodeMediaPlayer';
import { IoIosClose } from 'react-icons/io';
import video from '@/assets/panel/video.png';
import Image from 'next/image';
export interface IVideoItem {
  // index: number;
  cameraId: string;
  isNVR: boolean;
  rtspIndex: number;
}
export interface ListProps {
  videoList: IVideoItem[];
  direction: 'row' | 'col';
}
export const VideoList = ({ videoList, direction }: ListProps) => {
  const [curList, setCurList] = useState(videoList.slice(0, 5));
  const addVideo = () => {
    for (const item of videoList) {
      if (!curList.includes(item)) {
        setCurList([...curList, item]);
        break;
      }
    }
  };
  return (
    <div
      className={`flex ${direction === 'row' ? 'w-full h-[135px] flex-row' : 'h-full w-[224px] flex-col'} gap-4`}
    >
      {curList.map(({ cameraId, isNVR, rtspIndex }) => (
        <div
          key={`video-${isNVR ? cameraId : rtspIndex}`}
          className="rounded-lg w-[224px] h-[135px] relative "
        >
          <IoIosClose
            className="absolute top-2 right-2 text-white text-2xl z-10 cursor-pointer"
            onClick={() => {
              setCurList(
                curList.filter((item) => {
                  if (item.cameraId !== '') return item.cameraId !== cameraId;
                  else return item.rtspIndex !== rtspIndex;
                })
              );
            }}
          />
          <NodeMediaPlayer cameraId={cameraId} isNVR={isNVR} rtspIndex={rtspIndex} />
        </div>
      ))}
      {videoList.length > 5 && curList.length < 5 ? (
        <div
          className="rounded-lg w-[224px] h-[135px] relative bg-[#00000088] flex items-center justify-center border-1 border-[#0078EC] cursor-pointer"
          onClick={addVideo}
        >
          <Image src={video} alt="newVideo" />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
