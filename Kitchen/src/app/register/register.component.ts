import { Component, OnInit } from '@angular/core';

import { AngularFire, AuthProviders, AuthMethods, AngularFireDatabase } from 'angularfire2';
import { moveIn, fallIn } from '../router.animations';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  animations: [moveIn(), fallIn()],
  host: { '[@moveIn]': '' }
})
export class RegisterComponent {

  private state: string = '';
  private error: any;

  constructor(public af: AngularFire, private db: AngularFireDatabase) {

  }

  onSubmit(formData) {
    if (formData.valid) {
      console.log(formData.value);
      this.af.auth.createUser({
        email: formData.value.email,
        password: formData.value.password,
      }).then(
        (success) => {
          console.log(success);
          var uuid = this.af.auth.getAuth().uid;
          console.log("-------------- uuid " + uuid);
          this.db.object('users/' + uuid).set({
            name: formData.value.name,
            role: 0
          })
        }).catch(
        (err) => {
          console.log(err);
          this.error = err;
        })
    }
  }
}
