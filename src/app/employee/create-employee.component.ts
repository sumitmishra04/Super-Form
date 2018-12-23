import { Component, OnInit, asNativeElements, ChangeDetectorRef } from '@angular/core';
// Import FormGroup and FormControl classes
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';
import { CustomValidators } from '../shared/custom.validator';
import { EmployeeService } from './employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IEmployee } from './IEmployee';
import { ISkill } from './ISkill';
@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.scss']
})
export class CreateEmployeeComponent implements OnInit {
  public employeeForm: FormGroup;
  employee: IEmployee;
  pageTitle: string;
  save: boolean = false;
  formErrors = {};

  validationMessages = {
    'fullName': {
      'required': 'Full Name is required.',
      'minlength': 'Full Name must be greater than 2 characters.',
      'maxlength': 'Full Name must be less than 10 characters.'
    },
    'email': {
      'required': 'Email is required.',
      'emailDomain': 'Please enter a proper email domain'
    },
    'confirmEmail': {
      'required': 'Confirm email is required.',
    },
    'emailGroup': {
      'emailMismatch': 'Email and Confirm Email do not match.'
    },
    'phone': {
      'required': 'Phone is required.'
    },
    'skillName': {
      'required': 'Skill Name is required.',
    },
    'experienceInYears': {
      'required': 'Experience is required.',
    },
    'proficiency': {
      'required': 'Proficiency is required.',
    },
  };

  constructor(private fb: FormBuilder, private route: ActivatedRoute,
    private employeeService: EmployeeService, private router: Router,
    private cd: ChangeDetectorRef) {
  }



  ngOnInit() {
    this.save = false;
    this.employeeForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      contactPreference: ['email'],
      emailGroup: this.fb.group({
        email: ['', [Validators.required, CustomValidators.emailDomain('dell.com')]],
        confirmEmail: ['', [Validators.required]],
      }, { validator: CustomValidators.matchEmails }),
      phone: [''],
      skills: this.fb.array([
        this.addSkillFormGroup()
      ]),
      // file: [null, Validators.required]
    });

    this.employeeForm.valueChanges.subscribe((value: string) => {
      this.logValidationError();
    });

    this.employeeForm.get('contactPreference').valueChanges.subscribe((data: string) => {
      this.onContactPrefernceChange(data);
    });

    this.route.paramMap.subscribe(params => {
      const empId = +params.get('id');
      if (empId) {
        this.pageTitle = 'Edit Employee';
        this.getEmployee(empId);
      } else {
        this.pageTitle = 'Create Employee';
        this.employee = {
          id: null,
          dp: '',
          fullName: '',
          contactPreference: '',
          email: '',
          phone: null,
          skills: []
        };
      }
    });
  }

  getEmployee(id: number) {
    this.employeeService.getEmployee(id)
      .subscribe(
        (employee: IEmployee) => {
          this.employee = employee;
          this.editEmployee(employee);
        },
        (err: any) => console.log(err)
      );
  }

  editEmployee(employee: IEmployee) {
    this.employeeForm.patchValue({
      fullName: employee.fullName,
      contactPreference: employee.contactPreference,
      emailGroup: {
        email: employee.email,
        confirmEmail: employee.email
      },
      phone: employee.phone
    });

    this.employeeForm.setControl('skills', this.setExistingSkills(employee.skills));

  }

  setExistingSkills(skillSets: ISkill[]): FormArray {
    const formArray = new FormArray([]);
    skillSets.forEach(s => {
      formArray.push(this.fb.group({
        skillName: s.skillName,
        experienceInYears: s.experienceInYears,
        proficiency: s.proficiency
      }));
    });

    return formArray;
  }

  addSkillFormGroup(): FormGroup {
    return this.fb.group({
      skillName: ['', Validators.required],
      experienceInYears: ['', Validators.required],
      proficiency: ['', Validators.required]
    });
  }

  addSkillButtonClick() {
    (<FormArray>this.employeeForm.get('skills')).push(this.addSkillFormGroup());
  }

  onContactPrefernceChange(selectedValue: string) {
    const phoneFormControl = this.employeeForm.get('phone');
    if (selectedValue === 'phone') {
      phoneFormControl.setValidators(Validators.required);
    } else {
      phoneFormControl.clearValidators();
    }
    phoneFormControl.updateValueAndValidity();
  }

  logValidationError(group: FormGroup = this.employeeForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      this.formErrors[key] = '';
      if (abstractControl && !abstractControl.valid
        && (abstractControl.touched || abstractControl.dirty || abstractControl.value !== '')) {
        const messages = this.validationMessages[key];
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors[key] += messages[errorKey] + ' ';
          }
        }
      }

      if (abstractControl instanceof FormGroup) {
        this.logValidationError(abstractControl);
      }
      // if (abstractControl instanceof FormArray) {
      //   for(const control of abstractControl.controls){
      //     if(control instanceof FormGroup){
      //       this.logValidationError(control);
      //     }
      //   }
      // }
    });
  }

  removeSkillButtonClick(skillGroupIndex: number): void {
    const skillsFormArray = <FormArray>this.employeeForm.get('skills');
    skillsFormArray.removeAt(skillGroupIndex);
    skillsFormArray.markAsDirty();
    skillsFormArray.markAsTouched();
  }


  onSubmit(): void {
    this.save = true;

    this.mapFormValuesToEmployeeModel();
    if (this.employee.id) {
      this.employeeService.updateEmployee(this.employee).subscribe(
        () => this.router.navigate(['list']),
        (err: any) => console.log(err)
      );
    } else {
      this.employeeService.addEmployee(this.employee).subscribe(
        () => this.router.navigate(['list']),
        (err: any) => console.log(err)
      );
    }
  }

  mapFormValuesToEmployeeModel() {
    this.employee.fullName = this.employeeForm.value.fullName;
    this.employee.contactPreference = this.employeeForm.value.contactPreference;
    this.employee.email = this.employeeForm.value.emailGroup.email;
    this.employee.phone = this.employeeForm.value.phone;
    this.employee.skills = this.employeeForm.value.skills;
    // this.employee.dp = this.employeeForm.value.file;
    // console.log(this.employee)
  }

  onCancelClick() {
    this.router.navigate(['/']);
  }

  onFileChanged(event) {
    let reader = new FileReader();
   
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
    
      reader.onload = () => {
        this.employeeForm.patchValue({
          file: reader.result
        });
        
        // need to run CD since file load runs outside of zone
        this.cd.markForCheck();
      };
    }
  }
  }


