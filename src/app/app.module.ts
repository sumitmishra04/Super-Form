import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateEmployeeComponent } from './employee/create-employee.component';
import { ListEmployeesComponent } from './employee/list-employee.component';
import { EmployeeService } from './employee/employee.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuardService } from './employee/auth-gaurd.service';
import { DetailComponent } from './employee/detail/detail.component';
import { ConfirmDialogComponent } from './employee/confirm-dialog/confirm-dialog.component';
import { BsModalService } from 'ngx-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NumberDirective } from './shared/numbers-only.directive';
import { MatTooltipModule} from '@angular/material';
@NgModule({
  declarations: [
    AppComponent,
    CreateEmployeeComponent,
    ListEmployeesComponent,
    DetailComponent,
    ConfirmDialogComponent,
    NumberDirective
  ],
  entryComponents: [ConfirmDialogComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    MatTooltipModule,
    BrowserAnimationsModule
  ],
  exports:[MatTooltipModule],
  providers: [EmployeeService, AuthGuardService, BsModalService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
