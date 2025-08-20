import { Injectable, HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

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

  private currentItemsSource: BehaviorSubject<Menu[] | null> = new BehaviorSubject<Menu[] | null>(null);
  currentItems$ = this.currentItemsSource.asObservable();

  private currentIsEnglishSource: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  currentIsEnglish$ = this.currentIsEnglishSource.asObservable();

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
    var lang = this.translate.getCurrentLang();

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

    this.currentIsEnglishSource.next(lang == 'th' ? false : true);
    this.currentItemsSource.next(this.MENUITEMS);
  }

  //Preset to preload hero images
  GetResponsiveSrcSet(publicId: string): string {
    return `
    ${environment.cloudinaryURL + ',w_480/' + environment.cloudinaryId + '/' + publicId + ' 480w'},
    ${environment.cloudinaryURL + ',w_768/' + environment.cloudinaryId + '/' + publicId + ' 768w'},
    ${environment.cloudinaryURL + ',w_1200/' + environment.cloudinaryId + '/' + publicId + ' 1200w'},
    ${environment.cloudinaryURL + ',w_1880/' + environment.cloudinaryId + '/' + publicId + ' 1880w'}
  `;
  }

  GetProductResponsiveSrcSet(publicId: string): string {
    return `
    ${environment.cloudinaryURL + ',w_200/' + environment.cloudinaryId + '/' + publicId + ' 200w'},
    ${environment.cloudinaryURL + ',w_300/' + environment.cloudinaryId + '/' + publicId + ' 300w'},
  `;

    // GetProductResponsiveSrcSet(publicId: string): string {
    //   return `
    //   ${environment.cloudinaryURL + ',w_200/' + environment.cloudinaryId + '/' + publicId + ' 200w'},
    //   ${environment.cloudinaryURL + ',w_400/' + environment.cloudinaryId + '/' + publicId + ' 400w'},
    //   ${environment.cloudinaryURL + ',w_800/' + environment.cloudinaryId + '/' + publicId + ' 800w'},
    //   ${environment.cloudinaryURL + ',w_1024/' + environment.cloudinaryId + '/' + publicId + ' 1024w'}
    // `;
  }
}
