import { FirebaseService } from './../../services/firebase.service';
import { Geolocation } from '@ionic-native/geolocation';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, ToastController, ModalController } from 'ionic-angular';
import { ReportComponent } from '../../components/report/report';
import { ReportModel } from '../../models/report.model';
declare var google: any;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('map')
  mapRef: ElementRef;
  map: any;
  currentPositionMarker: any;
  markers: any[] = [];
  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    private geolocation: Geolocation,
    private modalCtrl: ModalController,
    private firebaseService: FirebaseService
  ) {}
  ionViewDidLoad() {
    this.showMap();
    this.watchPosition();
    this.firebaseService
      .getReports()
      .valueChanges()
      .subscribe(data => {
        data.forEach(elm => {
          const location = new google.maps.LatLng(
            elm.location.lat,
            elm.location.lng
          );
          let marker = new google.maps.Marker({
            position: location,
            map: this.map
          });
          marker.addListener('click', evt => {
            alert(evt);
          });
          this.markers.push(marker);
        });
      });
  }
  private async showMap() {
    let currentPosition = await this.geolocation.getCurrentPosition();
    const location = new google.maps.LatLng(
      currentPosition.coords.latitude,
      currentPosition.coords.longitude
    );
    const options = {
      center: location,
      zoom: 20,
      streetViewControl: false,
      mapTypeId: 'roadmap',
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: false,
      rotateControl: false,
      fullscreenControl: false
    };
    this.map = new google.maps.Map(this.mapRef.nativeElement, options);
  }
  private watchPosition() {
    this.currentPositionMarker;
    this.geolocation.watchPosition().subscribe(position => {
      const location = new google.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude
      );
      if (!this.currentPositionMarker) {
        this.currentPositionMarker = new google.maps.Marker({
          position: location,
          map: this.map
        });
      } else {
        this.currentPositionMarker.setPosition(location);
        this.map.panTo(location);
      }
    });
  }
  report() {
    var modal = this.modalCtrl.create(ReportComponent);
    modal.present();
    modal.onDidDismiss(data => {
      if (data) {
        var uploadObj = new ReportModel();
        uploadObj.creationDate = new Date();
        uploadObj.img = data;
        uploadObj.location = {
          lat: this.currentPositionMarker.getPosition().lat(),
          lng: this.currentPositionMarker.getPosition().lng()
        };
        this.firebaseService.addReport(uploadObj).then(() => {
          alert('Reporte Creado, ¡GRACIAS!');
        });
      }
    });
  }
}
