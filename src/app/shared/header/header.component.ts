import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  private router = inject(Router);
  private authService = inject(AuthService);

  searchText = '';

  get user(): any {
    return this.authService.getUser();
  }

  search(): void {

    const search = this.searchText.trim();

    if (!search) {
      return;
    }

    console.log('Searching:', search);

    this.router.navigate(
      ['/products'],
      {
        queryParams: {
          search: search
        }
      }
    );

  }

  goToHome(): void {
    this.router.navigate(['/products']);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  goToWishlist(): void {
    this.router.navigate(['/wishlist']);
  }

  goToOrders(): void {
    this.router.navigate(['/orders']);
  }

  logout(): void {

    this.authService.logout();

    this.router.navigate(['/login']);

  }

}

