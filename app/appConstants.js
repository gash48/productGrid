
const DOMCONSTANTS = {
  productsContainerSelector: '#cardsContainer',
  cardTitleContainer: 'card-body',
  productCardSelector: 'productCard',
  cardImageSelector: 'card-img-top',
  cardTitleSelector: '.card-title',
  checkBoxClass: 'form-control',
  listClass: 'dynList',
  filterButtonSelector: '#menu-toggle',
  sideMenuSelector: '#wrapper',
  resetButtonSelector: '#resetAll',
  paginationContainerSelector: 'pagination',
  paginationOptionSelector: 'paginationOption',
  paginationSelectBox: 'paginationSelectBox',
  paginationControlBarSelector: 'paginationControlContainer',
  paginationControlSelector: 'paginationControlBox',
  paginationCarets: 'pagiCaret',
  paginationLabel: 'pagiLabel',
  selectedPageClass: 'selectedPage',
  sortingContainerSelector: 'sorting',
  sortingSelectBox: 'sortingSelectBox',
  sortingOptionSelector: 'sortingOption',
};

const paginationValues = [0, 3, 6, 9];
const defaultRecordsToShow = 4;
const sortingValues = ['-1', 'name', 'brand', 'color'];

const defaultFilters = {
  brand: [],
  color: [],
  sold_out: [],
};

const specialFilters = {
  sold_out: {
    getValue(val) {
      return !val ? 'Available' : 'Sold Out';
    },
  },
};

export {
  DOMCONSTANTS, specialFilters, paginationValues, defaultRecordsToShow, defaultFilters,
  sortingValues,
};
