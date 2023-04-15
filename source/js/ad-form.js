import {enableForm, disableForm, isImage} from './util.js';
import noUiSlider from 'nouislider';
import 'nouislider/dist/nouislider.css';
import Pristine from 'pristinejs';

const AD_FORM_DISABLE_CLASS = 'ad-form--disabled';
const DEFAULT_AVATAR = 'img/muffin-grey.svg';

const PriceLimit = {
  'bungalow': {
    MIN: 0,
    MAX: 100000,
  },
  'flat': {
    MIN: 1000,
    MAX: 100000,
  },
  'hotel': {
    MIN: 3000,
    MAX: 100000,
  },
  'house': {
    MIN: 5000,
    MAX: 100000,
  },
  'palace': {
    MIN: 10000,
    MAX: 100000,
  },
};

const COORDINATE_ACCURACY = 5;
const EXCESSIVE_ROOMS_COUNT = 100;

const adFormElement = document.querySelector('.ad-form');
const avatarFieldElement = adFormElement.querySelector('#avatar');
const avatarPreviewElement = adFormElement.querySelector('.ad-form-header__preview img');
const priceFieldElement = adFormElement.querySelector('#price');
const priceSliderElement = adFormElement.querySelector('.ad-form__slider');
const addressFieldElement = adFormElement.querySelector('#address');
const typeFieldElement = adFormElement.querySelector('#type');
const roomsFieldElement = adFormElement.querySelector('#room-number');
const capacityFieldElement = adFormElement.querySelector('#capacity');
const timeinFieldElement = adFormElement.querySelector('#timein');
const timeoutFieldElement = adFormElement.querySelector('#timeout');
const photoFieldElement = adFormElement.querySelector('#images');
const photoWrapperElement = adFormElement.querySelector('.ad-form__photo');
const submitButton = adFormElement.querySelector('.ad-form__submit');

let pristine;

const createPristine = () => {
  const newPristine = new Pristine(adFormElement, {
    classTo: 'ad-form__element',
    errorClass: 'ad-form__element--invalid',
    errorTextParent: 'ad-form__element',
    errorTextClass: 'text-help'
  });

  return newPristine;
};

const getSliderMaxValue = () => {
  const values = [];

  for (const type in PriceLimit) {
    values.push(PriceLimit[type].MAX);
  }

  return Math.max(...values);
};

const createSlider = () => {
  noUiSlider.create(priceSliderElement, {
    range: {
      min: 0,
      max: getSliderMaxValue(),
    },
    start: 0,
    step: 1,
    connect: 'lower',
    format: {
      to(value) {
        return Math.round(value);
      },
      from(value) {
        return value;
      },
    },
  });
};

const onPriceSliderUpdate = () => {
  priceFieldElement.value = priceSliderElement.noUiSlider.get();
};

const onPriceFieldInput = (evt) => {
  priceSliderElement.noUiSlider.set(evt.target.value);
};

const onTimeinFieldChange = (evt) => {
  timeoutFieldElement.value = evt.target.value;
};

const onTimeoutFieldChange = (evt) => {
  timeinFieldElement.value = evt.target.value;
};

const onTypeFieldChange = (evt) => {
  priceFieldElement.placeholder = PriceLimit[evt.target.value].MIN;
  pristine.validate(priceFieldElement);
};

const validatePriceField = () =>
  +priceFieldElement.value >= PriceLimit[typeFieldElement.value].MIN &&
  +priceFieldElement.value <= PriceLimit[typeFieldElement.value].MAX;

const getPriceFieldErrorMessage = () => `
  От ${PriceLimit[typeFieldElement.value].MIN}
  до ${PriceLimit[typeFieldElement.value].MAX}
`;

const validateCapacityField = () => (+roomsFieldElement.value < EXCESSIVE_ROOMS_COUNT) ?
  +capacityFieldElement.value > 0 && +capacityFieldElement.value <= +roomsFieldElement.value :
  +capacityFieldElement.value === 0;

