import React from "react";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Button, Typography, IconButton, CircularProgress, } from "@mui/material";
import { DELETE_FETCH, GET_CEP, GET_FETCH, POST_FETCH, API_URL } from "../../../variables";
import { useSelector } from "react-redux";
import { renderAlert, renderToast } from "../../utilities/Alerts";
import SavePreset from "../../routes/Form/SavePreset";

const Address = () => {
  // -------------------------------------------------------------------
  //********************************************************************
  // -------------------------States------------------------------------
  const [loading, setLoading] = React.useState(true)
  const [loadingSave, setLoadingSave] = React.useState(false)

  const [id, setId] = React.useState("")
  const [cep, setCep] = React.useState("")
  const [nbhd, setNbhd] = React.useState("")
  const [complement, setComplement] = React.useState("")
  const [data, setData] = React.useState("")
  const [city, setCity] = React.useState("")
  const [state, setState] = React.useState("")
  const [street, setStreet] = React.useState("")
  const [number, setNumber] = React.useState("")

  const [hasNumber, setHasNumber] = React.useState(true)
  const [shippingAddress, setShippingAddress] = React.useState({ residencial: true, commercial: false })
  const [add, setAdd] = React.useState("")

  const history = useNavigate()
  const token = useSelector(state => state.AppReducer.token)

  React.useEffect(() => {
    getData()
  }, [])

  // -----------------------------------------------------------------
  //******************************************************************
  // -------------------------Getting-data----------------------------
  const getData = async () => {
    const resp = await GET_FETCH({ url: `addresses`, token });
    console.log("address", resp);

    //Setting the addresses and shipping addresses accordingly with data length
    if (resp.status) { setData(resp.addresses); setShippingAddress(() => resp.addresses.length === 0 ? false : true) }
    else renderToast({ type: 'error', error: 'Erro ao buscar endereços, tente novamente mais tarde!' })

    setLoading(false);
  };

  // -----------------------------------------------------------------
  //******************************************************************
  // -------------------------Saving-data-----------------------------
  const handleSave = async (e) => {
    setLoadingSave(true); e.preventDefault()
    let response = false
    // if it has an id set in the status it means that it is an address edition
    if (id) {
      response = await POST_FETCH({
        url: `${API_URL}addresses/update`, token, body: {
          state, city, street, number, id, zip_code: cep, neighborhood: nbhd, shipping_address: shippingAddress, complement
        }
      })

      // Separating toasts according to the status of the request
      if (response.status) renderToast({ type: 'success', error: 'Endereço atualizado com sucesso!' })
      else renderToast({ type: 'error', error: 'Erro ao atualizar endereço, tente novamente mais tarde!' })

      // if it does not have an id defined in the status it means that it is an address creation
    } else {
      response = await POST_FETCH({
        url: `${API_URL}addresses/create`, token, body: {
          state, city, street, number, id, zip_code: cep, neighborhood: nbhd, shipping_address: shippingAddress, complement
        }
      })

      // Separating toasts according to the status of the request
      if (response.status) renderToast({ type: 'success', error: 'Endereço salvo com sucesso!' })
      else renderToast({ type: 'error', error: 'Erro ao salvar endereço, tente novamente mais tarde!' })
    }

    // finally if there is no error, the function to get the data is called
    if (response.status || !response.status) { setLoadingSave(false); setAdd(false); clearFields(); getData(); }
  };

  // -----------------------------------------------------------------
  //******************************************************************
  // -------------------------Editing-data----------------------------
  const handleEdit = async (item) => {
    console.log('iem', item)
    let line = item.line_1.split(',')
    setAdd(true); setHasNumber(line[0] ? true : false); setCep(item.zip_code.replace(/(\d{5})(\d{3})/g, '$1-$2')); setCity(item.city); setState(item.state); setComplement(item?.line_2)
    setNumber(line[0]); setNbhd(line[1]); setStreet(line[2]); setId(item.id)
  };

  // -----------------------------------------------------------------
  //******************************************************************
  // -------------------------Deleting-data---------------------------
  const handleDelete = async (id) => {
    setLoading(true)
    let response = await DELETE_FETCH({ url: `addresses/delete/${id}`, token })
    setAdd(false); clearFields(); getData()
  }


  // -----------------------------------------------------------------
  //******************************************************************
  // -------------------------Other-functions-------------------------
  const handleCEPChange = async (value) => {
    value = value.replace(/\D/g, '')

    // The value is converted into an array and if its size is equal to eight, the postal code search function is activated
    if (Array.from(value).length === 8) {
      const resp = await GET_CEP(value)
      setState(resp.uf); setCity(resp.localidade); setNbhd(resp.bairro); setStreet(resp.logradouro)
    }
    // If the value is less than eight, the mask is applied
    if (Array.from(value).length <= 8) setCep(value.replace(/(\d{5})(\d{3})/g, '$1-$2'))
  }

  //Function to show fields and clear them
  const handleAdd = () => {
    setAdd(!add); clearFields(); setShippingAddress({ residencial: true, commercial: false }); setHasNumber(true)
  };

  //Function to clear fields
  const clearFields = () => { setCep(''); setCity(''); setState(''); setNumber(''); setNbhd(''); setStreet(''); setId('') }

  return (
    <>
      {!loading ? (
        <>
          {/* -------------------------Personal-address-section------------------------- */}
          <div className="row">
            <h6 className="dash-title">Endereços</h6>
            {/* Counter of shipping addresses and personal addresses */}
            {data.length > 0 ? (data.map((item) => (
              <div key={item.id} className="col-md-12 my-2 d-flex mb-3 p-3 bg-gray rounded">
                <div className="me-3">
                  <Typography>{item.country} - {item.city} - {item.state}</Typography>
                  <Typography>{item.zip_code} - {item.line_1}</Typography>
                </div>
                <div className="ms-auto" style={{ whiteSpace: "nowrap" }}>
                  <IconButton onClick={() => handleEdit(item)}><EditIcon /></IconButton>
                  {data.length != 1 && <IconButton onClick={() =>
                    renderAlert({ id: item.id, item: 'endereço', article: 'o', deleteFunction: handleDelete })}><CloseIcon /></IconButton>}
                </div>
              </div>
            )
            )
            ) : (<div><h6 className="dash-title">Sem endereços cadastrados</h6></div>)}
          </div>
        </>
      ) : (
        <div className="d-flex justify-content-center p-5"><CircularProgress color='inherit' /></div>
      )}
      {/* -------------------------Address-fields------------------------- */}
      <div className="row">
        <div className="d-flex align-items-center mt-5">
          <h6 className="dash-title">Adicionar endereço</h6>
          <button onClick={handleAdd} className='rounded-button hvr-grow ms-2 d-flex align-items-center justify-content-center'>
            {add ? <DeleteIcon size={15} /> : <AddIcon size={20} />}
          </button>
        </div>
      </div>

      {add &&
        <form className='anime-left' onSubmit={(e) => { handleSave(e) }}>
          <div className="row align-items-end">
            {/* -------------------------CEP------------------------- */}
            <div className="col-md-4 my-2">
              <div className="form-floating">
                <input className="form-control" id="cep" type="text" disabled={id && true} value={cep} onChange={({ target }) => handleCEPChange(target.value)} required />
                <label htmlFor="cep">CEP*</label>
              </div>
            </div>
            {/* -------------------------State------------------------- */}
            <div className="col-md-4 my-2">
              <div className="form-floating">
                <input className="form-control" id="state" type="text" disabled={id && true} value={state} onChange={({ target }) => setState(target.value)} required />
                <label htmlFor="state">Estado*</label>
              </div>
            </div>
            {/* -------------------------City------------------------- */}
            <div className="col-md-4 my-2">
              <div className="form-floating">
                <input className="form-control" id="city" type="text" disabled={id && true} value={city} onChange={({ target }) => setCity(target.value)} required />
                <label htmlFor="city">Cidade*</label>
              </div>
            </div>
          </div>
          {/* -------------------------Neighborhood------------------------- */}
          <div className="row mt-4">
            <div className="col-md-6 my-2">
              <div className="form-floating">
                <input className="form-control" id="nbhd" type="text" disabled={id && true} value={nbhd} onChange={({ target }) => setNbhd(target.value)} required />
                <label htmlFor="nbhd">Bairro*</label>
              </div>
            </div>
            {/* -------------------------Complement------------------------- */}
            <div className="col-md-6 my-2">
              <div className="form-floating">
                <input className="form-control" id="complement" type="text" value={complement} onChange={({ target }) => setComplement(target.value)} />
                <label htmlFor="complement">Complemento</label>
              </div>
            </div>
          </div>

          <div className="row mt-4">
            {/* -------------------------Street------------------------- */}
            <div className="col-md-5 my-2">
              <div className="form-floating">
                <input className="form-control" id="street" type="text" disabled={id && true} value={street} onChange={({ target }) => setStreet(target.value)} required />
                <label htmlFor="street">Rua*</label>
              </div>
            </div>
            {/* -------------------------Number------------------------- */}
            <div className="col-md-7 my-2">
              <div className="d-flex">
                <div className="form-floating">
                  <input className="form-control" id="number" type="number" disabled={id && true} value={number} onChange={({ target }) => setNumber(target.value)} required={hasNumber} />
                  <label htmlFor="number">Número{hasNumber && '*'}</label>
                </div>

                <div className="form-check ms-3">
                  <input className="form-check-input" type="checkbox" value={!hasNumber} checked={!hasNumber} onChange={() => setHasNumber(!hasNumber)} id="flexCheckDefault" />
                  <label className="form-check-label" htmlFor="flexCheckDefault">
                    Sem número
                  </label>
                </div>
              </div>
            </div>
          </div>
          {/* -------------------------Buttons-section------------------------- */}
          <SavePreset backPath={'/profile'} handleSave={handleSave} loading={loadingSave} />
        </form>}
      {!add && <div className='anime-right mt-2'><Typography>Cadastre endereços para começar!</Typography></div>}
    </>
  );
};

export default Address;
