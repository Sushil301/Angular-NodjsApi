import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomerService } from '../customer.service';
import { Customer } from '../customer';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
// import { UserData } from '../demo-add-customer/demo-add-customer.component';
import { MatTableDataSource } from '@angular/material/table';
import { AddCustomerComponent } from '../add-customer/add-customer.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
})
export class CustomerComponent implements OnInit {
  editUsr: any;
  oldUsr: any;
  editdisabled: boolean;
  displayColumns = [
    'FullName',
    'MobileNumber',
    'Gender',
    'State',
    'City',
    'DOB',
    'username',
    'Actions',
  ];
  UserDetails: FormGroup;

  customers = [];
  gen = 'Female';
  State: String[] = ['Guj', 'MP', 'MH', 'UP'];
  City: String[] = ['Surat', 'Bardoli', 'Navsari', 'Chikhli'];
  dataSource = new MatTableDataSource();
  email_RegEx = '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}';
  MobileNumber_RegEx = '[6-9]\\d{9}';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  toastr: any;
  constructor(
    private customerService: CustomerService,
    private formBuilder: FormBuilder,
    private snackbar: MatSnackBar
  ) {}
  ngOnInit() {
    this.editUsr = {};
    this.getCustomers();
  }

  getCustomers() {
    return this.customerService.getCustomers().subscribe((customers: any) => {
      // this.setValues(customers['data']);
      // console.log(customers);
      this.customers = customers.data;
      this.dataSource = new MatTableDataSource(this.customers);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
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
          // alert('Updated!');
          let config = new MatSnackBarConfig();
          config.duration = 2000;
          this.snackbar.open(data.message, '', config);
        } else {
          this.cancelEdit();
          console.log(data.msg, 'Error!');
        }
      },
      (err) => {
        console.log(err);
        // this.toastr.error('Please try after some time', 'Error!');
        this.editdisabled = false;
        this.cancelEdit();
      }
    );
  }
  cancelEdit() {
    //cancel
    console.log('Cancel');
    this.editUsr = {};
    // window.location.reload();
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  delete(data): void {
    // this.submitted = true;
    // console.log(this.registerUser.value['id']);
    if (confirm('Are you sure you want to Delete?')) {
      // Save it!
      // this.flag = true;
      console.log(data.id);
      this.customerService.deleteCustomer(data.id).subscribe((data: any) => {
        // alert(data.message);
        let config = new MatSnackBarConfig();
        config.duration = 3000;
        this.snackbar.open(data.message, '', config);
        window.location.reload();
      });
    } else {
      // Do nothing!
      console.log('Thing was not saved to the database.');
    }
  }
}
