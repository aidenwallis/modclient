class ElementNode {
  constructor(node) {
    this.node = node;
  }

  // show() {
  //   delete this.node.style.display;
  // }

  hide() {
    this.node.style.display = 'none';
  }

  addClass(className) {
    this.node.classList.add(className);
  }

  removeClass(className) {
    this.node.classList.remove(className);
  }
}

export default ElementNode;
