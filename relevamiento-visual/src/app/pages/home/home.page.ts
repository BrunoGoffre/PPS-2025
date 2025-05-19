import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Usuario } from 'src/app/clases/usuario';
import { DataService } from 'src/app/services/data.service';
import { environment } from 'src/environments/environment';
import { Storage } from '@ionic/storage-angular';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  perfiles = environment.usuario;
  mensaje: string = '';
  usuario: Usuario = new Usuario();
  rol: string = '';
  pattern = new RegExp(/^[a-zA-Z0-9\-\.]+@[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,5}$/);

  constructor(public alertCtrl: AlertController,
    private dataService: DataService,
    public toastController: ToastController,
    private router: Router,
    private storage: Storage

  ) {
  }

  ngOnInit() {
    this.rol = '';
    this.storage.remove('usuario')
    this.storage.clear()
    this.storage.get('usuario')?.then((result) => {
      result?.forEach((key: any) => {
        console.log('keys: ' + key)
      })
    })
  }

  async presentAlertPrompt(value?: any) {
    const alert = await this.alertCtrl.create({
      translucent: true,
      header: 'Iniciar sesión',
      mode: "ios",
      inputs: [
        {
          name: 'mail',
          type: 'text',
          placeholder: 'Ingrese su correo electrónico',
          value: value?.email ?? '',
        },
        {
          name: 'clave',
          type: 'password',
          placeholder: 'Ingrese su contraseña',
          attributes: {
            minLength: 6
          },
          min: 6,
          value: value?.password ?? ''
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.rol = '';
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ingresar',
          handler: (data) => {
            this.rol = '';
            if(!this.isEmail(data.mail)){
              this.presentToast("El correo es inválido", true);
            }
            else if(!this.isPassword(data.clave)){
              this.presentToast("La contraseña es inválida", true);
            }
            else{
              this.usuario.email = data.mail;
              this.usuario.pass = data.clave;
              this.dataService.login(this.usuario).then(() => {
                console.log("Entre aca post login")
                this.presentToast("Sesión iniciada.");
                this.router.navigate(['/menu']);
              }).
                catch(err => {
                  console.log(err)
                  this.presentToast('Credenciales inválidas', true)
                });
            }
            }
        },
      ]
    });

    await alert.present();
  }

  async presentToast(message: string, err:boolean = false) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: err ? 'danger' : 'success'
    });
    toast.present();
  }


  async iniciarSesion(event: any) {
    if(event.detail.value){
      this.rol = event.detail.value;
  
      switch (this.rol) {
        case 'Admin':
          this.usuario.email = this.perfiles.admin.email;
          this.usuario.pass = this.perfiles.admin.pass;
          this.usuario.rol = this.perfiles.admin.rol;
          break;
        case 'Tester':
          this.usuario.email = this.perfiles.tester.email;
          this.usuario.pass = this.perfiles.tester.pass;
          this.usuario.rol = this.perfiles.tester.rol;
          break;
        case 'Usuario':
          this.usuario.email = this.perfiles.usuario.email;
          this.usuario.pass = this.perfiles.usuario.pass;
          this.usuario.rol = this.perfiles.usuario.rol;
          break;
      }
  
    
      const data = {
        email: this.usuario.email,
        password: this.usuario.pass,
      }
      await this.presentAlertPrompt(data);
    }
  }

  isEmail(email: any) {
    return this.pattern.test(email)
  }

  isPassword(password: any) {
    return password.length >= 6;
  }

  limpiarLocal(){
    this.dataService.limpiarLocal();
  }


}
