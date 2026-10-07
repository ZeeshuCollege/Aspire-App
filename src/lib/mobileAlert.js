// Global Mobile-Friendly Alert System
// Intercepts browser/WebView alert() to prevent Android WebView's giant stretched dialogs

let alertQueue = [];
let activeAlertHandler = null;

export function registerAlertHandler(handler) {
  activeAlertHandler = handler;
  if (alertQueue.length > 0 && activeAlertHandler) {
    const next = alertQueue.shift();
    activeAlertHandler(next);
  }
}

export function unregisterAlertHandler() {
  activeAlertHandler = null;
}

export function showMobileAlert({
  title = '',
  message = '',
  type = 'info',
  credentials = null,
  buttonText = 'OK',
  onDismiss = null
}) {
  const alertData = {
    id: Date.now() + Math.random(),
    title,
    message,
    type,
    credentials,
    buttonText,
    onDismiss
  };

  if (activeAlertHandler) {
    activeAlertHandler(alertData);
  } else {
    alertQueue.push(alertData);
  }
}

export function parseAlertMessage(rawMessage) {
  if (typeof rawMessage !== 'string') {
    rawMessage = String(rawMessage || '');
  }

  let type = 'info';
  let title = 'Notification';
  let message = rawMessage;
  let credentials = null;

  // Determine type
  if (rawMessage.includes('✅') || /enrolled|success|saved|created|updated/i.test(rawMessage)) {
    type = 'success';
    title = 'Success';
  } else if (rawMessage.includes('⚠️') || /warning|required|please fill/i.test(rawMessage)) {
    type = 'warning';
    title = 'Action Required';
  } else if (rawMessage.includes('❌') || /error|failed|could not|invalid/i.test(rawMessage)) {
    type = 'error';
    title = 'Notice';
  }

  // Clean lines
  const lines = rawMessage.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length > 0) {
    const firstLine = lines[0].replace(/^[✅❌⚠️ℹ️\s]+/, '').trim();
    if (firstLine.length > 0 && firstLine.length <= 45) {
      title = firstLine;
      message = lines.slice(1).join('\n');
    }
  }

  // Detect credentials pattern: Email: ... Password: ...
  const emailMatch = rawMessage.match(/Email:\s*([^\s\n]+)/i);
  const passwordMatch = rawMessage.match(/Password:\s*([^\s\n]+)/i);
  if (emailMatch || passwordMatch) {
    credentials = {
      email: emailMatch ? emailMatch[1] : null,
      password: passwordMatch ? passwordMatch[1] : null
    };

    // Filter out email and password lines from general message body
    const remainingLines = lines.filter(line => {
      const lower = line.toLowerCase();
      if (lower.startsWith('email:') || lower.startsWith('password:')) return false;
      if (line === title || line.replace(/^[✅❌⚠️ℹ️\s]+/, '').trim() === title) return false;
      return true;
    });

    message = remainingLines.join('\n').trim();
  }

  return { title, message, type, credentials };
}

// Global window.alert polyfill
if (typeof window !== 'undefined') {
  const originalAlert = window.alert;

  window.alert = function (msg) {
    try {
      const parsed = parseAlertMessage(msg);
      showMobileAlert({
        title: parsed.title,
        message: parsed.message,
        type: parsed.type,
        credentials: parsed.credentials,
        buttonText: 'OK'
      });
    } catch (e) {
      console.warn('Fallback to native alert:', e);
      if (typeof originalAlert === 'function') {
        originalAlert.call(window, msg);
      }
    }
  };
}
