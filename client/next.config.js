module.exports = {
  async headers() {
    return [
      {
        source: '/.well-known/apple-app-site-association',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json',
          },
        ],
      },
    ];
  },
  webpackDevMiddleware: config => {
    config.watchOptions.poll = 300;
    return config;
  },
  generateBuildId: async () => {
    // You can, for example, get the latest git commit hash here
    return '2.4'
  },
  env: {
    buildId: '2.4',
    apiKey: "AIzaSyBJbdQ9dXV3RnKZBCV-xzPwiiBCCrLH7lk",
    authDomain: "dev-rainbow-com.firebaseapp.com",
    databaseURL: "https://dev-rainbow-com-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "dev-rainbow-com",
    storageBucket: "dev-rainbow-com.appspot.com",
    messagingSenderId: "256350538953",
    appId: "1:256350538953:web:49bfe50d14a74a0c661118",
    measurementId: "G-6DLHBVJBD0",
    vapidKey: "BECoxODkESJEptoMSBRg02WHjgcHkvom_qUQcYKpwJpdcpTBOAriNAcxlyn55xEFS89O-uSFf18_quZhJNBVhhw",
    agoraAppId: 'd289bd31e6c7430eba4a66ca5f68a79d'
  },
};
