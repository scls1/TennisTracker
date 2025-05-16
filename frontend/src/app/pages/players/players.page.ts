import { Component, inject, OnInit } from '@angular/core';
import { CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonAvatar, IonButton, IonButtons, IonCard, IonCardContent, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonRow, IonSearchbar, IonTitle, IonToolbar, ModalController, PopoverController } from '@ionic/angular/standalone';
import { TopbarComponent } from 'src/app/topbar/topbar.component';
import { addIcons } from 'ionicons';
import { accessibilityOutline, calendarOutline, femaleOutline, funnelOutline, maleOutline } from 'ionicons/icons';
import { JugadorService } from 'src/app/services/jugador.service';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-players',
  templateUrl: './players.page.html',
  styleUrls: ['./players.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonTitle,
    TopbarComponent,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonItem,
    IonLabel,
    IonList,
    IonSearchbar,
    IonCard,
    IonIcon,
    IonAvatar,
    IonCardContent,
  ]
})
export class PlayersPage implements OnInit {
  apiJugadores = inject(JugadorService);
  router = inject(Router)
  private token: string | null = null;
  private userId : number | undefined = undefined;

  public buscador: string = '';
  public nombres: string[] = [];
  public jugadores: any[] = [];
  public results : string[] = [];
  public error: string = '';
 

  constructor() {}

  ngOnInit() {
    this.token = localStorage.getItem('token');
    if(this.token){
      const decoded = jwtDecode(this.token);
      this.userId = decoded.id;
    }
    
    addIcons({funnelOutline, femaleOutline, maleOutline, accessibilityOutline, calendarOutline});
  }

  ionViewWillEnter() {
    
    this.apiJugadores.getJugadoresPorEntrenador(this.userId).subscribe((response:any) => {
      for(let i= 0; i< response.jugadores.length; i++){
        this.results[i] = this.nombres[i] = response.jugadores[i].Nombre;
        this.jugadores[i] = response.jugadores[i];
      };
      if(this.jugadores.length == 0){
        this.error = response.msg;
      }
    });
  }
 

  filtrarPartidos(event: Event){
    const target = event.target as HTMLIonSearchbarElement;
    const query = target.value?.toLowerCase() || '';
    this.results = this.nombres.filter((d) => d.toLowerCase().includes(query));
  }


  goToDetail(id: string) {
    this.router.navigate(['/detalle-player', id]);
  }
}
