import { Position } from 'geojson';
import { atom } from 'recoil';

export const videoPanelModal = atom<boolean>({
  key: 'videoPanel',
  default: false,
});
export interface IVideoResItem {
  equipmentid: string;
  id: string;
  layerid: string;
  equipmentId: string;
  resourceNo: string;
  iotDeviceId: string;
  iotSubDeviceId: string;
  index: string;
  coordinates: Position;
  resourceName: string;
}

export interface IVideoDpResItem {
  address: string;
  iotDeviceId: string;
}

export type IPlayVideoItem = {
  index: number;
  name: string;
  cameraId: string;
};

export const addPlayVideos = (
  resCodes: { name: string; cameraId: string }[],
  videos: IPlayVideoItem[]
) => {
  const newArr: IPlayVideoItem[] = [];
  const newVideos = [...resCodes, ...videos];

  const newVideos_ = newVideos.length > 4 ? newVideos.slice(0, 4) : newVideos;

  for (const [index, video] of newVideos_.entries()) {
    newArr.push({
      index: index + 1,
      cameraId: video.cameraId,
      name: video.name,
    });
  }

  return newArr;
};

export const videoListModal = atom<IVideoResItem[]>({
  key: 'videoList_',
  default: [],
});

export const playVideosModel = atom<IPlayVideoItem[]>({
  key: 'playVideos_',
  default: [
    // { url: '1' }, { url: '2' }, { url: '3' }, { url: '4' }
  ],
});

export const videoListDpModel = atom<IVideoDpResItem[]>({
  key: 'videoListDp_',
  default: [],
});

export const playVideosDpModel = atom<IPlayVideoItem[]>({
  key: 'playVideosDp_',
  default: [
    // { url: '1' }, { url: '2' }, { url: '3' }, { url: '4' }
  ],
});
