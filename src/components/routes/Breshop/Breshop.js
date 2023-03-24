import React from "react"
import { LoadingButton } from "@mui/lab"
import { useSelector } from "react-redux"
import useForm from "../../utilities/useForm"
import { useNavigate } from "react-router-dom"
import SaveIcon from "@mui/icons-material/Save"
import cpfMask from "../../utilities/masks/cpf"
import ReplyAllIcon from "@mui/icons-material/ReplyAll"
import { Button, CircularProgress } from "@mui/material"
import numberMask from "../../utilities/masks/clearString"
import { GET_FETCH, POST_FETCH_FORMDATA, STORAGE_URL, URL } from "../../../variables"
import { renderToast } from "../../utilities/Alerts"
import SavePreset from "../Form/SavePreset"

const Breshop = () => {
  const { form, setForm, errors, handleChange, handleBlur, setErrors, handleFileChange } = useForm({
    name: '',
    description: '',
    holder_document: '',
    account_check_digit: '',
    branch_check_digit: '',
    account_number: '',
    branch_number: '',
    bank: '',
    file: { value: '', url: '' }
  })
  const [edit, setEdit] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const [loadingSave, setLoadingSave] = React.useState(false)

  const history = useNavigate()
  const token = useSelector(state => state.AppReducer.token);

  React.useEffect(() => {
    getData()
  }, [])

  async function getData() {
    let response = await GET_FETCH({ url: `get_breshop`, token })
    console.log('resp', response)

    if (response.status) {
      let newForm = { ...form }
      Object.keys({ ...response.breshop }).forEach(item => {
        if (form.hasOwnProperty(item)) newForm = { ...newForm, [item]: response.breshop[item] }
      })

      Object.keys({ ...response.recipient.default_bank_account }).forEach(item => {
        if (form.hasOwnProperty(item)) newForm = { ...newForm, [item]: response.recipient.default_bank_account[item] }
      })

      newForm.file = { value: '', url: response.breshop.file }

      if (response.breshop.id) setEdit(true)
      console.log('form', newForm)
      setForm(newForm)
    }

    setLoading(false)
  }

  const handleSave = async () => {
    setLoadingSave(true)
    let newErrors = {}
    let body = new FormData()

    Object.keys({ ...form }).forEach(item => {
      if (form[item]) body.append(item, form[item])
      else newErrors[item] = 'Campo em branco'
    })
    body.append('banner', form.file.value)

    if (newErrors) setErrors(newErrors)
    let response = ''

    if (edit) response = await POST_FETCH_FORMDATA({ url: `${URL}api/update_breshop`, body, token })
    if (!edit) response = await POST_FETCH_FORMDATA({ url: `${URL}api/store_breshop`, body, token })

    console.log('response', response)
    if (response.status) renderToast({ type: 'success', error: response.message })
    else renderToast({ type: 'error', error: response.message })

    setLoadingSave(false)
  }

  return (
    <>
      {!loading ? <form className="anime-left" onSubmit={(e) => { e.preventDefault(); handleSave() }}>
        <h6 className="dash-title">Informações da loja</h6>
        <div className="row mb-5">
          <div className="col-12 my-3">
            <div className="form-floating">
              <input className={`form-control ${errors?.name && 'is-invalid'}`} value={form.name} onChange={handleChange} onBlur={handleBlur} id='name' name='name' />
              <label htmlFor='name'>Nome*</label>
              <span className='small error'>{errors?.name}</span>
            </div>
          </div>

          <div className="col-12 my-3">
            <div className="form-floating">
              <textarea className={`form-control ${errors?.description && 'is-invalid'}`} value={form.description} onChange={handleChange} onBlur={handleBlur} id='description' name='description' style={{ minHeight: 100 }} />
              <label htmlFor='description'>Descrição*</label>
              <span className='small error'>{errors?.description}</span>
            </div>
          </div>

          <div className='my-3' style={{ height: 360, width: '100%' }}>
            <div className='h-100 w-100'>
              <Button className='square-file-button' fullWidth component="label">
                {form.file?.url
                  ? <img src={form.file?.file ? form.file?.url : `${STORAGE_URL + '/' + form.file?.url}`} className='h-100 w-100' />
                  : <p className='m-auto text-center'>Banner da loja</p>}
                <input hidden onChange={handleFileChange} name='file' accept="image/*" multiple type="file" />
              </Button>
            </div>
          </div>
        </div>


        <h6 className="dash-title">Dados bancários</h6>
        <div className="row my-4">
          <div className="col-sm-12">
            <div className="form-floating">
              <input className={`form-control ${errors?.holder_document && 'is-invalid'}`} value={cpfMask(form.holder_document).mask} onChange={handleChange} onBlur={handleBlur} id='holder_document' name='holder_document' maxLength={11} />
              <label htmlFor='holder_document'>CPF*</label>
              <span className='small error'>{errors?.holder_document}</span>
            </div>
          </div>
        </div>

        <div className="row my-4">
          <div className="col-sm-4">
            <div className="form-floating">
              <input className={`form-control ${errors?.account_check_digit && 'is-invalid'}`} value={numberMask(form.account_check_digit)} onChange={handleChange} onBlur={handleBlur} id='account_check_digit' name='account_check_digit' maxLength={2} />
              <label htmlFor='account_check_digit'>Dígito da conta*</label>
              <span className='small error'>{errors?.account_check_digit}</span>
            </div>
          </div>

          <div className="col-sm-4">
            <div className="form-floating">
              <input className={`form-control ${errors?.branch_check_digit && 'is-invalid'}`} value={numberMask(form.branch_check_digit)} onChange={handleChange} onBlur={handleBlur} id='branch_check_digit' name='branch_check_digit' maxLength={1} />
              <label htmlFor='branch_check_digit'>Dígito da agência*</label>
              <span className='small error'>{errors?.branch_check_digit}</span>

            </div>
          </div>

          <div className="col-sm-4">
            <div className="form-floating">
              <input className={`form-control ${errors?.bank && 'is-invalid'}`} value={numberMask(form.bank)} onChange={handleChange} onBlur={handleBlur} id='bank' name='bank' maxLength={3} />
              <label htmlFor='bank'>Banco*</label>
              <span className='small error'>{errors?.bank}</span>
            </div>
          </div>
        </div>

        <div className="row my-4">
          <div className="col-sm-6">
            <div className="form-floating">
              <input className={`form-control ${errors?.account_number && 'is-invalid'}`} value={numberMask(form.account_number)} onChange={handleChange} onBlur={handleBlur} id='account_number' name='account_number' maxLength={13} />
              <label htmlFor='account_number'>Número da conta*</label>
              <span className='small error'>{errors?.account_number}</span>
            </div>
          </div>

          <div className="col-sm-6">
            <div className="form-floating">
              <input className={`form-control ${errors?.branch_number && 'is-invalid'}`} value={numberMask(form.branch_number)} onChange={handleChange} onBlur={handleBlur} id='branch_number' name='branch_number' maxLength={4} />
              <label htmlFor='branch_number'>Número da agência*</label>
              <span className='small error'>{errors?.branch_number}</span>
            </div>
          </div>
        </div>

        <SavePreset backPath={'/profile'} handleSave={handleSave} loading={loadingSave} />
      </form>
        : <div className='d-flex justify-content-center p-5'><CircularProgress /></div>}
    </>
  );
};

export default Breshop;
