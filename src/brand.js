// ─────────────────────────────────────────────────────────────────────────────
// MsgHealth brand configuration
//
// Official logo mark: assets/logo.png (transparent PNG). Brand colour: #4F46E5.
// Every scene reads its colours from this object, so the whole film re-themes.
// Re-render after changes:  npm run render
// ─────────────────────────────────────────────────────────────────────────────
window.BRAND = {
  name: 'MsgHealth',
  tagline: 'Know your customers. Keep your customers.',
  closingLine: 'Stop guessing when your customers are planning to leave.',
  url: 'msghealth.net',
  logoFile: 'assets/logo.png', // official mark; a fallback mark is drawn if missing

  colors: {
    primary: '#4f46e5',   // official brand colour (UI chrome, logo)
    primaryDark: '#3730a3',
    ink: '#1e1b4b',       // dark text / wordmark
    healthy: '#3dbb74',
    attention: '#f2b441',
    risk: '#ec5f4f',
    screen: '#f4f1ea',    // app background
  },

  // Feature names shown on screen. Only features listed in the brief are used.
  nav: ['Client Health', 'Inbox', 'Bookings', 'Reviews', 'Loyalty', 'Payments', 'Reports', 'Automations'],
};
