import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { OrderService } from '../../services/order.service';
import { OrderItemResponse } from '../../models/order-item-response';
import { Order } from '../../models/order';

@Component({
selector: 'app-order-details',
standalone: true,
imports: [CommonModule],
templateUrl: './order-details.component.html',
styleUrl: './order-details.component.css'
})
export class OrderDetailsComponent implements OnInit {

private orderService = inject(OrderService);
private route = inject(ActivatedRoute);
private router = inject(Router);

order: Order | null = null;
orderItems: OrderItemResponse[] = [];

loading = true;
errorMessage = '';

// =========================
// ORDER STATUS STEPS
// =========================

statusSteps = [
{
status: 'PLACED',
label: 'Order Placed',
icon: '🛒'
},
{
status: 'CONFIRMED',
label: 'Order Confirmed',
icon: '✓'
},
{
status: 'PROCESSING',
label: 'Processing',
icon: '⚙️'
},
{
status: 'SHIPPED',
label: 'Shipped',
icon: '🚚'
},
{
status: 'DELIVERED',
label: 'Delivered',
icon: '📦'
}
];

ngOnInit(): void {


const orderId = Number(
  this.route.snapshot.paramMap.get('orderId')
);

if (!orderId) {

  console.error('Invalid order ID');

  this.router.navigate(['/orders']);

  return;
}

this.loadOrderDetails(orderId);


}

// =========================
// LOAD ORDER DETAILS
// =========================

loadOrderDetails(orderId: number): void {


const userData = localStorage.getItem('user');

if (!userData) {

  this.router.navigate(['/login']);

  return;
}

const user = JSON.parse(userData);

this.loading = true;

// Load order information
this.orderService.getOrders(user.id).subscribe({

  next: (orders) => {

    this.order = orders.find(
      item => item.orderId === orderId
    ) || null;

    // Load order items
    this.loadOrderItems(orderId);
  },

  error: (err) => {

    console.error(
      'Order loading error:',
      err
    );

    this.errorMessage =
      'Unable to load order details.';

    this.loading = false;
  }
});


}

// =========================
// LOAD ORDER ITEMS
// =========================

loadOrderItems(orderId: number): void {

this.orderService.getOrderItems(orderId).subscribe({

  next: (items) => {

    this.orderItems = items;

    console.log(
      'Order items loaded:',
      items
    );

    this.loading = false;
  },

  error: (err) => {

    console.error(
      'Order items loading error:',
      err
    );

    this.errorMessage =
      'Unable to load order items.';

    this.loading = false;
  }
});


}

// =========================
// ITEMS TOTAL
// =========================

getItemsTotal(): number {


return this.orderItems.reduce(
  (sum, item) =>
    sum + item.totalPrice,
  0
);


}

// =========================
// ORDER STATUS CLASS
// =========================

getStatusClass(status: string): string {


switch (status?.toLowerCase()) {

  case 'placed':
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
    return 'status-pending';
}


}

// =========================
// STATUS TIMELINE
// =========================

getStatusIndex(): number {

if (!this.order?.status) {
  return -1;
}

const currentStatus =
  this.order.status.toUpperCase();

return this.statusSteps.findIndex(
  step => step.status === currentStatus
);


}

isStatusCompleted(index: number): boolean {


const currentIndex =
  this.getStatusIndex();

if (currentIndex === -1) {
  return false;
}

return index <= currentIndex;


}

isCurrentStatus(index: number): boolean {


const currentIndex =
  this.getStatusIndex();

return index === currentIndex;


}

isOrderCancelled(): boolean {


return this.order?.status?.toUpperCase() === 'CANCELLED'
    || this.order?.status?.toUpperCase() === 'CANCELED';


}

// =========================
// NAVIGATION
// =========================

goBackToOrders(): void {


this.router.navigate(['/orders']);


}

continueShopping(): void {


this.router.navigate(['/products']);


}

}
