import { Component, inject, OnInit } from '@angular/core';
import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonRow, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { PartidoService } from 'src/app/services/partido.service';
import { TopbarComponent } from 'src/app/topbar/topbar.component';
import {jwtDecode} from 'jwt-decode';
import { SetService } from 'src/app/services/set.service';
import { JugadorService } from 'src/app/services/jugador.service';
import { forkJoin, map, mergeMap, Observable, of, switchMap } from 'rxjs';
import { NgFor } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    TopbarComponent,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    NgFor
  ]
})



export class HomePage implements OnInit {
  apiPartidos = inject(PartidoService);
  apiSets = inject(SetService);
  apiJugadores = inject(JugadorService);

  router = inject(Router);

  private token: string | null = null;
  private userId : number | undefined = undefined;
  private idPartidos: number[] = [];
  
  public error: string | null = null;
  public partidos: any[] = [];
  public marcadores: any[] = [];
  public partidosConMarcadores: any[] = [];

  
  
  constructor() { 
    
  }
  
  ngOnInit() {
    this.token = localStorage.getItem('token');
    if (this.token) {
      const decoded = jwtDecode(this.token);
      this.userId = decoded.id;
    } else {
      console.warn('No hay token disponible');
    }
    if (!localStorage.getItem('nav-history')) {
      localStorage.setItem('nav-history', JSON.stringify(['/home'])); 
    }
    this.loadPartidosTodos();  
  }
  
  
  loadPartidosTodos(){
    if(this.userId){
      //sacamos los partidos del entrenador
      this.apiPartidos.getPartidoByEntrenador(this.userId).subscribe((response: any) => {
        if (response.ok) {
          this.idPartidos = response.partidos.map((partido: any) => partido.IdPartido);
      
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
        } else {
          this.error = response.msg;
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
      this.apiSets.getSetsPorPartido(idPartido).pipe(
        mergeMap((response: any) => {
          const setIds = response.sets
            .map((set: any) => set?.Id)
            .filter((id: any) => id !== undefined);

          const setRequests = setIds.map((setId: any) => this.apiSets.getSets(setId));
              
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

    goToDetail(id: string | number) {
      console.log(id)
      this.router.navigate(['/detalle-partido', id]);
    }


  }
