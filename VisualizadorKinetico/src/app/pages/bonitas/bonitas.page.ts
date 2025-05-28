import { Component, DoCheck, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { Imagen, TipoImagen } from 'src/app/clases/imagen';
import { Usuario } from 'src/app/clases/usuario';
import { DataService } from 'src/app/services/data.service';
import { ImagenService } from 'src/app/services/imagen.service';

@Component({
  selector: 'app-bonitas',
  templateUrl: './bonitas.page.html',
  styleUrls: ['./bonitas.page.scss'],
  standalone: false,
})
export class BonitasPage implements OnInit {
  usuario: Usuario;
  imagenes: Imagen[] = [];

  constructor(
    private dataService: DataService,
    private imagenService: ImagenService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private router: Router,
  ) {
    this.dataService.obtenerLocal().then((data) => {
      this.usuario = data as Usuario;
    });
  }

  ngOnInit() {
    this.imagenes = ImagenService.fotosBonitas;
  }

  ngDoCheck(): void {
    this.imagenes = ImagenService.fotosBonitas;
  }

  async subirFoto() {
    this.imagenService
      .sacarFoto(this.usuario, TipoImagen.POSITIVA)
      .then((imagen) => {
        this.usuario.imagenes.push(imagen.id);        
      })
      .catch(console.error)
      .finally(() => this.dataService.actualizar(this.usuario));
  }


  async presentToast(message: any) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
    });
    toast.present();
  }
  
  navegar(ruta: string): void {
    this.router.navigate([ruta]);
    console.log(ruta);
  }
}
