// ─────────────────────────────────────────────────────────────────────────────
// MsgHealth brand configuration
//
// msghealth.net could not be reached from the build environment, so the logo
// and colours below are PLACEHOLDERS. To use the official assets:
//   1. Drop the official logo at  assets/logo.png  (transparent PNG, any size).
//      It is picked up automatically and replaces the placeholder mark.
//   2. Replace the hex values below with the official brand colours.
//   3. Re-render:  npm run render
// Every scene reads its colours from this object, so the whole film re-themes.
// ─────────────────────────────────────────────────────────────────────────────
window.BRAND = {
  name: 'MsgHealth',
  tagline: 'Know your customers. Keep your customers.',
  closingLine: 'Stop guessing when your customers are planning to leave.',
  url: 'msghealth.net',
  logoFile: 'assets/logo.png', // optional; placeholder mark is drawn if missing

  colors: {
    primary: '#16a594',   // main brand colour (UI chrome, logo)
    primaryDark: '#0e6f66',
    ink: '#16303f',       // dark text / wordmark
    healthy: '#3dbb74',
    attention: '#f2b441',
    risk: '#ec5f4f',
    screen: '#f4f1ea',    // app background
  },

  // Feature names shown on screen. Only features listed in the brief are used.
  nav: ['Client Health', 'Inbox', 'Bookings', 'Reviews', 'Loyalty', 'Payments', 'Reports', 'Automations'],
};