// Nested form group (emailGroup) is passed as a parameter. Retrieve email and
// confirmEmail form controls. If the values are equal return null to indicate
// validation passed otherwise an object with emailMismatch key. Please note we
// used this same key in the validationMessages object against emailGroup
// property to store the corresponding validation error message


    // this.employeeForm = new FormGroup({
    //   fullName: new FormControl(),
    //   email: new FormControl(),
    //   skills: new FormGroup({
    //     skillName: new FormControl(),
    //     experienceInYears: new FormControl(),
    //     proficiency: new FormControl()
    //   })
    // });

  // logValidationError(group: FormGroup = this.employeeForm) {
  //   Object.keys(group.controls).forEach((key: string) => {
  //     // get current control from the key which is formcontrol/formgroup name eg : 'fullName'
  //     const abstractControl = group.get(key);
  //     if (abstractControl instanceof FormGroup) {
  //       this.logValidationError(abstractControl);
  //     } else {
  //       // clear validation errors if any 
  //       this.formErrors[key] = '';
  //       // absControl will stay invalid as long as it has any errors object
  //       if (abstractControl && !abstractControl.valid &&
  //         abstractControl.touched || abstractControl.dirty) {
  //         // fetch the list of error messages of the current control (let absContol be 'fullName')
  //         // 'fullname': {'required':'This field is required'}
  //         // messages = {'required':'This field is required'}
  //         const messages = this.validationMessages[key];
  //         // the errorKey(required, minLength, etc) will be there if there is any validation failed
  //         for (const errorKey in abstractControl.errors) {
  //           if (errorKey) {
  //             // errorKey holds the actual validation error name that control failed
  //             // messages object is created in such a way that to the error key there is a string assigned
  //             // {'fullname':'This field is required'}
  //             this.formErrors[key] += messages[errorKey] + ' ';
  //           }
  //         }
  //         // console.log(`key = ${key} Value = ${abstractControl.value}`)
  //         // abstractControl.disable();
  //         // abstractControl.markAsDirty();
  //       }
  //     }
  //   });
  // }

    // this.employeeForm.setValue({
    //   fullName : 'Sumit',
    //   email: 'mishrasumit042@gmail.com',
    //   skills: {
    //     skillName: 'Ang6',
    //     experienceInYears: 5,
    //     proficiency: 'beginner'
    //   }
    // })
    // this.employeeForm.patchValue({
    //   fullName: 'Sumit',
    //   email: 'mishrasumit042@gmail.com',
    // })