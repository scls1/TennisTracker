import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);  // Inyectamos el router

  // Comprobamos si el token está presente en localStorage
  const token = localStorage.getItem('token');

  // Si no hay token, redirige al login
  if (!token) {
    router.navigate(['/login']);  // Redirige a la página de login
    return false;
  }
  try {
    const decoded: any = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);

    // Si el token ha caducado, redirige al login
    if (decoded.exp < currentTime) {
      console.warn('Token expirado');
      router.navigate(['/login']);
      return false;
    }

    // Token válido
    return true;

  } catch (error) {
    console.error('Error al decodificar token', error);
    router.navigate(['/login']);
    return false;
  }

};
