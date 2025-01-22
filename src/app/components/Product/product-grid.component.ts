import { Component, Input } from '@angular/core';
import { ProductCardComponent } from './product-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-grid',
  templateUrl: './product-grid.component.html',
  imports: [ProductCardComponent, CommonModule],
})
export class ProductGridComponent {
  @Input() products: any[] = [];
  @Input() loading: boolean = false;
  @Input() error: string | null = null;

  loadingPlaceholder: number[] = Array(8).fill(0);

  retry() {
    window.location.reload();
  }
}
