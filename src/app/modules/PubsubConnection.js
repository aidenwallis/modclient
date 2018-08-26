import keys from 'lodash/keys';
import EventEmitter from 'eventemitter3';

const address = 'wss://pubsub-edge.twitch.tv';

class PubsubConnection extends EventEmitter {
  constructor(token) {
    super();
    this.token = token;
    this.topics = {};
    this.connected = false;
    this.connection = null;
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
        const topics = keys(this.topics);
        if (topics.length > 0) {
          this.send('LISTEN', topics);
        }
        console.log('Connected to Pubsub!');
        resolve();
      };
      this.client.onmessage = (e) => {
        this.handleMessage(e.data);
      };
    });
  }

  send(type, topics) {
    if (!this.connected) {
      return;
    }
    this.client.send(JSON.stringify({ type, data: { topics, auth_token: this.token } }));
  }

  subscribeTopic(topic) {
    if (!this.connected) {
      throw new Error('Tried to subscribe to pubsub topic when not connected');
    }
    this.send('LISTEN', [topic]);
    this.topics[topic] = true;
  }

  handleMessage(event) {
    const parsed = JSON.parse(event);
    if (parsed.data) {
      const message = JSON.parse(parsed.data.message);
      if (!message) {
        return console.error('failed to parse pubsub msg', event);
      }
      const { data } = message;
      if (data.type !== 'chat_login_moderation') {
        return;
      }
      this.emit('new', data);
    }
  }
}

export default PubsubConnection;
