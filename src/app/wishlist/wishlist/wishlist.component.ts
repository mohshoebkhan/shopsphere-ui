import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { WishlistService } from '../../services/wishlist.service';
import { Wishlist } from '../../models/wishlist';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent implements OnInit {

  wishlistItems: Wishlist[] = [];

  loading = false;

  constructor(
    private wishlistService: WishlistService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadWishlist();
  }

  // ==============================
  // Load Wishlist
  // ==============================

  loadWishlist(): void {

    const userData = localStorage.getItem('user');

    if (!userData) {

      alert('Please Login First');

      this.goToLogin();

      return;
    }

    const user = JSON.parse(userData);

    this.loading = true;

    this.wishlistService.getWishlist(user.id).subscribe({

      next: (data: Wishlist[]) => {

        this.wishlistItems = data;

        this.loading = false;

      },

      error: (err) => {

        console.error(
          'Wishlist loading error:',
          err
        );

        this.loading = false;

      }

    });

  }


  // ==============================
  // Remove Wishlist
  // ==============================

  removeFromWishlist(productId: number): void {

    const userData = localStorage.getItem('user');

    if (!userData) {

      alert('Please Login First');

      this.goToLogin();

      return;
    }

    const user = JSON.parse(userData);

    this.wishlistService
      .removeFromWishlist(
        user.id,
        productId
      )
      .subscribe({

        next: () => {

          alert('❤️ Removed from Wishlist');

          this.loadWishlist();

        },

        error: (err) => {

          console.error(
            'Remove wishlist error:',
            err
          );

          alert('Unable to remove item');

        }

      });

  }


  // ==============================
  // View Product Details
  // ==============================

  viewProduct(productId: number): void {

    this.router.navigate([
      '/products',
      productId
    ]);

  }


  // ==============================
  // Go To Products
  // ==============================

  goToProducts(): void {

    this.router.navigate(['/products']);

  }


  // ==============================
  // Go To Login
  // ==============================

  goToLogin(): void {

    this.router.navigate(['/login']);

  }

}