import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../services/product.service';
import { CommonModule } from '@angular/common';
import { AuthContextService } from '../context/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  error: string = '';
  loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private authContextService: AuthContextService
  ) {
    this.registerForm = this.formBuilder.group(
      {
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {}

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  validateForm(): boolean {
    if (this.registerForm.invalid) {
      if (this.registerForm.errors?.['mismatch']) {
        this.error = 'Passwords do not match';
      } else if (this.registerForm.get('name')?.errors?.['required']) {
        this.error = 'Name is required';
      } else if (this.registerForm.get('email')?.errors?.['required']) {
        this.error = 'Email is required';
      } else if (this.registerForm.get('email')?.errors?.['email']) {
        this.error = 'Please enter a valid email address';
      } else if (this.registerForm.get('password')?.errors?.['minlength']) {
        this.error = 'Password must be at least 6 characters long';
      }
      return false;
    }
    return true;
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    this.error = '';

    const registrationData = {
      name: this.registerForm.get('name')?.value,
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value,
    };

    this.authService.register(registrationData).subscribe({
      next: (userData) => {
        this.authContextService.login(userData);
        const from = this.route.snapshot.queryParams['returnUrl'] || '/profile';
        this.router.navigateByUrl(from);
      },
      error: (err) => {
        console.error('Registration error:', err);
        this.error =
          err.error?.message || 'Registration failed. Please try again.';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
