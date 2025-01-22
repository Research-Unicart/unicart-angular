import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CartService } from '../context/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  standalone: true,
  imports: [RouterModule, CommonModule],
})
export class MainLayoutComponent {
  cartItemCount: number;
  pages: string[] = [
    'Products',
    'Categories',
    'About Us',
    'Contact Us',
    'More',
  ];

  constructor(private cartService: CartService, private router: Router) {
    this.cartItemCount = this.cartService
      .getCart()
      .reduce((total, item) => total + item.quantity, 0);
  }

  handleSearch(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Enter') {
      this.router.navigate(['/search'], { queryParams: { q: input.value } });
    }
  }
}
