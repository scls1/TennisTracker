import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { AlertController, IonButton, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonList, IonText, IonTitle, IonToolbar, NavController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eye, eyeOff, lockClosed, logoGoogle } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonInput, IonButton, IonIcon, FormsModule, IonText]
})
export class RegisterPage implements OnInit {
  private apiService = inject(AuthService);
  private nav = inject(NavController);

  public usuario = {
    Nombre: '',
    Email: '',
    Clave:''
  }
  public passwordVisible = false;
  public errorNombre = false;
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
  registrar(usuario:any){
    try {
      this.errorNombre = false;
      this.errorEmail = false;
      this.errorClave = false;
      this.comprobarCampos();

      if (this.errorNombre || this.errorEmail || this.errorClave) {
        console.log('Error en los campos');
        return;
      }

      this.apiService.register(usuario).subscribe((response:any) => {
        console.log(response);
        if (response.ok) {
          this.nav.navigateForward('/login');
        } else {
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
      subHeader: 'Registro fallido',
      message: error || 'Error al loguear el usuario',
      buttons: ['OK'],
    });
  
    await alert.present();
  }


comprobarCampos() {
  if (this.usuario.Nombre === '' ) {
    this.errorNombre = true;
  }
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
