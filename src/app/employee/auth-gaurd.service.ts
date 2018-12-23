import { CanDeactivate } from "@angular/router";
import { CreateEmployeeComponent } from "./create-employee.component";
import { Injectable } from "@angular/core";

@Injectable()
export class AuthGuardService implements CanDeactivate<CreateEmployeeComponent>{

    canDeactivate(component: CreateEmployeeComponent): boolean{
        if(component.employeeForm.dirty && !component.save){
            console.log(component.save);
            return confirm('Are you sure you want to discrd the changes')
        }
        return true;
    }
}