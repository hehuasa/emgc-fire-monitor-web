'use client';
import { useTranslations } from 'next-intl';
import DraggablePanel from '../DraggablePanel';
import { SetStateAction, useEffect, useState } from 'react';
import { ImArrowDown, ImArrowLeft, ImArrowRight, ImArrowUp } from 'react-icons/im';
import { useMount } from 'ahooks';

const operationsMapping = {
  right: 16128, // 00100000 00000000
  left: 7936, // 00010000 00000000
  down: 65280, // 10000000 00000000
  up: 32512, // 01000000 00000000
  mist: 1792, // 00000100 00000000
  stream: 3840, // 00001000 00000000
  openValve: -192, // 00000000 01000000
  closeValve: -128, // 00000000 10000000
};
interface ArrowButtonProps {
  onDirectionChange: (direction: string) => void;
}
interface ButtonGroupProps {
  setState: (state: string) => void;
  states: string[];
}
const Select = ({
  options = ['Garbage Sorting Pit B Southwest Corner HK0396'],
}: {
  options?: string[];
}) => {
  return (
    <select className="w-full bg-[#FFFFFF1C] px-4 py-1" aria-label="select">
      {options.map((item) => (
        <option className="bg-[#0000001c]" key={item}>
          {item}
        </option>
      ))}
    </select>
  );
};
const Status = ({ status }: { status: string }) => {
  const formatMessage = useTranslations('panel');
  return (
    <div className="flex flex-row items-center justify-around w-full">
      <div className="flex flex-row items-center gap-2">
        <div
          className={`rounded-full w-[11px] h-[11px] ${status === 'running' ? 'bg-[#00FF00]' : 'bg-[#4C565A]'}`}
        />
        <div>{formatMessage('operation-cannon-running')}</div>
      </div>
      <div className="flex flex-row items-center gap-2">
        <div
          className={`rounded-full w-[11px] h-[11px] ${status === 'stop' ? 'bg-[#00FF00]' : 'bg-[#4C565A]'}`}
        />
        <div>{formatMessage('operation-cannon-stop')}</div>
      </div>
      <div className="flex flex-row items-center gap-2">
        <div
          className={`rounded-full w-[11px] h-[11px] ${status === 'notConnected' ? 'bg-[#00FF00]' : 'bg-[#4C565A]'}`}
        />
        <div>{formatMessage('operation-cannon-notConnected')}</div>
      </div>
    </div>
  );
};

const ArrowPanel = ({
  direction,
  setDirection,
}: {
  direction: string | null;
  setDirection: React.Dispatch<SetStateAction<string | null>>;
}) => {
  const formatMessage = useTranslations('panel');
  const handleButtonClick = (direction: string) => {
    if (direction === direction) {
      setDirection(null);
    } else {
      setDirection(direction);
    }
  };

  const handleMouseDown = (direction: string) => {
    setDirection(direction);
  };

  const handleMouseUp = () => {
    setDirection(null);
  };

  useMount(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  });

  return (
    <div className="flex flex-col items-center justify-center gap-1">
      <button
        className={`rounded-full w-[69px] h-[47px] bg-[#FFFFFF1C]`}
        onMouseDown={() => handleMouseDown('up')}
        aria-label="up"
      >
        <ImArrowUp
          className={`${direction === 'up' ? 'text-[#0078EC]' : 'text-white'} w-[22px] h-[28px] m-auto`}
        />
      </button>

      <div className="flex gap-4 items-center">
        <button
          className={`rounded-full w-[69px] h-[47px] bg-[#FFFFFF1C]`}
          onMouseDown={() => handleMouseDown('left')}
          aria-label="left"
        >
          <ImArrowLeft
            className={`${direction === 'left' ? 'text-[#0078EC]' : 'text-white'} w-[22px] h-[28px] m-auto`}
          />
        </button>
        <button className={`rounded-full w-[69px] h-[36px] bg-[#FFFFFF3F] cursor-default`}>
          {formatMessage('operation-cannon-direction')}
        </button>
        <button
          className={`rounded-full w-[69px] h-[47px] bg-[#FFFFFF1C]`}
          onMouseDown={() => handleMouseDown('right')}
          aria-label="right"
        >
          <ImArrowRight
            className={`${direction === 'right' ? 'text-[#0078EC]' : 'text-white'} w-[22px] h-[28px] m-auto`}
          />
        </button>
      </div>

      <button
        className={`rounded-full w-[69px] h-[47px] bg-[#FFFFFF1C]`}
        onMouseDown={() => handleMouseDown('down')}
        aria-label="down"
      >
        <ImArrowDown
          className={`${direction === 'down' ? 'text-[#0078EC]' : 'text-white'} w-[22px] h-[28px] m-auto`}
        />
      </button>
    </div>
  );
};

const ButtonGroup = ({ setState, states }: ButtonGroupProps) => {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const formatMessage = useTranslations('panel');
  const handleButtonClick = (state: string) => {
    if (selectedState === state) {
      setSelectedState(null);
      setState('');
    } else {
      setSelectedState(state);
      setState(state);
    }
  };

  return (
    <div className="flex flex-col gap-y-3">
      {states.map((state) => (
        <button
          key={state}
          className={`rounded-full text-[base] w-[94px] h-[36px] ${selectedState === state ? 'bg-[#0078EC]' : 'bg-[#FFFFFF1C]'}`}
          onClick={() => handleButtonClick(state)}
        >
          {formatMessage(`operation-cannon-${state}`)}
        </button>
      ))}
    </div>
  );
};

const CannonPanel = ({ pos = { x: 0, y: 0 } }: { pos?: { x: number; y: number } }) => {
  const formatMessage = useTranslations('panel');
  const [direction, setDirection] = useState<string | null>(null);
  const [spray, setSpray] = useState('spray');
  const [valve, setValve] = useState('openValve');
  const [stream, setStream] = useState('mist');
  useEffect(() => {
    const value =
      (spray === 'spray' ? 1 : 0) |
      operationsMapping[valve as keyof typeof operationsMapping] |
      operationsMapping[stream as keyof typeof operationsMapping] |
      operationsMapping[direction as keyof typeof operationsMapping];
  }, [spray, valve, stream, direction]);
  return (
    <DraggablePanel pos={pos}>
      <div className="flex flex-col px-11 py-4 items-center gap-y-4 text-white text-[14px]">
        <Select />
        <Status status={'running'} />
        <ArrowPanel direction={direction} setDirection={setDirection} />
        <div className="grid grid-cols-3 gap-4">
          <ButtonGroup setState={setSpray} states={['spray', 'stopSpray']} />
          <ButtonGroup setState={setValve} states={['openValve', 'closeValve']} />
          <ButtonGroup setState={setStream} states={['mist', 'stream']} />
        </div>
      </div>
    </DraggablePanel>
  );
};
export default CannonPanel;
