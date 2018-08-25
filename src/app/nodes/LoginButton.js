import loginUrl from '../util/loginUrl';
import ElementNode from '../modules/ElementNode';

class LoginButton extends ElementNode {
  constructor(node) {
    super(node);
    this.node.onclick = () => this.login();
  }

  login() {
    window.location = loginUrl;
  }
}

export default LoginButton;
