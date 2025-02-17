import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService, OrderService } from '../services/product.service';
import { AuthContextService } from '../context/auth.service';
import { forkJoin, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';

interface Order {
  id: string;
  orderId: string;
  orderCreatedAt: string;
  status: string;
  items: OrderItem[];
  paymentMethod: string;
}

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  imports: [CommonModule, MatTabsModule],
})
export class UserProfileComponent implements OnInit {
  selectedTab = 0;
  user: any = null;
  orders: Order[] = [];
  products: { [key: string]: Product } = {};
  loading = true;
  error: string | null = null;
  authLoading = false;

  constructor(
    private router: Router,
    private authService: AuthContextService,
    private orderService: OrderService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.authLoading = true;
    this.user = this.authService.getUser();

    console.log('User:', this.user);

    if (this.user) {
      this.fetchOrders();
    }
    this.authLoading = false;
  }

  calculateOrderTotal(order: Order): number {
    const subtotal = order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shipping = order.paymentMethod === 'express' ? 20 : 10;
    const tax = subtotal * 0.1;
    return subtotal + shipping + tax;
  }

  fetchOrders(): void {
    this.loading = true;
    this.orderService
      .getUserOrders(this.user.user.id)
      .pipe(
        switchMap((orders: Order[]) => {
          this.orders = orders;
          const productIds: string[] = [
            ...new Set(
              orders.flatMap((order: Order) =>
                order.items.map((item: OrderItem) => item.productId)
              )
            ),
          ];

          if (productIds.length === 0) {
            return of({});
          }

          const productRequests = productIds.map((id) =>
            this.productService
              .getProductById(id)
              .pipe(catchError(() => of(null)))
          );

          return forkJoin(productRequests).pipe(
            switchMap((products) => {
              const productMap: { [key: string]: Product } = {};
              products.forEach((product, index) => {
                if (product) {
                  productMap[productIds[index]] = product[0];
                }
              });
              return of(productMap);
            })
          );
        })
      )
      .subscribe({
        next: (productMap) => {
          this.products = productMap;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching data:', err);
          this.error = 'Failed to fetch data';
          this.loading = false;
        },
      });
  }

  handleLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }
}
