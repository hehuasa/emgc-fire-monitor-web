'use client';
import { useMount } from 'ahooks';
import { useState, useRef } from 'react';

const DraggablePanel = ({ children }: { children?: JSX.Element }) => {
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
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging) return;
      const newX = positionRef.current.x + (event.clientX - initialX);
      const newY = positionRef.current.y + (event.clientY - initialY);
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = (event: MouseEvent) => {
      isDragging = false;
      const newX = positionRef.current.x + (event.clientX - initialX);
      const newY = positionRef.current.y + (event.clientY - initialY);
      positionRef.current = { x: newX, y: newY };
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
      {children}
    </div>
  );
};

export default DraggablePanel;
