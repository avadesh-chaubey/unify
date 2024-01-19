module.exports = {
  future: {
    webpack5: true
  },
  webpack: (config) => {
    // load worker files as a urls with `file-loader`
    config.module.rules.unshift({
      test: /pdf\.worker\.(min\.)?js/,
      use: [
        {
          loader: "file-loader",
          options: {
            name: "[contenthash].[ext]",
            publicPath: "_next/static/worker",
            outputPath: "static/worker"
          }
        }
      ]
    });

    return config;
  },
  env: {
    buildId: '2.5',
    apiKey: "AIzaSyD-cccyecFg71kIHcGyktUINg6DCEYlaQ4",
    authDomain: "rainbow-com.firebaseapp.com",
    databaseURL: "https://rainbow-com-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "rainbow-com",
    storageBucket: "rainbow-com.appspot.com",
    messagingSenderId: "1071878967687",
    appId: "1:1071878967687:web:b653c6a0f9242476254322",
    measurementId: "G-K2ZNQ3YEC4",
    vapidKey:"BA6lwKE_WugUs51nkFJ35N-GATMoJgW6pb-YzItft7wJCQBlH82c8l14Wr3lL1uL3r2fQVsG6G-CLXWOfDA1TpU",
    agoraAppId: '2f6e7256b18e433aa2483ef381d3ab0a',
  },
};
