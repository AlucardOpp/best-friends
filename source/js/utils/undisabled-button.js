const undisabledButton = (inputs, button) => {
  let flag = true;

  inputs.forEach((input) => {
    const type = input.closest('[data-validate-type]').dataset.validateType;

    if (!window.validateInputs(type, input)) {
      flag = false;
    }
  });

  if (flag) {
    button.removeAttribute('disabled');
  } else {
    button.setAttribute('disabled', 'disabled');
  }
};

export {undisabledButton};
