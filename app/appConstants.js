
const DOMCONSTANTS = {
  productsContainerSelector: '#cardsAdder',
  cardCloneSelector: '#sampleCard',
  cardImageSelector: '.card-img-top',
  cardTitleSelector: '.card-title',
  checkBoxClass: 'form-control',
  listClass: 'dynList',
  filterButtonSelector: '#menu-toggle',
  sideMenuSelector: '#wrapper',
  resetButtonSelector: '#resetAll',
};

const specialFilters = {
  sold_out: {
    getValue(val) {
      return !val ? 'Available' : 'Sold Out';
    },
  },
};

export { DOMCONSTANTS, specialFilters };
