import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';

import { moveIn, fallIn } from '../router.animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [moveIn(), fallIn()],
  host: { '[@moveIn]': '' }
})
export class LoginComponent {

  private state: string = '';
  private error: any;

  constructor(public af: AngularFire, private router: Router) {
    this.af.auth.subscribe(auth => {
      if (auth) {
        this.router.navigateByUrl('/home');
      }
    });
  }


  onSubmit(formData) {
    if (formData.valid) {
      console.log(formData.value);
      this.af.auth.login({
        email: formData.value.email,
        password: formData.value.password
      },
        {
          provider: AuthProviders.Password,
          method: AuthMethods.Password,
        }).then(
        (success) => {
          console.log(success);
          // TODO - use spinner for loading
          this.router.navigate(['/home']);
        }).catch(
        (err) => {
          console.log(err);
          this.error = err;
        })
    }
  }

}
