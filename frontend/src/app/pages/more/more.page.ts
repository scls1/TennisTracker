import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonTitle, IonToolbar, NavController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cartOutline, closeOutline, contrastOutline, informationCircleOutline, logOutOutline, moonOutline, sunnyOutline } from 'ionicons/icons';
import { Router, RouterLink } from '@angular/router';
import { HistorialService } from 'src/app/services/historial.service';

@Component({
  selector: 'app-more',
  templateUrl: './more.page.html',
  styleUrls: ['./more.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonList, IonItem, IonIcon, IonLabel, RouterLink]
})
export class MorePage implements OnInit {
  isDark = localStorage.getItem('dark-mode') === 'true';
  private nav = inject(NavController);
  private historialService = inject(HistorialService);

  constructor(private router: Router) { 
    addIcons({
      logOutOutline,
      contrastOutline,
      cartOutline,
      informationCircleOutline,
      closeOutline,
      sunnyOutline,
      moonOutline
    })
   }

  ngOnInit() {
   
  }

  logout(){
    localStorage.removeItem('token');
    this.nav.navigateForward('/login');
  }
  navigateBack(){
    this.historialService.goBack(this.router);
  }
  
  toggleDarkMode() {
    this.isDark = !document.documentElement.classList.contains('ion-palette-dark');
    document.documentElement.classList.toggle('ion-palette-dark', this.isDark);
    localStorage.setItem('dark-mode', this.isDark.toString());
  }
}
