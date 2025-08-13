import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-loading',
  imports: [TranslateModule],
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {
  public onClose: Subject<boolean> | undefined;

  constructor() { }
  
  ngOnInit(): void {
    this.onClose = new Subject();
   }
}
