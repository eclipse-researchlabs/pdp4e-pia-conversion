/*******************************************************************************
 * Copyright (C) 2021 TRIALOG
 * 
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 * 
 * SPDX-License-Identifier: EPL-2.0
 ******************************************************************************/

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImportService {
  answers = [];
  measures = [];
  constructor() { }

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


}
