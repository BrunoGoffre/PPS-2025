import { Component, DoCheck, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { Imagen } from 'src/app/clases/imagen';
import { Usuario } from 'src/app/clases/usuario';
import { DataService } from 'src/app/services/data.service';
import { ImagenService } from 'src/app/services/imagen.service';

@Component({
  selector: 'app-listado-feas',
  templateUrl: './listado-feas.page.html',
  styleUrls: ['./listado-feas.page.scss'],
  standalone: false,
})
export class ListadoFeasPage implements OnInit, DoCheck {
  usuario: Usuario;
  imagenes: Imagen[] = [];

  constructor(
    private dataService: DataService,
    private imagenService: ImagenService,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}
  ngDoCheck(): void {
    if (ImagenService.fotosUsuarioFeas.length != this.imagenes.length){
      this.imagenes = ImagenService.fotosUsuarioFeas;  
    }
  }
  
  async ngOnInit() {
    this.presentLoading('Obteniendo Imágenes...')
    await this.imagenService.fetchAll();
    const user = await firstValueFrom(this.dataService.getUserDetail());
    if (user && user.uid) {
      await this.imagenService.fetchUsuarioFeas(user.uid);
    }
    this.imagenes = ImagenService.fotosUsuarioFeas;
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
