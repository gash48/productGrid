const productUrl = 'assets/productData.json';

export const getProductsData = () => {
    return $.getJSON(productUrl, function () {
        console.log("Url Found")
    }).done(function (data) {
        return data;
    }).fail(function () {
        return null;
    })
}