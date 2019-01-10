/* eslint-disable max-len */
/* eslint-disable no-plusplus */
/* eslint-disable class-methods-use-this */
/* eslint-disable array-callback-return */
/* eslint-disable no-undef */
import jqUtil from './jqUtil';
import {
  DOM_DATA_ATTR, sortingValues, paginationValues, specialFilters, DOMCLASSES, DOMACCESS, DATA_ATTR,
} from './appConstants';

class DOMManipulator {
  // ------------ Creates Filters, Sorting, Pagination Controls -------------- //
  createSortingOptions(sortingListener) {
    const documentFragment = $(document.createDocumentFragment());
    const sortingSelectBox = $('<select>').attr({ class: DOMCLASSES.sortingSelectBox, [DOM_DATA_ATTR]: 'sortingSelectBox' });
    sortingValues.map((sorts) => {
      const option = $('<option>').val(sorts).html(sorts === '-1' ? 'Sort By' : `Sort By ${sorts}`);
      sortingSelectBox.append(option);
    });
    documentFragment.append(sortingSelectBox);
    $(DOMACCESS.sorting.container).append(documentFragment);
    $(DOMACCESS.sorting.selectBox).change(sortingListener);
  }

  createPaginationOptions() {
    const documentFragment = $(document.createDocumentFragment());
    const paginationSelectBox = $('<select>').attr({ class: DOMCLASSES.paginationSelectBox, [DOM_DATA_ATTR]: 'paginationSelectBox' });

    paginationValues.map((pages) => {
      const option = $('<option>').val(pages).html(pages);
      paginationSelectBox.append(option);
    });
    documentFragment.append(paginationSelectBox);
    $(DOMACCESS.pagination.container).append(documentFragment);
  }

  createFilter(prop, products, listClass = DOMCLASSES.filterContainer) {
    const documentFragment = $(document.createDocumentFragment());
    const filterValues = jqUtil.getUniqueFilters(products, prop);
    const filterContainer = $('<ul>').attr({ class: listClass, [DOM_DATA_ATTR]: `${prop}List` });

    filterValues.map((filterName) => {
      let filterCheckBox = null;
      if (prop in specialFilters) {
        const radio = $('<input />').attr({
          type: 'radio', value: filterName, name: prop, class: DOMCLASSES.filterControls, [DOM_DATA_ATTR]: 'filterControl',
        });
        filterCheckBox = $('<li>').html(radio).append(specialFilters[prop].getValue(parseInt(filterName, 10)));
      } else {
        const checkBox = $('<input />').attr({
          type: 'checkbox', value: filterName, name: prop, class: DOMCLASSES.filterControls, [DOM_DATA_ATTR]: 'filterControl',
        });
        filterCheckBox = $('<li>').html(checkBox).append(filterName);
      }
      filterContainer.append(filterCheckBox);
    });

    documentFragment.append(filterContainer);
    $(`[${DOM_DATA_ATTR}=${prop}]`).append(documentFragment);
  }

  createPaginationControls(recordsPerPage, totalRecords, currentPage) {
    const noOfPages = Math.ceil(totalRecords / recordsPerPage);
    const documentFragment = $(document.createDocumentFragment());

    for (let i = 0; i < noOfPages; i++) {
      const paginationControl = $('<a>').attr({
        class: DOMCLASSES.paginationControls, [DOM_DATA_ATTR]: 'paginationControls', [DATA_ATTR]: `page${i + 1}`, title: i + 1,
      }).html(i + 1);
      documentFragment.append(paginationControl);
    }
    $(DOMACCESS.pagination.label).html(this.getPaginationLabel(totalRecords, recordsPerPage, currentPage));
    $(DOMACCESS.pagination.controlContainer).append(documentFragment);

    $(`[${DATA_ATTR}=page${currentPage}]`).addClass(DOMCLASSES.selectedPage);
  }

  getPaginationLabel(totalRecords, recordsPerPage, currentPage) {
    const noOfPages = Math.ceil(totalRecords / recordsPerPage);
    if (!noOfPages) {
      return ('<b>No Records To Display</b>');
    }
    return (`Page <b>${currentPage}</b> of <b>${noOfPages}</b>. Total Products<b> :- <b>${totalRecords}</b>`);
  }

  resetPaginationDOM(currentPage) {
    $(DOMACCESS.pagination.controlContainer).empty();
    $(DOMACCESS.pagination.selectBox).off();
    $(DOMACCESS.pagination.carets).off();
    $(DOMACCESS.pagination.controls).off();
    $(`[${DATA_ATTR}=page${currentPage}]`).removeClass(DOMCLASSES.selectedPage);
  }
}

export default DOMManipulator;
