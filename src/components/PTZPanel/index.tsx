'use client';

import { useEffect, useRef, useState } from 'react';
import DraggablePanel from '../DraggablePanel';
import { PiMinusFill, PiPlusFill } from 'react-icons/pi';
import {
  BiSolidDownArrow,
  BiSolidLeftArrow,
  BiSolidRightArrow,
  BiSolidUpArrow,
} from 'react-icons/bi';
import { useTranslations } from 'next-intl';
import { request } from '@/utils/request';
import { useMemoizedFn, useSafeState } from 'ahooks';
import arrowPanel from '@/assets/panel/arrowPanel.png';
import reset from '@/assets/panel/reset.png';
import resetActive from '@/assets/panel/resetActive.png';
import Image from 'next/image';
interface Props {
  closePtz: () => void;
  cameraId: string;
  pos?: { x: number; y: number };
  visible?: boolean;
}
interface ArrowButtonProps {
  onDirectionChange: (direction: string) => void;
}
type PTZebum =
  | 'DOWN'
  | 'LEFT'
  | 'LEFT_DOWN'
  | 'LEFT_UP'
  | 'RIGHT'
  | 'RIGHT_DOWN'
  | 'RIGHT_UP'
  | 'UP'
  | 'ZOOM_IN'
  | 'ZOOM_OUT'
  | 'RESET';
const ArrowPanel = ({
  startPtz,
  stopPtz,
}: {
  startPtz: (ptzEnum: PTZebum) => void;
  stopPtz: (ptzEnum: PTZebum) => void;
}) => {
  const [direction, setDirection] = useState<PTZebum | null>(null);
  const directionRef = useRef(direction);

  const handleMouseDown = (direction: PTZebum) => {
    directionRef.current = direction;
    setDirection(direction);
    if (direction === 'RESET') {
      //todo
    } else {
      startPtz(direction);
    }
  };

  const handleMouseUp = () => {
    if (directionRef.current) stopPtz(directionRef.current);
    directionRef.current = null;
    setDirection(null);
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center gap-4 relative w-[186px] h-[186px]"
      style={{ backgroundImage: `url(${arrowPanel.src})` }}
    >
      <button
        className="w-[55px] h-[40px]"
        onMouseDown={() => handleMouseDown('UP')}
        aria-label="up"
      >
        <BiSolidUpArrow
          className={`${direction === 'UP' ? 'text-[#0078EC]' : 'text-white'} w-[22px] h-[28px] m-auto`}
        />
      </button>

      <div className="flex gap-4 items-center">
        <button
          className="w-[40px] h-[55px]"
          onMouseDown={() => handleMouseDown('LEFT')}
          aria-label="left"
        >
          <BiSolidLeftArrow
            className={`${direction === 'LEFT' ? 'text-[#0078EC]' : 'text-white'} w-[22px] h-[28px] m-auto`}
          />
        </button>
        <button className={`rounded-full w-[52px] h-[52px] relative`} aria-label="reset">
          <div className="absolute w-[7px] h-[7px] -top-[20px] -left-[20px] rounded-full bg-white" />
          <div className="absolute w-[7px] h-[7px] -top-[20px] -right-[20px] rounded-full bg-white" />
          <div className="absolute w-[7px] h-[7px] -bottom-[20px] -right-[20px] rounded-full bg-white" />
          <div className="absolute w-[7px] h-[7px] -bottom-[20px] -left-[20px] rounded-full bg-white" />
          <Image
            src={direction === 'RESET' ? resetActive : reset}
            alt="reset"
            draggable={false}
            onMouseDown={() => handleMouseDown('RESET')}
            className="m-auto"
          />
        </button>
        <button
          className="w-[40px] h-[55px]"
          onMouseDown={() => handleMouseDown('RIGHT')}
          aria-label="right"
        >
          <BiSolidRightArrow
            className={`${direction === 'RIGHT' ? 'text-[#0078EC]' : 'text-white'} w-[22px] h-[28px] m-auto`}
          />
        </button>
      </div>

      <button
        className="w-[55px] h-[40px]"
        onMouseDown={() => handleMouseDown('DOWN')}
        aria-label="down"
      >
        <BiSolidDownArrow
          className={`${direction === 'DOWN' ? 'text-[#0078EC]' : 'text-white'} w-[22px] h-[28px] m-auto`}
        />
      </button>
    </div>
  );
};
const Select = () => {
  return (
    <select className="w-full bg-[#FFFFFF1C] px-4 py-1" aria-label="select">
      <option className="bg-[#0000001c]">1</option>
      <option className="bg-[#0000001c]">2</option>
    </select>
  );
};

