import { SurveyComponent } from './_components/admin/survey/survey.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from "../app/_components/admin/dashboard/dashboard.component";
import { FrontEndDashboardComponent } from "../app/_components/frontend/dashboard/dashboard.component";
import { LoginComponent } from "../app/_components/admin/login/login.component";
import { ConfigurationComponent } from './_components/admin/configuration/configuration.component';
import { AddQuestionnairesComponent } from './_components/admin/questionnaires/add/add.component';
import { QuestionnairesComponent } from './_components/admin/questionnaires/questionnaires.component';
import { AuthGuard } from './_helpers/auth.guard';
import { FrontendQuestionnaireComponent } from './_components/frontend/frontend-questionnaire/frontend-questionnaire.component';
import { ResultComponent } from './_components/frontend/result/result.component';
import { AddIndustryComponent } from './_components/admin/configuration/add_industry/add.component';
import { AddDimensionComponent } from './_components/admin/configuration/add_dimension/add.component';
import { PrintScreenComponent } from './_components/frontend/print-screen/print-screen.component';

const routes: Routes = [
  { path: 'admin', component: LoginComponent },
  { path: 'admin/home', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'admin/questionnaires', component: QuestionnairesComponent, canActivate: [AuthGuard] },
  { path: 'admin/add-questionnaire', component: AddQuestionnairesComponent, canActivate: [AuthGuard] },
  { path: 'admin/configuration', component: ConfigurationComponent, canActivate: [AuthGuard]},
  { path: 'admin/add-industry', component: AddIndustryComponent, canActivate: [AuthGuard] },
  { path: 'admin/add-dimension', component: AddDimensionComponent, canActivate: [AuthGuard] },
  { path: 'admin/users', component: SurveyComponent, canActivate: [AuthGuard] },
  
  { path: '', component: FrontEndDashboardComponent},
  { path: 'questionnaires', component: FrontendQuestionnaireComponent },
  { path: 'results', component: ResultComponent },
  { path: 'print', component: PrintScreenComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
