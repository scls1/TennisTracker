import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonButton, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonTitle, IonToolbar, NavController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eye, eyeOff, lockClosed, logoGoogle } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton, IonList, IonIcon, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {
  private apiService = inject(AuthService);
  private nav = inject(NavController);

  public usuario = {
    Email: '',
    Clave:''
  }
  public passwordVisible = false;
  public errorEmail = false;
  public errorClave = false;
  private alertController: AlertController = inject(AlertController);

  private patron: RegExp = /^[A-Za-z0-9]+[A-Za-z0-9._-]*[A-Za-z0-9]+@[A-Za-z]+\.[A-Za-z]+$/;
  
  
  constructor() { 
    addIcons({logoGoogle,lockClosed,eye,eyeOff});
  }
  
  ngOnInit() {
  }
//Hay que hacer la validacion de los campos a mano dado que en la version 7 standalone de ionic no se puede usar el formulario reactivo  
  loguear(usuario:any){
    try {
      this.errorEmail = false;
      this.errorClave = false;
      this.comprobarCampos();

      if (this.errorEmail || this.errorClave) {
        console.log('Error en los campos');
        return;
      }

      this.apiService.loguear(usuario).subscribe((response:any) => {
        console.log(response);
        if (response.ok) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('nav-history', JSON.stringify([]));
          this.nav.navigateForward('/home');
        } else {
          console.log('Error al loguear el usuario');
          this.mostrarErrorRegistro(response.msg);
        }
      });
      
    } catch (error) {
      this.mostrarErrorRegistro();
        console.log(error);
    }
  }

  async mostrarErrorRegistro(error?: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: error || 'login failed',
      buttons: ['OK'],
    });
  
    await alert.present();
  }


comprobarCampos() {
  if (this.usuario.Email === '' || this.patron.test(this.usuario.Email) === false ) {
    this.errorEmail = true; 
  }
  if (this.usuario.Clave === '' ) {
    this.errorClave = true; 
  }
}

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}
