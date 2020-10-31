import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { FormControl, Validators } from '@angular/forms';
import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete,
} from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface UserData {
  id: string;
  name: string;
  progress: string;
  color: string;
}

export interface PeriodicElement {
  name_table: string;
  position: number;
  weight: number;
  symbol: string;
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
const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name_table: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name_table: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name_table: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name_table: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name_table: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name_table: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name_table: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name_table: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name_table: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name_table: 'Neon', weight: 20.1797, symbol: 'Ne' },
  { position: 11, name_table: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 12, name_table: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 13, name_table: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 14, name_table: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 15, name_table: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 16, name_table: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 17, name_table: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 18, name_table: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 19, name_table: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 20, name_table: 'Neon', weight: 20.1797, symbol: 'Ne' },
  { position: 21, name_table: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 22, name_table: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 23, name_table: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 24, name_table: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 25, name_table: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 26, name_table: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

@Component({
  selector: 'app-material-exam',
  templateUrl: './material-exam.component.html',
  styleUrls: ['./material-exam.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class MaterialExamComponent implements OnInit {
  // displayedColumnss: string[] = ['position', 'name', 'weight', 'symbol'];
  // dataSources = ELEMENT_DATA;
  editUsr: any;
  oldUsr: any;
  editdisabled: boolean;
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;
  disabled = false;
  step = 0;

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  fruits: string[] = ['Lemon'];
  allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];

  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  displayedColumns: string[] = ['id', 'name', 'progress', 'color'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public dialog: MatDialog) {
    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) =>
        fruit ? this._filter(fruit) : this.allFruits.slice()
      )
    );

    const users = Array.from({ length: 100 }, (_, k) => createNewUser(k + 1));

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(users);
  }
  ngOnInit(): void {
    // this.filteredOptions = this.myControl.valueChanges.pipe(
    //   startWith(''),
    //   map((value) => this._filter1(value))
    // );
  }
  // private _filter1(value: string): string[] {
  //   const filterValue = value.toLowerCase();

  //   return this.options.filter((option) =>
  //     option.toLowerCase().includes(filterValue)
  //   );
  // }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.fruits.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.fruitCtrl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.fruits.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter(
      (fruit) => fruit.toLowerCase().indexOf(filterValue) === 0
    );
  }

  // dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
  //   // Only highligh dates inside the month view.
  //   if (view === 'month') {
  //     const date = cellDate.getDate();

  //     // Highlight the 1st and 20th day of each month.
  //     return date === 1 || date === 20 ? 'example-custom-date-class' : 'Event';
  //   }

  //   return '';
  // };
  //   openDialog() {
  //     const dialogRef = this.dialog.open(DialogContentExampleDialog);

  //     dialogRef.afterClosed().subscribe((result) => {
  //       console.log(`Dialog result: ${result}`);
  //     });
  //   }
  panelOpenState = false;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  email = new FormControl('', [Validators.required, Validators.email]);

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  // openSnackBar() {
  //   this._snackBar.open('Cannonball!!', 'End now', {
  //     duration: 500,
  //     horizontalPosition: this.horizontalPosition,
  //     verticalPosition: this.verticalPosition,
  //   });
  // }

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
