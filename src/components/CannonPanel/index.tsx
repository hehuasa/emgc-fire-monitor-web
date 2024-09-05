'use client';
import { useTranslations } from 'next-intl';
import DraggablePanel from '../DraggablePanel';
const operationList = [''];
const ArrowPanel = () => {
  return (
    <DraggablePanel>
      <div className="flex-col p-4 items-center">
        {/* <select><option>1</option><option>2</option></select> */}
      </div>
    </DraggablePanel>
  );
};
const CannonPanel = () => {
  const formatMessage = useTranslations('panel');
  return (
    <DraggablePanel>
      <div className="flex-col p-4 items-center">
        {/* <select><option>1</option><option>2</option></select> */}
        <div className="grid grid-cols-3 gap-4"></div>
      </div>
    </DraggablePanel>
  );
};
export default CannonPanel;
