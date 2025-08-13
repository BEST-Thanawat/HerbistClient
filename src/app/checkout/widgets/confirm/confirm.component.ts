import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-confirm',
  imports: [TranslateModule],
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {
  public onClose: Subject<boolean> | undefined;

  constructor(private modalRef: BsModalRef) { }
  
  ngOnInit(): void {
    this.onClose = new Subject();
   }

  confirm(): void {
    this.onClose!.next(true);
    this.modalRef!.hide();
  }
 
  decline(): void {
    this.onClose!.next(false);
    this.modalRef!.hide();
  }
}
