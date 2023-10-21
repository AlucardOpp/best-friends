import {undisabledButton} from '../utils/undisabled-button';

const inputs = document.querySelectorAll('.modal-authorize__code input');
const btnSubmit = document.querySelector('[data-submit-code]');

const onCodePaste = (evt) => {
  if (!evt.target.closest('.modal-authorize__code')) {
    return;
  }
  evt.preventDefault();

  let paste = (evt.clipboardData || window.clipboardData).getData('text/plain');
  let codeArr = [...paste];

  inputs.forEach((input, idx) => {
    input.value = codeArr[idx];
  });

  undisabledButton(inputs, btnSubmit);
};

const onChangeInputCode = (evt) => {
  if (!evt.target.closest('.modal-authorize__code')) {
    return;
  }

  const target = evt.target.closest('.modal-authorize__code');
  const targetInput = target.querySelector('input');

  // при вводе цифры в текущее поле, переносит фокус на сдедующее
  if (evt.inputType !== 'insertFromPaste' && evt.inputType !== 'deleteContentBackward') {
    targetInput.value = evt.data;
  }

  inputs.forEach((input, idx) => {
    if (evt.inputType !== 'deleteContentBackward' && input === targetInput && inputs[idx + 1]) {
      inputs[idx + 1].focus();
    } else if (evt.inputType === 'deleteContentBackward' && input === targetInput && inputs[idx - 1]) {
      inputs[idx - 1].focus();
    } else if (evt.inputType !== 'deleteContentBackward' && input === targetInput && !inputs[idx + 1]) {
      input.blur();
      setTimeout(() => {
        btnSubmit.focus();
      });
    }
  });

  if (target) {
    // разблокировать кнопку отправки при заполнении всех полей
    undisabledButton(inputs, btnSubmit);
  }
};

const inputCode = () => {
  if (!inputs.length) {
    return;
  }

  // при вставке кода целиком, разбивает код на цифры и заносит их в поля
  window.addEventListener('paste', onCodePaste);
  window.addEventListener('input', onChangeInputCode);
};

export {inputCode};
