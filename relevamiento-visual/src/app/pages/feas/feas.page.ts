import { Component, DoCheck, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { Imagen, TipoImagen } from 'src/app/clases/imagen';
import { Usuario } from 'src/app/clases/usuario';
import { DataService } from 'src/app/services/data.service';
import { ImagenService } from 'src/app/services/imagen.service';

@Component({
  selector: 'app-feas',
  templateUrl: './feas.page.html',
  styleUrls: ['./feas.page.scss'],
  standalone: false,
})
export class FeasPage implements OnInit {
  usuario: Usuario;
  imagenes: Imagen[] = [];

  constructor(
    private dataService: DataService,
    private imagenService: ImagenService,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {
    this.usuario = new Usuario();
    this.dataService.obtenerLocal().then((data) => {
      this.usuario = data as Usuario;
    });
  }

  ngOnInit() {
    this.imagenes = ImagenService.fotosFeas;
  }

  ngDoCheck(): void {
    this.imagenes = ImagenService.fotosFeas;
  }

  async subirFoto() {
    this.imagenService
      .sacarFoto(this.usuario, TipoImagen.NEGATIVA)
      .then((imagen) => this.usuario.imagenes.push(imagen.id))
      .catch(console.error)
      .finally(() => this.dataService.actualizar(this.usuario));
    await this.presentLoading('Subiendo foto...');
  }

  async presentLoading(message: any) {
    const loading = await this.loadingController.create({
      message,
      duration: 1500,
      spinner: 'bubbles',
    });
    await loading.present();
  }

  async presentToast(message: any) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
    });
    toast.present();
  }
}
