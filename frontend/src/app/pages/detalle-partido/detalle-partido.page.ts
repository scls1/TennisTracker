import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonRow, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { TopbarComponent } from 'src/app/topbar/topbar.component';
import { ActivatedRoute } from '@angular/router';
import { PartidoService } from 'src/app/services/partido.service';
import { forkJoin, map, mergeMap, Observable, of, switchMap } from 'rxjs';
import { JugadorService } from 'src/app/services/jugador.service';
import { SetService } from 'src/app/services/set.service';
import { GameService } from 'src/app/services/game.service';
import { PuntoService } from 'src/app/services/punto.service';
import { EventoService } from 'src/app/services/evento.service';

@Component({
  selector: 'app-detalle-partido',
  templateUrl: './detalle-partido.page.html',
  styleUrls: ['./detalle-partido.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,TopbarComponent, IonCard, IonCardContent, IonGrid, IonCol, IonRow, IonCardHeader, IonCardTitle]
})
export class DetallePartidoPage implements OnInit {
  apiPartidos = inject(PartidoService);
  apiSets = inject(SetService);
  apiJugadores = inject(JugadorService);
  apiGames = inject(GameService);
  apiPuntos = inject(PuntoService);
  apiEventos = inject(EventoService);

  private idString: string | null = null;
  private partidoId: number;
  private jugadores: any[] = [];
  
  public isDark = localStorage.getItem('dark-mode') === 'true';
  public partido: any;
  public marcador: any;
  public estadisticasServicio = [
    { nombre: 'Aces', valorJugador1: 0, valorJugador2: 0 },
    { nombre: 'Doubles faults', valorJugador1: 0, valorJugador2: 0 },
    { nombre: '1st Serve Percentage', valorJugador1: 0, valorJugador2: 0 },
    { nombre: '1st Serve Points Won', valorJugador1: 0, valorJugador2: 0 },
    { nombre: '2nd Serve Points Won', valorJugador1: 0, valorJugador2: 0 },
  ];
  public estadisticasResto = [
    { nombre: '1st Return Points Won', valorJugador1: 0, valorJugador2: 0 },
    { nombre: '2nd Return Points Won', valorJugador1: 0, valorJugador2: 0 },
  ];
  public estadisticasPuntos = [
    { nombre: 'Winners', valorJugador1: 0, valorJugador2: 0 },
    { nombre: 'Unforced Errors', valorJugador1: 0, valorJugador2: 0 },
    { nombre: 'Forced Errors', valorJugador1: 0, valorJugador2: 0 },
    { nombre: 'Service Points Won', valorJugador1: 0, valorJugador2: 0 },
    { nombre: 'Return Points Won', valorJugador1: 0, valorJugador2: 0 },
    { nombre: 'Total Points Won', valorJugador1: 0, valorJugador2: 0 },
  ];
  public estadisticasGames = [
    { nombre: 'Service Games Won', valorJugador1: 0, valorJugador2: 0 },
    { nombre: 'Return Games Won', valorJugador1: 0, valorJugador2: 0 },
    { nombre: 'Total Games Won', valorJugador1: 0, valorJugador2: 0 },
  ];

  public gamePlaying: boolean = false;
  public puntosGameActual: any = [];
  public ultimoPunto:any;
  private ultimoSet: any;
  

  constructor(private route: ActivatedRoute) {
    this.idString = this.route.snapshot.paramMap.get('id');
    this.partidoId = Number(this.idString);
   }

   ionViewWillEnter() {
    this.isDark = localStorage.getItem('dark-mode') === 'true';
  }

  ngOnInit() {
    this.loadPartidoDetalle();
  }


  loadPartidoDetalle(){
    if(this.partidoId){
      this.apiPartidos.getPartidoById(this.partidoId).pipe(
        switchMap((response: any) => {
          const partido = response.partido;
          this.jugadores.push(partido.Jugador1);
        
          if (!partido.Tipo) {
            this.jugadores.push(partido.Rival1 ? partido.Rival1 : partido.Jugador2);
            return forkJoin({
              id: of(partido.IdPartido),
              nombre1: this.obtenerNombreJugador(partido.Jugador1),
              nombre2: partido.Rival1 ? of(partido.Rival1) : this.obtenerNombreJugador(partido.Jugador2)
            });
        }else{
          if (partido.Pareja) {
            this.jugadores.push(partido.Pareja);
            this.jugadores.push(partido.Rival1 ? partido.Rival1 : partido.Jugador2);
            this.jugadores.push(partido.Rival2 ? partido.Rival2 : partido.Jugador3 ?? partido.Jugador2);
            return forkJoin({
              id: of(partido.IdPartido),
              nombre1: this.obtenerNombreJugador(partido.Jugador1),
              nombre2: of(partido.Pareja),
              nombre3: partido.Rival1
                ? of(partido.Rival1)
                : this.obtenerNombreJugador(partido.Jugador2),
              nombre4: partido.Rival2
                ? of(partido.Rival2)
                : this.obtenerNombreJugador(partido.Jugador3 ?? partido.Jugador2)
            });
          } else {
            this.jugadores.push(partido.Jugador2);
            this.jugadores.push(partido.Rival1 ? partido.Rival1 : partido.Jugador3);
            this.jugadores.push(partido.Rival2 ? partido.Rival2 : partido.Jugador4);
            return forkJoin({
              id: of(partido.IdPartido),
              nombre1: this.obtenerNombreJugador(partido.Jugador1),
              nombre2: this.obtenerNombreJugador(partido.Jugador2),
              nombre3: partido.Rival1
                ? of(partido.Rival1)
                : this.obtenerNombreJugador(partido.Jugador3),
              nombre4: partido.Rival2
                ? of(partido.Rival2)
                : this.obtenerNombreJugador(partido.Jugador4)
            });
          }
        }})
      ).subscribe((partidoResuelto: any) => {
        this.partido = partidoResuelto;
         if(this.partidoId){

     this.apiSets.getSetsPorPartido(this.partidoId).pipe(
            mergeMap((response: any) => {
              const setIds = response.sets
              .map((set: any) => set?.Id)
              .filter((id: any) => id !== undefined);
              
              const setRequests = setIds.map((setId: any) => this.apiSets.getSets(setId));
              
              return forkJoin(setRequests);
            })
    ).subscribe((data: any) => {
          this.marcador = data.map((item: any) => item.set);
          this.cargarEstadisticas();
          
          this.ultimoSet = this.marcador[this.marcador.length - 1];
          

          if (this.ultimoSet.Id) {
          this.apiGames.getGamesPorSet(this.ultimoSet.Id).pipe(
            map((response: any) => {
              const games: any[] = response.games;
              if (!Array.isArray(games)) return null;

              const ultimoGame = games.sort((a, b) => b.numero - a.numero)[0];
              return ultimoGame;
            }),
            switchMap((ultimoGame) => {
              if (!ultimoGame) {
                this.gamePlaying = false;
                return of(null);
              }
              return this.apiPuntos.getPuntosPorGame(ultimoGame.id);
            })
          ).subscribe((puntos: any | null) => {
            if (puntos && puntos.puntos.length > 0 && puntos.puntos[puntos.puntos.length -1].marcador1 !== 60 && puntos.puntos[puntos.puntos.length -1].marcador2 !== 60) {
              this.gamePlaying = true;
              this.puntosGameActual = puntos;
              this.ultimoPunto = puntos.puntos[puntos.puntos.length -1];
            } else {
              this.gamePlaying = false;
            }
          });
          }
        });
  }
  });

  }
  }

  obtenerNombreJugador(idJugador: number): Observable<string> {
    return this.apiJugadores.getJugadores(idJugador).pipe(
      map((response: any) => response.jugador.Nombre)
    );
  }

  cargarEstadisticas(){
    for(let i=0; i<this.jugadores.length; i++){
      if(this.jugadores[i]){
        console.log('jugador1: ', this.jugadores[i]);
        this.apiEventos.getEventosPorJugadorPorPartido(this.partidoId, this.jugadores[i]).subscribe((response:any) => {
          let esDobles = true;
          if(this.jugadores.length===2)
            esDobles = false;
          
          for(const evento of response.eventos){
            let esjugador1 = false;
            let esjugador2 = false;
            if(esDobles){
              if(evento.Id_jugador == this.jugadores[0] || evento.Id_jugador == this.jugadores[1] || evento.Nombre_jugador == this.jugadores[1]){
                esjugador1 = true;
              }else{
                esjugador2 = true;
              }
            } else{
              if(evento.Id_jugador == this.jugadores[0]){
                esjugador1 = true;
              }else if(evento.Nombre_jugador == this.jugadores[1] || evento.Id_jugador == this.jugadores[1]){
                esjugador2 = true;
              }
            }

            switch (evento.Id_evento) {
              case 1:
                if(esjugador1)
                  this.estadisticasServicio[0].valorJugador1 += 1; //ACE
                if(esjugador2)
                  this.estadisticasServicio[0].valorJugador2 += 1;
                break;
              case 2:
                if(esjugador1)
                  this.estadisticasServicio[1].valorJugador1 += 1; //DOBLE_FALTA
                if(esjugador2)
                  this.estadisticasServicio[1].valorJugador2 += 1;
                break;
              case 3:
                if(esjugador1)
                  this.estadisticasServicio[2].valorJugador1 += 1; //PRIMER_SAQUE
                if(esjugador2)
                  this.estadisticasServicio[2].valorJugador2 += 1;
                break;
              case 4:
                if(esjugador1)
                  this.estadisticasServicio[3].valorJugador1 += 1;  //GANADOS_PRIMER_SAQUE
                if(esjugador2)
                  this.estadisticasServicio[3].valorJugador2 += 1;
                break;
              case 5:
                if(esjugador1)
                  this.estadisticasServicio[4].valorJugador1 += 1; //GANADOS_SEGUNDO_SAQUE
                if(esjugador2)
                  this.estadisticasServicio[4].valorJugador2 += 1;
                break;
              case 6:
                if(esjugador1)
                  this.estadisticasResto[0].valorJugador1 += 1; //GANADOS_PRIMERA_DEVOLUCION
                if(esjugador2)
                   this.estadisticasResto[0].valorJugador2 += 1;
                break;
              case 7:
                if(esjugador1)
                  this.estadisticasResto[1].valorJugador1 += 1;//GANADOS_SEGUNDA_DEVOLUCION
                if(esjugador2)
                   this.estadisticasResto[1].valorJugador2 += 1;
                break;
              case 8:
                if(esjugador1)
                  this.estadisticasPuntos[0].valorJugador1 += 1; //WINNER
                if(esjugador2)
                   this.estadisticasPuntos[0].valorJugador2 += 1;
                break;
              case 9:
                if(esjugador1)
                  this.estadisticasPuntos[1].valorJugador1 += 1;//ERROR_NO_FORZADO
                if(esjugador2)
                   this.estadisticasPuntos[1].valorJugador2 += 1;
                break;
              case 10:
                if(esjugador1)
                  this.estadisticasPuntos[2].valorJugador1 += 1; //ERROR_FORZADO
                if(esjugador2)
                   this.estadisticasPuntos[2].valorJugador2 += 1;
                break;
              case 11:
                if(esjugador1)
                  this.estadisticasPuntos[3].valorJugador1 += 1;  //PUNTO_SAQUE
                if(esjugador2)
                   this.estadisticasPuntos[3].valorJugador2 += 1;
                break;
              case 12:
                if(esjugador1)
                  this.estadisticasPuntos[4].valorJugador1 += 1; //PUNTO_RESTO
                if(esjugador2)
                   this.estadisticasPuntos[4].valorJugador2 += 1;
                break;
              case 13:
                if(esjugador1)
                  this.estadisticasGames[0].valorJugador1 += 1; //JUEGO_SAQUE_GANADO
                if(esjugador2)
                   this.estadisticasGames[0].valorJugador2 += 1;
                break;
              case 14:
                if(esjugador1)
                  this.estadisticasGames[1].valorJugador1 += 1; //JUEGO_RESTO_GANADO
                if(esjugador2)
                   this.estadisticasGames[1].valorJugador2 += 1;
                break;
              default:
                console.warn(`Evento desconocido: ${evento.Id_evento}`);
                break;
              }

          }

          if(i==0){
            const numerador = this.estadisticasServicio[2].valorJugador1; 
                            
            const denominador = this.estadisticasServicio[3].valorJugador1 + 
                              this.estadisticasServicio[4].valorJugador1 + 
                              this.estadisticasResto[0].valorJugador2 +
                              this.estadisticasResto[1].valorJugador2;

            this.estadisticasServicio[2].valorJugador1 = numerador
              ? Number(((numerador / denominador) * 100).toFixed(0))
              : 0;

            
          }if(i>0){
            const numerador2 = this.estadisticasServicio[2].valorJugador2; 
                            
            const denominador2 = this.estadisticasPuntos[3].valorJugador2 + this.estadisticasPuntos[4].valorJugador1;

            this.estadisticasServicio[2].valorJugador2 =  numerador2 > 0
              ? Number(((numerador2 / denominador2) * 100).toFixed(0))
              : 0;

            
          }
            

          this.estadisticasPuntos[5].valorJugador1 = this.estadisticasPuntos[3].valorJugador1 + this.estadisticasPuntos[4].valorJugador1;
          this.estadisticasPuntos[5].valorJugador2 = this.estadisticasPuntos[3].valorJugador2 + this.estadisticasPuntos[4].valorJugador2;
          
          this.estadisticasGames[2].valorJugador1 = this.estadisticasGames[0].valorJugador1 + this.estadisticasGames[1].valorJugador1; 
          this.estadisticasGames[2].valorJugador2 = this.estadisticasGames[0].valorJugador2 + this.estadisticasGames[1].valorJugador2;
        });     
      }
    }
  }
    
}
