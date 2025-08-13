import { Component, OnInit, Input } from '@angular/core';
import { NewProductSlider } from '../../../data/slider';
import { IProduct } from '../../../classes/product';
import { ProductService } from '../../../services/product.service';
import { environment } from '../../../../../environments/environment';
import { AppService } from '../../../services/app.service';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { DiscountPipe } from "../../../pipes/discount.pipe";
import { CarouselModule } from "ngx-owl-carousel-o";

@Component({
  selector: 'app-product-box-vertical-slider',
  imports: [CommonModule, TranslateModule, RouterModule, DiscountPipe, CarouselModule],
  templateUrl: './product-box-vertical-slider.component.html',
  styleUrls: ['./product-box-vertical-slider.component.scss']
})
export class ProductBoxVerticalSliderComponent implements OnInit {
  @Input() title: string = 'New Product'; // Fixed for new products only
  //@Input() type: string = 'Herbs'; // Default Fashion
  public products : IProduct[] = [];
  public NewProductSliderConfig: any = NewProductSlider;

  productSrcset = ''; //'160w, 200w, 320w, 481w, 672w, 800w';
  productSizes = '5vw';

  constructor(public productService: ProductService, private appService: AppService) { 
    if (this.appService.isBrowser()) {
      this.getProducts();
    }
  }

  ngOnInit(): void { }

  getProducts() {
    this.productService.getNewProducts().subscribe({
      next: (response) => {
        //console.log(response);
        //console.log(response);
        this.products = response;//?.filter(item => item.isNew == true); // Fixed for new products only

        if (environment.cloudinary === true) {    
          let imageUrl = environment.apiUrl.replace('api/', '')
          if (imageUrl.includes('https')) { 
            imageUrl = imageUrl.replace('https', 'http');
          }
          let apiImageUrl = imageUrl + 'Content/images/products/';
          let cloudinaryUrl = environment.cloudinaryURL + '/' + environment.cloudinaryId + '/Products/';

          this.products!.forEach(element => {
            element.images[0].src = element.images[0].src!.includes('https') ? element.images[0]?.src!.replace('https', 'http').replace(apiImageUrl, cloudinaryUrl) : element.images[0]?.src!.replace(apiImageUrl, cloudinaryUrl);
            
          });
        }
      },
      error: (e) => { console.error(e) },
      //complete: () => { console.info('load new products complete') }
    })
  }
}
