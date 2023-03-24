export const moneyMask = (value, around) => {
    try {
        value = value.replace('.', '').replace(',', '').replace(/\D/g, '')
    } catch { value = value }

    const options = { minimumFractionDigits: 2 };
    const result = new Intl.NumberFormat('pt-BR', options).format(parseFloat(value) / 100);

    if (around) return 'R$ ' + Math.ceil(value / 100).toFixed(2).replace('.', ',')
    return 'R$ ' + (value / 100).toFixed(2).replace('.', ',')
}

export const moneyMaskToFloat = (value) => parseFloat(value.replaceAll(",", ".").replaceAll(/[^0-9.]/g, ""));