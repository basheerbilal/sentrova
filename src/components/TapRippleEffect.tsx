import React, { useEffect, useState } from 'react';

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

export const TapRippleEffect: React.FC = () => {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  useEffect(() => {
    let nextId = 0;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }

      // Check if tap/click was on or inside interactive element
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isInteractive = target.closest('a, button, [role="button"], input, select, textarea, .tap-target, .glass-nav-item, .glass-pill');
      
      // Calculate ripple size based on target or default to 50px
      const size = isInteractive ? 48 : 36;
      const rippleId = ++nextId;

      setRipples((prev) => [
        ...prev.slice(-4), // keep max 5 active ripples for ultra performance
        { id: rippleId, x: clientX, y: clientY, size },
      ]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== rippleId));
      }, 420);
    };

    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full -translate-x-1/2 -translate-y-1/2 animate-tap-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            background: 'radial-gradient(circle, rgba(8, 123, 255, 0.4) 0%, rgba(56, 189, 248, 0.25) 45%, rgba(8, 123, 255, 0) 70%)',
          }}
        />
      ))}
    </div>
  );
};
