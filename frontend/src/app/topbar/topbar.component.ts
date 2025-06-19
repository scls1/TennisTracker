import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertController, IonButton, IonButtons, IonHeader, IonIcon, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline, playOutline, trashOutline } from 'ionicons/icons';
import { Router, RouterModule } from '@angular/router';
import { HistorialService } from '../services/historial.service';
import { SetService } from '../services/set.service';
import { PartidoService } from '../services/partido.service';
import { JugadorService } from '../services/jugador.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  imports: [ RouterModule, CommonModule, IonHeader, IonToolbar, IonButton, IonButtons, IonIcon],
  standalone: true
})
export class TopbarComponent  implements OnInit {
  public lastPage: string | null = null;
  private idPartido: number | null = null;
  private idJugador: number | null = null;
  
  alertController = inject(AlertController);
  historialService = inject(HistorialService);
  apiSets = inject(SetService);
  apiPartidos = inject(PartidoService);
  apiJugadores = inject(JugadorService);

  constructor(private router: Router) { 
    addIcons({ chevronBackOutline, playOutline, trashOutline });
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

  partidoEnCurso(): boolean {
    const urlEsDetalle = this.router.url.startsWith('/detalle-partido/');
    const urlPartes = this.router.url.split('/');
    const index = urlPartes.indexOf('detalle-partido');
    if (index !== -1 && urlPartes[index + 1]) {
      this.idPartido = Number(urlPartes[index + 1]);
    }
    const partidoAcabado = this.historialService.getPartidoTerminado();
    if(partidoAcabado !== null){
      return urlEsDetalle && !partidoAcabado;

    }else{
      return false;
    }

  }

  esPartido(): boolean{
    const urlEsDetalle = this.router.url.startsWith('/detalle-partido/');
    const urlPartes = this.router.url.split('/');
    const index = urlPartes.indexOf('detalle-partido');
    if (index !== -1 && urlPartes[index + 1]) {
      this.idPartido = Number(urlPartes[index + 1]);
    }
    return urlEsDetalle;
  }

  esJugador(): boolean{
    const urlEsDetalle = this.router.url.startsWith('/detalle-player/');
    const urlPartes = this.router.url.split('/');
    const index = urlPartes.indexOf('detalle-player');
    if (index !== -1 && urlPartes[index + 1]) {
      this.idJugador = Number(urlPartes[index + 1]);
    }
    return urlEsDetalle;
  }

  async retomarPartido(){
    const alert = await this.alertController.create({
    header: 'Resume Match',
    message: 'Do you want to resume this match?',
    buttons: [
      {
        text: 'No',
        role: 'cancel'
      },
      {
        text: 'Yes',
        handler: () => {
          this.router.navigateByUrl(`/partido/${this.idPartido}`);
        }
      }
    ]
  });

  await alert.present();
  }

  async borrarPartido(){
    const alert = await this.alertController.create({
    header: 'Delete Match',
    message: 'Are you sure you want to delete this match?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel'
      },
      {
        text: 'Delete',
        handler: () => {
          if(this.idPartido){
            this.apiPartidos.deletePartido(this.idPartido).subscribe((response:any) => {
              console.log(response)
              if(response.ok){
                window.location.href = '/home';
              }
            });

          }
          
        }
      }
    ]
  });

  await alert.present();
  }

  async borrarJugador(){
    const alert = await this.alertController.create({
    header: 'Delete Player',
    message: 'Are you sure you want to delete this player?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel'
      },
      {
        text: 'Delete',
        handler: () => {
          if(this.idJugador){
            this.apiJugadores.deleteJugador(this.idJugador).subscribe((response:any) => {
              console.log(response)
              if(response.ok){
                window.location.href = '/players';
              }
            });

          }
          
        }
      }
    ]
  });

  await alert.present();
  }
}
