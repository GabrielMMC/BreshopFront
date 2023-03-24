import Card from "../Card";

function cardMask(text = '') {
  text = text.replace(/\D/g, '')
  let card = new Card();
  let types = Object.values(card.type);
  let brand = '';
  let index = null;
  let mask = '';
  let length = 0;
  let cvv = '';
  for (let i = 0; i < types.length; i++) {
    if (text.match(types[i].detector)) {
      brand = types[i].name;
      length = types[i].cardLength;
      cvv = types[i].cvcLength;
      index = i;
      break;
    }
  }
  if (text.length <= 20) {
    if (index != null) {
      let index_mask = 0;

      for (let i = 0; i < text.length && i < types[index].cardLength; i++) {
        if (!isNaN(text[i])) {
          if (types[index].maskCC[index_mask] === ' ') {
            mask += ' ';
            index_mask++;
          }
          if (types[index].maskCC[index_mask] === '0') {
            mask += text[i];
          }
          index_mask++;
        }

      }
    }
    else {
      mask = text;
    }
  }
  return { brand, mask, length, cvv, value: text }
  console.log('teste cartao', brand, mask, index, length, cvv, text.length)
  // setState({ ...state, [item]: { ...state[item], mask: mask, value: text }, brand: { ...state.brand, value: brand }, cvv: { ...state.cvv, length: cvv, value: '' } })
}

export default cardMask