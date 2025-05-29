import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Imagen } from 'src/app/clases/imagen';
import { Usuario } from 'src/app/clases/usuario';
import { DataService } from 'src/app/services/data.service';
import { ImagenService } from 'src/app/services/imagen.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone:false
})
export class MenuPage implements OnInit {
  usuario: Usuario | null;
  imagenes: Imagen[] = [];
  seleccionado: string = '/feas';

  rutas = [
    {
      nombre: 'BONITAS',
      ruta: '/bonitas',
      src: '/assets/img/bonito.jpg',
    },
    {
      nombre: 'FEAS',
      ruta: '/feas',
      src: '/assets/img/feo.jpg',
    }
  ];

  constructor(
    private router: Router,
    private loadingController: LoadingController,
    private imagenService: ImagenService,
    private dataService: DataService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.presentLoading('Cargando fotos...');

    await this.imagenService.fetchAll();

    const user = await firstValueFrom(this.dataService.getUserDetail());
    if (user && user.uid) {
      await this.imagenService.fetchUsuarioLindas(user.uid);
      await this.imagenService.fetchUsuarioFeas(user.uid);
    }

    this.usuario = await this.dataService.obtenerLocal();
  }

  async presentLoading(message: string): Promise<void> {
    const loading = await this.loadingController.create({
      message,
      duration: 3000,
      spinner: 'bubbles',
    });
    await loading.present();
  }

  navegar(ruta: string): void {
    this.router.navigate([ruta]);
    console.log(ruta);
  }
}
