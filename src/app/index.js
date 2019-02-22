import app from './App';
import Multichat from './Multichat';

import 'normalize.css/normalize.css';
import './sass/app.scss';

const paths = window.location.pathname.substring(1).split('/');
if (paths.length > 1) {
  const multichat = new Multichat();
  multichat.populateChannels(paths);
} else {
  app.start();
}
