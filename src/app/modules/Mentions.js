import SettingsModule from './Settings';

class MentionsModule {
  constructor() {
    this.mentions = SettingsModule.fetchSettings().mentions || [];
    this.mentionFuncs = this.compileMentions();
  }

  updateMentions(mentions) {
    this.mentions = mentions;
    this.mentionFuncs = this.compileMentions();
  }

  compileMentions() {
    return this.mentions.filter(m => m.enabled && m.text !== '').map((mention) => {
      console.log(mention);
      const textLower = mention.text.toLowerCase();
      const type = mention.type.toString();
      switch (type) {
        case '1':
          const re = new RegExp(mention.text, 'i');
          return (msg) => re.test(msg);
        case '0':
        default:
          return (msg) => msg.includes(textLower);
      }
    });
  }

  checkMention(message) {
    const msgLower = message.toLowerCase();
    for (const check of this.mentionFuncs) {
      const matched = check(msgLower);
      if (matched) {
        return true;
      }
    }
    return false;
  }
}

export default new MentionsModule();
