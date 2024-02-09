import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'streaming',
  webDir: 'www',
  plugins: {
    Media: {
      web: {
        // Aquí puedes proporcionar cualquier configuración específica del plugin para el entorno web si es necesario
      },
    },
  },
  server: {
    androidScheme: 'https'
  }
};

export default config;
