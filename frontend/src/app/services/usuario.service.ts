import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  http = inject(HttpClient);
  apiUrl = environment.apiUrl + 'usuarios/'

  constructor() { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'aplplication/json',
      'x-token': localStorage.getItem('token') || ''
    })
  }

  handleError(error: HttpErrorResponse){
    if (error.error instanceof ErrorEvent) {
          console.log("Ha ocurrido un error: ",error, error.message);
        
        }else {
          console.error("Codigo Error $ {error.status}, "+"Body: ${error.error}");
        }
      
        return throwError ('Ha sucedido un problema, reintentalo más tarde');
    }

    getUsuario(idUsuario?:number):Observable<any>{
      return this.http.get(`${this.apiUrl}${idUsuario}`, this.httpOptions).pipe(retry(2), catchError(this.handleError));
    }
}
