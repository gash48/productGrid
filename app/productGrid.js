/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/* eslint-disable no-lonely-if */
/* eslint-disable object-curly-newline */
/* eslint-disable no-trailing-spaces */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-plusplus */
/* eslint-disable max-len */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-undef */
import jqUtil from './jqUtil';
import { DOMCONSTANTS, defaultRecordsToShow } from './appConstants';
import DOMManipulator from './domCreationUtil';

class ProductGrid {
  constructor(products, options, hashPresent = false) {
    this.appliedFilters = options.filters;
    this.fetchedProducts = products;
    this.products = products;
    this.currentPage = options.page;
    this.currentSort = options.sort;
    this.domUtil = new DOMManipulator();

    // ------ Inits Filters, Pagination & Sorting -------- //
    if (hashPresent) {
      this.setAddons(options.rpp);
    } else {
      this.initAddons();
    }
    // --------------------------------------------------- //

    // Reset Filter Event Listener
    $(DOMCONSTANTS.resetButtonSelector).click(e => this.resetAddons(e));
    // Hash Event Listener
    // $(window).on('hashchange', e => this.hashChangeListener(e));
  }

  // INitialize Filters, Pagination, Sorting and adds Products
  initAddons() {
    this.createFilterList();
    this.domUtil.createSortingOptions(e => this.sortingChangeListener(e));
    this.domUtil.createPaginationOptions();
    this.initPagination(this.products, defaultRecordsToShow);
  }

  setAddons(recordsPerPage) {
    // Adds Filters, Sorting and Pagination
    this.createFilterList();
    this.domUtil.createSortingOptions(e => this.sortingChangeListener(e));
    this.domUtil.createPaginationOptions();
    // Sort records
    $(`#${DOMCONSTANTS.sortingSelectBox}`).val(this.currentSort);
    this.products = this.currentSort !== '-1' ? jqUtil.getSortedArray(this.products, this.currentSort) : this.fetchedProducts;
    // Set Filters Checks from Applied Filters
    this.setFilters();
    // Set Pagination & Refreshed Content
    $(`#${DOMCONSTANTS.paginationSelectBox}`).val(recordsPerPage === defaultRecordsToShow ? 0 : recordsPerPage);
    this.refreshProducts(this.currentPage);
  }

  setFilters() {
    Object.keys(this.appliedFilters).map((filter) => {
      const filterValues = this.appliedFilters[filter];
      if (filterValues.length) {
        filterValues.map((filterName) => {
          $(`input[name='${filter}'][value='${filterName}']`).prop('checked', true);
        });
      }
    });
  }

  createFilterList() {
    Object.keys(this.appliedFilters).map(ele => this.domUtil.createFilter(ele, this.products));
    $(`.${DOMCONSTANTS.checkBoxClass}`).change(e => this.filterChangeListener(e));
  }

  initPagination(products, recordsPerPage = defaultRecordsToShow, offset = 0) {
    this.domUtil.resetPaginationDOM(this.currentPage);
    this.domUtil.createPaginationControls(recordsPerPage, products.length, this.currentPage);
    this.addProducts(this.getPaginatedRecords(offset, recordsPerPage, products), recordsPerPage);
    // Sets Listeners On Pagi Controls
    $(`.${DOMCONSTANTS.paginationSelectBox}`).change(e => this.paginationSelectChangeListener(e, products));
    $(`.${DOMCONSTANTS.paginationCarets}`).click(e => this.paginationControlListener(e, recordsPerPage, products));
    $(`.${DOMCONSTANTS.paginationControlSelector}`).click(e => this.paginationControlListener(e, recordsPerPage, products, false));
  }

  // Add Products
  addProducts(products, recordsPerPage) {
    this.hashChanger(recordsPerPage);
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
  refreshProducts(currentPage = 1) {
    const filteredProducts = jqUtil.allinOnefilter(this.products, this.appliedFilters);
    const selectBoxValue = parseInt($(`#${DOMCONSTANTS.paginationSelectBox}`).val(), 10);
    const currentRecordsShowing = selectBoxValue || defaultRecordsToShow;
    const offset = (currentPage - 1) * currentRecordsShowing;
    this.currentPage = currentPage;
    this.initPagination(filteredProducts, currentRecordsShowing, offset);
  }

  // -------------------------- All Listeners -------------------------- //
  paginationControlListener(e, recordsPerPage, products, dir = true) {
    const newPage = dir ? parseInt(e.target.title, 10) + this.currentPage : parseInt(e.target.title, 10);
    if ($(`#page${newPage}`).length) {
      $(`#page${this.currentPage}`).removeClass(DOMCONSTANTS.selectedPageClass);
      this.currentPage = newPage;
      this.addProducts(this.getPaginatedRecords((this.currentPage - 1) * recordsPerPage, recordsPerPage, products), recordsPerPage);
      $(`.${DOMCONSTANTS.paginationLabel}`).html(this.domUtil.getPaginationLabel(products.length, recordsPerPage, this.currentPage));
      $(`#page${this.currentPage}`).addClass(DOMCONSTANTS.selectedPageClass);
    }
  }

  paginationSelectChangeListener(e, products = this.products) {
    const recordsToShow = parseInt(e.target.value, 10) ? parseInt(e.target.value, 10) : defaultRecordsToShow;
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
    this.currentSort = sortingOption;
    this.products = sortingOption !== '-1' ? jqUtil.getSortedArray(this.products, sortingOption) : this.fetchedProducts;
    this.refreshProducts();
  }

  hashChangeListener(e) {
    const options = jqUtil.getDecodedFilterFromUrl(e.target.location.hash);
    this.currentPage = options.page;
    this.currentSort = options.sort;
    this.appliedFilters = options.filters;
    this.setAddons(options.rpp);
  }

  hashChanger(recordsPerPage) {
    window.location.hash = jqUtil.getHashEncodedUrl(this.appliedFilters, this.currentSort, this.currentPage, recordsPerPage);
  }

  // ----------------------- Resetting Filters, Sorting, Pagination & DOM -------- //
  resetAddons() {
    this.products = this.fetchedProducts;
    $(`#${DOMCONSTANTS.sortingSelectBox}`).val('-1');
    $(`#${DOMCONSTANTS.paginationSelectBox}`).val(0);
    $(`.${DOMCONSTANTS.checkBoxClass}`).prop('checked', false).change();
  }

  // Slices Paginated Records
  getPaginatedRecords(offset = 0, recordsPerPage = defaultRecordsToShow, products = this.products) {
    return products.slice(offset, offset + recordsPerPage);
  }
}

export default ProductGrid;
