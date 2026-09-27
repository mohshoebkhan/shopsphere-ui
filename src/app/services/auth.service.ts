import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { LoginRequest } from '../models/login-request';
import { LoginResponse } from '../models/login-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);

  login(request: LoginRequest): Observable<LoginResponse> {

    return this.http.post<LoginResponse>(
      `${environment.apiUrl}/auth/login`,
      request
    );
  }

  refreshToken(): Observable<LoginResponse> {

    const refreshToken =
      this.getRefreshToken();

    return this.http.post<LoginResponse>(
      `${environment.apiUrl}/auth/refresh?refreshToken=${refreshToken}`,
      {}
    );
  }

  saveToken(token: string): void {

    localStorage.setItem(
      'token',
      token
    );
  }

  getToken(): string | null {

    return localStorage.getItem(
      'token'
    );
  }

  saveRefreshToken(token: string): void {

    localStorage.setItem(
      'refreshToken',
      token
    );
  }

  getRefreshToken(): string | null {

    return localStorage.getItem(
      'refreshToken'
    );
  }

  saveUser(user: any): void {

    localStorage.setItem(
      'user',
      JSON.stringify(user)
    );
  }

  getUser(): any {

    const user =
      localStorage.getItem('user');

    return user
      ? JSON.parse(user)
      : null;
  }

  logout(): void {

    localStorage.removeItem('token');

    localStorage.removeItem(
      'refreshToken'
    );

    localStorage.removeItem('user');
  }
}