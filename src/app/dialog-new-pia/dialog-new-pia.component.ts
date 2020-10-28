import { Component,Input,Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { HttpClient } from '@angular/common/http';
import {PiaService} from '../services/pia.service'
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
  answers = [];
  measures = [];
  matrix_risk: number[][] = [[1,2,3],[1,2,2],[1,1,1]];
  constructor(private _formBuilder: FormBuilder,
    private http: HttpClient,
    private PiaService: PiaService,
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
      "answers": this.answers,
      "measures": this.measures,
      "evaluations": [],
      "comments": []
    };
    //this.PiaService.addPia(this.firstFormGroup.value.firstCtrl1,this.firstFormGroup.value.firstCtrl2, this.firstFormGroup.value.firstCtrl3, this.firstFormGroup.value.firstCtrl4  );
    this.saveNewPia();
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
    this.answers = [];

    /**
     * NAME OF RISKS => IMPACT
     * create an answer (impact) for each risk (access, modification, deletion) : from reference of question, list of impact, gauge
     */

    this.create_answers(this.getReference("access", "impact"), this.get_impact(lists[0][1]), null);
    this.create_answers(this.getReference("modification", "impact"), this.get_impact(lists[1][1]), null);
    this.create_answers(this.getReference("deletion", "impact"), this.get_impact(lists[2][1]), null);

    /**
     * TREATMENTS => MEASURES
     * create an answer (measures) for each risk (access, modification, deletion) : from reference of question, list of treatment, gauge
     */

    this.create_answers(this.getReference("access", "measure"), this.get_list_treatment(lists[0][1]), null);
    this.create_answers(this.getReference("modification", "measure"), this.get_list_treatment(lists[1][1]), null);
    this.create_answers(this.getReference("deletion", "measure"), this.get_list_treatment(lists[2][1]), null);

    /**
     * VULNERABILITIES => SOURCES
     * create an answer (sources) for each risk (access, modification, deletion) : from reference of question, list of vulnerabilities, gauge
     */

    this.create_answers(this.getReference("access", "source"), this.get_list_vulnerabilities(lists[0][1]), null);
    this.create_answers(this.getReference("modification", "source"), this.get_list_vulnerabilities(lists[1][1]), null);
    this.create_answers(this.getReference("deletion", "source"), this.get_list_vulnerabilities(lists[2][1]), null);

    /**
    * LEVEL IMPACT => GRAVITE
    * create an answer (Level of impact) for each risk (access, modification, deletion) : from reference of question, list vide , gauge(level)
    */

    this.create_answers(this.getReference("access", "impact_level"), [] , this.get_max_level(lists[0][1])[0]);
    this.create_answers(this.getReference("modification", "impact_level"), [] , this.get_max_level(lists[1][1])[0]);
    this.create_answers(this.getReference("deletion", "impact_level"), [] , this.get_max_level(lists[2][1])[0]);

    /**
    * LIKELIHOOK => VRAISEMBLANCE
    * create an answer (level likelihood) for each risk (access, modification, deletion) : from reference of question, empty list, gauge(level)
    */

    this.create_answers(this.getReference("access", "likelihood_level"), [] , this.get_max_level(lists[0][1])[1]);
    this.create_answers(this.getReference("modification", "likelihood_level"), [] , this.get_max_level(lists[1][1])[1]);
    this.create_answers(this.getReference("deletion", "likelihood_level"), [] , this.get_max_level(lists[2][1])[1]);

    this.measures = [];
    //create a measures part
    this.create_mesures(this.get_list_treatment(lists[0][1]));
    this.create_mesures(this.get_list_treatment(lists[1][1]));
    this.create_mesures(this.get_list_treatment(lists[2][1]));

  }

  /* create an answer (for the file JSON "IMPORT") from reference of question, list of treatment, gauge*/

  create_answers( reference, list_impact , gauge){
    var answer_impact_acces = {
      "reference_to" : reference,
      "data" : {
        "text" : null,
        "gauge" : gauge,
        "list" : list_impact
      },
      "created_at" : new Date()
    };
    this.answers.push(answer_impact_acces);
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

  /* get the biggest level from list of risks) */
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

   /* get the biggest level from list of risks) */
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

  /* create a list of measures (for file JSON "IMPORT") from list of measures */
  create_mesures(list_measures : Array<string>){
    var i =0;
    if(list_measures != []){
      list_measures.forEach(element => {
      var mesure_json = {
        "title": element,
        "content": "",
        "placeholder": "measures.default_placeholder",
        "created_at": new Date(),
        "updated_at": new Date()
      };
      this.measures.push(mesure_json);
      });
      console.log(this.measures);
    }
  }

   /**
   * Create a new PIA to put it in the backend of the tool of CNIL
   * @returns {Promise} - Return new Promise
   */

  async create_Pia() {
    this.firstFormGroup.value.firstCtrl3, this.firstFormGroup.value.firstCtrl4
    const data ={pia: {
      name: this.firstFormGroup.value.firstCtrl1,
      category: "",
      author_name: this.firstFormGroup.value.firstCtrl2,
      evaluator_name: this.firstFormGroup.value.firstCtrl3,
      validator_name: this.firstFormGroup.value.firstCtrl4,
      dpo_status: 0,
      dpo_opinion: "undefined",
      concerned_people_opinion: "undefined",
      concerned_people_status: 0,
      rejected_reason: "",
      applied_adjustements: "",
      created_at:  new Date(),
      updated_at:  new Date(),
      status: 0,
      is_example: 0,
      is_archive: 0,
      dpos_names: "undefined",
      people_names: "undefined",
      concerned_people_searched_opinion: true,
      concerned_people_searched_content: "undefined",
      structure_id: "",
      structure_name: "undefined",
      structure_sector_name: "undefined",
      structure_data: "\"\""
    }};
    const url = "http://localhost:3000/pias";
    return new Promise((resolve, reject) => {
      //add answers
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        mode: 'cors'
      })
        .then(response => {
          return response.json();
        })
        .then((result: any) => {
          resolve(result.id);
        })
        .catch(error => {
          console.error('Request failed', error);
          reject();
        });
      });
  }

  /**
   * Save an answer (impact, measure, ...) to put it in the backend of the tool of CNIL
   * @param id_PIA
   * @param reference
   * @param list_data
   * @param gauge
   */

  save_answer(id_PIA, reference, list_data, gauge ){
    if(list_data != [])
      {
        const answer = {
          answer : {
            pia_id : id_PIA,
            reference_to : reference,
            data : {
              text :"",
              gauge : gauge,
              list : list_data
            },
            created_at : new Date(),
          },
          pia_id : id_PIA
        };
        const url = "http://localhost:3000/pias/"+ id_PIA + "/answers";
        this.send_requet(url, answer);
      };

  }

  /**
   * Save a measure to put it in the backend of the tool of CNIL
   * from the id of PIA and measure(string)
   */

  save_measure(id_PIA, measure){
    const mesure = {
      "measure": {
        pia_id : id_PIA,
        title : measure,
        content : "",
        placeholder : "measures.default_placeholder",
        created_at : new Date(),
        updated_at : new Date()
      },
      pia_id : id_PIA
    };
    const url = "http://localhost:3000/pias/"+ id_PIA + "/measures";
    this.send_requet(url, mesure);
  }

  /**
   * Send a request (add answer or add measure) to the backend of the tool of CNIL
   * from URL of the backend and the data
   */

