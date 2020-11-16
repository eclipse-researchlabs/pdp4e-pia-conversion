import { Component,Input,Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { HttpClient } from '@angular/common/http';
import {PiaService} from '../services/pia.service';
import {SendPiaService} from '../services/send-pia.service';
import {ImportService} from '../services/import.service';
export interface answer {
  pia_id : any;
  reference_to : number;
  data : Array<any>;
  list : Array<string>;
}
@Component({
  selector: 'app-dialog-new-pia',
  templateUrl: './dialog-new-pia.component.html',
  styleUrls: ['./dialog-new-pia.component.css'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false, showError: true}
  }]
})
export class DialogNewPiaComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  answer_impact_acces : answer;
  answer_impact_modification : answer;
  listData : any;
  answer_impact_deletion : answer;
  addNew = "addNew";
  //answers = [];
  //measures = [];
  matrix_risk: number[][] = [[1,2,3],[1,2,2],[1,1,1]];
  constructor(private _formBuilder: FormBuilder,
    private http: HttpClient,
    private PiaService: PiaService,
    private sendPiaService : SendPiaService,
    private importService : ImportService,
    public dialogRef: MatDialogRef<DialogNewPiaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.data = this.data.data;
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl1: ['', Validators.required],
      firstCtrl2: ['', Validators.required],
      firstCtrl3: ['', Validators.required],
      firstCtrl4: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }
  close() {
    this.dialogRef.close({ event: 'close'});
  }
  //save PIA in file JSON
  save_pia(){
    if(this.firstFormGroup.value.firstCtrl1!="" &&this.firstFormGroup.value.firstCtrl2!="" && this.firstFormGroup.value.firstCtrl3 != "" && this.firstFormGroup.value.firstCtrl4  != "")
    {
    var myJson = {
      "pia": {
        "dbVersion": 201910230914,
        "tableName": "pia",
        "serverUrl": null,
        "status": 0,
        "is_example": 0,
        "is_archive": 0,
        "created_at": new Date(),
        "objectStore": {},
        "name": this.firstFormGroup.value.firstCtrl1,
        "category": "",
        "author_name": this.firstFormGroup.value.firstCtrl2,
        "evaluator_name": this.firstFormGroup.value.firstCtrl3,
        "validator_name": this.firstFormGroup.value.firstCtrl4,
        "updated_at": new Date(),
        "structure_id": "",
        "structure_data": "",
        "progress": 0
      },
      "answers": this.importService.answers,
      "measures": this.importService.measures,
      "evaluations": [],
      "comments": []
    };
    //this.PiaService.addPia(this.firstFormGroup.value.firstCtrl1,this.firstFormGroup.value.firstCtrl2, this.firstFormGroup.value.firstCtrl3, this.firstFormGroup.value.firstCtrl4  );
    if(localStorage.getItem('server_url') != ""){
    this.saveNewPia();
    }
    var sJson = JSON.stringify(myJson);
      var element = document.createElement('a');
      element.setAttribute('href', "data:text/json;charset=UTF-8," + encodeURIComponent(sJson));
      element.setAttribute('download', "primer-server-task.json");
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click(); // simulate click
      document.body.removeChild(element);
    }
  }

  //Define the different fields of each category from list of all risks(filter by category)
  set_category(lists : any){
    this.listData = lists;
    this.importService.answers = [];

    /**
     * NAME OF RISKS => IMPACT
     * create an answer (impact) for each risk (access, modification, deletion) : from reference of question, list of impact, gauge
     */

    this.importService.create_answers(this.getReference("access", "impact"), this.get_impact(lists[0][1]), null);
    this.importService.create_answers(this.getReference("modification", "impact"), this.get_impact(lists[1][1]), null);
    this.importService.create_answers(this.getReference("deletion", "impact"), this.get_impact(lists[2][1]), null);

    /**
     * TREATMENTS => MEASURES
     * create an answer (measures) for each risk (access, modification, deletion) : from reference of question, list of treatment, gauge
     */

    this.importService.create_answers(this.getReference("access", "measure"), this.get_list_treatment(lists[0][1]), null);
    this.importService.create_answers(this.getReference("modification", "measure"), this.get_list_treatment(lists[1][1]), null);
    this.importService.create_answers(this.getReference("deletion", "measure"), this.get_list_treatment(lists[2][1]), null);

    /**
     * VULNERABILITIES => SOURCES
     * create an answer (sources) for each risk (access, modification, deletion) : from reference of question, list of vulnerabilities, gauge
     */

    this.importService.create_answers(this.getReference("access", "source"), this.get_list_vulnerabilities(lists[0][1]), null);
    this.importService.create_answers(this.getReference("modification", "source"), this.get_list_vulnerabilities(lists[1][1]), null);
    this.importService.create_answers(this.getReference("deletion", "source"), this.get_list_vulnerabilities(lists[2][1]), null);

    /**
    * LEVEL IMPACT => GRAVITE
    * create an answer (Level of impact) for each risk (access, modification, deletion) : from reference of question, list vide , gauge(level)
    */

   this.importService.create_answers(this.getReference("access", "impact_level"), [] , this.get_max_level(lists[0][1])[0]);
   this.importService.create_answers(this.getReference("modification", "impact_level"), [] , this.get_max_level(lists[1][1])[0]);
   this.importService.create_answers(this.getReference("deletion", "impact_level"), [] , this.get_max_level(lists[2][1])[0]);

    /**
    * LIKELIHOOK => VRAISEMBLANCE
    * create an answer (level likelihood) for each risk (access, modification, deletion) : from reference of question, empty list, gauge(level)
    */

   this.importService.create_answers(this.getReference("access", "likelihood_level"), [] , this.get_max_level(lists[0][1])[1]);
   this.importService.create_answers(this.getReference("modification", "likelihood_level"), [] , this.get_max_level(lists[1][1])[1]);
   this.importService.create_answers(this.getReference("deletion", "likelihood_level"), [] , this.get_max_level(lists[2][1])[1]);

    this.importService.measures = [];
    //create a measures part
    this.importService.create_mesures(this.get_list_treatment(lists[0][1]));
    this.importService.create_mesures(this.get_list_treatment(lists[1][1]));
    this.importService.create_mesures(this.get_list_treatment(lists[2][1]));

  }

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

