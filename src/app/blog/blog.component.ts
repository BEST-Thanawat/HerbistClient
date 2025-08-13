import { Component } from '@angular/core';
import { FooterOneComponent } from "../shared/footer/footer-one/footer-one.component";
import { RouterOutlet } from "@angular/router";
import { HeaderOneComponent } from "../shared/header/header-one/header-one.component";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
  imports: [FooterOneComponent, RouterOutlet, HeaderOneComponent]
})
export class BlogComponent {
  constructor() { }
}
