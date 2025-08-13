import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-error-forbidden',
  templateUrl: './error-forbidden.component.html',
  styleUrls: ['./error-forbidden.component.scss'],
  imports: [BreadcrumbComponent, RouterModule]
})
export class ErrorForbiddenComponent {

}
