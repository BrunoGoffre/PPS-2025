import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnimalesPageRoutingModule } from './animales-routing.module';

import { AnimalesPage } from './animales.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { ContentModule } from '../../components/content/content.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AnimalesPageRoutingModule,
    ComponentsModule,
    ContentModule,
  ],
  declarations: [AnimalesPage]
})
export class AnimalesPageModule {}
