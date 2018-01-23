import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook } from '@ionic-native/facebook';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  constructor(public navCtrl: NavController,private googlePlus: GooglePlus,private fb: Facebook) {

  }
  fbLogin() {
  
    
    this.fb.login(['public_profile', 'user_friends', 'email'])
      .then((res) => {
        console.log('Logged into Facebook!');
        // console.log(res);
        let params = new Array();
        //Getting name and gender properties
        this.fb.api("/me?fields=id,name,email", params)
          .then(function (user) {
            console.log(user);
            
          })

      })
      .catch((e) => {
        console.log('Error logging into Facebook', e);
        
      });
  }
  googleLogin() {
    
    this.googlePlus.login({
      'webClientId': '',
      'scopes': 'https://www.googleapis.com/auth/plus.login', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
      'offline': true
    })
      .then((res) => {
        console.log(res);

      })
      .catch((err) => {
        
        console.error(err);
      });
  }
}
