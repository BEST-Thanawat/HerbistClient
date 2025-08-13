/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
import { Injectable, PipeTransform } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { SortDirection } from '../directive/ngbd-sortable-header.directive';
import { Images } from '../classes/product';
import { IOrder } from '../classes/order';
import { IProduct } from '../classes/product';
import { Variants } from '../classes/product';


interface SearchResult {
    tableItem: any[];
    total: number;
}

interface State {
    page: number;
    pageSize: number;
    searchTerm: string;
    sortColumn: string;
    sortDirection: SortDirection;
}

const compare = (v1: string | number | boolean | string[] | Variants[] | Images[], v2: string | number | boolean | string[] | Variants[] | Images[]) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(tableItem: any[], column: string, direction: string): any[] {
    if (direction === '' || column === '') {
        return tableItem;
    } else {
        return [...tableItem].sort((a, b) => {
			const res = compare(a[column]!, b[column]!);
            return direction === 'asc' ? res : -res;
        });
    }
}

function isIOrder(item : any): item is IOrder{
    return (item as IOrder) !== undefined;
  }

function matches(item: any, term: string, pipe: PipeTransform) {
    //console.log(item);
    //Confirm Payment
    if (item.hasOwnProperty('orderNumber') && item.hasOwnProperty('firstName') && item.hasOwnProperty('lastName') && item.hasOwnProperty('amount')) {
        return item.orderNumber.toLowerCase().includes(term.toLowerCase()) ||
		item.firstName.toLowerCase().includes(term.toLowerCase()) ||
		item.lastName.toLowerCase().includes(term.toLowerCase()) ||
		pipe.transform(item.amount).includes(term);
        // ((item.status) == ConfirmPaymentStatus.Waiting ? ConfirmPaymentStatus[ConfirmPaymentStatus.Waiting] : (item.status) == ConfirmPaymentStatus.Confirmed ? ConfirmPaymentStatus[ConfirmPaymentStatus.Confirmed] : (item.status) == ConfirmPaymentStatus.Declined ? ConfirmPaymentStatus[ConfirmPaymentStatus.Declined] : (item.status) == ConfirmPaymentStatus.Removed? ConfirmPaymentStatus[ConfirmPaymentStatus.Removed] : '').toLowerCase().includes(term.toLowerCase());
    } 
    //Product
    else if (item.hasOwnProperty('name')) {
        return item.name.toLowerCase().includes(term.toLowerCase());
    }
    //Order
    else if (item.hasOwnProperty('orderNumber') && item.shipToAddress.hasOwnProperty('firstName') && item.shipToAddress.hasOwnProperty('lastName') && item.hasOwnProperty('total') && item.hasOwnProperty('trackingNumber')) {
        return item.orderNumber.toLowerCase().includes(term.toLowerCase()) ||
        item.shipToAddress.firstName.toLowerCase().includes(term.toLowerCase()) || 
        item.shipToAddress.lastName.toLowerCase().includes(term.toLowerCase()) ||
        item.trackingNumber.toLowerCase().includes(term.toLowerCase()) ||
        pipe.transform(item.total).includes(term);
    }

    // return (
	// 	// item.name.toLowerCase().includes(term.toLowerCase()) ||

	// 	// item.orderNumber.toLowerCase().includes(term.toLowerCase()) ||
	// 	// item.firstName.toLowerCase().includes(term.toLowerCase()) ||
	// 	// item.lastName.toLowerCase().includes(term.toLowerCase()) ||
	// 	//pipe.transform(item.amount).includes(term)
	// 	// pipe.transform(item.population).includes(term)
	// );
	// return (
	// 	item.name != null ? item.name.toLowerCase().includes(term.toLowerCase()) : null ||
    //     item.productType != null ? item.productType.toLowerCase().includes(term.toLowerCase()) : null || 
    //     item.firstName.toLowerCase().includes(term.toLowerCase()) || 
    //     item.lastName.toLowerCase().includes(term.toLowerCase()) ||
	// 	pipe.transform(item.Amount).includes(term)
	// 	// pipe.transform(item.population).includes(term)
	// );
}

function isIProduct(item: any): item is IProduct {
    return true;
}
function isIConfirmPayment(item: any): item is IProduct {
    return 'itemId' in item;
}

@Injectable({ providedIn: 'root' })
export class TableService {
    private _loading$ = new BehaviorSubject<boolean>(true);
    private _search$ = new Subject<void>();
    private _tableItem$ = new BehaviorSubject<any[]>([]);
    private _total$ = new BehaviorSubject<number>(0);

    items: any[] | undefined;

    private _state: State = {
        page: 1,
        pageSize: 10,
        searchTerm: '',
        sortColumn: '',
        sortDirection: ''
    };

    constructor(private pipe: DecimalPipe) { }

    get tableItem$() { return this._tableItem$.asObservable(); }
    get total$() { return this._total$.asObservable(); }
    get loading$() { return this._loading$.asObservable(); }
    get page() { return this._state.page; }
    get pageSize() { return this._state.pageSize; }
    get searchTerm() { return this._state.searchTerm; }

    set page(page: number) { this._set({ page }); }
    set pageSize(pageSize: number) { this._set({ pageSize }); }
    set searchTerm(searchTerm: string) { this._set({ searchTerm }); }
    set sortColumn(sortColumn: string) { this._set({ sortColumn }); }
    set sortDirection(sortDirection: SortDirection) { this._set({ sortDirection }); }

    private setProductsData(val: any[]) {
        this.items = val;
        this._search$.next();
    }

    private _set(patch: Partial<State>) {
        Object.assign(this._state, patch);
        this._search$.next();
    }

    private _search(): Observable<SearchResult> {
        const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;
        //console.log(this.items);
        
        // 1. sort
        let tableItem = sort(this.items!, sortColumn, sortDirection);
        //console.log("tableItem", tableItem);

        // 2. filter
		tableItem = tableItem.filter((product) => matches(product, searchTerm, this.pipe));
        const total = tableItem.length;

        // 3. paginate
		tableItem = tableItem.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
		return of({ tableItem, total });

        // tableItem = tableItem
        //     .map((item, i) => ({ id: i + 1, ...item }))
        //     .slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
        // console.log("total ", tableItem);
        // return of({ tableItem, total });
    }

    Search(data: any) {
        this.setProductsData(data);

        this._search$.pipe(
            tap(() => this._loading$.next(true)),
            debounceTime(200),
            switchMap(() => this._search()),
            delay(200),
            tap(() => this._loading$.next(false))
        ).subscribe(result => {
            this._tableItem$.next(result.tableItem);
            this._total$.next(result.total);
        });

        this._search$.next();
    }
}