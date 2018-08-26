import EventEmitter from 'eventemitter3';

const singleton = Symbol();
const singletonEnforcer = Symbol();

class EventHub extends EventEmitter {
  constructor(enforcer) {
    if (enforcer !== singletonEnforcer) {
      throw new Error('Singleton enforcing failed.');
    }
    super();
  }

  static get instance() {
    if (!this[singleton]) {
      this[singleton] = new EventHub(singletonEnforcer);
    }
    return this[singleton];
  }
}

export default EventHub;
