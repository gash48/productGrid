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
  DOMCONSTANTS, specialFilters, paginationValues, defaultRecordsToShow, defaultFilters,
} from './appConstants';

class ProductGrid {
  constructor(products, appliedFilters) {
    this.appliedFilters = appliedFilters;
    this.products = products;
    this.currentPage = 1;

    // ------Inits Filters & Pagination -------- //
    this.createFilterList();
    this.createPaginationOptions();
    this.initPagination(this.products, defaultRecordsToShow);
    // -------------- //

    // Reset Filter Event Listener
    $(DOMCONSTANTS.resetButtonSelector).click(e => this.resetFilters(e));
  }

  createFilterList() {
    Object.keys(this.appliedFilters).map(ele => this.createFilter(ele, this.products));
    $(`.${DOMCONSTANTS.checkBoxClass}`).change(e => this.filterChangeListener(e));
  }

  initPagination(products, recordsPerPage = defaultRecordsToShow, start = 0) {
    this.resetPaginationDOM();
    this.createPaginationControls(recordsPerPage, products.length);
    this.addProducts(this.getPaginatedRecords(start, recordsPerPage, products));
    $(`.${DOMCONSTANTS.paginationSelectBox}`).change(e => this.paginationSelectChangeListener(e, products));
    $(`.${DOMCONSTANTS.paginationCarets}`).click(e => this.paginationControlListener(e, recordsPerPage, products));
    $(`.${DOMCONSTANTS.paginationControlSelector}`).click(e => this.paginationControlListener(e, recordsPerPage, products, false));
  }

  addProducts(products) {
    $(DOMCONSTANTS.productsContainerSelector).empty();
    products.map((ele, index) => this.createProduct(ele, index));
  }

  createProduct(product, index) {
    $(DOMCONSTANTS.cardCloneSelector).clone(true).show().appendTo(DOMCONSTANTS.productsContainerSelector);
    $(DOMCONSTANTS.cardImageSelector).eq(index).attr('src', `./assets/images/${product.url}`);
    $(DOMCONSTANTS.cardTitleSelector).eq(index).html(product.name);
  }

  createFilter(prop, products, listClass = DOMCONSTANTS.listClass) {
    const documentFragment = $(document.createDocumentFragment());
    const filterValues = jqUtil.getUniqueFilters(products, prop);
    const filterContainer = $('<ul>').attr({ class: listClass, id: `${prop}List` });

    filterValues.map((filterName) => {
      const checkBox = $('<input />').attr({
        type: 'checkbox', value: filterName, name: prop, class: DOMCONSTANTS.checkBoxClass,
      });
      const radio = $('<input />').attr({
        type: 'radio', value: filterName, name: prop, class: DOMCONSTANTS.checkBoxClass,
      });
      let filterCheckBox = null;
      if (prop in specialFilters) {
        filterCheckBox = $('<li>').html(radio).append(specialFilters[prop].getValue(parseInt(filterName)));
      } else {
        filterCheckBox = $('<li>').html(checkBox).append(filterName);
      }
      filterContainer.append(filterCheckBox);
    });

    documentFragment.append(filterContainer);
    $(`#${prop}`).append(documentFragment);
  }

  createPaginationOptions() {
    const documentFragment = $(document.createDocumentFragment());
    const paginationSelectBox = $('<select>').attr({ class: DOMCONSTANTS.paginationSelectBox, name: DOMCONSTANTS.paginationSelectBox, id: DOMCONSTANTS.paginationSelectBox });

    paginationValues.map((pages) => {
      const option = $('<option>').attr({ class: DOMCONSTANTS.paginationOptionSelector }).val(pages).html(pages > 0 ? pages : `Default (${defaultRecordsToShow})`);
      paginationSelectBox.append(option);
    });
    documentFragment.append(paginationSelectBox);
    $(`#${DOMCONSTANTS.paginationContainerSelector}`).append(documentFragment);
  }

  createPaginationControls(recordsPerPage, totalRecords) {
    const noOfPages = Math.ceil(totalRecords / recordsPerPage);
    const documentFragment = $(document.createDocumentFragment());

    for (let i = 0; i < noOfPages; i++) {
      const paginationControl = $('<a>').attr({ class: DOMCONSTANTS.paginationControlSelector, id: `page${i + 1}`, title: i + 1 }).html(i + 1);
      documentFragment.append(paginationControl);
    }
    $(`.${DOMCONSTANTS.paginationLabel}`).html(`Showing Page ${this.currentPage} of ${noOfPages} (${recordsPerPage} Products Per Page)`);
    $(`.${DOMCONSTANTS.paginationControlBarSelector}`).append(documentFragment);

    $(`#page${this.currentPage}`).addClass(DOMCONSTANTS.selectedPageClass);
  }


  // All Listeners
  paginationControlListener(e, recordsPerPage, products, dir = true) {
    const newPage = dir ? parseInt(e.target.title) + this.currentPage : parseInt(e.target.title);
    const noOfPages = Math.ceil(products.length / recordsPerPage);
    if ($(`#page${newPage}`).length) {
      $(`#page${this.currentPage}`).removeClass(DOMCONSTANTS.selectedPageClass);
      this.currentPage = newPage;
      this.addProducts(this.getPaginatedRecords((this.currentPage - 1) * recordsPerPage, recordsPerPage, products));
      $(`.${DOMCONSTANTS.paginationLabel}`).html(`Showing Page ${this.currentPage} of ${noOfPages} (${recordsPerPage} Products Per Page)`);
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

  // Slices Paginated Records
  getPaginatedRecords(start = 0, recordsPerPage = defaultRecordsToShow, products = this.products) {
    return products.slice(start, start + recordsPerPage);
  }

  // refresh Product List
  refreshProducts() {
    const filteredProducts = jqUtil.allinOnefilter(this.products, this.appliedFilters);
    const selectBoxValue = parseInt($(`#${DOMCONSTANTS.paginationSelectBox}`).val());
    const currentRecordsShowing = selectBoxValue || defaultRecordsToShow;
    this.currentPage = 1;
    this.initPagination(filteredProducts, currentRecordsShowing);
  }

  // Resetting Filters & DOM
  resetFilters() {
    $(`.${DOMCONSTANTS.checkBoxClass}`).prop('checked', false);
    this.appliedFilters = defaultFilters;
    $(`#${DOMCONSTANTS.paginationSelectBox}`).val(0);
    this.paginationSelectChangeListener({ target: {} });
  }

  resetPaginationDOM() {
    $(`.${DOMCONSTANTS.paginationControlBarSelector}`).empty();
    $(`.${DOMCONSTANTS.paginationSelectBox}`).off();
    $(`.${DOMCONSTANTS.paginationCarets}`).off();
    $(`.${DOMCONSTANTS.paginationControlSelector}`).off();
    $(`#page${this.currentPage}`).removeClass(DOMCONSTANTS.selectedPageClass);
  }
}

export default ProductGrid;
