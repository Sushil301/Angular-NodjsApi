import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import { CustomerComponent } from './customer/customer.component';
import { DemoAddCustomerComponent } from './demo-add-customer/demo-add-customer.component';
import { EditDeleteMaterialTableComponent } from './edit-delete-material-table/edit-delete-material-table.component';
import { MaterialExamComponent } from './material-exam/material-exam.component';

const routes: Routes = [
  {
    path: 'customers',
    component: CustomerComponent,
  },
  {
    path: 'customer/add',
    component: AddCustomerComponent,
  },
  {
    path: 'customers/add',
    component: DemoAddCustomerComponent,
  },
  {
    path: 'customers/:id',
    component: CustomerDetailsComponent,
  },
  {
    path: 'material',
    component: MaterialExamComponent,
  },
  {
    path: 'materialTableDemo',
    component: EditDeleteMaterialTableComponent,
  },

  {
    path: '',
    redirectTo: 'customers',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
