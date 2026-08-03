import { federation, createModuleFederationConfig } from '@module-federation/vite';
import { dependencies } from './package.json';

export default (_env: Record<string, string>) => federation(createModuleFederationConfig({
  name: 'shared',
  filename: 'remoteEntry.js',
  exposes: {
    './consts/db': './src/consts/db',
    './components': './src/components',
    './utils/antdTheme': './src/utils/antdTheme',
  },
  remotes: {},
  shared: {
    'react': {
      requiredVersion: dependencies.react,
      singleton: true,
    },
    'react-dom/client': {
      requiredVersion: dependencies['react-dom'],
      singleton: true,
    },
    'react-router-dom': {
      requiredVersion: dependencies['react-router-dom'],
      singleton: true,
    },
  },
  dts: {
    generateTypes: {
      tsConfigPath: './tsconfig.app.json',
    },
  },
}));
