import { Routes } from '@angular/router';
import { BlogComponent } from './blog.component';
import { AllComponent } from './all/all.component';
import { CatnipComponent } from './catnip/catnip.component';
import { ChamomileComponent } from './chamomile/chamomile.component';
import { LemonbalmComponent } from './lemonbalm/lemonbalm.component';
import { MarjoramComponent } from './marjoram/marjoram.component';
import { OrangethymeComponent } from './orangethyme/orangethyme.component';
import { OreganoComponent } from './oregano/oregano.component';
import { PeppermintComponent } from './peppermint/peppermint.component';
import { RosemaryComponent } from './rosemary/rosemary.component';
import { SageComponent } from './sage/sage.component';
import { SavoryComponent } from './savory/savory.component';
import { StoringSeedsComponent } from './storing-seeds/storing-seeds.component';
import { ThymeComponent } from './thyme/thyme.component';

export const blog: Routes = [
  {
    path: 'blog',
    component: BlogComponent,
  },
  {
    path: 'all',
    component: AllComponent,
  },
  {
    path: 'orangethyme',
    component: OrangethymeComponent,
  },
  {
    path: 'savory',
    component: SavoryComponent,
  },
  {
    path: 'oregano',
    component: OreganoComponent,
  },
  {
    path: 'lemonbalm',
    component: LemonbalmComponent,
  },
  {
    path: 'peppermint',
    component: PeppermintComponent,
  },
  {
    path: 'sage',
    component: SageComponent,
  },
  {
    path: 'marjoram',
    component: MarjoramComponent,
  },
  {
    path: 'rosemary',
    component: RosemaryComponent,
  },
  {
    path: 'thyme',
    component: ThymeComponent,
  },
  {
    path: 'catnip',
    component: CatnipComponent,
  },
  {
    path: 'chamomile',
    component: ChamomileComponent,
  },
  {
    path: 'storingseeds',
    component: StoringSeedsComponent,
  },
];