send_requet(url, data){
  return new Promise((resolve, reject) => {
    //add answers
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      mode: 'cors'
    })
      .then(response => {
        return response.json();
      })
      .then((result: any) => {
        resolve(result.id);
      })
      .catch(error => {
        console.error('Request failed', error);
        reject();
      });
    });
}

/**
 * Save a new PIA in the backend of the tool of CNIL
 */

  async saveNewPia() {
    return new Promise((resolve, reject) => {
      console.log(this.listData);

      this.create_Pia().then(id => {
        const id_pia = id;
        if(this.listData != undefined){
        //impact
      this.save_answer(id_pia, this.getReference("access", "impact") , this.get_impact(this.listData[0][1]), null );
      this.save_answer(id_pia, this.getReference("modification", "impact"), this.get_impact(this.listData[1][1]), null);
      this.save_answer(id_pia, this.getReference("deletion", "impact"), this.get_impact(this.listData[2][1]), null);
      //measures
      this.save_answer(id_pia, this.getReference("access", "measure"), this.get_list_treatment(this.listData[0][1]), null);
      this.save_answer(id_pia, this.getReference("modification", "measure"), this.get_list_treatment(this.listData[1][1]), null);
      this.save_answer(id_pia, this.getReference("deletion", "measure"), this.get_list_treatment(this.listData[2][1]), null);
      //sources
      this.save_answer(id_pia,this.getReference("access", "source"), this.get_list_vulnerabilities(this.listData[0][1]), null);
      this.save_answer(id_pia,this.getReference("modification", "source"), this.get_list_vulnerabilities(this.listData[1][1]), null);
      this.save_answer(id_pia, this.getReference("deletion", "source"), this.get_list_vulnerabilities(this.listData[2][1]), null);
      //gravite
      this.save_answer(id_pia, this.getReference("access", "impact_level"), [] , this.get_max_level(this.listData[0][1])[0]);
      this.save_answer(id_pia, this.getReference("modification", "impact_level"), [] , this.get_max_level(this.listData[1][1])[0]);
      this.save_answer(id_pia, this.getReference("deletion", "impact_level"), [] , this.get_max_level(this.listData[2][1])[0]);

      //vraisemblance
      this.save_answer(id_pia, this.getReference("access", "likelihood_level"), [] , this.get_max_level(this.listData[0][1])[1]);
      this.save_answer(id_pia, this.getReference("modification", "likelihood_level"), [] , this.get_max_level(this.listData[1][1])[1]);
      this.save_answer(id_pia, this.getReference("deletion", "likelihood_level"), [] , this.get_max_level(this.listData[2][1])[1]);
      this.get_list_treatment(this.listData[0][1]).forEach(element => {
        this.save_measure(id_pia, element );
      });
      this.get_list_treatment(this.listData[1][1]).forEach(element => {
        this.save_measure(id_pia, element );
      });
      this.get_list_treatment(this.listData[1][1]).forEach(element => {
        this.save_measure(id_pia, element );
      });
    }
        resolve(id);
      });
    });

  }

}
