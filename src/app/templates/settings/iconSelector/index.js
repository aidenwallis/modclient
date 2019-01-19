import icons from '../../../icons.json';

const iconSelectorItem = (item, icon) => `
  <button class="icon-selector-icon">
    <i class="fa fa-fw fa-${icon}" aria-hidden="true"></i>
  </button>
`;

const iconSelector = (item) => `
  <div class="icon-selector">
    <i class="fa fa-caret-up icon-selector-uptick" aria-hidden="true"></i>
    <div class="icon-selector-icons">
      ${icons.map(icon => iconSelectorItem(item, icon)).join('')}
    </div>
  </div>
`;

export default iconSelector;
