import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BonitasPageRoutingModule } from './bonitas-routing.module';

import { BonitasPage } from './bonitas.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BonitasPageRoutingModule,
    ComponentsModule
  ],
  declarations: [BonitasPage]
})
export class BonitasPageModule {}
