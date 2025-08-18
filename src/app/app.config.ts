import { APP_ID, ApplicationConfig, importProvidersFrom, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { GuardsCheckEnd, NavigationEnd, provideRouter } from '@angular/router';
import { progressInterceptor } from 'ngx-progressbar/http';

import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { routes } from './app.routes';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { provideNgProgressRouter } from 'ngx-progressbar/router';
import { provideToastr } from 'ngx-toastr';
import { InitialService } from './shared/services/initial.service';
import { provideTranslateService, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppService } from './shared/services/app.service';
import { of } from 'rxjs';
import { PRECONNECT_CHECK_BLOCKLIST, provideCloudinaryLoader } from '@angular/common';
import { errorInterceptor } from './shared/core/interceptors/error.interceptor';
import { LoadingInterceptor } from './shared/core/interceptors/loading.interceptor';
import { JwtInterceptor } from './shared/core/interceptors/jwt.interceptor';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideNgProgressOptions } from 'ngx-progressbar';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgcCookieConsentConfig, NgcCookieConsentModule } from 'ngx-cookieconsent';

export function app_init() {
  const initialService = inject(InitialService);
  return initialService.initializeApp(); // can return void, Promise, or Observable
}

export function translate_init(translate: TranslateService, appService: AppService) {
  return () => {
    if (appService.isBrowser()) {
      translate.addLangs(['th', 'en']);
      translate.setFallbackLang('th');
      return translate.use('th');
    }

    return of(null);
  };
}

const cookieConfig: NgcCookieConsentConfig = {
  cookie: {
    domain: 'herbist.shop',
    //"domain": "localhost"
  },
  position: 'bottom',
  theme: 'classic',
  palette: {
    popup: {
      background: '#565264',
      text: '#ffffff',
      link: '#ffffff',
    },
    button: {
      background: '#ffffff',
      text: '#000',
      border: 'transparent',
    },
  },
  type: 'info',
  content: {
    message: 'This website uses cookies to ensure you get the best experience on our website.',
    dismiss: 'Got it!',
    deny: 'Refuse cookies',
    link: 'Learn more',
    href: 'https://herbist.shop',
    policy: 'Cookie Policy',
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(ModalModule.forRoot(), NoopAnimationsModule, BrowserModule, NgcCookieConsentModule.forRoot(cookieConfig)),
    { provide: APP_ID, useValue: 'serverApp' },
    // provideAnimations(),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideToastr({
      timeOut: 10000,
      positionClass: 'toast-bottom-right',
      toastClass: 'ngx-toastr',
      preventDuplicates: true,
      progressBar: true,
      enableHtml: true,
    }),
    // provideHttpClient(withFetch(), withInterceptors([progressInterceptor])),
    provideHttpClient(
      withFetch(),
      withInterceptors([progressInterceptor, errorInterceptor]),
      withInterceptorsFromDi() // 👈 tells Angular to load DI-provided interceptors
    ),
    // { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },

    provideNgProgressOptions({
      spinner: false,
    }),
    provideNgProgressRouter({
      startEvents: [GuardsCheckEnd],
      completeEvents: [NavigationEnd],
      minDuration: 1000,
    }),
    provideAppInitializer(app_init),
    provideCloudinaryLoader('https://res.cloudinary.com/djg2zn5cf/'),
    {
      provide: PRECONNECT_CHECK_BLOCKLIST,
      useValue: 'https://res.cloudinary.com/djg2zn5cf/',
    },
    provideTranslateService({
      lang: 'th',
      fallbackLang: 'th',
      loader: provideTranslateHttpLoader({
        prefix: '/assets/i18n/',
        suffix: '.json',
      }),
    }),
  ],
};
