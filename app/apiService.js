/* eslint-disable no-console */
/* eslint-disable no-undef */
const getProductsData = () => {
  const productUrl = 'assets/productData.json';

  return $.getJSON(productUrl, () => {
    console.log('Url Found');
  }).done(data => data)
    .fail(() => null);
};

export default getProductsData;
