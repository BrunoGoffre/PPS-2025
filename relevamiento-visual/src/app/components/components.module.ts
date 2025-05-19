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

import { GraficoBarrasComponent } from './widgets/grafico-barras/grafico-barras.component';
import { GraficoTortaComponent } from './widgets/grafico-torta/grafico-torta.component';
import { ChartModule } from 'angular-highcharts';



@NgModule({
  declarations: [
    SplashComponent,
    TarjetaComponent,
    HeaderComponent,
    TarjetasComponent,
    GraficoBarrasComponent,
    GraficoTortaComponent
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
    GraficoBarrasComponent,
    GraficoTortaComponent
  ]
})
export class ComponentsModule { }
