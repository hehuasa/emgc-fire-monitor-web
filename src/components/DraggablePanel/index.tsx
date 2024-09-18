'use client';
import { useMount } from 'ahooks';
import { useState, useRef } from 'react';

const DraggablePanel = ({
  children,
  pos = { x: 0, y: 0 },
  visible = true,
}: {
  children?: JSX.Element;
  pos?: { x: number; y: number };
  visible?: boolean;
}) => {
  const [position, setPosition] = useState(pos);
  const positionRef = useRef(pos);
  const panelRef = useRef<HTMLDivElement>(null);

  useMount(() => {
    if (!panelRef.current) return;

    const panel = panelRef.current;
    panel.style.cursor = 'move';
    let isDragging = false;
    let initialX = 0;
    let initialY = 0;

    const handleMouseDown = (event: MouseEvent) => {
      isDragging = true;
      initialX = event.clientX;
      initialY = event.clientY;
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging) return;
      const newX = positionRef.current.x + (event.clientX - initialX);
      const newY = positionRef.current.y + (event.clientY - initialY);
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = (event: MouseEvent) => {
      if (isDragging) {
        const newX = positionRef.current.x + (event.clientX - initialX);
        const newY = positionRef.current.y + (event.clientY - initialY);
        positionRef.current = { x: newX, y: newY };
      }
      isDragging = false;
    };

    panel.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      panel.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  });

  return (
    <div
      ref={panelRef}
      className={`${visible ? 'w-[402px] h-[368px]' : 'w-0 h-0 overflow-hidden'} bg-[#00000088] absolute z-[999]`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {children}
    </div>
  );
};

export default DraggablePanel;
