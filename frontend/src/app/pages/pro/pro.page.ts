import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { TopbarComponent } from 'src/app/topbar/topbar.component';

@Component({
  selector: 'app-pro',
  templateUrl: './pro.page.html',
  styleUrls: ['./pro.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, TopbarComponent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle, IonButton]
})
export class ProPage implements OnInit {
  alertController = inject(AlertController);
  public isDark = localStorage.getItem('dark-mode') === 'true';
  constructor() { }
  
  ngOnInit() {
  }
  
  async comingSoon(){
    const alert = await this.alertController.create({
    header: 'Coming Soon!',
    message: 'Premium versions will be out soon!',
    buttons: [
      {
        text: 'Ok',
        role: 'cancel'
      },
      
    ]
  });

  await alert.present();
  }


}
