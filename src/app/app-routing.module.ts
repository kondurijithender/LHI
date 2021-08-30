import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from "../app/_components/dashboard/dashboard.component";
import { LoginComponent } from "../app/_components/login/login.component";
import { ConfigurationComponent } from './_components/configuration/configuration.component';
import { AddQuestionnairesComponent } from './_components/questionnaires/add/add.component';
import { QuestionnairesComponent } from './_components/questionnaires/questionnaires.component';
import { AuthGuard } from './_helpers/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'questionnaires', component: QuestionnairesComponent, canActivate: [AuthGuard] },
  { path: 'add-questionnaire', component: AddQuestionnairesComponent, canActivate: [AuthGuard] },
  { path: 'configuration', component: ConfigurationComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
