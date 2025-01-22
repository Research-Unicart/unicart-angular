import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.component.html',
  imports: [CommonModule],
})
export class ThankYouComponent implements OnInit {
  orderDetails: any;
  orderNumber: string | undefined;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const storedOrderDetails = localStorage.getItem('lastOrder');
    this.orderDetails = storedOrderDetails
      ? JSON.parse(storedOrderDetails)
      : {};

    this.orderNumber = Math.random()
      .toString(36)
      .substring(2, 12)
      .toUpperCase();
  }

  navigateToProducts(): void {
    this.router.navigate(['/products']);
  }

  handlePrintOrder(): void {
    window.print();
  }
}
