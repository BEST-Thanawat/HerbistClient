import { ViewportScroller } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { IBlogCounter } from '../../shared/classes/blogCounter';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  baseUrl = environment.apiUrl;
  allBlogCounts: IBlogCounter[] | undefined = [];
  
  constructor(private http: HttpClient, private viewScroller: ViewportScroller) { }

  submitBlogCounter(id: number) {    
    return this.http.get(this.baseUrl + 'shop/blogCounter?id=' + id).subscribe();
  }

  getBlogCounter(id: number) : Observable<any> {
    return this.http.get(this.baseUrl + 'shop/getBlogCounter?id=' + id);
  }

  getAllBlogCounter() {
    //Get from cache
    if (this.allBlogCounts !== undefined && this.allBlogCounts.length > 0) {
      return of(this.allBlogCounts);
    }

    return this.http.get(this.baseUrl + 'shop/getAllBlogCounter').pipe(
      map((response: any) => {
        this.allBlogCounts = response;
        return response;
      })
    );
  }

  scrollToTop() {
    setTimeout(() => {
      this.viewScroller.scrollToPosition([0, 0]);
      //console.log('Scroll To Top');
    }, 400);
  }
}
