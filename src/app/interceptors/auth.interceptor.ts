
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);

  // Do NOT attach JWT to login or refresh requests
  const isLoginRequest =
    req.url.includes('/auth/login');

  const isRefreshRequest =
    req.url.includes('/auth/refresh');

  const isRegisterRequest =
  req.url.includes('/users/register');

  // Login / refresh should go without Authorization header
  if (isLoginRequest || isRefreshRequest || isRegisterRequest) {

    console.log(
      'INTERCEPTOR REQUEST:',
      req.method,
      req.url,
      'Token: NOT ATTACHED'
    );

    return next(req);
  }

  const token = authService.getToken();

  console.log(
    'INTERCEPTOR REQUEST:',
    req.method,
    req.url,
    'Token:',
    token ? 'YES' : 'NO'
  );

  if (token) {

    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

  }

  return next(req).pipe(

    catchError(error => {

      console.log(
        'INTERCEPTOR ERROR:',
        req.method,
        req.url,
        'Status:',
        error.status
      );

      if (
        error.status === 401 &&
        !req.url.includes('/auth/login') &&
        !req.url.includes('/auth/refresh')
      ) {

        console.log(
          '401 DETECTED - STARTING REFRESH'
        );

        const refreshToken =
          authService.getRefreshToken();

        console.log(
          'REFRESH TOKEN:',
          refreshToken ? 'YES' : 'NO'
        );

        if (!refreshToken) {

          console.log(
            'NO REFRESH TOKEN - LOGOUT'
          );

          authService.logout();

          return throwError(() => error);
        }

        console.log(
          'CALLING REFRESH API'
        );

        return authService.refreshToken().pipe(

          switchMap(response => {

            console.log(
              'REFRESH SUCCESS - NEW TOKEN RECEIVED'
            );

            authService.saveToken(
              response.accessToken
            );

            authService.saveRefreshToken(
              response.refreshToken
            );

            authService.saveUser(
              response.user
            );

            const retryRequest =
              req.clone({
                setHeaders: {
                  Authorization:
                    `Bearer ${response.accessToken}`
                }
              });

            console.log(
              'RETRYING ORIGINAL REQUEST:',
              retryRequest.url
            );

            return next(retryRequest);

          }),

          catchError(refreshError => {

            console.log(
              'REFRESH FAILED:',
              refreshError.status,
              refreshError.error
            );

            authService.logout();

            return throwError(
              () => refreshError
            );

          })

        );

      }

      return throwError(() => error);

    })

  );

};

