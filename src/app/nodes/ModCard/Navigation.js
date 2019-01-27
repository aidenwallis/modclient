import ElementNode from '../../modules/ElementNode';

class ModCardNavigation extends ElementNode {
  constructor(node, callback) {
    super(node);
    this.callback = callback;

    this.node.className = 'modcard-nav';

    this.currentIndex = 0;
    this.hasLogviewer = false;

    this.onClick = this.onClick.bind(this);
    this.render = this.render.bind(this);
    this.render();
  }

  setLogviewer(hasLogviewer) {
    if (hasLogviewer !== this.hasLogviewer) {
      this.hasLogviewer = hasLogviewer;
      this.render();
    }
  }

  render() {
    const items = [
      this.spawnItem('Chat History', 0),
      this.spawnItem('Past Usernames', 1),
    ];
    if (this.hasLogviewer) {
      items.push(this.spawnItem('Logviewer Logs', 2));
    }
    this.node.innerHTML = '';
    for (let i = 0; i < items.length; i++) {
      this.node.appendChild(items[i]);
    }
  }

  onClick(e, selectedIndex, currentIndex) {
    e.preventDefault();
    // console.log(selectedIndex, currentIndex);
    if (selectedIndex !== currentIndex) {
      this.callback(selectedIndex, currentIndex);
      this.currentIndex = selectedIndex;
      this.render();
    }
  }

  spawnItem(label, index) {
    const node = document.createElement('li');
    node.classList.add('modcard-nav-item');
    if (index === this.currentIndex) {
      node.classList.add('modcard-nav-item-active');
    }

    const anchorNode = document.createElement('a');
    anchorNode.href = '#';
    anchorNode.onclick = e => this.onClick(e, index, this.currentIndex);
    anchorNode.textContent = label;

    node.appendChild(anchorNode);
    return node;
  }
}

export default ModCardNavigation;
