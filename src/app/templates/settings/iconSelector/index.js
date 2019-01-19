import icons from '../../../icons.json';

const iconSelectorItem = (currentIcon, icon) => `
  <button class="icon-selector-icon${currentIcon === icon ? ' icon-selector-icon-active' : ''}" title="${icon}">
    <i class="fa fa-fw fa-${icon}" aria-hidden="true"></i>
  </button>
`;

const iconSelector = (item) => `
  <i class="fa fa-caret-up icon-selector-uptick" aria-hidden="true"></i>
  <div class="icon-selector-icons scrollbar">
    ${icons.map(icon => iconSelectorItem(item, icon)).join('')}
  </div>
`;

export default iconSelector;
