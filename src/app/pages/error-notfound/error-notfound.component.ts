import { Component } from '@angular/core';
import { BreadcrumbComponent } from "../../shared/components/breadcrumb/breadcrumb.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-error-notfound',
  templateUrl: './error-notfound.component.html',
  styleUrls: ['./error-notfound.component.scss'],
  imports: [BreadcrumbComponent, RouterModule]
})
export class ErrorNotfoundComponent {

}
