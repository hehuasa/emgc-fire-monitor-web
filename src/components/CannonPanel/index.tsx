'use client';
import { useTranslations } from 'next-intl';
import DraggablePanel from '../DraggablePanel';
import { useEffect, useState } from 'react';
import { ImArrowDown, ImArrowLeft, ImArrowRight, ImArrowUp } from 'react-icons/im';
interface ArrowButtonProps {
  onDirectionChange: (direction: string) => void;
}
interface ButtonGroupProps {
  setState: (state: string) => void;
  states: string[];
}
const Select = () => {
  return (
    <select className="w-full bg-[#FFFFFF1C] px-4 py-1" aria-label="select">
      <option className="bg-[#0000001c]">1</option>
      <option className="bg-[#0000001c]">2</option>
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

const ArrowPanel = ({ onDirectionChange }: ArrowButtonProps) => {
  const [selectedDirection, setSelectedDirection] = useState<string | null>(null);
  const formatMessage = useTranslations('panel');
  const handleButtonClick = (direction: string) => {
    if (selectedDirection === direction) {
      setSelectedDirection(null);
      onDirectionChange('');
    } else {
      setSelectedDirection(direction);
      onDirectionChange(direction);
    }
  };

  const handleMouseDown = (direction: string) => {
    setSelectedDirection(direction);
    onDirectionChange(direction);
  };

  const handleMouseUp = () => {
    setSelectedDirection(null);
    onDirectionChange('');
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-1">
      <button
        className={`rounded-full w-[69px] h-[47px] bg-[#FFFFFF1C]`}
        onMouseDown={() => handleMouseDown('up')}
        aria-label="up"
      >
        <ImArrowUp
          className={`${selectedDirection === 'up' ? 'text-[#0078EC]' : 'text-white'} w-[22px] h-[28px] m-auto`}
        />
      </button>

      <div className="flex gap-4 items-center">
        <button
          className={`rounded-full w-[69px] h-[47px] bg-[#FFFFFF1C]`}
          onMouseDown={() => handleMouseDown('left')}
          aria-label="left"
        >
          <ImArrowLeft
            className={`${selectedDirection === 'left' ? 'text-[#0078EC]' : 'text-white'} w-[22px] h-[28px] m-auto`}
          />
        </button>
        <button
          className={`rounded-full w-[69px] h-[36px] bg-[#FFFFFF3F]`}
          onClick={() => handleButtonClick('right')}
        >
          {formatMessage('operation-cannon-direction')}
        </button>
        <button
          className={`rounded-full w-[69px] h-[47px] bg-[#FFFFFF1C]`}
          onMouseDown={() => handleMouseDown('right')}
          aria-label="right"
        >
          <ImArrowRight
            className={`${selectedDirection === 'right' ? 'text-[#0078EC]' : 'text-white'} w-[22px] h-[28px] m-auto`}
          />
        </button>
      </div>

      <button
        className={`rounded-full w-[69px] h-[47px] bg-[#FFFFFF1C]`}
        onMouseDown={() => handleMouseDown('down')}
        aria-label="down"
      >
        <ImArrowDown
          className={`${selectedDirection === 'down' ? 'text-[#0078EC]' : 'text-white'} w-[22px] h-[28px] m-auto`}
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

const CannonPanel = () => {
  const formatMessage = useTranslations('panel');
  const [spray, setSpray] = useState('spray');
  const [valve, setValve] = useState('openValve');
  const [stream, setStream] = useState('mist');
  return (
    <DraggablePanel>
      <div className="flex flex-col px-11 py-4 items-center gap-y-4 text-white text-[14px]">
        <Select />
        <Status status={'running'} />
        <ArrowPanel
          onDirectionChange={(direction) => console.log('Direction changed:', direction)}
        />
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
