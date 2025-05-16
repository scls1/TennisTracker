import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton, IonButtons, IonHeader, IonIcon, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { Router, RouterModule } from '@angular/router';
import { HistorialService } from '../services/historial.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  imports: [ RouterModule, CommonModule, IonHeader, IonToolbar, IonButton, IonButtons, IonIcon],
  standalone: true
})
export class TopbarComponent  implements OnInit {
  public lastPage: string | null = null;
  historialService = inject(HistorialService);

  constructor(private router: Router) { 
    addIcons({ chevronBackOutline });
  }

  ngOnInit() {
  }

  navigateBack(){
    this.historialService.goBack(this.router);
  }

  hayHistorial(): boolean {
    const history = JSON.parse(localStorage.getItem('nav-history') || '[]');
    return history.length > 1;
  }

}
