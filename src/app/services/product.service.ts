import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_BASE_URL = 'http://localhost:3000/api';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<any> {
    return this.http.get<any>(`${API_BASE_URL}/products`);
  }

  getProductById(id: string): Observable<any> {
    return this.http.get<any>(`${API_BASE_URL}/products/${id}`);
  }

  createProduct(productData: any): Observable<any> {
    return this.http.post<any>(`${API_BASE_URL}/products`, productData);
  }

  updateProduct(id: string, productData: any): Observable<any> {
    return this.http.put<any>(`${API_BASE_URL}/products/${id}`, productData);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete<any>(`${API_BASE_URL}/products/${id}`);
  }
}
