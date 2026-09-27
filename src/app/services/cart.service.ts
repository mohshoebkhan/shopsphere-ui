import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Cart } from '../models/cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private http = inject(HttpClient);

  constructor() { }

  // Add Product to Cart
  addToCart(request: any): Observable<Cart> {

    return this.http.post<Cart>(
      `${environment.apiUrl}/cart`,
      request
    );

  }

  // Get User Cart
  getCart(userId: number): Observable<Cart[]> {

    return this.http.get<Cart[]>(
      `${environment.apiUrl}/cart/${userId}`
    );

  }
   //remove
   remove(cartId: number) {
    return this.http.delete(
      `${environment.apiUrl}/cart/${cartId}`
    );
  }
  increase(cartId:number){

  return this.http.put<Cart>(
    `${environment.apiUrl}/cart/increase/${cartId}`,
    {}
  );

}

decrease(cartId:number){

  return this.http.put<Cart>(
    `${environment.apiUrl}/cart/decrease/${cartId}`,
    {}
  );

}
}