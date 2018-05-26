import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import * as jwt_decode from 'jwt-decode';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


interface AuthResponse {
  token: string;
}

interface User {
  sub: string;
  name: string;
}


@Injectable()
export class AuthService {

  // the decoded token if the user has been authenticated, carrying information about the user.
  _user: User;

  // inject the HttpClient service.
  constructor(private http: HttpClient) {
    // perform any logic upon application startup here...
  }

  // ...
  // The following computed properties may come in handy in the markup in your template...
  get user() {
    return this._user;
  }

  get authenticated() {
    return this._user !== undefined && this._user !== null;
  }

  // use this method to catch http errors.
  handleError(error: HttpErrorResponse) {
    return Observable.throw({
      error: error.error
    });
  }

  login(credentials): Observable<User> {
    // invoke the relevant API route for authenticating the user with the given credentials and return an observable
    // of a User object (= decoded token).
    //
    // Make sure to handle a successful authentication by storing and also decoding the returned token, as well as
    // catching http errors.

    // return ...
    console.log(credentials);
    const tmp = this.http.post<User>('/api/auth', credentials);
    tmp.subscribe((results) => {
      const decoded = jwt_decode(results);
      this._user = decoded;
      localStorage.setItem('token', results.toString());
    },
    error => {
      console.error('error', error);
    });
    return tmp;
}

  logout() {
    // logout the current user by removing the corresponding token.
    this._user = null;
    localStorage.removeItem('token');
  }

  getResource(resource): Observable<any> {
    const token = localStorage.getItem('token');
    let httpOptions;
    if (token !== null) {
      httpOptions = {
        headers: new HttpHeaders({
          'Authorization': token
        })
      };
    } else {
      httpOptions = {};
    }
    return this.http.get<string[]>('/api/friends', httpOptions);
    // invoke a protected API route by including the Authorization header and return an Observable.
    //
    // If e.g. invoking /api/friends, the 'resource' parameter should equal 'friends'.

    // return ...
  }
}
