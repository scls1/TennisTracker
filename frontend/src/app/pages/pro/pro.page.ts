import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { TopbarComponent } from 'src/app/topbar/topbar.component';

@Component({
  selector: 'app-pro',
  templateUrl: './pro.page.html',
  styleUrls: ['./pro.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, TopbarComponent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle, IonButton]
})
export class ProPage implements OnInit {
  public isDark = localStorage.getItem('dark-mode') === 'true';
  constructor() { }
  
  ngOnInit() {
  }
  
  ionViewWillEnter() {
    this.isDark = localStorage.getItem('dark-mode') === 'true';
  }


}
