const cpfMask = (value) => {
  value = value.replace(/\D/g, "");
  if (Array.from(value).length <= 11) {
    return { value, mask: value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4") }
  } else {
    console.log('picotado', value.substring(0, 11), value)
    return { value: value.substring(0, 11), mask: value.substring(0, 11).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4") }
  }
};

export default cpfMask
