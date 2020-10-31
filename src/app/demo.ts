// import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
// import { Router } from "@angular/router";
// import { Title } from '@angular/platform-browser';
// import { StorageService } from '../../_services/storage.service';
// import { ContextMenuComponent, ContextMenuService } from 'ngx-contextmenu';
// import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
// import { AdminService } from 'src/app/_services/admin.service';
// import { ToastrService } from 'ngx-toastr';
// import { HandleErrors, ShowLoader, HideLoader, FormattedDateUTC } from 'src/app/_services/commonFunctions';
// import { NumericValidator, NumericDecimalValidator } from 'src/app/_services/validators.service';
// import { INgxMyDpOptions } from 'ngx-mydatepicker';
// declare var $: any;
// @Component({
//   selector: 'app-pl',
//   templateUrl: './pl.component.html'
// })
// export class PLComponent implements OnInit {
//   title = 'P & L - ARCHEZY';

//   company_id: number = 0;
//   user_id: number = 0;
//   user_type: number = 0;
//   bucket: string = "";

//   IncomeForm: FormGroup;
//   m_projects_list: any[] = []
//   projects_list: any[] = []
//   project_category_list: any[] = []
//   projectdropdownSettings = {}
//   projectCategorySettings = {}
//   PreviouslyUploadedImage: any = [];

//   myOptions: INgxMyDpOptions = {
//     dateFormat: 'dd.mm.yyyy',
//     focusInputOnDateSelect: false,
//     sunHighlight: true,
//     satHighlight: true
//   };



//   @ViewChild('basicMenu', { static: true }) public basicMenu: ContextMenuComponent;
//   constructor(private router: Router, private storageService: StorageService, private contextMenuService: ContextMenuService,
//     private formBuilder: FormBuilder, private adminService: AdminService, private toastrService: ToastrService,
//     private handleErrors: HandleErrors, private formattedDateUTC: FormattedDateUTC) {
//     this.user_id = this.storageService.getUserId();
//     this.company_id = this.storageService.getCompanyId();
//     this.bucket = this.storageService.getBucketName();
//     this.user_type = this.storageService.getUserType();

//     this.GetProjectList()
//     this.GetProjectCategoryList()

//   }

//   ngOnInit() {
//     this.InitForm()

//     this.projectdropdownSettings = {
//       singleSelection: true,
//       idField: 'site_id',
//       textField: 'site_title',
//       itemsShowLimit: 10,
//       allowSearchFilter: true
//     };
//     this.projectCategorySettings = {
//       singleSelection: true,
//       idField: 'project_category_id',
//       textField: 'title',
//       itemsShowLimit: 10,
//       allowSearchFilter: true
//     };
//   }

//   InitForm() {
//     this.IncomeForm = this.formBuilder.group({
//       'project_category_id': [null, [Validators.required]],
//       'project_id': [null, [Validators.required]],
//       'income_date': [null, [Validators.required]],
//       'amount': ['', [Validators.required, NumericDecimalValidator.numberdecimalFormat]],
//       'mode_of_payment': ['', [Validators.required]],
//       'remark': [''],
//     });

//     this.IncomeForm.get("project_category_id").valueChanges.subscribe(a => {
//       if (a && a.length) {
//         var project_category_id = parseInt(a[0].project_category_id);
//         this.projects_list = this.m_projects_list.filter(x => x.site_type == project_category_id);
//       }
//       else {
//         this.projects_list = [];
//       }
//     });
//   }

//   get inf() { return this.IncomeForm.controls; }


//   AddNewIncome() {
//     this.ResetForm();
//     $("#IncomeModal").modal({ backdrop: 'static', keyboard: false });

//   }

//   ResetForm() {
//     this.PreviouslyUploadedImage = []

//     if (this.IncomeForm) {
//       this.IncomeForm.reset();
//     }

//   }

//   GetProjectList() {
//     let payload = {
//       company_id: this.company_id
//     }
//     this.adminService.GetProjectListWithMembers(payload)
//       .subscribe((Data: any) => {
//         if (Data.res == "1" && Data.data && Data.data.length) {
//           this.m_projects_list = Data.data;
//           this.m_projects_list.forEach(element => {
//             element.site_title = element.site_code + " - " + element.title;
//           });

//         }
//       }, error => {
//         this.handleErrors.HandleError(<any>error, this.toastrService);
//       });
//   }

//   GetProjectCategoryList() {
//     var payload = {
//       company_id: this.company_id
//     }
//     this.adminService.getProjectCategoryList(payload)
//       .subscribe((Data: any) => {
//         if (Data.res == "1" && Data.data) {
//           this.project_category_list = Data.data;
//           this.project_category_list = this.project_category_list.filter(x => x.is_active == 1)
//         }

//       }, error => {
//         this.handleErrors.HandleError(<any>error, this.toastrService);
//       });
//   }

//   onChangeProjectCategory() {

//   }

//   openFormMenu($event: KeyboardEvent) {

//     this.contextMenuService.show.next({
//       anchorElement: $event.target,
//       contextMenu: this.basicMenu,
//       event: <any>$event,
//       item: null, // used for actions like rename/delete/move to etc
//     });
//     $event.preventDefault();
//     $event.stopPropagation();
//   }


//   SaveIncomeDetails() {
//     if (this.IncomeForm.valid) {

//       let payload = {
//         ...this.IncomeForm.value,
//         date: this.formattedDateUTC.getFormattedDate(this.IncomeForm.value.meeting_date),
//         added_by: this.user_id,
//       }

//       ShowLoader()
//       this.adminService.SaveSitesMOM(payload).subscribe((Data: any) => {
//         if (Data.res == "1") {
//           $("#AddNew").modal('hide')
//           this.toastrService.success(Data.msg);
//           this.ResetForm();

//         }
//         else {
//           this.toastrService.error(Data.msg);
//         }
//         HideLoader()
//       }, error => {
//         this.handleErrors.HandleError(<any>error, this.toastrService);
//       });
//     }
//     else if (!this.PreviouslyUploadedImage.length) {
//         this.toastrService.error('Please select at least one document to upload.');
//     }
//     else {
//       Object.keys(this.IncomeForm.controls).forEach(key => {
//         this.markControlDirty(this.IncomeForm.get(key) as FormControl);
//       });
//       this.toastrService.error('Please fill all the details properly.');
//     }
//   }
//   markControlDirty(formControl: FormControl) {
//     formControl.markAsDirty();
//   }
// }
