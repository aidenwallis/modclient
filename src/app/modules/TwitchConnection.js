import regexes from '../regexes';
import EventEmitter from 'eventemitter3';
import parseIRCMessage from '../util/parseIRCMessage';

const address = 'wss://irc-ws.chat.twitch.tv/';

class TwitchConnection extends EventEmitter {
  constructor(username, password, channel = null, channelID = null) {
    super();
    this.username = username;
    this.password = password;
    this.connected = false;
    this.channel = channel;
    this.channelID = channelID;
    this.client = null;
    this.interval = null;
    this.connectionCallback = null;
  }

  connect() {
    return new Promise((resolve, reject) => {
      if (this.connected) {
        return resolve(true);
      }
      this.client = new WebSocket(address);
      this.client.onopen = () => {
        this.connected = true;
        if (this.interval) {
          clearInterval(this.interval);
          this.interval = null;
        }
        this.send('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership');
        this.send(`PASS oauth:${this.password}`);
        this.send(`NICK ${this.username}`);
        this.send(`USER ${this.username} 8 * :${this.username}`);
        if (this.channel) {
          this.send(`JOIN #${this.channel}`);
        }
        console.log('Websocket established');
        resolve();
      };
      this.registerEvents();
    });
  }

  registerEvents() {
    if (!this.client) {
      throw new Error('Tried to bind events to a non existent client!');
    }
    this.client.onmessage = (e) => {
      // console.log(e.data);
      e.data.split(regexes.ircSplit).forEach((line) => {
        // console.log(line);
        if (line.replace(regexes.space, '') === '') {
          return;
        }
        const parsed = parseIRCMessage(line);
        if (parsed.command === 'PING') {
          this.send('PONG');
          return;
        }
        this.emit(parsed.command, parsed);
        // console.log(parsed);
      });
    };
    this.client.onerror = (e) => {
      if (e.code === 'ECONNREFUSED' && !this.interval) {
        this.connected = false;
        this.interval = setInterval(() => this.connect(), 2000);
      }
    };
  }

  joinChannel(channel) {
    this.channel = channel;
    this.send(`JOIN #${channel}`);
  }

  send(message) {
    if (!this.client) {
      throw new Error('No client to send a message from!');
    }
    console.log(`--> ${message.startsWith('PASS ') ? 'PASS oauth:****' : message}`);
    this.client.send(message);
  }
}

export default TwitchConnection;
