import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-graficos-lindas',
  templateUrl: './graficos-lindas.page.html',
  styleUrls: ['./graficos-lindas.page.scss'],
  standalone: false
})
export class GraficosLindasPage implements OnInit {

  constructor(private loadingController: LoadingController) { }

  ngOnInit() 
  {
    this.presentLoading("Creando gráficos de fotos lindas...");
  }

  async presentLoading(message: any) {
    const loading = await this.loadingController.create({
      message,
      duration: 1000,
      spinner: 'bubbles'
    });
    await loading.present();
  }

}
