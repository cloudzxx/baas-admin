import { notification, Button } from 'antd';
import defaultSettings from './defaultSettings';

const { pwa } = defaultSettings;

if (pwa && 'serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then(registration => {
    registration.unregister();
  });
}
