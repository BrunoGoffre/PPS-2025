import { Component, DoCheck, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { Imagen } from 'src/app/clases/imagen';
import { Usuario } from 'src/app/clases/usuario';
import { DataService } from 'src/app/services/data.service';
import { ImagenService } from 'src/app/services/imagen.service';

@Component({
  selector: 'app-listado-lindas',
  templateUrl: './listado-lindas.page.html',
  styleUrls: ['./listado-lindas.page.scss'],
  standalone: false,
})
export class ListadoLindasPage implements OnInit {
  usuario: Usuario;
  imagenes: Imagen[] = [];

  constructor(
    private dataService: DataService,
    private imagenService: ImagenService,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  ngDoCheck(): void {
    if (ImagenService.fotosUsuarioLindas.length != this.imagenes.length){
      this.imagenes = ImagenService.fotosUsuarioLindas;  
    }
  }
  async ngOnInit() {
    this.presentLoading('Obteniendo Imágenes...')
    await this.imagenService.fetchAll();
    const user = await firstValueFrom(this.dataService.getUserDetail());
    if (user && user.uid) {
      await this.imagenService.fetchUsuarioLindas(user.uid);
    }
    this.imagenes = ImagenService.fotosUsuarioLindas;
    this.loadingController.dismiss();
  }

  async presentLoading(message: any) {
    const loading = await this.loadingController.create({
      message,      
      spinner: 'crescent',
    });
    await loading.present();
  }
}
