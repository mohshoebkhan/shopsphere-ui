import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/cart';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { OrderRequest } from '../../models/order-request';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    public router: Router,
  ) {}

  private service = inject(CartService);

  cartItems: Cart[] = [];

  total: number = 0;

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user')!);

    this.loadCart(user.id);
  }

  loadCart(userId: number) {
    this.service.getCart(userId).subscribe({
      next: (data) => {
        this.cartItems = data;

        this.calculateTotal();
      },
    });
  }

  calculateTotal() {
    this.total = this.cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  }

  removeItem(cartId: number) {
    this.service.remove(cartId).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter(
          (item) => item.cartId !== cartId,
        );

        this.calculateTotal();

        alert('Item Removed Successfully');
      },
    });
  }

  increase(cartId: number) {
    this.service.increase(cartId).subscribe({
      next: () => {
        const user = JSON.parse(localStorage.getItem('user')!);

        this.loadCart(user.id);
      },
    });
  }

  decrease(cartId: number) {
    this.service.decrease(cartId).subscribe({
      next: () => {
        const user = JSON.parse(localStorage.getItem('user')!);

        this.loadCart(user.id);
      },
    });
  }

  placeOrder() {
    const user = JSON.parse(localStorage.getItem('user')!);

    const request: OrderRequest = {
      userId: user.id,
      fullName: '',
      mobile: '',
      address: '',
      city: '',
      state: '',
      pincode: '',

      paymentMethod: 'Cash on Delivery',
    };

    this.orderService.placeOrder(request).subscribe({
      next: (response) => {
        alert('Order Placed Successfully!');

        this.router.navigate(['/orders']);
      },

      error: (err) => {
        console.log(err);

        alert('Unable to place order.');
      },
    });
  }

  goToCheckout(): void {
    if (this.cartItems.length === 0) {
      alert('Your cart is empty');

      return;
    }

    this.router.navigate(['/checkout']);
  }
}
