import { Component, OnInit } from '@angular/core';
import { NavService } from '../../services/nav.service';
import { Menu } from '../../services/nav.service';
import { ShopParams } from '../../classes/shopParams';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, TranslateModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  currentItems$!: Observable<Menu[] | null>;

  constructor(
    private router: Router,
    public navServices: NavService,
    private productService: ProductService
  ) {
    this.currentItems$ = this.navServices.currentItems$;
    this.currentItems$.subscribe();

    this.router.events.subscribe((event) => {
      this.navServices.mainMenuToggle = false;
    });
  }

  ngOnInit(): void {}

  mainMenuToggle(): void {
    this.navServices.mainMenuToggle = !this.navServices.mainMenuToggle;
  }

  // Click Toggle menu (Mobile)
  toggletNavActive(item: any) {
    item.active = !item.active;
  }

  setCatagory(setCat: boolean, id: number) {
    if (setCat) {
      //Set catagory id
      const params = new ShopParams();
      params.typeId = id;
      params.pageSize = 10;
      this.productService.setShopParams(params);
    }
  }
}
