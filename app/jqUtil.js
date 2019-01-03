const allinOnefilter = (products, obj) => {
    let arr = [];
    for (let i in obj) {
        if (obj[i].length) {
            arr = products.filter(e => obj[i].includes(e[i]))
        }
    }
    return arr;
}

const addCards = (products) => {
    products.map((ele, index) => {
        $('#sampleCard').clone(true).show().appendTo('#cardsAdder');
        $('.card-img-top').eq(index).attr('src', './assets/images/' + ele.url);
        $('.card-title').eq(index).html(ele.name);
    })
}

const getUniqueFilters = (inArr, prop) => {
    let arr = inArr.map((ele) => ele[prop])
    var uniqueSet = new Set(arr);
    return [...uniqueSet];
}

const createFilters = (prop, products, listClass = 'dynList') => {
    let brands = getUniqueFilters(products, prop);
    let brandUl = $('<ul></ul>').attr({ 'class': listClass, 'id': prop + 'list' });
    $('#' + prop).append(brandUl);

    for (let i = 0; i < brands.length; i++) {
        let checkBox = $('<input />').attr({ 'type': 'checkbox', 'value': brands[i], 'name': prop, class: 'form-control' })
        if(prop == 'sold_out'){
            var brandLi = $('<li></li>').html(checkBox).append(parseInt(brands[i]) ? 'Sold Out' : 'Available');
        }else{
            var brandLi = $('<li></li>').html(checkBox).append(brands[i]);
        }
        brandUl.append(brandLi);
    }
}

export const jqUtil = {
    allinOnefilter: allinOnefilter,
    addCards: addCards,
    getUniqueFilters: getUniqueFilters,
    createFilters: createFilters
}

