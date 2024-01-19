// import firebase from 'firebase';
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

    firebase.initializeApp({
      messagingSenderId: "1071878967687",
    });
    // firebase.messaging();
    const messaging = firebase.messaging();
    console.log("hello: @@ @")
    
  //background notifications will be received here
    
  self.addEventListener('push', event => {
    console.log("case 2",event," dd: ",event.data.json())
    const data = event.data.json();
    console.log("data 1", data);
    const data2 = JSON.parse(data.data.notification);
    // localStorage.setItem('videoCallDetails', data);
    console.log("data 2: ",data2)
    console.log("data2.body.token: ",data2.body.token)
    let encodedToken = encodeURIComponent(data2.body.token);
    

    // let tempurl = '';
    // let tempBody = '';
    // let tempTitle = '';
    if(data2.body.messageType === "text" || data2.body.messageType === "file" || data2.body.messageType === "photo"){
      tempTitle = data2.body.callerName+': '  +data2.title;
      tempurl = "/home/?appointment_id="+data2.body.appointmentId + '&type=text';
      // let tempDate =  data2.body.appointmentDate.split("-").reverse().join("-");
      tempBody = " ";
      if(data2.body.messageType === "file"){
        tempBody = "File";
      }else if(data2.body.messageType === "photo"){
        tempBody = "Photo ";
      }
      // tempBody = "Appt Date: " + tempDate;
    }else if(data2.body.messageType === "admin-text"){
      tempTitle = data2.title;
      tempurl = '/login';
      tempBody = ''
    }else
     if(data2.body.messageType === "video" || data2.body.messageType === "audio"){
      tempTitle = data2.title;
      tempurl = "/home?appointment_id=" + data2.body.channel + "&&date="+data2.body.appointmentDate + "&callerName=" + data2.body.callerName+'&token=' + encodedToken + '&uid='+data2.body.uid + '&type=call&callerId='+data2.body.callerId+"&callerProfile="+data2.body.callerProfile;
      tempBody = 'Click here'
    }
    // else if(data2.body.messageType === "rejected"){
    //   tempTitle = data2.title;
    //   tempurl = "/doctor/appointmentListing?appointment_id=" + data2.body.appointmentId + "&&date="+data2.body.appointmentDate;
    //   tempBody = ''
    // }
    
    // if(data2.body.messageType === "rejected"){
    //   self.registration.showNotification(tempTitle, {
    //     body: tempBody,
    //     icon: '/diahome_favicon.png',
    //   });
    // }else 
    if(data2.body.messageType === "text" || data2.body.messageType === "file" || data2.body.messageType === "photo"){
      self.registration.showNotification(tempTitle, {
        body: tempBody,
        icon: '/diahome_favicon.png',
        data: {
          tempurl
        }
      });
    }else{
      self.registration.showNotification(tempTitle, {
        body: tempBody,
        icon: '/diahome_favicon.png',
        data: {
          tempurl
        },
        requireInteraction:true,
        tag: 'require-interaction'
      });
    }
    
});
self.addEventListener('notificationclick', function(event) {
  console.log("event: ",event);
  var redirect_url = event.notification.data.tempurl;
  event.notification.close();
  event.waitUntil(
    clients
      .matchAll({
        type: "window"
      })
      .then(function(clientList) {
        console.log(clientList);
        for (var i = 0; i < clientList.length; i++) {
          var client = clientList[i];
          if (client.url === "/" && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(redirect_url);
        }
      })
  );
});


