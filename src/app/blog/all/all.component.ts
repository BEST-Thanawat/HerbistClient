import { Component } from '@angular/core';
import { AppService } from '../../shared/services/app.service';
import { IBlogCounter } from '../../shared/classes/blogCounter';
import { SeoService } from '../../shared/services/seo.service';
import { environment } from '../../../environments/environment';
import { BlogService } from '../services/blog.service';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-all',
  imports: [BreadcrumbComponent, TranslateModule, RouterModule],
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.scss']
})
export class AllComponent {
  counterBlog1: number | undefined;
  counterBlog2: number | undefined;
  counterBlog3: number | undefined;
  counterBlog4: number | undefined;
  counterBlog5: number | undefined;
  counterBlog6: number | undefined;
  counterBlog7: number | undefined;
  counterBlog8: number | undefined;
  counterBlog9: number | undefined;
  counterBlog10: number | undefined;
  counterBlog11: number | undefined;
  counterBlog12: number | undefined;

  srcset = ''; //'320w, 481w, 672w, 800w, 999w';
  sizes = '30vw';
  orangethymeImg = environment.cloudinary ? environment.cloudinaryURL + '/' + environment.cloudinaryId + '/assets/images/blog/orangethyme.webp' : "assets/images/blog/orangethyme.webp";
  savoryImg = environment.cloudinary ? environment.cloudinaryURL + '/' + environment.cloudinaryId + '/assets/images/blog/savory.webp' : "assets/images/blog/savory.webp";
  oreganoImg = environment.cloudinary ? environment.cloudinaryURL + '/' + environment.cloudinaryId + '/assets/images/blog/oregano.webp' : "assets/images/blog/oregano.webp";
  lemonbalmImg = environment.cloudinary ? environment.cloudinaryURL + '/' + environment.cloudinaryId + '/assets/images/blog/lemonbalm.webp' : "assets/images/blog/lemonbalm.webp";
  peppermintImg = environment.cloudinary ? environment.cloudinaryURL + '/' + environment.cloudinaryId + '/assets/images/blog/peppermint.webp' : "assets/images/blog/peppermint.webp";
  sageImg = environment.cloudinary ? environment.cloudinaryURL + '/' + environment.cloudinaryId + '/assets/images/blog/sage.webp' : "assets/images/blog/sage.webp";
  marjoramImg = environment.cloudinary ? environment.cloudinaryURL + '/' + environment.cloudinaryId + '/assets/images/blog/marjoram.webp' : "assets/images/blog/marjoram.webp";
  rosemaryImg = environment.cloudinary ? environment.cloudinaryURL + '/' + environment.cloudinaryId + '/assets/images/blog/rosemary.webp' : "assets/images/blog/rosemary.webp";
  thymeImg = environment.cloudinary ? environment.cloudinaryURL + '/' + environment.cloudinaryId + '/assets/images/blog/thyme.webp' : "assets/images/blog/thyme.webp";
  catnipImg = environment.cloudinary ? environment.cloudinaryURL + '/' + environment.cloudinaryId + '/assets/images/blog/catnip.webp' : "assets/images/blog/catnip.webp";
  chamomileImg = environment.cloudinary ? environment.cloudinaryURL + '/' +  environment.cloudinaryId + '/assets/images/blog/chamomile.webp' : "assets/images/blog/chamomile.webp";
  storingseedsImg = environment.cloudinary ? environment.cloudinaryURL + '/' + environment.cloudinaryId + '/assets/images/blog/storingseeds.webp' : "assets/images/blog/storingseeds.webp";

  constructor(private seoService: SeoService, private blogService: BlogService, private appService: AppService) { }

  ngOnInit(): void {
    this.seoService.setBlogPageTags();

    if (this.appService.isBrowser()) {
      this.blogService.scrollToTop();
      this.getCounter();
    }
  }

  getCounter() {
    this.blogService.getAllBlogCounter().subscribe({
      next: (listBlogCounter: IBlogCounter[] | any) => {
        this.counterBlog1 = listBlogCounter.find((x: any) => x.id === 1).click;
        this.counterBlog2 = listBlogCounter.find((x: any) => x.id === 2).click;
        this.counterBlog3 = listBlogCounter.find((x: any) => x.id === 3).click;
        this.counterBlog4 = listBlogCounter.find((x: any) => x.id === 4).click;
        this.counterBlog5 = listBlogCounter.find((x: any) => x.id === 5).click;
        this.counterBlog6 = listBlogCounter.find((x: any) => x.id === 6).click;
        this.counterBlog7 = listBlogCounter.find((x: any) => x.id === 7).click;
        this.counterBlog8 = listBlogCounter.find((x: any) => x.id === 8).click;
        this.counterBlog9 = listBlogCounter.find((x: any) => x.id === 9).click;
        this.counterBlog10 = listBlogCounter.find((x: any) => x.id === 10).click;
        this.counterBlog11 = listBlogCounter.find((x: any) => x.id === 11).click;
        this.counterBlog12 = listBlogCounter.find((x: any) => x.id === 12).click;
      },
      error: (e) => { console.log(e); }
    })
  }
}
