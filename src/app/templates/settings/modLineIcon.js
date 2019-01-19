const typesMap = {
  0: 'Chat Command',
  1: 'Open URL',
};

const settingModLineLabelTextTemplate = (item) => `
  <input type="text" class="setting-mod-line-icon-label-input input input-thin" value="${item.textLabel}">
`;

const settingModLineLabelIconTemplate = (item) => `
  <div class="setting-mod-line-icon-icon-container">
    <button class="setting-mod-line-icon-icon-preview setting-mod-line-icon-label-input input">
      <i class="fa fa-${item.iconLabel}"></i>
    </button>
  </div>
`;

const settingModLineIconTemplate = (item, i) => `
  <div class="setting-mod-line-icon-controls">
    <button class="setting-mod-line-icon-up setting-mod-line-icon-control" data-action="moveModLineIcon" data-direction="up" data-index="${i}">
      <i class="fa fa-arrow-up"></i>
    </button>
    <button class="setting-mod-line-icon-delete setting-mod-line-icon-control" data-action="deleteModLineIcon" data-index="${i}">
      <i class="fa fa-trash"></i>
    </button>
    <button class="setting-mod-line-icon-down setting-mod-line-icon-control" data-action="moveModLineIcon" data-direction="down" data-index="${i}">
      <i class="fa fa-arrow-down"></i>
    </button>
  </div>
  <div class="setting-mod-line-icon-type setting-mod-line-icon-column">
    <select class="setting-mod-line-icon-type input input-block">
      <option value="0"${item.type == 0 ? ' selected' : ''}>Chat Command</option>
      <option value="1"${item.type == 1 ? ' selected' : ''}>Open URL</option>
    </select>
  </div>
  <div class="setting-mod-line-icon-query flex-1 setting-mod-line-icon-column">
    <input type="text" required class="setting-mod-line-icon-input input input-block" value="${item.query}" placeholder=".timeout {username} 1">
  </div>
  <div class="setting-mod-line-icon-label-type setting-mod-line-icon-column">
    <select class="setting-mod-line-icon-labeltype input input-block">
      <option value="0"${item.labelType == 0 ? ' selected' : ''}>Icon</option>
      <option value="1"${item.labelType == 1 ? ' selected' : ''}>Text</option>
    </select>
  </div>
  <div class="setting-mod-line-icon-label setting-mod-line-icon-column">
    ${item.labelType == 0 ? settingModLineLabelIconTemplate(item)  : settingModLineLabelTextTemplate(item)}
  </div>
`;

export default settingModLineIconTemplate;
