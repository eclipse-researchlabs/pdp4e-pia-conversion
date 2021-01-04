/*******************************************************************************
 * Copyright (C) 2021 TRIALOG
 * 
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 * 
 * SPDX-License-Identifier: EPL-2.0
 ******************************************************************************/

import { Component, OnInit } from '@angular/core';
import { ServersService } from '../services/servers.service'
import { MatSnackBar } from '@angular/material/snack-bar'

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {

  constructor(
      private servers: ServersService,
      private snack: MatSnackBar
    ) { }

  ngOnInit(): void {
  }

  test(url: string)
  {
    this.servers.testUrl(url).subscribe(
      r => {
        if(r)
        {
          this.snack.open("Server is available", '', {duration: 3000});
        }
        else
        {
          this.snack.open("Server unavailable", '', {duration: 3000});
        }
      }
    );
  }

}
