import React from 'react'
import { useSelector } from 'react-redux'
import setError from '../../utilities/Error'
import { GET_FETCH } from '../../../variables'
import cpfMask from '../../utilities/masks/cpf'
import phoneMask from '../../utilities/masks/phone'
import { CircularProgress, Typography } from '@mui/material'

//Props coming from the PaymentScreen
const UserData = ({ user, setUser, setCart }) => {
  // -------------------------------------------------------------------
  //********************************************************************
  // -------------------------States------------------------------------
  const [genders, setGenders] = React.useState('')
  const [genderId, setGenderId] = React.useState('')
  const [loadingUser, setLoadingUser] = React.useState(true)
  const [documentDisabled, setDocumentDisabled] = React.useState(false)

  const token = useSelector(state => state.AppReducer.token)

  React.useEffect(() => {
    getData()
    //Filling user state from PaymentScreen
    setUser({
      filled: { value: true },
      birth: { value: "", error: false },
      gender: { value: "male", error: false },
      condominium_id: { value: "", error: false },
      phone: { value: "", error: false, mask: "", length: 10 },
      document: { value: "", error: false, mask: "", length: 11 },
    })
  }, [])

  // -----------------------------------------------------------------
  //******************************************************************
  // -------------------------Getting-data----------------------------
  const getData = async () => {
    const resp = await GET_FETCH({ url: 'customers', token })
    console.log('user data', resp)
    //If the request returns true, the user state will be updated with the avaible data
    if (resp.status) {
      const phone = `${resp.customer?.phones?.mobile_phone?.area_code}${resp.customer?.phones?.mobile_phone?.number}`
      const birthdate = resp.customer?.birthdate
      const document = resp.customer?.document

      if (resp.cart_items) setCart(resp.cart_items)
      if (resp.customer) setUser({
        filled: { value: true },
        //Formating user birth to dd/mm/aaaa
        birth: { value: birthdate && birthdate.substring(0, 10) },
        //Formating use phone to (ddd)nnnnn-nnnn
        phone: { value: phone, mask: phone && phoneMask(phone).mask, length: 10 },
        //Formating user document to nnn.nnn.nnn-nn
        document: { value: document, mask: document && cpfMask(document).mask, length: 11 },
        gender: { value: resp.user.gender_id },
      })

      setGenderId(resp.user.gender_id)
      setGenders(resp.genders)
      setLoadingUser(false)
    }
  }
  return (
    <>
      <Typography>Informações sobre o grupo</Typography>
      {!loadingUser
        ?
        <form>
          <div className="row">
            {/* --------------------------Document-------------------------- */}
            <div className='col-12 my-2'>
              <div className='form-floating'>
                <input className={`form-control ${user.document.error && 'is-invalid'}`} id='doc' type='text' value={user.document.mask} disabled={documentDisabled ? true : false}
                  onChange={({ target }) => setUser({ ...user, document: { ...user.document, value: cpfMask(target.value).value, mask: cpfMask(target.value).mask, error: false } })}
                  onBlur={() => setError('document', user, setUser)} required />
                <label htmlFor='doc'>CPF*</label>
              </div>
            </div>
          </div>
          {/* --------------------------Birthdate-------------------------- */}
          <div className='row mt-4'>
            <div className='col-sm-4 my-2'>
              <div className='form-floating'>
                <input className={`form-control ${user.birth.error && 'is-invalid'}`} id='birth' type='date' value={user.birth.value}
                  onChange={({ target }) => {
                    //Comparing the selected date with the current one along with its size
                    //Ff it is greater or invalid, its value will be zeroed and the error appears to the user
                    if (new Date(target.value) > new Date() || Array.from(target.value).length > 10) {
                      setUser({ ...user, birth: { ...user.birth, value: '', error: true } })
                    } else {
                      setUser({ ...user, birth: { ...user.birth, value: target.value, error: false } })
                    }
                  }}
                  onBlur={() => setError('birth', user, setUser)} required />
                <label htmlFor='birth'>Nascimento*</label>
                {user.birth.error && <p className='small' style={{ color: '#FF0000' }}>Data maior que a atual!</p>}
              </div>
            </div>
            {/* --------------------------Gender-------------------------- */}
            <div className='col-sm-4 my-2'>
              <div className='form-floating'>
                <select className={`form-control ${user.gender.error && 'is-invalid'}`} id='gender' type='text' value={genderId}
                  onChange={({ target }) => {
                    setGenderId(target.value)
                    setUser({ ...user, gender: { ...user.gender, value: genders.filter(item => item.id === target.value)[0].key, error: false } })
                  }}
                  onBlur={() => setError('gender', user, setUser)} required>
                  {!genderId && <option>Escolha um gênero</option>}
                  {console.log('edasd', genders)}
                  {genders.map(item => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
                <label htmlFor='gender'>Sexo*</label>
              </div>
            </div>
            {/* --------------------------Phone-------------------------- */}
            <div className='col-sm-4 my-2'>
              <div className='form-floating'>
                <input className={`form-control ${user.phone.error && 'is-invalid'}`} id='number' type='text' value={user.phone.mask}
                  onChange={({ target }) => setUser({ ...user, phone: { ...user.phone, value: phoneMask(target.value).value, mask: phoneMask(target.value).mask, error: false } })}
                  onBlur={() => setError('phone', user, setUser)} required />
                <label htmlFor='number'>Telefone*</label>
              </div>
            </div>
          </div>
        </form>
        :
        <div className="d-flex justify-content-center p-5"><CircularProgress color='inherit' /></div>}
    </>
  )
}

export default UserData