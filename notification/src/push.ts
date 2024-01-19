const PushNotifications = require('node-pushnotifications');

const settings = {
    gcm: {
        id: process.env.GCM_API_KEY,
    },
    apn: {
        token: {
            key: './Key_Rainbow.p8', //Rainbow  //For Diahome use './Key_Diahome.p8',  //For Unify Care use  './Key_unify_care.p8'
            keyId: '3SBN7F9373', //Rainbow //For Diahome use 'SU6X3M6A4V'         //For Unify Care use 'HACM9KH937',
            teamId: 'GU9M6K2H9B', //Rainbow  //For Diahome use '49C3SCY3GF'        //For Unify Care use 'GU9M6K2H9B'.
        },
        production: false
        //production: true
    },
    web: {
        vapidDetails: {
            subject: `${String(process.env.SYSTEM_SENDER_EMAIL_ID)}`,
            publicKey: process.env.PUBLIC_VAPID_KEY,
            privateKey: process.env.PRIVATE_VAPID_KEY,
        },
        gcmAPIKey: process.env.GCM_API_KEY,
        TTL: 2419200,
        contentEncoding: 'aes128gcm',
        headers: {}
    },
    // isAlwaysUseFCM: false,
    isAlwaysUseFCM: true,
};

export const push = new PushNotifications(settings);