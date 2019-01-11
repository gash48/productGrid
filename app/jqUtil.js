
/* eslint-disable arrow-body-style */
/* eslint-disable no-else-return */
/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */

import {
  defaultFilters, sortingValues, paginationValues, defaultRecordsToShow,
} from './appConstants';

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

const getDecodedFilterFromUrl = (hash) => {
  if (hash) {
    const hashString = decodeURIComponent(hash);
    return JSON.parse(hashString.slice(1));
  }
  return {
    filters: defaultFilters,
    sort: sortingValues[0],
    page: paginationValues[0],
    rpp: defaultRecordsToShow,
  };
};

const getHashEncodedUrl = (appliedFilter = {}, sortProp = '-1', page = 1, recordsPerPage) => {
  const hashObject = {
    filters: appliedFilter,
    sort: sortProp,
    page,
    rpp: recordsPerPage,
  };
  return JSON.stringify(hashObject);
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
