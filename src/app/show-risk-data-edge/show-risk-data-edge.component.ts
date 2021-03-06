/*******************************************************************************
 * Copyright (C) 2021 TRIALOG
 * 
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 * 
 * SPDX-License-Identifier: EPL-2.0
 ******************************************************************************/

import { Component,Input, Inject, OnInit, Output, EventEmitter} from '@angular/core';
import { ConversionService } from '../services/conversion.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RmtService } from '../services/rmt.service';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';
import { reduce } from 'rxjs/operators';
export interface PeriodicElement {
  position : number;
  id : any;
  name_risk : string;
  description : string;
  source_asset : string;
  target_asset : string;
  vulnerabilities : Array<string>;
  treatments : Array<string>;
  lindun : string;
  stride : string;
  likelihood : string;
  impact : string;
}
@Component({
  selector: 'app-show-risk-data-edge',
  templateUrl: './show-risk-data-edge.component.html',
  styleUrls: ['./show-risk-data-edge.component.css']
})
export class ShowRiskDataEdgeComponent implements OnInit {
  @Input() data_risk;
  @Input() type = "";
  addNew = "addNew";
  ELEMENT_DATA: PeriodicElement[] = [];
  EDGE_ELEMENT_DATA: PeriodicElement[] = [];
  //risks=this.conversion.getPrivacyRisks(this.rmt.riskAnalyses[0]);
  risks_data ;
  list_access = [];
  list_modification = [];
  list_Deletion = [];
  @Output() lists_Event = new EventEmitter<any>();

  displayedColumns: string[] = ['risk_name', 'source_asset_name', 'target_asset_name', 'linddun', 'stride', 'catagory'];
  dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);
   /** Whether the number of selected elements matches the total number of rows. */
   isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  edgeDisplayedColumns: string[] = ['risk_name', 'asset_name', 'linddun', 'stride', 'catagory'];
  edgeDataSource = new MatTableDataSource<PeriodicElement>(this.EDGE_ELEMENT_DATA);
  edgeSelection = new SelectionModel<PeriodicElement>(true, []);
   /** Whether the number of selected elements matches the total number of rows. */
   edgeIsAllSelected() {
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
    private conversion: ConversionService,
    private rmt: RmtService
  ) {
  }
  setCategory(event: Event, risk){
    //Access','Modification','Deletion
    if(event.toString() ==  "Access"){
      this.list_access.push(risk);
      this.list_modification = this.deleteCategory(this.list_modification , risk);
      this.list_Deletion = this.deleteCategory(this.list_Deletion , risk);
    }
    else if(event.toString() ==  "Modification"){
      this.list_modification.push(risk);
      this.list_access = this.deleteCategory(this.list_access , risk);
      this.list_Deletion = this.deleteCategory(this.list_Deletion , risk);
    }
    else if(event.toString() ==  "Deletion"){
      this.list_Deletion.push(risk);
      this.list_access = this.deleteCategory(this.list_access , risk);
      this.list_modification = this.deleteCategory(this.list_modification , risk);
    }
    var all_lists = [];
    all_lists.push(["acces", this.list_access]);
    all_lists.push(["modification", this.list_modification]);
    all_lists.push(["deletion", this.list_Deletion]);
    this.lists_Event.emit(all_lists);
  }
  deleteCategory(list, risk){
    var new_list = [];
   list.forEach(element => {
      if(element.id == risk.id){
        console.log("here");
      }
      else{
        new_list.push(element);
      }
    });
    return new_list;
  }


  ngOnInit(): void {
    this.risks_data = this.conversion.getPrivacyRisksEdges(this.data_risk);
    console.log(this.risks_data );
    var i = 0;
    //Add data from nodes
    this.risks_data.forEach(risk => {
      console.log(risk);
      let description;
      if(this.type == "addNew")
      {description == undefined;}
      else {
        description = risk.description;
      }
      let test : PeriodicElement = {
        position : i++,
        id : risk.id,
        name_risk : risk.name,
        description : description,
        source_asset : risk.edge.from,
        target_asset : risk.edge.to,
        vulnerabilities : this.get_vulnerabilities(risk.vulnerabilities),
        treatments : this.get_treatments(risk.treatments),
        lindun : risk.payload.lindun,
        stride : risk.payload.stride,
        likelihood : risk.payload.likelihood,
        impact : risk.payload.impact
      }
      console.log(this.type);


        this.ELEMENT_DATA.push(test);

    });
    console.log(this.ELEMENT_DATA);
  }

  get_vulnerabilities(vulnerabilities){
    var list_vulnerabilities  = [];
    if (vulnerabilities != undefined){
      vulnerabilities.forEach(vulnerabilitie => {
        list_vulnerabilities.push(vulnerabilitie.name);
      });
    }
    return list_vulnerabilities;
  }
  get_treatments(treatments){
    var list_treatments  = [];
    if (treatments != undefined){
    treatments.forEach(treatment => {
      list_treatments.push(treatment.definition.name);
    });
  }
    return list_treatments;
  }
  getbackgroundColor(element){
    if(element.description != undefined){
      return "#DCDCDC";
    }
  }

}
