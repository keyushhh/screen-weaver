import React, { useState, useRef, useEffect } from 'react';
import slideTrack from '@/assets/slide-to-pay-track.png';
import slideSuccess from '@/assets/slide-to-pay-success.png';
import swipeCircle from '@/assets/swipe-circle.png';
import swipeIcon from '@/assets/swipe.svg';

interface SlideToPayProps {
  onComplete: () => void;
  className?: string;
}

export const SlideToPay: React.FC<SlideToPayProps> = ({ onComplete, className = "" }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [completed, setCompleted] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (completed) return;
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    startX.current = clientX - dragX;
  };

  const handleMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging || completed || !trackRef.current || !thumbRef.current) return;

    const clientX = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
    const newX = clientX - startX.current;

    const trackWidth = trackRef.current.clientWidth;
    const thumbWidth = thumbRef.current.clientWidth;
    const maxDrag = trackWidth - thumbWidth - (trackWidth * 0.05);

    if (newX >= 0 && newX <= maxDrag) {
      setDragX(newX);
    } else if (newX > maxDrag) {
      setDragX(maxDrag);
    }
  };

  const handleEnd = () => {
    if (!isDragging || completed) return;
    setIsDragging(false);

    if (!trackRef.current || !thumbRef.current) return;

    const trackWidth = trackRef.current.clientWidth;
    const thumbWidth = thumbRef.current.clientWidth;
    const maxDrag = trackWidth - thumbWidth - (trackWidth * 0.05);

    if (dragX > maxDrag * 0.85) {
      setCompleted(true);
      setDragX(maxDrag);
      setTimeout(() => {
          onComplete();
      }, 2000);
    } else {
      setDragX(0);
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleMove);
      window.addEventListener('touchend', handleEnd);
    } else {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, dragX, completed]);

  return (
    <div
      ref={trackRef}
      data-testid="slide-to-pay-track"
      className={`relative w-full select-none ${className}`}
      style={{
        aspectRatio: '1444/256',
        backgroundImage: `url(${completed ? slideSuccess : slideTrack})`,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        transition: 'background-image 0.3s ease'
      }}
    >
        {/* Overlay Text */}
        <div
            data-testid="slide-to-pay-text"
            className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300`}
        >
             <span className={`text-white text-[16px] font-medium font-sans tracking-wide drop-shadow-md ${!completed && 'ml-8'}`}>
                {completed ? "Verifying Order" : "Confirm and Place Order"}
             </span>
        </div>

      {/* Thumb - Hide when completed */}
      {!completed && (
        <div
            ref={thumbRef}
            onMouseDown={handleStart}
            onTouchStart={handleStart}
            className="absolute top-1/2 left-[2%] cursor-grab active:cursor-grabbing z-10 flex items-center justify-center"
            style={{
                transform: `translate(${dragX}px, -50%)`,
                transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                height: '82%',
                aspectRatio: '1/1',
                backgroundImage: `url(${swipeCircle})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat'
            }}
        >
            {/* Swipe Icon */}
            <img
                src={swipeIcon}
                alt=""
                className="w-[40%] h-[40%] object-contain pointer-events-none"
            />
        </div>
      )}
    </div>
  );
};
