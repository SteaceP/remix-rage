import { useState, useEffect, useRef } from 'react';
import { useFramerate } from '../utils/getFramerate';

type BannerProps = {
  text: string;
  speed?: number; // Pixels per second
}

const styles = {
  container: "relative overflow-hidden w-full h-8 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800",
  banner: "whitespace-nowrap inline-flex h-full",
  text: "text-base font-medium text-white px-2 flex items-center",
  wrapper: "flex absolute left-0 top-0 h-full"
};

export const ScrollingBanner = ({ text, speed = 60 }: BannerProps): JSX.Element => {
  const [position, setPosition] = useState(0);
  const bannerRef = useRef<HTMLDivElement>(null);
  const userFps = useFramerate();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      setPosition(containerRef.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      if (bannerRef.current && containerRef.current) {
        const bannerWidth = bannerRef.current.offsetWidth;
        const containerWidth = containerRef.current.offsetWidth;
        
        setPosition((prevPosition) => {
          let newPosition = prevPosition - (speed / userFps);
          if (newPosition < -bannerWidth) {
            newPosition = containerWidth;
          }
          return newPosition;
        });
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [speed, userFps]);

  return (
    <div ref={containerRef} className={styles.container}>
      <div 
        className={styles.wrapper}
        style={{ transform: `translateX(${position}px)` }}
      >
        <div ref={bannerRef} className={styles.banner}>
          <span className={styles.text}>{text}</span>
        </div>
      </div>
    </div>
  );
};