import {
  Component,
  OnInit,
  Input,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, Observable, startWith, Subscription } from 'rxjs';
import { IUser } from '../../classes/user';
import { AccountService } from '../../services/account.service';
import { ShopService } from '../../services/shop.service';
import { environment } from '../../../../environments/environment';
import { MenuComponent } from '../../components/menu/menu.component';
import { SettingsComponent } from '../../components/settings/settings.component';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-header-one',
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    MenuComponent,
    SettingsComponent
  ],
  templateUrl: './header-one.component.html',
  styleUrls: ['./header-one.component.scss'],
})
export class HeaderOneComponent implements OnInit, OnDestroy {
  logoImg = environment.cloudinary
    ? environment.cloudinaryURL + '/' + environment.cloudinaryId + '/assets/images/icon/herbist.png'
    : 'assets/images/icon/herbist.png';

  @Input() class: string | undefined;
  @Input() themeLogo: string = this.logoImg; //'assets/images/icon/herbist.png'; // Default Logo
  @Input() topbar: boolean = true; // Default True
  @Input() sticky: boolean = true; // Default false

  public stick: boolean = false;

  currentUser$!: Observable<IUser | null>;
  mobileSideBar: boolean | undefined;
  mobileDashboardSideBar: boolean | undefined;
  productPage: boolean = false;
  dashboardPage: boolean = false;
  navigationSubs = new Subscription();
  navigationDashboardSubs = new Subscription();

  constructor(
    private accountService: AccountService,
    private shopService: ShopService,
    private router: Router
  ) {
    this.shopService.getMobileSidebar().subscribe({
      next: (value: boolean) => {
        this.mobileSideBar = value;
      },
      error: (e) => {
        console.error(e);
      },
    });

    this.shopService.getMobileDashboardSidebar().subscribe({
      next: (value: boolean) => {
        this.mobileDashboardSideBar = value;
      },
      error: (e) => {
        console.error(e);
      },
    });

    this.navigationSubs = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // * NavigationEnd: When navigation ends successfully.
        //console.log('NavigationEnd 1');
        // console.log(this.router.url);
        if (
          this.router.url.includes('/shop/product') ||
          this.router.url.includes('/shop/collection/left/sidebar')
        ) {
          this.productPage = true;
        } else {
          this.productPage = false;
        }
      }
    });

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        startWith(this.router)
      )
      .subscribe((event: NavigationEnd | any) => {
        // console.log('NavigationEnd 2');
        // console.log(this.router.url);
        if (this.router.url.includes('/pages/dashboard')) {
          this.dashboardPage = true;
        } else {
          this.dashboardPage = false;
        }
      });
  }

  ngOnInit(): void {
    this.currentUser$ = this.accountService.currentUser$;
  }

  ngOnDestroy(): void {
    this.navigationSubs.unsubscribe();
    this.shopService.setMobileSidebar(false);
    this.navigationDashboardSubs.unsubscribe();
    this.shopService.setMobileDashboardSidebar(false);
  }

  // @HostListener Decorator
  @HostListener('window:scroll', [])
  onWindowScroll() {
    let number =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    if (number >= 150 && window.innerWidth > 319) {
      this.stick = true;
    } else {
      this.stick = false;
    }
  }

  logout() {
    this.accountService.logout();
  }

  toggleMobileSidebar() {
    this.shopService.setMobileSidebar(!this.mobileSideBar);
  }

  toggleMobileDashboardSidebar() {
    this.shopService.setMobileDashboardSidebar(!this.mobileDashboardSideBar);
  }
}
