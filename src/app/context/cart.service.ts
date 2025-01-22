import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private items: any[] = [];

  constructor() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.items = JSON.parse(savedCart);
    }
  }

  private saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.items));
  }

  addToCart(
    product: any,
    quantity: number = 1,
    variationId: string | null = null
  ): void {
    try {
      const specs =
        typeof product.specs === 'string'
          ? JSON.parse(product.specs)
          : product.specs;
      const images =
        typeof product.images === 'string'
          ? JSON.parse(product.images)
          : product.images;

      const selectedVariation = variationId
        ? product.variations.find((v: any) => v.id === variationId)
        : null;

      const price = selectedVariation
        ? parseFloat(selectedVariation.price)
        : parseFloat(product.base_price);
      const availableStock = selectedVariation
        ? selectedVariation.stock
        : product.base_stock;

      if (quantity > availableStock) {
        console.warn('Requested quantity exceeds available stock');
        return;
      }

      const existingItemIndex = this.items.findIndex(
        (item) =>
          item.id === product.id &&
          item.variation?.variation === selectedVariation?.variation
      );

      if (existingItemIndex > -1) {
        const newQuantity = this.items[existingItemIndex].quantity + quantity;
        const stockLimit = selectedVariation
          ? selectedVariation.stock
          : product.base_stock;

        if (newQuantity <= stockLimit) {
          this.items[existingItemIndex].quantity = newQuantity;
        }
      } else {
        this.items.push({
          id: product.id,
          name: product.name,
          category: product.category,
          price,
          quantity,
          variation: selectedVariation,
          images,
          specs,
          base_price: parseFloat(product.base_price),
          base_stock: product.base_stock,
          has_variations: product.has_variations === 1,
          description: product.description,
        });
      }

      this.saveCart();
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  }

  removeFromCart(productId: string, variation: any = null): void {
    this.items = this.items.filter(
      (item) =>
        !(
          item.id === productId &&
          item.variation?.variation === variation?.variation
        )
    );
    this.saveCart();
  }

  updateQuantity(
    productId: string,
    quantity: number,
    variation: any = null
  ): void {
    const item = this.items.find(
      (i) =>
        i.id === productId && i.variation?.variation === variation?.variation
    );

    if (item) {
      const maxStock = variation ? variation.stock : item.base_stock;
      if (quantity <= maxStock) {
        item.quantity = quantity;
        this.saveCart();
      } else {
        console.warn('Requested quantity exceeds available stock');
      }
    }
  }

  clearCart(): void {
    this.items = [];
    this.saveCart();
  }

  getCartTotal(): number {
    return this.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  getCart(): any[] {
    return this.items;
  }
}
