import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Usuario } from 'src/app/clases/usuario';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone:false
})
export class RegistroPage implements OnInit {

  nombre: string;
  usuario: Usuario = new Usuario();
  emailPattern = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;  
  lettersPattern = /^[a-zA-Z]+$/;
  dniPattern = /^[0-9]{7,8}$/;
  phonePattern = /^[0-9]{10}$/;
  confirmacionPass: string;
  mensaje: string;
  registerForm: FormGroup;
  isSubmitted:boolean = false;

  constructor(public toastController: ToastController, 
              private dataService: DataService,
              private router: Router,public formBuilder:FormBuilder) { }

  get registerControls() {
    return this.registerForm.controls;
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.pattern(this.lettersPattern)]],
      apellido: ['', [Validators.required, Validators.pattern(this.lettersPattern)]],
      email: ['', [Validators.required, Validators.email]],
      dni: ['', [Validators.required, Validators.pattern(this.dniPattern)]],
      domicilio: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.pattern(this.phonePattern)]],
      pass: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassowrd: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmitTemplate()
  {
    console.log('Form submit');
    console.log(this.usuario);
    this.usuario = this.registerForm.value as Usuario;
    this.confirmacionPass = this.registerForm.value.confirmPassowrd;

    if(this.usuario.pass != this.confirmacionPass)
    {
      this.mensaje = "Las contraseñas no coinciden";
      this.presentToast();
    }
    else
    {
      this.dataService.registrar(this.usuario).then(res => {
        console.log("Usuario registrado");
        this.mensaje = "Se ha registrado exitosamente";
        this.router.navigate(['/home']);
         
      }, error => {
        console.error(error);
        this.mensaje = error.message;
      }).finally( () => this.presentToast());
    
    }
    
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: this.mensaje,
      duration: 2000
    });
    toast.present();
  }

  getErrorMessage(field: string): string {
    let retorno = "";
    if(this.registerControls[field].hasError("required")) {
      retorno = "El campo es requerido.";
    }
    else if(this.registerControls[field].hasError('email')){
      retorno = "Formato de mail inválido";
    }
    else if(this.registerControls[field].hasError('pattern')){
      if((field == 'nombre' || field == 'apellido')){
        retorno = "El campo debe contener solo letras!";
      }
      else{
        retorno = 'Debe contener solo números';
        if(field == 'dni'){
          retorno = retorno + " y 8 caracteres.";
        }
        else{
          retorno = retorno + " y 10 caracteres.";
        }
      }
    }
    else if(this.registerControls[field].hasError('minlength')){
      retorno = "La contraseña debe contener 6 caracteres mínimo";
    }
    return retorno;
  }

  isNotValidField(field: string): boolean {
    return (this.registerControls[field].touched && this.registerControls[field].dirty == true);
  }

}
