import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout.component';
import { HomeComponent } from './pages/home.component';
import { ProductListingComponent } from './pages/productlisting.component';
import { ComingSoonComponent } from './pages/coming-soon.component';
import { CartPageComponent } from './pages/cart-page.component';
import { CheckoutComponent } from './pages/checkout.component';
import { SingleProductComponent } from './pages/single-product.component';
import { ThankYouComponent } from './pages/thank-you.component';
import { UserProfileComponent } from './pages/user-profile.component';
import { LoginComponent } from './pages/login.component';
import { RegisterComponent } from './pages/register.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'products', component: ProductListingComponent },
      { path: 'single-product/:id', component: SingleProductComponent },
      { path: 'cart', component: CartPageComponent },
      { path: 'checkout', component: CheckoutComponent },
      { path: 'thank-you', component: ThankYouComponent },
      { path: 'profile', component: UserProfileComponent },
      { path: '**', component: ComingSoonComponent },
    ],
  },
];