const PTZPanel = ({ closePtz, cameraId, pos = { x: 0, y: 0 }, visible }: Props) => {
  const deviceName = 'Garbage Sorting Pit B Southwest Corner HK0396';
  const [zoom, setZoom] = useState('');
  const formatMessage = useTranslations('panel');
  const [animate, setAnimate] = useSafeState(false);
  const postion = useRef<{ name: PTZebum; deg: string }[]>([
    { name: 'UP', deg: '0deg' },
    { name: 'RIGHT_UP', deg: '45deg' },
    { name: 'RIGHT', deg: '90deg' },
    { name: 'RIGHT_DOWN', deg: '135deg' },
    { name: 'DOWN', deg: '180deg' },
    { name: 'LEFT_DOWN', deg: '225deg' },
    { name: 'LEFT', deg: '270deg' },
    { name: 'LEFT_UP', deg: '315deg' },
  ]);

  //判断鼠标是否按下，mousedown触发的是否如果鼠标移动了 不会触发mouseup这里加一个mouseleave来解决
  const mouseDown = useRef(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const [showbg, setShowbg] = useSafeState('');

  const onTransitionEnd = useMemoizedFn((e) => {
    console.log('ee', e.target.style.right);
    const warp = e.target as unknown as HTMLDivElement;
    if (parseFloat(warp.style.right) !== 0 && e.propertyName === 'right') {
      closePtz();
    }
  });

  const startPtz = (ptzEnum: PTZebum) => {
    const url = '/ms-gateway/device-manger/camera/controlling';
    request({
      url,
      options: {
        method: 'post',
        body: JSON.stringify({
          cameraId,
          ptzEnum,
          startOrStop: true,
        }),
      },
    });
  };
  const stopPtz = (ptzEnum: PTZebum) => {
    const url = '/ms-gateway/device-manger/camera/controlling';
    request({
      url,
      options: {
        method: 'post',
        body: JSON.stringify({
          cameraId,
          ptzEnum,
          startOrStop: false,
        }),
      },
    });
  };

  return (
    <DraggablePanel pos={pos} visible={visible}>
      <div className="flex flex-col px-8 py-5 items-center gap-y-5 text-white text-[14px]">
        {deviceName}
        <ArrowPanel startPtz={startPtz} stopPtz={stopPtz} />
        <div className="grid grid-cols-3 gap-4 items-center justify-items-center">
          <button
            className={`${zoom === 'out' ? 'text-[#0078EC]' : 'text-white'}`}
            aria-label="zoom-out"
            onMouseDown={() => {
              setZoom('out');
              mouseDown.current = true;
              startPtz('ZOOM_OUT');
            }}
            onMouseUp={() => {
              setZoom('');
              mouseDown.current = false;
              stopPtz('ZOOM_OUT');
            }}
            onMouseLeave={() => {
              if (mouseDown.current) {
                setZoom('');
                mouseDown.current = false;
                stopPtz('ZOOM_OUT');
              }
            }}
          >
            <PiMinusFill className="w-[24px] h-[24px]" />
          </button>
          {formatMessage('operation-PTZ-zoom')}
          <button
            className={`${zoom === 'in' ? 'text-[#0078EC]' : 'text-white'}`}
            aria-label="zoom-in"
            onMouseDown={() => {
              setZoom('in');
              mouseDown.current = true;
              startPtz('ZOOM_IN');
            }}
            onMouseUp={() => {
              setZoom('');
              mouseDown.current = false;
              stopPtz('ZOOM_IN');
            }}
            onMouseLeave={() => {
              if (mouseDown.current) {
                setZoom('');
                mouseDown.current = false;
                stopPtz('ZOOM_IN');
              }
            }}
            onClick={() => console.log('click')}
          >
            <PiPlusFill className={`w-[24px] h-[24px] ${mouseDown.current}`} />
          </button>
        </div>
        <div className="flex gap-x-4 w-full items-center">
          <div className="whitespace-nowrap">{formatMessage('operation-PTZ-preset')}</div>
          <Select />
        </div>
      </div>
    </DraggablePanel>
  );
};
export default PTZPanel;
