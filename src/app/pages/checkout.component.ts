import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../context/cart.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
})
export class CheckoutComponent implements OnInit {
  cart: any[] = [];
  shippingMethod: string = 'standard';
  paymentMethod: string = 'credit';
  errors: any = {};
  formData: {
    [key in
      | 'firstName'
      | 'lastName'
      | 'email'
      | 'phone'
      | 'street'
      | 'apartment'
      | 'city'
      | 'state'
      | 'zip']: string;
  } = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    zip: '',
  };
  cardData: any;
  window: any;

  constructor(private router: Router, private cartService: CartService) {}

  ngOnInit(): void {
    this.cart = this.cartService.getCart();
  }

  get subtotal() {
    return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  get shipping() {
    return this.shippingMethod === 'express' ? 20 : 10;
  }

  onShippingMethodChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.shippingMethod = input.value;
  }

  onPaymentMethodChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.paymentMethod = input.value;
  }
  get tax() {
    return this.subtotal * 0.1;
  }

  get total() {
    return this.subtotal + this.shipping + this.tax;
  }

  validateCard(
    cardNumber: string,
    expiry: string,
    cvv: string,
    cardholderName: string
  ): any {
    const errors: any = {};
    const isValidLuhn = (number: string): boolean => {
      const digits = number.replace(/\D/g, '');
      let sum = 0;
      let isEven = false;

      for (let i = digits.length - 1; i >= 0; i--) {
        let digit = parseInt(digits[i]);

        if (isEven) {
          digit *= 2;
          if (digit > 9) digit -= 9;
        }

        sum += digit;
        isEven = !isEven;
      }
      return sum % 10 === 0;
    };

    if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
      errors.cardNumber = 'Please enter a valid 16-digit card number';
    } else if (!isValidLuhn(cardNumber)) {
      errors.cardNumber = 'Invalid card number';
    }

    const currentDate = new Date();
    const [expMonth, expYear] = expiry
      .split('/')
      .map((num) => parseInt(num.trim()));
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      errors.expiry = 'Use MM/YY format';
    } else if (expMonth < 1 || expMonth > 12) {
      errors.expiry = 'Invalid month';
    } else if (
      expYear < currentYear ||
      (expYear === currentYear && expMonth < currentMonth)
    ) {
      errors.expiry = 'Card has expired';
    }

    if (!/^\d{3,4}$/.test(cvv)) {
      errors.cvv = 'CVV must be 3 or 4 digits';
    }

    if (!cardholderName.trim()) {
      errors.cardholderName = 'Name on card is required';
    } else if (cardholderName.trim().length < 2) {
      errors.cardholderName = 'Please enter a valid name';
    }

    return errors;
  }

  handleInputChange(event: Event, fieldName: keyof typeof this.formData) {
    const target = event.target as HTMLInputElement;
    this.formData[fieldName] = target.value;
  }

  formatCardNumber(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{4})/g, '$1 ').trim();
    event.target.value = value;
  }

  formatExpiry(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    event.target.value = value;
  }

  formatCVV(event: any) {
    event.target.value = event.target.value.replace(/\D/g, '');
  }

  handleSubmit(event: Event) {
    event.preventDefault();

    if (this.paymentMethod === 'credit') {
      const cardNumber = (event.target as any).cardNumber.value;
      const expiry = (event.target as any).expiry.value;
      const cvv = (event.target as any).cvv.value;
      const cardholderName = (event.target as any).cardholderName.value;

      const cardErrors = this.validateCard(
        cardNumber,
        expiry,
        cvv,
        cardholderName
      );

      if (Object.keys(cardErrors).length > 0) {
        this.errors = cardErrors;
        const firstErrorField = document.querySelector(
          `[name="${Object.keys(cardErrors)[0]}"]`
        ) as HTMLElement;
        firstErrorField?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
        return;
      }
    }

    this.errors = {};

    const orderDetails = {
      cart: this.cart,
      subtotal: this.subtotal,
      shipping: this.shipping,
      tax: this.tax,
      total: this.total,
      email: this.formData.email,
      shippingAddress: {
        street: this.formData.street,
        apartment: this.formData.apartment,
        city: this.formData.city,
        state: this.formData.state,
        zip: this.formData.zip,
      },
      shippingMethod: this.shippingMethod,
      customerInfo: {
        firstName: this.formData.firstName,
        lastName: this.formData.lastName,
        phone: this.formData.phone,
      },
    };

    localStorage.setItem('lastOrder', JSON.stringify(orderDetails));

    this.cartService.clearCart();
    this.router.navigate(['/thank-you']);
  }
}
