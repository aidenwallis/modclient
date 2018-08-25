const rx = /^(?:@([^ ]+) )?(?:[:](\S+) )?(\S+)(?: (?!:)(.+?))?(?: [:](.+))?$/;
const rx2 = /([^=;]+)=([^;]*)/g;
const rx3 = /\\s/g;

const STATE_V3 = 1;
const STATE_PREFIX = 2;
const STATE_COMMAND = 3;
const STATE_PARAM = 4;
const STATE_TRAILING = 5;

function parseIRCMessage(message) {
  const data = rx.exec(message);
  if (data === null) {
    console.error(`Couldnt parse message '${message}'`);
    return null;
  }
  const tagdata = data[STATE_V3];
  const tags = {};
  if (tagdata) {
    let m;
    do {
      m = rx2.exec(tagdata);
      if (m) {
        const [, key, val] = m;
        tags[key] = val.replace(rx3, ' ').trim();
      }
    } while (m);
  }
  return {
    tags,
    command: data[STATE_COMMAND],
    prefix: data[STATE_PREFIX],
    param: data[STATE_PARAM],
    trailing: data[STATE_TRAILING],
  };
}

export default parseIRCMessage;
