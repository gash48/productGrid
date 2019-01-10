/* eslint-disable no-new */
/* eslint-disable no-undef */
import getProductsData from './apiService';
import ProductGrid from './productGrid';
import { DOMCONSTANTS, defaultFilters } from './appConstants';
import jqUtil from './jqUtil';

$(document).ready(() => {
  $(DOMCONSTANTS.filterButtonSelector).click((e) => {
    e.preventDefault();
    $(DOMCONSTANTS.sideMenuSelector).toggleClass('toggled');
  });

  getProductsData().then((res) => {
    if (res) {
      const urlHash = window.location.hash;
      let options = {};
      if (urlHash) {
        options = jqUtil.getDecodedFilterFromUrl(urlHash);
      } else {
        options = {
          filters: defaultFilters, sort: '-1', page: 1,
        };
      }
      new ProductGrid(res, options, Boolean(urlHash));
    }
  });
});
