/**
 * ASPIRE Learning Centre - Consent & Compliance Service
 * Centralized consent recording, verification, and persistence.
 * Complies with India DPDP Act 2023, Google Play Data Safety, and e-Privacy standards.
 */

const CONSENT_STORAGE_KEY = 'aspire_user_consents_v1';
const COOKIE_PREFS_KEY = 'aspire_cookie_consent_v1';
const COMM_PREFS_KEY = 'aspire_comm_preferences_v1';

export const CURRENT_POLICY_VERSION = '1.0';

/**
 * Retrieve all recorded user consents
 */
export function getAllConsents() {
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load consents:', e);
  }
  return {
    termsOfService: { accepted: false, version: null, timestamp: null },
    privacyPolicy: { accepted: false, version: null, timestamp: null },
    refundPolicyAcknowledged: false,
    parentalConsentVerified: false
  };
}

/**
 * Record acceptance of Terms of Service & Privacy Policy
 */
export function recordTermsAndPrivacyConsent(userIdOrEmail = 'anonymous') {
  const current = getAllConsents();
  const timestamp = new Date().toISOString();
  const updated = {
    ...current,
    termsOfService: { accepted: true, version: CURRENT_POLICY_VERSION, timestamp, user: userIdOrEmail },
    privacyPolicy: { accepted: true, version: CURRENT_POLICY_VERSION, timestamp, user: userIdOrEmail }
  };
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('aspire:consent-updated', { detail: updated }));
  } catch (e) {
    console.error('Failed to save terms consent:', e);
  }
  return updated;
}

/**
 * Check if current user has accepted active terms and privacy policy
 */
export function hasAcceptedCurrentTerms() {
  const consents = getAllConsents();
  return !!(consents.termsOfService?.accepted && consents.privacyPolicy?.accepted);
}

/**
 * Cookie Preferences:
 * - essential: true (Always required for authentication & session tokens)
 * - functional: boolean (UI themes, notice dismissed state)
 * - analytics: boolean (Diagnostics & app performance)
 */
export function getCookiePreferences() {
  try {
    const raw = localStorage.getItem(COOKIE_PREFS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null; // Null means user hasn't made a choice yet
}

export function saveCookiePreferences(prefs) {
  const normalized = {
    essential: true, // Always true
    functional: !!prefs?.functional,
    analytics: !!prefs?.analytics,
    timestamp: new Date().toISOString()
  };
  try {
    localStorage.setItem(COOKIE_PREFS_KEY, JSON.stringify(normalized));
    window.dispatchEvent(new CustomEvent('aspire:cookie-consent-updated', { detail: normalized }));
  } catch (e) {
    console.error('Failed to save cookie preferences:', e);
  }
  return normalized;
}

/**
 * Communication Preferences:
 * - academicAlerts: true (Always enabled for enrolled students: attendance, fees, timetable)
 * - promotionalAnnouncements: boolean (Workshops, vacation batches, career counseling seminars)
 * - channelEmail: boolean
 * - channelWhatsApp: boolean
 */
export function getCommunicationPreferences(identifier = '') {
  try {
    const raw = localStorage.getItem(COMM_PREFS_KEY);
    if (raw) {
      const all = JSON.parse(raw);
      if (identifier && all[identifier.toLowerCase()]) {
        return all[identifier.toLowerCase()];
      }
      if (all.global) return all.global;
    }
  } catch (e) {}
  return {
    academicAlerts: true,
    promotionalAnnouncements: true,
    channelEmail: true,
    channelWhatsApp: true,
    lastUpdated: new Date().toISOString()
  };
}

export function saveCommunicationPreferences(prefs, identifier = '') {
  try {
    const raw = localStorage.getItem(COMM_PREFS_KEY);
    const all = raw ? JSON.parse(raw) : {};
    const updated = {
      academicAlerts: true, // Mandatory educational notices
      promotionalAnnouncements: !!prefs.promotionalAnnouncements,
      channelEmail: prefs.channelEmail !== false,
      channelWhatsApp: prefs.channelWhatsApp !== false,
      lastUpdated: new Date().toISOString()
    };
    if (identifier) {
      all[identifier.toLowerCase()] = updated;
    }
    all.global = updated;
    localStorage.setItem(COMM_PREFS_KEY, JSON.stringify(all));
    window.dispatchEvent(new CustomEvent('aspire:comm-preferences-updated', { detail: updated }));
    return updated;
  } catch (e) {
    console.error('Failed to save comm preferences:', e);
    return prefs;
  }
}

/**
 * One-click Unsubscribe from Marketing / Promotional Announcements
 */
export function unsubscribeFromMarketing(identifier = '') {
  return saveCommunicationPreferences({
    academicAlerts: true,
    promotionalAnnouncements: false,
    channelEmail: false,
    channelWhatsApp: true // Keep essential WhatsApp OTP
  }, identifier);
}

export function isMarketingUnsubscribed(identifier = '') {
  const prefs = getCommunicationPreferences(identifier);
  return prefs.promotionalAnnouncements === false;
}
