import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Capacitor } from '@capacitor/core';
import { NativeAudio } from '@capacitor-community/native-audio';

interface Sound {
  key: string;
  asset: string;
  isNative: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private sounds: Sound[] = [];
  private audioPlayer: HTMLAudioElement = new Audio();

  constructor() {}

  async play(key: string) {
    const soundToPlay = this.sounds.find((sound) => sound.key === key);
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
}
