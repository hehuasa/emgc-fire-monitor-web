'use client';

import { IVideoItem, VideoList } from './VideoList';
import ptz from '@/assets/panel/PTZ.png';
import ptzActive from '@/assets/panel/PTZActive.png';
import cannon from '@/assets/panel/cannon.png';
import cannonActive from '@/assets/panel/cannonActive.png';
import exit from '@/assets/panel/exit.png';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import PTZPanel from '../PTZPanel';
import CannonPanel from '../CannonPanel';
import { useTranslations } from 'next-intl';
import { videoPanelModal } from '@/models/video';
import { useRecoilState } from 'recoil';
import { request } from '@/utils/request';
import { useMount } from 'ahooks';
import NodeMediaPlayer from '../Video/NodeMediaPlayer';

interface videoRes {
  rtspVideos: string[];
  NVRVideos: { id: string }[];
}

// const getVideos = async () => {};
const FirstVideo = ({ nodeplayer }: { nodeplayer: IVideoItem }) => {
  return (
    <NodeMediaPlayer
      cameraId={nodeplayer.cameraId}
      isNVR={nodeplayer.isNVR}
      rtspIndex={nodeplayer.rtspIndex}
    />
  );
};
const VideoPanel = () => {
  const [videoPanel, setVideoPanel] = useRecoilState(videoPanelModal);
  const [ptzPanel, setPtzPanel] = useState(false);
  const [cannonPanel, setCannonPanel] = useState(false);
  const [videoList, setVideoList] = useState<IVideoItem[]>();
  const formatMessage = useTranslations('panel');
  const [curList, setCurList] = useState<IVideoItem[]>();
  const addVideo = () => {
    if (videoList && curList) {
      for (const item of videoList) {
        if (!curList.includes(item)) {
          setCurList([...curList, item]);
          break;
        }
      }
    }
  };
  useEffect(() => {
    console.log('change curList', curList);
  }, [curList]);
  useMount(async () => {
    const { rtspVideos, NVRVideos } = (await request({
      url: `/mock/videos.json`,
    })) as unknown as videoRes;
    const tmpList = NVRVideos.map((item) => {
      return {
        rtspIndex: -1,
        isNVR: true,
        cameraId: item.id,
      };
    }).concat(
      rtspVideos.map((item, index) => {
        return { rtspIndex: index, isNVR: false, cameraId: '' };
      })
    );
    setVideoList(tmpList);
    setCurList(tmpList.slice(0, 6));
  });

  return (
    <div className="w-full h-full z-10 absolute top-0 left-0">
      {ptzPanel && <PTZPanel closePtz={() => {}} cameraId={''} pos={{ x: 1450, y: 430 }} />}
      {cannonPanel && <CannonPanel pos={{ x: 1450, y: 430 }} />}
      {videoList && curList && (
        <>
          <FirstVideo nodeplayer={curList[0]} />
          {/* <NodeMediaPlayer
            cameraId={curList[0].cameraId}
            isNVR={curList[0].isNVR}
            rtspIndex={curList[0].rtspIndex}
          /> */}
          <div className="absolute bottom-[24px] left-[27px] z-10">
            <VideoList
              videoList={videoList}
              curList={curList}
              setCurList={setCurList}
              addVideo={addVideo}
              direction="row"
            />
          </div>
        </>
      )}
      <div className="absolute bottom-[24px] right-[83px] z-10 text-14px text-white flex flex-row gap-x-4">
        <div
          className={`flex flex-row gap-x-4 cursor-pointer  px-4 py-2 rounded-md ${ptzPanel ? 'bg-[#0000001C]' : 'bg-[#00000088]'}`}
          onClick={() => {
            setPtzPanel(!ptzPanel);
          }}
        >
          {ptzPanel ? (
            <Image width={26} height={26} src={ptzActive} alt="PTZ" />
          ) : (
            <Image width={26} height={26} src={ptz} alt="PTZ" />
          )}
          <div className={`${ptzPanel ? 'text-[#0078EC]' : 'text-white'}`}>
            {formatMessage('video-panel-PTZ')}
          </div>
        </div>
        <div
          className={`flex flex-row gap-x-4 cursor-pointer  px-4 py-2 rounded-md ${cannonPanel ? 'bg-[#0000001C]' : 'bg-[#00000088]'}`}
          onClick={() => {
            setCannonPanel(!cannonPanel);
          }}
        >
          {cannonPanel ? (
            <Image width={26} height={26} src={cannonActive} alt="cannon" />
          ) : (
            <Image width={26} height={26} src={cannon} alt="cannon" />
          )}
          <div className={`${cannonPanel ? 'text-[#0078EC]' : 'text-white'}`}>
            {formatMessage('video-panel-cannon')}
          </div>
        </div>
        <div
          className="flex flex-row gap-x-4 cursor-pointer  px-4 py-2 rounded-md bg-[#00000088]"
          onClick={() => setVideoPanel(false)}
        >
          <Image width={26} height={26} src={exit} alt="exit" />
          {formatMessage('video-panel-exit')}
        </div>
      </div>
    </div>
  );
};
export default VideoPanel;
