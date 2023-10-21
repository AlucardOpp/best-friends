import {inclineWord} from './incline-word';

const wordEndings = {
  'brilliantEndings': {
    firstState: 'бриллиантов',
    secondState: 'бриллиант',
    thirdState: 'бриллианта',
    fourthState: 'бриллиантов',
  },
  'setEndings': {
    firstState: 'наборов',
    secondState: 'набор',
    thirdState: 'набора',
    fourthState: 'наборов',
  },
  'jewelryEndings': {
    firstState: 'украшений',
    secondState: 'украшение',
    thirdState: 'украшения',
    fourthState: 'украшений',
  },
};

export const inclineGoods = () => {
  const goods = document.querySelectorAll('.good');
  const goodsCounts = document.querySelectorAll('.good__count');
  if (!goodsCounts.length) {
    return;
  }

  goods.forEach((good) => {
    const description = good.querySelector('.good__description');
    const count = good.querySelector('.good__count');
    if (!count) {
      return;
    }
    const countText = count.textContent;
    const type = good.dataset.type;
    description.textContent = inclineWord(wordEndings, countText, `${type}Endings`);
  });
};
