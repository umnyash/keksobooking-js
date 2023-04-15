import {getDeclension} from './util.js';

const Dictionary = {
  ROOMS: ['комната', 'комнаты', 'комнат'],
  GUESTS: ['гостя', 'гостей', 'гостей'],
};

const housingTypes = Object.freeze({
  bungalow:  'Бунгало',
  flat: 'Квартира',
  hotel: 'Отель',
  house: 'Дом',
  palace: 'Дворец',
});

const cardTemplate = document.querySelector('#card').content.querySelector('.popup');

const filterFeaturesElements = (featuresElements, features) => {
  featuresElements.forEach((featureNode) => {
    if (features.some((featureName) => featureNode.classList.contains(`popup__feature--${featureName}`))) {
      return;
    }

    featureNode.remove();
  });
};

const replacePhotos = (list, photos) => {
  list.innerHTML = '';

  photos.forEach((photo) => {
    const photoNode = document.createElement('img');
    photoNode.src = photo;
    photoNode.className = 'popup__photo';
    photoNode.width = '45';
    photoNode.height = '40';
    photoNode.alt = 'Фотография жилья';

    list.appendChild(photoNode);
  });
};

const createCard = ({author, offer}) => {
  const cardElement = cardTemplate.cloneNode(true);

  cardElement.querySelector('.popup__avatar').src = author.avatar;
  cardElement.querySelector('.popup__title').textContent = offer.title;
  cardElement.querySelector('.popup__text--address').textContent = offer.address;
  cardElement.querySelector('.popup__text--price').textContent = `${offer.price} ₽/ночь`;
  cardElement.querySelector('.popup__type').textContent = housingTypes[offer.type];
  cardElement.querySelector('.popup__text--capacity').textContent = `${offer.rooms} ${getDeclension(offer.rooms, ...Dictionary.ROOMS)} для ${offer.guests} ${getDeclension(offer.guests, ...Dictionary.GUESTS)}`;
  cardElement.querySelector('.popup__text--time').textContent = `Заезд после ${offer.checkin}, выезд до ${offer.checkout}`;

  if (offer.description) {
    cardElement.querySelector('.popup__description').textContent = offer.description;
  } else {
    cardElement.querySelector('.popup__description').remove();
  }

  if (offer.features) {
    filterFeaturesElements(cardElement.querySelectorAll('.popup__feature'), offer.features);
  } else {
    cardElement.querySelector('.popup__features').remove();
  }

  if (offer.photos) {
    replacePhotos(cardElement.querySelector('.popup__photos'), offer.photos);
  } else {
    cardElement.querySelector('.popup__photos').remove();
  }

  return cardElement;
};

export default createCard;