const getCapacityFieldErrorMessage = () => {
  if (+roomsFieldElement.value < EXCESSIVE_ROOMS_COUNT) {
    if (+capacityFieldElement.value === 0) {
      return 'Нет, для гостей';
    }
    return 'Много гостей';
  }

  return `${EXCESSIVE_ROOMS_COUNT} комнат не для гостей`;
};

const onRoomsFieldChange = () => {
  pristine.validate(capacityFieldElement);
};

const setAddressFieldValue = ({lat, lng}) => {
  addressFieldElement.value = `${lat.toFixed(COORDINATE_ACCURACY)}, ${lng.toFixed(COORDINATE_ACCURACY)}`;
};

const onAvatarFieldChange = () => {
  const file = avatarFieldElement.files[0];

  if (file && isImage(file)) {
    avatarPreviewElement.src = URL.createObjectURL(file);
  } else {
    avatarFieldElement.value = null;
    avatarPreviewElement.src = DEFAULT_AVATAR;
  }
};

const onPhotoFieldChange = () => {
  photoWrapperElement.innerHTML = '';
  const file = photoFieldElement.files[0];

  if (file && isImage(file)) {
    const photoElement = document.createElement('img');
    photoElement.classList.add('ad-form__image');
    photoElement.src = URL.createObjectURL(file);
    photoWrapperElement.appendChild(photoElement);
  } else {
    photoFieldElement.value = null;
  }
};

const addSubmitButtonLoadingState = () => {
  submitButton.disabled = true;
  submitButton.classList.add('ad-form__submit--loading');
};

const removeSubmitButtonLoadingState = () => {
  submitButton.disabled = false;
  submitButton.classList.remove('ad-form__submit--loading');
};

const enableAdForm = () => {
  priceSliderElement.noUiSlider.enable();
  enableForm(adFormElement, AD_FORM_DISABLE_CLASS);
};

const disableAdForm = () => {
  priceSliderElement.noUiSlider.disable();
  disableForm(adFormElement, AD_FORM_DISABLE_CLASS);
};

const setOnAdFormSubmit = (sendData, showNotice) => {
  adFormElement.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const isValid = pristine.validate();

    if (!isValid) {
      return;
    }

    addSubmitButtonLoadingState();

    sendData(
      () => {
        adFormElement.reset();
        showNotice('success');
        removeSubmitButtonLoadingState();
      },
      () => {
        showNotice('error');
        removeSubmitButtonLoadingState();
      },
      new FormData(evt.target)
    );
  });
};

const setOnAdFormReset = (resetMap, resetAdFilter) => {
  adFormElement.addEventListener('reset', () => {
    avatarPreviewElement.src = DEFAULT_AVATAR;
    photoWrapperElement.innerHTML = '';
    resetMap();
    resetAdFilter();
    setTimeout(() => {
      priceSliderElement.noUiSlider.set(priceFieldElement.value);
    }, 0);
  });
};

const initAdForm = () => {
  pristine = createPristine();

  createSlider();
  priceSliderElement.noUiSlider.on('update', onPriceSliderUpdate);

  avatarFieldElement.addEventListener('change', onAvatarFieldChange);
  priceFieldElement.addEventListener('input', onPriceFieldInput);
  timeinFieldElement.addEventListener('change', onTimeinFieldChange);
  timeoutFieldElement.addEventListener('change', onTimeoutFieldChange);
  typeFieldElement.addEventListener('change', onTypeFieldChange);
  roomsFieldElement.addEventListener('change', onRoomsFieldChange);
  photoFieldElement.addEventListener('change', onPhotoFieldChange);

  pristine.addValidator(priceFieldElement, validatePriceField, getPriceFieldErrorMessage);
  pristine.addValidator(capacityFieldElement, validateCapacityField, getCapacityFieldErrorMessage);
};

export {
  initAdForm,
  enableAdForm,
  disableAdForm,
  setAddressFieldValue,
  setOnAdFormSubmit,
  setOnAdFormReset,
};
