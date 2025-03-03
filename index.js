import { AppRegistry } from 'react-native';
import App from './App';  // Đảm bảo bạn đã import đúng App
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
