import { AuthenticationService } from '../_service/authentication.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError, first, map, take } from 'rxjs/operators';
import { User } from '../_models/user.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private authService: AuthenticationService
  ) {}
  public processError(error: any): Observable<any> {
    let title = '';
    let errorJson;
    if (error && error.json) {
      errorJson = error.json();
    } else {
      errorJson = error;
    }
    switch (error.status) {
      default:
        title = 'Api Internal Error';
        this.toastr.error(error, title);
        break;
    }

    return throwError(error);
  }

  public users(): Observable<any> {
    return this.http
      .get<User>(`${environment.api}/users`)
      .pipe(catchError((error: any) => this.processError(error)));
  }

  readAll(uri: string): Observable<any> {
    return this.http
      .get<any>(`${environment.api}/${uri}`)
      .pipe(catchError((error: any) => this.processError(error)));
  }
  readAllById(uri: string, id: any): Observable<any> {
    return this.http
      .get<any>(`${environment.api}/${uri}?id=${id}`)
      .pipe(catchError((error: any) => this.processError(error)));
  }
  readAllByWareHouseId(uri: string, id: any): Observable<any> {
    return this.http
      .get<any>(`${environment.api}/${uri}?warehouse=${id}`)
      .pipe(catchError((error: any) => this.processError(error)));
  }
  readSingle(uri: string, id: any): Observable<any> {
    return this.http
      .get<any>(`${environment.api}/${uri}/${id}`)
      .pipe(catchError((error: any) => this.processError(error)));
  }
  checkExists(uri: string, id: any): Observable<any> {
    return this.http
      .get<any>(`${environment.api}/${uri}/${id}`)
      .pipe(catchError((error: any) => this.processError(error)));
  }
  create(uri: string, data: any): Observable<any> {
    return this.http
      .post<any>(`${environment.api}/${uri}`, data)
      .pipe(catchError((error: any) => this.processError(error)));
  }
  update(uri: string, data: any, id: any): Observable<any> {
    return this.http
      .put<any>(`${environment.api}/${uri}/${id}`, data)
      .pipe(catchError((error: any) => this.processError(error)));
  }

  deleteIndex(uri: string, productIndex: string): Observable<any> {
    return this.http
      .delete<any>(`${environment.api}/${uri}/${productIndex}`)
      .pipe(catchError((error: any) => this.processError(error)));
  }
}
