const characterLimitMask = (value, length) => {
 value = Array.from(value)
 if (value.length > length) { value = value.splice(0, length).toString().replace(/,/g, '') + '...' }
 else { value = value.toString().replace(/,/g, '') }

 return value
}

export default characterLimitMask