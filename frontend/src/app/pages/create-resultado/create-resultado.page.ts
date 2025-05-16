import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonAvatar, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonModal, IonSelect, IonSelectOption, IonTitle, IonToggle, IonToolbar } from '@ionic/angular/standalone';
import { TopbarComponent } from 'src/app/topbar/topbar.component';
import { addIcons } from 'ionicons';
import { closeOutline, personAddOutline } from 'ionicons/icons';
import { JugadorService } from 'src/app/services/jugador.service';
import { jwtDecode } from 'jwt-decode';
import { map, Observable } from 'rxjs';
import { PartidoService } from 'src/app/services/partido.service';
import { SetService } from 'src/app/services/set.service';

@Component({
  selector: 'app-create-resultado',
  templateUrl: './create-resultado.page.html',
  styleUrls: ['./create-resultado.page.scss'],
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
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    IonSelectOption,
    IonSelect
  ]
})
export class CreateResultadoPage implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;
  private apiJugadores = inject(JugadorService);
  private apiPartido = inject(PartidoService);
  private apiSet = inject(SetService);
  private alertController = inject(AlertController);
  private userId;

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

  public errorResultado = '';
  public isModalOpen = false;
  public allPlayers: any[] = [];
  public juegos: number[] = [0, 1, 2, 3, 4, 5, 6, 7];
  public resultadoSets = [
    { jugador1: null, jugador2: null },
    { jugador1: null, jugador2: null },
    { jugador1: null, jugador2: null }
  ];
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

  actualizarJugador2() {
    if (!this.confirmedPlayer2 && this.jugador2Input) {
      this.partido.rival1 = this.jugador2Input;
      this.partido.jugador2 = ''; // aseguramos que no haya conflicto
  }
  }


  addPlayer(id: number, nombre:string) {
    this.selectedPlayerId = id;
    this.selectedPlayerNombre = nombre;
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

  numSetsValido(sets: any): boolean {
  const setsNecesariosParaGanar = 2;
  let setsJugador1 = 0;
  let setsJugador2 = 0;
  let ganadorEncontrado = false;

  for (const set of sets) {
    const marcador1 = set.jugador1 ?? 0;
    const marcador2 = set.jugador2 ?? 0;

    // Si ya hay un ganador, los siguientes sets deben ser 0-0
    if (ganadorEncontrado) {
      if (marcador1 !== 0 || marcador2 !== 0) {
        return false;
      }
      continue;
    }

    if (marcador1 > marcador2) {
      setsJugador1++;
    } else if (marcador2 > marcador1) {
      setsJugador2++;
    }

    // Si alguno ha ganado ya el partido
    if (setsJugador1 === setsNecesariosParaGanar || setsJugador2 === setsNecesariosParaGanar) {
      ganadorEncontrado = true;
    }

    // Si alguien gana más de 2 sets, no es válido
    if (setsJugador1 > setsNecesariosParaGanar || setsJugador2 > setsNecesariosParaGanar) {
      return false;
    }
  }

  return true;
}

  setValido(marcador1: number, marcador2: number, setEntero: boolean): boolean {
    if(setEntero){
      if ((marcador1 <= 6 && marcador2 <= 6)) {
        return true;
      }
  
      if (
        (marcador1 === 7 && (marcador2 === 5 || marcador2 === 6)) ||
        (marcador2 === 7 && (marcador1 === 5 || marcador1 === 6))
      ) {
        return true;
      }
  
      return false;
    }else{
      if ((marcador1 === 0 && marcador2 === 0)) {
        return true;
      }
      this.errorResultado = 'Invalid result';
      return false;
    }

    }

    setTerminado(marcador1:number, marcador2:number){
    if ((marcador1 === 6 && marcador2 <= 4) || (marcador2 === 6 && marcador1 <= 4)) {
        return true;
    }

    if ((marcador1 === 7 && (marcador2 === 5 || marcador2 === 6)) || 
        (marcador2 === 7 && (marcador1 === 5 || marcador1 === 6))) {
        return true;
    }

    return false;
}

  setsValidos(sets:any): boolean {
    let setAcabado = true;
    for (const set of sets) {
      const marcador1 = set.jugador1 ?? 0;
      const marcador2 = set.jugador2 ?? 0;
      if (!this.setValido(marcador1, marcador2, setAcabado)) {
        return false;
      }
      setAcabado = this.setTerminado(marcador1, marcador2);
  
    }
    return true;
  }

  resultadoValido(resultado:any): boolean{
    let esValido = true;

    if(!this.numSetsValido(resultado)){
      this.errorResultado = 'Invalid number of sets'
      esValido = false;
    }else{
    }

    

    return esValido;
  }

  guardarResultado() {
    this.normalizeJugadores();
    if(this.comprobarCampos()){
      return;
    }
    if(!this.setsValidos(this.resultadoSets)){
      this.mostrarError(this.errorResultado);
      return;
    }
    if(!this.resultadoValido(this.resultadoSets)){
      this.mostrarError(this.errorResultado);
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

    const resultadoFinal:any = [];

    this.apiPartido.createPartido(datos).subscribe((response:any) => {
      if(response.ok){
        console.log(response);
        const idPartido = response.partido.IdPartido;
        console.log(idPartido);

        for (const set of this.resultadoSets) {
          const marcador1 = set.jugador1;
          const marcador2 = set.jugador2;

          if ((marcador1 !== null || marcador2 !== null) && (marcador1 !== 0 && marcador2 !== 0)) {
            console.log('entro');
            resultadoFinal.push({
              idPartido: idPartido,
              marcador1: marcador1 ? marcador1 : 0,
              marcador2: marcador2 ? marcador2 : 0
            });
          }
        }

        if(resultadoFinal.length === 0){
          resultadoFinal.push({
              idPartido: idPartido,
              marcador1: 0,
              marcador2: 0
            });
        }
        console.log(resultadoFinal);
        for(const set of resultadoFinal){
          this.apiSet.createSet(set).subscribe((res:any) => {
            if(response.ok){
              window.location.href = '/home';

            }else{
              this.mostrarError("There's been a problem. Try again.")
            }
          });
        }
        
      }else{
        this.mostrarError(response.msg);
      }
    })
  }

  
}
