/*******************************************************************************
 * Copyright (C) 2021 TRIALOG
 * 
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 * 
 * SPDX-License-Identifier: EPL-2.0
 ******************************************************************************/

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnalysesViewComponent } from './analyses-view/analyses-view.component'
import { ConfigurationComponent } from './configuration/configuration.component'
import { RiskAssignmentComponent } from './risk-assignment/risk-assignment.component'

const routes: Routes = [
  {path: 'analyses', component: AnalysesViewComponent},
  {path: 'config', component: ConfigurationComponent},
  {path: 'assignment', component: RiskAssignmentComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
