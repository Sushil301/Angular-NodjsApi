import { Component, OnInit } from '@angular/core';
import { Customer } from '../customer';
import { CustomerService } from '../customer.service';

import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css'],
})
export class CustomerDetailsComponent implements OnInit {
  customer;
  submitted = false;
  flag = false;
  message: string;
  UserDetails: FormGroup;
  email_RegEx = '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}';
  MobileNumber_RegEx = '[6-9]\\d{9}';

  constructor(
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private location: Location,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.flag = false;
    this.customerService
      .getCustomer(id)
      .subscribe(
        (customer: any) => (
          console.log(customer.data),
          this.setValues(customer['data']),
          (this.customer = customer['data'])
        )
      );
  }

  setValues(data) {
    this.UserDetails = this.formBuilder.group({
      id: [data.id],

      FullName: [data.FullName, Validators.required],
      MobileNumber: [
        data.MobileNumber,
        [
          Validators.required,
          Validators.min(0),
          Validators.pattern(this.MobileNumber_RegEx),
        ],
      ],
      username: [
        data.username,
        [
          Validators.required,
          Validators.email,
          Validators.pattern(this.email_RegEx),
        ],
      ],
      password: [data.password, [Validators.required, Validators.minLength(6)]],
    });
  }
  get f() {
    return this.UserDetails.controls;
  }
  update(): void {
    this.submitted = true;
    // console.log(this.registerUser.value);
    this.flag = true;
    this.customerService
      .updateCustomer(this.UserDetails.value)
      .subscribe(
        (data: any) => (console.log(data), (this.message = data.message))
      );
  }

  delete(): void {
    this.submitted = true;
    // console.log(this.registerUser.value['id']);
    if (confirm('Are you sure you want to Delete?')) {
      // Save it!
      this.flag = true;
      this.customerService
        .deleteCustomer(this.UserDetails.value['id'])
        .subscribe((data: any) => (this.message = data.message));
    } else {
      // Do nothing!
      console.log('Thing was not saved to the database.');
    }
  }

  goBack(): void {
    this.location.back();
  }
}
