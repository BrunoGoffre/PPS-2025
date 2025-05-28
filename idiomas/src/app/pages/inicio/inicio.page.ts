import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Usuario } from 'src/app/clases/usuario';
import { AlertController, PopoverController, ToastController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { PopinfoComponent } from 'src/app/components/popinfo/popinfo.component';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: false
})
export class InicioPage implements OnInit {

  login = "../assets/img/login.jpg";
  registro = "../assets/img/register.webp";
  mensaje: string = '';
  usuario: Usuario = new Usuario();
  selectUser: Subject<{mail:string, pass:string, rol:string}> = new Subject();

   constructor(public alertCtrl: AlertController, 
              private dataService: DataService,
              public toastController: ToastController,
              private router: Router,
              private popoverCtrl: PopoverController,
            private loadingController: LoadingController) { }

  ngOnInit() {
    this.selectUser.subscribe(async (user) => {
      this.popoverCtrl.dismiss();
      await this.promptSignIn(user);
    })
  }
async promptSignIn(data?:{mail:string, pass:string, rol:string}) {
    const alert = await this.alertCtrl.create({
      translucent: true,
      mode: "md",
      inputs: [
        {
          name: 'email',
          type: 'text',
          placeholder: 'Ingrese su correo',
          value: data?.mail ?? '',
          
        },
        {
          name: 'password',
          type: 'password',
          placeholder: 'Ingrese su contraseña',
          value: data?.pass ?? '',
          attributes: {
            minLength: 6
          }
        },
        {
          name: 'confirmacion',
          type: 'password',
          placeholder: 'Confirme su contraseña',
          value: data?.pass ?? '',
          attributes: {
            minLength: 6,
            required: true,
          }
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Aceptar',
          handler: (data) => {
            if(!this.validarMail(data.email)){
              this.mensaje = "Correo electronico inválido";
            }
            else if(!this.validarPassword(data.password)){
              this.mensaje = "Password inválida";
            }
            else if(!(data.password === data.confirmacion)){
              this.mensaje = "Contraseñas no coinciden";
            }
            else{
              this.usuario.email = data.email;
              this.usuario.pass = data.password;
              this.presentLoading('Iniciando sesión...');
              this.dataService.login(this.usuario).
              then(()=>{
                this.mensaje = "Sesión iniciada.";
                this.router.navigate(['/menu/animales']);
              }).
              catch( error => this.mensaje = 'Credenciales inválidas.').
              finally(() => this.presentToast());
              return;
            }
            this.presentToast();
          }
        }
      ]
    });

    await alert.present();
  }
  async promptSignUp(data?:{mail:string, pass:string, rol:string}) {
    const alert = await this.alertCtrl.create({
      translucent: true,
      mode: "md",
      inputs: [
        {
          name: 'email',
          type: 'text',
          placeholder: 'Ingrese su correo',
          value: data?.mail ?? '',
          
        },
        {
          name: 'password',
          type: 'password',
          placeholder: 'Ingrese su contraseña',
          value: data?.pass ?? '',
          attributes: {
            minLength: 6
          }
        },
        {
          name: 'confirmacion',
          type: 'password',
          placeholder: 'Confirme su contraseña',
          value: data?.pass ?? '',
          attributes: {
            minLength: 6,
            required: true,
          }
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Aceptar',
          handler: (data) => {
            if(!this.validarMail(data.email)){
              this.mensaje = "Correo electronico inválido";
            }
            else if(!this.validarPassword(data.password)){
              this.mensaje = "Password inválida";
            }
            else if(!(data.password === data.confirmacion)){
              this.mensaje = "Contraseñas no coinciden";
            }
            else{
              this.usuario.email = data.email;
              this.usuario.pass = data.password;
              this.presentLoading('Iniciando sesión...');
              this.dataService.registrar(this.usuario).
              then(()=>{
                this.mensaje = "Registrado con exito.";
                this.router.navigate(['/menu/animales']);
              }).
              catch( error => this.mensaje = 'Credenciales inválidas.').
              finally(() => this.presentToast());
              return;
            }
            this.presentToast();
          }
        }
      ]
    });

    await alert.present();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: this.mensaje,
      position: 'top',
      duration: 2000,
      buttons: [
        {
          icon: 'close',
          role: 'cancel',
          handler: () => {
          },
        },
      ],
    });
    toast.present();
  }
  validarMail(mail: string): boolean
  {
     const pattern = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);

    if(pattern.test(mail))
    {
      return true;
    }
    return false;
  }

  validarPassword(password: string): boolean
  {
    if(password.length >= 6)
    {
      return true;
    }
    return false;
  }

  async togglePopover( evento: any )
  {
    const popover = await this.popoverCtrl.create({
      component: PopinfoComponent,
      componentProps: {selectUser: this.selectUser},
      event: evento,
      mode: 'ios'
    });

    await popover.present();
  }
  async presentLoading(message: string): Promise<void> {
    const loading = await this.loadingController.create({
      message,
      duration: 1500,
      spinner: 'bubbles',
    });
    await loading.present();
  }
}
