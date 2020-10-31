// import { Component, OnInit } from '@angular/core';
import { Customer } from '../customer';
import { CustomerService } from '../customer.service';

import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface UserData {
  id: string;
  name: string;
  progress: string;
  color: string;
}

/** Constants used to fill up our data base. */
const COLORS: string[] = [
  'maroon',
  'red',
  'orange',
  'yellow',
  'olive',
  'green',
  'purple',
  'fuchsia',
  'lime',
  'teal',
  'aqua',
  'blue',
  'navy',
  'black',
  'gray',
];
const NAMES: string[] = [
  'Maia',
  'Asher',
  'Olivia',
  'Atticus',
  'Amelia',
  'Jack',
  'Charlotte',
  'Theodore',
  'Isla',
  'Oliver',
  'Isabella',
  'Jasper',
  'Cora',
  'Levi',
  'Violet',
  'Arthur',
  'Mia',
  'Thomas',
  'Elizabeth',
];

@Component({
  selector: 'app-demo-add-customer',
  templateUrl: './demo-add-customer.component.html',
  styleUrls: ['./demo-add-customer.component.css'],
})
export class DemoAddCustomerComponent implements OnInit {
  // customer = new Customer();
  // submitted = false;
  // registerUser: FormGroup;

  // constructor(
  //   private customerService: CustomerService,
  //   private location: Location,
  //   private formBuilder: FormBuilder
  // ) {}
  displayedColumns: string[] = ['id', 'name', 'progress', 'color'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor() {
    // Create 100 users
    const users = Array.from({ length: 100 }, (_, k) => createNewUser(k + 1));

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(users);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit() {
    // this.registerUser = this.formBuilder.group({
    //   FullName: ['', Validators.required],
    //   MobileNumber: [
    //     '',
    //     [
    //       Validators.required,
    //       Validators.min(0),
    //       Validators.maxLength(10),
    //       Validators.minLength(10),
    //     ],
    //   ],
    //   username: ['', [Validators.required, Validators.email]],
    //   password: ['', [Validators.required, Validators.minLength(6)]],
    // });
  }

  // get f() {
  //   return this.registerUser.controls;
  // }

  // newCustomer(): void {
  //   this.submitted = false;
  //   this.customer = new Customer();
  // }

  // addCustomer() {
  //   this.submitted = true;

  //   if (this.registerUser.invalid) {
  //     return;
  //   } else {
  //     this.save();
  //   }
  //   // alert("hello");
  // }

  // goBack(): void {
  //   this.location.back();
  // }

  // private save() {
  //   console.log(this.customer);
  //   this;
  //   this.customerService
  //     .adddemoCustomer(this.registerUser.value)
  //     .subscribe((res) => {
  //       console.log('Inserted' + res);
  //     });
  //   // alert('SUCCESS!! :-)')
  // }
}

/** Builds and returns a new User. */
function createNewUser(id: number): UserData {
  const name =
    NAMES[Math.round(Math.random() * (NAMES.length - 1))] +
    ' ' +
    NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) +
    '.';

  return {
    id: id.toString(),
    name: name,
    progress: Math.round(Math.random() * 100).toString(),
    color: COLORS[Math.round(Math.random() * (COLORS.length - 1))],
  };
}
