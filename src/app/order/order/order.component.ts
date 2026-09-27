import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit {

  private orderService = inject(OrderService);
  private router = inject(Router);

  orders: Order[] = [];

  loading = true;

  ngOnInit(): void {

    const userData =
      localStorage.getItem('user');

    if (!userData) {

      alert('Please Login First');

      this.router.navigate(['/login']);

      return;
    }

    const user = JSON.parse(userData);

    this.loadOrders(user.id);
  }

  loadOrders(userId: number): void {

    this.loading = true;

    this.orderService
      .getOrders(userId)
      .subscribe({

        next: (data) => {

          this.orders = data;

          this.loading = false;

        },

        error: (err) => {

          console.error(
            'Orders loading error:',
            err
          );

          this.loading = false;

          alert(
            'Unable to load your orders.'
          );

        }

      });

  }

 viewOrderDetails(orderId: number): void {

    this.router.navigate([
      '/orders',
      orderId
    ]);

  }

  continueShopping(): void {

    this.router.navigate(['/products']);

  }

  goToCart(): void {

    this.router.navigate(['/cart']);

  }

  getStatusClass(status: string): string {

    if (!status) {
      return 'status-default';
    }

    switch (status.toLowerCase()) {

      case 'pending':
        return 'status-pending';

      case 'confirmed':
        return 'status-confirmed';

      case 'processing':
        return 'status-processing';

      case 'shipped':
        return 'status-shipped';

      case 'delivered':
        return 'status-delivered';

      case 'cancelled':
      case 'canceled':
        return 'status-cancelled';

      default:
        return 'status-default';
    }

  }

  getTotalSpent(): number {

  return this.orders.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  );

}

cancelOrder(orderId: number): void {

  const confirmed = confirm(
    'Are you sure you want to cancel this order?'
  );

  if (!confirmed) {
    return;
  }

  const userData = localStorage.getItem('user');

  if (!userData) {
    alert('Please Login First');
    this.router.navigate(['/login']);
    return;
  }

  const user = JSON.parse(userData);

  this.orderService.cancelOrder(orderId, user.id).subscribe({

    next: (response) => {

      console.log(
        'Order cancelled successfully:',
        response
      );

      alert('Order cancelled successfully');

      // Reload orders so updated status is displayed
      this.loadOrders(user.id);
    },

    error: (err) => {

      console.error(
        'Cancel order error:',
        err
      );

      alert(
        err.error?.message ||
        'Unable to cancel order'
      );
    }

  });
}
}
