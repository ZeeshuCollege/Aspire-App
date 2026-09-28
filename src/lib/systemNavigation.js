import { useState, useEffect, useRef } from 'react';
import { registerPlugin } from '@capacitor/core';

// Register native SystemNavigation plugin if available on Android/iOS
const NativeSystemNav = registerPlugin('SystemNavigation');

/**
 * Measure CSS safe area insets via DOM probe (useful for iOS Safari, Web PWA)
 */
function probeCssInsets() {
  if (typeof document === 'undefined') {
    return { top: 0, bottom: 0 };
  }

  try {
    const probe = document.createElement('div');
    probe.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 0;
      height: 0;
      padding-top: env(safe-area-inset-top, 0px);
      padding-bottom: env(safe-area-inset-bottom, 0px);
      visibility: hidden;
      pointer-events: none;
      z-index: -9999;
    `;
    document.documentElement.appendChild(probe);
    const style = window.getComputedStyle(probe);
    const top = parseFloat(style.paddingTop) || 0;
    const bottom = parseFloat(style.paddingBottom) || 0;
    probe.remove();
    return { top, bottom };
  } catch (e) {
    return { top: 0, bottom: 0 };
  }
}

/**
 * Determine navigation mode and dimensions
 */
export function computeSystemNavigationState(override = {}) {
  const cssInsets = probeCssInsets();

  // Check if Native Android / Capacitor has communicated state
  const nativeNav = (typeof window !== 'undefined' && window.__SYSTEM_NAV__) || {};

  const top = typeof override.top === 'number'
    ? override.top
    : (nativeNav.top || cssInsets.top || 0);

  const bottom = typeof override.bottom === 'number'
    ? override.bottom
    : (nativeNav.bottom !== undefined ? nativeNav.bottom : cssInsets.bottom || 0);

  // Gesture Navigation vs 3-Button Navigation:
  // On iOS (iPhone X+), cssInsets.bottom is 34px in portrait (gesture bar).
  // On Android, nativeNav.navMode is "gesture" or "buttons".
  // If in web browser with > 16px bottom inset, it's iOS gesture.
  // If native reported buttons, use buttons.
  let isGesture = true;
  let navMode = 'gesture';

  if (override.navMode) {
    navMode = override.navMode;
    isGesture = navMode === 'gesture';
  } else if (nativeNav.navMode) {
    navMode = nativeNav.navMode;
    isGesture = nativeNav.isGesture !== undefined ? nativeNav.isGesture : (navMode === 'gesture');
  } else if (bottom >= 36) {
    // Large bottom bar without gesture reports is likely 3-button bar or landscape
    navMode = 'buttons';
    isGesture = false;
  } else if (bottom > 0) {
    // iOS gesture bar (~34px) or Android gesture pill (~16-24px)
    navMode = 'gesture';
    isGesture = true;
  }

  // Keyboard detection:
  let keyboardOpen = false;
  let imeHeight = override.ime || nativeNav.ime || 0;

  if (override.keyboardOpen !== undefined) {
    keyboardOpen = override.keyboardOpen;
  } else if (nativeNav.keyboardOpen !== undefined) {
    keyboardOpen = nativeNav.keyboardOpen;
  } else if (typeof window !== 'undefined' && window.visualViewport) {
    const heightDiff = window.innerHeight - window.visualViewport.height;
    if (heightDiff > 140) {
      keyboardOpen = true;
      imeHeight = heightDiff;
    }
  }

  // Calculate dynamic bottom padding for BottomNav:
  // In 3-Button Mode: 3 buttons occupy the bottom ~48px.
  // Tabs need compact spacing (6px) above the buttons.
  // In Gesture Mode: A thin line / gesture pill sits at bottom.
  // Tabs need ample spacing (~26px total) so swipe-up home gesture doesn't misclick tabs.
  const safeBottom = Math.max(bottom, 0);
  const bottomNavPadBottom = navMode === 'buttons'
    ? `calc(${safeBottom}px + 6px)`
    : `calc(${Math.max(safeBottom, 20)}px + 8px)`;

  const bottomNavTotalHeight = navMode === 'buttons'
    ? 54 + safeBottom + 6
    : 54 + Math.max(safeBottom, 20) + 8;

  const contentPaddingBottom = `${bottomNavTotalHeight + 14}px`;

  return {
    top,
    bottom: safeBottom,
    navMode,
    isGesture,
    isKeyboardOpen: keyboardOpen,
    imeHeight,
    bottomNavPadBottom,
    bottomNavTotalHeight,
    contentPaddingBottom
  };
}

/**
 * Apply CSS variables to :root so entire stylesheet adapts automatically
 */
export function applyNavigationCssVariables(state) {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  root.style.setProperty('--safe-area-top', `${state.top}px`);
  root.style.setProperty('--safe-area-bottom', `${state.bottom}px`);
  root.style.setProperty('--keyboard-inset', `${state.imeHeight}px`);
  root.style.setProperty('--bottom-nav-pad-bottom', state.bottomNavPadBottom);
  root.style.setProperty('--bottom-nav-height', `${state.bottomNavTotalHeight}px`);
  root.style.setProperty('--content-padding-bottom', state.contentPaddingBottom);

  root.setAttribute('data-nav-mode', state.navMode);
  root.setAttribute('data-keyboard-open', state.isKeyboardOpen ? 'true' : 'false');
}

/**
 * React Hook for dynamic system navigation responsiveness
 */
export function useSystemNavigation() {
  const [navState, setNavState] = useState(() => {
    const initial = computeSystemNavigationState();
    applyNavigationCssVariables(initial);
    return initial;
  });

  useEffect(() => {
    const update = (override = {}) => {
      const next = computeSystemNavigationState(override);
      applyNavigationCssVariables(next);
      setNavState(next);
    };

    // 1. Check Native Plugin on mount
    try {
      if (NativeSystemNav?.getInfo) {
        NativeSystemNav.getInfo().then((res) => {
          if (res) {
            update({
              top: res.top,
              bottom: res.bottom,
              navMode: res.navMode,
              isGesture: res.isGesture,
              ime: res.ime,
              keyboardOpen: res.keyboardOpen
            });
          }
        }).catch(() => {});
      }
    } catch (e) {}

    // 2. Window Custom Event from Android Bridge
    const handleSystemNavChange = (e) => {
      if (e.detail) {
        update(e.detail);
      }
    };
    window.addEventListener('systemNavChange', handleSystemNavChange);

    // Global callback fallback
    window.__onSystemNavChange = (info) => {
      update(info);
    };

    // 3. Visual Viewport Resize (Web/PWA/iOS keyboard & rotation)
    const handleViewportResize = () => {
      update();
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportResize);
      window.visualViewport.addEventListener('scroll', handleViewportResize);
    }
    window.addEventListener('resize', handleViewportResize);
    window.addEventListener('orientationchange', handleViewportResize);

    // Initial update to sync
    update();

    return () => {
      window.removeEventListener('systemNavChange', handleSystemNavChange);
      if (window.__onSystemNavChange === handleSystemNavChange) {
        window.__onSystemNavChange = null;
      }
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportResize);
        window.visualViewport.removeEventListener('scroll', handleViewportResize);
      }
      window.removeEventListener('resize', handleViewportResize);
      window.removeEventListener('orientationchange', handleViewportResize);
    };
  }, []);

  return navState;
}

/**
 * Mobile Bottom-Sheet Gesture Hook: Swipe Down to Dismiss
 * Allows dragging bottom sheets down to dismiss smoothly like iOS / Android sheets
 */
export function useSwipeDownDismiss(onDismiss, threshold = 65) {
  const [dragOffset, setDragOffset] = useState(0);
  const touchStartY = useRef(null);

  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length > 0) {
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e) => {
    if (touchStartY.current === null || !e.touches || e.touches.length === 0) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStartY.current;
    if (diff > 0) {
      setDragOffset(diff);
    }
  };

  const handleTouchEnd = () => {
    if (dragOffset > threshold) {
      if (onDismiss) onDismiss();
    }
    setDragOffset(0);
    touchStartY.current = null;
  };

  return {
    dragOffset,
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onTouchCancel: handleTouchEnd
    }
  };
}
