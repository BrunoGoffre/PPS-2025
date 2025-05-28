import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppModule } from '../app.module';
import { IonicModule } from '@ionic/angular';
import { SplashComponent } from './splash/splash.component';

import { HeaderComponent } from './header/header.component';
import { TarjetaComponent } from './tarjeta/tarjeta.component';
import { TarjetasComponent } from './tarjetas/tarjetas.component';
import { SwiperModule } from 'swiper/angular';
// import { VotosPipe } from '../pipes/votos.pipe';
// import { ChartModule } from 'angular-highcharts';

import { GraficoBarrasLindasComponent } from './widgets/grafico-barras-lindas/grafico-barras-lindas.component';
import { GraficoTortaLindasComponent } from './widgets/grafico-torta-lindas/grafico-torta-lindas.component';
import { ChartModule } from 'angular-highcharts';
import { GraficoTortaFeasComponent } from './widgets/grafico-torta-feas/grafico-torta-feas.component';
import { GraficoBarrasFeasComponent } from './widgets/grafico-barras-feas/grafico-barras-feas.component';



@NgModule({
  declarations: [
    SplashComponent,
    TarjetaComponent,
    HeaderComponent,
    TarjetasComponent,
    GraficoBarrasLindasComponent,
    GraficoTortaLindasComponent,
    GraficoTortaFeasComponent,
    GraficoBarrasFeasComponent

  ],
  imports: [
    CommonModule,
    IonicModule,
    SwiperModule,
    ChartModule
    
  ],
  exports: [
    SplashComponent,
    HeaderComponent,
    TarjetaComponent,
    TarjetasComponent,
    GraficoBarrasLindasComponent,
    GraficoTortaLindasComponent,
    GraficoTortaFeasComponent,
    GraficoBarrasFeasComponent
  ]
})
export class ComponentsModule { }
