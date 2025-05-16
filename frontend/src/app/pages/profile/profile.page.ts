import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonAvatar, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonImg, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { TopbarComponent } from 'src/app/topbar/topbar.component';
import { UsuarioService } from 'src/app/services/usuario.service';
import { jwtDecode } from 'jwt-decode';
import { JugadorService } from 'src/app/services/jugador.service';
import { PartidoService } from 'src/app/services/partido.service';
import { SetService } from 'src/app/services/set.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonAvatar,
    IonImg,
    IonIcon,
    IonContent,
    TopbarComponent
  ]
})
export class ProfilePage implements OnInit {
  private setService = inject(SetService);
  private partidoService = inject(PartidoService);
  private jugadorService = inject(JugadorService); 
  private entrenadorService = inject(UsuarioService);
  private token = localStorage.getItem('token') || '';
  private userId: number | undefined = undefined;
  private jugadores: number[] = [];

  public userFoto: string = '';
  public userName: string = '';
  public numJugadores: number = 0;
  public individuales : number[] = [];
  public individualesGanados : number = 0;
  public dobles : number[] = [];
  public doblesGanados : number = 0;


  constructor() { }

  ngOnInit() {
    if (this.token) {
      const decoded = jwtDecode(this.token);
      this.userId = decoded.id;
    } else {
      console.warn('No hay token disponible');
    }
    
    this.entrenadorService.getUsuario(this.userId).subscribe((response: any) => {
      this.userFoto = response.usuario.Foto;
      this.userName = response.usuario.Nombre;
    })

    this.jugadorService.getJugadoresPorEntrenador(this.userId).subscribe((response:any) => {
      this.numJugadores = response.jugadores.length;
      for(let i = 0; i < response.jugadores.length; i++){
        this.jugadores.push(response.jugadores[i].IdJugador);
      }
    })
    
    if(this.userId){
      this.partidoService.getPartidoByEntrenador(this.userId).subscribe((response:any) =>{
        for(let i = 0; i < response.partidos.length; i++){
          if(response.partidos[i].Tipo){
            this.dobles.push(response.partidos[i].IdPartido);
            this.setService.getSetsPorPartido(response.partidos[i].IdPartido).subscribe((response:any) => {
              this.calcularGanador(response.sets, true);
            });
          }else{
            this.individuales.push(response.partidos[i].IdPartido);
            this.setService.getSetsPorPartido(response.partidos[i].IdPartido).subscribe((response:any) => {
              this.calcularGanador( response.sets, false);
            });
          }
        }
      });
    }
  }

  calcularGanador( sets: any, tipo: boolean){
    let setsJugador = 0;
    let setsRival = 0;


    for(let i = 0; i < sets.length; i++){
      if(sets[i].marcador1 > sets[i].marcador2)
        setsJugador++;
    
      if(sets[i].marcador1 < sets[i].marcador2)
        setsRival++;
      }
    if(setsJugador > setsRival){
      if(tipo){
        this.doblesGanados++;
      }else{
        this.individualesGanados++;
      }
    }
      
  }

}
