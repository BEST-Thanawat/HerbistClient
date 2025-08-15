import { Routes } from '@angular/router';
import { CartComponent } from './cart/cart.component';
import { CollectionLeftSidebarComponent } from './collection/collection-left-sidebar/collection-left-sidebar.component';
import { ProductLeftSidebarComponent } from './product/product-left-sidebar.component';
import { ProductResolver } from '../shared/services/product.service';

export const shop: Routes = [
  {
    path: 'product/:id',
    component: ProductLeftSidebarComponent,
    resolve: { product: ProductResolver },
  },
  {
    path: 'collection/left/sidebar',
    component: CollectionLeftSidebarComponent,
  },
  {
    path: 'cart',
    component: CartComponent,
  },
];
