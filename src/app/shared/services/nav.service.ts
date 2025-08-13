import { Injectable, HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

// Menu
export interface Menu {
  path?: string;
  title?: string;
  type?: string;
  megaMenu?: boolean;
  image?: string;
  active?: boolean;
  badge?: boolean;
  badgeText?: string;
  children?: Menu[];

  //Add new
  setCat?: boolean;
  catId?: number;
}

@Injectable({
  providedIn: 'root',
})
export class NavService {
  public MENUITEMS: Menu[] | undefined;
  public ITEMS: BehaviorSubject<Menu[]> | undefined;

  private currentItemsSource: BehaviorSubject<Menu[] | null> =
    new BehaviorSubject<Menu[] | null>(null);
  currentItems$ = this.currentItemsSource.asObservable();

  constructor(private translate: TranslateService) {
    this.setLanguage();
  }

  public screenWidth: any;
  public leftMenuToggle: boolean = false;
  public mainMenuToggle: boolean = false;

  // Windows width
  @HostListener('window:resize', ['$event'])
  onResize(event?: any) {
    this.screenWidth = window.innerWidth;
  }

  setLanguage() {
    this.MENUITEMS = [
      {
        title: this.translate.instant('Seeds'),
        type: 'sub',
        active: false,
        children: [
          {
            path: '/shop/collection/left/sidebar',
            setCat: true,
            catId: 1,
            title: this.translate.instant('Herbs'),
            type: 'link',
          },
          {
            path: '/shop/collection/left/sidebar',
            setCat: true,
            catId: 2,
            title: this.translate.instant('Vegetable'),
            type: 'link',
          },
          {
            path: '/shop/collection/left/sidebar',
            setCat: true,
            catId: 3,
            title: this.translate.instant('Flowers'),
            type: 'link',
          },
        ],
      },
      {
        title: this.translate.instant('Tools'),
        type: 'sub',
        active: false,
        children: [
          {
            path: '/shop/product/3',
            title: this.translate.instant('Starter Kit'),
            type: 'link',
          },
          {
            path: '/shop/product/1',
            title: this.translate.instant('Seed Starting Trays'),
            type: 'link',
          },
          {
            path: '/shop/product/2',
            title: this.translate.instant('Domes & Bottom Trays'),
            type: 'link',
          },
        ],
      },
      {
        title: this.translate.instant('Info'),
        type: 'sub',
        active: false,
        children: [
          {
            path: '/blog/all',
            title: this.translate.instant('Blog'),
            type: 'link',
          },
          // { path: '/shop/collection/right/sidebar', title: 'info2', type: 'link' },
          // { path: '/shop/collection/no/sidebar', title: 'info3', type: 'link' },
        ],
      },
      {
        title: this.translate.instant('Confirm'),
        type: 'link',
        active: false,
        path: '/pages/confirm-payment',
        badge: true,
        badgeText: '',
      },
    ];
    this.ITEMS = new BehaviorSubject<Menu[]>(this.MENUITEMS);

    this.currentItemsSource.next(this.MENUITEMS);
  }
}
