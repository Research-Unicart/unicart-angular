import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { ProductCardComponent } from './components/Product/product-card.component';
import { ProductListingComponent } from './pages/productlisting.component';
import { ProductGridComponent } from './components/Product/product-grid.component';
import { ProductFiltersComponent } from './components/Filters/product-filters.component';
import { PaginationComponent } from './components/Common/pagination.component';
import { CartPageComponent } from './pages/cart-page.component';
import { CheckoutComponent } from './pages/checkout.component';
import { SingleProductComponent } from './pages/single-product.component';
import { ThankYouComponent } from './pages/thank-you.component';
import { LoginComponent } from './pages/login.component';
import { RegisterComponent } from './pages/register.component';
import { UserProfileComponent } from './pages/user-profile.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    ProductCardComponent,
    ProductListingComponent,
    ProductGridComponent,
    ProductFiltersComponent,
    PaginationComponent,
    SingleProductComponent,
    CartPageComponent,
    CheckoutComponent,
    ThankYouComponent,
    UserProfileComponent,
    provideHttpClient(),
    provideAnimationsAsync('noop'),
    LoginComponent,
    RegisterComponent,
  ],
};
