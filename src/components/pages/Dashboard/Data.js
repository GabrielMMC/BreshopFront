import React from 'react'
import { Button, Typography, CircularProgress } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { GET_FETCH, POST_FETCH_FORMDATA, URL, STORAGE_URL, API_URL } from '../../../variables'
import phoneMask, { splitNumber } from '../../utilities/masks/phone'
import cpfMask from '../../utilities/masks/cpf'
import { renderToast } from '../../utilities/Alerts'
import SavePreset from '../../routes/Form/SavePreset'

const Data = () => {
  // -------------------------------------------------------------------
  //********************************************************************
  // -------------------------States------------------------------------
  const [loading, setLoading] = React.useState(true)
  const [loadingSave, setLoadingSave] = React.useState(false)

  const [name, setName] = React.useState('')
  const [file, setFile] = React.useState('')

  const [genders, setGenders] = React.useState('')
  const [genderId, setGenderId] = React.useState('')
  const [gender, setGender] = React.useState('male')

  const [document, setDocument] = React.useState('')
  const [birthDate, setBirthDate] = React.useState('')
  const [errorDate, setErrorDate] = React.useState(false)
  const [documentDisabled, setDocumentDisabled] = React.useState(false)

  const [email, setEmail] = React.useState('')
  const [number, setNumber] = React.useState('')

  const history = useNavigate()
  const dispatch = useDispatch()
  const token = useSelector(state => state.AppReducer.token)


  React.useEffect(() => {
    getData()
  }, [])

  // -----------------------------------------------------------------
  //******************************************************************
  // -------------------------Getting-data----------------------------
  const getData = async () => {
    const resp = await GET_FETCH({ url: `customers`, token })

    if (resp.status) {
      //Merging DDD with phone number
      const phone = `${resp.customer?.phones?.mobile_phone?.area_code}${resp.customer?.phones?.mobile_phone?.number}`
      const birthdate = resp.customer?.birthdate

      //Setting states with request data
      setName(resp.customer?.name)
      setEmail(resp.customer?.email)
      setGenderId(resp.user.gender_id)
      setGenders(resp.genders)
      setFile({ url: resp.user.file ? `${STORAGE_URL}${resp.user.file}` : '' })
      //Getting values and masks with mask functions
      setBirthDate(birthdate && birthdate.substring(0, 10))
      setDocumentDisabled(resp.customer.document ? true : false)
      setNumber({ value: phoneMask(phone).value, mask: phoneMask(phone).mask })
      setDocument(resp.customer.document ? { value: cpfMask(resp.customer?.document).value, mask: cpfMask(resp.customer?.document).mask } : { value: '', mask: '' })

    } else {
      //Error toast
      renderToast({ type: 'error', error: 'Erro ao buscar dados, tente novamente mais tarde!' })
    }

    setLoading(false)
  }

  // -----------------------------------------------------------------
  //******************************************************************
  // -------------------------Saving-data-----------------------------
  const handleSave = async (e) => {
    e.preventDefault(); setLoadingSave(true)
    let form = new FormData()
    const { area, numb } = splitNumber(number)

    //Appending values for request
    form.append('name', name)
    form.append('document', document.value)
    form.append('gender', gender)
    form.append('file', file.value)
    form.append('email', email)
    form.append('number', numb)
    form.append('area_code', area)
    form.append('birthdate', birthDate)
    form.append('gender_id', genderId)
    const resp = await POST_FETCH_FORMDATA({ url: `${API_URL}customers/update`, body: form, token })

    if (resp.status) {
      //If the request status is true, an object with the new user's response will be set in local storage and redux storage
      localStorage.setItem("user", JSON.stringify(resp.user))
      dispatch({ type: "user", payload: (resp.user) });
      setLoadingSave(false)

      //Toasts of status
      renderToast({ type: 'success', error: 'Informações atualizadas com sucesso!' })
    } else {
      renderToast({ type: 'error', error: 'Erro ao atualizar os dados, tente novamente mais tarde!' })
    }
  }

  // -----------------------------------------------------------------
  //******************************************************************
  // -------------------------Other-functions-------------------------
  const handleFileChange = (file) => {
    //Function to load an image with FileReader
    let fr = new FileReader()
    fr.onload = (e) => {
      //When load, an image URL is generated
      setFile({ value: file, url: e.target.result })
    }
    fr.readAsDataURL(file)
  }

  return (
    <>
      {/* -------------------------Account-section------------------------- */}
      <h6 className="dash-title">Resumo da conta</h6>
      {!loading ? <form onSubmit={(e) => { handleSave(e) }}>
        <div className='row align-items-end'>
          {/* -------------------------Name------------------------- */}
          <div className='col-md-4 my-2'>
            <div className='form-floating'>
              <input className='form-control' id='name' type='text' value={name}
                onChange={({ target }) => setName(target.value)} required />
              <label htmlFor='name'>Nome*</label>
            </div>
          </div>
          {/* -------------------------Email------------------------- */}
          <div className='col-md-4 my-2'>
            <div className='form-floating'>
              <input className='form-control' id='email' type='email' value={email}
                onChange={({ target }) => setEmail(target.value)} required />
              <label htmlFor='email'>Email*</label>
            </div>
          </div>
          {/* -------------------------Image------------------------- */}
          <div className='col-md-4 my-2'>
            <div style={{ width: 100, height: 100, margin: 'auto' }}>
              <Button className='file-button' component="label">
                {file?.url
                  ? <img src={file.url} className='file-img' />
                  : <p className='m-auto text-center'>Sua foto aqui</p>}
                <input hidden onChange={(e) => handleFileChange(e.target.files[0])} accept="image/*" multiple type="file" />
              </Button>
            </div>
          </div>
        </div>
        {/* -------------------------Document------------------------- */}
        <div className='col-md-12 my-2 mt-4'>
          <div className='form-floating'>
            <input className='form-control' id='doc' type='text' value={document?.mask} disabled={documentDisabled ? true : false}
              onChange={({ target }) => setDocument({ value: cpfMask(target.value).value, mask: cpfMask(target.value).mask })} required />
            <label htmlFor='doc'>CPF*</label>
          </div>
        </div>
        {/* -------------------------Birthdate------------------------- */}
        <div className='row mt-4'>
          <div className='col-md-4 my-2'>
            <div className='form-floating'>
              <input className='form-control' id='birth' type='date' value={birthDate}
                onChange={({ target }) => {
                  //Comparing the selected date with the current one along with its size
                  //Ff it is greater or invalid, its value will be zeroed and the error appears to the user
                  if (new Date(target.value) > new Date() || Array.from(target.value).length > 10) {
                    setBirthDate('')
                    setErrorDate(true)
                  } else {
                    setBirthDate(target.value)
                    setErrorDate(false)
                  }
                }} required />
              <label htmlFor='birth'>Nascimento*</label>
              {errorDate && <p className='small' style={{ color: '#FF0000' }}>Data maior que a atual!</p>}
            </div>
          </div>
          {/* -------------------------Gender------------------------- */}
          <div className='col-md-4 my-2'>
            <div className='form-floating'>
              <select className='form-control' id='gender' type='text' value={genderId}
                onChange={({ target }) => {
                  setGenderId(target.value)
                  setGender(genders.filter(item => item.id === target.value)[0].key)
                }} required>
                {!genderId && <option>Escolha um gênero</option>}
                {genders.map(item => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
              <label htmlFor='gender'>Sexo*</label>
            </div>
          </div>
          {/* -------------------------Phone------------------------- */}
          <div className='col-md-4 my-2'>
            <div className='form-floating'>
              <input className='form-control' id='number' type='text' value={number?.mask}
                onChange={({ target }) => setNumber({ value: phoneMask(target.value).value, mask: phoneMask(target.value).mask })} required />
              <label htmlFor='number'>Telefone*</label>
            </div>
          </div>
        </div>
        {/* -------------------------Buttons-section------------------------- */}
        <SavePreset backPath={'/profile'} handleSave={handleSave} loading={loadingSave} />
      </form> : <div className="d-flex justify-content-center p-5"><CircularProgress color='inherit' /></div>}
    </>
  )
}

export default Data