import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GraficosFeasPageRoutingModule } from './graficos-routing.module';

import { GraficosFeasPage } from './graficos-feas.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GraficosFeasPageRoutingModule,
    ComponentsModule
  ],
  declarations: [GraficosFeasPage]
})
export class GraficosLindasPageModule {}
