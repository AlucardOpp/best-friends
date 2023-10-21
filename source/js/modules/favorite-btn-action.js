const favoriteBtnAction = () => {
  const counter = document.querySelector('.sub-nav__cart-counter');

  if (!counter) {
    return;
  }

  let counterNumber = Number(counter.textContent);

  document.addEventListener('click', (evt) => {
    const target = evt.target;
    if ((target.classList.contains('btn-favorite')) && !(target.classList.contains('is-favorite'))) {
      target.classList.add('is-favorite');
      counterNumber++;
      counter.textContent = counterNumber;
    } else if ((target.classList.contains('btn-favorite')) && (target.classList.contains('is-favorite'))) {
      target.classList.remove('is-favorite');
      counterNumber--;
      counter.textContent = counterNumber;
    }
  });
};

export {favoriteBtnAction};
