import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { ProductGridComponent } from '../components/Product/product-grid.component';
import { ProductFiltersComponent } from '../components/Filters/product-filters.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaginationComponent } from '../components/Common/pagination.component';

@Component({
  selector: 'app-product-listing',
  templateUrl: './productlisting.component.html',
  imports: [
    ProductGridComponent,
    ProductFiltersComponent,
    CommonModule,
    RouterModule,
    PaginationComponent,
  ],
})
export class ProductListingComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  categories: string[] = [];
  priceRange = { min: 0, max: 1000 };
  loading = true;
  error: string | null = null;
  currentPage = 1;
  productsPerPage = 12;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.loading = true;
    this.error = null;

    this.productService.getAllProducts().subscribe(
      (data) => {
        this.products = data.map((product: any) => ({
          ...product,
          specs: (product.specs),
          images: (product.images),
          rating: parseFloat(product.rating),
          base_price: parseFloat(product.base_price),
        }));

        this.filteredProducts = [...this.products];

        this.categories = [
          ...new Set(data.map((product: any) => product.category as string)),
        ] as string[];

        const allPrices = data.flatMap((product: any) => {
          const { min, max } = this.getProductPriceRange(product);
          return [min, max];
        });

        this.priceRange = {
          min: Math.floor(Math.min(...allPrices)),
          max: Math.ceil(Math.max(...allPrices)),
        };

        this.loading = false;
      },
      (err) => {
        console.error('Error fetching products:', err);
        this.error = 'Failed to load products. Please try again later.';
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

  getProductPriceRange(product: any): { min: number; max: number } {
    if (product.has_variations && product.variations.length > 0) {
      const prices = product.variations.map((v: any) => parseFloat(v.price));
      return {
        min: Math.min(...prices),
        max: Math.max(...prices),
      };
    }
    return {
      min: parseFloat(product.base_price),
      max: parseFloat(product.base_price),
    };
  }

  handleFilterChange(filters: any): void {
    this.currentPage = 1;
    let filtered = [...this.products];

    if (filters.category !== 'all') {
      filtered = filtered.filter(
        (product) =>
          product.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    filtered = filtered.filter((product) => {
      const { min, max } = this.getProductPriceRange(product);
      return min <= filters.priceRange[1] && max >= filters.priceRange[0];
    });

    if (filters.rating > 0) {
      filtered = filtered.filter(
        (product) => Math.floor(product.rating) >= filters.rating
      );
    }

    switch (filters.sortBy) {
      case 'priceLowToHigh':
        filtered.sort(
          (a, b) =>
            this.getProductPriceRange(a).min - this.getProductPriceRange(b).min
        );
        break;
      case 'priceHighToLow':
        filtered.sort(
          (a, b) =>
            this.getProductPriceRange(b).max - this.getProductPriceRange(a).max
        );
        break;
      case 'newest':
        filtered.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case 'popularity':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
    }

    this.filteredProducts = filtered;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  handleRetry(): void {
    this.error = null;
    this.fetchProducts();
  }
}
