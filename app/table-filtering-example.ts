import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { COMMA, TAB, SPACE, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';
import { FormControl } from '@angular/forms';


export interface PeriodicElement {
  name: string;
  id: number;
  weight: number;
  symbol: string;
}

export interface SearchItem {
  name: string;
}


const ELEMENT_DATA: PeriodicElement[] = [
  { id: 999, name: 'test', weight: 1.0079, symbol: 'H' },
  { id: 0, name: '999', weight: 1.0079, symbol: 'H' },
  { id: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { id: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { id: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { id: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { id: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { id: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { id: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { id: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { id: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { id: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

/**
 * @title Table with filtering
 */
@Component({
  selector: 'table-filtering-example',
  styleUrls: ['table-filtering-example.css'],
  templateUrl: 'table-filtering-example.html',
})
export class TableFilteringExample implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  positionFilter = new FormControl();
  nameFilter = new FormControl();
  private filterValues = { id: '', name: '' }

  filteredValues = {
    position: '', name: '', weight: '',
    symbol: '', topFilter: false
  };

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [COMMA, TAB, ENTER];
  searchItems: SearchItem[] = [];

  ngOnInit() {

    this.positionFilter.valueChanges.subscribe((positionFilterValue) => {
      console.log(positionFilterValue);

      this.filteredValues['position'] = positionFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.filteredValues['topFilter'] = false;
    });


    this.nameFilter.valueChanges
      .subscribe(value => {
        this.filterValues['name'] = value
        this.dataSource.filter = JSON.stringify(this.filterValues)
      });
    this.dataSource.filterPredicate = this.createFilter();
  }

    add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    console.log('event', event);

    // Add our fruit
    if ((value || '').trim()) {
      this.searchItems.push({name: value.trim()});
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(item: SearchItem): void {
    const index = this.searchItems.indexOf(item);

    if (index >= 0) {
      this.searchItems.splice(index, 1);
    }
  }


  applyFilter(filterValue: string) {
    let filter = {
      name: filterValue.trim().toLowerCase(),
      position: filterValue.trim().toLowerCase(),
      topFilter: true
    }
    this.dataSource.filter = JSON.stringify(filter)
  }

  createFilter() {
    let filterFunction = function (data: any, filter: string): boolean {
      let searchTerms = JSON.parse(filter)
      let idSearch = data.id.toString().indexOf(searchTerms.id) != -1
      let nameSearch = () => {
        let found = false;
        searchTerms.name.trim().toLowerCase().split(' ').forEach(word => {
          if (data.name.toLowerCase().indexOf(word) != -1) { found = true }
        });
        return found
      }
      return idSearch && nameSearch()
    }
    return filterFunction
  }
}


/**  Copyright 2018 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */