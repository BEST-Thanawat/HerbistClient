import { Component, Inject, OnInit, PLATFORM_ID, Signal, signal, viewChild, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { TapToTopComponent } from './shared/components/tap-to-top/tap-to-top.component';
import { NgProgressbar } from 'ngx-progressbar';
import { NgProgressRouter } from 'ngx-progressbar/router';
import { NavService } from './shared/services/nav.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TapToTopComponent, NgProgressbar, NgProgressRouter],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('HerbistClient');

  @ViewChild(ToastContainerDirective, { static: true })
  toastContainer: ToastContainerDirective | undefined;

  overlayColor: string = 'rgba(40,40,40,0.3)';
  pbColor: string = '#565264';
  fgsColor: string = '#ffffff';
  blur: number = 2;
  fgsSize: number = 30;

  constructor(
    private toastrService: ToastrService,
    private navService: NavService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.toastrService.overlayContainer = this.toastContainer;
  }
}

declare global {
  interface Window {
    gtag: any;
  }
}
