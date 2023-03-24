import React from 'react'
import { GET_FETCH } from '../../../variables';
import Input from '../../routes/Form/Input'
import { CircularProgress, Typography } from '@mui/material'

const Address = ({ token, address, setAddress }) => {
  const [addresses, setAddresses] = React.useState('');

  React.useEffect(() => {
    getAddresses()
    setAddress({
      zip_code: { label: 'CEP*', value: "", error: false, col: 'col-sm-6', type: 'cep' },
      state: { label: 'Estado*', value: "", error: false, col: 'col-sm-6', type: 'text', },
      city: { label: 'Cidade*', value: "", error: false, col: 'col-sm-12', type: 'text' },
      nbhd: { label: 'Bairro*', value: "", error: false, col: 'col-sm-4', type: 'text' },
      street: { label: 'Rua*', value: "", error: false, col: 'col-sm-4', type: 'text', },
      number: { label: 'Número*', value: "", error: false, col: 'col-sm-4', type: 'number' },
      filled: { value: true, hidden: true }
    })
  }, []);

  const getAddresses = async () => {
    const response = await GET_FETCH({ url: `list_addresses?page=1`, token });
    if (response.status) setAddresses(response.addresses.data);
  };

  function renderInput(state, setState) {
    let keys = { ...state }
    keys = Object.keys(keys)

    return keys.map((item, index) => (
      <div key={index} className={`${state[item].col} col-12 my-2 justify-content-center`}>
        <Input state={state} setState={setState} item={item} />
      </div >
    ))
  }

  return (
    <>
      {addresses ? (
        <>
          <div className="row">
            {addresses.map((item) => (
              <div key={item.id} className="col-12 d-flex mb-3 p-3 bg-gray rounded ms-1">
                <div className="me-3">
                  <Typography>{item.country} - {item.city} - {item.state}</Typography>
                  <Typography>{item.zip_code} - {item.line_1}</Typography>
                </div>

                <div className="ms-auto align-self-center">
                  <input type="radio" name="address" onChange={() => setAddress({ ...address, id: { value: item.id, hidden: true } })} />
                </div>
              </div>
            ))}
          </div>

          <div className='mt-5'>
            <Typography className='ms-1'>Selecione um endereço ou cadastre um agora!</Typography>
            <div className='anime-left row'>{address && renderInput(address, setAddress)}</div>
          </div>
        </>
      ) : (
        <div className="d-flex justify-content-center p-5">
          <CircularProgress />
        </div>
      )}
    </>
  )
}

export default Address