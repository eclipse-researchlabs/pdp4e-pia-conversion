/*******************************************************************************
 * Copyright (C) 2021 TRIALOG
 * 
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 * 
 * SPDX-License-Identifier: EPL-2.0
 ******************************************************************************/


import { Component, Input,OnInit, Inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PiaService } from '../services/pia.service';
import { RmtService } from '../services/rmt.service';
import { RiskAssignmentComponent } from '../risk-assignment/risk-assignment.component';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import {DialogNewPiaComponent} from '../dialog-new-pia/dialog-new-pia.component'
import { HttpClient } from '@angular/common/http';
import {MatTableDataSource} from '@angular/material/table';
import {SendPiaService} from '../services/send-pia.service';
import { DOCUMENT } from '@angular/common';
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
  @Input() server_url;
  @Input() data_risk;
  loading=false;
  i =0;
  pias : any;
  displayedColumns: string[] = ['PIA_name', 'AUTHOR', 'EVALUATOR', 'VALIDATOR', 'ACTION'];
  ngOnInit(): void {
    console.log(localStorage.getItem('container_list'));
    if(localStorage.getItem('container_list') !== undefined){
      this.cards = JSON.parse(localStorage.getItem('container_list')).containers;
    }
    else {
      this.cards = this.data.containers;
    }
    //this.http.get("http://localhost:3000/pias").subscribe(data => {
     // this.pias = data;
  //})
    console.log(localStorage.getItem('server_url'));
   if(localStorage.getItem('server_url') != ""){
    this.http.get(localStorage.getItem('server_url') + "/pias").subscribe(data => {
      this.pias = data;
  })
   }
  }
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private breakpointObserver: BreakpointObserver,
    private sendPiaService : SendPiaService,
    private dialog: MatDialog,
    private http: HttpClient,
    private pia: PiaService,
    private rmt: RmtService
  ) {
  }

  openNewPiaDialog(card)
  {
    this.retrieveData(card.id, r=>{
    const dialogConfig = new MatDialogConfig();
    //dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "100%";
    dialogConfig.data = { data:r.containers[0] };
   const dialogRef =  this.dialog.open(DialogNewPiaComponent,dialogConfig);
   dialogRef.afterClosed().subscribe(r => {
    if(localStorage.getItem('server_url') != ""){
      this.http.get(localStorage.getItem('server_url') + "/pias").subscribe(data => {
        this.pias = data;
    })
     }
     console.log(r);
     if(r)
     {
       //TODO: validation, check if a pia with the same name exists ?
       //this.pia.addPia(r.pia, r.author, r.evaluator, r.validator);
     }
   }
 );
  })
  }
  deletePia(pia_id){
    const url = localStorage.getItem('server_url') +"/pias/"+ pia_id ;
    this.sendPiaService.delete(url);
    this.document.location.reload();
  }

  retrieveData(id, callback)
  {
    this.loading=true;
    const headers = {  'Content-type': 'application/json', 'token': localStorage.getItem('server_pdp4_token') };
    var url_risk = localStorage.getItem('server_pdp4_url') + "/api/graphql?query={containers(where:{path:%22RootId%22,comparison:%22equal%22,value:%22" + id + "%22}){name,assets{id,name,risks{vulnerabilities{id, payload},name, description,payload{impact, likelihood, status},treatments{id,payload,definition{id,type,description}}}},edges{id,fromId,toId,payload,risks{vulnerabilities{id,payload},name,description,payload{impact,likelihood, status}}}}}";
    this.http.get(url_risk,  { headers })
    .subscribe(r => {
      console.log(r);
      let data = JSON.stringify(r);
      let risks=JSON.parse(data);
      console.log(risks);
      this.loading=false;
      callback(risks)
    })
    //  .subscribe(resp => {
    //  });
  }

  openAssignment(card, pia_id){
    this.retrieveData(card.id, r=>{
    console.log(r, pia_id);
    //card =JSON.parse(localStorage.getItem('risks_Imported')).containers[0];
    //var dataCard = JSON.parse(localStorage.getItem('risks_Imported')).containers[0];
    var dataCard_exist = JSON.parse(localStorage.getItem('risks_Imported')).containers[0];
    //var dataCard = card;
    this.http.get(localStorage.getItem('server_url') + "/pias/" + pia_id + "/answers").subscribe(data => {
      var i = 0;
      var risktab = [];
      var risktab_exist = [];
      console.log(data);
      if(card.assets[0] != undefined){
      card.assets[0].risks.forEach(risk => {
        risk.description = undefined;
        var ok = true;
       if(data != []){
       for(let key in data){
        if(data[key].reference_to == "321" || data[key].reference_to == "331"  || data[key].reference_to == "341" )
       {
         var riskadd ;
         var riskexist;
         if(data[key].data.list != undefined){
         data[key].data.list.forEach(element => {
             if(element == risk.name) {
              ok = false;

              if(data[key].reference_to == "321"){

                risk.description = "access";
              }
              else if (data[key].reference_to == "331"){

                risk.description = "modification";
              }
              else {
                risk.description = "deletion";
              }
              riskexist = risk;

             }
             else {

               riskadd = risk;
             }

           });
           if(ok)
             {
              risk.description = undefined;
             }
          }
       }
       }
       risktab.push(risk);
       console.log(risktab);
       risktab_exist.push(risk);
       /**
        *
        *
      if(ok){
         risktab.push(risk);

       }
       else {
        risktab_exist.push(risk);
       }
        */

     }
     else{
       risktab.push(risk);
     }
     card.assets[0].risks = risktab;
     if(dataCard_exist.assets[0] != undefined){
     dataCard_exist.assets[0].risks = risktab_exist;
     console.log(card);
     }


});
    }
const dialogConfig = new MatDialogConfig();
//dialogConfig.disableClose = true;
dialogConfig.autoFocus = true;
dialogConfig.width = "100%";
dialogConfig.data = { data:card, data_stocked : dataCard_exist, piaId : pia_id};
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
});
    });
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
