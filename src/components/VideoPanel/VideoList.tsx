'use client';

import { SetStateAction } from 'react';
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
  curList: IVideoItem[];
  setCurList: React.Dispatch<SetStateAction<IVideoItem[] | undefined>>;
  addVideo: () => void;
  direction: 'row' | 'col';
}
export const VideoList = ({
  videoList,
  curList,
  setCurList,
  addVideo,
  direction = 'row',
}: ListProps) => {
  return (
    <div
      className={`flex ${direction === 'row' ? 'w-full h-[135px] flex-row' : 'h-full w-[224px] flex-col'} gap-4`}
    >
      {curList.slice(1).map(({ cameraId, isNVR, rtspIndex }, index) => (
        <div
          key={`video-${isNVR ? cameraId : rtspIndex}`}
          className="rounded-lg w-[224px] h-[135px] relative cursor-pointer"
        >
          <IoIosClose
            className="absolute top-2 right-2 text-white text-2xl z-10 "
            onClick={() => {
              setCurList(
                curList.filter((item) => {
                  if (item.cameraId !== '') return item.cameraId !== cameraId;
                  else return item.rtspIndex !== rtspIndex;
                })
              );
            }}
          />
          <div
            className="rounded-lg w-[224px] h-[135px] relative "
            onClick={() => {
              const tmpList = [...curList];
              const firstVideo = tmpList[0];
              tmpList[0] = { rtspIndex, isNVR, cameraId };
              tmpList[index + 1] = firstVideo;
              setCurList(tmpList);
            }}
          >
            <NodeMediaPlayer cameraId={cameraId} isNVR={isNVR} rtspIndex={rtspIndex} />
          </div>
        </div>
      ))}
      {videoList.length > 6 && curList.length < 6 ? (
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
