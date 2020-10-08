import { Component, Inject, OnInit } from '@angular/core';
import { ConversionService } from '../services/conversion.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RmtService } from '../services/rmt.service';

@Component({
  selector: 'app-risk-assignment',
  templateUrl: './risk-assignment.component.html',
  styleUrls: ['./risk-assignment.component.css']
})
export class RiskAssignmentComponent implements OnInit{

  risks=this.conversion.getPrivacyRisks(this.rmt.riskAnalyses[0]);
  //risks=[
  //  {name: 'risk1'},
  //  {name: 'risk2'}
  //];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private conversion: ConversionService,
    private rmt: RmtService
  ) {}

  ngOnInit(): void {
    console.log(this.risks);
  }

  add()
  {
    console.log("add a row");
    this.risks.push({name: 'risk push'});
  }
}
