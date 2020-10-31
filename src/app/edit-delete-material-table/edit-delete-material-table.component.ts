import { DataSource } from '@angular/cdk/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Customer } from '../customer';
import { CustomerService } from '../customer.service';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-edit-delete-material-table',
  templateUrl: './edit-delete-material-table.component.html',
  styleUrls: ['./edit-delete-material-table.component.css'],
})
export class EditDeleteMaterialTableComponent implements OnInit {
  editUsr: any;
  oldUsr: any;
  editdisabled: boolean;
  pagePerm;
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  customers = [];
  displayColumns = [
    'FullName',
    'MobileNumber',
    'Gender',
    'City',
    'State',
    'DOB',
    'username',
    'Actions',
  ];
  dataSource;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  userServ: any;
  toastr: any;
  dataListSubs: any;
  // public usersData = new BehaviorSubject<Users[]>([]);
  // private loadingUsers = new BehaviorSubject<boolean>(false);
  // private countInfo = new BehaviorSubject<number>(0);
  // public loading$ = this.loadingUsers.asObservable();
  // public totalCount$ = this.countInfo.asObservable();

  constructor(private customerService: CustomerService) {}
  ngOnInit() {
    this.editUsr = {};
    this.getCustomers();
  }

  getCustomers() {
    return this.customerService.getCustomers().subscribe((customers: any) => {
      this.customers = customers.data;
      // console.log(customers);
      // console.log('dcdscdsc : ', this.customers);

      this.dataSource = new MatTableDataSource(this.customers);
      this.dataSource.sort = this.sort;
      // this.dataSource.paginator = this.paginator;
    });
  }

  editROw(usr: any) {
    // console.log(usr);
    this.editUsr = usr && usr.id ? usr : {};
    // console.log('dataaaa' + JSON.stringify(this.editUsr['id']));
    this.oldUsr = { ...this.editUsr };
  }

  updateEdit() {
    //updateEdit
    this.editdisabled = true;
    this.customerService.updateCustomer(this.editUsr).subscribe(
      (data: any) => {
        this.editUsr = {};
        this.editdisabled = false;
        if (data.data && data.res == 1) {
          this.oldUsr = {};
          console.log('updated!');
        } else {
          this.cancelEdit();
          console.log(data.msg, 'Error!');
        }
      },
      (err) => {
        this.toastr.error('Please try after some time', 'Error!');
        this.editdisabled = false;
        this.cancelEdit();
      }
    );
  }
  cancelEdit() {
    //cancel
    console.log('Cancel');
    this.editUsr = {};
    window.location.reload();
    // if (this.oldUsr && this.oldUsr.user_id) {
    //   this.dataListSubs = this.dataSource.usersData
    //     .pipe(distinctUntilChanged())
    //     .subscribe((data) => {
    //       if (data.length <= 0) {
    //       } else {
    //         let index = data.findIndex(
    //           (item) => item.user_id === this.oldUsr.user_id
    //         );

    //         data.splice(index, 1, this.oldUsr);
    //         this.dataSource.changeDataSource(data);
    //       }
    //     });
    //   this.dataListSubs.unsubscribe();
    //   console.log(this.oldUsr, 'this.oldUsr', this.dataSource.usersData);
    // }
  }
}
