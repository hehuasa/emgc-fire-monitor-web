import UeBaseMap, { IUeMap } from '@/components/UeMap';
import { currentAlarmModel, foldModel, IAlarmDetail } from '@/models/alarm';
import { request } from '@/utils/request';
import { genUmapIcons } from '@/utils/umapUtils';
import { useEffect, useRef, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';

interface IProps {
  getMapObj: ({ map }: { map: IUeMap }) => void;
}
const UeMap = ({ getMapObj }: IProps) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const ueMapRef = useRef<IUeMap | null>(null);
  const [currentAlarm, setCurrentAlarmDeatil] = useRecoilState(currentAlarmModel);
  const setFold = useSetRecoilState(foldModel);

  const getUeMapObj = ({ map }: { map: IUeMap }) => {
    ueMapRef.current = map;

    setMapLoaded(true);
    getMapObj({ map });

    if (ueMapRef.current && ueMapRef.current.addEventListener) {
      ueMapRef.current.addEventListener('message', ({ detail }) => {
        if (detail && detail === 'connecting!') {
          return;
        }
        const msg = JSON.parse(detail);
        if (msg && msg.currentAlarm) {
          setCurrentAlarmDeatil(null);

          request<IAlarmDetail>({ url: `/cx-alarm/alm/alarm/find/${msg.currentAlarm}` }).then(
            (res) => {
              if (res.code === 200) {
                console.log('debug-------5-------', res.data);
                setCurrentAlarmDeatil(res.data);
              }
            }
          );
        }
      });
    }
  };

  // 当前选中报警
  useEffect(() => {
    if (ueMapRef.current && currentAlarm !== null && currentAlarm.coordinate.coordinates) {
      setFold(false);

      const isLine = currentAlarm.coordinate.type === 'LineString';

      const obj = {
        type: 'currentAlarm',
        values: genUmapIcons([currentAlarm]),
      };
      if (ueMapRef.current.emitMessage) {
        ueMapRef.current.emitMessage(obj);
      }
    } else {
      if (ueMapRef.current && currentAlarm === null) {
        const obj = {
          type: 'currentAlarm',
          values: genUmapIcons([]),
        };
        if (ueMapRef.current.emitMessage) {
          ueMapRef.current.emitMessage(obj);
        }
      }
    }
  }, [currentAlarm]);

  return (
    <>
      <UeBaseMap getUeMapObj={getUeMapObj} />
    </>
  );
};

export default UeMap;
