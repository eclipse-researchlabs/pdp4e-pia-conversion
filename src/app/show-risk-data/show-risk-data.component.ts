import { Component,Input, Inject, OnInit, Output, EventEmitter} from '@angular/core';
import { ConversionService } from '../services/conversion.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RmtService } from '../services/rmt.service';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';
export interface PeriodicElement {
  position : number;
  id : any;
  name_risk : string;
  description : string;
  asset : string;
  vulnerabilities : Array<string>;
  treatments : Array<string>;
  lindun : string;
  stride : string;
  likelihood : string;
  impact : string;
}
@Component({
  selector: 'app-show-risk-data',
  templateUrl: './show-risk-data.component.html',
  styleUrls: ['./show-risk-data.component.css']
})
export class ShowRiskDataComponent implements OnInit {
  @Input() data_risk;
  ELEMENT_DATA: PeriodicElement[] = [];
  risks=this.conversion.getPrivacyRisks(this.rmt.riskAnalyses[0]);
  risks_data ;
  list_access = [];
  list_modification = [];
  list_Deletion = [];
  @Output() lists_Event = new EventEmitter<any>();

  displayedColumns: string[] = ['risk_name', 'asset_name', 'linddun', 'stride', 'catagory'];
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
    this.risks_data = this.conversion.getPrivacyRisks1(this.data_risk);
    console.log(this.risks_data );
    var i = 0;
    this.risks_data.forEach(risk => {
      console.log(risk);
      var test : PeriodicElement = {
        position : i++,
        id : risk.id,
        name_risk : risk.name,
        description : risk.description,
        asset : risk.asset.name,
        vulnerabilities : this.get_vulnerabilities(risk.vulnerabilities),
        treatments : this.get_treatments(risk.treatments),
        lindun : risk.payload.lindun,
        stride : risk.payload.stride,
        likelihood : risk.payload.likelihood,
        impact : risk.payload.impact
      }
      this.ELEMENT_DATA.push(test);
    });
    console.log(this.ELEMENT_DATA);
  }

  get_vulnerabilities(vulnerabilities){
    var list_vulnerabilities  = [];
    vulnerabilities.forEach(vulnerabilitie => {
      list_vulnerabilities.push(vulnerabilitie.name);
    });
    return list_vulnerabilities;
  }
  get_treatments(treatments){
    var list_treatments  = [];
    treatments.forEach(treatment => {
      list_treatments.push(treatment.definition.name);
    });
    return list_treatments;
  }

}
