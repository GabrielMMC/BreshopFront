import React from 'react'
import CardsModal from './CardsModal'
import setError from '../../utilities/Error'
import cpfMask from '../../utilities/masks/cpf'
import { STORAGE_URL, URL } from '../../../variables'
import cardMask from '../../utilities/masks/card'
import { moneyMask } from '../../utilities/masks/currency'
import Installments, { getInterest } from '../../utilities/Installments'

//Props coming from the Methods screen
const MultiPayment = ({ method, card, setCard, total, pendent, setPendent }) => {
  // -------------------------------------------------------------------
  //********************************************************************
  // -------------------------States------------------------------------
  const [indexCard, setIndexCard] = React.useState(0)

  const fillMonth = ['01', '02', '03', '04', '05', '06', '07', '09', '10', '11', '12']
  const fillYear = ['2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030', '2031', '2032', '2033']

  // -----------------------------------------------------------------
  //******************************************************************
  // -------------------------Other-functions-------------------------
  const handleOpenInput = () => {
    //Deleting saved card data, like ID and cardObj
    const newCard = [...card]
    delete newCard[indexCard].id; delete newCard[indexCard].cardObj

    setCard(newCard)
  }

  //IndexCard means the array key that will be accessed, ex: newCard[indexCard][item].value = newCard[0].number.value
  const handleChange = (value, item, mask) => {
    let newCard = [...card]
    //Cahnging value and error from card value
    newCard[indexCard][item].error = false
    newCard[indexCard][item].value = value

    //if there are mask props, the value will be formatted according to the mask
    if (mask) newCard[indexCard][item].mask = mask(value).mask ? mask(value).mask : mask(value)

    //If item props is equal to 'installments', the interest value will be changed with getInterest function
    if (item === 'installments') newCard[indexCard][item].interest = getInterest(value, newCard[indexCard].amount.value)

    setCard(newCard)
  }

  //Function to change amount value
  const handleAmountChange = (value) => {
    let pendentTotal = 0
    let newCard = [...card]
    let newPendent = [...pendent]
    value = value.replace(/\D/g, '')

    //Assigning the total value on pendentTotal variable
    if (indexCard === 0) pendentTotal = newPendent[1].total
    else pendentTotal = newPendent[0].total

    //if the value is less than the decrement of the total saved money with the total, it will be saved
    if (value <= (total - pendentTotal)) {
      //Changing amount values
      newCard[indexCard].amount.message = ''
      newCard[indexCard].amount.error = false
      newCard[indexCard].amount.value = value
      newCard[indexCard].amount.mask = moneyMask(value)

      //Changing installments values
      newCard[indexCard].installments.value = 1
      newCard[indexCard].installments.total = Installments(value)
      newCard[indexCard].installments.interest = getInterest("1", value)

      //Updating pendent values
      newPendent[indexCard].value -= value
      newPendent[indexCard].total = value

    } else {
      //if the value is greater than the decrement of the total saved money with the total, the error message will be rendered
      newCard[indexCard].amount.error = true
      newCard[indexCard].amount.message = 'Valor acima da compra'
    }

    setCard(newCard); setPendent(newPendent)
  }

  return (
    <>
      {method === 'multi_payment' &&
        <div className='mt-5 row'>
          {/* --------------------------Choose-Cards-------------------------- */}
          <div className="col-md-6">
            <div className="d-flex">
              <CardsModal card={card} setCard={setCard} indexCard={indexCard} />
              <p className='ms-2'> ou </p>
              <p className='link-p ms-2' onClick={handleOpenInput}>adicione um agora!</p>
            </div>
          </div>

          <div className="col-md-6 d-flex">
            <div className="ms-auto d-flex" style={{ whiteSpace: 'nowrap' }}>
              <div className="form-check ms-2">
                <label className='pointer' htmlFor='cardOne'>Primeiro cartão</label>
                <input className="ms-2" id='cardOne' type="radio" name="multiPaymentRadio" onClick={() => setIndexCard(0)} defaultChecked />
              </div>

              <div className="form-check ms-2">
                <label className='pointer' htmlFor='cardTwo'>Segundo cartão</label>
                <input className="ms-2" id='cardTwo' type="radio" name="multiPaymentRadio" onClick={() => setIndexCard(1)} />
              </div>
            </div>
          </div>
          {/* --------------------------Card-Fields-Section-------------------------- */}
          {Array.isArray(card) && !card[indexCard].id ?
            <form className='anime-left mt-3'>
              <div className="row align-items-end">
                {/* --------------------------Holder-Name-------------------------- */}
                <div className="col-sm-6 my-2">
                  <div className="form-floating">
                    <input className={`form-control ${card[indexCard].holder_name.error && 'is-invalid'}`} id="name" type="text" value={card[indexCard].holder_name.value}
                      onChange={({ target }) => handleChange(target.value, 'holder_name')}
                      onBlur={() => setError('holder_name', card, setCard, indexCard)} required />
                    <label htmlFor="name">Nome do Títular*</label>
                  </div>
                </div>
                {/* --------------------------Number-------------------------- */}
                <div className="col-sm-6 my-2">
                  <div className='input-group'>
                    <div className="form-floating">
                      <input className={`form-control ${card[indexCard].number.error && 'is-invalid'}`} id="card" type="text" value={card[indexCard].number.mask}
                        onChange={({ target }) => {
                          //Getting the card data with target.value
                          const { brand, mask, length, cvv, value } = cardMask(target.value)
                          //Cloning the card array and changing your values
                          let newCard = [...card]
                          newCard[indexCard].number.mask = mask
                          newCard[indexCard].number.value = value
                          newCard[indexCard].number.error = false
                          newCard[indexCard].number.length = length

                          //Changing brand and cvv values
                          newCard[indexCard].brand.value = brand
                          newCard[indexCard].cvv.length = cvv
                          newCard[indexCard].cvv.value = ''

                          //If target.value is less than saved length, the number value will be updated, else the number will be the same 
                          Array.from(target.value).length <= newCard[indexCard].number.length ? newCard[indexCard].number.value = target.value : newCard[indexCard].number.value = newCard[indexCard].number.value
                          setCard(newCard)
                        }}
                        onBlur={() => setError('number', card, setCard, indexCard)} required />
                      <label htmlFor="card">Cartão*</label>
                    </div>
                    <div className='brand'><img src={`${URL}brands/${card[indexCard].brand.value ? card[indexCard].brand.value : 'nocard'}.png`} alt='brand'></img></div>
                  </div>
                </div>
              </div>
              {/* --------------------------Holder-Document-------------------------- */}
              <div className="row mt-4">
                <div className='col-12 my-2'>
                  <div className="form-floating">
                    <input className={`form-control ${card[indexCard].holder_document.error && 'is-invalid'}`} id="document" type="text" value={card[indexCard].holder_document.mask}
                      onChange={({ target }) => handleChange(target.value, 'holder_document', cpfMask)}
                      onBlur={() => setError('holder_document', card, setCard, indexCard)} required />
                    <label htmlFor="document">CPF do Títular*</label>
                  </div>
                </div>
              </div>
              {/* --------------------------Month-------------------------- */}
              <div className="row mt-4">
                <div className="col-sm-3 my-2">
                  <div className="form-floating">
                    <select className={`form-control ${card[indexCard].exp_month.error && 'is-invalid'}`} id="month" type="text" value={card[indexCard].exp_month.value}
                      onChange={({ target }) => handleChange(target.value, 'exp_month')}
                      onBlur={() => setError('exp_month', card, setCard, indexCard)} required>
                      {fillMonth.map(item => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                    <label htmlFor="month">Mês*</label>
                  </div>
                </div>
                {/* --------------------------Year-------------------------- */}
                <div className="col-sm-6 my-2">
                  <div className="form-floating">
                    <select className={`form-control ${card[indexCard].exp_year.error && 'is-invalid'}`} id="year" type="text" value={card[indexCard].exp_year.value}
                      onChange={({ target }) => handleChange(target.value, 'exp_year')}
                      onBlur={() => setError('exp_year', card, setCard, indexCard)} required>
                      {fillYear.map(item => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                    <label htmlFor="year">Ano*</label>
                  </div>
                </div>
                {/* --------------------------CVV-------------------------- */}
                <div className="col-sm-3 my-2">
                  <div className="form-floating">
                    <input className={`form-control ${card[indexCard].cvv.error && 'is-invalid'}`} id="cvv" type="number" value={card[indexCard].cvv.value}
                      onChange={({ target }) => {
                        let newCard = [...card]
                        newCard[indexCard].cvv.error = false
                        Array.from(target.value).length <= newCard[indexCard].cvv.length ? newCard[indexCard].cvv.value = target.value : newCard[indexCard].cvv.value = newCard[indexCard].cvv.value
                        setCard(newCard)
                      }}
                      onBlur={() => setError('cvv', card, setCard, indexCard)} required />
                    <label htmlFor="cvv">CVV*</label>
                  </div>
                </div>
              </div>
              {/* --------------------------Amount-------------------------- */}
              <div className="row my-4">
                <div className="col-sm-6 my-2">
                  <div className="form-floating">
                    <input className={`form-control ${card[indexCard].number.error && 'is-invalid'}`} id="amount" type="text" value={card[indexCard].amount.mask}
                      onChange={({ target }) => handleAmountChange(target.value)}
                      onBlur={() => setError('amount', card, setCard, indexCard)} required />
                    <label htmlFor="amount">Valor do cartão*</label>
                    {card[indexCard].amount.message && <p className='small' style={{ color: '#FF0000' }}>{card[indexCard].amount.message}</p>}
                  </div>
                </div>
                {/* --------------------------Installments-------------------------- */}
                <div className="col-sm-6 my-2">
                  <div className="form-floating">
                    <select className={`form-control ${card[indexCard].number.error && 'is-invalid'}`} id="installments" type="text" value={card[indexCard].installments.value}
                      onChange={({ target }) => handleChange(target.value, 'installments')}
                      onBlur={() => setError('installments', card, setCard, indexCard)} required>
                      {card[indexCard].installments.total.map(item => (
                        <option key={item.convert} value={item.value}>
                          {item.value + 'X - '}{moneyMask(item.convert)}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="installments">Valor da Parcela*</label>
                  </div>
                </div>
              </div>
            </form>
            :
            <div className="row mb-4">
              {/* --------------------------Amount-------------------------- */}
              <div className="col-sm-6 my-2">
                <div className="form-floating">
                  <input className={`form-control ${card[indexCard].amount.error && 'is-invalid'}`} id="amount" type="text" value={card[indexCard].amount.mask}
                    onChange={({ target }) => handleAmountChange(target.value)}
                    onBlur={() => setError('amount', card, setCard, indexCard)} required />
                  <label htmlFor="amount">Valor do cartão*</label>
                  {card[indexCard].amount.message && <p className='small' style={{ color: '#FF0000' }}>{card[indexCard].amount.message}</p>}
                </div>
              </div>
              {/* --------------------------Installments-------------------------- */}
              <div className="col-sm-6 my-2">
                <div className="form-floating">
                  <select className={`form-control ${card[indexCard].installments.error && 'is-invalid'}`} id="installments" type="text" value={card[indexCard].installments.value}
                    onChange={({ target }) => handleChange(target.value, 'installments')}
                    onBlur={() => setError('installments', card, setCard, indexCard)} required>
                    {card[indexCard].installments.total.map(item => (
                      <option key={item.convert} value={item.value}>
                        {item.value + 'X - '}{moneyMask(item.convert)}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="installments">Valor da Parcela*</label>
                </div>
              </div>
            </div>
          }

          {/* --------------------------Selected-Cards-Section-------------------------- */}
          {Array.isArray(card) && card[indexCard].cardObj &&
            <div className="col-12 bg-gray rounded p-3 anime-left">
              <div className="d-flex">
                <p>Cartão: </p>
                <p className='ms-2'>**** **** **** {card[indexCard].cardObj.last_four_digits}</p>
                <p className='ms-4'>Validade: </p>
                <p className='ms-2'>{card[indexCard].cardObj.exp_month}/{card[indexCard].cardObj.exp_year}</p>
              </div>
            </div>}
        </div>}
    </>
  )
}

export default MultiPayment