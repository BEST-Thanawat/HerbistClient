import { Inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { IProduct } from '../classes/product';
import { CanonicalService } from './canonical.service';
import { DOCUMENT } from '@angular/common';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private jsonSnippet: HTMLScriptElement;
  private graphObjects: any[] = [];

  logoImg = environment.cloudinary ? environment.cloudinaryURL + '/' + environment.cloudinaryId + '/assets/images/icon/herbist.png' : 'assets/images/icon/herbist.png';

  constructor(
    @Inject(DOCUMENT) private doc: Document,
    private canonicalService: CanonicalService,
    private titleService: Title,
    private metaTagService: Meta
  ) {
    // initial ld+json script
    this.jsonSnippet = this.doc.querySelector('script[type="application/ld+json"]') || this.createJsonSnippet();
  }

  //herbistshop.component.ts
  setMainPageTags(title: string) {
    this.removeAllTags();
    //Prepare meta tags data
    // let mainImage = new Image();
    // mainImage.src = 'assets/images/og_thumbnail.webp';

    let description = 'เมล็ดพันธุ์โรสแมรี่(Rosemary) ลาเวนเดอร์(Lavender) ไทม์ คาโมมาย ออริกาโน่ เสจ วอเตอร์เครส เคล เดซี่ ผักสวนครัว ดอกไม้ นำเข้ามากกว่า 200 ชนิด';

    this.titleService.setTitle(title);
    this.canonicalService.setCanonicalURL();
    this.metaTagService.addTags([
      { name: 'description', content: description },
      { name: 'keywords', content: 'เมล็ดพันธุ์โรสแมรี่ ลาเวนเดอร์ สมุนไพรฝรั่ง เมล็ดพันธุ์นำเข้า ถาดเพาะเมล็ดคุณภาพสูง วิธีเพาะเมล็ดโรสแมรี่' },
      { name: 'robots', content: 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large' },
      { name: 'author', content: 'Thanawat Sukwibul' },
      //{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { property: 'og:locale', content: 'th_TH' },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: this.canonicalService.getCanonicalURL() },
      { property: 'og:updated_time', content: new Date().toISOString() },
      { property: 'og:site_name', content: 'Herbist' },
      // { property: 'og:image', content: mainImage.src },
      // { property: 'og:image:secure_url', content: mainImage.src },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: title },
      { property: 'og:image:type', content: 'image/webp' },
    ]);
  }

  setNormalPageTags(title: string) {
    this.removeAllTags();

    //Prepare meta tags data
    // let mainImage = new Image();
    // mainImage.src = 'assets/images/og_thumbnail.webp';

    let description = 'เมล็ดพันธุ์โรสแมรี่(Rosemary) ลาเวนเดอร์(Lavender) ไทม์ คาโมมาย ออริกาโน่ เสจ วอเตอร์เครส เคล เดซี่ ผักสวนครัว ดอกไม้ นำเข้ามากกว่า 200 ชนิด';

    this.titleService.setTitle(title);
    this.canonicalService.setCanonicalURL();
    this.metaTagService.addTags([
      { name: 'description', content: description },
      { name: 'keywords', content: 'เมล็ดพันธุ์โรสแมรี่ ลาเวนเดอร์ สมุนไพรฝรั่ง เมล็ดพันธุ์นำเข้า ถาดเพาะเมล็ดคุณภาพสูง วิธีเพาะเมล็ดโรสแมรี่' },
      { name: 'robots', content: 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large' },
      { name: 'author', content: 'Thanawat Sukwibul' },
      //{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { property: 'og:locale', content: 'th_TH' },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: this.canonicalService.getCanonicalURL() },
      { property: 'og:updated_time', content: new Date().toISOString() },
      { property: 'og:site_name', content: 'Herbist' },
      // { property: 'og:image', content: 'assets/images/og_thumbnail.webp' }); //mainImage.src },
      // { property: 'og:image:secure_url', content: 'assets/images/og_thumbnail.webp' }); //mainImage.src },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: title },
      { property: 'og:image:type', content: 'image/webp' },
    ]);
  }

  //product-left-sidebar.component.ts
  setProductPageTags(product: IProduct, productImageURL: string) {
    this.removeAllTags();

    let title = product.name + ' | Herbist(เฮิบบิสท์) | เมล็ดพันธุ์สมุนไพรฝรั่ง โรสแมรี่ ลาเวนเดอร์ ผัก ดอกไม้นำเข้า';
    let availability = product.stock > 0 ? 'In Stock' : 'Out of Stock';
    let description = product.description.substring(0, 155) + (product.description.length > 156 ? '...' : '');

    this.titleService.setTitle(title);
    this.canonicalService.setCanonicalURL();

    this.metaTagService.updateTag({ name: 'keywords', content: product.name + ' วิธีปลูก วิธีเพาะเมล็ด' }); /******/
    //this.metaTagService.updateTag({ name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=5, user-scalable=yes' });
    this.metaTagService.updateTag({ name: 'author', content: 'Herbist(เฮิบบิสท์)' });
    this.metaTagService.updateTag({ property: 'og:type', content: 'product' });
    this.metaTagService.updateTag({ property: 'og:title', content: title });
    this.metaTagService.updateTag({ property: 'og:description', content: description });
    this.metaTagService.updateTag({ name: 'description', content: description });
    this.metaTagService.updateTag({ property: 'og:updated_time', content: new Date().toISOString() });
    this.metaTagService.updateTag({ property: 'og:image', content: productImageURL });
    this.metaTagService.updateTag({ property: 'og:image:secure_url', content: productImageURL });
    this.metaTagService.updateTag({ property: 'og:image:width', content: '1280' }); //productImage.naturalWidth.toString() }); /******/
    this.metaTagService.updateTag({ property: 'og:image:height', content: '1588' }); //productImage.naturalHeight.toString() }); /******/
    this.metaTagService.updateTag({ property: 'og:image:alt', content: product.images[0].alt! }); /******/
    this.metaTagService.updateTag({ property: 'og:image:type', content: 'image/webp' });
    this.metaTagService.updateTag({ property: 'product:price:amount', content: product.price.toString() });
    this.metaTagService.updateTag({ property: 'product:price:currency', content: 'THB' });
    this.metaTagService.updateTag({ property: 'product:availability', content: availability });
    this.metaTagService.updateTag({ property: 'product:retailer_item_id', content: product.id.toString() });
    this.metaTagService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaTagService.updateTag({ name: 'twitter:title', content: title });
    this.metaTagService.updateTag({ name: 'twitter:description', content: description });
    this.metaTagService.updateTag({ name: 'twitter:site', content: '@rosemary.herbist' });
    this.metaTagService.updateTag({ name: 'twitter:creator', content: '@rosemary.herbist' });
    this.metaTagService.updateTag({ name: 'twitter:image', content: productImageURL });
    this.metaTagService.updateTag({ name: 'twitter:label1', content: 'Price' });
    this.metaTagService.updateTag({ name: 'twitter:data1', content: product.price.toString() });
    this.metaTagService.updateTag({ name: 'twitter:label2', content: 'Availability' });
    this.metaTagService.updateTag({ name: 'twitter:data2', content: availability });

    // --- NEW: inject JSON-LD product schema ---
    let availabilityForGoogle = product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock';
    const productSchema = {
      '@type': 'Product',
      name: product.name,
      image: productImageURL,
      description: product.description,
      sku: product.id.toString(),
      brand: {
        '@type': 'Brand',
        name: 'Herbist',
      },
      offers: {
        '@type': 'Offer',
        url: this.canonicalService.getCanonicalURL(),
        priceCurrency: 'THB',
        price: product.price.toString(),
        availability: availabilityForGoogle,
        itemCondition: 'https://schema.org/NewCondition',
      },
    };

    const websiteSchema = {
      '@type': 'WebSite',
      '@id': 'https://herbist.shop/#website',
      url: 'https://herbist.shop/',
      name: 'Herbist',
      publisher: { '@id': 'https://herbist.shop/#organization' },
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://herbist.shop/search?query={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    };

    const organizationSchema = {
      '@type': 'Organization',
      '@id': 'https://herbist.shop/#organization',
      name: 'Herbist',
      url: 'https://herbist.shop/',
      logo: {
        '@type': 'ImageObject',
        url: this.logoImg, // replace with your real logo URL
      },
    };

    // --- Merge all into @graph ---
    this.updateJsonSnippet([productSchema, websiteSchema, organizationSchema]);
  }

  //blog.component.ts
  setBlogPageTags() {
    this.removeAllTags();

    //Prepare meta tags data
    //let blogImage = new Image(undefined);
    //blogImage.src = 'assets/images/blog/rosemary_h.webp';

    let title = 'เฮิบบิสท์ บล็อก | Herbist(เฮิบบิสท์) | เมล็ดพันธุ์สมุนไพรฝรั่ง โรสแมรี่ ลาเวนเดอร์ ผัก ดอกไม้นำเข้า';
    let description = 'เฮิบบิสท์ บล็อก บทความการปลูกสมุนไพรฝรั่ง วิธีการเพาะเมล็ด และเคล็ดลับต่างๆที่น่าสนใจ';

    this.titleService.setTitle(title);
    this.canonicalService.setCanonicalURL();

    this.metaTagService.updateTag({ name: 'description', content: description });
    //this.metaTagService.updateTag({ name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=5, minimum-scale=1, user-scalable=yes' });
    this.metaTagService.updateTag({ name: 'robots', content: 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large' });
    this.metaTagService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaTagService.updateTag({ name: 'twitter:title', content: title });
    this.metaTagService.updateTag({ name: 'twitter:site', content: '"@rosemary.herbist' });
    this.metaTagService.updateTag({ name: 'twitter:image', content: 'assets/images/blog/rosemary_h.webp' }); //blogImage.src });
    this.metaTagService.updateTag({ property: 'og:locale', content: 'th_TH' });
    this.metaTagService.updateTag({ property: 'og:type', content: 'blog' });
    this.metaTagService.updateTag({ property: 'og:title', content: title });
    this.metaTagService.updateTag({ property: 'og:url', content: this.canonicalService.getCanonicalURL() });
    this.metaTagService.updateTag({ property: 'og:site_name', content: 'Herbist' });
    this.metaTagService.updateTag({ property: 'og:image', content: 'assets/images/blog/rosemary_h.webp' }); //blogImage.src });
    this.metaTagService.updateTag({ property: 'og:image:secure_url', content: 'assets/images/blog/rosemary_h.webp' }); //blogImage.src });
    this.metaTagService.updateTag({ property: 'og:image:width', content: '1370' });
    this.metaTagService.updateTag({ property: 'og:image:height', content: '385' });
    this.metaTagService.updateTag({ property: 'og:image:alt', content: title });
    this.metaTagService.updateTag({ property: 'og:image:type', content: 'image/webp' });
  }

  //blog.component.ts
  setBlogArticleTags(image: string, title: string, description: string, alt: string, section: string, imageWidth: string, imageHeight: string) {
    this.removeAllTags();

    //Prepare meta tags data
    // let blogImage = new Image();
    // blogImage.src = image;

    //this.titleService.setTitle(title);
    this.canonicalService.setCanonicalURL();

    description = description.length > 155 ? description.substring(0, 155) + '...' : description;

    //Update meta tags
    this.titleService.setTitle(title);
    this.metaTagService.updateTag({ name: 'description', content: description });
    //this.metaTagService.updateTag({ name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=5, minimum-scale=1, user-scalable=yes' });
    this.metaTagService.updateTag({ name: 'robots', content: 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large' });
    this.metaTagService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaTagService.updateTag({ name: 'twitter:title', content: title });
    this.metaTagService.updateTag({ name: 'twitter:description', content: description });
    this.metaTagService.updateTag({ name: 'twitter:site', content: '@rosemary.herbist' });
    this.metaTagService.updateTag({ name: 'twitter:creator', content: '@rosemary.herbist' });
    this.metaTagService.updateTag({ name: 'twitter:image', content: image }); //blogImage.src });
    this.metaTagService.updateTag({ name: 'twitter:label1', content: 'Written by' });
    this.metaTagService.updateTag({ name: 'twitter:data1', content: 'Herbist(เฮิบบิสท์)' });
    this.metaTagService.updateTag({ name: 'twitter:label2', content: 'Time to read' });
    this.metaTagService.updateTag({ name: 'twitter:data2', content: '1 minute' });
    this.metaTagService.updateTag({ property: 'og:locale', content: 'th_TH' });
    this.metaTagService.updateTag({ property: 'og:type', content: 'article' });
    this.metaTagService.updateTag({ property: 'og:title', content: title });
    this.metaTagService.updateTag({ property: 'og:description', content: description });
    this.metaTagService.updateTag({ property: 'og:url', content: this.canonicalService.getCanonicalURL() });
    this.metaTagService.updateTag({ property: 'og:site_name', content: 'Herbist' });
    this.metaTagService.updateTag({ property: 'og:updated_time', content: new Date().toISOString() });
    this.metaTagService.updateTag({ property: 'og:image', content: image }); //blogImage.src });
    this.metaTagService.updateTag({ property: 'og:image:secure_url', content: image }); //blogImage.src });
    this.metaTagService.updateTag({ property: 'og:image:width', content: imageWidth });
    this.metaTagService.updateTag({ property: 'og:image:height', content: imageHeight });
    this.metaTagService.updateTag({ property: 'og:image:alt', content: alt });
    this.metaTagService.updateTag({ property: 'og:image:type', content: 'image/webp' });
    this.metaTagService.updateTag({ property: 'article:publisher', content: 'https://www.facebook.com/herbist.primed.rosemary/' });
    this.metaTagService.updateTag({ property: 'article:section', content: section });
    this.metaTagService.updateTag({ property: 'article:published_time', content: '2020-01-31T06:31:50+07:00' });
    this.metaTagService.updateTag({ property: 'article:modified_time', content: new Date().toISOString() });
  }

  removeAllTags() {
    this.metaTagService.removeTag("rel='canonical'");

    this.metaTagService.removeTag("name='description'");
    this.metaTagService.removeTag("name='keywords'");
    this.metaTagService.removeTag("name='robots'");
    this.metaTagService.removeTag("name='author'");
    //this.metaTagService.removeTag("name='viewport'");

    this.metaTagService.removeTag("name='twitter:card'");
    this.metaTagService.removeTag("name='twitter:title'");
    this.metaTagService.removeTag("name='twitter:site'");
    this.metaTagService.removeTag("name='twitter:image'");
    this.metaTagService.removeTag("name='twitter:description'");
    this.metaTagService.removeTag("name='twitter:creator'");
    this.metaTagService.removeTag("name='twitter:label1'");
    this.metaTagService.removeTag("name='twitter:data1'");
    this.metaTagService.removeTag("name='twitter:label2'");
    this.metaTagService.removeTag("name='twitter:data2'");

    this.metaTagService.removeTag("property='og:locale'");
    this.metaTagService.removeTag("property='og:type'");
    this.metaTagService.removeTag("property='og:title'");
    this.metaTagService.removeTag("property='og:description'");
    this.metaTagService.removeTag("property='og:url'");
    this.metaTagService.removeTag("property='og:updated_time'");
    this.metaTagService.removeTag("property='og:site_name'");
    this.metaTagService.removeTag("property='og:image'");
    this.metaTagService.removeTag("property='og:image:secure_url'");
    this.metaTagService.removeTag("property='og:image:width'");
    this.metaTagService.removeTag("property='og:image:height'");
    this.metaTagService.removeTag("property='og:image:alt'");
    this.metaTagService.removeTag("property='og:image:type'");
    this.metaTagService.removeTag("property='product:price:amount'");
    this.metaTagService.removeTag("property='product:price:currency'");
    this.metaTagService.removeTag("property='product:availability'");
    this.metaTagService.removeTag("property='product:retailer_item_id'");
    this.metaTagService.removeTag("property='article:publisher'");
    this.metaTagService.removeTag("property='article:section'");
    this.metaTagService.removeTag("property='article:published_time'");
    this.metaTagService.removeTag("property='article:modified_time'");
  }

  createJsonSnippet(): HTMLScriptElement {
    // if on browser platform, return

    const script = this.doc.createElement('script');
    // set attribute to application/ld+json
    script.setAttribute('type', 'application/ld+json');

    // append and return reference
    this.doc.body.appendChild(script);
    return script;
  }

  updateJsonSnippet(schema: any) {
    // if on briwser platform return

    // first find the graph objects then append to it
    const found = this.graphObjects.findIndex((n) => n['@type'] === schema['@type']);
    if (found > -1) {
      this.graphObjects[found] = schema;
    } else {
      this.graphObjects.push(schema);
    }

    const graph = {
      '@context': 'https://schema.org',
      '@graph': this.graphObjects,
    };
    this.jsonSnippet.textContent = JSON.stringify(graph);
  }

  emptyJsonSnippet() {
    // sometimes, in browser platform, we need to empty objects first
    this.graphObjects = [];
  }
}
