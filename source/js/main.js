import createCard from './card.js';
import showNotice from './notice.js';
import showMessage from './message.js';

import {
  enableFilter,
  disableFilter,
  filterAds,
  setFilterChange,
  resetFilter,
  setFilterReset
} from './filter.js';

import {
  getData,
  sendData
} from './api.js';

import {
  enableAdForm,
  disableAdForm,
  initAdForm,
  setAddressFieldValue,
  setOnAdFormSubmit,
  setOnAdFormReset,
} from './ad-form.js';

import {
  setOnMapLoad,
  setOnMainMarkerMoveEnd,
  setMapInitialView,
  resetMap,
  addAdsCards,
  removeAdsCards
} from './map.js';

initAdForm();
disableFilter();
disableAdForm();

setOnMapLoad(enableAdForm);
setMapInitialView();
setOnMainMarkerMoveEnd(setAddressFieldValue);

setOnAdFormSubmit(sendData, showNotice);
setOnAdFormReset(resetMap, resetFilter);

getData(
  (adsData) => {
    addAdsCards(filterAds(adsData), createCard);
    enableFilter();
    setFilterReset(() => {
      removeAdsCards();
      addAdsCards(filterAds(adsData), createCard);
    });
    setFilterChange(() => {
      removeAdsCards();
      addAdsCards(filterAds(adsData), createCard);
    });
  },
  () => {
    showMessage('Не удалось загрузить данные. Попробуйте обновить страницу.');
  }
);
