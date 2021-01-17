import { Injectable } from '@angular/core';
import { Console } from 'console';
import { PiaService } from './pia.service';
import { RmtService } from './rmt.service';

let riskCorrespondance = [
  {
    name: 'Illegitimate access to data',
    stride: 'INFORMATION DISCLOSURE'
  },
  {
    name: 'Unwanted modification of data',
    stride: 'TAMPERING'
  },
  {
    name: 'Data disappearance',
    stride: 'DENIAL OF SERVICE'
  }
]

let NOTE = ['low', 'medium', 'high'];

class Risk {
  name: string;
  impacts: string[] = [];
  threats: string[] = [];
  sources: string[] = [];
  measures: string[] = [];//contain the names of the measures
  severity: any;
  likelihood: any;

  constructor(name: string) {
    this.name = name;
  }
}

class Measure {
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConversionService {
  measures: any[] = [];
  risks: Risk[] = [];

  constructor(
    private _piaService: PiaService,
    private _rmtService: RmtService
  ) { }

  exportToPia(pia_id: any) {
    let types = ['impacts', 'threats', 'sources', 'measures', 'severity', 'likelihood'];
    return new Promise(async (resolve, reject) => {

      /* export measures */
      this.measures.forEach(measure => {
        this._piaService.addMeasure(pia_id, measure)
          .subscribe(
            res => /* console.log("Measure added:", res) */ null,
            err => { return reject(err); });
      });

      /* export risks */
      for (let i = 0; i < 3; i++) {
        let risk = this.risks[i];

        for (let t = 0; t < 4; t++) {
          risk[types[t]].forEach(elem => {
            this._piaService.addImpactOrThreatOrSourceOrInitialMeasure(pia_id, i + 2, t + 1, elem)
              .subscribe(
                res => /* console.log("Answer added:", res) */ null,
                err => { return reject(err); });
          });
        }

        for (let t = 4; t < 6; t++) {
          this._piaService.addSeverityOrLikelihood(pia_id, i + 2, t + 1, risk[types[t]])
            .subscribe(
              res => /* console.log("Answer added:", res) */ null,
              err => { return reject(err); });
        }
      }
      resolve(pia_id);
    });

  }

  getRisks(data: any) {
    this.risks = [];
    this.measures = [];

    for (let i = 0; i < 3; i++) {
      this.risks[i]=new Risk(riskCorrespondance[i].name)
      let stride = riskCorrespondance[i].stride;

      let current_risks=this.getPrivacyRisks(data);

      let [
        vulnerabilities,
        treatments,
        likelihoods,
        impacts
       ] = this.getDataFromRisks(current_risks);

      this.risks[i].threats=this.getThreats(vulnerabilities);
      this.risks[i].impacts=this.getImpacts(impacts);
      this.risks[i].sources=this.getSources(vulnerabilities);
      this.measures=this.getMeasures(treatments);
      this.risks[i].measures=this.measures.map(m=>m.title);
      this.risks[i].likelihood=this.getLikelihood(likelihoods);
      this.risks[i].severity=this.getSeverity(impacts);
    }
  }

  //Returns all risks related to privacy: ie with a valid LINDDUN category
  getPrivacyRisks(data: any): any[] {
    return data.assets.reduce((acc, asset) => {
      let val=acc.concat(asset.risks.filter(risk => {
        console.log(risk.vulnerabilities);
        return risk.vulnerabilities.some(v=>{
          return JSON.parse(v.payload).Framework=="Linddun";
        })
      })
      //.map(risk => risk.asset = { id: asset.id, name: asset.name })
      );
      console.log(val);
      val.forEach(risk => risk.asset = { id: asset.id, name: asset.name });
      return val;
    },[]);
  }
  getPrivacyRisks2(data: any): any[] {
    return data.reduce((acc, asset) => {
      let val=acc.concat(asset.risks.filter(risk => { return risk.payload.linddun != undefined; })
      //.map(risk => risk.asset = { id: asset.id, name: asset.name })
      );
      console.log(val);
      val.forEach(risk => risk.asset = { id: asset.id, name: asset.name });
      return val;
    },[]);
  }
  getPrivacyRisks1(data: any){
    var data_risk = [];
    data.assets.forEach(asset => {

      asset.risks.forEach(risk => {
        var riskData = {
          id : risk.id,
          name : risk.name,
          description : risk.description,
          asset : {
            id : asset.id,
            name : asset.name,
          },
          vulnerabilities : risk.vulnerabilities,
          treatments : risk.treatments,
          payload : {
            stride : risk.payload.stride,
            lindun : risk.payload.lindun,
            impact : risk.payload.impact,
            likelihood : risk.payload.likelihood
          }
        }
        if(risk.vulnerabilities.some(v=>{
          return JSON.parse(v.payload).Framework=="Linddun";
        })){
          console.log(riskData);
          data_risk.push(riskData);
        }

      });



    });
    return data_risk;
  }

  /* filter risks by stride */
  private getRiskByStride(data: any, stride: string) {
    return data.assets.reduce((acc, asset) => {
      return acc.concat(asset.risks.filter(risk => { return risk.payload.stride === stride; })
      .map(risk => risk.asset = { id: asset.id, name: asset.name })
      );
    });
  }


  /* extract data from all risks of stride i */
  private getDataFromRisks(_risks: any[]) {
    return _risks.map(risk => {
      risk.vulnerabilities.forEach(v => v.risk = risk);
      risk.treatments.forEach(t => t.risk = risk);
      return [
        risk.vulnerabilities,
        risk.treatments,
        { value: this.getLikelihoodValue(risk), text: risk.payload.likelihoodText || "Quantitive value => no text ?" },//if no text, put the name of the risk ?
        { value: this.getImpactValue(risk), text: risk.payload.impactText || "Quantitive value => no text ?" }
      ]
    });
  }

  /* deduce threats from vulnerabilities and assets */
  private getThreats(vulnerabilities: any[]) {
    return vulnerabilities.map(
      vulnerability => `Asset ${vulnerability.risk.asset.name} has following vulnerability : ${vulnerability.name} (${vulnerability.description})`
    );
  }

  /* deduce impacts from impacts */
  private getImpacts(impacts: any[]) {
    return impacts.map(impact => impact.text);
  }

  /* deduce sources from vulnerabilities */
  private getSources(vulnerabilities: any[]) {
    let vulns = Array.from(new Set(vulnerabilities));
    // should be defined there, but need to be extracted. Need processing
    return vulns.map(v => v.description || "no description");
  }

  /* deduce measures from treatmeants of risks */
  private getMeasures(treatments: any[]) {
    let unique_treatments = Array.from(new Set(treatments)); //remove duplicates ?
    return unique_treatments.map(treatment => {
      return {
        title: treatment.type + ' for ' + treatment.risk.name,
        content: treatment.description
      };
      //this.risks[i].measures.push(measure.title);
    });
  }

  /* deduce likelihood from likelihoods */
  private getLikelihood(likelihoods: any[]) {
    let unique_likelihoods = Array.from(new Set(likelihoods));
    return {
      // mean value
      value: Math.round(unique_likelihoods
        .map(l => l.value ? l.value : 0)
        .reduce((x, y) => x + y, 0) / unique_likelihoods.length),
      // concatenated descriptions
      text: unique_likelihoods
        .map(l => l.text)
        .join('\n')
    };
  }

  /* deduce severity from impacts */
  private getSeverity(impacts: any[]) {
    let unique_impacts = Array.from(new Set(impacts));
    return {
      // mean value
      value: Math.round(unique_impacts
        .map(l => l.value ? l.value : 0)
        .reduce((x, y) => x + y, 0) / unique_impacts.length),
      // concatenated descriptions
      text: unique_impacts
        .map(l => l.text)
        .join('\n')
    };
  }

  private getImpactValue(risk: any) {
    // Qualitive impact
    if (risk.payload.impactText) return 1.5 * NOTE.indexOf(risk.payload.impact) + 1;

    // Quantitive => consider impacts relevant for data protection only
    let impactValue: number;
    let v = risk.payload.owasp
      .filter(ow => {
        return [
          "impact.Technical Impact Factors.Loss of confidentiality",
          "impact.Technical Impact Factors.Loss of integrity"
        ].includes(ow.name);
      });
    if (v.length) {
      impactValue = v.map(x => x.value).reduce((x, y) => x + y, 0) / v.length;
      impactValue = 0.3 * impactValue + 1;
    }
    else {
      impactValue = 0;
    }
    return impactValue;
  }

  private getLikelihoodValue(risk: any) {
    return 1.5 * NOTE.indexOf(risk.payload.likelihood) + 1;
  }
}
