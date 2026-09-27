import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Wishlist } from '../models/wishlist';

export interface WishlistRequest {

  userId: number;

  productId: number;

}

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  private http = inject(HttpClient);

  addToWishlist(
    request: WishlistRequest
  ): Observable<Wishlist> {

    return this.http.post<Wishlist>(
      `${environment.apiUrl}/wishlist`,
      request
    );

  }

  getWishlist(
    userId: number
  ): Observable<Wishlist[]> {

    return this.http.get<Wishlist[]>(
      `${environment.apiUrl}/wishlist/${userId}`
    );

  }

  removeFromWishlist(
    userId: number,
    productId: number
  ): Observable<any> {

    return this.http.delete(
      `${environment.apiUrl}/wishlist/${userId}/${productId}`
    );

  }

}