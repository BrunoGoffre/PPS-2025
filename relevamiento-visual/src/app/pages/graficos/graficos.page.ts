import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.page.html',
  styleUrls: ['./graficos.page.scss'],
  standalone: false
})
export class GraficosPage implements OnInit {

  constructor(private loadingController: LoadingController) { }

  ngOnInit() 
  {
    this.presentLoading("Creando gráficos...");
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
