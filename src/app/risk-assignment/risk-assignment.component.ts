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
  dataShow_stocked;
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
    this.dataShow_stocked = this.data.data_stocked;
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
    console.log(risk , this.getLevel_code(risk.impact)-1, this.getLevel_code(risk.likelihood)-1 );
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
    if(risk.treatments != undefined){
    risk.treatments.forEach(treatment => {
      new_list.push(treatment);
    });
  }
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
      this.http.get(localStorage.getItem('server_url') + "/pias/" + this.pia_id + "/answers").subscribe(data => {
        //IMPACT
        var answer_321;
        var answer_331;
        var answer_341;
        //MENACE
        var answer_322;
        var answer_332;
        var answer_342;
        //SOURCE
        var answer_323;
        var answer_333;
        var answer_343;
        //mesures
        var answer_324;
        var answer_334;
        var answer_344;
        //gravite
        var answer_325;
        var answer_335;
        var answer_345;
        //vraisemblance
        var answer_326;
        var answer_336;
        var answer_346;
        for(let key in data){
          switch (data[key].reference_to){
            case "321" :
              answer_321 = data[key];
              break;
            case "331" :
              answer_331 = data[key];
              break;
            case "341" :
              answer_341 = data[key];
              break;

              case "322" :
                answer_322 = data[key];
                break;
              case "332" :
                answer_332 = data[key];
                break;
              case "342" :
                answer_342 = data[key];
                break;

                case "323" :
                  answer_323 = data[key];
                  break;
                case "333" :
                  answer_333 = data[key];
                  break;
                case "343" :
                  answer_343 = data[key];
                  break;

                  case "324" :
                    answer_324 = data[key];
                    break;
                  case "334" :
                    answer_334 = data[key];
                    break;
                  case "344" :
                    answer_344 = data[key];
                    break;

                    case "325" :
                      answer_325 = data[key];
                      break;
                    case "335" :
                      answer_335 = data[key];
                      break;
                    case "345" :
                      answer_345 = data[key];
                      break;

                      case "326" :
                        answer_326 = data[key];
                        break;
                      case "336" :
                        answer_336 = data[key];
                        break;
                      case "346" :
                        answer_346 = data[key];
                        break;
          }
        }
        if(this.listData[0][1].length != 0){
          this.send_all_answers(this.pia_id, "access",answer_321,answer_324,answer_323, answer_325, answer_326, this.listData[0][1] );
        }
        if(this.listData[1][1].length != 0){
          this.send_all_answers(this.pia_id, "modification",answer_331,answer_334,answer_333, answer_335, answer_336, this.listData[1][1] );
        }
        if(this.listData[2][1].length != 0){
          this.send_all_answers(this.pia_id, "deletion",answer_341,answer_344,answer_343, answer_335, answer_336, this.listData[2][1] );
        }
      this.get_list_treatment(this.listData[0][1]).forEach(element => {
        //this.sendPiaService.save_measure(this.pia_id, element );
      });
      this.get_list_treatment(this.listData[1][1]).forEach(element => {
        //this.sendPiaService.save_measure(this.pia_id, element );
      });
      this.get_list_treatment(this.listData[1][1]).forEach(element => {
        //this.sendPiaService.save_measure(this.pia_id, element );
      });
    });
  }
    });

  }

  send_all_answers(pia_id, type ,answer_impact, answer_measures, answer_sources, answer_impact_level, answer_likelihood_level, listData)
  {
    if(answer_impact == undefined){
      this.sendPiaService.save_answer(this.pia_id, this.getReference(type, "impact") , this.get_impact(listData), null );
    }
    else {
      if(answer_impact.data.list != undefined){
        this.sendPiaService.update_answer(this.pia_id, this.getReference(type, "impact"),  (answer_impact.data.list).concat(this.get_impact(listData)), null, answer_impact.id );
      }else{
        this.sendPiaService.update_answer(this.pia_id, this.getReference(type, "impact"),  this.get_impact(listData), null, answer_impact.id );
      }

    }

    if(answer_sources == undefined){
      this.sendPiaService.save_answer(this.pia_id, this.getReference(type, "source"), this.get_list_vulnerabilities(listData), null);
    }
    else {

      if(answer_sources.data.list != undefined){
        this.sendPiaService.update_answer(this.pia_id,this.getReference(type, "source"), (answer_sources.data.list).concat(this.get_list_vulnerabilities(listData)), null , answer_sources.id);
      }else{
        this.sendPiaService.update_answer(this.pia_id,this.getReference(type, "source"), this.get_list_vulnerabilities(listData), null , answer_sources.id);
      }

    }

    if(answer_measures == undefined){
      this.sendPiaService.save_answer(this.pia_id, this.getReference(type, "measure"), this.get_list_treatment(listData), null);
    }
    else {

      if(answer_measures.data.list != undefined){
        this.sendPiaService.update_answer(this.pia_id, this.getReference(type, "measure"), (answer_measures.data.list).concat(this.get_list_treatment(listData)), null, answer_measures.id);
      }else{
        this.sendPiaService.update_answer(this.pia_id, this.getReference(type, "measure"), this.get_list_treatment(listData), null, answer_measures.id);
      }


    }

    if(answer_impact_level == undefined){
      this.sendPiaService.save_answer(this.pia_id, this.getReference(type, "impact_level"), [] , this.get_max_level(listData)[0]);
    }
    else {
      this.sendPiaService.update_answer(this.pia_id, this.getReference(type, "impact_level"), [] , this.get_max_level(listData)[0], answer_impact_level.id);
    }

    if(answer_likelihood_level == undefined){
      this.sendPiaService.save_answer(this.pia_id, this.getReference(type, "likelihood_level"), [] , this.get_max_level(listData)[1]);
    }
    else {
      this.sendPiaService.update_answer(this.pia_id, this.getReference(type, "likelihood_level"), [] , this.get_max_level(listData)[1], answer_likelihood_level.id);
    }
    this.http.get(localStorage.getItem('server_url') + "/pias/" + this.pia_id + "/measures").subscribe(data => {
      var tab_measures = this.get_list_measures(data);
    this.get_list_treatment(listData).forEach(element => {
      //this.sendPiaService.save_measure(this.pia_id, element );
      if(tab_measures.includes(element) == false){
        this.sendPiaService.save_measure(this.pia_id, element );
      }
    });
  });
  }
  get_list_measures(list){
    var tab_measures = [];
    if(list != undefined){
      list.forEach(element => {
        tab_measures.push(element.title);
      });
    }
    return tab_measures;
    }

  }

