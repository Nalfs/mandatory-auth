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

  _user: User;

  constructor(private http: HttpClient) {
  }


  get user() {
    return this._user;
  }

  get authenticated() {
    return this._user !== undefined && this._user !== null;
  }


  handleError(error: HttpErrorResponse) {
    return Observable.throw({
      error: error.error
    });
  }

  login(credentials): Observable<User> {
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
    return this.http.get<string[]>('/api/' + resource, httpOptions);

  }
}
