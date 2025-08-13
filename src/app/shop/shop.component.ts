import { Component } from '@angular/core';
import { CartService } from '../shared/services/cart.service';
import { AppService } from '../shared/services/app.service';
import { Observable } from 'rxjs';
import { ShopService } from '../shared/services/shop.service';
import { HeaderOneComponent } from "../shared/header/header-one/header-one.component";
import { RouterOutlet } from '@angular/router';
import { FooterOneComponent } from "../shared/footer/footer-one/footer-one.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
  imports: [HeaderOneComponent, RouterOutlet, FooterOneComponent, CommonModule]
})
export class ShopComponent {
  showFooter$: Observable<boolean> | undefined;

  constructor(private cartService: CartService, private shopService: ShopService, private appService: AppService) {
    if (this.appService.isBrowser()) {
      //Load delivery method name
      this.cartService.getDeliveryMethodsName();
      this.showFooter$ = this.shopService.getShowFooter();
    }
  }
}
