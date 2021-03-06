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
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class SendPiaService {

  constructor(private http: HttpClient) { }


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
  * Create a new PIA to put it in the backend of the tool of CNIL
  * @returns {Promise} - Return new Promise
  */

  async create_Pia(name_pia, author, evaluator, validator) {
    const data ={pia: {
      name: name_pia,
      category: "",
      author_name: author,
      evaluator_name: evaluator,
      validator_name: validator,
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
    const url = localStorage.getItem('server_url') +"/pias";
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
    const url = localStorage.getItem('server_url') +"/pias/"+ id_PIA + "/measures";
    this.send_requet(url, mesure);
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
        const url =localStorage.getItem('server_url') +"/pias/"+ id_PIA + "/answers";
        this.send_requet(url, answer);
      };

  }
  update_answer(id_PIA, reference, list_data, gauge, id_answer ){
    console.log(id_PIA, reference, list_data, gauge, id_answer );
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
            updated_at : new Date(),
          },
          pia_id : id_PIA
        };
        const url =localStorage.getItem('server_url') +"/pias/"+ id_PIA + "/answers/"+id_answer;
        this.update_requet(url, answer);
      };

  }

  update_requet(url, data){
    return new Promise((resolve, reject) => {
      //add answers
      fetch(url, {
        method: 'PATCH',
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
  delete(url){
    return new Promise((resolve, reject) => {
      //add answers
      fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
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

}
