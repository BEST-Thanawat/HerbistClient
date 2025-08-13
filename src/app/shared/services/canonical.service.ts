import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CanonicalService {
  constructor(@Inject(DOCUMENT) private dom: any) { }

  setCanonicalURL(url?: string) {
    //this.removeCanonicalURL();

    const canURL = url == undefined ? this.dom.URL : url;
    const canonical = this.dom.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', canURL);
    }
    else {
      const link: HTMLLinkElement = this.dom.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', 'https:' + canURL);
      this.dom.head.appendChild(link);
    }

    // const canURL = url == undefined ? this.dom.URL : url;
    // const link: HTMLLinkElement = this.dom.createElement('link');
    // link.setAttribute('rel', 'canonical');
    // link.setAttribute('href', 'https:' + canURL);
    // this.dom.head.appendChild(link);

    // const canURL = url == undefined ? this.dom.URL : url;
    // const canonical = this.dom.querySelector('link[rel="canonical"]');
    // if (canonical) {
    //   canonical.setAttribute('href', 'xxx');
    // } else {
    //   const link: HTMLLinkElement = this.dom.createElement('link');
    //   link.setAttribute('rel', 'canonical');
    //   link.setAttribute('href', 'https:' + canURL);
    //   this.dom.head.appendChild(link);
    // }    
  }

  getCanonicalURL(): string {
    const canURL = this.dom.URL;
    //console.log(canURL);
    return canURL;
  }

  removeCanonicalURL() {
    //console.log('removeCanonicalURL');
    const canonical = this.dom.querySelector('link[rel="canonical"]');
    console.log(canonical);
    if (canonical === undefined || canonical === null) return;

    if (canonical.length > 0) canonical[0].parentElement.removeChild(canonical[0]);
  }
}