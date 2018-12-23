import { CanDeactivate } from "@angular/router";
import { CreateEmployeeComponent } from "./create-employee.component";
import { Injectable } from "@angular/core";
import { ConfirmDialogComponent } from "./confirm-dialog/confirm-dialog.component";
import { Subject, Observable } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal';


@Injectable()
export class AuthGuardService implements CanDeactivate<CreateEmployeeComponent>{

    constructor(private modalService: BsModalService){}

    canDeactivate(component: CreateEmployeeComponent): Observable<any> | boolean{
        if(component.employeeForm.dirty && !component.save){
            const subject = new Subject<boolean>();
            const modal = this.modalService.show(ConfirmDialogComponent, {'class': 'modal-dialog-primary'});
            modal.content.subject = subject;
            return subject.asObservable();
        }
        return true;
    }
}