import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonAvatar, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonModal, IonTitle, IonToggle, IonToolbar } from '@ionic/angular/standalone';
import { TopbarComponent } from 'src/app/topbar/topbar.component';
import { addIcons } from 'ionicons';
import { closeOutline, personAddOutline } from 'ionicons/icons';
import { jwtDecode } from 'jwt-decode';
import { JugadorService } from 'src/app/services/jugador.service';
import { SetService } from 'src/app/services/set.service';
import { PartidoService } from 'src/app/services/partido.service';
import { Router } from '@angular/router';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-create-partido',
  templateUrl: './create-partido.page.html',
  styleUrls: ['./create-partido.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonList,
    TopbarComponent,
    NgIf,
    IonToggle,
    IonIcon,
    IonModal,
    IonButtons,
    IonAvatar,
  ]
})
export class CreatePartidoPage implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;
  private apiPartido = inject(PartidoService);
  private apiSet = inject(SetService);
  private apiGames = inject(GameService);
  private apiJugadores = inject(JugadorService);
  private alertController = inject(AlertController);
  private router = inject(Router);
  private userId;

  public isModalOpen = false;
  public isDark = localStorage.getItem('dark-mode') === 'true';


  public activeButton: number | null = null;
  public selectedPlayerNombre: string | null = null;
  public confirmedPlayerNombre1: string | null = null;
  public confirmedPlayerNombre2: string | null = null;
  public confirmedPlayerNombre3: string | null = null;
  public confirmedPlayerNombre4: string | null = null;
  
  public selectedPlayerId: number | null = null;
  public confirmedPlayer1: number | null = null;
  public confirmedPlayer2: number | null = null;
  public confirmedPlayer3: number | null = null;
  public confirmedPlayer4: number | null = null;

  public jugador2Input: string = '';
  public jugador3Input: string = '';
  public jugador4Input: string = '';

  public allPlayers: any[] = [];
  public partido:any = {
    jugador1: null,
    jugador2: null,
    jugador3: null,
    jugador4: null,
    rival1:'',
    rival2:'',
    pareja:'',
    dobles: false,
  }; 
  public jugador1Error: boolean = false;
  public jugador2Error: boolean = false;
  public jugador3Error: boolean = false;
  public jugador4Error: boolean = false;
  
  constructor() { 
    addIcons({
      personAddOutline,
      closeOutline
    });

    const token = localStorage.getItem('token');
    if(token){
      let decoded = jwtDecode(token);
      this.userId = decoded.id;
    }
  }

  ngOnInit() {
    this.loadPlayers();
    console.log(this.isModalOpen)
  }

  ionViewWillEnter() {
    this.isDark = localStorage.getItem('dark-mode') === 'true';
  }

  loadPlayers(){
    if(this.userId){
      this.apiJugadores.getJugadoresPorEntrenador(this.userId).subscribe((response:any) => {
        for(let i=0; i<response.jugadores.length; i++){
          this.allPlayers.push(response.jugadores[i]);
        }
      });
    }
  }

  normalizeJugadores() {
    const confirmados: number[] = [];

    if (this.confirmedPlayer1) confirmados.push(this.confirmedPlayer1);
    if (this.confirmedPlayer2) confirmados.push(this.confirmedPlayer2);
    if (this.confirmedPlayer3) confirmados.push(this.confirmedPlayer3);
    if (this.confirmedPlayer4) confirmados.push(this.confirmedPlayer4);

    // Reasignar en orden
    this.partido.jugador1 = confirmados[0] || null;
    this.partido.jugador2 = confirmados[1] || null;
    this.partido.jugador3 = this.partido.dobles ? confirmados[2] || null : null;
    this.partido.jugador4 = this.partido.dobles ? confirmados[3] || null : null;
    
    // Reset campos dinámicos
    this.partido.rival1 = '';
    this.partido.rival2 = '';
    this.partido.pareja = '';
    
    const rivalesTemporales: string[] = [];

    // INPUT 2 (jugador2Input): puede ser pareja o rival1
    if (!this.confirmedPlayer2 && this.jugador2Input?.trim()) {
      if (this.partido.dobles) {
        this.partido.pareja = this.jugador2Input.trim();
      } else {
        rivalesTemporales.push(this.jugador2Input.trim());
      }
    }

    // INPUT 3 (jugador3): si no está confirmado, puede ser rival
    if (this.partido.dobles && !this.confirmedPlayer3 && this.jugador3Input?.trim()) {
      rivalesTemporales.push(this.jugador3Input.trim());
    }

    // INPUT 4 (jugador4): si no está confirmado, también puede ser rival
    if (this.partido.dobles && !this.confirmedPlayer4 && this.jugador4Input?.trim()) {
      rivalesTemporales.push(this.jugador4Input.trim());
    }

    // Asignar rivales
    this.partido.rival1 = rivalesTemporales[0] || '';
    this.partido.rival2 = rivalesTemporales[1] || '';

  }
  
  addPlayer(id: number, nombre:string) {
    this.selectedPlayerId = id;
    this.selectedPlayerNombre = nombre;
  }
  actualizarJugador2() {
    if (!this.confirmedPlayer2 && this.jugador2Input) {
      this.partido.rival1 = this.jugador2Input;
      this.partido.jugador2 = ''; // aseguramos que no haya conflicto
    }
  }

  deletePlayer(boton:number){
    switch (boton) {
      case 1:
        this.confirmedPlayer1 = null;
        this.confirmedPlayerNombre1 = null;
        this.partido.jugador1 = null;
        break;
      case 2:
        this.confirmedPlayer2 = null;
        this.confirmedPlayerNombre2 = null;

        this.partido.jugador2 = null;
        this.jugador2Input = '';
        this.partido.rival1 = '';
        break;
      case 3:
        this.confirmedPlayer3 = null;
        this.confirmedPlayerNombre3 = null;
        this.partido.jugador3 = null;
        break;
      case 4:
        this.confirmedPlayer4 = null;
        this.confirmedPlayerNombre4 = null;
        this.partido.jugador4 = null;
        break;
    }
    this.normalizeJugadores();
  }

  confirm() {
    switch (this.activeButton) {
      case 1:
        this.confirmedPlayer1 = this.selectedPlayerId;
        this.confirmedPlayerNombre1 = this.selectedPlayerNombre; 
        break;
      case 2:
        this.confirmedPlayer2 = this.partido.jugador2 = this.selectedPlayerId;
        this.confirmedPlayerNombre2 = this.selectedPlayerNombre;
        break;
      case 3:
        this.confirmedPlayer3 = this.partido.jugador3 = this.selectedPlayerId;
        this.confirmedPlayerNombre3 = this.selectedPlayerNombre;
        break;
      case 4:
        this.confirmedPlayer4 = this.partido.jugador4 = this.selectedPlayerId;
        this.confirmedPlayerNombre4 = this.selectedPlayerNombre;
        break;
    }
    this.selectedPlayerNombre = null;
    this.selectedPlayerId = null;    
    this.setOpen(false);
    this.normalizeJugadores();
  }

  setOpen(isOpen: boolean, boton?:number) {
    this.activeButton = boton ? boton : null;
    this.isModalOpen = isOpen;
    console.log(this.isModalOpen);
  }

  async mostrarError(error?: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: error || 'There is been a problem creating this match',
      buttons: ['OK'],
    });
  
    await alert.present();
  }

  comprobarCampos(): boolean{
    this.jugador1Error = false;
    this.jugador2Error = false;
    this.jugador3Error = false;
    this.jugador4Error = false; 
    let hayError = false;

    if (this.confirmedPlayer1 === null) {
      this.jugador1Error = true; 
      hayError = true;
    }
    if (this.confirmedPlayer2 === null && this.jugador2Input.length === 0) {
        this.jugador2Error = true; 
        hayError = true;
      }

    if(this.partido.dobles){
      if (this.confirmedPlayer3 === null && this.jugador3Input.length === 0) {
        this.jugador3Error = true; 
        hayError = true;
      }
      if (this.confirmedPlayer4 === null && this.jugador4Input.length === 0) {
        this.jugador4Error = true; 
        hayError = true;
      }
    }

    return hayError;
  }

  guardarResultado() {
    this.normalizeJugadores();
    if(this.comprobarCampos()){
      return;
    }
   
    
    const datos = {
      Jugador1: this.partido.jugador1,
      Jugador2: this.partido.jugador2,
      Jugador3: this.partido.jugador3,
      Jugador4: this.partido.jugador4,
      Rival1: this.partido.rival1,
      Rival2: this.partido.rival2,
      Pareja: this.partido.pareja,
      Tipo: this.partido.dobles ? 1 : 0,
      NumSets: 3,
    };


    this.apiPartido.createPartido(datos).subscribe((response:any) => {
      if(response.ok){
        console.log(response);
        const idPartido = response.partido.IdPartido;
        console.log(idPartido);

        const resultadoInicial = {
          idPartido: idPartido,
          marcador1: 0,
          marcador2: 0
        };

        

          this.apiSet.createSet(resultadoInicial).subscribe((res:any) => {
            if(res.ok){
              console.log(res);
              const gameInicio = {
                idSet: res.nuevoSet.Id,
                marcador1: 0,
                marcador2:0
              }
              this.apiGames.createGame(gameInicio).subscribe((game:any) => {
                this.router.navigate(['/partido', idPartido]);
              })
            }else{
              this.mostrarError("There's been a problem. Try again.")
            }
          });
        
      }else{
        this.mostrarError(response.msg);
      }
    })
  }

}
