import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppService } from '../shared/services/app.service';
import { IBrand } from '../shared/classes/brand';
import { SeoService } from '../shared/services/seo.service';
import { ShopParams } from '../shared/classes/shopParams';
import { ShopService } from '../shared/services/shop.service';
import { IType } from '../shared/classes/productType';
import { IProduct } from '../shared/classes/product';
import { ProductService } from '../shared/services/product.service';
import { BlogSlider } from '../shared/data/slider';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';
import { SliderComponent } from './widgets/slider/slider.component';
import { HeaderOneComponent } from '../shared/header/header-one/header-one.component';
import { RouterModule } from '@angular/router';
import { ProductBoxOneComponent } from '../shared/components/product/product-box-one/product-box-one.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { FooterOneComponent } from '../shared/footer/footer-one/footer-one.component';
import { CommonModule } from '@angular/common';
import { NavService } from '../shared/services/nav.service';
import { IYear } from '../shared/classes/year';

export interface ITab {
  id: string;
  title: string;
  active?: boolean;
}

@Component({
  selector: 'app-herbist',
  templateUrl: './herbist.component.html',
  styleUrls: ['./herbist.component.scss'],
  imports: [SliderComponent, CommonModule, HeaderOneComponent, RouterModule, TranslateModule, ProductBoxOneComponent, CarouselModule, FooterOneComponent],
})
export class HerbistComponent implements OnInit, OnDestroy {
  currentIsEnglish$!: Observable<boolean>;
  public year: IYear = { id: 1, year1: 2025, year2: 2568 };

  public showImg = true;
  //public products: Product[] = [];
  public productCollections: ITab[] = [];
  public active: any | undefined;

  products!: IProduct[] | undefined;
  brands!: IBrand[];
  types!: IType[];
  public pageSize = 20;
  public blogs: any = [];

  dynamicTabs: any;
  // private popupOpenSubscription: Subscription | undefined;
  // private popupCloseSubscription: Subscription | undefined;
  // private initializeSubscription: Subscription | undefined;
  // private statusChangeSubscription: Subscription | undefined;
  // private revokeChoiceSubscription: Subscription | undefined;
  // private noCookieLawSubscription: Subscription | undefined;

  public BlogSliderConfig: any = BlogSlider;
  showParalax: boolean = true;

  // parallaxSrcset = '320w, 481w, 672w, 800w, 1000w, 1200w, 1400w, 1920w';
  // parallaxImgUrl = environment.cloudinaryId + '/assets/images/parallax/parallax_seedling.webp';
  // parallaxUrl = 'parallax_seedling.webp'; //environment.cloudinary ? environment.cloudinaryURL + ',w_1200/' + environment.cloudinaryId + '/assets/images/parallax/parallax_seedling.webp' : '/assets/images/parallax/parallax_seedling.webp';
  parallaxUrl = environment.cloudinary ? environment.cloudinaryURL + ',w_1200/' + environment.cloudinaryId + '/assets/images/parallax/pot.webp' : '/assets/images/parallax/pot.webp';

  constructor(
    private shopService: ShopService,
    private seoService: SeoService,
    public productService: ProductService,
    private translate: TranslateService,
    private appService: AppService,
    private navServices: NavService
  ) {
    this.currentIsEnglish$ = this.navServices.currentIsEnglish$;
    // this.currentIsEnglish$.subscribe();
    this.shopService.getYears().subscribe({
      next: (year: IYear) => {
        this.year = year;
      },
      error: (e) => {
        console.error(e);
      },
    });
  }

