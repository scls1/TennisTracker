import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SetService {
  apiUrl = environment.apiUrl + 'sets/';
  http = inject(HttpClient);

  constructor() { }

  httpOptions= {
    headers: new HttpHeaders ({
      'Content-Type': 'application/json',
      'x-token': localStorage.getItem('token') || ''
    })
  }


  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.log("Ha ocurrido un error: ",error, error.message);
    
    }else {
      console.error(`Codigo Error ${error.status}, +Body: ${error.error}`);
    }
  
    return throwError ('Ha sucedido un problema, reintentalo más tarde');
  }

  getSets(idSet?:number):Observable<any>{
    return this.http.get(`${this.apiUrl}${idSet}`, this.httpOptions).pipe(retry(2), catchError(this.handleError));
  }

  getSetsPorPartido(idPartido:number):Observable<any>{
    return this.http.get(`${this.apiUrl}partido/${idPartido}`, this.httpOptions).pipe(retry(2), catchError(this.handleError));
  }

  createSet(resultado:any):Observable<any>{
    return this.http.post(`${this.apiUrl}`,JSON.stringify(resultado),this.httpOptions).pipe(retry(2),catchError(this.handleError));
  }
  updateSet(setId:number, set:any):Observable<any>{
    return this.http.put(`${this.apiUrl}/${setId}`,JSON.stringify(set),this.httpOptions).pipe(retry(2),catchError(this.handleError));
  }
  
  
}
