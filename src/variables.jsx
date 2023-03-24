import { useSelector } from "react-redux";

export const URL = "http://localhost:8000/"
export const THIS_URL = "http://localhost:3000/"

// export const URL = "https://bmtestapi.enterscience.com.br/"
// export const THIS_URL = "https://bmtest.enterscience.com.br/"

export const API_URL = URL + "api/";
export const STORAGE_URL = URL + "storage/";

export function VALIDATE(props) {
  let state2 = { ...props.state }
  let keys = Object.keys(state2)
  let valid = true

  keys.forEach(item => {
    if (item !== 'id' && state2[item].value === '') { state2[item].error = true; valid = false }
  })

  props.setState(state2)
  return valid
}

export function MOUNT_FORM_DATA(props) {
  let data = new FormData()
  let array = [...props.form]

  array.forEach(item => {
    let obj = { ...item }
    let keys = Object.keys(obj)

    keys.forEach(item2 => {
      data.append(`${item2}`, obj[item2].value)
    })
  })

  if (props.id) data.append('id', props.id)
  return data
}

export function MOUNT_JSON_BODY(props) {
  let body = {}
  let keys = { ...props.form }

  keys = Object.keys(keys)
  keys.forEach(item => {
    body = { ...body, [item]: props.form[item].value }
  })

  if (props.id) body = { ...body, id: props.id }
  return body
}

export async function POST_FETCH_FORMDATA(props) {
  return (fetch(props.url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${props.token}`
    },
    body: props.body
  }).then(async (response) => {
    const resp = await response.json()
    return resp
  })
  )
}

export async function POST_FETCH(props) {
  return (fetch(props.url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${props.token}`
    },
    body: JSON.stringify({ ...props.body })
  }).then(async (response) => {
    const resp = await response.json()
    return resp
  })
  )
}

export async function PUT_FETCH(props) {
  return (fetch(`${URL}api/${props.url}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${props.token}`
    },
    body: JSON.stringify({ ...props.body })
  }).then(async (response) => {
    if (response.status !== 200) return false
    else return await response.json()
  })
  )
}

export async function PATCH_FETCH_FORMDATA(props) {
  return (fetch(`${URL}api/${props.url}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${props.token}`
    },
    body: props.body
  }).then(async (response) => {
    const resp = await response.json()
    return resp
  })
  )
}

export async function PUT_FETCH_FORMDATA(props) {
  return (fetch(`${URL}api/${props.url}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${props.token}`
    },
    body: props.body
  }).then(async (response) => {
    const resp = await response.json()
    return resp
  })
  )
}

export async function PATCH_FETCH(props) {
  return (fetch(props.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${props.token}`
    },
    body: JSON.stringify({ ...props.body })
  }).then(async (response) => {
    const resp = await response.json()
    return resp
  })
  )
}

export async function DELETE_FETCH(props) {
  return (fetch(`${URL}api/${props.url}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${props.token}`
    }
  }).then(async (response) => {
    const resp = await response.json()
    return resp
  })
  )
}

export async function POST_PUBLIC_FETCH(props) {
  console.log('props', props.body)
  return (fetch(props.url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...props.body })
  }).then(async (response) => {
    const resp = await response.json()
    return resp
  })
  )
}

export async function GET_FETCH(props) {
  return (fetch(`${URL}api/${props.url}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${props.token}`
    }
  }).then(async (response) => {
    const resp = await response.json()
    return resp
  })
  )
}

export async function GET_PUBLIC_FETCH(props) {
  return (fetch(props.url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  }).then(async (response) => {
    const resp = await response.json()
    return resp
  })
  )
}

export function SEED_STATE(props) {
  if (props.state) {
    let state2 = { ...props.state }
    let keys = Object.keys({ ...props.state })
    keys.forEach(item => {
      if (Array.isArray(props.respState)) {
        //If the resp state props be an array
        props.respState.forEach(resp => {
          console.log('teste', props)
          if (state2[item].value !== undefined && resp[item]) state2[item].value = resp[item]
          if (state2[item].mask !== undefined && resp[item]) state2[item].mask = resp[item]
          if (state2[item].url !== undefined && resp[item]) state2[item].url = resp[item]
        })
      } else {
        //If the resp state props not be an array
        if (state2[item].value !== undefined) state2[item].value = props.respState[item]
        if (state2[item].mask !== undefined) state2[item].mask = props.respState[item]
        if (state2[item].url !== undefined) state2[item].url = props.respState[item]
      }


      //If the type of input has date
      if (state2[item].type === 'date' && props.respState[item]) {
        let array = Array.from(props.respState[item])
        const date = array.splice(0, 10).toString().replace(/,/g, "")
        state2[item].value = date + 'T00:00:00.000'
        state2[item].date = date
      }
    })

    if (props.setId) props.setId(props.respState.id)
    console.log('seed state', state2)
    props.setState(state2)
    return true
  } else {
    return false
  }
}

export const GET_CEP = (value) => {
  const response = fetch(`https://viacep.com.br/ws/${value}/json/`)
    .then(async (json) => {
      const data = await json.json();

      if (data.hasOwnProperty("erro")) {
        // clearCEP();
        return "error";
      } else {
        return data;
      }
    })
    .catch((error) => {
      return error;
      // clearCEP();
      // setState({
      //   ...state,
      //   [item]: { ...state[item], value: "", error: true },
      // });
      // renderToast({ type: "error", error: "CEP inválido!" });
    });
  return response;
};