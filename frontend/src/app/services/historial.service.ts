import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HistorialService {
  private rutasIgnoradas = ['/login', '/registro'];

  constructor() { }

  // utils/historial.ts o en un servicio
saveNavigation(url: string) {
  if (this.rutasIgnoradas.includes(url)) return;

  let history = JSON.parse(localStorage.getItem('nav-history') || '[]');
  if (history[history.length - 1] !== url) {
    history.push(url);

    // Limita a las últimas 30 rutas
    if (history.length > 30) {
      history = history.slice(history.length - 30);
    }

    localStorage.setItem('nav-history', JSON.stringify(history));
  }
}

goBack(router: Router) {
  let history = JSON.parse(localStorage.getItem('nav-history') || '[]');

  history.pop(); // página actual
  const previousUrl = history.pop(); // anterior

  if (previousUrl) {
    localStorage.setItem('nav-history', JSON.stringify(history));
    router.navigateByUrl(previousUrl);
  } else {
    console.warn('No hay historial para volver.');
    // Opcional: router.navigate(['/home']); o donde quieras llevar por defecto
  }
}

}
