import { Routes } from '@angular/router';
import { HerbistComponent } from './herbist.component';

export const home: Routes = [
  {
    path: '',
    component: HerbistComponent,
    loadChildren: () => import('./../shared/lazy-loaded.module').then((m) => m.LazyLoadedModule),
  },
];