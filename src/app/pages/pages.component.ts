import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { AppService } from '../shared/services/app.service';
import { SeoService } from '../shared/services/seo.service';
import { FooterOneComponent } from "../shared/footer/footer-one/footer-one.component";
import { HeaderOneComponent } from "../shared/header/header-one/header-one.component";

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
  imports: [FooterOneComponent, HeaderOneComponent, RouterModule]
})
export class PagesComponent implements OnInit {

  public url : any; 

  constructor(private router: Router, private seoService: SeoService, private appService: AppService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.url = event.url;
      }
    });
  }

  ngOnInit(): void {
    if (this.appService.isBrowser()) {
      this.seoService.removeAllTags();
    }
  }
}
