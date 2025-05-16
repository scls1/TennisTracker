import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PartidoService {
  http = inject(HttpClient);
  apiUrl= environment.apiUrl + 'partidos/';
  
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
      console.error(`Codigo Error ${error.status}, + Body: ${error.error}`);
    }
  
    return throwError ('Ha sucedido un problema, reintentalo más tarde');
  }

  getPartidos(): Observable<any> {
    return this.http.get(`${this.apiUrl}`,this.httpOptions).pipe(retry(2),catchError(this.handleError));
  }

  getPartidoById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`,this.httpOptions).pipe(retry(2),catchError(this.handleError));
  }

  getPartidoByJugador(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}jugador/${id}`,this.httpOptions).pipe(retry(2),catchError(this.handleError));
  }

  getPartidoByEntrenador(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}entrenador/${id}`,this.httpOptions).pipe(retry(2),catchError(this.handleError));
  }

  createPartido(partido: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, JSON.stringify(partido),this.httpOptions).pipe(retry(2),catchError(this.handleError));
  }

  updatePartido(id: number, partido: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, JSON.stringify(partido),this.httpOptions).pipe(retry(2),catchError(this.handleError));
  }

  deletePartido(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`,this.httpOptions).pipe(retry(2),catchError(this.handleError));
  }
}
