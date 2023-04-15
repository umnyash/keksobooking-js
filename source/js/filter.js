import {enableForm, disableForm, debounce} from './util.js';

const ADS_MAX_COUNT = 10;
const FILTER_DISABLE_CLASS = 'map__filters--disabled';
const FILTER_DELAY = 500;

const PriceRange = {
  'low': {
    FROM: 0,
    TO: 10000,
  },
  'middle': {
    FROM: 10000,
    TO: 50000,
  },
  'high': {
    FROM: 50000,
    TO: Infinity,
  },
};

const filterElement = document.querySelector('.map__filters');
const typeFieldElement = filterElement.querySelector('#housing-type');
const priceFieldElement = filterElement.querySelector('#housing-price');
const roomsFieldElement = filterElement.querySelector('#housing-rooms');
const capacityFieldElement = filterElement.querySelector('#housing-guests');
const featureFieldElements = filterElement.querySelectorAll('[name="features"]');

const enableFilter = () => {
  enableForm(filterElement, FILTER_DISABLE_CLASS);
};

const disableFilter = () => {
  disableForm(filterElement, FILTER_DISABLE_CLASS);
};

const resetFilter = () => {
  filterElement.reset();
};

const setFilterReset = (cb) => {
  filterElement.addEventListener('reset', () => {
    setTimeout(cb, 0);
  });
};

const setFilterChange = (cb) => {
  filterElement.addEventListener('change', debounce(cb, FILTER_DELAY));
};

const checkType = (ad, type) => type === 'any' || ad.offer.type === type;

const checkPrice = (ad, price) => price === 'any' || ad.offer.price >= PriceRange[price].FROM && ad.offer.price < PriceRange[price].TO;

const checkRooms = (ad, rooms) => rooms === 'any' || ad.offer.rooms === +rooms;

const checkCapacity = (ad, capacity) => capacity === 'any' || ad.offer.guests === +capacity;

const checkFeatures = (ad, features) => {
  if (features.length === 0) {
    return true;
  }

  if (!ad.offer.features || features.length > ad.offer.features.length) {
    return false;
  }

  for (let i = 0; i < features.length; i++) {
    if (!ad.offer.features.includes(features[i])) {
      return false;
    }
  }

  return true;
};

const filterAds = (ads) => {
  const features = [];

  for (const field of featureFieldElements) {
    if (field.checked) {
      features.push(field.value);
    }
  }

  const filteredAds = [];

  for (let i = 0; i < ads.length; i++) {
    if (checkFeatures(ads[i], features) &&
        checkType(ads[i], typeFieldElement.value) &&
        checkPrice(ads[i], priceFieldElement.value) &&
        checkRooms(ads[i], roomsFieldElement.value) &&
        checkCapacity(ads[i], capacityFieldElement.value)) {
      filteredAds.push(ads[i]);
    }

    if (filteredAds.length >= ADS_MAX_COUNT) {
      break;
    }
  }

  return filteredAds;
};

export {
  enableFilter,
  disableFilter,
  filterAds,
  setFilterChange,
  resetFilter,
  setFilterReset,
};
