import React from 'react'
import CardPayment from './CardPayment'
import MultiPayment from './MultiPayment'
import visa from '../../../assets/visa.png'
import pix from '../../../assets/qr-code.png'
import boleto from '../../../assets/boleto.png'
import mastercard from '../../../assets/master.png'
import credit_card from '../../../assets/discover.png'
import debit_card from '../../../assets/debit_card.png'
import { getInterest } from '../../utilities/Installments'

//Props coming from the PaymentScreen
const Methods = ({ card, setCard, method, setMethod, total, pendent, setPendent, setInterest }) => {
  // -------------------------------------------------------------------
  //********************************************************************
  // -------------------------States------------------------------------
  let cardPreset = {
    filled: { value: true },
    brand: { value: "visa", error: false },
    exp_month: { value: "01", error: false },
    holder_name: { value: "", error: false },
    exp_year: { value: "2023", error: false },
    cvv: { value: "", error: false, length: 3 },
    holder_document: { value: "", error: false, mask: '', length: 11 },
    number: { value: "", error: false, mask: '', length: 16 },
  }

  const multiPreset = [{
    filled: { value: true },
    brand: { value: "visa", error: false },
    exp_month: { value: "01", error: false },
    holder_name: { value: "", error: false },
    exp_year: { value: "2023", error: false },
    cvv: { value: "", error: false, length: 3 },
    number: { value: "", error: false, mask: '', length: 16 },
    holder_document: { value: "", error: false, mask: '', length: 11 },
    installments: { value: "", error: false, total: [], interest: 0 },
    amount: { value: '', error: false, mask: '' },
  },
  {
    filled: { value: true },
    brand: { value: "visa", error: false },
    exp_month: { value: "01", error: false },
    holder_name: { value: "", error: false },
    exp_year: { value: "2023", error: false },
    cvv: { value: "", error: false, length: 3 },
    number: { value: "", error: false, mask: '', length: 16 },
    holder_document: { value: "", error: false, mask: '', length: 11 },
    installments: { value: "", error: false, total: [], interest: 0 },
    amount: { value: '', error: false, mask: '' },
  }]

  return (
    <>
      <form className="payment-methods">
        {/* -------------------------Pix-Radio------------------------- */}
        <div className="form-check pointer my-2" onClick={() => { setMethod('pix'); setCard(''); setInterest(getInterest("1", total)) }}>
          <div className="d-flex payment-icons">
            <img src={pix} alt={'pix'} className="img-fluid ms-1" htmlFor={'pix'} />
          </div>
          <label htmlFor={'pix'}>Pix</label>
          <input className="ms-2" id={'pix'} type="radio" name="defaultRadio" checked={method === 'pix'} onChange={() => ''} />
        </div>

        {/* -------------------------Debit-Radio------------------------- */}
        <div className="form-check pointer my-2" onClick={() => { setCard(cardPreset); setMethod('debit_card') }}>
          <div className="d-flex payment-icons">
            <img src={debit_card} alt={'debit_card'} className="img-fluid ms-1" htmlFor={'debit_card'} />
          </div>
          <label htmlFor={'debit_card'}>Débito</label>
          <input className="ms-2" id={'debit_card'} type="radio" name="defaultRadio" checked={method === 'debit_card'} onChange={() => ''} />
        </div>

        {/* -------------------------Boleto-Radio------------------------- */}
        <div className="form-check pointer my-2" onClick={() => { setMethod('boleto'); setCard(''); setInterest(getInterest("1", total)) }}>
          <div className="d-flex payment-icons">
            <img src={boleto} alt={'boleto'} className="img-fluid ms-1" htmlFor={'boleto'} />
          </div>
          <label htmlFor={'boleto'}>Boleto</label>
          <input className="ms-2" id={'boleto'} type="radio" name="defaultRadio" checked={method === 'boleto'} onChange={() => ''} />
        </div>

        {/* -------------------------Credit-Radio------------------------- */}
        <div className="form-check pointer my-2" onClick={() => { setCard({ ...cardPreset, installments: { value: 1, error: false } }); setMethod('credit_card') }}>
          <div className="d-flex payment-icons">
            <img src={credit_card} alt={'credit_card'} className="img-fluid ms-1" htmlFor={'credit_card'} />
          </div>
          <label htmlFor={'credit_card'}>Crédito</label>
          <input className="ms-2" id={'credit_card'} type="radio" name="defaultRadio" checked={method === 'credit_card'} onChange={() => ''} />
        </div>

        {/* -------------------------Multi-Payment-Radio------------------------- */}
        <div className="form-check pointer my-2" onClick={() => { setCard(multiPreset); setMethod('multi_payment') }}>
          <div className="d-flex">
            <div className="d-flex payment-icons">
              <img src={visa} alt={'multi_payment'} className="img-fluid ms-1" htmlFor={'multi_payment'} />
            </div>

            <div className="d-flex payment-icons">
              <img src={mastercard} alt={'multi_payment'} className="img-fluid ms-1" htmlFor={'multi_payment'} />
            </div>
          </div>
          <label htmlFor={'multi_payment'}>Multi Pagamento</label>
          <input className="ms-2" id={'multi_payment'} type="radio" name="defaultRadio" checked={method === 'multi_payment'} onChange={() => ''} />
        </div>
      </form>

      <CardPayment method={method} card={card} setCard={setCard} total={total} setInterest={setInterest} />
      <MultiPayment method={method} card={card} setCard={setCard} total={total} pendent={pendent} setPendent={setPendent} />
    </>
  )
}

export default Methods