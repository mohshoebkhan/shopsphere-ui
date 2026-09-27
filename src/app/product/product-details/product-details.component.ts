import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import {
  WishlistService,
  WishlistRequest
} from '../../services/wishlist.service';

import { Product } from '../../models/product';
import { CartRequest } from '../../models/cart-request';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {

  // ==========================
  // SERVICES
  // ==========================

  private productService = inject(ProductService);

  private cartService = inject(CartService);

  private wishlistService = inject(WishlistService);

  private route = inject(ActivatedRoute);

  private router = inject(Router);


  // ==========================
  // VARIABLES
  // ==========================

  product: Product | null = null;

  loading = true;


  // ==========================
  // INIT
  // ==========================

  ngOnInit(): void {

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (!id) {

      console.error('Invalid product ID');

      this.router.navigate(['/products']);

      return;
    }

    this.loadProduct(id);

  }


  // ==========================
  // LOAD PRODUCT
  // ==========================

  loadProduct(id: number): void {

    this.loading = true;

    this.productService
      .getProductById(id)
      .subscribe({

        next: (data: Product) => {

          this.product = data;

          this.loading = false;

        },

        error: (err) => {

          console.error(
            'Product details loading error:',
            err
          );

          this.loading = false;

          alert('Product not found');

          this.router.navigate(['/products']);

        }

      });

  }


  // ==========================
  // ADD TO CART
  // ==========================

  addToCart(): void {

    if (!this.product) {
      return;
    }

    const userData =
      localStorage.getItem('user');

    if (!userData) {

      alert('Please Login First');

      this.router.navigate(['/login']);

      return;
    }

    const user = JSON.parse(userData);

    const request: CartRequest = {

      userId: user.id,

      productId: this.product.id,

      quantity: 1

    };

    this.cartService
      .addToCart(request)
      .subscribe({

        next: () => {

          alert(
            '✅ Product Added Successfully'
          );

          this.router.navigate(['/cart']);

        },

        error: (err) => {

          console.error(
            'Add to cart error:',
            err
          );

          alert(
            'Unable to add product'
          );

        }

      });

  }


  // ==========================
  // ADD TO WISHLIST ❤️
  // ==========================

  addToWishlist(): void {

    if (!this.product) {
      return;
    }

    const userData =
      localStorage.getItem('user');

    if (!userData) {

      alert('Please Login First');

      this.router.navigate(['/login']);

      return;
    }

    const user = JSON.parse(userData);


    // Create Wishlist Request

    const request: WishlistRequest = {

      userId: user.id,

      productId: this.product.id

    };


    // Call Wishlist API

    this.wishlistService
      .addToWishlist(request)
      .subscribe({

        next: () => {

          alert(
            '❤️ Product Added to Wishlist'
          );

        },

        error: (err) => {

          console.error(
            'Add to wishlist error:',
            err
          );

          alert(
            'Unable to add product to wishlist'
          );

        }

      });

  }


  // ==========================
  // BUY NOW
  // ==========================

  buyNow(): void {

    if (!this.product) {
      return;
    }

    const userData =
      localStorage.getItem('user');

    if (!userData) {

      alert('Please Login First');

      this.router.navigate(['/login']);

      return;
    }

    this.addToCart();

  }


  // ==========================
  // BACK TO PRODUCTS
  // ==========================

  goBack(): void {

    this.router.navigate(['/products']);

  }

}