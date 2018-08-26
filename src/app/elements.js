import ElementNode from './modules/ElementNode';

import LoginButton from './nodes/LoginButton';
import SelectChannel from './nodes/SelectChannel';

const elements = {
  loginOverlay: new ElementNode(document.getElementById('login-overlay')),
  loginButton: new LoginButton(document.getElementById('login-button')),
  selectChannel: new SelectChannel(document.getElementById('select-channel')),
  footer: null,
};

export default elements;
