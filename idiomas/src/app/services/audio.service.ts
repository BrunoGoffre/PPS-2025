import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Capacitor } from '@capacitor/core';
import { NativeAudio } from '@capacitor-community/native-audio';

interface Sound {
  key: string;
  asset: string;
  isNative: boolean;
}

export interface ILenguajeSeleccionado {
  idioma: string;
  img: string;
}

export enum Idioma {
  Español = 'es',
  Ingles = 'en',
  Portugues = 'pt',
}

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private sounds: Sound[] = [];
  private audioPlayer: HTMLAudioElement = new Audio();
  public static idiomaSeleccionado: ILenguajeSeleccionado = {
    idioma: Idioma.Español,
    img: '/assets/img/spanish.png',
  };

  private numeros = environment.numeros;
  private colores = environment.colores;
  private animales = environment.animales;

  constructor() {}

  async play(key: string) {
    const soundToPlay = this.sounds.find((sound) => sound.key === key);
    console.log(soundToPlay);
    if (!soundToPlay) return;

    // if (Capacitor.isNativePlatform()) {
    if (Capacitor.isNativePlatform()) {
      try {
        console.log('Reproduciendo nativo: ' + key);
        await NativeAudio.play({ assetId: key });
      } catch (error) {
        console.error('Error al reproducir con NativeAudio', error);
      }
    } else {
      console.log('Reproduciendo web: ' + key);
      const audio = new Audio(soundToPlay.asset);
      audio.play();
    }
  }

  async preload(key: string, asset: string) {
    this.sounds.push({ key, asset, isNative: Capacitor.isNativePlatform() });
    
    if (Capacitor.isNativePlatform()) {
      try {
        await NativeAudio.preload({
          assetId: key,
          assetPath: 'public/' + asset,
        });
      } catch (error) {
        console.warn(`No se pudo precargar ${key}`, error);
      }
    }
  }

  cargarUnAudio(data: any) {
    for (let index = 0; index < data.length; index++) {
      const value = data[index];
      if (Capacitor.isNativePlatform()){
        this.preload(value.nombre + '_es', value.audio_es);
        this.preload(value.nombre + '_en', value.audio_en);
        this.preload(value.nombre + '_pt', value.audio_pt);
      }else{
        this.preload(value.nombre + '_es', value.audio_es);
        this.preload(value.nombre + '_en', value.audio_en);
        this.preload(value.nombre + '_pt', value.audio_pt);
      }
    }
  }

  cargarAudios() {
    this.cargarUnAudio(this.animales);
    this.cargarUnAudio(this.colores);
    this.cargarUnAudio(this.numeros);
  }
}
