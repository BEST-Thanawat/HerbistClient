import { Component, OnInit, Input } from '@angular/core';
import { HomeSlider } from '../../../shared/data/slider';
import { CarouselModule } from "ngx-owl-carousel-o";
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  imports: [CarouselModule, RouterModule, TranslateModule, CommonModule]
})
export class SliderComponent implements OnInit {
  
  @Input() sliders: any[] | undefined;
  @Input() class: string | undefined;
  @Input() textClass: string | undefined;
  // @Input() category: string;
  @Input() buttonText: string | undefined;
  @Input() buttonClass: string | undefined;
  
  constructor() { }

  ngOnInit(): void {
  }

  public HomeSliderConfig: any = HomeSlider;

}