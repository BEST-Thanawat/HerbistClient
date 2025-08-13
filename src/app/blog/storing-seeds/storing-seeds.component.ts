import { Component, OnInit } from '@angular/core';
import { AppService } from '../../shared/services/app.service';
import { IBlogCounter } from '../../shared/classes/blogCounter';
import { SeoService } from '../../shared/services/seo.service';
import { environment } from '../../../environments/environment';
import { BlogService } from '../services/blog.service';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-storing-seeds',
  templateUrl: './storing-seeds.component.html',
  styleUrls: ['./storing-seeds.component.scss'],
  imports: [BreadcrumbComponent, TranslateModule]
})
export class StoringSeedsComponent implements OnInit {
  count: number | undefined;

  srcset = ''; //'320w, 481w, 672w, 800w, 1000w, 1200w';
  sizes = '70vw';
  sizesSubImg = '80vw';
  storingseedsImg = environment.cloudinary ? environment.cloudinaryURL + '/' + environment.cloudinaryId + '/assets/images/blog/storingseeds_h.webp' : "assets/images/blog/storingseeds_h.webp";
  storingseeds_detailsImg = environment.cloudinary ? environment.cloudinaryId + '/assets/images/blog/storingseeds_details.webp' : "assets/images/blog/storingseeds_details.webp";

  constructor(private seoService: SeoService, private blogService: BlogService, private appService: AppService) {
    this.seoService.setBlogArticleTags('assets/images/blog/storingseeds_h.webp', 'วิธีการเก็บเมล็ดพันธุ์ หลังจากเปิดซอง | Herbist | เมล็ดพันธุ์สมุนไพรฝรั่ง โรสแมรี่ ลาเวนเดอร์ ผัก ดอกไม้นำเข้า', 'หลังจากที่เราเพาะเมล็ดแล้วต้องการเก็บเมล็ดพันธุ์ไว้เพาะในครั้งต่อไป การเก็บเมล็ดพันธุ์อย่างถูกวิธีนั้นช่วยยืดระยะเวลาของเมล็ดพันธุ์ได้ระยะหนึ่ง เรามาดูวิธีที่ถูกต้องกันค่ะ', 'วิธีการเก็บเมล็ดพันธุ์ หลังจากเปิดซอง', 'การเก็บเมล็ดพันธุ์', '1370', '385');
    this.seoService.emptyJsonSnippet();
    this.seoService.updateJsonSnippet({
      '@type': 'Article',
      headline: 'วิธีการเก็บเมล็ดพันธุ์ หลังจากเปิดซอง',
      image: 'https://herbist.shop/assets/images/blog/storingseeds_h.webp',
      datePublished: '01 March 2023',
      dateModified: "2023-03-01 00:00:00",
      author: [
        {
          '@type': 'Organization',
          name: 'herbist.shop',
          url: 'https://herbist.shop/blog/storingseeds',
        },
      ],
    });

    if (this.appService.isBrowser()) {
      this.submitCount(12);
      this.getCount(12);        
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
