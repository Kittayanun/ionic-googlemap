import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LoadingController } from '@ionic/angular';
import { FCM } from '@ionic-native/fcm/ngx';
declare var google;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor( private geolocation: Geolocation, private loadingCtrl: LoadingController, private fcm: FCM) {}

  getToken() {
    this.fcm.getToken().then(token => {
      console.log('get token:' + token);
      // Register your new token in your back-end if you want
      // backend.registerToken(token);
    });
  }

  ngOnInit() {
    this.fcm.subscribeToTopic('marketing');

    this.fcm.getToken().then(token => {
      console.log('fcm token:' + token);
      //backend.registerToken(token);
    });

    this.fcm.onNotification().subscribe(data => {
      console.log('data:' + data);
      if (data.wasTapped) {
        console.log('Received in background');
      } else {
        console.log('Received in foreground');
      }
    });

    this.fcm.onTokenRefresh().subscribe(token => {
      console.log('Refreshtoken:' + token);
      //backend.registerToken(token);
    });

    this.fcm.unsubscribeFromTopic('marketing');

    this.loadMap();
  }

  async loadMap(){

    const loading = await this.loadingCtrl.create();
    loading.present();

    const rta = await this.geolocation.getCurrentPosition();
    const myLatLng = {
      lat: rta.coords.latitude,
      lng: rta.coords.longitude
    };
    console.log(myLatLng);
    const mapEle: HTMLElement = document.getElementById('map');
    const map = new google.maps.Map(mapEle, {
      center: myLatLng,
      zoom: 15
    });

    google.maps.event
    .addListenerOnce(map, 'idle', () => {
      loading.dismiss();
      const marker = new google.maps.Marker({
        position: {
          lat: myLatLng.lat,
          lng: myLatLng.lng
        },
        map: map,
        title: 'hello world'
      });
    } );
  }

}
