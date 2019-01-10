/* eslint-disable no-undef */
const getProductsData = () => {
  const productUrl = 'assets/productData.json';

  return $.getJSON(productUrl, () => {
  }).done(data => data)
    .fail(() => null);
};

export default getProductsData;
