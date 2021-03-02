import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatChipsModule} from '@angular/material/chips';
import { HttpClientModule } from '@angular/common/http'
import {MatRadioModule} from '@angular/material/radio';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AnalysesViewComponent, DialogNewPia } from './analyses-view/analyses-view.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog'
import { MatSelectModule } from '@angular/material/select';
import { LayoutModule } from '@angular/cdk/layout';
import { ConfigurationComponent } from './configuration/configuration.component';
import { RiskAssignmentComponent } from './risk-assignment/risk-assignment.component';
import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatStepperModule} from '@angular/material/stepper';
import { DialogNewPiaComponent } from './dialog-new-pia/dialog-new-pia.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShowRiskDataComponent } from './show-risk-data/show-risk-data.component';
import { ShowRiskDataEdgeComponent } from './show-risk-data-edge/show-risk-data-edge.component';
import {MatTabsModule} from '@angular/material/tabs';
import { ModalConfigComponent } from './modal-config/modal-config.component';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
@NgModule({
  declarations: [
    AppComponent,
    AnalysesViewComponent,
    ConfigurationComponent,
    DialogNewPia,
    RiskAssignmentComponent,
    DialogNewPiaComponent,
    ShowRiskDataComponent,
    ShowRiskDataEdgeComponent,
    ModalConfigComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NoopAnimationsModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatDialogModule,
    MatSelectModule,
    LayoutModule,
    MatTableModule,
    MatCheckboxModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatRadioModule,
    MatChipsModule,
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.wanderingCubes,
      backdropBackgroundColour: 'rgba(0,0,0,0.1)',
      backdropBorderRadius: '4px',
      primaryColour: '#ffffff',
      secondaryColour: '#ffffff',
      tertiaryColour: '#ffffff'
  })
  ],
  entryComponents: [
    DialogNewPia
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
