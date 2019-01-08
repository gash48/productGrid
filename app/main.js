/* eslint-disable no-new */
/* eslint-disable no-undef */
import getProductsData from './apiService';
import ProductGrid from './productGrid';
import { DOMCONSTANTS, defaultFilters } from './appConstants';

$(document).ready(() => {
  $(DOMCONSTANTS.filterButtonSelector).click((e) => {
    e.preventDefault();
    $(DOMCONSTANTS.sideMenuSelector).toggleClass('toggled');
  });

  getProductsData().then((res) => {
    if (res) {
      new ProductGrid(res, defaultFilters);
    }
  });
});
