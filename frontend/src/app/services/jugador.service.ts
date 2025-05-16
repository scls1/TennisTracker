import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JugadorService {
  apiUrl = environment.apiUrl + 'jugadores/';
  http = inject(HttpClient);
  
  constructor() { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'x-token': localStorage.getItem('token') || ''
    })
  }

  handleError(error: HttpErrorResponse){
    if (error.error instanceof ErrorEvent) {
      console.log("Ha ocurrido un error: ",error, error.message);
    }else{
      console.error("Codigo Error ${error.status}, "+"Body: ${error.error}");
    }
    return throwError ('Ha sucedido un problema, reintentalo más tarde');
  }

  getJugadores(idJugador?: number):Observable<any>{
    return this.http.get(`${this.apiUrl}${idJugador}`, this.httpOptions).pipe(retry(2), catchError(this.handleError));
  }


  getJugadoresPorEntrenador(idEntrenador?:number):Observable<any>{
    return this.http.get(`${this.apiUrl}entrenador/${idEntrenador}`, this.httpOptions).pipe(retry(2),catchError(this.handleError));
  }

  getJugadorPorId(id?:number):Observable<any>{
    return this.http.get(`${this.apiUrl}${id}`, this.httpOptions).pipe(retry(2),catchError(this.handleError));
  }

  createJugador(jugador:any):Observable<any>{
    return this.http.post(`${this.apiUrl}`,JSON.stringify(jugador),this.httpOptions).pipe(retry(2),catchError(this.handleError));
  }

}
