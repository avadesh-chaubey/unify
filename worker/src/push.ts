const PushNotifications = require('node-pushnotifications');

const settings = {
    apn: {
        token: {
            key: './Key_Rainbow.p8', //Rainbow  //For Diahome use './Key_Diahome.p8',  //For Unify Care use  './Key_unify_care.p8'
            keyId: '3SBN7F9373', //Rainbow //For Diahome use 'SU6X3M6A4V'         //For Unify Care use 'HACM9KH937',
            teamId: 'GU9M6K2H9B', //Rainbow  //For Diahome use '49C3SCY3GF'        //For Unify Care use 'GU9M6K2H9B'.
        },
        production: true
    }
};

export const push = new PushNotifications(settings);