  ngOnInit(): void {
    if (this.appService.isBrowser()) {
      this.shopService.scrollToTop();
      this.getCollection();
    }

    this.seoService.setMainPageTags('Herbist(เฮิบบิสท์) | เมล็ดพันธุ์สมุนไพรฝรั่ง โรสแมรี่ ลาเวนเดอร์ ผัก ดอกไม้นำเข้า');

    this.translate.get(['March']).subscribe((translations) => {
      // console.log(translations['March']);
      let prepUrl = environment.cloudinaryURL + '/' + environment.cloudinaryId + '/assets/images/blog/';

      // console.log(environment.cloudinary ? environment.cloudinaryURL + '/' + environment.cloudinaryId + '/assets/images/trays.webp' : 'assets/images/trays.webp');
      // console.log(environment.production);
      let prepSrcset = ''; //'320w, 481w, 672w, 800w, 999w';
      let prepSizes = '20vw';
      this.blogs = [
        {
          id: '1',
          image: environment.cloudinary ? prepUrl + 'orangethyme.webp' : 'assets/images/blog/orangethyme.webp',
          date: '31 ' + translations['March'] + ' 2023',
          title: 'เพาะเมล็ด ออเรนจ์ ไทม์,',
          by: 'Admin Herbist',
          link: '/blog/orangethyme',
          sizes: prepSizes,
          srcset: prepSrcset,
        },
        {
          id: '2',
          image: environment.cloudinary ? prepUrl + 'savory.webp' : 'assets/images/blog/savory.webp',
          date: '31 ' + translations['March'] + ' 2023',
          title: 'เพาะเมล็ด ซาโวรี,',
          by: 'Admin Herbist',
          link: '/blog/savory',
          sizes: prepSizes,
          srcset: prepSrcset,
        },
        {
          id: '3',
          image: environment.cloudinary ? prepUrl + 'oregano.webp' : 'assets/images/blog/oregano.webp',
          date: '31 ' + translations['March'] + ' 2023',
          title: 'เพาะเมล็ด ออริกาโน,',
          by: 'Admin Herbist',
          link: '/blog/oregano',
          sizes: prepSizes,
          srcset: prepSrcset,
        },
        {
          id: '4',
          image: environment.cloudinary ? prepUrl + 'lemonbalm.webp' : 'assets/images/blog/lemonbalm.webp',
          date: '31 ' + translations['March'] + ' 2023',
          title: 'เพาะเมล็ด เลมอนนบาล์ม,',
          by: 'Admin Herbist',
          link: '/blog/lemonbalm',
          sizes: prepSizes,
          srcset: prepSrcset,
        },
        {
          id: '5',
          image: environment.cloudinary ? prepUrl + 'peppermint.webp' : 'assets/images/blog/peppermint.webp',
          date: '31 ' + translations['March'] + ' 2023',
          title: 'เพาะเมล็ด เปปเปอร์มินต์,',
          by: 'Admin Herbist',
          link: '/blog/peppermint',
          sizes: prepSizes,
          srcset: prepSrcset,
        },
        {
          id: '6',
          image: environment.cloudinary ? prepUrl + 'sage.webp' : 'assets/images/blog/sage.webp',
          date: '31 ' + translations['March'] + ' 2023',
          title: 'เพาะเมล็ด เสจ,',
          by: 'Admin Herbist',
          link: '/blog/sage',
          sizes: prepSizes,
          srcset: prepSrcset,
        },
        {
          id: '7',
          image: environment.cloudinary ? prepUrl + 'marjoram.webp' : 'assets/images/blog/marjoram.webp',
          date: '31 ' + translations['March'] + ' 2023',
          title: 'เพาะเมล็ด มาร์จอรัม,',
          by: 'Admin Herbist',
          link: '/blog/marjoram',
          sizes: prepSizes,
          srcset: prepSrcset,
        },
        {
          id: '8',
          image: environment.cloudinary ? prepUrl + 'rosemary.webp' : 'assets/images/blog/rosemary.webp',
          date: '31 ' + translations['March'] + ' 2023',
          title: 'เพาะเมล็ด โรสแมรี่,',
          by: 'Admin Herbist',
          link: '/blog/rosemary',
          sizes: prepSizes,
          srcset: prepSrcset,
        },
        {
          id: '9',
          image: environment.cloudinary ? prepUrl + 'thyme.webp' : 'assets/images/blog/thyme.webp',
          date: '31 ' + translations['March'] + ' 2023',
          title: 'เพาะเมล็ด ไทม์,',
          by: 'Admin Herbist',
          link: '/blog/thyme',
          sizes: prepSizes,
          srcset: prepSrcset,
        },
        {
          id: '10',
          image: environment.cloudinary ? prepUrl + 'catnip.webp' : 'assets/images/blog/catnip.webp',
          date: '31 ' + translations['March'] + ' 2023',
          title: 'เพาะเมล็ด แคทนิป,',
          by: 'Admin Herbist',
          link: '/blog/catnip',
          sizes: prepSizes,
          srcset: prepSrcset,
        },
        {
          id: '11',
          image: environment.cloudinary ? prepUrl + 'chamomile.webp' : 'assets/images/blog/chamomile.webp',
          date: '31 ' + translations['March'] + ' 2023',
          title: 'เพาะเมล็ด คาโมมายล์,',
          by: 'Admin Herbist',
          link: '/blog/chamomile',
          sizes: prepSizes,
          srcset: prepSrcset,
        },
        {
          id: '12',
          image: environment.cloudinary ? prepUrl + 'storingseeds.webp' : 'assets/images/blog/storingseeds.webp',
          date: '31 ' + translations['March'] + ' 2023',
          title: 'วิธีการเก็บเมล็ดพันธุ์ หลังจากเปิดซอง,',
          by: 'Admin Herbist',
          link: '/blog/storingseeds',
          sizes: prepSizes,
          srcset: prepSrcset,
        },
      ];
    });
  }

