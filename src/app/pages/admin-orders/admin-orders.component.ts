import { Component, OnInit, inject } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css'],
})
export class AdminOrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  private authService = inject(AuthService);

  orders: Order[] = [];
  filteredOrders: Order[] = [];

  loading = false;
  updatingOrderId: number | null = null;

  // Search
  searchText = '';

  // Status filter
  selectedStatus = 'ALL';

  statusOptions = [
    'PLACED',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
  ];

  selectedOrder: Order | null = null;
  orderItems: any[] = [];
  loadingDetails = false;

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;

    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data;

        this.filteredOrders = data;

        this.loading = false;
      },

      error: (error) => {
        console.error('Failed to load admin orders:', error);

        this.loading = false;

        alert(error?.error?.message || 'Unable to load orders');
      },
    });
  }

  // ============================
  // SEARCH + FILTER
  // ============================

  applyFilters(): void {
    const search = this.searchText.trim().toLowerCase();

    this.filteredOrders = this.orders.filter((order) => {
      const matchesSearch =
        !search ||
        order.orderId?.toString().includes(search) ||
        order.fullName?.toLowerCase().includes(search) ||
        order.mobile?.toLowerCase().includes(search);

      const matchesStatus =
        this.selectedStatus === 'ALL' || order.status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchText = '';
    this.selectedStatus = 'ALL';

    this.applyFilters();
  }

  // ============================
  // UPDATE ORDER STATUS
  // ============================

  updateStatus(order: Order, event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newStatus = select.value;

    if (!newStatus || newStatus === order.status) {
      return;
    }

    this.updatingOrderId = order.orderId;

    this.orderService.updateOrderStatus(order.orderId, newStatus).subscribe({
      next: (response) => {
        order.status = newStatus;

        this.updatingOrderId = null;

        // Refresh filtered list after status update
        this.applyFilters();

        alert('Order status updated successfully');
      },

      error: (error) => {
        console.error('Status update error:', error);

        this.updatingOrderId = null;

        alert(error?.error?.message || 'Unable to update order status');

        // Restore dropdown value
        select.value = order.status;
      },
    });
  }

  isAdmin(): boolean {
    const user = this.authService.getUser();

    return user?.role?.toUpperCase() === 'ADMIN';
  }

  viewOrderDetails(order: Order): void {
    this.selectedOrder = order;
    this.orderItems = [];
    this.loadingDetails = true;

    this.orderService.getOrderItems(order.orderId).subscribe({
      next: (items) => {
        this.orderItems = items;
        this.loadingDetails = false;
      },

      error: (error) => {
        console.error('Failed to load order items:', error);

        this.loadingDetails = false;

        alert(error?.error?.message || 'Unable to load order details');
      },
    });
  }

  closeOrderDetails(): void {
    this.selectedOrder = null;
    this.orderItems = [];
  }
}
