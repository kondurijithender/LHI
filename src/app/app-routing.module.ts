import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from "../app/_components/admin/dashboard/dashboard.component";
import { FrontEndDashboardComponent } from "../app/_components/frontend/dashboard/dashboard.component";
import { LoginComponent } from "../app/_components/admin/login/login.component";
import { ConfigurationComponent } from './_components/admin/configuration/configuration.component';
import { AddQuestionnairesComponent } from './_components/admin/questionnaires/add/add.component';
import { QuestionnairesComponent } from './_components/admin/questionnaires/questionnaires.component';
import { AuthGuard } from './_helpers/auth.guard';

const routes: Routes = [
  { path: '', component: FrontEndDashboardComponent},
  { path: 'admin', component: LoginComponent },
  { path: 'admin/home', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'admin/questionnaires', component: QuestionnairesComponent, canActivate: [AuthGuard] },
  { path: 'admin/add-questionnaire', component: AddQuestionnairesComponent, canActivate: [AuthGuard] },
  { path: 'admin/configuration', component: ConfigurationComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
