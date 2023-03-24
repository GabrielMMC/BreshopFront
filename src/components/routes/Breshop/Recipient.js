import React from "react";
import { CircularProgress, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { GET_FETCH, MOUNT_JSON_BODY, PATCH_FETCH, POST_FETCH, SEED_STATE, URL } from "../../../variables";
import Input from "../Form/Input";
import SavePreset from "../Form/SavePreset";

const Recipient = () => {
  const [loading, setLoading] = React.useState(false)
  const [loadingSave, setLoadingSave] = React.useState(false)
  const [edit, setEdit] = React.useState(false)
  const [id, setId] = React.useState(false)
  const token = useSelector(state => state.AppReducer.token);

  const [recipient, setRecipient] = React.useState({
    name: { label: 'Nome do Títular*', value: "", error: false, col: 'col-sm-6', type: 'text' },
    document: { label: 'CPF do Títular*', value: "", error: false, col: 'col-sm-6', type: 'cpf', },
    account_check_digit: { label: 'Código Conta*', value: "", error: false, col: 'col-sm-4', type: 'text', length: 2 },
    branch_check_digit: { label: 'Código Agência*', value: "", error: false, col: 'col-sm-4', type: 'text', length: 1 },
    account_number: { label: 'Número Conta*', value: "", error: false, col: 'col-sm-4', type: 'text', length: 13 },
    branch_number: { label: 'Número Agência*', value: "", error: false, col: 'col-sm-6', type: 'text', length: 4 },
    bank: { label: 'Código Banco*', value: "", error: false, col: 'col-sm-6', type: 'text', length: 3 },
  });

  React.useEffect(() => {
    getData()
  }, [])

  async function getData() {
    let response = await GET_FETCH({ url: `get_recipient`, token })
    console.log('resp', response)

    if (response.status) {
      let data = response.recipient

      let editData = SEED_STATE({ state: recipient, respState: [data, data.default_bank_account], setState: setRecipient, setId })

      if (editData) setEdit(true)
    }

    setLoading(false)
  }

  async function save(type) {
    setLoadingSave(true)
    let body = mountBody()
    let response

    if (type === 'update' || type === 'add') POST_FETCH({ url: `${URL}api/store_recipient`, body, token })
    if (response) setLoadingSave(false)
    setLoadingSave(false)
  }

  function mountBody() {
    let formBody = MOUNT_JSON_BODY({ form: recipient, id })
    return formBody
  }

  function renderInput(state, setState) {
    let keys = { ...state }
    keys = Object.keys(keys)

    return keys.map(item => (
      <div key={state[item].label} className={`${state[item].col} col-12 my-2 justify-content-center`}>
        <Input state={state} setState={(e) => setState(e)} item={item} edit={edit} />
      </div>
    ))
  }

  return (
    <div className="content mt-5 m-auto">
      {!loading ? <>
        <div className="row my-5">
          <Typography variant='h6'>Informações Bancárias</Typography>
          {renderInput(recipient, setRecipient)}
        </div>

        <SavePreset save={(e) => save(e)} loading={loadingSave} edit={edit} />
      </> : <div className="d-flex justify-content-center p-5"><CircularProgress /></div>}
    </div>
  );
}

export default Recipient