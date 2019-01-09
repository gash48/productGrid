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
  DOMCONSTANTS, specialFilters, paginationValues, defaultRecordsToShow, defaultFilters, sortingValues,
} from './appConstants';

class ProductGrid {
  constructor(products, appliedFilters) {
    this.appliedFilters = appliedFilters;
    this.fetchedProducts = products;
    this.products = products;
    this.currentPage = 1;

    // ------ Inits Filters, Pagination & Sorting -------- //
    this.createFilterList();
    this.createPaginationOptions();
    this.createSortingOptions();
    this.initPagination(this.products, defaultRecordsToShow);
    // --------------------------------------------------- //

    // Reset Filter Event Listener
    $(DOMCONSTANTS.resetButtonSelector).click(e => this.resetFilters(e));
  }

  // ------------ Creates Filters, Sorting, Pagination Controls -------------- //
  createFilterList() {
    Object.keys(this.appliedFilters).map(ele => this.createFilter(ele, this.products));
    $(`.${DOMCONSTANTS.checkBoxClass}`).change(e => this.filterChangeListener(e));
  }

  createSortingOptions() {
    const documentFragment = $(document.createDocumentFragment());
    const sortingSelectBox = $('<select>').attr({ class: DOMCONSTANTS.sortingSelectBox, name: DOMCONSTANTS.sortingSelectBox, id: DOMCONSTANTS.sortingSelectBox });

    sortingValues.map((sorts) => {
      const option = $('<option>').attr({ class: DOMCONSTANTS.sortingOptionSelector }).val(sorts).html(sorts === '-1' ? 'Sort By' : `Sort By ${sorts}`);
      sortingSelectBox.append(option);
    });
    documentFragment.append(sortingSelectBox);
    $(`#${DOMCONSTANTS.sortingContainerSelector}`).append(documentFragment);

    $(`#${DOMCONSTANTS.sortingSelectBox}`).change(e => this.sortingChangeListener(e));
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

  createPaginationControls(recordsPerPage, totalRecords) {
    const noOfPages = Math.ceil(totalRecords / recordsPerPage);
    const documentFragment = $(document.createDocumentFragment());

    for (let i = 0; i < noOfPages; i++) {
      const paginationControl = $('<a>').attr({ class: DOMCONSTANTS.paginationControlSelector, id: `page${i + 1}`, title: i + 1 }).html(i + 1);
      documentFragment.append(paginationControl);
    }
    $(`.${DOMCONSTANTS.paginationLabel}`).html(this.getPaginationLabel(totalRecords, recordsPerPage));
    $(`.${DOMCONSTANTS.paginationControlBarSelector}`).append(documentFragment);

    $(`#page${this.currentPage}`).addClass(DOMCONSTANTS.selectedPageClass);
  }

  // ------------ -- ------------------------------------- -------------- //

  // INitialize Pagination and add refresh Products
  initPagination(products, recordsPerPage = defaultRecordsToShow, start = 0) {
    this.resetPaginationDOM();
    this.createPaginationControls(recordsPerPage, products.length);
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
      $(`.${DOMCONSTANTS.paginationLabel}`).html(this.getPaginationLabel(products.length, recordsPerPage));
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
  // -------------------------  ---------- ----------------------------  //

  // Slices Paginated Records
  getPaginatedRecords(start = 0, recordsPerPage = defaultRecordsToShow, products = this.products) {
    return products.slice(start, start + recordsPerPage);
  }

  getPaginationLabel(totalRecords, recordsPerPage) {
    const noOfPages = Math.ceil(totalRecords / recordsPerPage);
    if (!noOfPages) {
      return ('<b>No Records To Display</b>');
    }
    return (`Page <b>${this.currentPage}</b> of <b>${noOfPages}</b>. Total Products<b> :- <b>${totalRecords}</b>`);
  }

  // ----------------------- Resetting Filters, Sorting, Pagination & DOM -------- //
  resetFilters() {
    $(`.${DOMCONSTANTS.checkBoxClass}`).prop('checked', false);
    this.appliedFilters = defaultFilters;
    $(`#${DOMCONSTANTS.paginationSelectBox}`).val(0);
    this.paginationSelectChangeListener({ target: {} }, this.fetchedProducts);
    $(`#${DOMCONSTANTS.sortingSelectBox}`).val('-1');
  }

  resetPaginationDOM() {
    $(`.${DOMCONSTANTS.paginationControlBarSelector}`).empty();
    $(`.${DOMCONSTANTS.paginationSelectBox}`).off();
    $(`.${DOMCONSTANTS.paginationCarets}`).off();
    $(`.${DOMCONSTANTS.paginationControlSelector}`).off();
    $(`#page${this.currentPage}`).removeClass(DOMCONSTANTS.selectedPageClass);
  }

  // -------------------------  ---------- ----------------------------  //
}

export default ProductGrid;
