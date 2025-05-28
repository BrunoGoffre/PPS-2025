import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-graficos-feas',
  templateUrl: './graficos-feas.page.html',
  styleUrls: ['./graficos-feas.page.scss'],
  standalone: false
})
export class GraficosFeasPage implements OnInit {

  constructor(private loadingController: LoadingController) { }

  ngOnInit() 
  {
    this.presentLoading("Creando gráficos de fotos feas...");
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
