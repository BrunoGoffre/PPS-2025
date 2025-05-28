import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, Platform } from '@ionic/angular';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { DataService } from 'src/app/services/data.service';
import { AudioService } from 'src/app/services/audio.service';
import { Usuario } from 'src/app/clases/usuario';
import { FlashlightService } from 'src/app/services/flash.service';

declare var navigator: any; // necesario para acceder a cordova.plugins

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: false,
})
export class MenuPage implements OnInit {
  deshabilitarBoton = false;
  estado: Estado = Estado.DESACTIVADA;

  ejeX: string;
  ejeY: string;
  ejeZ: string;
  timeStamp: string;
  tiempoDeEspera: boolean = false;

  posicion: string;
  posicionAnterior = '';

  passwordForm: FormGroup;
  isSubmitted = false;

  watchID: any;

  constructor(
    private platform: Platform,
    private dataService: DataService,
    private audioService: AudioService,
    private alertController: AlertController,
    public formBuilder: FormBuilder,
    public flashService: FlashlightService,
    private loadingController: LoadingController
  ) {
    this.platform.ready().then(() => {
      this.audioService.preload('derecha', 'assets/audio/derecha.mp3');
      this.audioService.preload('izquierda', 'assets/audio/izquierda.mp3');
      this.audioService.preload('vertical', 'assets/audio/vertical.mp3');
      this.audioService.preload('horizontal', 'assets/audio/horizontal.mp3');
      this.audioService.preload('alerta', 'assets/audio/alerta.mp3');
      this.audioService.preload('inicio', 'assets/audio/inicio.mp3');
      this.audioService.preload('desactivada', 'assets/audio/desactivada.mp3');
    });
  }

  get errorControl() {
    return this.passwordForm.controls;
  }

  ngOnInit() {
    this.passwordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  activarAlarma() {
    this.estado = Estado.ACTIVADA;
    this.deshabilitarBoton = true;
    this.audioService.play('inicio');
    this.start();
    this.presentAlert('Alarma activada');
  }

  desactivarAlarma() {
    this.isSubmitted = true;
    this.dataService.obtenerLocal().then((usuario) => {
      this.presentLoading('Desactivando...');
      usuario.pass = this.passwordForm?.get('password').value;
      this.dataService
        .login(usuario as Usuario)
        .then((res) => {
          this.loadingController.dismiss()
          this.estado = Estado.DESACTIVADA;
          this.deshabilitarBoton = false;
          this.stop();
          this.presentAlert('Alarma desactivada');
        })
        .catch(() => {
          this.loadingController.dismiss()
          this.loadingController
          this.activarFlash();
          this.vibrarPor5Segundos();
          this.audioService.play('alerta');
          this.presentAlert('Error al corroborar contraseña');
        });
    });
  }

  start() {
    try {
      const options = { frequency: 500 };
      
      this.watchID = navigator.accelerometer.watchAcceleration(
        (acc: any) => {
          this.ejeX = acc.x.toFixed(2);
          this.ejeY = acc.y.toFixed(2);
          this.ejeZ = acc.z.toFixed(2);
          this.timeStamp = acc.timestamp.toString();

          // Detectar posición
          if (acc.z <= 10 && acc.z >= 8 && acc.y >= -2 && acc.y <= 2) {
            this.posicion = 'horizontal';
          } else if (acc.z <= 4 && acc.z >= -2 && acc.y <= 9 && acc.y >= 7) {
            this.posicion = 'vertical';
          } else if (acc.x > 6 && acc.x <= 10) {
            this.posicion = 'izquierda';
          } else if (acc.x < -6 && acc.x >= -10) {
            this.posicion = 'derecha';
          }

          if (this.posicion !== this.posicionAnterior && this.tiempoDeEspera == false) {
            this.tiempoDeEspera = true;
            switch (this.posicion) {
              case 'vertical':
                this.activarFlash();
                this.audioService.play('vertical');
                this.posicionAnterior = this.posicion;
                break;
              case 'horizontal':
                this.vibrarPor5Segundos();
                this.audioService.play('horizontal');
                this.posicionAnterior = this.posicion;
                break;
              case 'derecha':
                this.audioService.play('derecha');
                this.posicionAnterior = this.posicion;
                break;
              case 'izquierda':
                this.audioService.play('izquierda');
                this.posicionAnterior = this.posicion;
                break;
            }
            setTimeout(() => {
              this.tiempoDeEspera = false;
            }, 500);
          }
        },
        (err: any) => {
          console.error('Error en acelerómetro', err);
        },
        options
      );
    } catch (error) {
      console.error('ERROR al iniciar DeviceMotion', error);
    }
  }

  stop() {
    if (this.watchID) {
      this.audioService.play('desactivada')
      navigator.accelerometer.clearWatch(this.watchID);
      this.watchID = null;
    }
  }

  async presentAlert(message: string) {
  const alert = await this.alertController.create({
    header: '⚠️Atención',
    message,
    mode: 'ios',
    cssClass: 'fancy-alert',
    backdropDismiss: false, // fuerza al usuario a cerrar con botón
    buttons: [
      {
        text: 'Cerrar',
        role: 'cancel',
        cssClass: 'fancy-cancel-button',
        handler: () => {
          console.log('Alerta cerrada');
        }
      }
    ],
  });

  await alert.present();
  await alert.onDidDismiss(); // útil si necesitas hacer algo luego
}

  activarFlash() {
    this.flashService.isAvailable().then((available) => {
      this.flashService.switchOn();
      setTimeout(() => {
        this.flashService.switchOff();
      }, 5000);
    });
  }

  async vibrarPor5Segundos() {
    const start = Date.now();
    while (Date.now() - start < 5000) {
      await Haptics.vibrate({ duration: 200 });
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }
  async presentLoading(message: any) {
    const loading = await this.loadingController.create({
      message,
      spinner: 'bubbles',
      
    });
    await loading.present();
  }

  async DesactivarLoading() {
    await this.loadingController.dismiss();
  }
}

enum Estado {
  ACTIVADA = 1,
  DESACTIVADA = 0,
}
