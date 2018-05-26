import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse, HttpHandler } from '@angular/common/http';

import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';


const username  = 'me@domain.com';
const password  = 'password';
const friends   = ['alice', 'bob'];


const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

const makeError = (status, error) => {
    return Observable.throw(
        new HttpErrorResponse({
            status,
            error
        })
    );
};

const makeResponse = body => {
    return of(
        new HttpResponse({
            status: 200,
            body
        })
    );
};


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const {
      body,
      headers,
      method,
      url
    } = req;

    console.log(url);
    if (url.endsWith('/auth')) {
        console.log(body);
        if (body.username === username && body.password === password) {
            return makeResponse(token);
        } else if (!body.username && !body.password) {
            return makeError(401, 'hello I am Khoi: destroyer of worlds');
        }
    } else if (url.endsWith('/friends')) {
        if (!headers.has('Authorization')) {
            return makeError(400, 'No authorization header');
        } else if (headers.get('Authorization') !== token) {
            return makeError(401, 'Unauthorized token');
        }
        return makeResponse(friends);
    }
    console.error('intercepted', method, url);
    return next.handle(req);
  }
}
