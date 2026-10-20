// SECURITY: real credentials must never be committed. Copy
// environment.example.ts to environment.prod.ts and fill in production values
// through your CI/CD secret store.

export const environment = {
  production: true,
  firebase: {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
    databaseURL: "YOUR_FIREBASE_DATABASE_URL",
    projectId: "YOUR_FIREBASE_PROJECT_ID",
    storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
    messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
    appId: "YOUR_FIREBASE_APP_ID"
  },
  cloudMessagingServerkey: "YOUR_CLOUD_MESSAGING_SERVER_KEY",
  staticFGSProjectKey: "52",
  staticFGSProjectTitle: "FGS Tasks -2023",
  staticFGSProcessKey: "Presales",
  staticFGSProcessTitle: "253",
  serverAPI: 'YOUR_LEGACY_SERVER_API_URL',
  newServerApi: 'YOUR_BACKEND_API_BASE_URL',
  currecnyConvert: 'https://openexchangerates.org/api/latest.json?',
  currecnyConvertAppID: 'YOUR_OPEN_EXCHANGE_RATES_APP_ID',
  //chatGPTApi:'https://api.openai.com/v1/engines/davinci-codex/completions',
  //chatGPTApiKey:'YOUR_OPENAI_KEY_GOES_HERE'
};
