/*******************************************************************************
 * Copyright (C) 2021 TRIALOG
 * 
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 * 
 * SPDX-License-Identifier: EPL-2.0
 ******************************************************************************/

import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {ModalConfigComponent} from './modal-config/modal-config.component';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'RISK-MANAGEMENT-CLIENT';
  url_server = "";
  data_risk = undefined;
  path;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private dialog: MatDialog, public router: Router){
  //this.openConfigDialog();
  }
  ngOnInit(): void {
    if(this.document.location.pathname == '/'){
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
     }
   );
    }
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
    this.document.location.reload();
   }
 );
  }
}
