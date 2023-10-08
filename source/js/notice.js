import {isEscapeEvent} from './util.js';

const noticeTemplates = {
  'success': document.querySelector('#success').content.querySelector('.success'),
  'error': document.querySelector('#error').content.querySelector('.error'),
};

let activeNotice = null;

const onNoticeEscapeKeydown = (evt) => {
  if (isEscapeEvent(evt)) {
    evt.preventDefault();
    removeNotice();
  }
};

function showNotice(type) {
  const noticeElement = noticeTemplates[type].cloneNode(true);

  document.body.appendChild(noticeElement);
  activeNotice = noticeElement;
  document.addEventListener('keydown', onNoticeEscapeKeydown);

  noticeElement.addEventListener('click', () => {
    activeNotice.remove();
  });
}

function removeNotice() {
  activeNotice.remove();
  document.removeEventListener('keydown', onNoticeEscapeKeydown);
}

export default showNotice;
