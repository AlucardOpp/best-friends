export const inclineWord = (objectEndings, num, type) => {
  let n = num ? num.toString() : '1';
  let last = n.slice(-1);
  let twoLast = n.slice(-2);
  if (twoLast === '11' || twoLast === '12' || twoLast === '13' || twoLast === '14') {
    return `${n} ${objectEndings[type].firstState}`;
  }
  if (last === '1') {
    return `${n} ${objectEndings[type].secondState}`;
  }
  if (last === '2' || last === '3' || last === '4') {
    return `${n} ${objectEndings[type].thirdState}`;
  }
  return `${n} ${objectEndings[type].fourthState}`;
};
