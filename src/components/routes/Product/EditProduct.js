import React from 'react'
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { URL } from '../../../variables';
import { CircularProgress, ThemeProvider } from '@mui/material';
import AddProduct from './AddProduct';
import Theme from '../Theme/Theme';

const EditProduct = () => {
  const params = useParams()
  const id = params.id
  const [state, setState] = React.useState({
    data: {},
    redirect: false,
  })
  const token = useSelector(state => state.AppReducer.token);

  React.useEffect(() => {
    if (id !== null) {
      fetch(`${URL}api/get_product/${id}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Authorization': `Bearer ${token}`,
          // 'Content-Type': 'application/json',
        }
      })
        .then(async (response) => {
          console.log(response)
          const json = await response.json();
          console.log(json)
          return json;
        }).then(async (json) => {
          setState({ ...state, data: json, redirect: true })
        });
    }
  }, [id]);
  return (
    <>
      <ThemeProvider theme={Theme}>
        <div className="d-flex justify-content-center m-5 p-5">
          {!state.redirect && <CircularProgress />}
        </div>
        {state.redirect && <AddProduct edit={state.data} />}
      </ThemeProvider>
    </>
  )
}

export default EditProduct