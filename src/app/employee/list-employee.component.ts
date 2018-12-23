import { Component, OnInit } from '@angular/core';
import { EmployeeService } from './employee.service';
import { IEmployee } from './IEmployee';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ISkill } from './ISkill';

@Component({
  selector: 'app-list-employees',
  templateUrl: './list-employee.component.html',
  styleUrls: ['./list-employee.component.scss']
})
export class ListEmployeesComponent implements OnInit {
  employees: IEmployee[];

  constructor(private _employeeService: EmployeeService,
    private _router: Router) { }

  ngOnInit() {
    this.getEmployee();
  }

  editButtonClick(employeeId: number) {
    this._router.navigate(['/edit', employeeId]);
  }

  deleteButtonClick(employeeId: number) {
    this._employeeService.deleteEmployee(employeeId).subscribe((data) => { this.getEmployee() });
  }

  getEmployee() {
    this._employeeService.getEmployees().subscribe(
      (employeeList) => {
        this.employees = employeeList
        this.employees.forEach((emp) => {
          if (emp.dp) {
            emp.dp = "../../" + emp.dp;
          } else {
            emp.dp = "../../assets/images/user-5.jpg"
          }
        })
      },
      (err) => console.log(err)
    );
  }

  viewButtonClick(employeeId) {
    this._router.navigate(['/detail', employeeId]);
  }

}