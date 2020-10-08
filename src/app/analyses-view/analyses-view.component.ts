import { Component, Inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PiaService } from '../services/pia.service';
import { RmtService } from '../services/rmt.service';
import { RiskAssignmentComponent } from '../risk-assignment/risk-assignment.component';

export interface PiaData {
  pia: string,
  author: string,
  evaluator: string,
  validator: string
}

@Component({
  selector: 'app-analyses-view',
  templateUrl: './analyses-view.component.html',
  styleUrls: ['./analyses-view.component.css']
})
export class AnalysesViewComponent {
  /** Based on the screen size, switch from standard to one column per row */
  //Replace with something like raService.getRaList()
  cards = [
          { title: 'Card 1', cols: 1, rows: 1 },
          { title: 'Card 2', cols: 1, rows: 1 },
          { title: 'Card 3', cols: 1, rows: 1 },
          { title: 'Card 4', cols: 1, rows: 1 }
  ];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog,
    private pia: PiaService,
    private rmt: RmtService
  ) {}

  openNewPiaDialog()
  {
    this.dialog.open(DialogNewPia)
    .afterClosed().subscribe(
      r => {
        console.log(r);
        if(r)
        {
          //TODO: validation, check if a pia with the same name exists ?
          //this.pia.addPia(r.pia, r.author, r.evaluator, r.validator);
        }
      }
    );
  }

  openAssignment(){
    this.dialog.open(RiskAssignmentComponent, {data:'RA id'})
    .afterClosed().subscribe(
      r => {
        console.log(r);
        if(r)
        {
          //TODO: validation, check if a pia with the same name exists ?
          //this.pia.addPia(r.pia, r.author, r.evaluator, r.validator);
        }
      }
    );
  }
}

@Component({
  selector: 'dialog-new-pia',
  templateUrl: './dialog-new-pia.html'
})
export class DialogNewPia {

  constructor(
      public dialog: MatDialogRef<DialogNewPia>
  ) {}
}