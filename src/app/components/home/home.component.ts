import { Component, OnInit, ViewChild } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { PatronService } from '../../services/patron/patron.service';
import { SignatureDialogComponent } from '../signature-dialog/signature-dialog.component';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ],
})
export class HomeComponent implements OnInit {
  private subscriptions = new Subscription();
  public testDate = new Date();
  public columnsToDisplay : string[] = ['name', 'address', 'signForVisit', 'edit', 'delete'];
  expandedElement: any | null;
  public patrons: MatTableDataSource<any>;

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private router: Router,
    private patronService: PatronService, 
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.subscriptions.add(this.patronService.get().subscribe(x => {
      this.patrons = new MatTableDataSource(x);
      this.patrons.sortingDataAccessor = (item, property) => {
        const p = item.personal;
        switch(property) {
          case 'name': return p.name;
          case 'address': return `${p.address} ${p.city} ${p.state} ${p.zip}`;
          default: return item[property];
        }
      };
      this.patrons.filterPredicate = (item, filterValue: string) => {
        const lowerCaseObjString = JSON.stringify(_.values(item.personal)).toLowerCase();
        const searchWords = _.words(filterValue, /[^, ]+/g).map(x => x.toLowerCase());
        return searchWords.filter(word => _.includes(lowerCaseObjString, word)).length;
      }
      this.patrons.sort = this.sort;
    }));
    this.patrons.sort = this.sort;
  }

  ngOnDestroy(){
    if(this.subscriptions){
      this.subscriptions.unsubscribe();
    }
  }

  openSignatureDialog(patron){
    const dialogRef = this.dialog.open(SignatureDialogComponent);
    this.subscriptions.add(dialogRef.afterClosed().subscribe(signature => {
      if(signature){
        const date = Date.now();
        this.patronService.addVisit(patron, {signature, date})
      }
    }));
  }

  openDeleteDialog(patron){
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: { patron: patron.personal.name }
    });
    this.subscriptions.add(dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.patronService.delete(patron);
      }
    }));
  }

  navigateToPatronPage(patron){
    this.router.navigate(['/patron'], {queryParams: {id: patron._id}});
  }

  applyFilter(filterValue: string) {
    this.patrons.filter = filterValue.trim().toLowerCase();
  }
}
