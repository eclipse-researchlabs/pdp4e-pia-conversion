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
import { ServersService } from './servers.service';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  savedAnalyses: any[]=[];// Provide a cache for the content stored on the backend. Call refresh() to refresh it

  constructor(private http: HttpClient,
    private _servers: ServersService) { }

  refresh()
  {
    this.getSavedRiskAnalyses().toPromise()
    .then( (ras: any[]) => this.savedAnalyses=ras);
  }

  getSavedRiskAnalyses() {
    return this.http
      .get(this._servers.getAppServerUrl() + '/riskAnalyses')
  }

  saveRiskAnalysis(id: string, pia_id: number, risks: any[], measures: any[]) {
    console.log(pia_id)
    return this.http
      .post(this._servers.getAppServerUrl() + '/riskAnalyses',
        { id: id, pia_id: pia_id, risks: risks, measures: measures })
  }

  updateRiskAnalysis(id: string, pia_id: number, risks: any[], measures: any[]) {
    return this.http
      .patch(this._servers.getAppServerUrl() + '/riskAnalyses',
        { id: id, pia_id: pia_id, risks: risks, measures: measures })
  }

}
