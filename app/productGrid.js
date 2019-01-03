import { jqUtil } from './jqUtil';

export class ProductGrid {
    constructor(products) {
        this.filterObj = {
            brand: [],
            color: [],
            sold_out: []
        }
        this.products = products;

        // ------Inits Products ANd Filters-------- //
        this.addProducts(products);
        this.createFilterList();
        // -------------- //

        // Reset Filter Event Listener
        $('#resetAll').click((e)=>this.resetFilters(e))
    }

    addProducts(prods = null) {
        $('#cardsAdder').empty();
        prods ? jqUtil.addCards(prods) : jqUtil.addCards(this.products);
    }

    createFilterList() {
        for (let i in this.filterObj) {
            jqUtil.createFilters(i, this.products);
        }
        $('.form-control').change((e) => this.filterChangeListener(e));
    }

    filterChangeListener(e){
        if (e.target.checked) {
            this.filterObj[e.target.name].push(e.target.value);
        } else {
            this.filterObj[e.target.name] = this.filterObj[e.target.name].filter((ele) => ele != e.target.value)
        }
        this.refreshProducts();
    }

    resetFilters(){
        this.filterObj = {
            brand: [],
            color: [],
            sold_out: []
        }
        $('input:checkbox').prop('checked',false);
        this.addProducts();
    }

    refreshProducts() {
        let newProducts = jqUtil.allinOnefilter( this.products ,this.filterObj);
        this.addProducts(newProducts);
    }
}