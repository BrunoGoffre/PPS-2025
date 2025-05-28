import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Imagen } from 'src/app/clases/imagen';
import { Motion } from '@capacitor/motion';
import { PluginListenerHandle } from '@capacitor/core';
import SwiperCore, { Swiper } from 'swiper';

SwiperCore.use([]);

@Component({
  selector: 'app-tarjetas',
  templateUrl: './tarjetas.component.html',
  styleUrls: ['./tarjetas.component.scss'],
  standalone: false
})
export class TarjetasComponent implements OnInit, OnDestroy {
  @Input() titulo = '';
  @Input() imagenes: Imagen[] = [];

  swiper?: Swiper;
  motionListenerHandle?: PluginListenerHandle;

  ejeX: string = '';
  ejeY: string = '';
  ejeZ: string = '';
  posicion = '';
  posicionAnterior = '';

  constructor() {}

  ngOnInit() {
    this.start();
  }

  ngOnDestroy(): void {
    this.stop();
  }

  async start() {
    try {
      this.motionListenerHandle = await Motion.addListener('accel', (event) => {
        this.ejeX = parseFloat(event.acceleration.x?.toFixed(2) || '0').toString();
        this.ejeY = parseFloat(event.acceleration.y?.toFixed(2) || '0').toString();
        this.ejeZ = parseFloat(event.acceleration.z?.toFixed(2) || '0').toString();

        const x = parseFloat(this.ejeX);
        const y = parseFloat(this.ejeY);
        const z = parseFloat(this.ejeZ);

        if (z <= 10 && z >= 8 && y >= -2 && y <= 2) {
          this.posicion = 'horizontal';
        } else if (z <= 4 && z >= -2 && y <= 9 && y >= 7) {
          this.posicion = 'vertical';
        } else if (x > 3 && x <= 10) {
          this.posicion = 'izquierda';
        } else if (x < -3 && x >= -10) {
          this.posicion = 'derecha';
        }

        if (this.posicion !== this.posicionAnterior) {
          this.posicionAnterior = this.posicion;

          switch (this.posicion) {
            case 'vertical':
              this.slideFirst();
              break;
            case 'derecha':
              this.slideNext();
              break;
            case 'izquierda':
              this.slidePrev();
              break;
          }
        }
      });
    } catch (error) {
      console.error('ERROR: ', error);
    }
  }

  async stop() {
    await this.motionListenerHandle?.remove();
  }

  onSwiper(swiper: Swiper) {
    this.swiper = swiper;
  }

  slideNext() {
    this.swiper?.slideNext();
  }

  slidePrev() {
    this.swiper?.slidePrev();
  }

  slideFirst() {
    this.swiper?.slideTo(0);
  }
}
