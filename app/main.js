/* eslint-disable no-new */
/* eslint-disable no-undef */
import getProductsData from './apiService';
import ProductGrid from './productGrid';
import { DOMACCESS } from './appConstants';
import jqUtil from './jqUtil';

$(document).ready(() => {
  $(DOMACCESS.filterButtonSelector).click((e) => {
    e.preventDefault();
    $(DOMACCESS.sideMenuSelector).toggleClass('toggled');
  });

  getProductsData().then((res) => {
    if (res) {
      const urlHash = window.location.hash;
      const options = jqUtil.getDecodedFilterFromUrl(urlHash);
      new ProductGrid(res, options, Boolean(urlHash));
    }
  });
});
