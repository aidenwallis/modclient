import ElementNode from '../modules/ElementNode';

class AlertNode extends ElementNode {
  constructor(node) {
    super(node);
    this.text = this.node.querySelector('.alert-text');
    // console.log(this.text);
  }

  showMessage(message) {
    this.text.textContent = message;
    this.addClass('alert-active');
  }

  close() {
    this.removeClass('alert-active');
  }
}

export default AlertNode;
