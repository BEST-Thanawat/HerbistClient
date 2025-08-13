import { Component, OnInit, OnDestroy, ViewChild, TemplateRef, Input } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CartService } from '../../../services/cart.service';
import { IProduct } from '../../../classes/product';
import { ProductService } from '../../../services/product.service';
import { AppService } from '../../../services/app.service';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { DiscountPipe } from "../../../pipes/discount.pipe";

@Component({
  selector: 'app-quick-view',
  imports: [CommonModule, TranslateModule, RouterModule, DiscountPipe],
  templateUrl: './quick-view.component.html',
  styleUrls: ['./quick-view.component.scss']
})
export class QuickViewComponent implements OnInit, OnDestroy {
  @Input() product: IProduct | undefined;
  @Input() currency: any;
  @Input() sizes: string = '';
  @ViewChild("quickView", { static: false }) QuickView: TemplateRef<any> | undefined;
  public closeResult: string | undefined;
  public ImageSrc: string | undefined;
  public counter: number = 1;
  public modalOpen: boolean = false;

  modalRef?: BsModalRef;
  srcset: string = ''; //'160w, 200w, 320w, 481w, 672w, 800w, 1000w, 1200w';
  productSizes = '60vw';

  constructor(private appService: AppService, public productService: ProductService, private cartService: CartService, private modalService: BsModalService) { } 

  ngOnInit(): void { }

  openModal() {    
    this.modalOpen = true;
    if (this.appService.isBrowser()) { // For SSR 
      this.modalRef = this.modalService.show(this.QuickView!, { class: 'modal-lg' });
    }
  }
  
  // Increament
  increment() {
    this.counter++;
  }

  // Decrement
  decrement() {
    if (this.counter > 1) this.counter--;
  }

  // Add to cart
  async addToCart(product: any) {
    if (product.stock == 0) return;
    this.cartService.addItemToCart(product, this.counter);
  }

  ngOnDestroy() {
    if (this.modalOpen) {
      this.modalService.hide();
    }
  }

  // // Get Product Color
  // Color(variants: any) {
  //   const uniqColor = []
  //   for (let i = 0; i < Object.keys(variants).length; i++) {
  //     if (uniqColor.indexOf(variants[i].color) === -1 && variants[i].color) {
  //       uniqColor.push(variants[i].color)
  //     }
  //   }
  //   return uniqColor
  // }

  // // Get Product Size
  // Size(variants: any) {
  //   const uniqSize = []
  //   for (let i = 0; i < Object.keys(variants).length; i++) {
  //     if (uniqSize.indexOf(variants[i].size) === -1 && variants[i].size) {
  //       uniqSize.push(variants[i].size)
  //     }
  //   }
  //   return uniqSize
  // }

  // // Change Variants
  // ChangeVariants(color: any, product: any) {
  //   product.variants.map((item: any) => {
  //     if (item.color === color) {
  //       product.images.map((img: any) => {
  //         if (img.image_id === item.image_id) {
  //           this.ImageSrc = img.src
  //         }
  //       })
  //     }
  //   })
  // }
}
