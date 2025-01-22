import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../context/cart.service';
import { CommonModule } from '@angular/common';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  images: string[];
  variation?: {
    id: string;
    variation: string;
    stock: number;
  };
  base_stock: number;
}

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class CartPageComponent implements OnInit {
  cart: CartItem[] = [];
  subtotal: number = 0;
  shipping: number = 10;
  tax: number = 0;
  total: number = 0;
  hasStockWarnings: boolean = false;

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cart = this.cartService.getCart();
    this.calculateTotals();
    this.checkStockWarnings();
  }

  calculateTotals(): void {
    this.subtotal = this.cartService.getCartTotal();
    this.tax = this.subtotal * 0.1;
    this.total = this.subtotal + this.shipping + this.tax;
  }

  checkStockWarnings(): void {
    this.hasStockWarnings = this.cart.some((item) => this.isAtStockLimit(item));
  }

  getAvailableStock(item: CartItem): number {
    return item.variation ? item.variation.stock : item.base_stock;
  }

  isAtStockLimit(item: CartItem): boolean {
    const availableStock = this.getAvailableStock(item);
    return item.quantity >= availableStock;
  }

  getRemainingStock(item: CartItem): number {
    const availableStock = this.getAvailableStock(item);
    return Math.max(0, availableStock - item.quantity);
  }

  handleUpdateQuantity(item: CartItem, change: number): void {
    const availableStock = this.getAvailableStock(item);
    const newQuantity = item.quantity + change;

    if (newQuantity <= 0 || newQuantity > availableStock) {
      return;
    }

    this.cartService.updateQuantity(item.id, newQuantity, item.variation);
    this.loadCart();
  }

  handleRemoveFromCart(item: CartItem): void {
    this.cartService.removeFromCart(item.id, item.variation);
    this.loadCart();
  }

  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }

  continueShopping(): void {
    this.router.navigate(['/']);
  }
}
