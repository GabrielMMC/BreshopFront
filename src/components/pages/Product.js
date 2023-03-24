import { Button, CircularProgress, Divider, Fade, Rating, ThemeProvider, Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { API_URL, POST_FETCH, URL } from '../../variables'
import Container from './Container'
import { useSelector, useDispatch } from 'react-redux'
import { MdClose } from 'react-icons/md'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'

const Product = () => {
  const [state, setState] = React.useState({
    shop: '',
    rating: 0,
    comment: '',
    product: '',
    loading: true,
    changeImg: true,
    imgSelected: '',
  })
  const [ratings, setRatings] = React.useState('')
  const [ratingsFilter, setRatingsFilter] = React.useState('')
  const [loadingCart, setLoadingCart] = React.useState(false)
  const params = useParams()
  const history = useNavigate()
  const dispatch = useDispatch()
  const token = useSelector(state => state.AppReducer.token)
  const user = useSelector(state => state.AppReducer.user)

  React.useEffect(() => {
    fetch(`${URL}api/get_public_product/${params.id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        // 'Content-Type': 'application/json',
      }
    })
      .then(async (response) => {
        const resp = await response.json();
        setState({ ...state, product: resp.product, loading: false, shop: resp.product.owner })
        setRatings(resp.product.owner.ratings); setRatingsFilter(resp.product.owner.ratings)
        console.log('product', resp)
      })
  }, [])

  function renderImages() {
    // setTimeout(() => { setState({ ...state, changeImg: false }) }, 200);
    return state.product.images.map(item => (
      <div className="col-sm-3 col-6 mt-2">
        <div onClick={() => { setState({ ...state, imgSelected: { id: item.id, file: item.file }, changeImg: !state.changeImg }) }} style={{ height: 100, cursor: 'pointer' }}>
          {item.file && <img style={{ width: '100%', height: '100%', borderRadius: 5, border: item.id === state.imgSelected.id && '2px solid yellow' }} alt='product' src={`${URL}storage/${item.file}`}></img>}
        </div>
      </div>
    ))
  }

  const submitComment = async (e) => {
    e.preventDefault()
    const response = await POST_FETCH({
      url: `${URL}api/store_rating`, token, body: { breshop_id: state.shop.id, comment: state.comment, rating: state.rating }
    })
    console.log('comment', response)
  }

  const getRating = (value) => {
    const rating = ratings.filter(item => item.rating === value).length
    return rating
  }

  const handleFilterRating = (value) => {
    console.log('ativou')
    const newRatings = ratings.filter(item => item.rating === value)
    if (value) setRatingsFilter(newRatings)
    else setRatingsFilter(ratings)
  }

  const handleAddCart = async () => {
    setLoadingCart(true)
    const response = await POST_FETCH({ url: `${API_URL}cart/create`, body: { product_id: state.product.id, quantity: 1 }, token })
    if (response?.status) {
      // window.scrollTo(0, 0)
      // dispatch({ type: 'cart_items', payload: { cart_items: response.cart_products } })
      dispatch({ type: 'toggle_cart', toggled: true })
    }
    setLoadingCart(false)
    console.log('resp', response)
  }

  return (
    <Container>
      <div className="m-auto bg-white mt-5 p-sm-5 m-5 rounded" style={{ maxWidth: 1200 }}>
        {!state.loading ?
          <div>
            <div className="row mx-3">
              <div className="col-md-6 col-12 m-auto my-2">
                <div className="col-12" style={{ minHeight: 350 }}>
                  <Fade in={state.changeImg}><img src={`${URL}storage/${state.imgSelected ? state.imgSelected.file : state.product.thumb}`} style={{ width: 400, height: 400, borderRadius: 10, transitionDuration: '0.5s' }} alt='product' /></Fade>
                </div>
                <div className="row">
                  {state.product && renderImages()}
                </div>
              </div>

              <div className="col-md-6 col-12">
                <Typography variant='h5'>{state.product.name}</Typography>
                <Typography variant='h4'>R$: {state.product.price}</Typography>
                <Typography variant='body1'>Descrição</Typography>
                <Typography variant='body2'>{state.product.description}</Typography>
                <Typography variant='body1'>Avaria</Typography>
                <Typography variant='body2'>{state.product.damage_description}</Typography>
              </div>
            </div>
            <Divider className='my-5' />
            <div className="row">
              <div className="col-6 m-auto">
                <div className="d-flex justify-content-center">
                  <div>
                    <img className='m-auto' style={{ width: 75, height: 75 }} src={`${URL}storage/photos/no_user.png`} alt="subject" />
                  </div>
                  <div>
                    <div className='d-flex mb-2'>
                      <Typography color="text.secondary">{state.shop.name}</Typography>
                      <Rating name="read-only" value={0} readOnly />
                    </div>
                    <div>
                      <Button variant='outlined' className='mx-2'>Chat</Button>
                      <Button variant='outlined'>Loja</Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <Typography color="text.secondary">Avaliações</Typography>
                <Typography color="text.secondary">Vendas</Typography>
                <Typography color="text.secondary">Comentarios</Typography>
              </div>
            </div>
            <Divider className='my-5' />

            {/* -------------------------Comments-Section------------------------- */}
            <div className="row">
              <div className="d-flex justify-content-center mb-5">
                <Typography color="text.secondary" variant='h5'>Comentários da Loja</Typography>
              </div>

              {ratings.length > 0 ?
                <>
                  <div className="mb-5">
                    <span className="lead ms-2">Filtrar por:</span>
                    <span className="lead ms-2" onClick={() => handleFilterRating("1")}>Uma estrela ({getRating("1")}), </span>
                    <span className="lead ms-2" onClick={() => handleFilterRating("2")}>Duas estrelas ({getRating("2")}), </span>
                    <span className="lead ms-2" onClick={() => handleFilterRating("3")}>Três estrelas ({getRating("3")}), </span>
                    <span className="lead ms-2" onClick={() => handleFilterRating("4")}>Quatro estrelas ({getRating("4")}), </span>
                    <span className="lead ms-2" onClick={() => handleFilterRating("5")}>Cinco estrelas ({getRating("5")})</span>
                    <div className="d-flex align-items-center" onClick={() => handleFilterRating(null)}>
                      <span className='lead ms-2' style={{ color: '#FF0000' }}>Eliminar filtro</span>
                      <MdClose color='red' />
                    </div>
                  </div>

                  {ratingsFilter.map(item => (
                    <div className="row  my-3" key={item.id}>
                      <div className="d-flex justify-content-start">
                        <div>
                          <img className='m-auto' style={{ width: 75, height: 75 }}
                            src={`${URL}storage/photos/${item.user.file ? item.user.file : 'no_user.png'}`} alt="subject" />
                        </div>
                        <div className='ms-2'>
                          <Typography className='ms-1' color="text.secondary">{item.user.name}</Typography>
                          <Rating value={item.rating} />
                        </div>
                      </div>

                      <div className="col-12">
                        <Typography>{item.comment}</Typography>
                      </div>
                    </div>
                  )
                  )}
                </> : <Typography>Loja sem nenhum comentário registrado</Typography>}

              {/* -------------------------Do-a-comment-Section------------------------- */}
              <div className='col-12 my-5'>
                <div className="d-flex justify-content-start">
                  <div>
                    <img className='m-auto' style={{ width: 75, height: 75 }} src={`${URL}storage/photos/${user.file ? user.file : 'no_user.png'}`} alt="subject" />
                  </div>
                  <div className='ms-2'>
                    <Typography className='ms-1' color="text.secondary">{user.name}</Typography>
                    <Rating value={state.rating} onChange={(e, value) => setState({ ...state, rating: value })} />
                  </div>
                </div>
                <form className="input-group" onSubmit={(e) => submitComment(e)}>
                  <input type='area' className="mt-1 comment-input" value={state.comment} onChange={({ target }) => setState({ ...state, comment: target.value })} />
                  <Button type='submit'>Enviar</Button>
                </form>
              </div>
            </div>

            {/* -------------------------Buttons-Section------------------------- */}
            <div className="row mt-5">
              <div className="d-flex mt-3">
                <div className="justify-content-start">
                  <Button variant='contained'>Voltar</Button>
                </div>

                <div className="ms-auto">
                  <LoadingButton variant='contained' className='mx-2' onClick={handleAddCart} endIcon={<ShoppingCartIcon />} loading={loadingCart} loadingPosition="end">Adicionar ao carrinho</LoadingButton>
                </div>
              </div>
            </div>
          </div>
          :
          <div className="p-5 d-flex justify-content-center">
            <CircularProgress />
          </div>
        }
      </div>
    </Container>
  )
}

export default Product