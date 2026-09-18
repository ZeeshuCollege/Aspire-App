import React, { useRef, useEffect, useState } from 'react';

/**
 * ScreenSlider Component
 * Provides hardware-accelerated horizontal sliding animations between all tabs/screens.
 * Fast multi-screen velocity curve zips past intermediate screens with rapid reel dynamics
 * before softly landing on the destination screen.
 */
export default function ScreenSlider({ activeTab, tabs, onNavigate, roleKey }) {
  // Find current index of active tab
  const activeIndex = Math.max(0, tabs.findIndex(t => t.id === activeTab));
  
  const prevIndexRef = useRef(activeIndex);
  const prevRoleRef = useRef(roleKey);
  const [duration, setDuration] = useState(0);

  // Touch swipe support for native mobile gestures
  const touchStartXRef = useRef(null);
  const touchStartYRef = useRef(null);

  useEffect(() => {
    // If role changed (e.g. Student -> Teacher), switch instantly without sliding across roles
    if (prevRoleRef.current !== roleKey) {
      prevRoleRef.current = roleKey;
      prevIndexRef.current = activeIndex;
      setDuration(0);
      return;
    }

    const prev = prevIndexRef.current;
    const dist = Math.abs(activeIndex - prev);

    if (dist === 0) {
      setDuration(0);
    } else if (dist === 1) {
      // Adjacent screen transition: smooth, quick glide
      setDuration(300);
    } else if (dist === 2) {
      // 2 screen jump: fast sweep (190ms per screen)
      setDuration(380);
    } else if (dist === 3) {
      // 3 screen jump: rapid zip past intermediate screens (143ms per screen)
      setDuration(430);
    } else {
      // 4+ screen jump: ultra-fast reel across full track (120ms per screen)
      setDuration(480);
    }

    prevIndexRef.current = activeIndex;
  }, [activeIndex, roleKey]);

  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const diffX = e.changedTouches[0].clientX - touchStartXRef.current;
    const diffY = e.changedTouches[0].clientY - touchStartYRef.current;

    // Minimum swipe threshold of 50px and must be predominantly horizontal
    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY) * 1.4) {
      if (diffX < 0 && activeIndex < tabs.length - 1) {
        // Swiped Left -> go to next screen
        if (onNavigate) onNavigate(tabs[activeIndex + 1].id);
      } else if (diffX > 0 && activeIndex > 0) {
        // Swiped Right -> go to previous screen
        if (onNavigate) onNavigate(tabs[activeIndex - 1].id);
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  return (
    <div
      className="screen-slider-viewport"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="screen-slider-track"
        style={{
          transform: `translate3d(-${activeIndex * 100}%, 0, 0)`,
          transition: duration > 0 ? `transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1)` : 'none',
          willChange: 'transform'
        }}
      >
        {tabs.map((tab, idx) => (
          <div
            key={tab.id}
            className="screen-slide"
            aria-hidden={activeIndex !== idx}
          >
            {tab.component}
          </div>
        ))}
      </div>
    </div>
  );
}
