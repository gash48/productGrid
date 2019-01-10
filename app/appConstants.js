/* eslint-disable no-undef */

const DOM_DATA_ATTR = 'data-access';
const DATA_ATTR = 'data-attr';

// ONly FOr Styling PurPose
const DOMCLASSES = {
  productContainer: 'productCard',
  productTitle: 'card-body',
  productImage: 'card-img-top',
  productName: 'text-center',
  filterControls: 'form-control',
  filterContainer: 'dynList',
  paginationSelectBox: 'paginationSelectBox',
  paginationControls: 'paginationControlBox',
  selectedPage: 'selectedPage',
  sortingSelectBox: 'sortingSelectBox',
};

const DOMACCESS = {
  productContainer: `[${DOM_DATA_ATTR}=productsContainer]`,
  filterOptions: `[${DOM_DATA_ATTR}=filterControl]`,
  pagination: {
    container: `[${DOM_DATA_ATTR}=pagination]`,
    selectBox: `[${DOM_DATA_ATTR}=paginationSelectBox]`,
    controlContainer: `[${DOM_DATA_ATTR}=paginationControlContainer]`,
    controls: `[${DOM_DATA_ATTR}=paginationControls]`,
    label: `[${DOM_DATA_ATTR}=paginationLabel]`,
    carets: `[${DOM_DATA_ATTR}=paginationCarets]`,
  },
  sorting: {
    container: `[${DOM_DATA_ATTR}=sorting]`,
    selectBox: `[${DOM_DATA_ATTR}=sortingSelectBox]`,
  },
  resetButton: `[${DOM_DATA_ATTR}=resetAll]`,
  sideMenuSelector: '#wrapper',
  filterButtonSelector: '#menu-toggle',
};

// Pagintion & Sorting
const paginationValues = [4, 3, 6, 9];
const defaultRecordsToShow = paginationValues[0];
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
  DOMCLASSES, DOMACCESS, DOM_DATA_ATTR, specialFilters, paginationValues,
  defaultRecordsToShow, defaultFilters, sortingValues, DATA_ATTR,
};
