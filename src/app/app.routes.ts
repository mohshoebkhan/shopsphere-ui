import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

import { ProductListComponent } from './product/product-list/product-list.component';
import { ProductDetailsComponent } from './product/product-details/product-details.component';

import { CartComponent } from './cart/cart/cart.component';
import { OrderComponent } from './order/order/order.component';
import { WishlistComponent } from './wishlist/wishlist/wishlist.component';

import { authGuard } from './guards/auth.guard';
import { CheckoutComponent } from './checkout/checkout/checkout.component';
import { OrderDetailsComponent } from './order/order-details/order-details.component';

export const routes: Routes = [

  // =========================
  // PUBLIC ROUTES
  // =========================

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'register',
    component: RegisterComponent
  },

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'products',
    component: ProductListComponent
  },

  {
    path: 'products/:id',
    component: ProductDetailsComponent
  },


  // =========================
  // PROTECTED ROUTES
  // =========================

  {
    path: 'cart',
    component: CartComponent,
    canActivate: [authGuard]
  },

  {
    path: 'orders',
    component: OrderComponent,
    canActivate: [authGuard]
  },

  {
    path: 'wishlist',
    component: WishlistComponent,
    canActivate: [authGuard]
  },

  {
  path: 'checkout',
  component: CheckoutComponent,
  canActivate: [authGuard]
},

{
  path: 'orders/:orderId',
  component: OrderDetailsComponent,
  canActivate: [authGuard]
},
  // =========================
  // UNKNOWN ROUTE
  // =========================

  {
    path: '**',
    redirectTo: 'login'
  }

];