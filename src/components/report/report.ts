import { Component } from '@angular/core';
import {
  AngularFireStorageReference,
  AngularFireStorage
} from 'angularfire2/storage';
import { Camera } from '@ionic-native/camera';
import { LoadingController, ViewController } from 'ionic-angular';

/**
 * Generated class for the ReportComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'report',
  templateUrl: 'report.html'
})
export class ReportComponent {
  text: string;
  public myPhotosRef: AngularFireStorageReference;
  public myPhoto: any;
  image: string = '';
  loading = false;
  task: firebase.storage.UploadTaskSnapshot;
  url: string;
  constructor(
    private camera: Camera,
    private loadingCtrl: LoadingController,
    private storage: AngularFireStorage,
    public viewCtrl: ViewController
  ) {
    this.myPhotosRef = this.storage.ref('/photos/');
  }
  close() {
    this.viewCtrl.dismiss();
  }
  selectPictureFromGallery() {
    this.loading = true;
    this.camera
      .getPicture({
        targetWidth: 900,
        targetHeight: 600,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: this.camera.DestinationType.DATA_URL,
        quality: 100,
        mediaType: this.camera.MediaType.PICTURE,
        encodingType: this.camera.EncodingType.JPEG
      })
      .then(
        imageData => {
          this.loading = false;
          this.myPhoto = imageData;
          this.uploadPhoto();
        },
        error => {
          alert('ERROR -> ' + JSON.stringify(error));
        }
      );
  }

  takePictureWithCamera() {
    this.loading = true;
    this.camera
      .getPicture({
        targetWidth: 900,
        targetHeight: 600,
        sourceType: this.camera.PictureSourceType.CAMERA,
        destinationType: this.camera.DestinationType.DATA_URL,
        quality: 100,
        mediaType: this.camera.MediaType.PICTURE,
        encodingType: this.camera.EncodingType.JPEG
      })
      .then(
        imageData => {
          this.loading = false;
          this.myPhoto = imageData;
          this.uploadPhoto();
        },
        error => {
          alert('ERROR -> ' + JSON.stringify(error));
        }
      );
  }
  uploadPhoto(): any {
    this.image = 'data:image/jpg;base64,' + this.myPhoto;
    // this.storage.ref(filePath).putString(this.image, 'data_url');
  }
  async sendPhoto() {
    const loading = this.loadingCtrl.create({
      content: 'Subiendo foto...'
    });
    try {
      loading.present();
      const filePath = `myfile_${new Date().getTime()}.jpg`;
      this.task = await this.storage
        .ref(filePath)
        .putString(this.image, 'data_url');
      this.url = await this.task.ref.getDownloadURL();
      loading.dismiss();
      this.viewCtrl.dismiss(this.url);
    } catch (error) {
      loading.dismiss();
    }
  }
}
