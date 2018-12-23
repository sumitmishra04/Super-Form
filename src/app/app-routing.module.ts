import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListEmployeesComponent } from './employee/list-employee.component';
import { CreateEmployeeComponent } from './employee/create-employee.component';
import { AuthGuardService } from './employee/auth-gaurd.service';
import { DetailComponent } from './employee/detail/detail.component';

const routes: Routes = [
  {path:'list' , component:ListEmployeesComponent },
  {path:'create' , component: CreateEmployeeComponent, canDeactivate: [AuthGuardService] },
  {path: 'detail/:id', component:DetailComponent},
  { path: 'edit/:id', component: CreateEmployeeComponent, canDeactivate: [AuthGuardService]  },
  { path: '', redirectTo: '/list', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
