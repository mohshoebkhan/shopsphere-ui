import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Order } from '../models/order';
import { OrderRequest } from '../models/order-request';
import { OrderItemResponse } from '../models/order-item-response';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private http = inject(HttpClient);

  placeOrder(request: OrderRequest): Observable<Order> {

    return this.http.post<Order>(
      `${environment.apiUrl}/orders`,
      request
    );

  }

  getOrders(userId: number): Observable<Order[]> {

    return this.http.get<Order[]>(
      `${environment.apiUrl}/orders/${userId}`
    );

  }

  getOrderItems(orderId: number): Observable<OrderItemResponse[]> {
  return this.http.get<OrderItemResponse[]>(
    `${environment.apiUrl}/orders/${orderId}/items`
  );
}

cancelOrder(orderId: number, userId: number): Observable<string> {
  return this.http.put<string>(
    `${environment.apiUrl}/orders/${orderId}/cancel`,
    {},
    {
      params: {
        userId: userId.toString()
      },
      responseType: 'text' as 'json'
    }
  );
}

updateOrderStatus(orderId: number, status: string): Observable<string> {
  return this.http.put<string>(
    `${environment.apiUrl}/orders/${orderId}/status`,
    {},
    {
      params: {
        status: status
      },
      responseType: 'text' as 'json'
    }
  );
}

getAllOrders(): Observable<Order[]> {
  return this.http.get<Order[]>(
    `${environment.apiUrl}/orders/admin/all`
  );
}
}