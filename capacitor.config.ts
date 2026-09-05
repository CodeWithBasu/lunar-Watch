import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.basu.moontracker',
  appName: 'Moon Tracker',
  webDir: 'out',
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      backgroundColor: "#000000"
    }
  }
};

export default config;
