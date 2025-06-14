import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoadingController, ToastController } from '@ionic/angular';
import { Usuario } from 'src/app/clases/usuario';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  usuario: Usuario = new Usuario();
  checkUsuario: boolean = false;
  checkAdmin: boolean = false;
  checkTester: boolean = false;
  selectedUser: any;
  perfiles = environment.perfiles;
  principal = '../assets/img/alarm.svg';
  rol: string = '';
  nombre: string;
  pattern = '^([a-zA-Z0-9_-.]+)@([a-zA-Z0-9_-.]+).([a-zA-Z]{2,5})$';
  mensaje: string;
  loginForm: FormGroup;
  dirty: boolean = false;

  constructor(
    public toastController: ToastController,
    private dataService: DataService,
    private form: FormBuilder,
    private router: Router,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.loginForm = this.form.group({
      email: ['', [Validators.required, Validators.email]],
      pass: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  seleccionarRol(tipo: string) {
    if (tipo == this.rol) {
      this.checkAdmin = false;
      this.checkUsuario = false;
      this.checkTester = false;
    } else {
      this.checkAdmin = tipo === 'admin';
      this.checkUsuario = tipo === 'usuario';
      this.checkTester = tipo === 'tester';
    }
    this.cargarSesion(null, tipo);
  }

  cargarSesion(event: any, tipo: any) {
    if (!this.dirty) {
      this.usuario = new Usuario();
      if (tipo === this.rol) {
        this.rol = '';
        this.usuario.email = '';
        this.usuario.pass = '';
      } else {
        this.rol = tipo;
        this.usuario.email = this.perfiles[tipo].email;
        this.usuario.pass = this.perfiles[tipo].pass;
        this.usuario.rol = this.perfiles[tipo].rol;
      }

      this.loginControls['email'].setValue(this.usuario.email);
      this.loginControls['pass'].setValue(this.usuario.pass);
    } else {
      this.dirty = false;
    }
  }

  get loginControls() {
    return this.loginForm.controls;
  }

  onSubmitTemplate() {
    console.log('Form submit');
    this.usuario = this.loginForm.value as Usuario;

    this.dataService.login(this.usuario).then(
      (res) => {
        this.checkAdmin = false;
        this.checkUsuario = false;
        this.checkTester = false;
        this.loginForm.reset();
        this.router.navigate(['/menu']);
      },
      (error) => {
        console.error(error);
        this.mensaje = 'Credenciales inválidas';
        this.presentToast();
      }
    );
    this.presentLoading('Iniciando sesión...');

    this.usuario = new Usuario();
    console.log(this.dataService.getUserDetail());
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: this.mensaje,
      duration: 2000,
      color: 'warning',
      cssClass: 'warning-alert', // Clase CSS para estilo de advertencia
      buttons: [
        {
          icon: 'warning-outline',
          role: 'cancel',
        },
      ],
    });
    toast.present();
  }

  getErrorMessage(field: string): string {
    let retorno = '';
    if (this.loginControls[field].hasError('required')) {
      retorno = 'El campo es requerido.';
    } else if (this.loginControls[field].hasError('email')) {
      retorno = 'Formato inválido';
    } else if (this.loginControls[field].hasError('minlength')) {
      retorno = 'La contraseña debe contener 6 caracteres mínimo';
    }
    return retorno;
  }

  isNotValidField(field: string): boolean {
    return (
      this.loginControls[field].touched &&
      this.loginControls[field].dirty == true
    );
  }

  async presentLoading(message: string): Promise<void> {
    const loading = await this.loadingController.create({
      message,
      duration: 1500,
      spinner: 'circles',
      showBackdrop: true,
      cssClass: 'custom-loading',
    });
    await loading.present();
  }
}
