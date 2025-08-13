import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ShopService } from '../shared/services/shop.service';
import { AppService } from '../shared/services/app.service';
import { HeaderOneComponent } from "../shared/header/header-one/header-one.component";
import { RouterOutlet } from "@angular/router";
import { FooterOneComponent } from "../shared/footer/footer-one/footer-one.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HeaderOneComponent, RouterOutlet, FooterOneComponent, CommonModule]
})
export class CheckoutComponent {
  showFooter$: Observable<boolean> | undefined;

  constructor(private shopService: ShopService, private appService: AppService) {
    if (this.appService.isBrowser()) {
      this.showFooter$ = this.shopService.getShowFooter();    
    }
  }
}