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
  
  private idString: string | null = null;
  private partidoId: number | undefined = undefined;
  
  public isDark = localStorage.getItem('dark-mode') === 'true';
  public partido: any;
  public marcador: any;
  public estadisticasServicio = [
    { nombre: 'Aces', valorJugador1: 4, valorJugador2: 3 },
    { nombre: 'Dobles faltas', valorJugador1: 5, valorJugador2: 0 },
    { nombre: 'Porcentaje 1er servicio', valorJugador1: 58, valorJugador2: 83 },
    { nombre: 'Pts. ganados 1er serv.', valorJugador1: 67, valorJugador2: 70 },
    { nombre: 'Pts. ganados 2º serv.', valorJugador1: 38, valorJugador2: 55 },
    { nombre: 'Puntos break salvados', valorJugador1: 25, valorJugador2: 0 },
  ];
  

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
          if (!partido.Tipo) {
            return forkJoin({
              id: of(partido.IdPartido),
              nombre1: this.obtenerNombreJugador(partido.Jugador1),
              nombre2: partido.Rival1 ? of(partido.Rival1) : this.obtenerNombreJugador(partido.Jugador2)
            });
        }else{
          if (partido.Pareja) {
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
      this.marcador = data;
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
    
}
