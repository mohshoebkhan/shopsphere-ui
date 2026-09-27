import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

import { Product } from '../../models/product';
import { CartRequest } from '../../models/cart-request';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];

  searchKeyword = '';
  selectedCategory = '';

  categories: string[] = [
    'Electronics',
    'Mobiles',
    'Laptops',
    'Clothing',
    'Shoes',
    'Accessories'
  ];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    /*
     * Read search text coming from Header.
     *
     * Example:
     * /products?search=mobile
     */

    this.route.queryParams.subscribe(params => {

      const search = params['search'];

      if (search) {

        this.searchKeyword = search;

        this.searchProducts();

      } else {

        this.searchKeyword = '';

        this.loadProducts();

      }

    });

  }

  filterByCategory(): void {

    /*
     * If no category is selected,
     * load all products.
     */

    if (!this.selectedCategory) {

      this.loadProducts();

      return;
    }

    this.productService
      .getProductsByCategory(this.selectedCategory)
      .subscribe({

        next: (data) => {

          this.products = data;

        },

        error: (err) => {

          console.error(
            'Category filter error:',
            err
          );

        }

      });

  }

  loadProducts(): void {

    this.productService
      .getAllProducts()
      .subscribe({

        next: (data) => {

          this.products = data;

        },

        error: (err) => {

          console.error(
            'Product loading error:',
            err
          );

        }

      });

  }

  searchProducts(): void {

    const keyword =
      this.searchKeyword.trim();

    /*
     * If search box is empty,
     * load all products.
     */

    if (!keyword) {

      this.router.navigate(
        ['/products'],
        {
          queryParams: {}
        }
      );

      return;

    }

    this.productService
      .searchProducts(keyword)
      .subscribe({

        next: (data) => {

          this.products = data;

        },

        error: (err) => {

          console.error(
            'Search error:',
            err
          );

        }

      });

  }

  addToCart(productId: number): void {

    const userData =
      localStorage.getItem('user');

    if (!userData) {

      alert('Please Login First');

      this.router.navigate(['/login']);

      return;
    }

    const user =
      JSON.parse(userData);

    const request: CartRequest = {

      userId: user.id,

      productId: productId,

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

  viewDetails(productId: number): void {

    this.router.navigate([
      '/products',
      productId
    ]);

  }

}