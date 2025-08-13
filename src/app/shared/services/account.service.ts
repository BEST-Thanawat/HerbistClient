import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, of, ReplaySubject } from 'rxjs';
import { IAddress } from '../classes/address';
import { IChangePassword, IForgotPassword, IResetPassword, IUser } from '../classes/user';
import { LocalstorageService } from './localstorage.service';
import { AppService } from './app.service';
import { ToastrTranslateService } from './toastr-translate.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  baseUrl = environment.apiUrl;
  //private currentUserSource = new BehaviorSubject<IUser>(null);
  private currentUserSource: ReplaySubject<IUser | null> = new ReplaySubject<IUser | null>(1);
  currentUser$ = this.currentUserSource.asObservable();
  email: string = '';
  //private auth: boolean = false;

  constructor(
    private tts: ToastrTranslateService,
    private http: HttpClient,
    private router: Router,
    private localStorageService: LocalstorageService,
    private appService: AppService
  ) {
    //console.log(this.baseUrl);
  }

  register(values: any) {
    return this.http.post(this.baseUrl + 'account/register', values).pipe(
      map((user: IUser) => {
        if (user) {
          if (this.appService.isBrowser()) {
            this.localStorageService.setItem('token', user.token!);
            this.currentUserSource.next(user);
          }
        }
      })
    );
  }

  login(values: any) {
    return this.http.post(this.baseUrl + 'account/login', values).pipe(
      map((user: IUser) => {
        if (user) {
          if (this.appService.isBrowser()) {
            this.localStorageService.setItem('token', user.token!);
            this.currentUserSource.next(user);
          }
        }
      })
    );
  }

  logout() {
    if (this.appService.isBrowser()) {
      this.localStorageService.removeItem('token');
      this.setNullCurrentUserSource();
      this.router.navigateByUrl('/');
      this.tts.success('Logout Successfully');
    }
  }

  loadCurrentUser(token: string | null): Observable<any> {
    if (token === null) {
      this.setNullCurrentUserSource();

      return of(null);
    }

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    // console.log(headers);
    return this.http.get(this.baseUrl + 'account', { headers }).pipe(
      map((user: IUser) => {
        if (user) {
          // console.log(user);
          if (this.appService.isBrowser()) {
            this.localStorageService.setItem('token', user.token!);
            this.currentUserSource.next(user);
            this.email = user.email!;
            //this.auth = true;
            //console.log('first');
          }
        }
      })
    );
  }

  getAuth(): Observable<boolean> {
    const token = this.localStorageService.getItem('token');
    if (token === null) {
      this.router.navigateByUrl('/');
      this.setNullCurrentUserSource();
    }

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.get(this.baseUrl + 'account', { headers }).pipe(
      map((user: IUser) => {
        if (user) {
          //console.log(user);
          this.localStorageService.setItem('token', user.token!);
          this.currentUserSource.next(user);
          this.email = user.email!;
          //this.auth = true;
          return true;
        }

        return false;
      })
    );

    // let result = false;
    // appService.isBrowser().subscribe(isBrowser => {
    //   if (isBrowser) {
    //     this.currentUser$.subscribe({
    //       next: (auth: any) => {
    //         if (auth) {
    //           result = true;
    //         }
    //       },
    //       error: (e: any) => { console.log(e); }
    //     });
    //   }
    // });
    // //console.log(result);
    // return result;
  }

  loginBackend(values: any) {
    return this.http.post(this.baseUrl + 'account/login', values).pipe(
      map((user: IUser) => {
        if (user) {
          //this.auth = true;
          this.localStorageService.setItem('token', user.token!);
          this.currentUserSource.next(user);
        }
      })
    );
  }

  logoutBackend() {
    //this.auth = false;
    this.localStorageService.removeItem('token');
    this.setNullCurrentUserSource();
    this.router.navigateByUrl('/');
    this.tts.success('Logout Successfully');
  }

  loadCurrentBackendUser(token: string | null): Observable<any> {
    if (token === null) {
      this.setNullCurrentUserSource();

      return of(null);
    }

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http.get(this.baseUrl + 'account', { headers }).pipe(
      map((user: IUser) => {
        if (user) {
          this.localStorageService.setItem('token', user.token!);
          this.currentUserSource.next(user);
          this.email = user.email!;
          //this.auth = true;
        }
      })
    );
  }

  getBackendAuth() {
    const token = this.localStorageService.getItem('token');
    if (token === null) {
      this.setNullCurrentUserSource();
    }

    this.loadCurrentBackendUser(token).subscribe();
  }

  setNullCurrentUserSource() {
    this.currentUserSource.next(null);
  }

  checkEmailExists(email: string) {
    return this.http.get(this.baseUrl + 'account/emailexists?email=' + email);
  }

  getUserAddress() {
    return this.http.get<IAddress>(this.baseUrl + 'account/address');
  }

  updateUserAddress(address: IAddress) {
    return this.http.put<IAddress>(this.baseUrl + 'account/address', address);
  }

  changePassword(changePassword: IChangePassword) {
    return this.http.post<IChangePassword>(this.baseUrl + 'account/changepassword', changePassword);
  }

  getUserEmail(): string {
    return this.email;
  }

  forgotPassword(forgotPassword: IForgotPassword) {
    return this.http.post(this.baseUrl + 'account/forgotpassword', forgotPassword);
  }

  resetPassword(resetPassword: IResetPassword) {
    return this.http.post(this.baseUrl + 'account/resetpassword', resetPassword);
  }
}
