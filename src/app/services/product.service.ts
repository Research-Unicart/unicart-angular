import { Injectable } from '@angular/core';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

const API_BASE_URL = 'http://localhost:3000/api';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService {
  intercept(req: any, next: any) {
    const token = localStorage.getItem('token');
    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      });
      return next.handle(cloned);
    }
    return next.handle(req);
  }
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${API_BASE_URL}/user/login`, credentials).pipe(
      tap((response) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post<any>(`${API_BASE_URL}/user/register`, userData);
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<any> {
    return this.http.get<any>(`${API_BASE_URL}/products`);
  }

  getProductById(id: string): Observable<any> {
    return this.http.get<any>(`${API_BASE_URL}/products/${id}`);
  }
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient) {}

  getAllOrders(): Observable<any> {
    return this.http.get<any>(`${API_BASE_URL}/orders`);
  }

  createOrder(orderData: any): Observable<any> {
    return this.http.post<any>(`${API_BASE_URL}/orders`, orderData);
  }

  getUserOrders(userId: string): Observable<any> {
    return this.http.get<any>(`${API_BASE_URL}/orders/user/${userId}`);
  }
}

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
];
