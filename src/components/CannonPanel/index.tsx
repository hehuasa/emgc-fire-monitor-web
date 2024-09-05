// CannonPanel.tsx
import { useMount } from 'ahooks';
import React, { useState, useRef } from 'react';

const CannonPanel = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const positionRef = useRef({ x: 0, y: 0 });
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
      console.log('event:', event.clientX, event.clientY, 'position:', position);
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging) return;
      const newX = position.x + (event.clientX - initialX);
      const newY = position.y + (event.clientY - initialY);
      setPosition({ x: newX, y: newY });
      positionRef.current = { x: newX, y: newY };
      console.log('position:', position, 'new:', newX, newY);
    };

    const handleMouseUp = () => {
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
      className="w-[402px] h-[368px] bg-[#00000088] relative"
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div className="p-[16px]"></div>
    </div>
  );
};

export default CannonPanel;
