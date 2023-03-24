import React from "react"
import Box from "@mui/material/Box"
import Fade from "@mui/material/Fade"
import Modal from "@mui/material/Modal"
import { useSelector, useDispatch } from 'react-redux'
import Backdrop from "@mui/material/Backdrop"
import { useNavigate } from 'react-router-dom'
import CloseIcon from "@mui/icons-material/Close"
import { renderToast } from "../utilities/Alerts"
import { DELETE_FETCH, GET_FETCH, PUT_FETCH, STORAGE_URL } from "../../variables"
import { CircularProgress, IconButton, Button, Badge } from "@mui/material"
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { moneyMask } from "../utilities/masks/currency"
import characterLimitMask from "../utilities/masks/characterLimit"
import emptyBag from '../../assets/empty_bag.png'

// -------------------------------------------------------------------
//********************************************************************
// -------------------------Styles------------------------------------
// const style = {
//   // position: "absolute",
//   // left: "60%",
//   width: "%",
//   height: "100%",
//   bgcolor: "background.paper",
//   boxShadow: 24,
//   p: 4,
//   '@media(max-width: 1200px)': {
//     width: '90%',
//     left: '5%',
//   },
// };

const Cart = () => {
  const [loading, setLoading] = React.useState(true)
  const [products, setProducts] = React.useState([])
  const [timeoutId, setTimeoutId] = React.useState(null);

  const history = useNavigate()
  const dispatch = useDispatch()
  const token = useSelector(state => state.AppReducer.token)
  const toggled = useSelector(state => state.AppReducer.toggled)
  const notify = useSelector(state => state.AppReducer?.cart_items?.cart_items?.length)

  React.useEffect(() => {
    if (token) getData()
  }, [toggled])

  const getData = async () => {
    setLoading(true)
    const response = await GET_FETCH({ url: 'cart', token })
    // console.log('resp cart', response)

    if (response.status) {
      setProducts(response.cart_products)
      dispatch({ type: 'cart_items', payload: { cart_items: response.cart_products } })
    }
    else {
      renderToast({ type: 'error', error: response.message })
    }

    setLoading(false)
  }

  const handleQuantityChange = (value, id) => {
    if (value >= 0) {
      setProducts((oldProducts) => oldProducts.map(item => {
        if (item.product_id === id) item.quantity = value
        return item
      }))

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      setTimeoutId(() =>
        setTimeout(async () => {
          await PUT_FETCH({ url: 'cart/update', body: { product_id: id, quantity: value }, token })
        }, 750))
    }
  }

  const handleDelete = async (id) => {
    setProducts(products.filter(item => item.product_id !== id))
    DELETE_FETCH({ url: `cart/delete/${id}`, token })
  }

  const toggleOpen = () => {
    dispatch({ type: 'toggle_cart', toggled: !toggled })
    dispatch({ type: 'cart_items', payload: { cart_items: products } })
  }

  return (
    <>
      <Badge badgeContent={notify} color="error">
        <IconButton onClick={toggleOpen}>
          <ShoppingCartIcon sx={{ color: 'white' }} />
        </IconButton>
      </Badge>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={toggled}
        onClose={toggleOpen}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <div className='modal-content ms-auto slide-in-left'>
          <div className="row h-100">
            <div className="d-flex align-content-between flex-wrap">
              <div className="w-100">
                <div className="d-flex align-items-center">
                  <p className='dash-title'>Carrinho de compras</p>
                  <div className="ms-auto">
                    <IconButton onClick={toggleOpen}>
                      <CloseIcon />
                    </IconButton>
                  </div>
                </div>
                <hr className='mb-5' />
                {!loading ?
                  <>
                    {products.length !== 0 ?
                      products.map(item => (
                        <div key={item.product_id} className="row">
                          <div className="col-sm-3" style={{ position: "relative", display: "inline-block" }}>
                            <img src={STORAGE_URL + item?.thumb} alt="product" className='img-fluid' />
                            <button className='remove-button' onClick={() => handleDelete(item.product_id)}><CloseIcon fontSize='small' /></button>
                          </div>
                          <div className="col-sm-6">
                            <span>{characterLimitMask(item.name, 40)}</span>
                            <p className='small'>{characterLimitMask(item.description, 180)}</p>
                          </div>
                          <div className="col-sm-3">
                            <div className="d-flex input-group justify-content-end flex-nowrap">
                              <button onClick={() => handleQuantityChange(item.quantity - 1, item.product_id)} className='cart-button' style={{ borderRadius: '.4rem 0 0 .4rem' }}>-</button>
                              <input onChange={({ target }) => handleQuantityChange(target.value, item.product_id)} className='form-control text-center' type="text" style={{ maxWidth: '3rem' }} value={item.quantity} />
                              <button onClick={() => handleQuantityChange(item.quantity + 1, item.product_id)} className='cart-button' style={{ borderRadius: '0 .4rem .4rem 0' }}>+</button>
                            </div>
                            <p className='d-flex justify-content-end bold'>{moneyMask(item.price * item.quantity)}</p>
                          </div>
                        </div>
                      ))
                      :
                      <div className='row h-100'>
                        <div className='m-auto' style={{ width: '50%', height: '50%', margin: 'auto' }}>
                          <img className='img-fluid' src={emptyBag} />
                          <p className='dash-title text-center'>Sacola vazia...</p>
                          <p className='text-muted text-center'>Adicione produtos para ir à tela de pagamento</p>
                        </div>
                      </div>}
                  </>
                  : <div className='d-flex justify-content-center p-5'><CircularProgress /></div>}
              </div>

              <div className="ms-auto">
                <Button size='large' variant='contained' disabled={Boolean(products.length === 0)} onClick={() => history('/payment')} endIcon={<ShoppingCartCheckoutIcon />}>Ir para pagamento</Button>
              </div>
            </div>
          </div>
        </div>
      </Modal >
    </ >
  )
}

export default Cart