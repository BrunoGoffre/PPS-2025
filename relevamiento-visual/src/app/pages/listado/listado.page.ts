import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { Imagen } from 'src/app/clases/imagen';
import { Usuario } from 'src/app/clases/usuario';
import { DataService } from 'src/app/services/data.service';
import { ImagenService } from 'src/app/services/imagen.service';


@Component({
  selector: 'app-listado',
  templateUrl: './listado.page.html',
  styleUrls: ['./listado.page.scss'],
  standalone: false
})
export class ListadoPage implements OnInit {

  usuario: Usuario;
  imagenes: Imagen[] = [];

  constructor(private dataService: DataService, 
              private imagenService: ImagenService,
              private loadingController: LoadingController,
              private toastController: ToastController) { }

  async ngOnInit() 
  {
    console.log("FOTOS PROPIAS");
    await this.imagenService.fetchAll();
    this.imagenes = ImagenService.fotosUsuario;
  }

  async presentLoading(message: any) {
    const loading = await this.loadingController.create({
      message,
      duration: 2000,
      spinner: "crescent"
    });
    await loading.present();
  }
}
