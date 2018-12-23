import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateEmployeeComponent } from './employee/create-employee.component';
import { ListEmployeesComponent } from './employee/list-employee.component';
import { EmployeeService } from './employee/employee.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuardService } from './employee/auth-gaurd.service';
import { DetailComponent } from './employee/detail/detail.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateEmployeeComponent,
    ListEmployeesComponent,
    DetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [EmployeeService, AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
