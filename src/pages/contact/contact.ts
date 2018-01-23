import { Component } from '@angular/core';
import { NavController,ActionSheetController, Platform } from 'ionic-angular';
import { Camera } from "@ionic-native/camera";
import { FilePath } from "@ionic-native/file-path";
import { File, FileEntry } from '@ionic-native/file';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  lastImage
  loggedinUser
  constructor(public navCtrl: NavController,public actionSheetCtrl: ActionSheetController, private camera: Camera,
     private file: File, private filePath: FilePath, public platform: Platform) {
      this.presentActionSheet('profile');
  }
  public presentActionSheet(type) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Gallery',
          icon: 'albums',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY, type);
          }
        },
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA, type);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }
  public takePicture(sourceType, type) {
    // Create options for the Camera Dialog
    var options;
    if(type=="profile"){
      options = {
        quality: 100,
        targetWidth: 288,
        targetHeight: 290,
        sourceType: sourceType,
        saveToPhotoAlbum: false,
        correctOrientation: true,
        destinationType: this.camera.DestinationType.FILE_URI
      };
    }
    else{
      options = {
        quality: 100,
        targetWidth: 1245,
        targetHeight: 600,
        sourceType: sourceType,
        saveToPhotoAlbum: false,
        correctOrientation: true,
        destinationType: this.camera.DestinationType.FILE_URI
      };
    }



    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      console.log('imagePath');
      console.log(imagePath);
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(imagePath,correctPath, currentName, this.createFileName(), type);

          });
      } else {

        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(imagePath,correctPath, currentName, this.createFileName(), type);

      }
    }, (err) => {
      console.log('Error while selecting image.',err);
    });
  }
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return this.file.dataDirectory + img;
    }
  }
  // Create a new name for the image
  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  // Copy the image to a local folder
  private copyFileToLocalDir(imagePath,namePath, currentName, newFileName, type) {
    let self=this;
    console.log('namePath');
    console.log(namePath);
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
      this.uploadImage(type);
    }, error => {
      console.log('Error while storing file.');
    });
  }
  public uploadImage(type) {
    // Destination URL
    let self =this;
    // var url = this.APP_URL+"/user/profile-image";

    // File for Upload
    var targetPath = this.pathForImage(this.lastImage);

    // File name only
    var filename = this.lastImage;
    console.log("file");
    var options = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "image/jpg",
      headers: {"Content-Type": undefined,
      'x-auth-token':this.loggedinUser["secretToken"]},
      params: { 'fileName': filename,'imageType':type }
    };

  // const fileTransfer: TransferObject = this.transfer.create();
  //     // this.config.showLoading();
  //    console.log("fileTransfer.upload",targetPath, url, options);
  //     // Use the FileTransfer to upload the image
  //     fileTransfer.upload(targetPath, url, options).then(data => {
  //       //console.log(JSON.parse(data.response));
  //       let images = JSON.parse(data.response);
  //       if(type=="profile"){
  //         self.businessLogo = images.thumb;
  //         console.log(self.businessLogo);
  //         self.loggedinUser['logo']=images.thumb;
  //         // self.config.setLocalStore('LoggedUser', self.loggedinUser);
  //         //  self.config.setLocalStore("userProfilePic",images.thumb);
  //       }

        // self.config.hideloading();
        // self.config.showToast('Image succesful uploaded.');
      // }, err => {
      //   // this.config.hideloading();
      //   console.log('Error while uploading file.',err);
      // });
  }


}
