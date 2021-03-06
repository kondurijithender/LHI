import { SurveyComponent } from './_components/admin/survey/survey.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccordionModule } from 'ngx-bootstrap/accordion';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { environment } from '../environments/environment';
import { SidenavComponent } from './_common/sidenav/sidenav.component';
import { DashboardComponent } from './_components/admin/dashboard/dashboard.component';
import { HeaderComponent } from './_common/header/header.component';

import { TextareaAutosizeModule } from 'ngx-textarea-autosize';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './_components/admin/login/login.component';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { AlertComponent } from './_alert';
import { ToastrModule } from 'ngx-toastr';
import { QuestionnairesComponent } from './_components/admin/questionnaires/questionnaires.component';
import { AddQuestionnairesComponent } from './_components/admin/questionnaires/add/add.component';
import { ConfigurationComponent } from './_components/admin/configuration/configuration.component';
import { FrontendHeaderComponent } from './_components/frontend/frontend-header/frontend-header.component';
import { FrontendFooterComponent } from './_components/frontend/frontend-footer/frontend-footer.component';
import { FrontendQuestionnaireComponent } from './_components/frontend/frontend-questionnaire/frontend-questionnaire.component';
import { ResultComponent } from './_components/frontend/result/result.component';
import { AddIndustryComponent } from './_components/admin/configuration/add_industry/add.component';
import { AddDimensionComponent } from './_components/admin/configuration/add_dimension/add.component';
import { FrontEndDashboardComponent } from './_components/frontend/dashboard/dashboard.component';
import { NgApexchartsModule } from 'ng-apexcharts';

import { GaugeChartModule } from 'angular-gauge-chart'

import { FusionChartsModule } from 'angular-fusioncharts';
// Load FusionCharts
import * as FusionCharts from 'fusioncharts';

// Load Widgets
import * as Widgets from 'fusioncharts/fusioncharts.widgets';

// Load FusionTheme Theme
import * as FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import { PrintScreenComponent } from './_components/frontend/print-screen/print-screen.component'

// Add dependencies to FusionChartsModule
FusionChartsModule.fcRoot(FusionCharts, Widgets, FusionTheme);

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    SidenavComponent,
    HeaderComponent,
    DashboardComponent,
    LoginComponent,
    QuestionnairesComponent,
    SurveyComponent,
    AddQuestionnairesComponent,
    ConfigurationComponent,
    AddIndustryComponent,
    AddDimensionComponent,
    FrontEndDashboardComponent,
    FrontendHeaderComponent,
    FrontendFooterComponent,
    FrontendQuestionnaireComponent,
    ResultComponent,
    PrintScreenComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgApexchartsModule,
    FusionChartsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    NgxMaterialTimepickerModule,
    BrowserAnimationsModule,
    NgbModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-center',
      closeButton: true,
      preventDuplicates: true,
    }),
    TextareaAutosizeModule,
    AccordionModule.forRoot(),
    GaugeChartModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
