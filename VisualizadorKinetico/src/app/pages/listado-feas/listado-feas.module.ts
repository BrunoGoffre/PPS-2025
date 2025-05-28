import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListadoFeasPageRoutingModule } from './listado-feas-routing.module';

import { ListadoFeasPage } from './listado-feas.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListadoFeasPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ListadoFeasPage]
})
export class ListadoPageModule {}
