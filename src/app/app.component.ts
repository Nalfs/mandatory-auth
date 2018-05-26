import { Component } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  userCredentials;
  incorrect = false;

  constructor(private authService: AuthService) {

    this.userCredentials = {
      username: '',
      password: ''
    };
  }
  login(event) {

    const success = (response) => {
      console.log(response);
      this.incorrect = false;
    };
    const error = (response) => {
      console.error(response);
      this.incorrect = true;
    };
    this.authService.login(this.userCredentials).subscribe(success, error);
  }

  logout() {
    this.authService.logout();
  }

  testApi() {
    // test API access by invoking getResource on authService.

    // console.error('something, something, horribly wrong!');
    const success = (response) => {
      console.log(response);
    };
    const error = (response) => {
      console.error(response);
    };
    this.authService.getResource('friends').subscribe(success, error);
  }
}
