import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GraficosPageRoutingModule } from './graficos-routing.module';

import { GraficosLindasPage as GraficosLindasPage } from './graficos-lindas.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GraficosPageRoutingModule,
    ComponentsModule
  ],
  declarations: [GraficosLindasPage]
})
export class GraficosLindasPageModule {}
