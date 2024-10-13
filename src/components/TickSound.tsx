import React, { useEffect, useRef } from 'react';

interface TickSoundProps {
  isActive: boolean;
}

const TickSound: React.FC<TickSoundProps> = ({ isActive }) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  useEffect(() => {
    if (isActive) {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const playTick = () => {
        const context = audioContextRef.current!;
        oscillatorRef.current = context.createOscillator();
        oscillatorRef.current.type = 'sine';
        oscillatorRef.current.frequency.setValueAtTime(800, context.currentTime);

        const gainNode = context.createGain();
        gainNode.gain.setValueAtTime(0.1, context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.1);

        oscillatorRef.current.connect(gainNode);
        gainNode.connect(context.destination);

        oscillatorRef.current.start();
        oscillatorRef.current.stop(context.currentTime + 0.1);
      };

      const intervalId = setInterval(playTick, 1000);

      return () => {
        clearInterval(intervalId);
        if (oscillatorRef.current) {
          oscillatorRef.current.stop();
          oscillatorRef.current.disconnect();
        }
      };
    }
  }, [isActive]);

  return null;
};

export default TickSound;