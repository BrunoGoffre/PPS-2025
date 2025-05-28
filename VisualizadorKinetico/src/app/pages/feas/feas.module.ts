import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FeasPageRoutingModule } from './feas-routing.module';

import { FeasPage } from './feas.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FeasPageRoutingModule,
    ComponentsModule
  ],
  declarations: [FeasPage]
})
export class FeasPageModule {}
