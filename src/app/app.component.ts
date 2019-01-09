import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  siForm;
  hideDelay = 20000000;
  @ViewChild('tooltipNumsite') tooltipNumsite : TemplateRef<any>;
  constructor(private http: HttpClient, private fb: FormBuilder) {
  }

  validationMessages = {
    'numSite': {
      'required': 'Total Number of Site is required.',
      'min': 'Total Number of Site must be greater than 0',
      'max': 'Total Number of Site must be less than 1000.'
    },
    'uSite': {
      'min': 'Uninitiated Sites must be greater than 0',
      'max': 'Uninitiated Sites must be less than 1000.'
    }
  };

  formErrors = {};

  ngOnInit() {
    this.siForm = this.fb.group({
      numSite: ['45', [Validators.required, Validators.min(1), Validators.max(1000)]],
      uSite: ['', [Validators.min(1), Validators.max(1000)]],
    });
    this.siForm.get('numSite').valueChanges.subscribe((data) => {
      const usite = data - 10;
      if(!Number.isNaN(usite) ){
      this.siForm.get('uSite').setValue(usite);        
      }
    });
    this.siForm.valueChanges.subscribe(()=>{
      this.logValidationError();
    });
  }

  logValidationError(group: FormGroup = this.siForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      this.formErrors[key] = '';
      if (abstractControl && !abstractControl.valid
        && (abstractControl.touched || abstractControl.dirty || abstractControl.value !== '')) {
        const messages = this.validationMessages[key];
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors[key] = messages[errorKey];
            // this.tooltipNumsite.show();
            console.log(this.formErrors)
          }
        }
      }

      if (abstractControl instanceof FormGroup) {
        this.logValidationError(abstractControl);
      }
    });
  }
}
