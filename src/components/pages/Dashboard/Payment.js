import React from 'react'
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Button, Typography, IconButton, CircularProgress, } from "@mui/material";
import { useNavigate } from 'react-router-dom'
import { DELETE_FETCH, GET_FETCH, POST_FETCH, URL, STORAGE_URL, API_URL } from '../../../variables';
import { useSelector } from 'react-redux'
import cpfMask from '../../utilities/masks/cpf'
import cardMask from '../../utilities/masks/card'
import { renderAlert, renderToast } from '../../utilities/Alerts';
import swal from "sweetalert";
import SavePreset from '../../routes/Form/SavePreset';

const Payment = () => {
  // -------------------------------------------------------------------
  //********************************************************************
  // -------------------------States------------------------------------
  const fillMonth = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
  const fillYear = ['2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030', '2031', '2032', '2033']
  const history = useNavigate()

  const [loading, setLoading] = React.useState(true)
  const [loadingSave, setLoadingSave] = React.useState(false)
  const [data, setData] = React.useState('')
  const [add, setAdd] = React.useState(false)
  const [hasAddresses, setHasAddresses] = React.useState(false)

  const [cvv, setCvv] = React.useState('')
  const [name, setName] = React.useState('')
  const [brand, setBrand] = React.useState('')
  const [document, setDocument] = React.useState('')
  const [year, setYear] = React.useState('01')
  const [month, setMonth] = React.useState('2023')
  const [card, setCard] = React.useState({ value: '', mask: '', length: 16, cvv: 3 })

  const token = useSelector(state => state.AppReducer.token)

  React.useEffect(() => {
    getData()
  }, [])

  // -----------------------------------------------------------------
  //******************************************************************
  // -------------------------Getting-data----------------------------
  const getData = async () => {
    const response = await GET_FETCH({ url: `cards`, token })

    // If the request returns true status, an anonymous function is used to save the card number formated with firsts and last digits only
    if (response.status) {
      setData(() => response.cards.data.map(item => {
        let firstDigits = Array.from(item.first_six_digits)
        let card = firstDigits.splice(0, 4).toString().replace(/,/g, '') + ' ' + firstDigits.toString().replace(/,/g, '') + '** **** ' + item.last_four_digits
        return { ...item, card }
      }))
      setHasAddresses(response.has_addresses.length === 0 ? false : true)

      // If it returns false status, is generated the toast with error message
    } else {
      renderToast({ type: 'error', error: 'Erro ao buscar cartões, tente novamente mais tarde!' })
    }

    setLoading(false)
  }

  // -----------------------------------------------------------------
  //******************************************************************
  // -------------------------Saving-data-----------------------------
  const handleSave = async () => {
    setLoadingSave(true); clearFields()
    const response = await POST_FETCH({
      url: `${API_URL}/cards/create`, body: {
        cvv, exp_month: month, exp_year: year, holder_name: name, holder_document: document.value, number: card.value, brand: card.brand
      }
    })

    // If it returns true status, is generated the toast with successful message and data is obtained against
    if (response.status) {
      getData()
      renderToast({ type: 'success', error: 'Cartão salvo com sucesso!' })
    } else {
      renderToast({ type: 'error', error: 'Erro ao salvar cartão, certifique-se que é um cartão válido!' })
    }

    setLoadingSave(false); setAdd(false)
  }

  // -----------------------------------------------------------------
  //******************************************************************
  // -------------------------Deleting-data---------------------------
  const handleDelete = async (id) => {
    setLoading(true); setAdd(false); clearFields()
    const response = await DELETE_FETCH({ url: `cards/delete/${id}`, token })

    // If it returns true status, is generated the toast with successful message and data is obtained against
    if (response) getData()
  }

  // -----------------------------------------------------------------
  //******************************************************************
  // -------------------------Other-functions-------------------------
  const handleCvvChange = (value) => {
    // The value is converted an array to be compared with the definied length, the value will only be saved if it is smaller
    if (Array.from(value).length <= card.cvv) setCvv(value)
  }

  //Showing filds for adding a card
  const handleAdd = () => {
    if (hasAddresses) { setAdd(!add); clearFields() }
    else {
      swal({
        title: `Dados incompletos`,
        text: `Por questões de segurança, preencha os dados de usuário e adicione algum endereço antes de prosseguir com o cadastro de cartão!`,
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
    }
  }
  //Cleaning up fields after remove them from the screen
  const clearFields = () => { setName(''); setCard(''); setBrand(''); setDocument(''); setMonth('01'); setYear('2023'); setCvv('') }


  return (
    // -------------------------Cards-Content-------------------------
    <div>
      <h6 className="dash-title">Cartões</h6>
      {!loading ? <div className="d-flex flex-wrap">
        {data.length > 0
          ? data.map((item, index) => (
            <div key={index} className="row payment-card mb-5 m-auto">
              <div className="col-md-12 my-2 mt-4 bg-dark" style={{ height: '2rem' }}></div>

              <div className="d-flex">
                <div style={{ width: '75px', marginTop: 5 }}>
                  <img className='img-fluid' src={`${URL}brands/${item.brand.toLowerCase()}.png`} alt='brand' />
                </div>
                <div className="ms-auto">
                  <IconButton onClick={() =>
                    renderAlert({ id: item.id, item: 'cartão', article: 'o', deleteFunction: handleDelete })}><CloseIcon />
                  </IconButton>
                </div>
              </div>

              <div className="col-md-12 my-2">
                <p>{item.holder_name}</p>
                <p>**** **** **** {item.last_four_digits}</p>
                <div className="d-flex" style={{ fontSize: '.8rem' }}>
                  <div className='d-flex'>
                    <p className='me-2'>Validade</p>
                    <p>{item.exp_month}/{item.exp_year}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
          : <p>Sem cartões cadastrados</p>}
      </div> : <div className="d-flex justify-content-center p-5"><CircularProgress color='inherit' /></div>}

      {/* -------------------------Card-fields-section------------------------- */}
      <div className="row my-5">
        <div className="d-flex align-items-center">
          <h6 className="dash-title">Adicionar cartão</h6>
          <button onClick={handleAdd} className='rounded-button hvr-grow ms-2 d-flex align-items-center justify-content-center'>
            {add ? <DeleteIcon size={15} /> : <AddIcon size={20} />}
          </button>
        </div>
        {
          // -------------------------Name----------------------------------
          add &&
          <form className='anime-left mt-3' onSubmit={(e) => { handleSave(e) }}>
            <div className="row align-items-end">
              <div className="col-md-6 my-2">
                <div className="form-floating">
                  <input className="form-control" id="name" type="text" value={name}
                    onChange={({ target }) => setName(target.value)} required />
                  <label htmlFor="name">Nome do Títular*</label>
                </div>
              </div>
              {/* -------------------------Card-------------------------- */}
              <div className="col-md-6 my-2">
                <div className='input-group'>
                  <div className="form-floating">
                    <input className="form-control" id="card" type="text" value={card.mask}
                      onChange={({ target }) => { setCard(() => cardMask(target.value)); setCvv('') }} required />
                    <label htmlFor="card">Cartão*</label>
                  </div>
                  <div className='brand'><img src={`${URL}/brands/${card.brand ? card.brand.toLowerCase() : 'nocard'}.png`} alt='brand'></img></div>
                </div>
              </div>
            </div>
            {/* -------------------------Document------------------------ */}
            <div className='col-md-12 mt-4'>
              <div className="form-floating">
                <input className="form-control" id="document" type="text" value={document?.mask}
                  onChange={({ target }) => setDocument(() => cpfMask(target.value))} required />
                <label htmlFor="document">CPF do Títular*</label>
              </div>
            </div>
            {/* -------------------------Month--------------------------- */}
            <div className="row mt-4">
              <div className="col-md-3 my-2">
                <div className="form-floating">
                  <select className="form-control" id="month" type="text" value={month}
                    onChange={({ target }) => setMonth(target.value)} required>
                    {fillMonth.map(item => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                  <label htmlFor="month">Mês*</label>
                </div>
              </div>
              {/* -------------------------Year-------------------------- */}
              <div className="col-md-6 my-2">
                <div className="form-floating">
                  <select className="form-control" id="year" type="text" value={year}
                    onChange={({ target }) => setYear(target.value)} required>
                    {fillYear.map(item => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                  <label htmlFor="year">Ano*</label>
                </div>
              </div>
              {/* -------------------------CVV--------------------------- */}
              <div className="col-md-3 my-2">
                <div className="form-floating">
                  <input className="form-control" id="cvv" type="number" value={cvv}
                    onChange={({ target }) => handleCvvChange(target.value)} />
                  <label htmlFor="cvv">CVV*</label>
                </div>
              </div>
            </div>

            {/* -------------------------Buttons-section------------------------- */}
            <SavePreset backPath={'/profile'} handleSave={handleSave} loading={loadingSave} />
          </form>
        }
        {!add && <div className='anime-right mt-2'><Typography>Cadastre cartões para começar!</Typography></div>}
      </div >
    </div >
  )
}

export default Payment