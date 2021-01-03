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
import { Subject } from 'rxjs';
import { ServersService } from './servers.service';

@Injectable({
  providedIn: 'root'
})
export class RmtService {
  selectedRiskAnalysis: any;
  //riskAnalyses: any[]=[];// Provide a cache for the content stored on the risk management tool. Call refresh() to refresh it
  //data = require('../../assets/data/data-pdp4e.json');
  data = require('../../assets/data/data_pdp4e.json');
  riskData: any;
  riskAnalyses: any[]=[{
    'assets':[
{
  'id':'a1',
  'name':'asset a',
  'risks':[
    {
      'id':'r1',
      'name':'risk 1',
      'description':'risk desc',
      'vulnerabilities':[
        {'id':'v1','name':'vuln1','description':'vuln desc'}
      ],
      'treatments':[{'id': 't1'}],
      'payload':{
        'impact':1,
        'impactText':'low',
        'likelihood':1,
        'likelihoodText':'low',
        'stride':'INFORMATION DISCLOSURE',
        'linddun':'LINKABILITY'
      }
    }
  ],
  'treatments':[
  {'id':'t1','type':'PREVENTIVE','description':'treatment description'}
  ]
},
      {
        'id':'a2',
        'name':'asset a2',
        'risks':[
          {
            'id':'r1b',
            'name':'risk 1b',
            'description':'risk desc',
            'vulnerabilities':[
              {'id':'v1b','name':'vuln1b','description':'vuln desc'}
            ],
            'treatments':[{'id': 't1'}],
            'payload':{
              'impact':1,
              'impactText':'low',
              'likelihood':1,
              'likelihoodText':'low',
              'stride':'INFORMATION DISCLOSURE',
              'linddun':'LINKABILITY'
            }
          }
        ],
        'treatments':[
          {'id':'t1','type':'PREVENTIVE','description':'treatment description'}
        ]
      }
    ]
  }];
  continueAssessmentEvent$: Subject<any> = new Subject<any>();

  constructor(
    private http: HttpClient,
    private _servers: ServersService
  ) {
    console.log(this.data.containers[0].assets[0]);
    this.riskData = this.data.containers[0];
   }

  refresh() {
    //this.getRiskAnalyses()
    //  .subscribe((ras: any[]) => {
    //    ras.forEach(async ra => {
    //      this.getExportData(ra.id)
    //      .subscribe(data =>
    //        {
    //          this.riskAnalyses.push(data)
    //        }
    //      )
    //    })
    //  })
  }

  getRiskAnalyses() {
    //return this.http
    //  .get(this._servers.getRMTUrl()
    //    + "/api/graphql/get?query={ containers { id, name } }")
  }

  getExportData(id: string) {
    //return this.http
    //  .get(this._servers.getRMTUrl()
    //    + `/api/graphql/get?query={
    //      containers(id:"${id}") {
    //        assets {
    //          id,
    //          name,
    //          payload,
    //          vulnerabilities { id, name, description },
    //          risks {
    //            id,
    //            name,
    //            description,
    //            vulnerabilities { id, name, description },
    //            risks { id },
    //            treatments { id, type, description },
    //            payload {
    //              impact,
    //              impactText,
    //              owasp { name, value },
    //              likelihood,
    //              likelihoodText,
    //              stride,
    //            }
    //          },
    //          treatments { id, type, description }
    //          }
    //        }
    //      }`)
  }
}
