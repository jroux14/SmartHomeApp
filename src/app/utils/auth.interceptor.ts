import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, EMPTY, Observable, of, switchMap } from 'rxjs';
import { MONGO_URL } from '../constants/constants.smarthome';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(public http: HttpClient) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = localStorage.getItem('bearerToken'); // Retrieve your token from local storage or wherever it's stored
    const refreshToken = localStorage.getItem('refreshToken');

    if (token && refreshToken) {
      // Clone the request and add the Authorization header
      const authReq = req.clone({
        setHeaders: {
          'Authorization': 'Bearer ' + token,
          'RefreshToken': refreshToken
        }
      });

      return next.handle(authReq).pipe(
        catchError((err: any) => {
          if (err instanceof HttpErrorResponse && err.status === 403) {
            // If our JWT token is rejected try to get a new one
            // Server will send this back in the Authorization header
            let newToken = err.headers.get("Authorization");
 
            if (newToken) {
              localStorage.setItem('bearerToken', newToken);
              const newReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`
                }
              });   

              return next.handle(newReq);
            }
          }

          // If we don't get a new token let it drop through and post the 403 error
          return of(err)
        })
      );
    } else {
      return next.handle(req);
    }
  }

}