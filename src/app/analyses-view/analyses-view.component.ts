/*******************************************************************************
 * Copyright (C) 2021 TRIALOG
 * 
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 * 
 * SPDX-License-Identifier: EPL-2.0
 ******************************************************************************/

import { Component, Inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PiaService } from '../services/pia.service';
import { RmtService } from '../services/rmt.service';
import { RiskAssignmentComponent } from '../risk-assignment/risk-assignment.component';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import {DialogNewPiaComponent} from '../dialog-new-pia/dialog-new-pia.component'

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
  data = require('../../assets/data/data_pdp4e.json');
  cards ;
  i =0;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog,
    private pia: PiaService,
    private rmt: RmtService
  ) {
    this.cards = this.data.containers;
  }

  openNewPiaDialog(card)
  {
    const dialogConfig = new MatDialogConfig();
    //dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "100%";
    dialogConfig.data = { data:card };
   const dialogRef =  this.dialog.open(DialogNewPiaComponent,dialogConfig);
   dialogRef.afterClosed().subscribe(result => r => {
     console.log(r);
     if(r)
     {
       //TODO: validation, check if a pia with the same name exists ?
       //this.pia.addPia(r.pia, r.author, r.evaluator, r.validator);
     }
   }
 );
  }

  openAssignment(card){
    const dialogConfig = new MatDialogConfig();
     //dialogConfig.disableClose = true;
     dialogConfig.autoFocus = true;
     dialogConfig.width = "100%";
     dialogConfig.data = { data:card};
    const dialogRef =  this.dialog.open(RiskAssignmentComponent,dialogConfig);
    dialogRef.afterClosed().subscribe(result => r => {
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
