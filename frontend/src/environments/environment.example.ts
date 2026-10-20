// Template for Angular environment files.
// Copy this file to environment.ts (dev) or environment.prod.ts (production)
// and replace every YOUR_* placeholder with a value from your secret store.
// Never commit the filled-in copies.

export const environment = {
  production: false,
  firebase: {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
    databaseURL: "YOUR_FIREBASE_DATABASE_URL",
    projectId: "YOUR_FIREBASE_PROJECT_ID",
    storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
    messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
    appId: "YOUR_FIREBASE_APP_ID",
  },
  cloudMessagingServerkey: "YOUR_CLOUD_MESSAGING_SERVER_KEY",
  staticFGSProjectKey: "13",
  staticFGSProjectTitle: "Static FGS Project",
  staticFGSProcessKey: "Presales",
  staticFGSProcessTitle: "4",
  // Base URL of the Laravel backend (without trailing /api)
  serverAPI: 'YOUR_LEGACY_SERVER_API_URL',
  newServerApi: 'YOUR_BACKEND_API_BASE_URL',
  currecnyConvert: 'https://openexchangerates.org/api/latest.json?',
  currecnyConvertAppID: 'YOUR_OPEN_EXCHANGE_RATES_APP_ID',
};
