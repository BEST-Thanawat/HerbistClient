import { Routes } from '@angular/router';
import { HerbistComponent } from './home/herbist.component';
import { BlogComponent } from './blog/blog.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { PagesComponent } from './pages/pages.component';
import { ShopComponent } from './shop/shop.component';

// export const routes: Routes = [];

export const routes: Routes = [
  {
    path: '',
    component: HerbistComponent,
    loadChildren: () => import('./home/home.routes').then(m => m.home)
  },
  {
    path: 'shop',
    component: ShopComponent,
    loadChildren: () => import('./shop/shop.routes').then(m => m.shop)
  },
  {
    path: 'pages',
    component: PagesComponent,
    loadChildren: () => import('./pages/pages.routes').then(m => m.pages)
  },
  {
    path: 'blog',
    component: BlogComponent,
    loadChildren: () => import('./blog/blog.routes').then(m => m.blog)
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    loadChildren: () => import('./checkout/checkout.routes').then(m => m.checkout)
  },
  {
    path: '**', // Navigate to Home Page if not found any page
    redirectTo: 'herbist',
  },
];