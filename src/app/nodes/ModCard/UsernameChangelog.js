import ElementNode from '../../modules/ElementNode';
import CommanderrootClient from '../../modules/CommanderrootClient';
import modcardErroredTemplate from '../../templates/modcard/errored';
import modcardLoadingTemplate from '../../templates/modcard/loading';
import modcardUsernamesTemplate from '../../templates/modcard/usernames';

const commanderrootClient = new CommanderrootClient();

class ModcardUsernameChangelog extends ElementNode {
  constructor(node, username) {
    super(node);
    this.username = username;
    this.usernames = null;
    this.errored = false;
  }

  init() {
    if (this.usernames === null) {
      this.load();
    }
  }

  load() {
    commanderrootClient.fetchChangelogs(this.username)
      .then((usernames) => {
        this.usernames = usernames;
        this.render();
      })
      .catch((err) => {
        console.error(err);
        this.errored = true;
        this.render();
      });
  }

  unload() {
    return;
  }

  generate() {
    if (this.errored) {
      return modcardErroredTemplate();
    }
    if (this.usernames === null) {
      return modcardLoadingTemplate();
    }
    return modcardUsernamesTemplate(this.usernames);
  }

  render() {
    this.node.innerHTML = this.generate();
  }
}

export default ModcardUsernameChangelog;
