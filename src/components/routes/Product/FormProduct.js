import { Button, Typography } from '@mui/material'
import React from 'react'
import { GET_FETCH } from '../../../variables'
import setError from '../../utilities/Error'
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { moneyMask } from '../../utilities/masks/currency';
import { FileDrop } from 'react-file-drop';

const FormProduct = ({ form, setForm, token }) => {
  const [size, setSize] = React.useState({
    pp: false,
    p: false,
    m: false,
    g: false,
    gg: false,
    xg: false
  })

  React.useEffect(() => {
    const getData = async () => {
      const response = await GET_FETCH({ url: 'get_data', token })
      setForm({
        ...form,
        filled: { value: true },
        name: { value: "", error: false },
        size: { value: "", error: false },
        damage: { value: "", error: false },
        quantity: { value: "", error: false },
        description: { value: "", error: false },
        price: { value: "", mask: "", error: false },
        type: { value: "", error: false, fillOption: response.types },
        style: { value: "", error: false, fillOption: response.styles },
        material: { value: "", error: false, fillOption: response.materials },
        thumb: { value: "", url: "" },
        files: [],
      })
      console.log('resp', response)
    }

    getData()
  }, [])

  const handleChangeFile = (files) => {
    let form2 = { ...form }

    for (let i = 0; i < files.length; i++) {
      let fr = new FileReader()
      fr.onload = (e) => {
        form2.files = [...form2.files, { value: files[i], url: e.target.result }]
      }
      fr.readAsDataURL(files[i])
    }
    console.log('form2', form2)
    setForm(form2)
  }

  const handleChangeThumb = (file) => {
    let form2 = { ...form }

    let fr = new FileReader()
    fr.onload = (e) => {
      form2.thumb = [...form2.thumb, { value: file, url: e.target.result }]
    }
    fr.readAsDataURL(file)

    setForm(form2)
  }

  const handleSizeChange = (item) => {
    setSize({ ...size, [item]: !size[item] })
    setForm({ ...form, size: { ...form.size, value: item, error: false } })
  }

  return (
    <>
      {form.filled &&
        <>
          <div className="row mb-4">
            <div className="col-md-6">
              <div style={{ height: 400, width: 400 }}>
                <FileDrop onDrop={(files, event) => handleChangeThumb(files[0])}>
                  <Button style={{ color: '#666666', width: '100%', height: '100%', padding: 0 }} component="label">
                    {!form.thumb.url &&
                      <Typography variant='p' style={{ color: '#666666' }}>Arraste ou escolha a capa do produtooo</Typography>}
                    {form.thumb.url &&
                      <img style={{ width: '100%', height: '100%', borderRadius: 5 }} alt='product' src={form.thumb.url ? form.thumb.url : `${URL}storage/products/no_product.jpg`}></img>}
                    <input hidden onChange={(e) => handleChangeThumb(e.target.files[0])} accept="image/*" multiple type="file" />
                  </Button>
                </FileDrop>
              </div>
            </div>

            <div className="col-md-6 rounded">
              
              <div className="d-flex flex-wrap">
                {form.files.map(item => {
                  console.log('item', item)
                  return (
                    <div className='bg-gray rounded m-2' style={{ width: 120, height: 120 }}>
                      <img className='img-fluid rounded' alt='file' src={item.url} />
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="col-12 my-3">
              <Button fullWidth sx={{ backgroundColor: '#e8e8e8' }} component="label">
                {<Typography variant='p' style={{ color: '#666666' }}>Escolha o restante das imagens</Typography>}
                <input hidden onChange={(e) => handleChangeFile(e.target.files)} accept="image/*" multiple type="file" />
              </Button>
              <Typography className='mt-2' variant='p'>Recomendamos o uso de imagens com 450p X 450px</Typography>
            </div>
          </div>

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

            <div className="col-sm-4">
              <div className="form-floating">
                <select id='style' className={`form-control ${form.style.error && 'is-invalid'}`} value={form.style.value}
                  onChange={(e) => setForm({ ...form, style: { ...form.style, value: e.target.value, error: false } })}>
                  {form.style.fillOption && form.style.fillOption.map(item => (<option key={item.id} value={item.id}>{item.name}</option>))}
                </select>
                <label htmlFor='style'>Estilo da roupa</label>
              </div>
            </div>

            <div className="col-sm-4">
              <div className="form-floating">
                <select id='material' className={`form-control ${form.material.error && 'is-invalid'}`} value={form.material.value}
                  onChange={(e) => setForm({ ...form, material: { ...form.material, value: e.target.value, error: false } })}>
                  {form.material.fillOption && form.material.fillOption.map(item => (<option key={item.id} value={item.id}>{item.name}</option>))}
                </select>
                <label htmlFor='material'>Material</label>
              </div>
            </div>
          </div>

          <div className="row my-3">
            <div className="col-sm-6">
              <div className="form-floating">
                <input className={`form-control ${form.name.error && 'is-invalid'}`} id="name" type="text" value={form.name.value}
                  onChange={({ target }) => setForm({ ...form, name: { ...form.name, value: target.value, error: false } })}
                  onBlur={() => setError('name', form, setForm)} required />
                <label htmlFor="name">Nome*</label>
              </div>
            </div>

            <div className="col-sm-4">
              <div className="form-floating">
                <input className={`form-control ${form.price.error && 'is-invalid'}`} id="price" type="text" value={form.price.mask}
                  onChange={({ target }) => setForm({ ...form, price: { ...form.price, value: target.value, mask: moneyMask(target.value), error: false } })}
                  onBlur={() => setError('price', form, setForm)} required />
                <label htmlFor="price">Preço*</label>
              </div>
            </div>

            <div className="col-sm-2">
              <div className="form-floating">
                <input className={`form-control ${form.quantity.error && 'is-invalid'}`} id="quantity" type="number" value={form.quantity.value}
                  onChange={({ target }) => setForm({ ...form, quantity: { ...form.quantity, value: target.value, error: false } })}
                  onBlur={() => setError('quantity', form, setForm)} required />
                <label htmlFor="quantity">Quantidade*</label>
              </div>
            </div>
          </div>

          <div className="row my-3">
            <div className="col-12">
              <div className="form-floating">
                <textarea className={`form-control ${form.description.error && 'is-invalid'}`} name="text" id="description" rows="10" value={form.description.value}
                  onChange={({ target }) => setForm({ ...form, description: { ...form.description, value: target.value, error: false } })}
                  onBlur={() => setError('description', form, setForm)} style={{ minHeight: 150 }} />
                <label htmlFor="description">Descrição*</label>
              </div>
            </div>

            {Object.keys({ ...size }).map((item, index) => (
              <div className="col-2 text-center rounded my-3" key={index}>
                <Button fullWidth color={size[item] ? 'success' : 'error'} sx={{ backgroundColor: '#f1f1f1' }} endIcon={size[item] ? <CheckIcon /> : <CloseIcon />}
                  onClick={() => handleSizeChange(item)}>
                  {item}
                </Button>
              </div>
            ))}

            <div className="col-12 mt-3">
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" />
                <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Possui avaria</label>
              </div>

              <div className="form-floating">
                <textarea className={`form-control ${form.damage.error && 'is-invalid'}`} name="text" id="description" rows="10" value={form.damage.value}
                  onChange={({ target }) => setForm({ ...form, damage: { ...form.damage, value: target.value, error: false } })}
                  onBlur={() => setError('damage', form, setForm)} style={{ minHeight: 150 }} />
                <label htmlFor="description">Avaria*</label>
              </div>
            </div>

            <Button onClick={handleSave}>Salvar</Button>
          </div>
        </>
      }
    </>
  )
}

export default FormProduct
