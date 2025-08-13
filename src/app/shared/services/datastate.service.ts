import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, makeStateKey, PLATFORM_ID, StateKey, TransferState } from '@angular/core';
import { Observable, of, tap } from 'rxjs';

export const PRODUCT_LIST = makeStateKey('product-list');

@Injectable({
  providedIn: 'root'
})
export class DatastateService {
  private isServer = false;

  constructor(private tstate: TransferState, @Inject(PLATFORM_ID) platformId: Object,) {
    this.isServer = isPlatformServer(platformId);
  }

  checkAndGetData(key: StateKey<string>, getDataObservable: Observable<any>, defaultValue: any = []) {
    if (this.tstate.hasKey(key)) {
      return of(this.tstate.get(key, defaultValue));
    } else {
      return getDataObservable.pipe(
        tap((data) => {
          if (this.isServer) {
            this.tstate.set(key, data);
          }
        })
      );
    }
  }

  getDynamicStateKey(key: string): StateKey<string> {
    return makeStateKey(key);
  }
}
