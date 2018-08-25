class ClickModule {
  constructor() {
    this.bindToDocument();
  }

  bindToDocument() {
    document.addEventListener('click', (e) => {
      if (e.target.className === 'chat-line-name-inner') {
        this.handleNameClick(e);
        return;
      }
    });
  }

  handleNameClick(e) {
    console.log(e.target.dataset.username);
  }
}

export default ClickModule;