  getProductsByCollection(useCache = false, collection: string) {
    const params = new ShopParams();
    params.pageSize = this.pageSize;
    params.collections = collection;
    this.productService.setShopParams(params);

    // const params = this.productService.getShopParams();
    // params.pageSize = this.pageSize;
    // params.collections = collection;
    // params.tags = '';
    // params.typeId = 0;
    // params.brandId = 0;
    // params.search = '';
    // this.productService.setShopParams(params);

    this.productService
      .getProductPagination(useCache)
      .pipe(
        map((products) => {
          if (environment.cloudinary === true) {
            let imageUrl = environment.apiUrl.replace('api/', '');
            if (imageUrl.includes('https')) {
              imageUrl = imageUrl.replace('https', 'http');
            }
            let apiImageUrl = imageUrl + 'Content/images/products/';
            let cloudinaryUrl = environment.cloudinaryURL + '/' + environment.cloudinaryId + '/Products/';
            // console.log(apiImageUrl);
            // console.log(cloudinaryUrl);

            products.data.forEach((product, index, array) => {
              product.images.forEach((item, index, array) => {
                // console.log(array[index].src);
                let temp = array[index].src?.includes('https') ? array[index].src!.replace('https', 'http').replace(apiImageUrl, cloudinaryUrl) : array[index].src!.replace(apiImageUrl, cloudinaryUrl);
                array[index].src = temp;
                // console.log(temp);
                // console.log(array[index].src);
              });
            });
          }

          return products;
        })
      )
      .subscribe({
        next: (response) => {
          this.products = response.data;
          //console.log(this.products);
        },
        error: (e) => {
          console.error(e);
        },
        //complete: () => { console.info('load all products complete') }
      });

    //return this.products!;
  }

  // Product Tab collection
  getCollectionProducts(e: any) {
    // this.productCollections.forEach((element) => {
    //   element.active = false;
    // });
    //console.log(e.heading);
    //console.log(e.target.innerHTML.toString().trim()); e.heading.trim();//
    var stringToTranslate = e.target.innerHTML.toString().trim(); //e.heading.trim();//e.target.innerHTML.toString().trim();
    switch (stringToTranslate) {
      case 'เฮิบบิสท์':
        stringToTranslate = 'Herbist';
        this.productCollections.forEach((element) => {
          if (element.title === 'Herbist') {
            element.active = true;
          } else element.active = false;
        });
        break;
      case 'เรเน การ์เด้น':
        stringToTranslate = 'Renee’s Garden';
        this.productCollections.forEach((element) => {
          if (element.title === 'Renee’s Garden') {
            element.active = true;
          } else element.active = false;
        });
        break;
      case 'โปรโมชัน':
        stringToTranslate = 'On Sale';
        this.productCollections.forEach((element) => {
          if (element.title === 'On Sale') {
            element.active = true;
          } else element.active = false;
        });
        break;
      case 'สินค้ามาใหม่':
        stringToTranslate = 'New Product';
        this.productCollections.forEach((element) => {
          if (element.title === 'New Product') {
            element.active = true;
          } else element.active = false;
        });
        break;
      case 'สินค้าขายดี':
        stringToTranslate = 'Best Sellers';
        this.productCollections.forEach((element) => {
          if (element.title === 'Best Sellers') {
            element.active = true;
          } else element.active = false;
        });
        break;
    }

    this.active = stringToTranslate;
    this.productService.setMainPageProdCollection(stringToTranslate);
    // this.translate.getTranslation('en').subscribe(() => {
    //   var ccc = this.translate.getParsedResult(this.translate.translations['en'], 'Renee’s Garden')
    //   console.log(transaltedValue);
    // })
    //console.log(stringToTranslate);
    this.getProductsByCollection(false, stringToTranslate);
  }

