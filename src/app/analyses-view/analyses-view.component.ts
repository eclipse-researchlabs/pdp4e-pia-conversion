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
  i =0;
  pias : any;
  displayedColumns: string[] = ['PIA_name', 'AUTHOR', 'EVALUATOR', 'VALIDATOR', 'ACTION'];
  ngOnInit(): void {
    console.log(localStorage.getItem('risks_Imported'));
    if(localStorage.getItem('risks_Imported') !== undefined){
      this.cards = JSON.parse(localStorage.getItem('risks_Imported')).containers;
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
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog,
    private http: HttpClient,
    private pia: PiaService,
    private rmt: RmtService
  ) {
  }

  openNewPiaDialog(card)
  {
    const dialogConfig = new MatDialogConfig();
    //dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "100%";
    dialogConfig.data = { data:card };
   const dialogRef =  this.dialog.open(DialogNewPiaComponent,dialogConfig);
   dialogRef.afterClosed().subscribe(result => r => {
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
  }

  openAssignment(card, pia_id){
    console.log(card, pia_id);
    card =JSON.parse(localStorage.getItem('risks_Imported')).containers[0];
    var dataCard = JSON.parse(localStorage.getItem('risks_Imported')).containers[0];
    //var dataCard = card;
    this.http.get(localStorage.getItem('server_url') + "/pias/" + pia_id + "/answers").subscribe(data => {
      var i = 0;
      var risktab = [];
      dataCard.assets[0].risks.forEach(risk => {
       var ok = true;
       if(data != []){
       for(let key in data){
        if(data[key].reference_to == "321" || data[key].reference_to == "331"  || data[key].reference_to == "341" )
       {
         var riskadd ;
         if(data[key].data.list != undefined){
         data[key].data.list.forEach(element => {
             if(element == risk.name) {
              ok = false;
             }
             else {
               riskadd = risk;
             }
           });
          }
       }
       }
       if(ok){
         risktab.push(risk);
       }
     }
     else{
       risktab.push(risk);
     }
     dataCard.assets[0].risks = risktab;
     console.log(dataCard);


});
const dialogConfig = new MatDialogConfig();
//dialogConfig.disableClose = true;
dialogConfig.autoFocus = true;
dialogConfig.width = "100%";
dialogConfig.data = { data:dataCard, piaId : pia_id};
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
