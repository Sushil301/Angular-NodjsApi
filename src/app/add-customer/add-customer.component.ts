import { Component, OnInit } from '@angular/core';
import { Customer } from '../customer';
import { CustomerService } from '../customer.service';
import { formatDate } from '@angular/common';
import { Location } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

interface State {
  name: string;
}
interface City {
  name: string;
}
@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.css'],
})
export class AddCustomerComponent implements OnInit {
  customer;
  submitted = false;
  registerUser: FormGroup;
  flag = false;
  email_RegEx = '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}';
  MobileNumber_RegEx = '[6-9]\\d{9}';
  step = 0;
  State: String[] = ['Guj', 'MP', 'MH', 'UP'];

  City: City[] = [
    { name: 'Surat' },
    { name: 'Bardoli' },
    { name: 'Navsari' },
    { name: 'Chikhli' },
  ];
  constructor(
    private customerService: CustomerService,
    private location: Location,
    private formBuilder: FormBuilder,
    private router: Router,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    const d = new Date();
    this.registerUser = this.formBuilder.group({
      FullName: ['', Validators.required],
      MobileNumber: [
        '',
        [
          Validators.required,
          Validators.min(0),
          // Validators.minLength(10),
          // Validators.maxLength(10),

          Validators.pattern(this.MobileNumber_RegEx),
        ],
      ],
      Gender: ['', Validators.required],
      City: ['', Validators.required],
      State: ['', Validators.required],
      DOB: ['', Validators.required],
      username: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(this.email_RegEx),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get f() {
    return this.registerUser.controls;
  }

  newCustomer(): void {
    this.submitted = false;
    this.customer = null;
    this.flag = false;
    this.step = 0;
  }

  onSubmit() {
    this.submitted = true;

    if (this.registerUser.invalid) {
      alert('Invalid');
      return;
    } else {
      // alert('valid');

      this.save();
    }
  }

  goBack(): void {
    this.location.back();
  }

  private save() {
    // console.log('Data : ', this.registerUser.value['State']);
    this.customerService
      .addCustomer(this.registerUser.value)
      .subscribe((res: any) => {
        let config = new MatSnackBarConfig();
        config.duration = 2000;
        this.snackbar.open(res.message, '', config);
        this.router.navigate(['customers']);
        this.flag = true;
      });
  }
  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
}
