/* eslint-disable arrow-body-style */
/* eslint-disable no-else-return */
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

const getSortedArray = (inArr = [], prop) => {
  return inArr.sort((a, b) => {
    if (a[prop] > b[prop]) {
      return 1;
    } else if (a[prop] < b[prop]) {
      return -1;
    }
    return 0;
  });
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

const getAppliedFilterString = (appliedFilter) => {
  let filterString = '';
  Object.keys(appliedFilter).map((filter) => {
    const filterVal = appliedFilter[filter];
    filterString += `#${filter}=${filterVal.length ? filterVal.join() : '-1'}`;
  });
  return filterString;
};

const getFiltersFromString = (str) => {
  const filters = str.split('#');
  const appliedFilters = {};
  filters.map((filterStr) => {
    if (filterStr) {
      const filterKeys = filterStr.split('=');
      if (filterKeys[1] === '-1') {
        appliedFilters[filterKeys[0]] = [];
      } else {
        appliedFilters[filterKeys[0]] = filterKeys[1].split(',');
      }
    }
  });
  return appliedFilters;
};

const getDecodedFilterFromUrl = (url) => {
  const addons = decodeURIComponent(url).split('&');
  return {
    filters: getFiltersFromString(addons[0]),
    sort: addons[1].split('=')[1],
    rpp: parseInt(addons[2].split('=')[1], 10),
    page: parseInt(addons[3].split('=')[1], 10),
  };
};

const getHashEncodedUrl = (appliedFilter = {}, sortProp = '-1', page = 1, recordsPerPage) => {
  return (`${getAppliedFilterString(appliedFilter)}&sort=${sortProp}&rpp=${recordsPerPage}&page=${page}`);
};

const jqUtil = {
  allinOnefilter,
  getUniqueFilters,
  getUniquePropArray,
  getSortedArray,
  getHashEncodedUrl,
  getDecodedFilterFromUrl,
};

export default jqUtil;
