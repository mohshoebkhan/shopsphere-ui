import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getUser();

  if (user?.role?.toUpperCase() === 'ADMIN') {
    return true;
  }

  alert('Access denied. Admin only.');

  return router.createUrlTree(['/products']);
};