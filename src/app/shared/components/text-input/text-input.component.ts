import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-text-input',
  imports: [CommonModule, TranslateModule, RouterModule],
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss']
})

//https://stackblitz.com/edit/angular-ivy-utmym3?file=src%2Fapp%2Fhello.component.ts
export class TextInputComponent implements OnInit, ControlValueAccessor {
  @ViewChild('input', {static: true}) input!: ElementRef;
  @Input() type = 'text';
  @Input() label!: string;
  @Input() isDisabled: boolean = false;

  touched = false;
  disabled = false;
  value: string | null = null;

  constructor(@Self() public controlDir: NgControl) { 
    this.controlDir.valueAccessor = this;
  }
  
  ngOnInit(): void {
    const control = this.controlDir.control;
    const validators = control?.validator ? [control.validator] : [];
    const asyncValidators = control?.asyncValidator ? [control.asyncValidator] : [];

    control?.setValidators(validators);
    control?.setAsyncValidators(asyncValidators);
    control?.updateValueAndValidity();
  }

  onChange(event: any) { }

  onTouched() { }

  onBlur() { this.onTouched(); }

  changes(event: Event) {
    if (this.disabled) return;
    this.markAsTouched();
    this.value = event?.target
      ? (event?.target as HTMLTextAreaElement).value
      : '';
    this.onChange(this.value);

    //console.log(this.controlDir.control.errors);
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  writeValue(obj: any): void {
    this.input.nativeElement.value = obj || '';
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState(fn: any) {
    this.disabled = fn;
  }
}