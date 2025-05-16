import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  http = inject(HttpClient);
  apiUrl = environment.apiUrl;

  constructor() { }

  httpOptions= {
    headers: new HttpHeaders ({
      'Content-Type': 'application/json'
    })
  }

  handleError(error: HttpErrorResponse){
    if (error.error instanceof ErrorEvent) {
      console.log("Ha ocurrido un error: ",error, error.message);
    
    }else {
      console.error("Codigo Error $ {error.status}, "+"Body: ${error.error}");
    }
    return throwError('Ha sucedido un problema, reintentalo más tarde');
  }

  register(usuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}usuarios/`, JSON.stringify(usuario),this.httpOptions).pipe(retry(2),catchError(this.handleError));
  }

  loguear(usuario:any):Observable<any>{
    return this.http.post(`${this.apiUrl}login/`, JSON.stringify(usuario),this.httpOptions).pipe(retry(2),catchError(this.handleError));
  }
}
