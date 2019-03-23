const typesMap = {
  0: 'Chat Command',
  1: 'Open URL',
};

const settingModLineLabelTextTemplate = (item) => `
  <input type="text" class="setting-item-label-input input input-thin" value="${item.textLabel}">
`;

const settingModLineLabelIconTemplate = (item) => `
  <div class="setting-item-icon-container">
    <button class="setting-item-icon-preview setting-item-label-input input">
      <i class="fa fa-${item.iconLabel}"></i>
    </button>
  </div>
`;

const settingModLineIconTemplate = (item, i) => `
  <div class="setting-item-controls">
    <button class="setting-item-up setting-item-control" data-action="moveModLineIcon" data-direction="up" data-index="${i}">
      <i class="fa fa-arrow-up"></i>
    </button>
    <button class="setting-item-delete setting-item-control" data-action="deleteModLineIcon" data-index="${i}">
      <i class="fa fa-trash"></i>
    </button>
    <button class="setting-item-down setting-item-control" data-action="moveModLineIcon" data-direction="down" data-index="${i}">
      <i class="fa fa-arrow-down"></i>
    </button>
  </div>
  <div class="setting-item-type setting-item-column">
    <select class="setting-item-type input input-block">
      <option value="0"${item.type == 0 ? ' selected' : ''}>Command</option>
      <option value="1"${item.type == 1 ? ' selected' : ''}>Open URL</option>
    </select>
  </div>
  <div class="setting-item-query flex-1 setting-item-column">
    <input type="text" required class="setting-item-input input input-block" value="${item.query}" placeholder=".timeout {username} 1">
  </div>
  <div class="setting-item-label-type setting-item-column">
    <select class="setting-item-labeltype input input-block">
      <option value="0"${item.labelType == 0 ? ' selected' : ''}>Icon</option>
      <option value="1"${item.labelType == 1 ? ' selected' : ''}>Text</option>
    </select>
  </div>
  <div class="setting-item-label setting-item-column">
    ${item.labelType == 0 ? settingModLineLabelIconTemplate(item)  : settingModLineLabelTextTemplate(item)}
  </div>
`;

export default settingModLineIconTemplate;
