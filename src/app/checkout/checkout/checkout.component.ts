import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';

import { Cart } from '../../models/cart';
import { OrderRequest } from '../../models/order-request';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private router = inject(Router);

  cartItems: Cart[] = [];

  total = 0;

  loading = true;
  placingOrder = false;

  checkoutData = {
    fullName: '',
    mobile: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  };

  ngOnInit(): void {
    const userData = localStorage.getItem('user');

    if (!userData) {
      alert('Please Login First');

      this.router.navigate(['/login']);

      return;
    }

    const user = JSON.parse(userData);

    this.loadCart(user.id);
  }

  loadCart(userId: number): void {
    this.loading = true;

    this.cartService.getCart(userId).subscribe({
      next: (data) => {
        this.cartItems = data;

        this.calculateTotal();

        this.loading = false;

        if (this.cartItems.length === 0) {
          alert('Your cart is empty');

          this.router.navigate(['/products']);
        }
      },

      error: (err) => {
        console.error('Checkout cart loading error:', err);

        this.loading = false;

        alert('Unable to load your cart');

        this.router.navigate(['/cart']);
      },
    });
  }

  calculateTotal(): void {
    this.total = this.cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  }

  placeOrder(): void {
    if (!this.validateForm()) {
      return;
    }

    const userData = localStorage.getItem('user');

    if (!userData) {
      alert('Please Login First');

      this.router.navigate(['/login']);

      return;
    }

    const user = JSON.parse(userData);

    const request: OrderRequest = {
      userId: user.id,
      fullName: this.checkoutData.fullName.trim(),
      mobile: this.checkoutData.mobile.trim(),
      address: this.checkoutData.address.trim(),
      city: this.checkoutData.city.trim(),
      state: this.checkoutData.state.trim(),
      pincode: this.checkoutData.pincode.trim(),
      paymentMethod: 'Cash on Delivery',
    };

    this.placingOrder = true;

    this.orderService.placeOrder(request).subscribe({
      next: (response) => {
        console.log('Order placed successfully:', response);

        this.placingOrder = false;

        alert('🎉 Order Placed Successfully!');

        this.router.navigate(['/orders']);
      },

      error: (err) => {
        console.error('Order placement error:', err);

        this.placingOrder = false;

        alert(err.error?.message || 'Unable to place order. Please try again.');
      },
    });
  }

  validateForm(): boolean {
    if (!this.checkoutData.fullName.trim()) {
      alert('Please enter your full name');

      return false;
    }

    if (!this.checkoutData.mobile.trim()) {
      alert('Please enter your mobile number');

      return false;
    }

    const mobilePattern = /^[0-9]{10}$/;

    if (!mobilePattern.test(this.checkoutData.mobile.trim())) {
      alert('Mobile number must contain exactly 10 digits');

      return false;
    }

    if (!this.checkoutData.address.trim()) {
      alert('Please enter your address');

      return false;
    }

    if (!this.checkoutData.city.trim()) {
      alert('Please enter your city');

      return false;
    }

    if (!this.checkoutData.state.trim()) {
      alert('Please enter your state');

      return false;
    }

    if (!this.checkoutData.pincode.trim()) {
      alert('Please enter your pincode');

      return false;
    }

    const pincodePattern = /^[0-9]{6}$/;

    if (!pincodePattern.test(this.checkoutData.pincode.trim())) {
      alert('Pincode must contain exactly 6 digits');

      return false;
    }

    return true;
  }

  goBackToCart(): void {
    this.router.navigate(['/cart']);
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }
}
