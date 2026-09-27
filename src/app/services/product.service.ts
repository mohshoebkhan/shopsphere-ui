import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private http = inject(HttpClient);

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${environment.apiUrl}/products`
    );
  }

  getProductById(id: number): Observable<Product> {

  return this.http.get<Product>(
    `${environment.apiUrl}/products/${id}`
  );

}
  searchProducts(keyword: string): Observable<Product[]> {

    const params = new HttpParams()
      .set('name', keyword);

    return this.http.get<Product[]>(
      `${environment.apiUrl}/products/search`,
      { params }
    );
  }

  getProductsByCategory(category: string): Observable<Product[]> {

    const params = new HttpParams()
      .set('category', category);

    return this.http.get<Product[]>(
      `${environment.apiUrl}/products/category/${category}`
    );
  }

  getProductsByBrand(brand: string): Observable<Product[]> {

    return this.http.get<Product[]>(
      `${environment.apiUrl}/products/brand/${brand}`
    );
  }

  getProductsByPrice(min: number, max: number): Observable<Product[]> {

    const params = new HttpParams()
      .set('min', min)
      .set('max', max);

    return this.http.get<Product[]>(
      `${environment.apiUrl}/products/price`,
      { params }
    );
  }

}