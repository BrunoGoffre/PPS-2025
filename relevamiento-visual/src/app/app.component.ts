import { Component } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { SplashComponent } from './components/splash/splash.component';

import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private modalCtrl: ModalController,
    private router: Router
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready();

    // Oculta splash de forma manual (si configuraste launchAutoHide: false)
    await SplashScreen.hide();

    // Cambia estilo de la status bar
    await StatusBar.setStyle({ style: Style.Default });

    // Muestra modal y luego navega
    await this.presentModal();
    this.router.navigate(['/home']);
  }

  async presentModal() {
    const modal = await this.modalCtrl.create({
      component: SplashComponent
    });
    return await modal.present();
  }
}
