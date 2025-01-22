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
    provideHttpClient(),
  ]
};
