import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { TopbarComponent } from 'src/app/topbar/topbar.component';

@Component({
  selector: 'app-create-partido',
  templateUrl: './create-partido.page.html',
  styleUrls: ['./create-partido.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, TopbarComponent]
})
export class CreatePartidoPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
