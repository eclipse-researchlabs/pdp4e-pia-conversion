import { Component } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {ModalConfigComponent} from './modal-config/modal-config.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'risk-management-client';
  url_server = "";
  data_risk = undefined;
  constructor(private dialog: MatDialog, public router: Router){
  this.openConfigDialog();
  }
  openConfigDialog()
  {
    const dialogConfig = new MatDialogConfig();
    //dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "100%";
   const dialogRef =  this.dialog.open(ModalConfigComponent,dialogConfig);
   dialogRef.afterClosed().subscribe( r => {
     //console.log(localStorage.getItem('server_url'));
    this.url_server = localStorage.getItem('server_url');
    this.data_risk = localStorage.getItem('risks_Imported');
    this.router.navigate(['/analyses']);
    this.router.onSameUrlNavigation = 'reload'
     if(r)
     {
       //TODO: validation, check if a pia with the same name exists ?
       //this.pia.addPia(r.pia, r.author, r.evaluator, r.validator);
     }
   }
 );
  }
}
