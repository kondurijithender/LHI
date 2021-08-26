import { AdminCreateComponent } from './_components/admin/admin-create/admin-create.component';
import { AdminComponent } from './_components/admin/admin.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from "../app/_components/dashboard/dashboard.component";
import { DistributorComponent } from "../app/_components/distributor/distributor.component";
import { DistributorsListComponent } from "../app/_components/distributors-list/distributors-list.component";
import { AddDistributorComponent } from "../app/_components/add-distributor/add-distributor.component";
import { ProductInvetoryComponent } from "../app/_components/product-invetory/product-invetory.component";
import { OrderManagementComponent } from "../app/_components/order-management/order-management.component";
import { OrderInvoiceComponent } from "../app/_components/order-invoice/order-invoice.component";
import { AccountManagementComponent } from "../app/_components/account-management/account-management.component";
import { LoginComponent } from "../app/_components/login/login.component";
import { AuthGuard } from './_helpers/auth.guard';
import { RoutesListComponent } from './_components/routes-list/routes-list.component';
import { AddRouteComponent } from './_components/add-route/add-route.component';
import { WarehousesComponent } from './_components/warehouses/warehouses.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'warehouses', component: WarehousesComponent, canActivate: [AuthGuard] },
  { path: 'routes', component: RoutesListComponent, canActivate: [AuthGuard] },
  { path: 'add-route', component: AddRouteComponent, canActivate: [AuthGuard] },
  { path: 'distributor', component: DistributorComponent, canActivate: [AuthGuard] },
  { path: 'distributors', component: DistributorsListComponent, canActivate: [AuthGuard] },
  { path: 'add-distributor', component: AddDistributorComponent, canActivate: [AuthGuard]},
  { path: 'products', component: ProductInvetoryComponent, canActivate: [AuthGuard] },
  { path: 'orders', component: OrderManagementComponent, canActivate: [AuthGuard] },
  { path: 'order-invoice', component: OrderInvoiceComponent, canActivate: [AuthGuard] },
  { path: 'account-management', component: AccountManagementComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
  { path: 'add-admin', component: AdminCreateComponent, canActivate: [AuthGuard] },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
