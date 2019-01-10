/* eslint-disable no-plusplus */
/* eslint-disable class-methods-use-this */
/* eslint-disable array-callback-return */
/* eslint-disable no-undef */
import jqUtil from './jqUtil';
import {
  DOMCONSTANTS, sortingValues, paginationValues, defaultRecordsToShow, specialFilters,
} from './appConstants';

class DOMManipulator {
  // ------------ Creates Filters, Sorting, Pagination Controls -------------- //
  createSortingOptions(sortingListener) {
    const documentFragment = $(document.createDocumentFragment());
    const sortingSelectBox = $('<select>').attr({ class: DOMCONSTANTS.sortingSelectBox, name: DOMCONSTANTS.sortingSelectBox, id: DOMCONSTANTS.sortingSelectBox });

    sortingValues.map((sorts) => {
      const option = $('<option>').attr({ class: DOMCONSTANTS.sortingOptionSelector }).val(sorts).html(sorts === '-1' ? 'Sort By' : `Sort By ${sorts}`);
      sortingSelectBox.append(option);
    });
    documentFragment.append(sortingSelectBox);
    $(`#${DOMCONSTANTS.sortingContainerSelector}`).append(documentFragment);

    $(`#${DOMCONSTANTS.sortingSelectBox}`).change(sortingListener);
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
      let filterCheckBox = null;
      if (prop in specialFilters) {
        const radio = $('<input />').attr({
          type: 'radio', value: filterName, name: prop, class: DOMCONSTANTS.checkBoxClass,
        });
        filterCheckBox = $('<li>').html(radio).append(specialFilters[prop].getValue(parseInt(filterName, 10)));
      } else {
        const checkBox = $('<input />').attr({
          type: 'checkbox', value: filterName, name: prop, class: DOMCONSTANTS.checkBoxClass,
        });
        filterCheckBox = $('<li>').html(checkBox).append(filterName);
      }
      filterContainer.append(filterCheckBox);
    });

    documentFragment.append(filterContainer);
    $(`#${prop}`).append(documentFragment);
  }

  createPaginationControls(recordsPerPage, totalRecords, currentPage) {
    const noOfPages = Math.ceil(totalRecords / recordsPerPage);
    const documentFragment = $(document.createDocumentFragment());

    for (let i = 0; i < noOfPages; i++) {
      const paginationControl = $('<a>').attr({ class: DOMCONSTANTS.paginationControlSelector, id: `page${i + 1}`, title: i + 1 }).html(i + 1);
      documentFragment.append(paginationControl);
    }
    $(`.${DOMCONSTANTS.paginationLabel}`).html(this.getPaginationLabel(totalRecords, recordsPerPage, currentPage));
    $(`.${DOMCONSTANTS.paginationControlBarSelector}`).append(documentFragment);

    $(`#page${currentPage}`).addClass(DOMCONSTANTS.selectedPageClass);
  }

  getPaginationLabel(totalRecords, recordsPerPage, currentPage) {
    const noOfPages = Math.ceil(totalRecords / recordsPerPage);
    if (!noOfPages) {
      return ('<b>No Records To Display</b>');
    }
    return (`Page <b>${currentPage}</b> of <b>${noOfPages}</b>. Total Products<b> :- <b>${totalRecords}</b>`);
  }

  resetPaginationDOM(currentPage) {
    $(`.${DOMCONSTANTS.paginationControlBarSelector}`).empty();
    $(`.${DOMCONSTANTS.paginationSelectBox}`).off();
    $(`.${DOMCONSTANTS.paginationCarets}`).off();
    $(`.${DOMCONSTANTS.paginationControlSelector}`).off();
    $(`#page${currentPage}`).removeClass(DOMCONSTANTS.selectedPageClass);
  }
}

export default DOMManipulator;
