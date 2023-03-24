import React from 'react'
import Methods from './Methods'
import UserData from './UserData'
import Addresses from './Addresses'
import Container from '../Container'
import ChargeModal from './ChargeModal'
import { LoadingButton } from '@mui/lab'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { MdClose, MdCheck } from 'react-icons/md'
import { renderToast } from '../../utilities/Alerts'
import { splitNumber } from '../../utilities/masks/phone'
import { moneyMask } from '../../utilities/masks/currency'
import { getInterest } from '../../utilities/Installments'
import { API_URL, POST_FETCH, STORAGE_URL } from '../../../variables'
import { Typography, CircularProgress, Skeleton } from '@mui/material'
import './styles.css';

const PaymentScreen = () => {
  // -------------------------------------------------------------------
  //********************************************************************
  // -------------------------States------------------------------------
  const [total, setTotal] = React.useState('')
  const [pendent, setPendent] = React.useState('')
  const [interest, setInterest] = React.useState('')
  const [loadingSave, setLoadingSave] = React.useState(false)
  const [loadingShipping, setLoadingShipping] = React.useState(true)
  const [shippingsTotal, setShippingsTotal] = React.useState([])

  //Each state will be filled in its section
  const [user, setUser] = React.useState('')
  const [card, setCard] = React.useState('')
  const [method, setMethod] = React.useState('')
  const [address, setAddress] = React.useState('')
  const [charge, setCharge] = React.useState('')

  const [cartItems, setCartItems] = React.useState('')
  const [errors, setErrors] = React.useState({ address: false, payment: false, user: false })

  const token = useSelector(state => state.AppReducer.token)
  // if (!cartItems) setCartItems([])

  const history = useNavigate()
  // console.log('cart_items', cartItems)

  // -----------------------------------------------------------------
  //******************************************************************
  // -------------------------Getting-data----------------------------
  React.useEffect(() => {
    if (cartItems.length > 0) {
      let tt = 0
      //Object to filter and group sales products
      let shipping = {
        temp: [],
        result: []
      }

      cartItems.forEach(item => {
        //Sum of price with discount and quantity
        // tt += ((item.price * (100 - item.discount_price)) * (item.quantity ? item.quantity : 1))
        tt += ((item.price * item.quantity))

        // Shipping.temp does not contain the promotion id, it is added and created an item object within shipping.result
        // if (!shipping.temp.includes(item.provider_sale_id)) {
        //   //Adding delivery price to total
        //   tt += Number(item.delivery_price.replace('.', ''))
        //   shipping.temp.push(item.provider_sale_id)
        //   shipping.result.push({ description: item.sale.name, amount: item.delivery_price, id: item.product_id })
        // }
      })
      //Setting states
      setTotal(tt)
      setInterest(getInterest("1", tt))
      setShippingsTotal(shipping.result)
      //Creating objects with total value in case the multipayment option is chosen
      setPendent([{ value: tt, total: 0 }, { value: tt, total: 0 }])
      setLoadingShipping(false)
    }
  }, [cartItems])

  // -----------------------------------------------------------------
  //******************************************************************
  // -------------------------Saving-data-----------------------------
  const handleSave = async () => {
    let errorPayment = false
    //validating the payment section, case has empty or wrong values is returned true for error variable
    if (method == 'credit_card' || method == 'debit_card' || method == 'multi_payment') {
      errorPayment = !verifyData(card, setCard, true)
      Object.keys(card).forEach(item => { if (card[item].error && !card.id) errorPayment = true })
    }

    //validating the address section, case has empty or wrong values is returned true for error variable
    let errorAddress = !verifyData(address, setAddress, true)
    Object.keys(address).forEach(item => { if (address[item].error && !address.id) errorAddress = true })

    //validating the user section, case has empty or wrong values is returned true for error variable
    let errorUser = !verifyData(user, setUser, true)
    Object.keys(user).forEach(item => { if (user[item].error && !user?.id) errorUser = true })


    //validating the multi payment section, case has empty or wrong values is returned true for error variable
    if (method === 'multi_payment') {
      if (Number(card[0].amount.value) + Number(card[1].amount.value) !== total) {
        console.log('teste', total, Number(card[0].amount.value) + Number(card[1].amount.value))
        errorPayment = true
        renderToast({ type: 'error', error: 'Verifique o saldo utilizado no multi pagamento!' })
      }
    }

    setErrors({ address: errorAddress, payment: errorPayment, user: errorUser })

    //If does not have errors, the backend objects will be monted
    if (!errorAddress && !errorPayment && !errorUser) {
      let items = []
      let cardBody = {}
      let customer = {}
      let addressBody = {}
      setLoadingSave(true)

      //Items object
      cartItems.forEach(item => {
        items = [...items, {
          "id": item.product_id,
          "breshop_id": item.breshop_id,
          "description": item.description,
          "shipping_amount": item.delivery_price,
          "quantity": item.quantity ? item.quantity : 1,
          "amount": Number(item.price),
        }]
      })

      //Separating each key from the object and assigning them their value, ex: {number: {value: '10'}} to {number: '10'}
      Object.keys(card).forEach(item => { cardBody = { ...cardBody, [item]: card[item].value } })
      Object.keys(user).forEach(item => { customer = { ...customer, [item]: user[item].value } })
      Object.keys(address).forEach(item => { addressBody = { ...addressBody, [item]: address[item].value } })

      //Spliting the area code from number
      const { area, numb } = splitNumber(user.phone)
      customer = { ...customer, area, number: numb }

      let payment = {}
      let shipping = {}
      let shippingAmount = 0
      shippingsTotal.forEach(item => shippingAmount += Number(item.amount.replace('.', '')))

      //Creating shipping object according to the filled fields or id
      if (address.id) addressBody = address.addressObj
      shipping = {
        "address_id": addressBody?.id,
        "amount": shippingAmount,
        "address": {
          ...addressBody
        }
      }

      //If the payment method chosen is credit, debit or multi payment, the object created will be different
      if (method === 'credit_card' || method === 'debit_card' || method === 'multi_payment') {
        //if card is array it means that the method is multi payment, then it will have to be created with foreach
        if (Array.isArray(card)) {
          payment = []
          cardBody = []
          //Tranforming each key in value
          card.forEach((object, index) =>
            Object.keys(object).forEach(key =>
              cardBody[index] = { ...cardBody[index], [key]: object[key].value }
            ))

          //Creating the array according to filled inputs or card id
          cardBody.forEach(item => item.id ?
            //Card id structure
            payment = [
              ...payment, {
                "card_id": item.id,
                "card": { ...item },
                "amount": item.amount,
                "payment_method": 'credit_card',
                "installments": item.installments,
              }] :
            //Filled inputs structure
            payment = [
              ...payment, {
                "card": { ...item },
                "amount": item.amount,
                "payment_method": 'credit_card',
                "installments": item.installments,
              }])

        } else {
          //Creating the object according to filled inputs or card id, but not with card array
          payment = cardBody.id ? {
            //Card id structure
            "card_id": cardBody.id,
            "card": cardBody,
            "payment_method": method,
            "installments": cardBody.installments
          } : {
            //Filled inputs structure
            "card": cardBody,
            "payment_method": method,
            "installments": cardBody.installments,
          }
        }
      }
      //If the payment method chosen is pix or bill
      else payment = { "payment_method": method }

      //Request with objects and methods created above
      const typePayment = method === 'multi_payment' ? 'multi_payment' : 'payment'
      const response = await POST_FETCH({ url: `${API_URL}orders/create`, body: { items, shipping, customer, [typePayment]: payment }, token })
      // console.log('response', response)

      //If it work, will be opened the payment modal if the method was pix or bill
      if (response.status) {
        if (method === 'pix' || method === 'boleto') {
          setCharge(response.order.charges[0].last_transaction)
        }
        else {
          renderToast({ type: 'success', error: 'Pedido gerado com sucesso!' });
          history('/profile/orders')
        }
      }

      else renderToast({ type: 'error', error: response.message })
      setTimeout(setLoadingSave(false), 2000)

    } else {
      console.log('errors', { address: errorAddress, payment: errorPayment, user: errorUser }, address)
    }

  }

  // -----------------------------------------------------------------
  //******************************************************************
  // -------------------------Other-functions-------------------------
  //Validating data from each item state passed as parameter
  const verifyData = (state, setState, setError) => {
    let valid = true
    //If state is array it means that is multi payment card
    if (Array.isArray(state)) {
      let state2 = [...state]
      let cardOneId = false; let filledOne = false
      let cardTwoId = false; let filledTwo = false

      //Validating every key from each object
      state2.forEach(object => {
        Object.keys(object).forEach(key => {
          //if does not exist id and value is empty or to small according to length, will return error
          if (!object.id && (!object[key].value || (object[key].length ? Array.from(object[key].value).length < object[key].length : false))) {
            valid = false
            if (setError && !object.id) object[key].error = true
          }
        })
      })

      if (setError) setState(state2)
      //Separating the structure of each saved card to validate whether it was chosen with ids or filling fields
      if (state2[0].id) cardOneId = true; if (state2[0].filled) filledOne = true
      if (state2[1].id) cardTwoId = true; if (state2[1].filled) filledTwo = true
      if (cardOneId && cardTwoId) valid = true
      if (filledOne && filledTwo) return valid
      else return false

    } else {
      //If state is not an array
      let state2 = { ...state }

      //Validating every key from each object
      Object.keys(state).forEach(item => {
        //if does not exist id and value is empty or to small according to length, will return error
        if (!state[item].value || (state[item].length ? Array.from(state[item].value).length < state[item].length : false)) {
          valid = false

          if (setError && !state.id) state2[item].error = true
        }
      })

      if (setError) setState(state2)
      //Separating the structure of each saved state to validate whether it was chosen with ids or filling fields
      if (state.id) valid = true
      if (state.filled) return valid
      else return false
    }
  }

  //Mounting return from address selected or filled in address section to confirmation section
  const getAddress = () => {
    if (address.filled) {
      //If it has addressObj, it means it was chosen
      if (address.addressObj) {
        return address.addressObj.zip_code + ' - ' + address.addressObj.line_1
      }
      //Else it means that was filled
      if (address.zip_code.value && address.number.value && address.nbhd.value && address.street.value) {
        return address.zip_code.value + ' - ' + address.number.value + ', ' + address.nbhd.value + ', ' + address.street.value
      }
    }
  }

  return (
    <Container>
      <div className="box">
        <div className="row">

          <div className="col-lg-9 col-12 p-4 divider">
            <p className='dash-title'>Dados do pagamento</p>
            <hr />

            {/* --------------------------Address-Section-------------------------- */}
            <div className="accordion" id="accordionExample">
              <div>
                <h2 className="accordion-header" id="headingOne">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                    <span>Endereço de entrega</span>
                    {verifyData(address, false)
                      ? <MdCheck size={20} color='#4BB543' />
                      : <MdClose size={20} color='#FF0000' />}
                    {errors.address && <span className='small ms-2' style={{ color: '#FF0000' }}>Verifique todos os campos!</span>}
                  </button>
                </h2>
                <div id="collapseOne" className='accordion-collapse collapse' aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                  <div className="accordion-body">
                    <Addresses address={address} setAddress={setAddress} />
                  </div>
                </div>
                <hr />
              </div>

              {/* --------------------------Payment-Section-------------------------- */}
              <div>
                <h2 className="accordion-header" id="headingTwo">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                    <span>Formas de pagamento</span>
                    {(method === 'credit_card' || method === 'debit_card' || method === 'multi_payment') && (verifyData(card, false)
                      ? <MdCheck size={20} color='#4BB543' />
                      : <MdClose size={20} color='#FF0000' />
                    )}
                    {(method !== 'credit_card' && method !== 'debit_card' && method !== 'multi_payment') && (method !== ''
                      ? <MdCheck size={20} color='#4BB543' />
                      : <MdClose size={20} color='#FF0000' />
                    )}
                    {errors.payment && <span className='small ms-2' style={{ color: '#FF0000' }}>Verifique todos os campos!</span>}
                  </button>
                </h2>
                <div id="collapseTwo" className='accordion-collapse collapsing' aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                  <div className="accordion-body">
                    <Methods card={card} setCard={setCard} method={method} setMethod={setMethod} total={total} pendent={pendent} setPendent={setPendent} setInterest={setInterest} />
                  </div>
                </div>
              </div>
              <hr />

              {/* --------------------------Group-Section-------------------------- */}
              <div>
                <h2 className="accordion-header" id="headingThree">
                  <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="true" aria-controls="collapseThree">
                    <span>Dados Gerais</span>
                    {verifyData(user, false)
                      ? <MdCheck size={20} color='#4BB543' />
                      : <MdClose size={20} color='#FF0000' />}
                    {errors.user && <span className='small ms-2' style={{ color: '#FF0000' }}>Verifique todos os campos!</span>}
                  </button>
                </h2>
                <div id="collapseThree" className='accordion-collapse collapse show' aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                  <div className="accordion-body">
                    <UserData user={user} setUser={setUser} setCart={setCartItems} />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* --------------------------Products-Section-------------------------- */}
          <div className='d-flex align-content-between flex-wrap col-lg-3 p-4'>
            <div className='w-100'>
              <Typography>Produtos do carrinho</Typography>
              {console.log('cart', cartItems)}
              {!loadingShipping ?
                cartItems.map(item => (
                  <div className='product' key={item.id}>
                    <div className="d-flex">
                      <div className='rounded' style={{ minWidth: '40%', minHeight: '40%', maxWidth: 150 }}>
                        <img src={`${STORAGE_URL + item.thumb}`} className='img-fluid' alt="product" />
                      </div>
                      <span className='small m-auto'>{item.description}</span>
                    </div>

                    <div className='d-flex justify-content-around'>
                      <span className='small'>{item.name}</span>
                      <span className="small">{moneyMask(item.price)} x {item.quantity}Un</span>
                    </div>

                  </div>
                ))
                : <Skeleton className='product' variant="rectangular" height={100} />}
            </div>

            {/* --------------------------Shipping-Section-------------------------- */}
            <div className='m-1 row'>
              {!loadingShipping ?
                <>
                  <div className="row">
                    <span className='col-12'>Entregas das promoções:</span>
                    <span className='small col-12'>{getAddress()}</span>
                  </div>
                  <div className="row">
                    {shippingsTotal.map(item => (
                      <span className='small col-12' key={item.id}>{item.description}: {moneyMask(item.amount)}</span>
                    ))}
                  </div>
                </>
                :
                <div className="row">
                  <Skeleton className='rounded' variant="rectangular" />
                  <Skeleton className='rounded col-6 mt-2' variant="rectangular" height={20} />
                </div>}

              {/* --------------------------Interest-Section-------------------------- */}
              {card && Array.isArray(card) &&
                <div className='row my-3'>
                  <span>Créditos: </span>
                  {card.map((item, index) => (
                    <span className='small col-12' key={index}>{moneyMask(item.amount.value)} + {moneyMask(item.installments.interest)}</span>))}
                  <span className='small'>Em pendente: {moneyMask(total - (Number(card[0].amount.value) + Number(card[1].amount.value)))}</span>
                </div>
              }
              {card && !Array.isArray(card) && <div className="row my-2">
                <span>Créditos: </span>
                <span className='small col-12'>{moneyMask(total)} + {moneyMask(interest)}</span>
              </div>
              }

              {/* --------------------------Total-Section-------------------------- */}
              {!loadingShipping ?
                <>
                  <div className="my-3">
                    <span>Produtos + frete: </span>
                    <p className='m-auto small'>{moneyMask(total)}</p>
                  </div>

                  <div className="my-2 lead" style={{ fontWeight: 'bold' }}>
                    {method !== 'credit_card' && method !== 'multi_payment'
                      ? <p className='m-auto'>Total: {moneyMask(total)}</p>
                      : <p className='m-auto'>Total: {moneyMask((Array.isArray(card) ? card[0].installments.interest + card[1].installments.interest + total : total + interest))}</p>
                    }
                  </div>
                </>
                : <div className="row my-3">
                  <Skeleton className='rounded' variant="rectangular" />
                  <Skeleton className='rounded col-6 mt-2' variant="rectangular" height={20} />

                  <Skeleton className='rounded mt-4' variant="rectangular" height={30} />
                </div>}
              <hr />

              {/* --------------------------Button-Section-------------------------- */}
              <div className='d-flex justify-content-end'>
                <LoadingButton variant='contained' loading={loadingSave} onClick={handleSave} loadingPosition="end" endIcon={<MdCheck />}>Finalizar</LoadingButton>
              </div>
            </div>
          </div>

          {charge && <ChargeModal charge={charge} method={method} />}
        </div>
      </div>
    </Container>
  )
}

export default PaymentScreen