'use client';

const AlarmPanel = ({ operation }: { operation: () => void }) => {
  const formatMessage = useTranslations('panel');
  return (
    <div className="w-[274px] h-[237px] bg-[#00000088] text-white text-[14px]">
      <div className="bg-[#F59A23] w-full h-[43px] leading-[43px] pl-2">
        {formatMessage('alarm-panel-title')}
      </div>
      <div className="flex flex-col gap-y-4 p-[16px] items-start">
        <div className=" text-[16px] font-bold">{formatMessage('alarm-panel-content')}</div>
        <div>{`${formatMessage('alarm-panel-time')}: 09-04 10:27`}</div>
        <button className="bg-[#F59A2388] px-4 py-2 whitespace-nowrap" onClick={operation}>
          {`${formatMessage('alarm-panel-operation')} >>`}
        </button>
      </div>
    </div>
  );
};
export default AlarmPanel;
