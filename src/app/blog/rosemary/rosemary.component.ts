import { Component, OnInit } from '@angular/core';
import { AppService } from '../../shared/services/app.service';
import { IBlogCounter } from '../../shared/classes/blogCounter';
import { SeoService } from '../../shared/services/seo.service';
import { environment } from '../../../environments/environment';
import { BlogService } from '../services/blog.service';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-rosemary',
  imports: [BreadcrumbComponent, TranslateModule],
  templateUrl: './rosemary.component.html',
  styleUrls: ['./rosemary.component.scss']
})
export class RosemaryComponent implements OnInit {
  count: number | undefined;
  
  srcset = ''; //'320w, 481w, 672w, 800w, 1000w, 1200w';
  sizes = '70vw';
  sizesSubImg = '40vw';
  rosemaryImg = environment.cloudinary ? environment.cloudinaryURL + '/' + environment.cloudinaryId + '/assets/images/blog/rosemary_h.webp' : "assets/images/blog/rosemary_h.webp";
  rosemary1Img = environment.cloudinary ? environment.cloudinaryURL + '/' + environment.cloudinaryId + '/assets/images/blog/rosemary_1.webp' : "assets/images/blog/rosemary_1.webp";
  rosemary2Img = environment.cloudinary ? environment.cloudinaryURL + '/' + environment.cloudinaryId + '/assets/images/blog/rosemary_2.webp' : "assets/images/blog/rosemary_2.webp";
  rosemary3Img = environment.cloudinary ? environment.cloudinaryURL + '/' + environment.cloudinaryId + '/assets/images/blog/rosemary_3.webp' : "assets/images/blog/rosemary_3.webp";
  rosemary4Img = environment.cloudinary ? environment.cloudinaryURL + '/' + environment.cloudinaryId + '/assets/images/blog/rosemary_4.webp' : "assets/images/blog/rosemary_4.webp";
  rosemary5Img = environment.cloudinary ? environment.cloudinaryURL + '/' + environment.cloudinaryId + '/assets/images/blog/rosemary_5.webp' : "assets/images/blog/rosemary_5.webp";
  rosemary6Img = environment.cloudinary ? environment.cloudinaryURL + '/' + environment.cloudinaryId + '/assets/images/blog/rosemary_6.webp' : "assets/images/blog/rosemary_6.webp";
  rosemary7Img = environment.cloudinary ? environment.cloudinaryURL + '/' + environment.cloudinaryId + '/assets/images/blog/rosemary_7.webp' : "assets/images/blog/rosemary_7.webp";
  rosemary8Img = environment.cloudinary ? environment.cloudinaryURL + '/' + environment.cloudinaryId + '/assets/images/blog/rosemary_8.webp' : "assets/images/blog/rosemary_8.webp";
  
  constructor(private seoService: SeoService, private blogService: BlogService, private appService: AppService) {
    this.seoService.setBlogArticleTags('assets/images/blog/rosemary_h.webp', 'เพาะเมล็ด โรสแมรี่ | Herbist | เมล็ดพันธุ์สมุนไพรฝรั่ง โรสแมรี่ ลาเวนเดอร์ ผัก ดอกไม้นำเข้า', 'การเพาะเมล็ด โรสแมรี่และการเพาะเมล็ด ลาเวนเดอร์ให้งอกนั้นไม่ได้ยากจนเกินไปหากเรามีเมล็ดพันธุ์ที่ดีและทราบถึงวิธีในการเพาะเมล็ดที่ถูกต้อง ก่อนอื่นต้องทราบก่อนว่า โดยธรรมชาติของเมล็ดโรสแมรี่และลาเวนเดอร์นั้นจะมีเปอร์เซ็นต์งอกที่ค่อนข้างต่ำอยู่แล้ว ดังนั้นไม่ควรเก็บเมล็ดโรสแมรี่ไว้นาน (โดยเฉพาะอย่างยิ่งเมล็ดไพร์ม โรสแมรี่ควรเพาะให้หมดในทีเดียว ไม่ควรเก็บไว้นานเกิน 1 เดือน) เมื่อทราบแล้ว เรามาเพาะเมล็ดไปพร้อมๆกัน', 'เพาะเมล็ด โรสแมรี่', 'การเพาะเมล็ด', '1370', '385');
    this.seoService.emptyJsonSnippet();
    this.seoService.updateJsonSnippet({
      '@type': 'Article',
      headline: 'วิธีเพาะเมล็ด โรสแมรี่',
      image: 'https://herbist.shop/assets/images/blog/rosemary_h.webp',
      datePublished: '01 March 2023',
      dateModified: "2023-03-01 00:00:00",
      author: [
        {
          '@type': 'Organization',
          name: 'herbist.shop',
          url: 'https://herbist.shop/blog/rosemary',
        },
      ],
    });

    if (this.appService.isBrowser()) {
      this.submitCount(4);
      this.getCount(4);        
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
