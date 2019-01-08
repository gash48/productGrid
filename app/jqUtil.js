/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */

const allinOnefilter = (products = [], filter) => {
  Object.keys(filter).map((ele) => {
    if (filter[ele].length) {
      products = products.filter(e => filter[ele].includes(e[ele]));
    }
  });
  return products;
};

const getUniqueFilters = (inArr, prop) => {
  const arr = inArr.map(ele => ele[prop]);
  const uniqueSet = new Set(arr);
  return [...uniqueSet];
};

const getUniquePropArray = (inArr, uniqueProp) => {
  const propArr = [];
  return inArr.filter((ele) => {
    if (!propArr.includes(ele[uniqueProp])) {
      propArr.push(ele.name);
      return true;
    }
    return false;
  });
};

const jqUtil = {
  allinOnefilter,
  getUniqueFilters,
  getUniquePropArray,
};

export default jqUtil;
