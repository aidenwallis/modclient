import chatRoomstateTemplate from '../templates/chat/roomstate';

import ElementNode from '../modules/ElementNode';

class RoomstateNode extends ElementNode {
  constructor(node) {
    super(node);
  }

  updateRoomstate(tags) {
    this.node.innerHTML = chatRoomstateTemplate(tags);
  }
}

export default RoomstateNode;