/**
 * Save a new PIA in the backend of the tool of CNIL
 */

  async saveNewPia() {
    return new Promise((resolve, reject) => {
      this.sendPiaService.create_Pia(this.firstFormGroup.value.firstCtrl1, this.firstFormGroup.value.firstCtrl2, this.firstFormGroup.value.firstCtrl3, this.firstFormGroup.value.firstCtrl4).then(id => {
        const id_pia = id;
        if(this.listData != undefined){

          if(this.listData[0][1].length != 0){
            this.send_all_answers(id_pia, "access", this.listData[0][1] );
          }
          if(this.listData[1][1].length != 0){
            this.send_all_answers(id_pia, "modification", this.listData[1][1] );
          }
          if(this.listData[2][1].length != 0){
            this.send_all_answers(id_pia, "deletion", this.listData[2][1] );
          }
    }
        resolve(id);
        this.close();
      });
    });

  }

  /**
  * Send all answers in the backend of the tool of CNIL from pia_id, the type of the risk and data
  */
  send_all_answers (pia_id, type , listData){

     //impact
    this.sendPiaService.save_answer(pia_id, this.getReference(type, "impact") , this.get_impact(listData), null );
    //measures
    this.sendPiaService.save_answer(pia_id, this.getReference(type, "measure"), this.get_list_treatment(listData), null);
    //sources
    this.sendPiaService.save_answer(pia_id,this.getReference(type, "source"), this.get_list_vulnerabilities(listData), null);
    //gravite
    this.sendPiaService.save_answer(pia_id, this.getReference(type, "impact_level"), [] , this.get_max_level(listData)[0]);
    //vraisemblance
    this.sendPiaService.save_answer(pia_id, this.getReference(type, "likelihood_level"), [] , this.get_max_level(listData)[1]);

    this.get_list_treatment(listData).forEach(element => {
      this.sendPiaService.save_measure(pia_id, element );
    });

  }
}
