const FORM_ELEMENTS_SELECTORS = 'input, textarea, select, button';
const IMAGE_FILE_TYPES = ['png', 'jpg', 'jpeg', 'webp', 'gif'];

const KeyCode = Object.freeze({
  ESCAPE: 'Escape',
});

const enableForm = (formElement, modificator) => {
  formElement.querySelectorAll(FORM_ELEMENTS_SELECTORS).forEach((element) => {
    element.disabled = false;
  });

  formElement.classList.remove(modificator);
};

const disableForm = (formElement, modificator) => {
  formElement.querySelectorAll(FORM_ELEMENTS_SELECTORS).forEach((element) => {
    element.disabled = true;
  });

  formElement.classList.add(modificator);
};

const isEscapeEvent = (evt) => evt.key === KeyCode.ESCAPE;

const debounce = (cb, timeout = 500) => {
  let timerId = null;

  return (...rest) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => cb.apply(this, rest), timeout);
  };
};

const isImage = (file) => {
  const fileName = file.name.toLowerCase();

  return IMAGE_FILE_TYPES.some((type) => fileName.endsWith(type));
};

const getDeclension = (count, one, few, many) => {
  const countText = String(count);
  switch (true) {
    case countText.endsWith(1) && !countText.endsWith(11):
      return one;
    case !Number.isInteger(count):
    case countText.endsWith(2) && !countText.endsWith(12):
    case countText.endsWith(3) && !countText.endsWith(13):
    case countText.endsWith(4) && !countText.endsWith(14):
      return few;
    default:
      return many;
  }
};

export {
  enableForm,
  disableForm,
  isEscapeEvent,
  isImage,
  debounce,
  getDeclension
};
