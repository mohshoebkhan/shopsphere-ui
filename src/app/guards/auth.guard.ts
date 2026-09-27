import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);

  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (token && user) {

    console.log(
      'AUTH GUARD: User authenticated'
    );

    return true;
  }

  console.log(
    'AUTH GUARD: User not logged in'
  );

  return router.createUrlTree(
    ['/login'],
    {
      queryParams: {
        returnUrl: state.url
      }
    }
  );
};