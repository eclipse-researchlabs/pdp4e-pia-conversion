import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { mergeMap, flatMap, map } from 'rxjs/operators';
import { ServersService } from './servers.service';
// import 'rxjs/add/operator/mergeMap';

@Injectable({
  providedIn: 'root'
})
export class PiaService {
  //pias: any[];
  //private serverUrl: string;

  constructor(private http: HttpClient,
    private route: ActivatedRoute,
    private _servers: ServersService) {
  }


  public server_url(): string {
    return this._servers.getPIAServerUrl() + this._servers.getPIARoute();
  }


  getAll() {
    return this.http
      .get(
        this.server_url() + '/pias'
      )
  }

  get(pia_id: number) {
    return this.http
      .get(
        this.server_url() + '/pias/' + pia_id
      )
  }

  getFromRoute() {
    let pia_id = parseInt(this.route.snapshot.params['id'], 10);
    return this.get(pia_id);
  }



  getMeasures(pia_id: number) {
    return this.http
      .get(this.server_url() + '/pias/' + pia_id + '/measures')
  }

  getMeasure(pia_id: number, id: number) {
    return this.http
      .get(this.server_url() + '/pias/' + pia_id + '/measures/' + id)
  }

  getStructure() {
    return this.http
      .get('./assets/files/pia_architecture.json')
  }

  /* --------------------------- autofill pia ---------------------------  */

  addPia(name: string, author_name: string, evaluator_name: string, validator_name: string) {
    return this.http
      .post(this.server_url() + '/pias', {
        name: name,
        author_name: author_name,
        evaluator_name: evaluator_name,
        validator_name: validator_name
      })
  }

  addMeasure(pia_id: number, measure: { title: string, content: string }) {
    return this.http
      .post(this.server_url() + '/pias/' + pia_id + '/measures', measure)
  }

  addImpactOrThreatOrSourceOrInitialMeasure(pia_id: number, risk_id: number, type_id: number, content: string) {
    /* type = ['impact', 'threat', 'source', 'measure'] */
    let reference_to = '3' + risk_id + type_id;
    let url = this.server_url() + '/pias/' + pia_id + '/answers';

    // TODO: verify measure actually exists ?

    return this.http.get(url + '?reference_to=' + reference_to).pipe(
      flatMap((answer: any) => {
        if (Object.keys(answer).length) {
          console.log(answer)
          answer.data.list !== undefined ? answer.data.list.push(content) : answer.data.list = [content];
          answer.data.list = Array.from(new Set(answer.data.list))
          return this.http.patch(url + '/' + answer.id, answer)
        } else {
          answer = {
            reference_to: reference_to,
            data: { list: [content] }
          }
          return this.http.post(url, answer)
        }
      })
    )
  }

  addSeverityOrLikelihood(pia_id: number, risk_id: number, type_id: number, severity: { text: string; value: number; }) {
    /* type = ['severity', ''likelihood'] */
    let reference_to = '3' + risk_id + type_id;
    let url = this.server_url() + '/pias/' + pia_id + '/answers';

    return this.http.get(url + '?reference_to=' + reference_to).pipe(
      flatMap((answer: any) => {
        if (Object.keys(answer).length) {
          answer.data.gauge = Math.round(severity.value);
          answer.data.text = severity.text;
          return this.http.patch(url + '/' + answer.id, answer)
        } else {
          answer = {
            reference_to: reference_to,
            data: {
              gauge: Math.round(severity.value),
              text: severity.text,
            }
          }
          return this.http.post(url, answer)
        }
      })
    )
  }


}
