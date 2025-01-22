import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-filters',
  templateUrl: './product-filters.component.html',
  imports: [
      CommonModule,
      RouterModule,
      FormsModule
    ]
})
export class ProductFiltersComponent implements OnInit {
  @Input() categories: string[] = [];
  @Input() priceRange = { min: 0, max: 1000 };
  @Output() filterChange = new EventEmitter<any>();

  filters = {
    category: 'all',
    priceRange: [this.priceRange.min, this.priceRange.max],
    rating: 0,
    sortBy: 'popularity',
  };

  ngOnInit(): void {
    this.filters.priceRange = [this.priceRange.min, this.priceRange.max];
  }

  handleFilterChange(updatedValues: Partial<typeof this.filters>): void {
    this.filters = { ...this.filters, ...updatedValues };
    this.filterChange.emit(this.filters);
  }

  clearFilters(): void {
    this.filters = {
      category: 'all',
      priceRange: [this.priceRange.min, this.priceRange.max],
      rating: 0,
      sortBy: 'popularity',
    };
    this.filterChange.emit(this.filters);
  }
}
