import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const TokyoCenterCoordinates = {
  LATITUDE: 35.68950,
  LONGITUDE: 139.69200,
};

const MAP_SCALE = 12;

const initialPosition = {
  lat: TokyoCenterCoordinates.LATITUDE,
  lng: TokyoCenterCoordinates.LONGITUDE,
};

const map = L.map('map-canvas');

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

const mainMarkerIcon = L.icon({
  iconUrl: 'img/main-pin.svg',
  iconSize: [52, 52],
  iconAnchor: [26, 52],
});

const mainMarker = L.marker(initialPosition, {
  draggable: true,
  icon: mainMarkerIcon,
});

mainMarker.addTo(map);

const markerIcon = L.icon({
  iconUrl: 'img/pin.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const adsLayer = L.layerGroup().addTo(map);

const createMarker = (lat, lng, icon) => L.marker({lat, lng}, {icon});

const addAd = (adData, icon, layer, createCard) =>
  createMarker(adData.location.lat, adData.location.lng, icon)
    .addTo(layer)
    .bindPopup(createCard(adData));

const addAdsCards = (adsData, createCard) => {
  adsData.forEach((adData) => addAd(adData, markerIcon, adsLayer, createCard));
};

const removeAdsCards = () => {
  adsLayer.clearLayers();
};

const setMapInitialView = () => map.setView(initialPosition, MAP_SCALE);

const resetMap = () => {
  map.closePopup();
  mainMarker.setLatLng(initialPosition);
  setMapInitialView();
};

const setOnMainMarkerMoveEnd = (cb) => {
  mainMarker.on('moveend', (evt) => {
    cb(evt.target.getLatLng());
  });
};

const setOnMapLoad = (cb) => map.on('load', cb);

export {
  setOnMapLoad,
  setOnMainMarkerMoveEnd,
  setMapInitialView,
  resetMap,
  addAdsCards,
  removeAdsCards
};
