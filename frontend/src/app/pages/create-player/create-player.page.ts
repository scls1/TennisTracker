import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonSelect, IonSelectOption, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { TopbarComponent } from 'src/app/topbar/topbar.component';
import { JugadorService } from 'src/app/services/jugador.service';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-player',
  templateUrl: './create-player.page.html',
  styleUrls: ['./create-player.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, TopbarComponent, IonList, IonItem, IonLabel, IonInput, IonButton, IonSelect, IonSelectOption]
})
export class CreatePlayerPage implements OnInit {
  apiJugador = inject(JugadorService);
  router = inject(Router);
  private token: string | null = null;
  private userId : number | undefined = undefined;
  
  public player:any;
  public nameError: string = '';
  public ageError: string = '';
  public heightError: string = '';


  constructor() { 
    this.token = localStorage.getItem('token');
    if (this.token) {
      const decoded = jwtDecode(this.token);
      this.userId = decoded.id;
    } else {
      console.warn('No hay token disponible');
    }
    this.player = {
      name: '',
      age: '',
      gender: false,
      height: '',
      photo: '',
    };

    
  }

  ngOnInit() {
  }

  onPhotoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      console.log(file.name);
      this.player.photo = file.name; 
        
    }
  }

  async submit(player:any){
    try {
      this.nameError = '';
      this.ageError = '';
      this.heightError = '';
      await this.comprobarCampos();
      
      if(this.nameError==='' || this.ageError==='' || this.heightError===''){
        
        if(this.userId){
          
          let nuevoJugador = {
            Nombre: player.name,
            Genero: player.gender.toString(),
            Altura: parseFloat(player.height).toFixed(2),
            Edad: player.age.toString(),
            Foto: player.photo,
            Entrenador: this.userId,
          };
          
          this.apiJugador.createJugador(nuevoJugador).subscribe((res:any) => {
            console.log(res);
            window.location.href = '/players';
          });
          
        }
          
      }
    } catch (error) {
        console.log('error');
    }
  }
    
    async comprobarCampos(){
      if (this.player.name === '') {
      this.nameError = 'This filed is requiered';
    }
    if (this.player.age === '' ) {
      this.ageError = 'This field is requiered'; 
    }
    if (this.player.height === '' ) {
      this.heightError = 'This field is requiered'; 
    }
  }
}
