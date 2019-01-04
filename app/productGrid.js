/* eslint-disable no-unused-expressions */
/* eslint-disable no-plusplus */
/* eslint-disable max-len */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-undef */
import jqUtil from './jqUtil';
import { DOMCONSTANTS, specialFilters } from './appConstants';

class ProductGrid {
  constructor(products) {
    this.appliedFilters = {
      brand: [],
      color: [],
      sold_out: [],
    };
    this.products = products;

    // ------Inits Products ANd Filters-------- //
    this.addProducts(this.filteredProducts);
    this.createFilterList();
    // -------------- //

    // Reset Filter Event Listener
    $(DOMCONSTANTS.resetButtonSelector).click(e => this.resetFilters(e));
  }

  addProducts(products) {
    $(DOMCONSTANTS.productsContainerSelector).empty();
    products.map((ele, index) => this.createProduct(ele, index));
  }

  createFilterList() {
    Object.keys(this.appliedFilters).map(ele => this.createFilter(ele, this.products));
    $(`.${DOMCONSTANTS.checkBoxClass}`).change(e => this.filterChangeListener(e));
  }

  createProduct(product, index) {
    $(DOMCONSTANTS.cardCloneSelector).clone(true).show().appendTo(DOMCONSTANTS.productsContainerSelector);
    $(DOMCONSTANTS.cardImageSelector).eq(index).attr('src', `./assets/images/${product.url}`);
    $(DOMCONSTANTS.cardTitleSelector).eq(index).html(product.name);
  }

  createFilter(prop, products, listClass = DOMCONSTANTS.listClass) {
    const filterValues = jqUtil.getUniqueFilters(products, prop);
    const filterContainer = $('<ul></ul>').attr({ class: listClass, id: `${prop}List` });
    $(`#${prop}`).append(filterContainer);

    for (let i = 0; i < filterValues.length; i++) {
      const checkBox = $('<input />').attr({
        type: 'checkbox', value: filterValues[i], name: prop, class: DOMCONSTANTS.checkBoxClass,
      });
      let filterCheckBox = null;
      if (prop in specialFilters) {
        filterCheckBox = $('<li></li>').html(checkBox).append(specialFilters[prop].getValue(parseInt(filterValues[i], 2)));
      } else {
        filterCheckBox = $('<li></li>').html(checkBox).append(filterValues[i]);
      }
      filterContainer.append(filterCheckBox);
    }
  }


  filterChangeListener(e) {
    const { checked, value, name } = e.target;
    if (checked) {
      this.appliedFilters[name].push(value);
    } else {
      this.appliedFilters[name] = this.appliedFilters[name].filter(ele => ele !== value);
    }
    this.refreshProducts();
  }

  resetFilters() {
    $(`.${DOMCONSTANTS.checkBoxClass}`).prop('checked', false);
    this.appliedFilters = {
      brand: [],
      color: [],
      sold_out: [],
    };
    this.addProducts(this.products);
  }

  refreshProducts() {
    const filteredProducts = jqUtil.allinOnefilter(this.products, this.appliedFilters);
    this.addProducts(filteredProducts);
  }
}

export default ProductGrid;
