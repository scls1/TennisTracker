import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonCard, IonCardContent, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonRow, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { TopbarComponent } from 'src/app/topbar/topbar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { JugadorService } from 'src/app/services/jugador.service';
import { PartidoService } from 'src/app/services/partido.service';
import { SetService } from 'src/app/services/set.service';
import { forkJoin, map, mergeMap, Observable, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-detalle-player',
  templateUrl: './detalle-player.page.html',
  styleUrls: ['./detalle-player.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, TopbarComponent, IonCard, IonCardContent, IonCardTitle, IonGrid, IonRow, IonCol]
})
export class DetallePlayerPage implements OnInit {
  apiJugadores = inject(JugadorService); 
  apiPartidos = inject(PartidoService);
  apiSet = inject(SetService);
  router = inject(Router);

  private idString: string | null = null;
  private playerId: number | undefined = undefined;

  public nombre: string = '';
  public errorPartidos: boolean = false;
  
  //charts
  public individuales : number[] = [];
  public individualesGanados : number = 0;
  public dobles : number[] = [];
  public doblesGanados : number = 0;
  public singlesPercentage = 0;
  public doublesPercentage = 0;

  //partidos
  private idPartidos: number[] = [];
  public partidos: any[] = [];
  public marcadores: any[] = [];
  public partidosConMarcadores: any[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    

    this.idString = this.route.snapshot.paramMap.get('id');
    this.playerId = Number(this.idString);
    console.log('El ID del jugador es:', this.playerId);

    if(this.playerId){
      this.apiJugadores.getJugadorPorId(this.playerId).subscribe((res:any) => {
        this.nombre = res.jugador.Nombre;
      });

      this.cargarStats();

      

    }
    
  }

  cargarStats(){
    if(this.playerId){
      this.apiPartidos.getPartidoByJugador(this.playerId).subscribe((res:any) => {
        
        //partidos
        this.idPartidos = res.partidos.map((partido: any) => partido.IdPartido);
         this.apiPartidos.getPartidos().pipe(
                    switchMap((response: any) => {
                      // Filtra primero los partidos que sí están en el array
                      const partidosFiltrados = response.partidos.filter((partido: any) =>
                        this.idPartidos.includes(partido.IdPartido)
                      );
              
                      const observables = partidosFiltrados.map((partido: any) => {
                        let fecha = new Date(partido.FechaHoraEntrada);
              
                        if (!partido.Tipo) {
                          return forkJoin({
                            id: of(partido.IdPartido),
                            fecha: of(fecha.toLocaleDateString('es-ES')),
                            nombre1: this.obtenerNombreJugador(partido.Jugador1),
                            nombre2: partido.Rival1
                              ? of(partido.Rival1)
                              : this.obtenerNombreJugador(partido.Jugador2)
                          });
                        } else {
                          if (partido.Pareja) {
                            return forkJoin({
                              id: of(partido.IdPartido),
                              fecha: of(fecha.toLocaleDateString('es-ES')),
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
                            return forkJoin({
                              id: of(partido.IdPartido),
                              fecha: of(fecha.toLocaleDateString('es-ES')),
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
                        }
                      });
              
                      // Ahora sí, forkJoin de observables válidos
                      return forkJoin(observables);
                    })
                  ).subscribe((nombresResueltos: any) => {
                    this.partidos = nombresResueltos;
              
                    // Obtener marcadores
                    for (let i = 0; i < this.idPartidos.length; i++) {
                      if (this.idPartidos[i]) {
                        this.obtenerMarcadoresPorPartido(this.idPartidos[i], i, this.partidos.length);
                      }
                    }
                  });




        //charts
        if(res.partidos.length === 0){
          this.errorPartidos = true;
        }else{          
          // contar cuantos hay de dobles y guardar en array
          // contar cuantos hay de individuales y guardar en array (ya está hecho en perfil pero para entrenador)
          const observables = [];

          for (let i = 0; i < res.partidos.length; i++) {
            const partido = res.partidos[i];
            const tipo = partido.Tipo; // true = dobles
      
            const obs = this.apiSet.getSetsPorPartido(partido.IdPartido).pipe(
              tap((response: any) => {
                if (tipo) {
                  this.dobles.push(partido.IdPartido);
                  const isPlayer2SinPareja = (this.playerId == partido.Jugador2 && !partido.Pareja);
                  const esEquipo2 = !isPlayer2SinPareja && this.playerId != partido.Jugador1;
                  this.calcularGanador(response.sets, true, esEquipo2);
                } else {
                  this.individuales.push(partido.IdPartido);
                  const esEquipo2 = this.playerId != partido.Jugador1;
                  this.calcularGanador(response.sets, false, esEquipo2);
                }
              })
            );
      
            observables.push(obs);
          }
      
          forkJoin(observables).subscribe(() => {
            this.singlesPercentage = this.individuales.length > 0
              ? Math.round((this.individualesGanados / this.individuales.length) * 100)
              : 0;
      
            this.doublesPercentage = this.dobles.length > 0
              ? Math.round((this.doblesGanados / this.dobles.length) * 100)
              : 0;
      
            
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
    
    obtenerMarcadoresPorPartido(idPartido: number, index: number, nPartidos: number){
      this.apiSet.getSetsPorPartido(idPartido).pipe(
        mergeMap((response: any) => {
          const setIds = response.sets
            .map((set: any) => set?.Id)
            .filter((id: any) => id !== undefined);

          const setRequests = setIds.map((setId: any) => this.apiSet.getSets(setId));
              
          return forkJoin(setRequests);
        })
      ).subscribe((data: any) => {
        this.marcadores[index] = data;
        this.partidosConMarcadores = this.partidos.map((partido, index) => {
          return {
            partido,
            marcador: this.marcadores[index]
          }
        })
      });
    }

  calcularGanador(sets: any, tipo: boolean, jugador: boolean) {
    let sets1 = 0;
    let sets2 = 0;


    for(let i = 0; i < sets.length; i++){
      if(sets[i].marcador1 > sets[i].marcador2)
        sets1++;
    
      if(sets[i].marcador1 < sets[i].marcador2)
        sets2++;
    }

    if(!jugador && sets1 > sets2){
      if(tipo){
        this.doblesGanados++;
      }else{
        this.individualesGanados++;
      }
    }else if(jugador && sets2 > sets1){
      if(tipo){
        this.doblesGanados++;
      }else{
        this.individualesGanados++;
      }
    }
  }

  goToDetail(id: string | number) {
    console.log(id)
    this.router.navigate(['/detalle-partido', id]);
  }

}
