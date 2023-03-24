import { Button, IconButton, Typography } from '@mui/material';
import React from 'react';
import { FileDrop } from 'react-file-drop';
import { API_URL, GET_FETCH, POST_FETCH_FORMDATA, URL } from '../../../variables';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import MdClose, { MdClosedCaptionOff, MdOutlineClose } from 'react-icons/md'
import SaveIcon from '@mui/icons-material/Save';
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import setError from '../../utilities/Error';
import { moneyMask } from '../../utilities/masks/currency';
import SavePreset from '../Form/SavePreset';
import { CircularProgress } from '@mui/material'

const AddProduct = ({ edit }) => {
  // -------------------------------------------------------------------
  //********************************************************************
  // -------------------------States------------------------------------
  const [size, setSize] = React.useState({
    pp: false,
    p: false,
    m: false,
    g: false,
    gg: false,
    xg: false
  })

  const [form, setForm] = React.useState({
    name: { value: "", error: false },
    damage: { value: "", error: false },
    quantity: { value: "", error: false },
    description: { value: "", error: false },
    price: { value: "", mask: "", error: false },
    type: { value: "", error: false },
    styles: { value: "", error: false, selected: [] },
    materials: { value: "", error: false, selected: [] },
    thumb: { value: "", url: "" },
    files: [],
  })

  const history = useNavigate();
  const [loading, setLoading] = React.useState(true)
  const [loadingSave, setLoadingSave] = React.useState(false)
  const token = useSelector(state => state.AppReducer.token);

  // -----------------------------------------------------------------
  //******************************************************************
  // -------------------------Getting-data----------------------------
  React.useEffect(() => {
    const getData = async () => {
      const response = await GET_FETCH({ url: 'get_data', token })
      setForm({
        ...form,
        filled: { value: true },
        type: { ...form.type, fillOption: response.types },
        styles: { ...form.styles, fillOption: response.styles },
        materials: { ...form.materials, fillOption: response.materials },
      })
      console.log('resp', response)
      setLoading(false)
    }

    getData()
  }, [])

  // -----------------------------------------------------------------
  //******************************************************************
  // -------------------------Saving-data-----------------------------
  const handleSave = async () => {
    setLoadingSave(true)
    let formData = new FormData()
    Object.keys({ ...form }).forEach(item => formData.append(item, form[item].value))

    form.files.forEach(item => {
      formData.append('files[]', item.value)
    })


    Object.keys({ ...size }).forEach(item => {
      formData.append('sizes[]', JSON.stringify({ [item]: size[item] }))
    })

    form.styles.selected.forEach(item => {
      const name = form.styles.fillOption.filter(style => style.id === item)[0].name
      formData.append('styles[]', item)
    })

    form.materials.selected.forEach(item => {
      const name = form.materials.fillOption.filter(material => material.id === item)[0].name
      formData.append('materials[]', item)
    })

    const response = await POST_FETCH_FORMDATA({ url: `${API_URL}store_product`, body: formData, token })
    // console.log('resp', response)
    setLoadingSave(false)
  }

  // -----------------------------------------------------------------
  //******************************************************************
  // -------------------------Other-functions-------------------------
  function handleChangeFile(files) {
    let form2 = { ...form }
    form2.files = []

    for (let i = 0; i < 4; i++) {
      let fr = new FileReader()
      fr.onload = (e) => {
        form2.files = [...form2.files, { value: files[i], url: e.target.result }]
      }
      fr.readAsDataURL(files[i])
    }

    setForm(form2)
  }


  const handleChangeThumb = (file) => {
    let form2 = { ...form }

    let fr = new FileReader()
    fr.onload = (e) => {
      form2.thumb = { ...form2.thumb, value: file, url: e.target.result }
    }
    fr.readAsDataURL(file)

    setForm(form2)
  }

  const handleSizeChange = (item) => {
    setSize({ ...size, [item]: !size[item] })
    setForm({ ...form, size: { ...form.size, value: item, error: false } })
  }

  const handleArrayChange = (value, type) => {
    let selected = form[type].selected
    if (selected.filter(item => item === value).length === 0) selected = [...selected, value]

    setForm({ ...form, [type]: { ...form[type], value, selected, error: false } })
  }

  return (
    <div className="row mt-3">
      <Typography variant='h5'>CADASTRO DE PRODUTO</Typography>

      {!loading ?
        <>
          {/* -------------------------Thumb-image------------------------- */}
          <div className="row mb-4">
            <div className="col-md-6">
              <div style={{ height: 400, width: 400 }}>
                <FileDrop onDrop={(files, event) => handleChangeThumb(files[0])}>
                  <Button style={{ color: '#666666', width: '100%', height: '100%', padding: 0 }} component="label">
                    {!form.thumb.url &&
                      <Typography variant='p' style={{ color: '#666666' }}>Arraste ou escolha a capa do produto</Typography>}
                    {form.thumb.url &&
                      <img className='w-100 h-100 rounded' alt='product' src={form.thumb.url ? form.thumb.url : `${URL}storage/products/no_product.jpg`}></img>}
                    <input hidden onChange={(e) => handleChangeThumb(e.target.files[0])} accept="image/*" multiple type="file" />
                  </Button>
                </FileDrop>
              </div>
            </div>
            {/* -------------------------Other-images------------------------- */}
            <div className="col-md-6 rounded">
              <div style={{ height: 400, width: 400 }}>
                <FileDrop onDrop={(files, event) => handleChangeFile(files)}>
                  <Button style={{ color: '#666666', width: '100%', height: '100%', padding: 0 }} component="label">
                    {form.files.length === 0 &&
                      <Typography variant='p' style={{ color: '#666666' }}>Arraste ou escolha até quatro imagens</Typography>}
                    {form.files.lenght !== 0 &&
                      <div className="row h-100">
                        {form.files.map(item => {
                          return (
                            <div className='col-6'>
                              <div className="d-flex h-100">
                                <img alt='file' src={item.url} className='img-fluid rounded' />
                                <div className="p-absolute">
                                  <button className='close-absolute' onClick={() => console.log('teste')}><MdOutlineClose size={20} /></button>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    }
                    <input hidden onChange={(e) => handleChangeFile(e.target.files)} accept="image/*" multiple type="file" />
                  </Button>
                </FileDrop>
              </div>
            </div>
            {/* -------------------------Button-image------------------------- */}
            <div className="col-12 my-3">
              <Button fullWidth sx={{ backgroundColor: '#e8e8e8' }} component="label">
                {<Typography variant='p' style={{ color: '#666666' }}>Escolha o restante das imagens</Typography>}
                <input hidden onChange={(e) => handleChangeFile(e.target.files)} accept="image/*" multiple type="file" />
              </Button>
              <Typography className='mt-2' variant='p'>Recomendamos o uso de imagens com 450p X 450px</Typography>
            </div>
          </div>

          {/* -------------------------Types------------------------- */}
          <div className="row">
            <div className="col-sm-4">
              <div className="form-floating">
                <select id='type' className={`form-control ${form.type.error && 'is-invalid'}`} value={form.type.value}
                  onChange={(e) => setForm({ ...form, type: { ...form.type, value: e.target.value, error: false } })}>
                  {form.type.fillOption && form.type.fillOption.map(item => (<option key={item.id} value={item.id}>{item.name}</option>))}
                </select>
                <label htmlFor='type'>Tipo de roupa</label>
              </div>
            </div>
            {/* -------------------------Styles------------------------- */}
            <div className="col-sm-4">
              <div className="form-floating">
                <select id='style' className={`form-control ${form.styles.error && 'is-invalid'}`} value={form.styles.value}
                  onChange={(e) => handleArrayChange(e.target.value, 'styles')}>
                  {form.styles.fillOption && form.styles.fillOption.map(item => (<option key={item.id} value={item.id}>{item.name}</option>))}
                </select>
                <label htmlFor='style'>Estilo da roupa</label>
              </div>
            </div>
            {/* -------------------------Materials------------------------- */}
            <div className="col-sm-4">
              <div className="form-floating">
                <select id='material' className={`form-control ${form.materials.error && 'is-invalid'}`} value={form.materials.value}
                  onChange={(e) => handleArrayChange(e.target.value, 'materials')}>
                  {form.materials.fillOption && form.materials.fillOption.map(item => (<option key={item.id} value={item.id}>{item.name}</option>))}
                </select>
                <label htmlFor='material'>Material</label>
              </div>
            </div>
          </div>
          {/* -------------------------Selected-styles------------------------- */}
          {form.styles.selected.length > 0 &&
            <div className="d-flex mt-3 align-items-center flex-wrap">
              <Typography className='me-3'>Estilos selecionados: </Typography>
              {form.styles.selected.map(item => {
                const name = form.styles.fillOption.filter(style => style.id === item)[0].name
                return (
                  <div key={item} className="d-flex align-items-center bg-gray px-2 my-2 me-2 rounded" style={{ backgroundColor: '#f1f1f1' }}>
                    <span className='small' key={item}>{name.toUpperCase()}</span>
                    <IconButton color='error' onClick={() => setForm({ ...form, styles: { ...form.styles, selected: form.styles.selected.filter(style => style !== item) } })}>
                      <MdOutlineClose size={20} />
                    </IconButton>
                  </div>
                )
              })}
            </div>}
          {/* -------------------------Selected-materials------------------------- */}
          {form.materials.selected.length > 0 &&
            <div className="d-flex mt-3 align-items-center flex-wrap">
              <Typography className='me-3'>Materiais selecionados: </Typography>
              {form.materials.selected.map(item => {
                const name = form.materials.fillOption.filter(material => material.id === item)[0].name
                return (
                  <div key={item} className="d-flex align-items-center bg-gray px-2 me-2 rounded" style={{ backgroundColor: '#f1f1f1' }}>
                    <span className='small' key={item}>{name.toUpperCase()}</span>
                    <IconButton color='error' onClick={() => setForm({ ...form, materials: { ...form.materials, selected: form.materials.selected.filter(style => style !== item) } })}>
                      <MdOutlineClose size={20} />
                    </IconButton>
                  </div>
                )
              })}
            </div>}
          {/* -------------------------Name------------------------- */}
          <div className="row my-3">
            <div className="col-sm-6">
              <div className="form-floating">
                <input className={`form-control ${form.name.error && 'is-invalid'}`} id="name" type="text" value={form.name.value}
                  onChange={({ target }) => setForm({ ...form, name: { ...form.name, value: target.value, error: false } })}
                  onBlur={() => setError('name', form, setForm)} required />
                <label htmlFor="name">Nome*</label>
              </div>
            </div>
            {/* -------------------------Price------------------------- */}
            <div className="col-sm-4">
              <div className="form-floating">
                <input className={`form-control ${form.price.error && 'is-invalid'}`} id="price" type="text" value={form.price.mask}
                  onChange={({ target }) => setForm({ ...form, price: { ...form.price, value: target.value.replace(/\D/g, ''), mask: moneyMask(target.value), error: false } })}
                  onBlur={() => setError('price', form, setForm)} required />
                <label htmlFor="price">Preço*</label>
              </div>
            </div>
            {/* -------------------------Quantity------------------------- */}
            <div className="col-sm-2">
              <div className="form-floating">
                <input className={`form-control ${form.quantity.error && 'is-invalid'}`} id="quantity" type="number" value={form.quantity.value}
                  onChange={({ target }) => setForm({ ...form, quantity: { ...form.quantity, value: target.value, error: false } })}
                  onBlur={() => setError('quantity', form, setForm)} required />
                <label htmlFor="quantity">Quantidade*</label>
              </div>
            </div>
          </div>
          {/* -------------------------Description------------------------- */}
          <div className="row my-3">
            <div className="col-12">
              <div className="form-floating">
                <textarea className={`form-control ${form.description.error && 'is-invalid'}`} name="text" id="description" rows="10" value={form.description.value}
                  onChange={({ target }) => setForm({ ...form, description: { ...form.description, value: target.value, error: false } })}
                  onBlur={() => setError('description', form, setForm)} style={{ minHeight: 150 }} />
                <label htmlFor="description">Descrição*</label>
              </div>
            </div>
            {/* -------------------------Sizes------------------------- */}
            {Object.keys({ ...size }).map((item, index) => (
              <div className="col-2 text-center rounded my-3" key={index}>
                <Button fullWidth color={size[item] ? 'success' : 'error'} sx={{ backgroundColor: '#f1f1f1' }} endIcon={size[item] ? <CheckIcon /> : <CloseIcon />}
                  onClick={() => handleSizeChange(item)}>
                  {item}
                </Button>
              </div>
            ))}
            {/* -------------------------Damage-description-check------------------------- */}
            <div className="col-12 mt-3">
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" />
                <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Possui avaria</label>
              </div>
              {/* -------------------------Damage-description------------------------- */}
              <div className="form-floating">
                <textarea className={`form-control ${form.damage.error && 'is-invalid'}`} name="text" id="description" rows="10" value={form.damage.value}
                  onChange={({ target }) => setForm({ ...form, damage: { ...form.damage, value: target.value, error: false } })}
                  onBlur={() => setError('damage', form, setForm)} style={{ minHeight: 150 }} />
                <label htmlFor="description">Avaria*</label>
              </div>
            </div>
            {/* -------------------------Buttons------------------------- */}
            <SavePreset backPath={'/profile'} handleSave={handleSave} loading={loadingSave} />
          </div>
        </>
        : <div className='d-flex justify-content-center p-5'><CircularProgress /></div>}
    </div >
  )
}

export default AddProduct