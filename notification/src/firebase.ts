var firebase = require("firebase-admin");

var serviceAccount = require("../serviceAccountKey.json");

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const fbDatabase = firebase.database()
export { fbDatabase, firebase };