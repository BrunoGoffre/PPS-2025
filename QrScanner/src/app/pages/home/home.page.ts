import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActionSheetController, LoadingController, ToastController } from '@ionic/angular';
import { Usuario } from 'src/app/clases/usuario';
import { DataService } from 'src/app/services/data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit{

  usuario: Usuario = new Usuario();
  perfiles = environment.usuario;
  rol: string = "";
  loginForm: FormGroup;

  constructor(private router: Router,
    private actionSheetCtrl: ActionSheetController,
    private toastController: ToastController,
    private dataService: DataService,
    private loadingController: LoadingController,
    private form: FormBuilder) { }

  ngOnInit(): void {
    this.loginForm = this.form.group({
      email: ['', [Validators.required, Validators.email]],
      pass: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

   onSubmitTemplate() {
    this.usuario = this.loginForm.value as Usuario;
    if (this.usuario) {
      this.dataService.login(this.usuario).then(res => {
        console.log(res)
        this.presentLoading("Cargando datos...");
        this.router.navigate(['/menu']);

      }, error => {
        console.error(error);
        this.presentToast(error.message);
      });
    }

  }


  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Perfiles',
      translucent: true,
      buttons: [{
        text: 'Admin',
        role: 'close',
        icon: 'person-add-outline',
        handler: () => {
          this.iniciarSesion('admin');
        }
      }, {
        text: 'Tester',
        role: 'close',
        icon: 'construct-outline',
        handler: () => {
          this.iniciarSesion('tester');
        }
      }, {
        text: 'Usuario',
        role: 'close',
        icon: 'person',
        handler: () => {
          this.iniciarSesion('usuario');
        }
      }]
    });
    await actionSheet.present();
  }

  iniciarSesion(tipo: string) {
    this.rol = tipo;
    this.usuario.email = this.perfiles[tipo].email;
    this.usuario.pass = this.perfiles[tipo].pass;
    this.usuario.rol = this.perfiles[tipo].rol;

    console.log(this.loginForm);

    this.loginControls['email'].setValue(this.usuario.email);
    this.loginControls['pass'].setValue(this.usuario.pass);

  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    return toast.present();
  }

  async presentLoading(message:any) {
    const loading = await this.loadingController.create({
      message,
      duration: 3000,
    });
    await loading.present();

    console.log('Loading dismissed!');
  }

  get loginControls() {
    return this.loginForm.controls;
  }

  getErrorMessage(field: string): string {
    let retorno = "";
    if (this.loginControls[field].hasError("required")) {
      retorno = "El campo es requerido.";
    }
    else if (this.loginControls[field].hasError('email')) {
      retorno = "Formato inválido";
    }
    else if (this.loginControls[field].hasError('pattern')) {
      if ((field == 'nombre' || field == 'apellido')) {
        retorno = "El campo debe contener solo letras!";
      }
      else {
        retorno = 'Debe contener solo números';
      }
    }
    else if (this.loginControls[field].hasError('minlength')) {
      retorno = "La contraseña debe contener 6 caracteres mínimo";
    }
    return retorno;
  }

  isNotValidField(field: string): boolean {
    return (this.loginControls[field].touched && this.loginControls[field].dirty == true);
  }

}
