import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export const PageProgressBar: React.FC = () => {
  const location = useLocation();
  const [animating, setAnimating] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Reset and trigger progress on route change
    setAnimating(true);
    setProgress(35);

    const timer1 = setTimeout(() => {
      setProgress(85);
    }, 80);

    const timer2 = setTimeout(() => {
      setProgress(100);
    }, 240);

    const timer3 = setTimeout(() => {
      setAnimating(false);
      setProgress(0);
    }, 450);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [location.pathname]);

  return (
    <AnimatePresence>
      {animating && (
        <div className="fixed top-0 left-0 right-0 z-[100] pointer-events-none h-[3px]">
          <motion.div
            initial={{ width: '0%', opacity: 1 }}
            animate={{ width: `${progress}%`, opacity: progress === 100 ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{
              width: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: 0.25, ease: 'easeOut' },
            }}
            className="h-full bg-gradient-to-r from-[#087BFF] via-[#38BDF8] to-[#087BFF] shadow-[0_0_12px_rgba(8,123,255,0.85)]"
          />
        </div>
      )}
    </AnimatePresence>
  );
};
