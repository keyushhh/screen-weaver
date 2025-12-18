import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dotpe.customer',
  appName: 'Dot.Pe',
  webDir: 'dist',
  server: {
    url: 'https://581d96d6-c111-46b6-9b95-ddd9e2f0b0f7.lovableproject.com?forceHideBadge=true',
    cleartext: true
  }
};

export default config;
