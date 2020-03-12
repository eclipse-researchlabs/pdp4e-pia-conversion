import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { ServersService } from './servers.service';

@Injectable({
  providedIn: 'root'
})
export class RmtService {
  selectedRiskAnalysis: any;
  riskAnalyses: any[]=[];// Provide a cache for the content stored on the risk management tool. Call refresh() to refresh it
  continueAssessmentEvent$: Subject<any> = new Subject<any>();

  constructor(
    private http: HttpClient,
    private _servers: ServersService
  ) { }

  refresh() {
    this.getRiskAnalyses()
      .subscribe((ras: any[]) => {
        ras.forEach(async ra => {
          this.getExportData(ra.id)
          .subscribe(data =>
            {
              this.riskAnalyses.push(data)
            }
          )
        })
      })
  }

  getRiskAnalyses() {
    return this.http
      .get(this._servers.getRMTUrl()
        + "/api/graphql/get?query={ containers { id, name } }")
  }

  getExportData(id: string) {
    return this.http
      .get(this._servers.getRMTUrl()
        + `/api/graphql/get?query={
          containers(id:"${id}") {
            assets {
              id,
              name,
              payload,
              vulnerabilities { id, name, description },
              risks {
                id,
                name,
                description,
                vulnerabilities { id, name, description },
                risks { id },
                treatments { id, type, description },
                payload {
                  impact,
                  impactText,
                  owasp { name, value },
                  likelihood,
                  likelihoodText,
                  stride,
                }
              },
              treatments { id, type, description }
              }
            }
          }`)
  }
}
