import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';
import * as gcm from "node-gcm";

import { moveIn, fallIn, moveInLeft } from '../router.animations';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [moveIn(), fallIn(), moveInLeft()],
  host: { '[@moveIn]': '' }
})
export class HomeComponent {

  private name: any;
  private state: string = '';

  @ViewChild(AlertDialogComponent) private alertDialog: AlertDialogComponent;

  constructor(public af: AngularFire, private router: Router) {
    this.af.auth.subscribe(auth => {
      if (auth) {
        this.name = auth;
      }
    });
    // TODO - call function once a day
    // this.riseOnceInDay();
  }

  logout() {
    this.af.auth.logout();
    console.log('logged out');
    this.router.navigateByUrl('/login');
  }

  private onPrimaryButtonClick() {
    // firebase.auth().
  }

  private onParticipateTodayButtonClick() {
    this.alertDialog.show("Are you going to paticipate today ?");
  }

  private riseOnceInDay() {

    // TODO - change functionality to use observable timer
    var now = new Date();
    var millisTill10 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0, 0, 0).getMilliseconds() - now.getMilliseconds();
    if (millisTill10 < 0) {
        millisTill10 += 86400000; // it's after 10am, try 10am tomorrow.
    }
    var self = this;
    setTimeout(function(){self.sendDataToFirebase()}, millisTill10);
  }

  private sendDataToFirebase() {
      // TODO - use config
      let sender = new gcm.Sender('AIzaSyDyhuba06xprICvLSSwVtxj-8uaNMt2WQc');

      // TODO - real data from firebase!
      let message = new gcm.Message({
          data: {
            count : "count of participes",
            names : "name of participes"
        }
      });

      // TODO - use config
      let regTokens =  ['dq2enSZpt-4:APA91bFI5ffX99Bt5Fmsyv4Vrj1p5W0kfq2B1t9W3vmdILfT_KzNRGRXAOBEv_c6qjW3XX7lX9d_BFNuPgfzXEPJvFk7Y9xfwxfBQa_nUkjJlM2IXsXVcTvPdeE2ytWh-vu6WoUkBFq6'];
      
      sender.sendNoRetry(message,{ registrationTokens: regTokens }, (err, response) => {
          if (err) console.error(err);
          else console.log(response);
      });
    }

}
