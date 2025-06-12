import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonRow, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { TopbarComponent } from 'src/app/topbar/topbar.component';
import { forkJoin, map, mergeMap, Observable, of, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { JugadorService } from 'src/app/services/jugador.service';
import { SetService } from 'src/app/services/set.service';
import { PartidoService } from 'src/app/services/partido.service';
import { addIcons } from 'ionicons';
import { tennisballOutline } from 'ionicons/icons';
import { PuntoService } from 'src/app/services/punto.service';
import { GameService } from 'src/app/services/game.service';
import { EventoService } from 'src/app/services/evento.service';

@Component({
  selector: 'app-partido',
  templateUrl: './partido.page.html',
  styleUrls: ['./partido.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    TopbarComponent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonIcon
  ]
})
export class PartidoPage implements OnInit {
  apiPartidos = inject(PartidoService);
  apiJugadores = inject(JugadorService);
  apiPuntos = inject(PuntoService);
  apiGames = inject(GameService);
  apiSets = inject(SetService);
  apiEventos = inject(EventoService);
  router = inject(Router);

  private idString: string | null = null;
  private partidoId: number | undefined = undefined;
  private ultimoSet: any;
  private ultimoGame: any;
  public ultimoPunto:any;
  private partidoAcabado: boolean = false;
  private jugadores: any[] = [];
  private historial : string[] = []; 
  private primerSaque: boolean = true;

  public isDark = localStorage.getItem('dark-mode') === 'true';
  public partido: any;
  public marcador: any;
  
  public estado: string = 'inicial';
  public gamePlaying: boolean = false;
  public sacador: any;
  public puntosGameActual: any = [];
  
  constructor(private route: ActivatedRoute) {
    addIcons({tennisballOutline})
    this.idString = this.route.snapshot.paramMap.get('id');
    this.partidoId = Number(this.idString);
   }

   ionViewWillEnter() {
    this.isDark = localStorage.getItem('dark-mode') === 'true';
  }

  ngOnInit() {
    this.loadPartidoDetalle();
    this.actualizarIds();
    this.partidoTerminado();
  }

  //Info para cargar la página

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
          
          
          this.ultimoSet = this.marcador[this.marcador.length - 1];
          

          if (this.ultimoSet.Id) {
          this.apiGames.getGamesPorSet(this.ultimoSet.Id).pipe(
            map((response: any) => {
              const games: any[] = response.games;
              if (!Array.isArray(games)) return null;

              const ultimoGame = games.sort((a, b) => b.numero - a.numero)[0];
              this.ultimoGame = ultimoGame;
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
              this.puntosGameActual = {puntos:[{idGame:this.ultimoGame.id, marcador1: 0, marcador2: 0}]};
              this.ultimoPunto = {idGame:this.ultimoGame.id, marcador1: 0, marcador2: 0};
            }
          });
          }
        });
      }});
    }
  }

  obtenerNombreJugador(idJugador: number): Observable<string> {
    return this.apiJugadores.getJugadores(idJugador).pipe(
      map((response: any) => response.jugador.Nombre)
    );
  }


  //actualizamos valores después de cada acción
  actualizarIds(){
    if(this.partidoId){
      this.apiSets.getSetsPorPartido(this.partidoId).subscribe((response:any) => {
        this.marcador = response.sets;
        this.ultimoSet = response.sets[response.sets.length -1];
        if (this.ultimoSet.Id) {
          this.apiGames.getGamesPorSet(this.ultimoSet.Id).subscribe((response:any) => {
            this.ultimoGame = response.games[response.games.length - 1];
            this.apiPuntos.getPuntosPorGame(this.ultimoGame.id).subscribe((response:any) => {
              if(response.puntos.length === 0){
                this.ultimoPunto = {idGame:this.ultimoGame.id, marcador1: 0, marcador2: 0};
              }else{
                this.ultimoPunto = response.puntos[response.puntos.length -1];
              }

              this.primerSaque = true;
            })
          })
        }
      });

    }
  }
  
  loadPuntosGameActual(idGame: number){
    this.apiPuntos.getPuntosPorGame(idGame).subscribe((puntos: any) => {
      if (puntos && puntos.puntos.length > 0 && puntos.puntos[puntos.puntos.length - 1].marcador1 != 60 && puntos.puntos[puntos.puntos.length - 1].marcador2 != 60) {
        this.puntosGameActual =  puntos;
        this.gamePlaying = true;
      } else {
        this.gamePlaying = false;
      }
    });
  }


  //Validaciones del partido
  partidoTerminado() {
  if (this.partidoId) {
    this.apiSets.getSetsPorPartido(this.partidoId).subscribe((response: any) => {
      let setsJugador1 = 0;
      let setsJugador2 = 0;

      const setGanado = (marcador1: number, marcador2: number): boolean => {
        if (marcador1 >= 6 || marcador2 >= 6) {
          if (Math.abs(marcador1 - marcador2) >= 2) {
            return true;
          }
          if (marcador1 === 7 || marcador2 === 7) {
            return true;
          }
        }
        return false;
      }

      for (let set of response.sets) {

        if (setGanado(set.marcador1, set.marcador2)) {
          if (set.marcador1 > set.marcador2) {
            setsJugador1++;
          } else if (set.marcador2 > set.marcador1) {
            setsJugador2++;
          }
        }

        // Si uno gana 2 sets válidos, se termina el partido
        if (setsJugador1 === 2 || setsJugador2 === 2) {
          this.partidoAcabado = true;
          break; // Salimos del bucle porque ya no hace falta seguir
        }
      }

      if (this.partidoAcabado) {
        this.router.navigate(['/detalle-partido', this.partidoId]);
      }
    });
  }
  } 

  setTerminado():boolean{
    if (this.ultimoGame.marcador1 >= 6 || this.ultimoGame.marcador2 >= 6) {
        if (Math.abs(this.ultimoGame.marcador1 - this.ultimoGame.marcador2) >= 2) {
            return true;
        }
        if (this.ultimoGame.marcador1 === 7 || this.ultimoGame.marcador2 === 7) {
            return true;
        }
    }
    return false;
  }

  gameTerminado(nuevoPunto: any, sacador?: any): boolean {
  const marcador1 = nuevoPunto.marcador1;
  const marcador2 = nuevoPunto.marcador2;
  const esTiebreak = this.ultimoGame.marcador1 === 6 && this.ultimoGame.marcador2 === 6;

  const manejarEvento = () => {
    if (sacador!== undefined) {
      console.log('no es undefined');
      if(!this.partido.nombre4){
        console.log('es singulares');
        // console.log('marcador1:',marcador1,' marcador2: ', marcador2, 'equipo1Sacador: ', equipo1Sacador);
        if (marcador1 > marcador2 && this.partido.nombre1 === sacador) {
          this.createEvento(this.jugadores[0], 13);
        } else if (marcador2 > marcador1 && this.partido.nombre1 === sacador) {
          this.createEvento(this.jugadores[1], 14);
        } else if (marcador1 > marcador2 && this.partido.nombre1 !== sacador) {
          console.log('se creo el evento de JUEGO_RESTO_GANADO');
          this.createEvento(this.jugadores[0], 14);
        } else if (marcador2 > marcador1 && this.partido.nombre1 !== sacador) {
          this.createEvento(this.jugadores[1], 13);
        }
      }else{
        if (marcador1 > marcador2 && (this.partido.nombre1 === sacador || this.partido.nombre2 === sacador)) {
          this.createEvento(this.jugadores[0], 13);
        } else if (marcador2 > marcador1 && (this.partido.nombre1 === sacador || this.partido.nombre2 === sacador)) {
          this.createEvento(this.jugadores[3], 14);
        } else if (marcador1 > marcador2 && (this.partido.nombre3 === sacador || this.partido.nombre4 === sacador)) {
          this.createEvento(this.jugadores[0], 14);
        } else if (marcador2 > marcador1 && (this.partido.nombre3 === sacador || this.partido.nombre4 === sacador)) {
          this.createEvento(this.jugadores[3], 13);
        }
      }
    }
  };

  if (esTiebreak) {
    if ((marcador1 >= 7 && marcador1 - marcador2 >= 2)) {
      manejarEvento();
      return true;
    } 
    if ((marcador2 >= 7 && marcador2 - marcador1 >= 2)) {
      manejarEvento();
      return true;
    }
    return false;
  }

  if (marcador1 === 60) {
    manejarEvento();
    return true;
  }

  if (marcador2 === 60) {
    manejarEvento();
    return true;
  }

  return false;
}


  //creación automática de los elementos
  createNuevoSet(){
    let nuevoSet = {
      idPartido: this.partidoId, 
      marcador1: 0, 
      marcador2:0
    }
    this.apiSets.createSet(nuevoSet).subscribe((response:any) => {
      if(response.ok){
        this.ultimoSet= response.nuevoSet;
        
        let nuevoGame = {
          idSet: this.ultimoSet.Id,
          marcador1: 0,
          marcador2: 0
        }
        this.apiGames.createGame(nuevoGame).subscribe((response:any) => {
          if(response.ok){
            this.sacador = this.partido.nombre1 === this.sacador ? this.partido.nombre2 : this.partido.nombre1;
            this.ultimoGame = response.game;
          }
        });
      }
    });
  }

  createNuevoGame(){
    let nuevoGame = {
      idSet: this.ultimoSet.Id, 
      marcador1: this.ultimoGame.marcador1, 
      marcador2: this.ultimoGame.marcador2
    }
    if(this.ultimoPunto.marcador1 === 60)
      nuevoGame.marcador1++;

    if(this.ultimoPunto.marcador2 === 60)
      nuevoGame.marcador2++;


    this.apiGames.createGame(nuevoGame).subscribe((response:any) => {
      if(response.ok){
        this.sacador = this.partido.nombre1 === this.sacador ? this.partido.nombre2 : this.partido.nombre1;
        this.ultimoGame = response.game;
        let setActualizado = {
          idPartido: this.partidoId, 
          marcador1: nuevoGame.marcador1, 
          marcador2:nuevoGame.marcador2
        }
        this.apiSets.updateSet(this.ultimoSet.Id, setActualizado).subscribe((response:any) => {
          if(response.ok){
            this.actualizarIds();
            if(this.setTerminado()){
              this.partidoTerminado();


              
              this.createNuevoSet();
            }
          }else{
          }
        })

        
      }
    })
  }

  createEventos(id:any, n:number[]){
    let evento;
    if (!isNaN(id) && Number.isInteger(Number(id))) {
      for(let numEvento of n){
        evento = {
          Id_partido: this.partidoId,
          Id_evento: numEvento,
          Id_jugador: id
        }
        this.apiEventos.crearEvento(evento).subscribe();
      }
      }else{
        for(let numEvento of n){
        evento = {
          Id_partido: this.partidoId,
          Id_evento: numEvento,
          Nombre_jugador: id
        }
        this.apiEventos.crearEvento(evento).subscribe();
      }
      
    }
  }

  createEvento(id:any, n:number){
    let evento;
    if (!isNaN(id) && Number.isInteger(Number(id))) {
      evento = {
        Id_partido: this.partidoId,
        Id_evento: n,
        Id_jugador: id
      }
    }else{
      evento = {
          Id_partido: this.partidoId,
          Id_evento: n,
          Nombre_jugador: id
        }
    }
    this.apiEventos.crearEvento(evento).subscribe();
  }
  
  // Triggers de partido
  ace(){
    if(this.sacador === this.partido.nombre1){
      const punto = this.sumarPuntoJugador1(this.ultimoPunto);
      let lista;
      if(this.estado == 'saque1'){
        lista = [1, 3, 4, 11];
        this.crearPuntoConEventoEquipo1(punto, lista);
      }else if(this.estado == 'saque2'){
        lista = [1, 5, 11];
        this.crearPuntoConEventoEquipo1(punto, lista);
      }
    }else if(this.sacador === this.partido.nombre2){
      const punto = this.sumarPuntoJugador2(this.ultimoPunto);
      let lista;
      if(this.estado == 'saque1'){
        lista = [1, 3, 4, 11];
        this.crearPuntoConEventoEquipo2(punto, lista);
      }else if(this.estado == 'saque2'){
        lista = [1, 5, 11];
        this.crearPuntoConEventoEquipo2(punto, lista);
      }
    }
    this.estado = 'saque1';
    this.primerSaque = true;
  }
  
  doubleFault(){
    let lista = [2];
    let lista2 = [12];

    if(this.sacador === this.partido.nombre1){
      const punto = this.sumarPuntoJugador2(this.ultimoPunto);

      this.crearPuntoConEventoEquipo1(punto, lista);
      if(!this.partido.nombre4){
        this.createEventos(this.jugadores[1], lista2); 
      }else{
          this.createEventos(this.jugadores[3], lista2);
      }
    
    }else if(this.sacador === this.partido.nombre2){
      const punto = this.sumarPuntoJugador1(this.ultimoPunto);

      if(!this.partido.nombre4){
        this.crearPuntoConEventoEquipo2(punto, lista);
        this.createEventos(this.jugadores[0], lista2); 
      }else{
        this.crearPuntoConEventoEquipo1(punto, lista);
        this.createEventos(this.jugadores[3], lista2); 
      }
      
    }else{
      //saca equipo2
      const punto = this.sumarPuntoJugador1(this.ultimoPunto);
      this.crearPuntoConEventoEquipo1(punto, lista2);
      this.createEventos(this.jugadores[3], lista)
    }
    this.estado = 'saque1';
    this.primerSaque = true;
  }

  returnError(){
    if(this.sacador === this.partido.nombre1){
      const punto = this.sumarPuntoJugador1(this.ultimoPunto);
      let lista = [11];
      if(this.estado == 'saque1'){
        lista.push(3);
        lista.push(4);
      }else if(this.estado == 'saque2'){
        lista.push(5);
      }
      this.crearPuntoConEventoEquipo1(punto, lista);
      
    }else if(this.sacador === this.partido.nombre2){
      const punto = this.sumarPuntoJugador2(this.ultimoPunto);
      let lista = [11];
      if(this.estado == 'saque1'){
        lista.push(3);
        lista.push(4);
      }else if(this.estado == 'saque2'){
        lista.push(5);
      }
      if(!this.partido.nombre4){
        this.crearPuntoConEventoEquipo2(punto, lista);
      }else{
        this.crearPuntoConEventoEquipo1(punto, lista);
      }
    
    }else{
      const punto = this.sumarPuntoJugador2(this.ultimoPunto);
      let lista = [11];
      if(this.estado == 'saque1'){
        lista.push(3);
        lista.push(4);
      }else if(this.estado == 'saque2'){
        lista.push(5);
      }
      this.crearPuntoConEventoEquipo2(punto, lista);
      
    }
    this.estado = 'saque1';
    this.primerSaque = true;
  }

  returnWinner(){
    if(this.sacador === this.partido.nombre1){
      const punto = this.sumarPuntoJugador2(this.ultimoPunto);
      let listaResto = [12,8];
      let listaSaque = [];
      if(this.estado == 'saque1'){
        listaResto.push(6);
        listaSaque.push(3);
      }else if(this.estado == 'saque2'){
        listaResto.push(7);
      }
      
      this.crearPuntoConEventoEquipo2(punto, listaResto);
      this.createEventos(this.jugadores[0], listaSaque);
     
      
    }else if(this.sacador === this.partido.nombre2){
      const punto = this.sumarPuntoJugador1(this.ultimoPunto);
      console.log('el putno es:', punto);
      let listaResto = [12,8];
      let listaSaque = [];
      if(this.estado == 'saque1'){
        listaResto.push(6);
        listaSaque.push(3);
      }else if(this.estado == 'saque2'){
        listaResto.push(7);
      }
      if(!this.partido.nombre4){
        this.crearPuntoConEventoEquipo1(punto, listaResto);
        this.createEventos(this.jugadores[1], listaSaque);
      }else{
        this.crearPuntoConEventoEquipo2(punto, listaResto);
        this.createEventos(this.jugadores[1], listaSaque);
      }
    
    }else{
      const punto = this.sumarPuntoJugador2(this.ultimoPunto);
      let listaResto = [12,8];
      let listaSaque = [];
      if(this.estado == 'saque1'){
        listaResto.push(6);
        listaSaque.push(3);
      }else if(this.estado == 'saque2'){
        listaResto.push(7);
      }
      this.crearPuntoConEventoEquipo1(punto, listaResto);
      this.createEventos(this.jugadores[3], listaSaque)
      
    }
    this.estado = 'saque1';
    this.primerSaque = true;
  }

  winner(esEquipo1: boolean){
    if(esEquipo1){
      const punto = this.sumarPuntoJugador1(this.ultimoPunto);
      let listaRestoGanador = [8,12];
      let listaSaquePerdedor = [];
      let listaSaqueGanador = [8,11];

      if(this.primerSaque){
        listaRestoGanador.push(6);
        listaSaquePerdedor.push(3);
        listaSaqueGanador.push(3);
        listaSaqueGanador.push(4);
      }else if(!this.primerSaque){
        listaRestoGanador.push(7);
        listaSaqueGanador.push(5);
      }
      
      if(!this.partido.nombre4){
         if(this.sacador === this.partido.nombre1){
          this.crearPuntoConEventoEquipo1(punto, listaSaqueGanador);
         }else if(this.sacador === this.partido.nombre2){
          this.crearPuntoConEventoEquipo1(punto, listaRestoGanador);
          this.createEventos(this.jugadores[1], listaSaquePerdedor);
         }
      }else{
        if(this.sacador === this.partido.nombre1 || this.sacador === this.partido.nombre2){
          this.crearPuntoConEventoEquipo1(punto, listaSaqueGanador);
         }else{
          this.crearPuntoConEventoEquipo1(punto, listaRestoGanador);
          this.createEventos(this.jugadores[3], listaSaquePerdedor);
         }
      }
    }else{
      const punto = this.sumarPuntoJugador2(this.ultimoPunto);
      let listaRestoGanador = [8,12];
      let listaSaquePerdedor = [];
      let listaSaqueGanador = [8,11];

      if(this.primerSaque){
        listaRestoGanador.push(6);
        listaSaquePerdedor.push(3);
        listaSaqueGanador.push(3);
        listaSaqueGanador.push(4);
      }else if(!this.primerSaque){
        listaRestoGanador.push(7);
        listaSaqueGanador.push(5);
      }
      if(!this.partido.nombre4){
         if(this.sacador === this.partido.nombre1){
           this.crearPuntoConEventoEquipo2(punto, listaRestoGanador);
           this.createEventos(this.jugadores[0], listaSaquePerdedor);
          }else if(this.sacador === this.partido.nombre2){
           this.crearPuntoConEventoEquipo2(punto, listaSaqueGanador);
         }
      }else{
        if(this.sacador === this.partido.nombre1 || this.sacador === this.partido.nombre2){
          this.crearPuntoConEventoEquipo2(punto, listaRestoGanador);
          this.createEventos(this.jugadores[3], listaSaquePerdedor);
        }else{
           this.crearPuntoConEventoEquipo2(punto, listaSaqueGanador);
         }
      }
    }
    this.estado = 'saque1';
    this.primerSaque = true;
  }

  forcedError(esEquipo1: boolean){
    if(esEquipo1){
      const punto = this.sumarPuntoJugador2(this.ultimoPunto);
      let listaRestoGanador = [12];
      let listaSaquePerdedor = [10];

      let listaSaqueGanador = [11];
      let listaRestoPerdedor = [10];
      if(this.primerSaque){
        listaSaqueGanador.push(3);
        listaSaqueGanador.push(4);
        listaSaquePerdedor.push(3);
        listaRestoGanador.push(6);
      }else if(!this.primerSaque){
        listaSaqueGanador.push(5);
        listaRestoGanador.push(7);
      }
      
      if(!this.partido.nombre4){
         if(this.sacador === this.partido.nombre1){
          this.crearPuntoConEventoEquipo2(punto, listaRestoGanador);
          this.createEventos(this.jugadores[0], listaSaquePerdedor);
         }else if(this.sacador === this.partido.nombre2){
          this.crearPuntoConEventoEquipo2(punto, listaSaqueGanador);
          this.createEventos(this.jugadores[0], listaRestoPerdedor);
         }
      }else{
        if(this.sacador === this.partido.nombre1 || this.sacador === this.partido.nombre2){
          this.crearPuntoConEventoEquipo2(punto, listaRestoGanador);
          this.createEventos(this.jugadores[0], listaSaquePerdedor);
         }else{
          this.crearPuntoConEventoEquipo2(punto, listaSaqueGanador);
          this.createEventos(this.jugadores[0], listaRestoPerdedor);
         }
      }
    }else{
      const punto = this.sumarPuntoJugador1(this.ultimoPunto);
      let listaRestoGanador = [12];
      let listaSaquePerdedor = [10];

      let listaSaqueGanador = [11];
      let listaRestoPerdedor = [10];
      if(this.primerSaque){
        listaSaqueGanador.push(3);
        listaSaqueGanador.push(4);
        listaSaquePerdedor.push(3);
        listaRestoGanador.push(6);
      }else if(!this.primerSaque){
        listaSaqueGanador.push(5);
        listaRestoGanador.push(7);
      }
      
      if(!this.partido.nombre4){
         if(this.sacador === this.partido.nombre1){
          this.crearPuntoConEventoEquipo1(punto, listaSaqueGanador);
          this.createEventos(this.jugadores[1], listaRestoPerdedor);
         }else if(this.sacador === this.partido.nombre2){
          this.crearPuntoConEventoEquipo1(punto, listaRestoGanador);
          this.createEventos(this.jugadores[1], listaSaquePerdedor);
         }
      }else{
        if(this.sacador === this.partido.nombre1 || this.sacador === this.partido.nombre2){
          this.crearPuntoConEventoEquipo1(punto, listaSaqueGanador);
          this.createEventos(this.jugadores[3], listaRestoPerdedor);
         }else{
          this.crearPuntoConEventoEquipo1(punto, listaRestoGanador);
          this.createEventos(this.jugadores[3], listaSaquePerdedor);
         }
      }
    }
    this.estado = 'saque1';
    this.primerSaque = true;
  }

  unforcedError(esEquipo1: boolean){
    if(esEquipo1){
      const punto = this.sumarPuntoJugador2(this.ultimoPunto);
      let listaRestoGanador = [12];
      let listaSaquePerdedor = [9];

      let listaSaqueGanador = [11];
      let listaRestoPerdedor = [9];
      if(this.primerSaque){
        listaSaqueGanador.push(3);
        listaSaqueGanador.push(4);
        listaSaquePerdedor.push(3);
        listaRestoGanador.push(6);
      }else if(!this.primerSaque){
        listaSaqueGanador.push(5);
        listaRestoGanador.push(7);
      }
      
      if(!this.partido.nombre4){
         if(this.sacador === this.partido.nombre1){
          this.crearPuntoConEventoEquipo2(punto, listaRestoGanador);
          this.createEventos(this.jugadores[0], listaSaquePerdedor);
         }else if(this.sacador === this.partido.nombre2){
          this.crearPuntoConEventoEquipo2(punto, listaSaqueGanador);
          this.createEventos(this.jugadores[0], listaRestoPerdedor);
         }
      }else{
        if(this.sacador === this.partido.nombre1 || this.sacador === this.partido.nombre2){
          this.crearPuntoConEventoEquipo2(punto, listaRestoGanador);
          this.createEventos(this.jugadores[0], listaSaquePerdedor);
         }else{
          this.crearPuntoConEventoEquipo2(punto, listaSaqueGanador);
          this.createEventos(this.jugadores[0], listaRestoPerdedor);
         }
      }
    }else{
      const punto = this.sumarPuntoJugador1(this.ultimoPunto);
      let listaRestoGanador = [12];
      let listaSaquePerdedor = [9];

      let listaSaqueGanador = [11];
      let listaRestoPerdedor = [9];
      if(this.primerSaque){
        listaSaqueGanador.push(3);
        listaSaqueGanador.push(4);
        listaSaquePerdedor.push(3);
        listaRestoGanador.push(6);
      }else if(!this.primerSaque){
        listaSaqueGanador.push(5);
        listaRestoGanador.push(7);
      }
      
      
      if(!this.partido.nombre4){
         if(this.sacador === this.partido.nombre1){
          this.crearPuntoConEventoEquipo1(punto, listaSaqueGanador);
          this.createEventos(this.jugadores[1], listaRestoPerdedor);
         }else if(this.sacador === this.partido.nombre2){
          this.crearPuntoConEventoEquipo1(punto, listaRestoGanador);
          this.createEventos(this.jugadores[1], listaSaquePerdedor);
         }
      }else{
        if(this.sacador === this.partido.nombre1 || this.sacador === this.partido.nombre2){
          this.crearPuntoConEventoEquipo1(punto, listaSaqueGanador);
          this.createEventos(this.jugadores[3], listaRestoPerdedor);
         }else{
          this.crearPuntoConEventoEquipo1(punto, listaRestoGanador);
          this.createEventos(this.jugadores[3], listaSaquePerdedor);
         }
      }
    }
    this.estado = 'saque1';
    this.primerSaque = true;
  }
 
  addSaque(nombre: string){
    this.sacador = nombre;
    this.estado = 'saque1';
    this.primerSaque = true;
  }
  
  secondService(){
    this.estado = 'saque2';
    this.primerSaque = false;
  }
  
  ballIn(){
    this.estado = 'jugando';
  }
  
  //helpers de los trigers de partido
  crearPuntoConEventoEquipo1(punto: any,n: any){
    this.apiPuntos.createPunto(punto).subscribe((res:any) => {
        if(res.ok){
          if (typeof n === 'number'){
            this.createEvento(this.jugadores[0], n);
          }else if(Array.isArray(n) && n.every(v => typeof v === 'number')){
            this.createEventos(this.jugadores[0], n);
          }
          this.ultimoPunto = punto;
          if(this.ultimoGame.id){
            if(this.gameTerminado(punto, this.sacador)){
              this.createNuevoGame();
            }else{
              this.actualizarIds();
            }
            this.loadPuntosGameActual(this.ultimoGame.id);
          }
          
        }
      });
  }

  crearPuntoConEventoEquipo2(punto: any,n: any){
    this.apiPuntos.createPunto(punto).subscribe((res:any) => {
        if(res.ok){
          
          if(!this.partido.nombre4){
            if (typeof n === 'number'){
              this.createEvento(this.jugadores[1], n);
            }else if(Array.isArray(n) && n.every(v => typeof v === 'number')){
              this.createEventos(this.jugadores[1], n);
            }
          }else{
            if (typeof n === 'number'){
              this.createEvento(this.jugadores[3], n);
            }else if(Array.isArray(n) && n.every(v => typeof v === 'number')){
              this.createEventos(this.jugadores[3], n);
            }
          }
          this.ultimoPunto = punto;
          if(this.ultimoGame.id){
            if(this.gameTerminado(punto, this.sacador)){
              this.createNuevoGame();
            }else{
              this.actualizarIds();
            }
            this.loadPuntosGameActual(this.ultimoGame.id);
          }
          
        }
      });
  }

  sumarPuntoJugador1(punto:any): any{
    const secuenciaPuntos = [0, 15, 30, 40, 60]; 
    let nuevoPunto = {idGame:punto.idGame, marcador1: 0, marcador2: 0};

    if(punto.marcador1 === 40){
      if(punto.marcador2 === 40)
        return nuevoPunto = { idGame:punto.idGame, marcador1: -1, marcador2: punto.marcador2};
      
      if(punto.marcador2 === -1)
        return nuevoPunto = { idGame:punto.idGame, marcador1: 40, marcador2: 40};

    }
    if (punto.marcador1 === -1){
      if(punto.marcador2 === 40)
        return nuevoPunto = { idGame:punto.idGame, marcador1: 60, marcador2: punto.marcador2};

    }
    
    const indice1 = secuenciaPuntos.indexOf(punto.marcador1);
    nuevoPunto = { idGame:punto.idGame, marcador1: secuenciaPuntos[indice1 + 1], marcador2: punto.marcador2};      
    
    return nuevoPunto;
  }

  sumarPuntoJugador2(punto:any): any{
    const secuenciaPuntos = [0, 15, 30, 40, 60]; 
    let nuevoPunto = {idGame:punto.idGame, marcador1: 0, marcador2: 0};
    if(punto.marcador2 === 40){
      if(punto.marcador1 === 40)
        return nuevoPunto = { idGame:punto.idGame, marcador1: punto.marcador1, marcador2: -1};
      
      if(punto.marcador1 === -1)
        return nuevoPunto = { idGame:punto.idGame, marcador1: 40, marcador2: 40};

    } 
    if(punto.marcador2 === -1){
      if(punto.marcador1 === 40)
        return nuevoPunto = { idGame:punto.idGame, marcador1: punto.marcador1, marcador2: 60};

    }
      const indice2 = secuenciaPuntos.indexOf(punto.marcador2);
      nuevoPunto = { idGame:punto.idGame, marcador1: punto.marcador1, marcador2: secuenciaPuntos[indice2 + 1]};
    
      return nuevoPunto;
  }
}
