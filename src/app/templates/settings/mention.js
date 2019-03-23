import escape from 'lodash/escape';

const settingsMentionTemplate = (item, i) => `
  <div class="setting-item-controls">
    <button class="setting-item-delete setting-item-control" data-action="deleteMention" data-index="${i}">
      <i class="fa fa-trash"></i>
    </button>
  </div>
  <div class="setting-item-type setting-item-column">
    <select class="setting-item-type input input-block">
    <option value="0"${item.type == 0 ? ' selected' : ''}>String include</option>
    <option value="1"${item.type == 1 ? ' selected' : ''}>RegExp</option>
    </select>
  </div>
  <div class="setting-item-query flex-1 setting-item-column">
    <input type="text" required class="setting-item-input input input-block" value="${escape(item.text)}" placeholder="eg. mod">
  </div>
  <div class="setting-item-column">
    <label class="setting-item-enabled">
      <strong>Enabled</strong>
      <input type="checkbox" class="setting-item-enabled-control" data-index="${i}"${item.enabled ? ' checked' : ''}>
    </label>
  </div>
`;

export default settingsMentionTemplate;
