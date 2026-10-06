import { Capacitor, registerPlugin } from '@capacitor/core';
import { supabase } from './supabaseClient';

const NativeAppPermissions = registerPlugin('AppPermissions');

// BroadcastChannel for instant cross-tab / cross-window synchronization
let noticesBroadcastChannel = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    noticesBroadcastChannel = new BroadcastChannel('aspire_notices_channel');
  }
} catch (e) {
  console.warn('BroadcastChannel not supported:', e);
}

/**
 * Triggers a real, native OS/system notification pop-up (Heads-up notification banner).
 * On Android: Uses NotificationCompat with HIGH importance channel for a heads-up pop-up banner.
 * On Browser: Uses HTML5 Notification API / ServiceWorker notification.
 */
export async function sendSystemNotification({ title, message, body, id }) {
  const notifTitle = title || '📢 Aspire Learning Centre';
  const notifMessage = message || body || 'New notification from Aspire Learning Centre';
  const notifId = id ? (typeof id === 'number' ? id : Math.abs(String(id).split('').reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0))) : Date.now();

  // 1. Android Native via Capacitor bridge
  if (Capacitor.isNativePlatform()) {
    try {
      const res = await NativeAppPermissions.showSystemNotification({
        title: notifTitle,
        message: notifMessage,
        body: notifMessage,
        id: notifId
      });
      return res;
    } catch (err) {
      console.warn('[NotificationService] Native Android notification failed:', err);
    }
  }

  // 2. Web Notification Fallback
  try {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        const notif = new Notification(notifTitle, {
          body: notifMessage,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: String(notifId),
          vibrate: [200, 100, 200]
        });
        notif.onclick = () => {
          window.focus();
          notif.close();
        };
        return { success: true };
      } else if (Notification.permission !== 'denied') {
        const perm = await Notification.requestPermission();
        if (perm === 'granted') {
          new Notification(notifTitle, {
            body: notifMessage,
            icon: '/favicon.ico',
            tag: String(notifId)
          });
          return { success: true };
        }
      }
    }
  } catch (err) {
    console.warn('[NotificationService] Web notification failed:', err);
  }

  return { success: false };
}

/**
 * Broadcasts a newly created notice across:
 * 1. BroadcastChannel (active tabs)
 * 2. Window CustomEvent ('aspire:new-notice')
 * 3. Supabase Realtime Channel (if online)
 */
export function broadcastNotice(notice) {
  if (!notice) return;

  // 1. Send system notification immediately on the posting device
  sendSystemNotification({
    title: `📢 ${notice.title || 'Aspire Notice'}`,
    message: notice.message || 'New notice posted by Institute Admin.',
    id: notice.id
  });

  // 2. BroadcastChannel for other tabs
  if (noticesBroadcastChannel) {
    try {
      noticesBroadcastChannel.postMessage({
        type: 'NEW_NOTICE',
        notice
      });
    } catch (e) {}
  }

  // 3. Local CustomEvent for components in current window
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('aspire:new-notice', { detail: { notice } }));
  }

  // 4. Supabase broadcast if available
  try {
    if (supabase) {
      const channel = supabase.channel('aspire_live_notices');
      channel.subscribe(status => {
        if (status === 'SUBSCRIBED') {
          channel.send({
            type: 'broadcast',
            event: 'new_notice',
            payload: { notice }
          }).then(() => {
            supabase.removeChannel(channel);
          }).catch(() => {});
        }
      });
    }
  } catch (e) {}
}

/**
 * Listen for notices broadcasted from other tabs or admin
 */
export function subscribeToNoticeBroadcasts(onNoticeReceived) {
  const channelListener = (event) => {
    if (event?.data?.type === 'NEW_NOTICE' && event?.data?.notice) {
      onNoticeReceived(event.data.notice);
    }
  };

  const windowListener = (event) => {
    if (event?.detail?.notice) {
      onNoticeReceived(event.detail.notice);
    }
  };

  if (noticesBroadcastChannel) {
    noticesBroadcastChannel.addEventListener('message', channelListener);
  }
  if (typeof window !== 'undefined') {
    window.addEventListener('aspire:new-notice', windowListener);
  }

  return () => {
    if (noticesBroadcastChannel) {
      noticesBroadcastChannel.removeEventListener('message', channelListener);
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('aspire:new-notice', windowListener);
    }
  };
}
