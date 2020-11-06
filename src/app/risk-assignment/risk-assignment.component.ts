import { Component, Inject, OnInit } from '@angular/core';
import { ConversionService } from '../services/conversion.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RmtService } from '../services/rmt.service';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import {SendPiaService} from '../services/send-pia.service';
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
  dataShow;
  listData;
  matrix_risk: number[][] = [[1,2,3],[1,2,2],[1,1,1]];
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
  pia_id;
  arr = new Array();
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
    private http: HttpClient,
    private sendPiaService : SendPiaService,
    public dialogRef: MatDialogRef<RiskAssignmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private conversion: ConversionService,
    private rmt: RmtService
  ) {

  }

  ngOnInit(): void {
    console.log(this.data);
    //console.log(this.risksData);
    var testArray = [];
    var risktab = [];
    this.pia_id = this.data.piaId;
    this.dataShow = this.data.data;
    var array = [];
    var i = 0;
    this.risks_data.forEach(risk => {
      var ok = true;
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

  //Define the different fields of each category from list of all risks(filter by category)
  set_category(lists : any){
    this.listData = lists;
  }

  close() {
    this.dialogRef.close({ event: 'close'});
  }

  add()
  {
    console.log("add a row");
    this.risks.push({name: 'risk push'});
  }
  /* get reference of question from type of risks (access, modification, deletion) and type of answer (impact, measures,..) */

/* get all impacts from list of risks */

get_impact(list){
  var impacts = [];
  list.forEach(risk => {
    impacts.push(risk.name_risk);
  });
  return impacts;
}

 /* get reference of question from type of risks (access, modification, deletion) and type of answer (impact, measures,..) */

getReference(risk_type, answer_type){
  var code ;
  if(risk_type == "access" || risk_type == "modification" || risk_type == "deletion"){
    code = 3 *100;
  }
  switch (risk_type){
    case "access" :
      code = code + 2*10;
      break;
    case "modification" :
      code = code + 3*10;
      break;
    case "deletion" :
      code = code + 4*10;
      break;
  }
  switch (answer_type){
    case "impact" :
      code = code + 1;
      break;
    case "menace" :
      code = code + 2;
      break;
    case "source" :
      code = code + 3;
      break;
    case "measure" :
      code = code + 4;
      break;
    case "impact_level" :
        code = code + 5;
        break;
    case "likelihood_level" :
        code = code + 6;
        break;
  }
  return code;
}

/* get the level code (1, 2, 3) from level (maximal, medium, low) */
getLevel_code(level){
  switch (level){
    case "maximal" :
      return 3
      break;
    case "medium" :
      return 2
      break;
    case "low" :
      return 1
      break;
  }
}

/* get the biggest level from list of risks */
get_max_level(list)
{ var max_level = 0;
  var riskMaxLevels = [0,0];
  list.forEach(risk => {
    var risk_level = this.matrix_risk[this.getLevel_code(risk.impact)-1][this.getLevel_code(risk.likelihood)-1];
    if(max_level < risk_level){
      max_level = risk_level;
      riskMaxLevels = [this.getLevel_code(risk.impact)+1, this.getLevel_code(risk.likelihood)+1];
    }
  });
  return riskMaxLevels;
}

 /* get the biggest level from list of risks */
get_list_treatment(list){
  console.log(list);
  //to do get list all treatments
  var new_list = [];
  list.forEach(risk => {
    risk.treatments.forEach(treatment => {
      new_list.push(treatment);
    });
  });
  return new_list;
}

/* get list of vulnerabilities from list of risks */
get_list_vulnerabilities(list){
  //to do get list all vulnerabilities
  var new_list = [];
  list.forEach(risk => {
    risk.vulnerabilities.forEach(vulnerabilitie => {
      new_list.push(vulnerabilitie);
    });
  });
  return new_list;
}



async save_changes(){
    return new Promise((resolve, reject) => {
        if(this.listData != undefined){
        //impact
      this.sendPiaService.save_answer(this.pia_id, this.getReference("access", "impact") , this.get_impact(this.listData[0][1]), null );
      this.sendPiaService.save_answer(this.pia_id, this.getReference("modification", "impact"), this.get_impact(this.listData[1][1]), null);
      this.sendPiaService.save_answer(this.pia_id, this.getReference("deletion", "impact"), this.get_impact(this.listData[2][1]), null);
      //measures
      this.sendPiaService.save_answer(this.pia_id, this.getReference("access", "measure"), this.get_list_treatment(this.listData[0][1]), null);
      this.sendPiaService.save_answer(this.pia_id, this.getReference("modification", "measure"), this.get_list_treatment(this.listData[1][1]), null);
      this.sendPiaService.save_answer(this.pia_id, this.getReference("deletion", "measure"), this.get_list_treatment(this.listData[2][1]), null);
      //sources
      this.sendPiaService.save_answer(this.pia_id,this.getReference("access", "source"), this.get_list_vulnerabilities(this.listData[0][1]), null);
      this.sendPiaService.save_answer(this.pia_id,this.getReference("modification", "source"), this.get_list_vulnerabilities(this.listData[1][1]), null);
      this.sendPiaService.save_answer(this.pia_id, this.getReference("deletion", "source"), this.get_list_vulnerabilities(this.listData[2][1]), null);
      //gravite
      this.sendPiaService.save_answer(this.pia_id, this.getReference("access", "impact_level"), [] , this.get_max_level(this.listData[0][1])[0]);
      this.sendPiaService.save_answer(this.pia_id, this.getReference("modification", "impact_level"), [] , this.get_max_level(this.listData[1][1])[0]);
      this.sendPiaService.save_answer(this.pia_id, this.getReference("deletion", "impact_level"), [] , this.get_max_level(this.listData[2][1])[0]);

      //vraisemblance
      this.sendPiaService.save_answer(this.pia_id, this.getReference("access", "likelihood_level"), [] , this.get_max_level(this.listData[0][1])[1]);
      this.sendPiaService.save_answer(this.pia_id, this.getReference("modification", "likelihood_level"), [] , this.get_max_level(this.listData[1][1])[1]);
      this.sendPiaService.save_answer(this.pia_id, this.getReference("deletion", "likelihood_level"), [] , this.get_max_level(this.listData[2][1])[1]);
      this.get_list_treatment(this.listData[0][1]).forEach(element => {
        this.sendPiaService.save_measure(this.pia_id, element );
      });
      this.get_list_treatment(this.listData[1][1]).forEach(element => {
        this.sendPiaService.save_measure(this.pia_id, element );
      });
      this.get_list_treatment(this.listData[1][1]).forEach(element => {
        this.sendPiaService.save_measure(this.pia_id, element );
      });
    }

    });

  }
  }

