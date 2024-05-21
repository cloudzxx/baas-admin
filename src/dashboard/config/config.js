import pageRoutes from './router.config';

const PROXY = process.env.PROXY || 'http://127.0.0.1/engine';

export default {
  plugins: [
    '@umijs/plugins/dist/dva',
    '@umijs/plugins/dist/antd',
    '@umijs/plugins/dist/locale',
    '@umijs/plugins/dist/initial-state',
  ],
  dva: {},
  antd: {},
  locale: {
    default: 'en-US',
    antd: true,
    title: true,
    baseNavigator: false,
    baseSeparator: '-',
  },
  routes: pageRoutes,
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:8080/',
      changeOrigin: true,
    },
  },
  ignoreMomentLocale: true,
  manifest: {
    basePath: '/',
  },
  mock: {
    exclude: ['mock/**/_*.js', 'mock/_*/**/*.js'],
  },
  hash: true,
  history: {
    type: 'hash',
  },
  mfsu: false,
};
