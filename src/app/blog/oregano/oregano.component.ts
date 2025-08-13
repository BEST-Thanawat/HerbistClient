import { Component, OnInit } from '@angular/core';
import { AppService } from '../../shared/services/app.service';
import { IBlogCounter } from '../../shared/classes/blogCounter';
import { SeoService } from '../../shared/services/seo.service';
import { environment } from '../../../environments/environment';
import { BlogService } from '../services/blog.service';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-oregano',
  imports: [BreadcrumbComponent, TranslateModule],
  templateUrl: './oregano.component.html',
  styleUrls: ['./oregano.component.scss']
})
export class OreganoComponent implements OnInit {
  count: number | undefined;
  
  srcset = ''; //'320w, 481w, 672w, 800w, 1000w, 1200w';
  sizes = '70vw';
  oreganoImg = environment.cloudinary ? environment.cloudinaryURL + '/' + environment.cloudinaryId + '/assets/images/blog/oregano_h.webp' : "assets/images/blog/oregano_h.webp";
  
  constructor(private seoService: SeoService, private blogService: BlogService, private appService: AppService) {
    this.seoService.setBlogArticleTags('assets/images/blog/oregano_h.webp', 'เพาะเมล็ด ออริกาโน | Herbist | เมล็ดพันธุ์สมุนไพรฝรั่ง โรสแมรี่ ลาเวนเดอร์ ผัก ดอกไม้นำเข้า', 'การเพาะเมล็ด ออริกาโนนั้นง่ายมาก เรามาเพาะเมล็ดไปพร้อมๆกัน', 'เพาะเมล็ด ออริกาโน', 'การเพาะเมล็ด', '1370', '385');
    this.seoService.emptyJsonSnippet();
    this.seoService.updateJsonSnippet({
      '@type': 'Article',
      headline: 'วิธีเพาะเมล็ด ออริกาโน',
      image: 'https://herbist.shop/assets/images/blog/oregano_h.webp',
      datePublished: '01 March 2023',
      dateModified: "2023-03-01 00:00:00",
      author: [
        {
          '@type': 'Organization',
          name: 'herbist.shop',
          url: 'https://herbist.shop/blog/oregano',
        },
      ],
    });

    if (this.appService.isBrowser()) {
      this.submitCount(9);
      this.getCount(9);        
    }
  }

  ngOnInit(): void { this.blogService.scrollToTop(); }

  submitCount(id: number) {
    this.blogService.submitBlogCounter(id);
  }

  getCount(id: number) {
    this.blogService.getBlogCounter(id).subscribe((value: IBlogCounter) => this.count = value.click);
  }
}
