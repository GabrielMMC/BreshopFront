import React from 'react'
import Input from '../Form/Input'
import { useSelector } from 'react-redux'
import SavePreset from '../Form/SavePreset'
import { CircularProgress, Divider, Typography } from '@mui/material'
import { GET_FETCH, MOUNT_FORM_DATA, PATCH_FETCH_FORMDATA, SEED_STATE, URL } from '../../../variables'
import { renderToast } from '../../utilities/Alerts'

const Data = () => {
  const [loading, setLoading] = React.useState(true)
  const [loadingSave, setLoadingSave] = React.useState(false)
  const [edit, setEdit] = React.useState(false)
  const [id, setId] = React.useState(false)
  const token = useSelector(state => state.AppReducer.token);

  const [data, setData] = React.useState({
    id: { value: "", type: 'date', hidden: true },
    birthdate: { label: 'Data de Nascimento*', value: "", error: false, col: 'col-sm-4', type: 'date', date: '' },
    gender: { label: 'Gênero*', value: "male", error: false, col: 'col-sm-4', type: 'select', fillOption: ['male', 'female'] },
    file: { label: 'Imagem*', value: "", error: false, col: 'col-sm-4 d-flex', type: 'file-rounded', url: '' },
    name: { label: 'Nome*', value: "", error: false, col: 'col-sm-6', type: 'text' },
    document: { label: 'CPF*', value: "", error: false, col: 'col-sm-6', type: 'cpf', mask: '' },
  })

  const [phone, setPhone] = React.useState({
    email: { label: 'Email*', value: "", error: false, col: 'col-sm-6', type: 'email' },
    number: { label: 'Número*', value: "", error: false, col: 'col-sm-6', type: 'phone+', mask: '' },
    area_code: { value: "", hidden: true },
  })

  React.useEffect(() => {
    getData()
  }, [])

  async function getData() {
    let response = await GET_FETCH({ url: `get_user_data`, token })
    let userData; let userPhone
    if (response.status) {
      userData = { ...response.user_data, ...response.customer }
      userPhone = response.customer.phones.mobile_phone ? response.customer.phones.mobile_phone : {}
      console.log('userData', userData, response, userPhone)

      SEED_STATE({ state: data, respState: userData, setState: setData, setId })
      SEED_STATE({ state: phone, respState: [userData, userPhone], setState: setPhone })
    }
    setLoading(false)
  }

  async function save(type) {
    setLoadingSave(true)
    let body = mountBody()
    let response

    if (type === 'add') response = await PATCH_FETCH_FORMDATA({ url: 'update_user_data', body, token })
    if (response.status) renderToast({ type: 'success', error: 'Informações atualizadas com sucesso!' })
    else renderToast({ type: 'error', error: 'Erro ao atualizar informações, tente novamente mais tarde' })
    setLoadingSave(false)
  }

  function mountBody() {
    let formBody = MOUNT_FORM_DATA({ form: [data, phone], id })
    return formBody
  }

  function renderInput(state, setState) {
    let keys = { ...state }
    keys = Object.keys(keys)

    return keys.map((item, index) => (
      <div key={index} className={`${state[item].col} col-12 my-2 justify-content-center`}>
        <Input state={state} setState={(e) => setState(e)} item={item} edit={edit} />
      </div>
    ))
  }

  return (
    <div className="content">
      {!loading ? <>
        <div className="row my-5 align-items-end">
          <Typography variant='h6'>Dados Gerais</Typography>
          {!loading && renderInput(data, setData)}
        </div>
        <Divider />
        <div className="row my-5">
          <Typography variant='h6'>Contato</Typography>
          {!loading && renderInput(phone, setPhone)}
        </div>

        <SavePreset save={(e) => save(e)} loading={loadingSave} edit={edit} />
      </> : <div className="d-flex justify-content-center p-5"><CircularProgress /></div>}
    </div>
  )
}

export default Data