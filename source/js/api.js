const DATA_URL = 'https://27.javascript.pages.academy/keksobooking/data';
const SEND_URL = 'https://27.javascript.pages.academy/keksobooking';

const getData = async (onSuccess, onFail) => {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) {
      throw new Error(`${response.status} – ${response.statusText}`);
    }
    const adsData = await response.json();
    onSuccess(adsData);
  } catch {
    onFail();
  }
};

const sendData = async (onSuccess, onFail, body) => {
  try {
    const response = await fetch(SEND_URL, {
      method: 'POST',
      body,
    });
    if (!response.ok) {
      throw new Error(`${response.status} – ${response.statusText}`);
    }
    onSuccess();
  } catch {
    onFail();
  }
};

export {
  getData,
  sendData
};
