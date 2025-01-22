import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../context/cart.service';
import { ProductService } from '../services/product.service';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class SingleProductComponent implements OnInit {
  quantity: number = 1;
  product: any = null;
  loading: boolean = true;
  error: string | null = null;
  selectedVariation: any = null;
  selectedImageIndex: number = 0;
  currentCartItem: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchProduct(id);
    }
  }

  async fetchProduct(id: string): Promise<void> {
    this.loading = true;
    try {
      const data = await firstValueFrom(this.productService.getProductById(id));
      if (!data?.[0]) throw new Error('Product not found');

      const productData = data[0];

      const specs =
        typeof productData.specs === 'string'
          ? JSON.parse(productData.specs)
          : productData.specs;
      const images =
        typeof productData.images === 'string'
          ? JSON.parse(productData.images)
          : productData.images;

      this.product = {
        ...productData,
        specs,
        images,
        rating: parseFloat(productData.rating.toString()) || 0,
        base_price: parseFloat(productData.base_price.toString()) || 0,
        variations: productData.variations?.map((variation: any) => ({
          ...variation,
          price: parseFloat(variation.price.toString()) || 0,
        })),
      };

      if (
        this.product &&
        this.product.variations &&
        this.product.variations.length > 0
      ) {
        this.selectedVariation = {
          ...this.product.variations[0],
          price: parseFloat(this.product.variations[0].price.toString()) || 0,
        };
      }

      this.updateCurrentCartItem();
    } catch (err: unknown) {
      this.error =
        err instanceof Error ? err.message : 'Error loading product details';
      console.error('Error:', err);
    } finally {
      this.loading = false;
    }
  }

  updateCurrentCartItem(): void {
    if (!this.product) return;

    const cart = this.cartService.getCart();
    this.currentCartItem = cart.find(
      (item: any) =>
        item.id === this.product?.id &&
        (this.product?.has_variations
          ? item.variation?.id === this.selectedVariation?.id
          : true)
    );

    this.quantity = this.currentCartItem?.quantity || 1;
  }

  getCurrentPrice(): number {
    if (!this.product) return 0;
    const price = this.selectedVariation?.price ?? this.product.base_price;
    return parseFloat(price.toString()) || 0;
  }

  getCurrentStock(): number {
    if (!this.product) return 0;
    return this.selectedVariation?.stock ?? this.product.base_stock ?? 0;
  }

  get isOutOfStock(): boolean {
    return this.getCurrentStock() <= 0;
  }

  handleQuantityChange(change: number): void {
    if (!this.product || this.isOutOfStock) return;

    const maxStock = this.getCurrentStock();
    const newQuantity = Math.max(1, Math.min(this.quantity + change, maxStock));
    this.quantity = newQuantity;

    if (this.currentCartItem) {
      this.cartService.updateQuantity(
        this.product.id,
        newQuantity,
        this.selectedVariation?.id || null
      );
      this.updateCurrentCartItem();
    }
  }

  handleAddToCart(): void {
    if (!this.product || this.isOutOfStock) return;

    if (!this.currentCartItem) {
      this.cartService.addToCart(
        this.product,
        this.quantity,
        this.selectedVariation?.id || null
      );
    } else {
      this.cartService.updateQuantity(
        this.product.id,
        this.quantity,
        this.selectedVariation?.id || null
      );
    }
    this.updateCurrentCartItem();
  }

  handleVariationChange(variation: any): void {
    this.selectedVariation = {
      ...variation,
      price: parseFloat(variation.price.toString()) || 0,
    };
    this.updateCurrentCartItem();
  }

  navigateToCart(): void {
    this.router.navigate(['/cart']);
  }

  getStarArray(): number[] {
    return Array(5).fill(0);
  }
}
