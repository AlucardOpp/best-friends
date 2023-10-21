let timer;

const getTimeNumbers = (value) => {
  return ('0' + value).slice(-2);
};

const setTimeValue = (elem, timeInSec) => {
  const minuts = Math.floor(timeInSec / 60);
  const seconds = timeInSec % 60;
  elem.innerHTML = `${getTimeNumbers(minuts)}:${getTimeNumbers(seconds)}`;
};

const authorizeTimer = (timerEl) => {
  const timeValue = timerEl.dataset.authorizeTimer;
  const parent = timerEl.closest('.modal-authorize__timer');
  setTimeValue(timerEl, timeValue);

  let newValue = timeValue;
  timer = setInterval(() => {
    if (newValue > 1) {
      setTimeValue(timerEl, --newValue);
    } else {
      parent.classList.add('is-active');
      clearInterval(timer);
    }
  }, 1000);
};

const onSubmitPhone = (evt) => {
  evt.preventDefault();
  const modal = evt.target.closest('.modal');
  const formPhone = modal.querySelector('.modal-authorize__form-phone');
  const formCode = modal.querySelector('.modal-authorize__form-code');
  const phoneNumber = modal.querySelector('[data-authorize-phone]');
  const inputPhone = modal.querySelector('[name="user-phone"]').value;
  const timerEl = modal.querySelector('[data-authorize-timer]');

  // здесь нужно добавить отправку телефона на сервер

  phoneNumber.innerHTML = inputPhone;
  formPhone.classList.remove('is-active');
  formCode.classList.add('is-active');
  authorizeTimer(timerEl);
};

const onErrorInputPhone = (evt) => {
  evt.preventDefault();
  const form = evt.target;
  const fieldsError = form.querySelectorAll('.is-invalid');

  fieldsError.forEach((field) => {
    const input = field.querySelector('input');
    const error = field.querySelector('.custom-input__error');
    const errorEmpty = field.querySelector('.custom-input__error-empty');
    if (input.value.length <= 3 && errorEmpty) {
      error.style.maxHeight = null;
      errorEmpty.style.maxHeight = errorEmpty.scrollHeight + 'px';
    } else {
      errorEmpty.style.maxHeight = null;
    }
  });
};

const onCodeSuccess = (evt) => {
  evt.preventDefault();
  window.modals.close('authorize');
};

const onCloseAuthorizeModal = (modal) => {
  const forms = modal.querySelectorAll('form');
  const btnSubmitCode = modal.querySelector('[data-submit-code]');

  setTimeout(() => {
    if (timer) {
      clearInterval(timer);
    }

    btnSubmitCode.setAttribute('disabled', 'disabled');

    forms.forEach((form, index) => {
      const parent = form.closest('[class^="modal-authorize__form"]');
      parent.classList.remove('is-active');
      if (index === 0) {
        parent.classList.add('is-active');
      }
      form.reset();
    });
  }, 300);
};

export {onSubmitPhone, onErrorInputPhone, onCodeSuccess, onCloseAuthorizeModal};
