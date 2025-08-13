import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { IProduct } from '../classes/product';
import { IPagination, Pagination } from '../classes/pagination';
import { IType } from '../classes/productType';
import { IBrand } from '../classes/brand';
import { ShopParams } from '../classes/shopParams';
import { ToastrTranslateService } from './toastr-translate.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  public Currency = { name: 'Thai Baht', currency: '฿', price: 1 } // Default Currency
  public OpenCart: boolean = false;
  public Products: any;

  baseUrl = environment.apiUrl;

  pproducts: IProduct[] | undefined = [];
  collections: any[] | undefined = [];
  brands: IBrand[] | undefined = [];
  types: IType[] | undefined = [];  
  newProductCache: IProduct[] | undefined = [];

  pagination = new Pagination();
  shopParams = new ShopParams();
  productCache = new Map();
  tags: any[] | undefined = [];

  private mainPageProdCollection: string = "";

  constructor(private tts: ToastrTranslateService, private http: HttpClient) { }

  /*
    ---------------------------------------------
    ---------------  Product  -------------------
    ---------------------------------------------
  */
  getProducts(): Observable<IProduct[]> {
    let params = new HttpParams();
    if (this.shopParams?.typeId !== 0) {
      params = params.append('typeId', this.shopParams?.typeId.toString()!);
    }
    params = params.append('pageSize', this.shopParams?.pageSize.toString()!);

    return this.http.get<IProduct[]>(this.baseUrl + 'products/getallproducts', { params });
      // .pipe(
      //   map(response => {
      //     //this.allProductCache.set(Object.values(this.shopParams).join('-'), response.body!);
      //     return response.body;
      //   })
      // );
  }

  getNewProducts(): Observable<IProduct[]> {
    //Get from cache
    if (this.newProductCache !== undefined && this.newProductCache.length > 0) {
      return of(this.newProductCache);
    }

    return this.http.get<IProduct[]>(this.baseUrl + 'products/getallnewproducts').pipe(
      map((response: any) => {
        this.newProductCache = response;
        return response;
      })
    );
  }

  getRelatedProducts(): Observable<Pagination> {
    let params = new HttpParams();
    if (this.shopParams?.typeId !== 0) {
      params = params.append('typeId', this.shopParams?.typeId.toString()!);
    }

    return this.http.get<IPagination>(this.baseUrl + 'products/getrelatedproducts', { observe: 'response', params })
      .pipe(
        //delay(1000),
        map(response => {
          this.productCache.set(Object.values(this.shopParams).join('-'), response.body?.data);
          this.pagination = response.body!;
          return this.pagination;
        })
      );
  }

  getSearchProducts(): Observable<IProduct[]> {
    let params = new HttpParams();
    params = params.append('search', this.shopParams.search!.toString().toLowerCase()!);

    return this.http.get<IProduct[]>(this.baseUrl + 'products', { params });
  }

  getProductPagination(useCache: boolean): Observable<Pagination> {
    if (useCache === false) {
      this.productCache = new Map();
    }

    if (this.productCache.size > 0 && useCache === true) {
      if (this.productCache.has(Object.values(this.shopParams).join('-'))) {
        this.pagination.data = this.productCache.get(Object.values(this.shopParams).join('-'));
        return of(this.pagination);
      }
    }

    let params = new HttpParams();

    if (this.shopParams?.brandId !== 0 && this.shopParams?.brandId.toString() !== "0") {
      params = params.append('brandId', this.shopParams?.brandId.toString()!);
    }

    if (this.shopParams?.typeId !== 0) {
      params = params.append('typeId', this.shopParams?.typeId.toString()!);
    }

    if (this.shopParams?.tags !== '' && this.shopParams.tags !== 'All') {
      params = params.append('tags', this.shopParams.tags!);
    }

    if (this.shopParams?.collections !== '') {
      params = params.append('collections', this.shopParams.collections!);
    }

    if (this.shopParams?.search) {
      params = params.append('search', this.shopParams.search);
    }

    params = params.append('sort', this.shopParams?.sort! == '' ? 'brand,type' : this.shopParams.sort);
    params = params.append('pageIndex', this.shopParams?.pageNumber.toString()!);
    params = params.append('pageSize', this.shopParams?.pageSize.toString()!);

    return this.http.get<IPagination>(this.baseUrl + 'products', { observe: 'response', params })
      .pipe(
        //delay(1000),
        map(response => {
          this.productCache.set(Object.values(this.shopParams).join('-'), response.body?.data);
          this.pagination = response.body!;
          return this.pagination;
        })
      );
  }

  getProductDetail(id: Number): Observable<IProduct> {
    return this.http.get<IProduct>(this.baseUrl + 'products/' + id);
    // return this.http.get<IProduct>(this.baseUrl + 'products/' + id).pipe(
    //   map((response: any) => {
    //     console.log(response);
    //     return response;
    //   })
    // );
  }

  getCollections() {
    let tabs = [
      { id: 'tab1', title: 'Herbist', active: true},
      { id: 'tab2', title: 'Renee’s Garden', active: false},
      { id: 'tab3', title: 'On Sale', active: false},
      { id: 'tab4', title: 'New Product', active: false},
      { id: 'tab5', title: 'Best Sellers', active: false}
    ];

    return of(tabs);
    //this.collections = ['Herbist', 'Renee’s Garden', 'On Sale', 'New Product', 'Best Sellers'];
    //return of(this.collections);

    // //Get from cache
    // if (this.collections !== undefined && this.collections.length > 0) {
    //   return of(this.collections);
    // }

    // return this.http.get<string[]>(this.baseUrl + 'products/collectionsdistinct').pipe(
    //   map((response: any) => {
    //     this.collections = response;
    //     return response;
    //   })
    // );
  }

  getBrands() {
    //Get from cache
    if (this.brands !== undefined && this.brands.length > 0) {
      return of(this.brands);
    }

    return this.http.get<IBrand[]>(this.baseUrl + 'products/brands').pipe(
      map((response: any) => {
        this.brands = response;
        return response;
      })
    );
  }

  getTags() {
    //Get from cache
    if (this.tags !== undefined && this.tags.length > 0) {
      return of(this.tags);
    }

    return this.http.get<any[]>(this.baseUrl + 'products/tagsdistinct').pipe(
      map((response: any) => {
        this.tags = response;
        return response;
      })
    );
  }

  getTypes() {
    //Get from cache
    if (this.types !== undefined && this.types.length > 0) {
      return of(this.types);
    }

    return this.http.get<IType[]>(this.baseUrl + 'products/types').pipe(
      map((response: any) => {
        this.types = response;
        return response;
      })
    );
  }

  setShopParams(params: ShopParams) {
    this.shopParams = params;
  }

  getShopParams() {
    return this.shopParams;
  }

  shuffle(array: any) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  }

  setMainPageProdCollection(value: string) {
    this.mainPageProdCollection = value;
  }

  getMainPageProdCollection(): string {
    return this.mainPageProdCollection;
  }
  
  /*
    ---------------------------------------------
    ---------------  Wish List  -----------------
    ---------------------------------------------
  */

  // Get Wishlist Items
  // public get wishlistItems(): Observable<Product[]> {
  //   const itemsStream = new Observable(observer => {
  //     observer.next(state.wishlist);
  //     observer.complete();
  //   });
  //   return <Observable<Product[]>>itemsStream;
  // }

  // // Add to Wishlist
  // public addToWishlist(product: any): any {
  //   const wishlistItem = state.wishlist.find((item: any) => item.id === product.id)
  //   if (!wishlistItem) {
  //     state.wishlist.push({
  //       ...product
  //     })
  //   }
  //   this.toastrService.success('Product has been added in wishlist.');
  //   localStorage.setItem("wishlistItems", JSON.stringify(state.wishlist));
  //   return true
  // }

  // // Remove Wishlist items
  // public removeWishlistItem(product: Product): any {
  //   const index = state.wishlist.indexOf(product);
  //   state.wishlist.splice(index, 1);
  //   localStorage.setItem("wishlistItems", JSON.stringify(state.wishlist));
  //   return true
  // }

  /*
    ---------------------------------------------
    -------------  Compare Product  -------------
    ---------------------------------------------
  */

  // // Get Compare Items
  // public get compareItems(): Observable<Product[]> {
  //   const itemsStream = new Observable(observer => {
  //     observer.next(state.compare);
  //     observer.complete();
  //   });
  //   return <Observable<Product[]>>itemsStream;
  // }

  // // Add to Compare
  // public addToCompare(product: any): any {
  //   const compareItem = state.compare.find((item: any) => item.id === product.id)
  //   if (!compareItem) {
  //     state.compare.push({
  //       ...product
  //     })
  //   }
  //   this.toastrService.success('Product has been added in compare.');
  //   localStorage.setItem("compareItems", JSON.stringify(state.compare));
  //   return true
  // }

  // // Remove Compare items
  // public removeCompareItem(product: Product): any {
  //   const index = state.compare.indexOf(product);
  //   state.compare.splice(index, 1);
  //   localStorage.setItem("compareItems", JSON.stringify(state.compare));
  //   return true
  // }

  /*
    ---------------------------------------------
    -----------------  Cart  --------------------
    ---------------------------------------------
  */

  // Get Cart Items
  // public get cartItems(): Observable<IProduct[]> {
  //   const itemsStream = new Observable(observer => {
  //     observer.next(state.cart);
  //     observer.complete();
  //   });
  //   return <Observable<IProduct[]>>itemsStream;
  // }

  // Add to Cart
  // public addToCart(product: IProduct): any {
  // const cartItem = state.cart.find(item => item.id === product.id);
  // const qty = product.quantity ? product.quantity : 1;
  // const items = cartItem ? cartItem : product;

  // const stock = this.calculateStockCounts(items, qty);
  // if (!stock) return false

  // if (cartItem) {
  //   cartItem.quantity += qty
  // } else {
  //   state.cart.push({
  //     ...product,
  //     quantity: qty
  //   })
  // }

  // this.OpenCart = true; // If we use cart variation modal
  //localStorage.setItem("cartItems", JSON.stringify(state.cart));
  //   return true;
  // }

  // Update Cart Quantity
  // public updateCartQuantity(product: IProduct, quantity: number): IProduct | boolean {
  //   return state.cart.find((items, index) => {
  //     if (items.id === product.id) {
  //       const qty = state.cart[index].quantity + quantity;
  //       const stock = this.calculateStockCounts(state.cart[index], quantity);
  //       if (qty !== 0 && stock) {
  //         state.cart[index].quantity = qty
  //       }
  //       //localStorage.setItem("cartItems", JSON.stringify(state.cart));
  //       return true
  //     }
  //   })

  //   return true;
  // }

  // Calculate Stock Counts
  public calculateStockCounts(product: any, quantity: any) {
    const qty = product.quantity + quantity;
    const stock = product.stock;
    if (stock < qty || stock == 0) {
      this.tts.error('You can not add more items than available. In stock ' + stock + ' items.');
      return false
    }
    return true
  }

  // Remove Cart items
  // public removeCartItem(product: IProduct): any {
  //   const index = state.cart.indexOf(product);
  //   state.cart.splice(index, 1);
  //   localStorage.setItem("cartItems", JSON.stringify(state.cart));
  //   return true
  // }

  // Total amount 
  // public cartTotalAmount(): Observable<number> {
  //   return this.cartItems.pipe(map((product: IProduct[]) => {
  //     return product.reduce((prev, curr: IProduct) => {
  //       let price = curr.price;
  //       if (curr.discount) {
  //         price = curr.price - (curr.price * curr.discount / 100)
  //       }
  //       return (prev + price * curr.quantity) * this.Currency.price;
  //     }, 0);
  //   }));
  // }

  /*
    ---------------------------------------------
    ------------  Filter Product  ---------------
    ---------------------------------------------
  */

  // // Get Product Filter
  // public filterProducts(filter: any): Observable<IProduct[]> {
  //   return this.getProducts().pipe(
  //     map(product => product.filter((item: IProduct) => {
  //       if (!filter.length) return true
  //       const Tags = filter.some((prev: any) => { // Match Tags
  //         if (item.productBrand) {
  //           if (item.productBrand.includes(prev)) {
  //             return prev
  //           }
  //         }
  //       })
  //       return Tags
  //     })
  //     ));
  // }

  // public filterTags(filter: any): Observable<IProduct[]> {
  //   return this.getProducts().pipe(
  //     map(product => product.filter((item: IProduct) => {
  //       if (!filter.length) return true
  //       const Tags = filter.some((prev: any) => { // Match Tags
  //         if (item.tags) {
  //           if (item.tags.includes(prev)) {
  //             return prev
  //           }
  //         }
  //       })
  //       return Tags
  //     })
  //     ));
  // }

  // // Sorting Filter
  // public sortProducts(products: IProduct[], payload: string): any {

  //   if (payload === 'ascending') {
  //     return products.sort((a, b) => {
  //       if (a.id < b.id) {
  //         return -1;
  //       } else if (a.id > b.id) {
  //         return 1;
  //       }
  //       return 0;
  //     })
  //   } else if (payload === 'a-z') {
  //     return products.sort((a, b) => {
  //       if (a.name < b.name) {
  //         return -1;
  //       } else if (a.name > b.name) {
  //         return 1;
  //       }
  //       return 0;
  //     })
  //   } else if (payload === 'z-a') {
  //     return products.sort((a, b) => {
  //       if (a.name > b.name) {
  //         return -1;
  //       } else if (a.name < b.name) {
  //         return 1;
  //       }
  //       return 0;
  //     })
  //   } else if (payload === 'low') {
  //     return products.sort((a, b) => {
  //       if (a.price < b.price) {
  //         return -1;
  //       } else if (a.price > b.price) {
  //         return 1;
  //       }
  //       return 0;
  //     })
  //   } else if (payload === 'high') {
  //     return products.sort((a, b) => {
  //       if (a.price > b.price) {
  //         return -1;
  //       } else if (a.price < b.price) {
  //         return 1;
  //       }
  //       return 0;
  //     })
  //   }
  // }

  /*
    ---------------------------------------------
    ------------- Product Pagination  -----------
    ---------------------------------------------
  */
  public getPager(totalItems: number, currentPage: number = 1, pageSize: number) {
    // calculate total pages
    let totalPages = Math.ceil(totalItems / pageSize);

    // Paginate Range
    let paginateRange = 5;

    // ensure current page isn't out of range
    if (currentPage < 1) {
      currentPage = 1;
    } else if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    let startPage: number, endPage: number;
    if (totalPages <= 5) {
      startPage = 1;
      endPage = totalPages;
    } else if (currentPage < paginateRange - 1) {
      startPage = 1;
      endPage = startPage + paginateRange - 1;
    } else {
      startPage = currentPage - 2;
      endPage = currentPage + 2;
    }

    // calculate start and end item indexes
    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to ng-repeat in the pager control
    let calEndPage = endPage + 1;
    if (calEndPage > totalPages) calEndPage = totalPages + 1;
    let pages = Array.from(Array((calEndPage) - startPage).keys()).map(i => startPage + i);

    let currentPageSize = (pageSize * currentPage) > totalItems ? totalItems : (pageSize * currentPage);
    // return object with all pager properties required by the view
    return {
      totalItems: totalItems,
      currentPage: currentPage,
      currentPageSize: currentPageSize,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages
    };
  }

}
