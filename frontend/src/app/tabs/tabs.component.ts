import { CommonModule } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonModal, IonTabBar, IonTabButton, IonTabs, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, chevronBackOutline, homeOutline, menuOutline, peopleOutline, personAddOutline, personOutline, statsChartOutline, tennisballOutline } from 'ionicons/icons';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  imports: [CommonModule, RouterModule, IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs, IonModal, IonButton, IonHeader, IonToolbar, IonButtons, IonTitle, IonContent, IonItem, IonInput, FormsModule, IonList],
  standalone: true,
})
export class TabsComponent  implements OnInit {
  constructor(private router: Router) { 
    addIcons({ homeOutline, peopleOutline, personOutline, menuOutline, chevronBackOutline, addOutline, tennisballOutline, personAddOutline, statsChartOutline });
  }

  ngOnInit() {

  }

  saveNavigation(url: string) {
    let history = JSON.parse(localStorage.getItem('nav-history') || '[]');
  
    // Evita guardar la misma URL dos veces seguidas
    if (history[history.length - 1] !== url) {
      history.push(url);
      localStorage.setItem('nav-history', JSON.stringify(history));
    }
  }

  async navigateAndClose(path: string) {
    const modal = document.querySelector('ion-modal');
    if (modal) {
      await (modal as HTMLIonModalElement).dismiss();
    }
    this.router.navigateByUrl(path);
  }

  
}
