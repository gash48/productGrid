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
import { defaultRecordsToShow, DOMCLASSES, DOMACCESS, DATA_ATTR, defaultFilters } from './appConstants';
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
      this.setAddons(options.rpp, true);
    } else {
      this.initAddons();
    }
    // --------------------------------------------------- //

    // Reset Filter Event Listener
    $(DOMACCESS.resetButton).click(e => this.resetAddons(e));
    // Hash Event Listener
    $(window).on('hashchange', e => this.hashChangeListener(e));
  }

  // INitialize Filters, Pagination, Sorting and adds Products
  initAddons() {
    this.createFilterList();
    this.domUtil.createSortingOptions(e => this.sortingChangeListener(e));
    this.domUtil.createPaginationOptions();
    this.initPagination(this.products, defaultRecordsToShow);
  }

  setAddons(recordsPerPage, refreshPage = false) {
    // Adds Filters, Sorting and Pagination
    if (refreshPage) {
      this.createFilterList();
      this.domUtil.createSortingOptions(e => this.sortingChangeListener(e));
      this.domUtil.createPaginationOptions();
    }
    // Sort records
    $(DOMACCESS.sorting.selectBox).val(this.currentSort);
    this.products = this.currentSort !== '-1' ? jqUtil.getSortedArray(this.products, this.currentSort) : this.fetchedProducts;
    // Set Filters Checks from Applied Filters
    this.setFilters();
    // Set Pagination & Refreshed Content
    $(DOMACCESS.pagination.selectBox).val(recordsPerPage);
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
    $(DOMACCESS.filterOptions).change(e => this.filterChangeListener(e));
  }

  initPagination(products, recordsPerPage = defaultRecordsToShow, offset = 0) {
    this.domUtil.resetPaginationDOM(this.currentPage);
    this.domUtil.createPaginationControls(recordsPerPage, products.length, this.currentPage);
    this.addProducts(this.getPaginatedRecords(offset, recordsPerPage, products), recordsPerPage);
    // Sets Listeners On Pagination Controls
    $(DOMACCESS.pagination.selectBox).change(e => this.paginationSelectChangeListener(e, products));
    $(DOMACCESS.pagination.carets).click(e => this.paginationControlListener(e, recordsPerPage, products));
    $(DOMACCESS.pagination.controls).click(e => this.paginationControlListener(e, recordsPerPage, products, false));
  }

  // Add Products
  addProducts(products, recordsPerPage) {
    // Change Hash When refreshing products
    this.hashChanger(recordsPerPage);
    $(DOMACCESS.productContainer).empty();

    const documentFragment = $(document.createDocumentFragment());
    products.map((product) => {
      const productCard = $('<div>').attr({ class: DOMCLASSES.productContainer });
      const productImage = $('<img>').attr({ class: DOMCLASSES.productImage, src: `./assets/images/${product.url}` });
      const productTitle = $('<div>').attr({ class: DOMCLASSES.productTitle });
      const productName = $('<h5>').attr({ class: DOMCLASSES.productName }).html(product.name);

      productTitle.append(productName);
      productCard.append(productImage);
      productCard.append(productTitle);
      documentFragment.append(productCard);
    });
    $(DOMACCESS.productContainer).append(documentFragment);
  }

  // Refresh Products List
  refreshProducts(currentPage = 1) {
    const filteredProducts = jqUtil.allinOnefilter(this.products, this.appliedFilters);
    const currentRecordsShowing = parseInt($(DOMACCESS.pagination.selectBox).val(), 10);
    const offset = (currentPage - 1) * currentRecordsShowing;
    this.currentPage = currentPage;

    this.initPagination(filteredProducts, currentRecordsShowing, offset);
  }

  // -------------------------- All Listeners -------------------------- //
  paginationControlListener(e, recordsPerPage, products, dir = true) {
    const newPage = dir ? parseInt(e.target.title, 10) + this.currentPage : parseInt(e.target.title, 10);
    // const currentPageAccess = ;
    if ($(`[${DATA_ATTR}=page${newPage}]`).length) {
      $(`[${DATA_ATTR}=page${this.currentPage}]`).removeClass(DOMCLASSES.selectedPage);
      this.currentPage = newPage;
      this.addProducts(this.getPaginatedRecords((this.currentPage - 1) * recordsPerPage, recordsPerPage, products), recordsPerPage);
      $(DOMACCESS.pagination.label).html(this.domUtil.getPaginationLabel(products.length, recordsPerPage, this.currentPage));
      $(`[${DATA_ATTR}=page${this.currentPage}]`).addClass(DOMCLASSES.selectedPage);
    }
  }

  paginationSelectChangeListener(e, products = this.products) {
    const recordsToShow = parseInt(e.target.value, 10);
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
    const { hash } = e.target.location;
    if (hash) {
      const options = jqUtil.getDecodedFilterFromUrl(e.target.location.hash);
      this.currentPage = options.page;
      this.currentSort = options.sort;
      this.appliedFilters = options.filters;
      this.setAddons(options.rpp);
    }
  }

  hashChanger(recordsPerPage) {
    window.location.hash = jqUtil.getHashEncodedUrl(this.appliedFilters, this.currentSort, this.currentPage, recordsPerPage);
  }

  // ----------------------- Resetting Filters, Sorting, Pagination & DOM -------- //
  resetAddons() {
    this.products = this.fetchedProducts;
    $(DOMACCESS.sorting.selectBox).val('-1');
    $(DOMACCESS.pagination.selectBox).val(defaultRecordsToShow);
    $(DOMACCESS.filterOptions).prop('checked', false).change();
    this.appliedFilters = defaultFilters;
  }

  // Slices Paginated Records
  getPaginatedRecords(offset = 0, recordsPerPage = defaultRecordsToShow, products = this.products) {
    return products.slice(offset, offset + recordsPerPage);
  }
}

export default ProductGrid;
