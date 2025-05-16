import { Component, inject } from '@angular/core';
import {  FormsModule } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { IonApp, IonRouterOutlet, provideIonicAngular } from '@ionic/angular/standalone';
import { HistorialService } from './services/historial.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [
    IonApp, 
    IonRouterOutlet,
    FormsModule
  ],
})
export class AppComponent {
  historialService = inject(HistorialService);
  constructor(private router: Router) {}
  ngOnInit() {
    const prefersDark = localStorage.getItem('dark-mode') === 'true';
    document.documentElement.classList.toggle('ion-palette-dark', prefersDark);

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.historialService.saveNavigation(event.urlAfterRedirects);
      }
    });
    
  }
}
