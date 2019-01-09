/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/* eslint-disable no-lonely-if */
/* eslint-disable object-curly-newline */
/* eslint-disable no-trailing-spaces */
/* eslint-disable array-callback-return */
/* eslint-disable radix */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-plusplus */
/* eslint-disable max-len */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-undef */
import jqUtil from './jqUtil';
import {
  DOMCONSTANTS, defaultRecordsToShow, defaultFilters,
} from './appConstants';
import DOMCreationClass from './domCreationUtil';

class ProductGrid {
  constructor(products, appliedFilters) {
    this.appliedFilters = appliedFilters;
    this.fetchedProducts = products;
    this.products = products;
    this.currentPage = 1;
    this.domUtil = new DOMCreationClass();

    // ------ Inits Filters, Pagination & Sorting -------- //
    this.initAddons();
    // --------------------------------------------------- //

    // Reset Filter Event Listener
    $(DOMCONSTANTS.resetButtonSelector).click(e => this.resetAddons(e));
  }

  // INitialize Filters, Pagination, Sorting and adds Products
  initAddons() {
    this.createFilterList();
    this.domUtil.createSortingOptions(e => this.sortingChangeListener(e));
    this.domUtil.createPaginationOptions();
    this.initPagination(this.products, defaultRecordsToShow);
  }

  createFilterList() {
    Object.keys(this.appliedFilters).map(ele => this.domUtil.createFilter(ele, this.products));
    $(`.${DOMCONSTANTS.checkBoxClass}`).change(e => this.filterChangeListener(e));
  }

  initPagination(products, recordsPerPage = defaultRecordsToShow, start = 0) {
    this.domUtil.resetPaginationDOM(this.currentPage);
    this.domUtil.createPaginationControls(recordsPerPage, products.length, this.currentPage);
    this.addProducts(this.getPaginatedRecords(start, recordsPerPage, products));
    $(`.${DOMCONSTANTS.paginationSelectBox}`).change(e => this.paginationSelectChangeListener(e, products));
    $(`.${DOMCONSTANTS.paginationCarets}`).click(e => this.paginationControlListener(e, recordsPerPage, products));
    $(`.${DOMCONSTANTS.paginationControlSelector}`).click(e => this.paginationControlListener(e, recordsPerPage, products, false));
  }

  // Add Products
  addProducts(products) {
    $(DOMCONSTANTS.productsContainerSelector).empty();
    const documentFragment = $(document.createDocumentFragment());
    products.map((product) => {
      const productCard = $('<div>').attr({ class: DOMCONSTANTS.productCardSelector });
      const cardImage = $('<img>').attr({ class: DOMCONSTANTS.cardImageSelector, src: `./assets/images/${product.url}` });
      const titleDiv = $('<div>').attr({ class: DOMCONSTANTS.cardTitleContainer });
      const cardTitle = $('<h5>').attr({ class: `${DOMCONSTANTS.cardTitleSelector} text-center` }).html(product.name);

      titleDiv.append(cardTitle);
      productCard.append(cardImage);
      productCard.append(titleDiv);
      documentFragment.append(productCard);
    });
    $(DOMCONSTANTS.productsContainerSelector).append(documentFragment);
  }

  // Refresh Products List
  refreshProducts() {
    const filteredProducts = jqUtil.allinOnefilter(this.products, this.appliedFilters);
    const selectBoxValue = parseInt($(`#${DOMCONSTANTS.paginationSelectBox}`).val());
    const currentRecordsShowing = selectBoxValue || defaultRecordsToShow;
    this.currentPage = 1;
    this.initPagination(filteredProducts, currentRecordsShowing);
  }

  // -------------------------- All Listeners -------------------------- //
  paginationControlListener(e, recordsPerPage, products, dir = true) {
    const newPage = dir ? parseInt(e.target.title) + this.currentPage : parseInt(e.target.title);
    if ($(`#page${newPage}`).length) {
      $(`#page${this.currentPage}`).removeClass(DOMCONSTANTS.selectedPageClass);
      this.currentPage = newPage;
      this.addProducts(this.getPaginatedRecords((this.currentPage - 1) * recordsPerPage, recordsPerPage, products));
      $(`.${DOMCONSTANTS.paginationLabel}`).html(this.domUtil.getPaginationLabel(products.length, recordsPerPage, this.currentPage));
      $(`#page${this.currentPage}`).addClass(DOMCONSTANTS.selectedPageClass);
    }
  }

  paginationSelectChangeListener(e, products = this.products) {
    const recordsToShow = parseInt(e.target.value) ? parseInt(e.target.value) : defaultRecordsToShow;
    this.currentPage = 1;
    this.initPagination(products, recordsToShow);
  }

  filterChangeListener(e) {
    const { checked, value, name, type } = e.target;
    if (type === 'radio') {
      this.appliedFilters[name] = [value];
    } else {
      if (checked) {
        this.appliedFilters[name].push(value);
      } else {
        this.appliedFilters[name] = this.appliedFilters[name].filter(ele => ele !== value);
      }
    }
    this.refreshProducts();
  }

  sortingChangeListener(e) {
    const sortingOption = e.target.value;
    this.products = sortingOption !== '-1' ? jqUtil.getSortedArray(this.products, sortingOption) : this.fetchedProducts;
    this.refreshProducts();
  }

  // ----------------------- Resetting Filters, Sorting, Pagination & DOM -------- //
  resetAddons() {
    $(`.${DOMCONSTANTS.checkBoxClass}`).prop('checked', false);
    this.appliedFilters = defaultFilters;
    $(`#${DOMCONSTANTS.paginationSelectBox}`).val(0);
    this.paginationSelectChangeListener({ target: {} }, this.fetchedProducts);
    $(`#${DOMCONSTANTS.sortingSelectBox}`).val('-1');
  }

  // Slices Paginated Records
  getPaginatedRecords(start = 0, recordsPerPage = defaultRecordsToShow, products = this.products) {
    return products.slice(start, start + recordsPerPage);
  }
}

export default ProductGrid;
