import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { environment } from '../environments/environment';
import { SidenavComponent } from './_common/sidenav/sidenav.component';
import { DashboardComponent } from './_components/dashboard/dashboard.component';
import { HeaderComponent } from './_common/header/header.component';
import { DistributorComponent } from './_components/distributor/distributor.component';
import { DistributorsListComponent } from './_components/distributors-list/distributors-list.component';
import { AddDistributorComponent } from './_components/add-distributor/add-distributor.component';
import { ProductInvetoryComponent } from './_components/product-invetory/product-invetory.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OrderManagementComponent } from './_components/order-management/order-management.component';
import { OrderInvoiceComponent } from './_components/order-invoice/order-invoice.component';
import { AccountManagementComponent } from './_components/account-management/account-management.component';
import { OrderSearchPipe } from './_pipes/order-search.pipe';
import { SearchHighlightDirective } from './_directive/search-highlight.directive';
import { LoginComponent } from './_components/login/login.component';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { AlertComponent } from './_alert';
import { ToastrModule } from 'ngx-toastr';
import { AddRouteComponent } from './_components/add-route/add-route.component';
import { RoutesListComponent } from './_components/routes-list/routes-list.component';
import { NumOnlyDirective } from './_directive/num-only.directive';
import { ImagePreloadDirective } from './_directive/Image-preload.directive';
import { AdminComponent } from './_components/admin/admin.component';
import { AdminCreateComponent } from './_components/admin/admin-create/admin-create.component';
import { WarehousesComponent } from './_components/warehouses/warehouses.component';


@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    SidenavComponent,
    HeaderComponent,
    DashboardComponent,
    DistributorComponent,
    DistributorsListComponent,
    AddDistributorComponent,
    ProductInvetoryComponent,
    OrderManagementComponent,
    OrderInvoiceComponent,
    AccountManagementComponent,
    OrderSearchPipe,
    SearchHighlightDirective,
    LoginComponent,
    AddRouteComponent,
    RoutesListComponent,
    NumOnlyDirective,
    ImagePreloadDirective,
    AdminComponent,
    AdminCreateComponent,
    WarehousesComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
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
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