  getCollection() {
    // Get collection from API
    this.dynamicTabs = this.productService.getCollections().subscribe({
      next: (response) => {
        //console.log(response);
        this.productCollections = response;

        if (Array.isArray(this.productCollections) && this.productCollections.length != 0) {
          let currectSelectedCollection = this.productService.getMainPageProdCollection();
          if (currectSelectedCollection !== '') {
            this.active = currectSelectedCollection;
          } else {
            this.active = this.productCollections[0].title;
          }

          this.getProductsByCollection(false, this.active);
        }
      },
      error: (e) => {
        console.error(e);
      },
      //complete: () => { console.info('load collections complete') }
    });
  }

  setCatagory(setCat: boolean, id: number) {
    if (setCat) {
      //console.log(id);

      //Set catagory id
      const params = new ShopParams();
      params.typeId = id;
      this.productService.setShopParams(params);
    }
  }

  public sliders = [
    {
      title: 'Ultra high quality trays',
      subTitle: '6-Cell Trays',
      description: 'Made in USA',
      fullURL: environment.cloudinary ? environment.cloudinaryURL + '/' + environment.cloudinaryId + '/assets/images/trays.webp' : 'assets/images/trays.webp',
      image: environment.cloudinary ? environment.cloudinaryId + '/assets/images/trays.webp' : 'assets/images/trays.webp',
      secret: '320w, 481w, 672w, 800w, 1000w, 1200w, 1400w',
      sizes: '100vw',
      link: '/shop/product/1',
      isSale: false,
    },
    {
      title: '20% Off',
      subTitle: 'Combo Set2',
      description: 'Imported from USA',
      fullURL: environment.cloudinary ? environment.cloudinaryURL + '/' + environment.cloudinaryId + '/assets/images/settwo.webp' : 'assets/images/settwo.webp',
      image: environment.cloudinary ? environment.cloudinaryId + '/assets/images/settwo.webp' : 'assets/images/settwo.webp',
      secret: '320w, 481w, 672w, 800w, 1000w, 1200w, 1400w',
      sizes: '100vw',
      link: '/shop/product/191',
      isSale: false,
    },
  ];

  // Collection banner
  public collections = [
    {
      image: environment.cloudinary ? environment.cloudinaryURL + '/' + environment.cloudinaryId + '/assets/images/collection/herbs.webp' : 'assets/images/collection/herbs.webp',
      secret: '320w, 481w, 672w',
      sizes: '60vw', //'(min-width: 60rem) 50vw, (min-width: 40rem) 60vw, 70vw',
      save: 'สมุนไพรฝรั่ง',
      title: 'Herbs',
      link: '/shop/collection/left/sidebar',
      setCat: true,
      catId: 1,
    },
    {
      image: environment.cloudinary ? environment.cloudinaryURL + '/' + environment.cloudinaryId + '/assets/images/collection/vegetable.webp' : 'assets/images/collection/vegetable.webp',
      secret: '320w, 481w, 672w',
      sizes: '60vw', //'(min-width: 60rem) 50vw, (min-width: 40rem) 60vw, 70vw',
      save: 'ผักสวนครัว',
      title: 'Veggies',
      link: '/shop/collection/left/sidebar',
      setCat: true,
      catId: 2,
    },
    {
      image: environment.cloudinary ? environment.cloudinaryURL + '/' + environment.cloudinaryId + '/assets/images/collection/flowers.webp' : 'assets/images/collection/flowers.webp',
      secret: '320w, 481w, 672w',
      sizes: '60vw', //'(min-width: 60rem) 50vw, (min-width: 40rem) 60vw, 70vw',
      save: 'ดอกไม้',
      title: 'Flowers',
      link: '/shop/collection/left/sidebar',
      setCat: true,
      catId: 3,
    },
  ];

  ngOnDestroy(): void {
    if (this.appService.isBrowser()) {
      document.documentElement.style.removeProperty('--theme-default');
    }
  }
}
