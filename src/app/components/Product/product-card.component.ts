import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../context/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class ProductCardComponent implements OnInit {
  @Input() product: any;

  loading = false;
  error: string | null = null;
  productData: any = null;
  parsedImages: any;
  parsedSpecs: any;
  displayImage: string | undefined;
  numericRating: number | undefined;
  priceRange: { min: number; max: number } | undefined;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.parsedImages =
      typeof this.product.images === 'string'
        ? JSON.parse(this.product.images)
        : this.product.images;
    this.parsedSpecs =
      typeof this.product.specs === 'string'
        ? JSON.parse(this.product.specs)
        : this.product.specs;
    this.displayImage = this.parsedImages?.[0] || '/placeholder-image.jpg';
    this.numericRating = parseFloat(this.product.rating);

    this.priceRange =
      this.product.has_variations && this.product.variations.length > 0
        ? {
            min: Math.min(
              ...this.product.variations.map((v: { price: string }) =>
                parseFloat(v.price)
              )
            ),
            max: Math.max(
              ...this.product.variations.map((v: { price: string }) =>
                parseFloat(v.price)
              )
            ),
          }
        : {
            min: parseFloat(this.product.base_price),
            max: parseFloat(this.product.base_price),
          };

    this.fetchProductDetails();
  }

  fetchProductDetails(): void {
    this.loading = true;
    this.productService.getProductById(this.product.id).subscribe(
      (data) => {
        this.productData = data;
        this.error = null;
        this.loading = false;
      },
      (err) => {
        this.error = 'Error loading product details';
        console.error('Error:', err);
        this.loading = false;
      }
    );
  }

  checkStock(product: {
    has_variations: any;
    variations: any;
    base_stock: any;
  }): boolean {
    if (product.has_variations) {
      return product.variations.every((v: { stock: number }) => v.stock <= 0);
    }
    return product.base_stock <= 0;
  }

  get isOutOfStock(): boolean {
    return this.productData
      ? this.checkStock(this.productData)
      : this.checkStock({
          has_variations: this.product.has_variations,
          variations: this.product.variations,
          base_stock: this.product.base_stock,
        });
  }

  handleAddToCart(): void {
    if (!this.product.has_variations) {
      this.productService.getProductById(this.product.id).subscribe(
        (freshProductData) => {
          this.cartService.addToCart(freshProductData[0], 1);
          this.router.navigate(['/cart']);
        },
        (err) => {
          this.error = 'Error adding to cart';
          console.error('Error:', err);
        }
      );
    }
  }

  handleShopNow(event: Event): void {
    event.stopPropagation();
    event.preventDefault();

    if (this.isOutOfStock) {
      return;
    }

    if (this.product.has_variations) {
      this.router.navigate([`/single-product/${this.product.id}`]);
    } else {
      this.handleAddToCart();
    }
  }

  handleCardClick(): void {
    this.router.navigate([`/single-product/${this.product.id}`]);
  }
}
