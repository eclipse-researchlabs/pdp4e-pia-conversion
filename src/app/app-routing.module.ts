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
