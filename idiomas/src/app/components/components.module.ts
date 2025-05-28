import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from './header/header.component';
import { SplashComponent } from './splash/splash.component';
import { PopinfoComponent } from './popinfo/popinfo.component';



@NgModule({
  declarations: [
    HeaderComponent,
    SplashComponent,
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    HeaderComponent,
    SplashComponent,
  ]
})
export class ComponentsModule { }
