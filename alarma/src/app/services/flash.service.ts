import { Injectable } from '@angular/core';

declare global {
  interface FlashlightPlugin {
    available: (callback: (isAvailable: boolean) => void) => void;
    switchOn: () => void;
    switchOff: () => void;
    toggle: () => void;
  }

  interface CordovaPlugins {
    flashlight: FlashlightPlugin;
  }

  interface Window {
    plugins: CordovaPlugins;
  }
}

@Injectable({
  providedIn: 'root'
})
export class FlashlightService {

  constructor() {}

  async isAvailable(): Promise<boolean> {
    return new Promise((resolve) => {
      window.plugins.flashlight.available((isAvailable: boolean) => {
        resolve(isAvailable);
      });
    });
  }

  switchOn(): void {
    window.plugins.flashlight.switchOn();
  }

  switchOff(): void {
    window.plugins.flashlight.switchOff();
  }

  toggle(): void {
    window.plugins.flashlight.toggle();
  }
}
