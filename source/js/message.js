const MESSAGE_SHOW_TIME = 7000;

const showMessage = (text) => {
  const messageElement = document.createElement('p');
  messageElement.classList.add('error-notice');
  messageElement.textContent = text;

  document.body.appendChild(messageElement);

  setTimeout(() => {
    messageElement.remove();
  }, MESSAGE_SHOW_TIME);
};

export default showMessage;
