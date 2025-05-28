import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.segunda.idiomas',
  appName: 'idiomas',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};

export default config;
