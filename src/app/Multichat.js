/**
 * This class simply generates iframes per channel in the URL to make easy multichat ability.
 */
class Multichat {
  constructor() {
    this.node = document.getElementById('app');
  }

  populateChannels(channels) {
    this.node.classList.add('multichat-container');
    for (const channel of channels) {
      const node = document.createElement('iframe');
      node.src = `https://modclient.aidenwallis.co.uk/${channel}`;
      node.frameBorder = 0;
      node.className = 'multichat-iframe';
      this.node.appendChild(node);
    }
  }
}

export default Multichat;
