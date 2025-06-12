import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  apiUrl = environment.apiUrl + 'eventos/';
  http = inject(HttpClient);

  constructor() { }

  httpOptions= {
    headers: new HttpHeaders({
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

  getEventosDePartidoPorTipo(id:number, tipo:number):Observable<any>{
    return this.http.get(`${this.apiUrl}${id}/${tipo}`, this.httpOptions).pipe(retry(2), catchError(this.handleError));
  }

  getNumEventos():Observable<any>{
    return this.http.get(`${this.apiUrl}numero/de/eventos/`, this.httpOptions).pipe(retry(2), catchError(this.handleError));
  }

  getEventosPorJugadorPorPartido(idPartido:number, idJugador:any):Observable<any>{
    return this.http.get(`${this.apiUrl}jugador/${idPartido}/${idJugador}`, this.httpOptions).pipe(retry(2), catchError(this.handleError));
  }

  crearEvento(evento:any):Observable<any>{
    return this.http.post(`${this.apiUrl}`,JSON.stringify(evento), this.httpOptions).pipe(retry(2), catchError(this.handleError));
  }

}
