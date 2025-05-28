import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NumerosPageRoutingModule } from './numeros-routing.module';

import { NumerosPage } from './numeros.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { ContentModule } from 'src/app/components/content/content.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NumerosPageRoutingModule,
    ComponentsModule,
    ContentModule
  ],
  declarations: [NumerosPage]
})
export class NumerosPageModule {}
