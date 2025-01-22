import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-coming-soon',
  templateUrl: './coming-soon.component.html',
  imports: [CommonModule, RouterModule],
})
export class ComingSoonComponent {
  email: string = '';
  pageName: string = '';

  constructor(private router: Router) {
    const currentPath = window.location.pathname.split('/')[1];
    this.pageName = currentPath.charAt(0).toUpperCase() + currentPath.slice(1);
  }

  handleSubscribe(): void {
    if (this.email) {
      alert('Thank you for subscribing! We will notify you when we launch.');
      this.email = '';
    }
  }

  navigateHome(): void {
    this.router.navigate(['/']);
  }
}
