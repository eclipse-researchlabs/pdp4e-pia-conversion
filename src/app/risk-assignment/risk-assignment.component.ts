/*******************************************************************************
 * Copyright (C) 2021 TRIALOG
 * 
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 * 
 * SPDX-License-Identifier: EPL-2.0
 ******************************************************************************/

import { Component, Inject, OnInit } from '@angular/core';
import { ConversionService } from '../services/conversion.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RmtService } from '../services/rmt.service';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';
export interface PeriodicElement {
  position : number;
  id : any;
  name_risk : string;
  asset : string;
  lindun : string;
  stride : string;
}

@Component({
  selector: 'app-risk-assignment',
  templateUrl: './risk-assignment.component.html',
  styleUrls: ['./risk-assignment.component.css']
})
export class RiskAssignmentComponent implements OnInit{
  ELEMENT_DATA: PeriodicElement[] = [];
  risks=this.conversion.getPrivacyRisks(this.rmt.riskAnalyses[0]);
  risks_data = this.conversion.getPrivacyRisks1(this.rmt.riskData);
  //risksData = this.conversion.getPrivacyRisks2(this.rmt.riskData.assets[0]);
  //risks=this.conversion.getPrivacyRisks(this.rmt.riskAnalyses1);
  //risks=[
  //  {name: 'risk1'},
  //  {name: 'risk2'}
  //];
  displayedColumns: string[] = ['select', 'position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

   /** The label for the checkbox on the passed row */
   checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
  constructor(
    public dialogRef: MatDialogRef<RiskAssignmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private conversion: ConversionService,
    private rmt: RmtService
  ) {
    this.data = this.data.data;
    var i = 0;
    this.risks_data.forEach(risk => {
      var test : PeriodicElement = {
        position : i++,
        id : risk.id,
        name_risk : risk.name,
        asset : risk.asset.name,
        lindun : risk.payload.lindun,
        stride : risk.payload.stride
      }
      this.ELEMENT_DATA.push(test);
    });
  }

  ngOnInit(): void {
    //console.log(this.risksData);

  }

  close() {
    this.dialogRef.close({ event: 'close'});
  }

  add()
  {
    console.log("add a row");
    this.risks.push({name: 'risk push'});
  }
}
