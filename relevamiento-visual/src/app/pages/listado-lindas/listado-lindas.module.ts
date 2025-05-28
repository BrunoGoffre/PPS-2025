import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListadoLindasPageRoutingModule } from './listado-lindas-routing.module';

import { ListadoLindasPage } from './listado-lindas.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListadoLindasPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ListadoLindasPage]
})
export class ListadoLindasPageModule {}
