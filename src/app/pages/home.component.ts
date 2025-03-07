import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { ProductCardComponent } from "../components/Product/product-card.component";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ProductCardComponent
  ]
})
export class HomeComponent implements OnInit {
  featuredProducts: any[] = [];
  loading = true;
  error: string | null = null;
  email = '';
  subscribeLoading = false;
  subscribeMessage: { type: string, text: string } | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.fetchFeaturedProducts();
  }

  fetchFeaturedProducts(): void {
    this.loading = true;
    this.productService.getAllProducts().subscribe(
      (data) => {
        const processedProducts = data
          .filter((product: any) => product)
          .map((product: any) => ({
            ...product,
            specs: (product.specs),
            images: (product.images),
            rating: parseFloat(product.rating),
            base_price: parseFloat(product.base_price),
          }))
          .slice(0, 12);
        this.featuredProducts = processedProducts;
        this.error = null;
        this.loading = false;
      },
      (err) => {
        this.error = 'Failed to load featured products. Please try again later.';
        this.loading = false;
      }
    );
  }

  safeJSONParse(jsonString: string, fallback: any = {}): any {
    try {
      return JSON.parse(jsonString);
    } catch (err) {
      console.error('Error parsing JSON:', err);
      return fallback;
    }
  }

  handleSubscribe(event: Event): void {
    event.preventDefault();
    this.subscribeLoading = true;
    this.subscribeMessage = null;

    setTimeout(() => {
      this.subscribeMessage = { type: 'success', text: 'Successfully subscribed to newsletter!' };
      this.email = '';
      this.subscribeLoading = false;
    }, 1000);
  }
}
