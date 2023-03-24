import { CircularProgress, IconButton, TextField, Typography } from '@mui/material'
import React from 'react'
import { FaTrash } from 'react-icons/fa'
import { MdAdd, MdClose, MdEdit } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { DELETE_FETCH, GET_FETCH, MOUNT_JSON_BODY, POST_FETCH, PUT_FETCH, SEED_STATE, STORAGE_URL, URL, VALIDATE } from '../../../variables'
import { renderAlert, renderToast, ToastContent } from '../../utilities/Alerts'
import Input from '../Form/Input'
import SavePreset from '../Form/SavePreset'

const PaymantData = () => {
  const [loading, setLoading] = React.useState(false)
  const [loadingSave, setLoadingSave] = React.useState(false)
  const [data, setData] = React.useState('')
  const [edit, setEdit] = React.useState(false)
  const [add, setAdd] = React.useState(false)
  const token = useSelector(state => state.AppReducer.token);

  const fillMonth = ['01', '02', '03', '04', '05', '06', '07', '09', '10', '11', '12']
  const fillYear = ['2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030', '2031', '2032', '2033']

  const [card, setCard] = React.useState({
    id: { value: "", type: 'text', hidden: true },
    holder_document: { label: 'CPF do Títular*', value: "", error: false, col: 'col-sm-6', type: 'cpf', mask: '' },
    number: { label: 'Número*', value: "", error: false, col: 'col-sm-6', type: 'card', mask: '', length: 16 },
    brand: { label: 'Bandeira*', value: "visa", error: false, col: 'col-sm-12', type: 'text', hidden: true },
    exp_month: { label: 'Mês*', value: "01", error: false, col: 'col-sm-4', type: 'select', fillOption: fillMonth },
    exp_year: { label: 'Ano*', value: "2023", error: false, col: 'col-sm-4', type: 'select', fillOption: fillYear },
    cvv: { label: 'CVV*', value: "", error: false, col: 'col-sm-4', type: 'number', length: 3 },
    holder_name: { label: 'Nome do Títular*', value: "", error: false, col: 'col-sm-12', type: 'text', },
  })

  React.useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    setLoading(true)
    let response = await GET_FETCH({ url: 'list_cards', token })
    setData(() => response.cards.data.map(item => {
      let cvv = response.cvv_cards.filter(cvvCard => cvvCard.card_id === item.id)[0]?.cvv
      let firstDigits = Array.from(item.first_six_digits)
      let number = firstDigits.splice(0, 4).toString().replace(/,/g, '') + ' ' + firstDigits.toString().replace(/,/g, '') + '** **** ' + item.last_four_digits
      return { ...item, cvv, number }
    }))
    setLoading(false)
  }
  console.log('data', data, card)

  const handleSave = async (type) => {
    let validation = VALIDATE({ state: card, setState: setCard })
    let body = MOUNT_JSON_BODY({ form: card })
    let response

    if (validation) {
      setLoadingSave(true)
      if (type === 'update') response = await PUT_FETCH({ url: 'update_card', body, token });
      else if (type === 'add') response = await POST_FETCH({ url: `${URL}api/store_card`, body, token });

      if (response && response.status) {
        renderToast({ type: 'success', error: response?.message })
        getData()
      }
      else renderToast({ type: 'error', error: response ? response.message[0] : 'Erro ao alterar cartão, tente novamente mais tarde!' })
    }
    setLoadingSave(false)
  }

  function renderInput(state, setState) {
    let keys = { ...state }
    keys = Object.keys(keys)

    return keys.map((item, index) => (
      <div key={index} className={`${state[item].col} col-12 my-2 justify-content-center`}>
        <Input state={state} setState={setState} item={item} edit={edit} />
      </div>
    ))
  }

  const handleAdd = () => {
    let card2 = { ...card }
    let keys = Object.keys(card2)

    keys.forEach(item => { card2 = { ...card2, [item]: { ...card2[item], value: '', mask: '', error: false, disabled: false } } })
    setAdd(!add); setCard(card2)
  }

  const handleDelete = async (id) => {
    let response = await DELETE_FETCH({ url: `delete_card/${id}`, token })
    if (response.status) {
      let newData = data.filter(item => item.id !== id)
      setData(newData)
    } else renderToast({ type: 'error', error: 'Erro ao deletar cartão, tente novamente mais tarde' })
  }

  const handleEdit = async (item) => {
    SEED_STATE({ state: card, setState: setCard, respState: item })
    setCard({ ...card, number: { ...card.number, disabled: true }, cvv: { ...card.cvv, disabled: true } })
    setEdit(true); setAdd(true)
  }

  return (
    <>
      {/* <div className="d-flex justify-content-center"> */}
      <div className="content">
        <Typography variant='h6'>Cartões</Typography>
        {!loading ? <div className="d-flex flex-wrap">
          {data && data.map((item, index) => (
            <div key={index} className="row payment-card mb-5 m-auto">
              <div className="col-12 mt-4 bg-dark" style={{ height: '2rem' }}></div>

              <div className="d-flex">
                <div style={{ width: '75px', marginTop: 5 }}>
                  <img className='img-fluid' src={`${STORAGE_URL}/brands/${item.brand}.png`} alt='brand' />
                </div>
                <div className="ms-auto">
                  <IconButton onClick={() => handleEdit(item)}><MdEdit /></IconButton>
                  <IconButton onClick={() => renderAlert({ id: item.id, deleteFunction: handleDelete, item: 'cartão', article: 'o' })}><MdClose />
                  </IconButton>
                </div>
              </div>

              <div className="col-12">
                <p>{item.holder_name}</p>
                <p>{item.number}</p>
                <div className="d-flex" style={{ fontSize: '.8rem' }}>
                  <div className='d-flex'>
                    <p className='me-2'>Validade</p>
                    <p>{item.exp_month}/{item.exp_year}</p>
                  </div>
                  <div className='d-flex ms-4' style={{ fontSize: '.8rem' }}>
                    <p className='me-2'>CVV</p>
                    <p>{item.cvv}</p>
                  </div>
                </div>
              </div>
            </div>
          )
          )}
        </div> : <div className="d-flex justify-content-center p-5"><CircularProgress /></div>}

        <div className="row my-5">
          <div className="d-flex align-items-center">
            <Typography variant='h6'>Adicionar Cartão</Typography>
            <button onClick={handleAdd} className='rounded-button hvr-grow ms-2 d-flex align-items-center justify-content-center'>
              {add ? <FaTrash size={15} /> : <MdAdd size={20} />}
            </button>
          </div>
          {add && <div className='anime-left row'>{renderInput(card, setCard)}</div>}
          {!add && <div className='anime-right mt-2'><Typography>Cadastre cartões para começar!</Typography></div>}
        </div>

        <SavePreset save={(e) => handleSave(e)} loading={loadingSave} edit={edit} />
      </div >
      {/* </div> */}
      <ToastContent />
    </>
  )
}

export default PaymantData