import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, NavigationStart } from '@angular/router';
import { EmployeeService } from '../employee.service';
import { IEmployee } from '../IEmployee';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  private _id: number;
  employee: IEmployee;
  navStart: Observable<NavigationStart>;
  constructor(private activatedRoute: ActivatedRoute,
    private employeeService: EmployeeService,
    private router: Router) {
      this.navStart = router.events.pipe(
        filter(evt => evt instanceof NavigationStart)
      ) as Observable<NavigationStart>;
     }

  ngOnInit() {
    this.navStart.subscribe(evt => console.log('Navigation Started!'));
    // this._id = +this.activatedRoute.params['id'];
    this.activatedRoute.url.subscribe((data)=>{
      console.log(data)
    });
    this.activatedRoute.data.subscribe((data)=>{
      console.log(data)
    });
    this.activatedRoute.paramMap.subscribe(params => {
      this._id = +params.get('id');
      this.employeeService.getEmployee(this._id).subscribe(
        (employee: IEmployee) => {
          this.employee = employee;
          if(employee.dp){
          this.employee.dp = "../../../" + employee.dp;
          } else{
            this.employee.dp = "../../../assets/images/user-5.jpg";
          }
        },
        (err: any) => console.log('Employee does not exist')
      );
    })
  }

  showNextEmployee() {
    this._id += 1;
    this.router.navigate(['/detail', this._id]);
  }

}
