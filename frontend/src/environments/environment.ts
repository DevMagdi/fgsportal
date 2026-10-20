// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in angular.json.
//
// SECURITY: real credentials must never be committed. Copy
// environment.example.ts to environment.ts and fill in your project values.

export const environment = {
  production: false,
  firebase: {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
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
  serverAPI: 'YOUR_LEGACY_SERVER_API_URL',
  newServerApi: 'YOUR_BACKEND_API_BASE_URL',
  currecnyConvert: 'https://openexchangerates.org/api/latest.json?',
  currecnyConvertAppID: 'YOUR_OPEN_EXCHANGE_RATES_APP_ID',
  //chatGPTApi:'https://api.openai.com/v1/engines/davinci-codex/completions',
  //chatGPTApiKey:'YOUR_OPENAI_KEY_GOES_HERE'
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
