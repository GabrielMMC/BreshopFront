import React from 'react';
import { Button, Typography } from "@mui/material";
import { FileDrop } from 'react-file-drop';
import { URL, STORAGE_URL } from '../../../variables';
import Card from '../../utilities/Card';
import { renderToast } from '../../utilities/Alerts';
import '../FileDrop/styles.css'

const Input = ({ state, setState, item, edit }) => {
  const [fetching, setFetching] = React.useState(false)

  React.useEffect(() => {
    if (state[item].type === 'cep') handleCepChange(state[item].value)
    if (state[item].type === 'phone') handlePhoneChange(state[item].value)
    if (state[item].type === 'phone+') handlePhoneChangeDDD(state[item].value, state.area_code.value)
    if (state[item].type === 'cpf' && state[item].value !== undefined) handleCpfChange(state[item].value)
  }, [])

  function handleCardChange(text = '') {
    text = text.replace(/\D/g, '')
    let card = new Card();
    let types = Object.values(card.type);
    let brand = '';
    let index = null;
    let masked_number = '';
    let card_length = 0;
    let cvv = '';
    for (let i = 0; i < types.length; i++) {
      if (text.match(types[i].detector)) {
        brand = types[i].name;
        card_length = types[i].cardLength;
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
              masked_number += ' ';
              index_mask++;
            }
            if (types[index].maskCC[index_mask] === '0') {
              masked_number += text[i];
            }
            index_mask++;
          }

        }
      }
      else {
        masked_number = text;
      }
    }
    console.log('teste cartao', brand, masked_number, index, card_length, cvv, text.length)
    setState({ ...state, [item]: { ...state[item], mask: masked_number, value: text }, brand: { ...state.brand, value: brand }, cvv: { ...state.cvv, length: cvv, value: '' } })
  }

  function handleChange(e) {
    if (state[item].type === 'number') {
      if (e.target.value >= 0) {
        if (state[item].length) {
          let value = ''
          let length = Array.from(e.target.value)
          length.forEach((item2, index) => {
            if (index < state[item].length) value = value + item2
          })
          setState({ ...state, [item]: { ...state[item], value, error: false } })
          return
        }
        setState({ ...state, [item]: { ...state[item], value: e.target.value, error: false } })
      }
      return
    }

    if (state[item].length) {
      let value = ''
      let length = Array.from(e.target.value)
      length.forEach((item2, index) => {
        if (index < state[item].length) value = value + item2
      })
      setState({ ...state, [item]: { ...state[item], value, error: false } })
      return
    }

    setState({ ...state, [item]: { ...state[item], value: e.target.value, error: false } })
  }

  function handleFileChange(file) {
    let fr = new FileReader()
    fr.onload = (e) => {
      setState({ ...state, [item]: { ...state[item], value: file, url: e.target.result } })
    }
    fr.readAsDataURL(file)
  }

  function handleCpfChange(val) {
    const value = val.replace(/\D/g, '')
    let cpf;
    let cnpj;

    if (Array.from(value).length <= 11) {
      cpf = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/,
        function (regex, argumento1, argumento2, argumento3, argumento4) {
          return argumento1 + '.' + argumento2 + '.' + argumento3 + '-' + argumento4;
        })

      setState({ ...state, [item]: { ...state[item], value, mask: cpf } })
    }
    else if (Array.from(value).length <= 14) {
      cnpj = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})/,
        function (regex, argumento1, argumento2, argumento3, argumento4) {
          return argumento1 + '.' + argumento2 + '.' + argumento3 + '/' + argumento4;
        })

      setState({ ...state, [item]: { ...state[item], value, mask: cnpj } })
    }
  }

  function handlePhoneChange(val) {
    let value = val.replace(/\D/g, '')
    let phone;

    if (Array.from(value).length <= 8) {
      phone = value.replace(/(\d{4})(\d{4})/,
        function (regex, argumento1, argumento2) {
          return argumento1 + '-' + argumento2;
        })
    }
    else if (Array.from(value).length === 9) {
      phone = value.replace(/(\d{5})(\d{4})/,
        function (regex, arg1, arg2) {
          return arg1 + '-' + arg2;
        })
    }
    if (Array.from(value).length <= 9) {
      setState({ ...state, [item]: { ...state[item], value, mask: phone } })
    }
  }

  function handlePhoneChangeDDD(val, area) {
    let value = val.replace(/\D/g, '')
    let phone; let ddd; let newValue
    if (area) value = area + value

    if (Array.from(value).length <= 10) {
      phone = value.replace(/(\d{2})(\d{4})(\d{4})/,
        function (regex, argumento1, argumento2, argumento3) {
          ddd = argumento1
          newValue = argumento2 + argumento3
          return '(' + argumento1 + ') ' + argumento2 + '-' + argumento3;
        })
    }
    else if (Array.from(value).length === 11) {
      phone = value.replace(/(\d{2})(\d{5})(\d{4})/,
        function (regex, argumento1, argumento2, argumento3) {
          ddd = argumento1
          newValue = argumento2 + argumento3
          return '(' + argumento1 + ') ' + argumento2 + '-' + argumento3;
        })
    }
    if (Array.from(value).length <= 11) {
      setState({
        ...state, [item]: { ...state[item], value: newValue, mask: phone }, area_code: { value: ddd, hidden: true }
      })
    }
  }

  function handleCepChange(val) {
    let value = val.replace(/\D/g, '')
    let state2 = { ...state }
    let newCep

    newCep = value.replace(/(\d{5})(\d{3})/,
      function (regex, argumento1, argumento2) {
        return argumento1 + '-' + argumento2;
      })

    if (Array.from(value).length >= 8) {
      validateCep(value);
    }
    if (Array.from(value).length <= 8) {
      state2[item].value = value
      state2[item].mask = newCep
      state2[item].error = false
    }
    if (val === '') {
      clearCEP()
    }
    setState(state2)
  }

  let timeout
  React.useEffect(() => {
    if (fetching) timeout = setTimeout(() => { setFetching(false) }, 2000)
  }, [fetching])

  async function validateCep(value) {
    if (!fetching) {
      setFetching(true)
      clearTimeout(timeout)

      const endereco = await fetch(`https://viacep.com.br/ws/${value}/json/`)
        .then(response => {
          return response;
        })
        .catch((error) => {
          clearCEP();
          setState({ ...state, [item]: { ...state[item], value: '', error: true } })
          renderToast({ type: 'error', error: 'CEP inválido!' })
        })
      const data = await endereco.json();
      if (data.hasOwnProperty('erro')) {
        clearCEP();
        setState({ ...state, [item]: { ...state[item], value: '', error: true } })
        renderToast({ type: 'error', error: 'CEP inválido!' })
      } else {
        setState({
          ...state,
          city: { ...state.city, value: data.localidade, error: false },
          state: { ...state.state, value: data.uf, error: false },
          nbhd: { ...state.nbhd, value: data.bairro, error: false },
          street: { ...state.street, value: data.logradouro, error: false },
        })
      }
    }
  }

  function clearCEP() {
    let state2 = { ...state };
    let form = Object.keys(state2)
    const filter = form.filter(item => item === 'cep' || item === 'state' || item === 'city' || item === 'nbhd' || item === 'street')
    filter.forEach(item => {
      state2[item].value = '';
      state2[item].disabled = false;
    })
    setState(state2);
  }

  function render() {
    if (!state[item]?.hidden) {
      switch (state[item].type) {
        case 'select':
          return (
            <form className="form-floating">
              <select className={`form-control ${state[item].error && 'is-invalid'}`} value={state[item].value} onChange={(e) => setState({ ...state, [item]: { ...state[item], value: e.target.value, error: false } })} id={state[item].label} aria-label="Floating label select example">
                {state[item].fillOption && state[item].fillOption.map(item => (<option key={item} value={item}>{item}</option>))}
              </select>
              <label htmlFor={state[item].label}>{state[item].label}</label>
            </form>
          )

        case 'cep':
          return (
            <form className="form-floating">
              <input className={`form-control ${state[item].error && 'is-invalid'}`} value={state[item].mask ? state[item].mask : state[item].value} onChange={(e) => handleCepChange(e.target.value)} id={state[item].label} />
              <label htmlFor={state[item].label}>{state[item].label}</label>
            </form>
          )

        case 'file':
          return (
            <div style={{ height: 100 }}>
              <FileDrop onDrop={(files, event) => handleFileChange(files[0])}>
                <Button style={{ color: '#666666', width: '100%', height: '100%' }} component="label">
                  <Typography variant='p' style={{ color: '#666666' }}>Arraste a foto ou escolha um arquivo</Typography>
                  <input hidden onChange={(e) => handleFileChange(e.target.files[0])} accept="image/*" multiple type="file" />
                </Button>
              </FileDrop>
            </div>
          )

        case 'file-rounded':
          return (
            <div style={{ height: 100, width: 100, borderRadius: '50%' }}>
              <FileDrop onDrop={(files, event) => handleFileChange(files[0])} className='file-drop file-rounded'>
                <Button style={{ color: '#666666', width: '100%', height: '100%', borderRadius: '50%', padding: 0 }} component="label">
                  {!state[item].url ?
                    <>
                      <Typography variant='p' style={{ color: '#666666' }}>Foto de Perfil</Typography>
                    </>
                    :
                    <img src={state[item].url} onError={() => setState({ ...state, [item]: { ...state[item], url: `${URL}storage/${state[item].url}` } })} className='img-fluid img rounded-50' alt='profile' />}
                  <input hidden onChange={(e) => handleFileChange(e.target.files[0])} accept="image/*" multiple type="file" />
                </Button>
              </FileDrop>
            </div>
          )

        case 'multiline':
          return (
            <form className="form-floating">
              <textarea style={{ height: 150 }} className={`form-control ${state[item].error && 'is-invalid'}`} value={state[item].value} onChange={(e) => setState({ ...state, [item]: { ...state[item], value: e.target.value, error: false } })} id={state[item].label} />
              <label htmlFor={state[item].label}>{state[item].label}</label>
            </form>
          )

        // case 'price':
        //   return (
        //     <form className='form-floating'>
        //       <CurrencyInput
        //         className={`form-control ${state[item].error && 'is-invalid'}`}
        //         prefix="R$"
        //         id={state[item].label}
        //         name="input-name"
        //         decimalsLimit={2}
        //         decimalSeparator="."
        //         groupSeparator="."
        //         value={state[item].value}
        //         onChange={(e) => setState({ ...state, [item]: { ...state[item], value: e, error: false } })}
        //       />
        //       <label htmlFor={state[item].label}>{state[item].label}</label>
        //     </form>
        //   )

        case 'cpf':
          return (
            <form className="form-floating">
              <input type='text' className={`form-control ${state[item].error && 'is-invalid'}`} value={state[item]?.mask} onChange={(e) => handleCpfChange(e.target.value)} id={state[item].label} />
              <label htmlFor={state[item].label}>{state[item].label}</label>
            </form>
          )

        case 'phone':
          return (
            <form className="form-floating">
              <input type='text' className={`form-control ${state[item].error && 'is-invalid'}`} value={state[item]?.mask} onChange={(e) => handlePhoneChange(e.target.value)} id={state[item].label} />
              <label htmlFor={state[item].label}>{state[item].label}</label>
            </form>
          )

        case 'phone+':
          return (
            <form className="form-floating">
              <input type='text' className={`form-control ${state[item].error && 'is-invalid'}`} value={state[item]?.mask} onChange={(e) => handlePhoneChangeDDD(e.target.value)} id={state[item].label} />
              <label htmlFor={state[item].label}>{state[item].label}</label>
            </form>
          )

        case 'card':
          return (
            <div className="input-group">
              <form className="form-floating d-flex" style={{ flexGrow: 1 }}>
                <input type='text' className={`form-control ${state[item].error && 'is-invalid'}`} value={state[item]?.mask} onChange={(e) => handleCardChange(e.target.value)} id={state[item].label} disabled={state[item]?.disabled} />
                <label htmlFor={state[item].label}>{state[item].label}</label>
                <div className={`brand`}><img src={`${STORAGE_URL}/brands/${state.brand.value ? state.brand.value : 'nocard'}.png`} alt='brand'></img></div>
              </form>
            </div >
          )

        case 'date':
          return (
            <form className="form-floating" hidden={state[item]?.hidden}>
              <input type={'date'} className={`form-control ${state[item].error && 'is-invalid'}`} value={state[item].date} onChange={(e) => {
                let date = e.target.value + 'T00:00:00.000'
                setState({ ...state, [item]: { ...state[item], value: date, date: e.target.value } })
                console.log('date', e.target.value, date)
              }} id={state[item].label} />
              <label htmlFor={state[item].label}>{state[item].label}</label>
            </form>
          )

        default:
          return (
            <form className="form-floating" hidden={state[item]?.hidden}>
              <input type={state[item].type} disabled={state[item]?.disabled} className={`form-control ${state[item].error && 'is-invalid'}`} value={state[item].value} onChange={(e) => handleChange(e)} id={state[item].label} hidden={state[item]?.hidden} />
              <label htmlFor={state[item].label}>{state[item].label}</label>
            </form>
          )
      }
    }
  }
  return (
    render()
  )
}

export default Input