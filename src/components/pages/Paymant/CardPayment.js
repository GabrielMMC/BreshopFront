import React from 'react'
import CardsModal from './CardsModal'
import setError from '../../utilities/Error'
import cpfMask from '../../utilities/masks/cpf'
import { STORAGE_URL } from '../../../variables'
import cardMask from '../../utilities/masks/card'
import Installments, { getInterest } from '../../utilities/Installments'
import { moneyMask } from '../../utilities/masks/currency'

//Props coming from the Methods screen
const CardPayment = ({ method, card, setCard, total, setInterest }) => {
  // -----------------------------------------------------------------
  //******************************************************************
  // -------------------------Other-functions-------------------------
  const fillMonth = ['01', '02', '03', '04', '05', '06', '07', '09', '10', '11', '12']
  const fillYear = ['2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030', '2031', '2032', '2033']
  const installments = Installments(total)

  //Called when user open the card fields
  const handleOpenInput = () => {
    const newCard = { ...card }
    //Deleting id and data of card state
    delete newCard.id; delete newCard.cardObj
    setCard(newCard)
  }

  return (
    <>
      {/* --------------------------Choose-Cards-------------------------- */}
      {!Array.isArray(card) && (method === 'debit_card' || method === 'credit_card') && (
        <div className='mt-5'>
          <div className="d-flex">
            {method === 'credit_card' &&
              <>
                <CardsModal card={card} setCard={setCard} /><span className='ms-2'> ou </span>
                <span className='link-p ms-2' onClick={handleOpenInput}>adicione um agora!</span>
              </>
            }
          </div>
          {/* --------------------------Card-Fields-Section-------------------------- */}
          {card && !card.id &&
            <form className='anime-left mt-3'>
              <div className="row align-items-end">
                {/* --------------------------Holder-Name-------------------------- */}
                <div className="col-sm-6 my-2">
                  <div className="form-floating">
                    <input className={`form-control ${card.holder_name.error && 'is-invalid'}`} id="name" type="text" value={card.holder_name.value}
                      onChange={({ target }) => setCard({ ...card, holder_name: { ...card.holder_name, value: target.value, error: false } })}
                      onBlur={() => setError('holder_name', card, setCard)} required />
                    <label htmlFor="name">Nome do Títular*</label>
                  </div>
                </div>
                {/* --------------------------Number-------------------------- */}
                <div className="col-sm-6 my-2">
                  <div className='input-group'>
                    <div className="form-floating">
                      <input className={`form-control ${card.number.error && 'is-invalid'}`} id="card" type="text" value={card.number.mask}
                        onChange={({ target }) => {
                          const { brand, mask, length, cvv, value } = cardMask(target.value)
                          setCard({ ...card, number: { ...card.number, value, mask, length, error: false }, brand: { ...card.brand, value: brand }, cvv: { ...card.cvv, length: cvv, value: '' } })
                        }}
                        onBlur={() => setError('number', card, setCard)} required />
                      <label htmlFor="card">Cartão*</label>
                    </div>
                    <div className='brand'><img src={`${URL}brands/${card.brand.value ? card.brand.value : 'nocard'}.png`} alt='brand'></img></div>
                  </div>
                </div>
              </div>
              {/* --------------------------Holder-Document-------------------------- */}
              <div className="row mt-4">
                <div className={` ${method === 'debit_card' ? 'col-sm-12 my-2' : 'col-sm-8 my-2'}`}>
                  <div className="form-floating">
                    <input className={`form-control ${card.holder_document.error && 'is-invalid'}`} id="document" type="text" value={card.holder_document.mask}
                      onChange={({ target }) => setCard({ ...card, holder_document: { ...card.holder_document, value: cpfMask(target.value).value, mask: cpfMask(target.value).mask, error: false } })}
                      onBlur={() => setError('holder_document', card, setCard)} required />
                    <label htmlFor="document">CPF do Títular*</label>
                  </div>
                </div>
                {/* --------------------------Installments-------------------------- */}
                {card.installments && method === 'credit_card' &&
                  <div className="col-sm-4 my-2">
                    <div className="form-floating">
                      <select className="form-control text-center" id="name" type="text" value={card.installments.value}
                        onChange={({ target }) => {
                          setCard({ ...card, installments: { ...card.installments, value: target.value, error: false } })
                          setInterest(getInterest(target.value, total))
                        }}
                        onBlur={() => setError('installments', card, setCard)} required>
                        {installments.map(item => (
                          <option key={item.convert} value={item.value}>
                            {item.value + 'X - '}{moneyMask(item.convert)}
                          </option>
                        ))}
                      </select>
                      <label htmlFor="name">Valor da Parcela*</label>
                    </div>
                  </div>}
              </div>
              {/* --------------------------Month-------------------------- */}
              <div className="row mt-4">
                <div className="col-sm-3 my-2">
                  <div className="form-floating">
                    <select className={`form-control ${card.exp_month.error && 'is-invalid'}`} id="month" type="text" value={card.exp_month.value}
                      onChange={({ target }) => setCard({ ...card, exp_month: { ...card.exp_month, value: target.value, error: false } })}
                      onBlur={() => setError('exp_month', card, setCard)} required>
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
                    <select className={`form-control ${card.exp_year.error && 'is-invalid'}`} id="year" type="text" value={card.exp_year.value}
                      onChange={({ target }) => setCard({ ...card, exp_year: { ...card.exp_year, value: target.value, error: false } })}
                      onBlur={() => setError('exp_year', card, setCard)} required>
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
                    <input className={`form-control ${card.cvv.error && 'is-invalid'}`} id="cvv" type="number" value={card.cvv.value}
                      onChange={({ target }) => setCard({ ...card, cvv: { ...card.cvv, value: Array.from(target.value).length <= card.cvv.length ? target.value : card.cvv.value, error: false } })}
                      onBlur={() => setError('cvv', card, setCard)} required />
                    <label htmlFor="cvv">CVV*</label>
                  </div>
                </div>
              </div>
            </form>}
          {/* --------------------------Installments-------------------------- */}
          {method === 'credit_card' && card.id &&
            <div className="col-sm-12 my-2 mb-4">
              <div className="form-floating">
                <select className={`form-control ${card.installments.error && 'is-invalid'}`} id="installments" type="text" value={card.installments.value}
                  onChange={({ target }) => {
                    setCard({ ...card, installments: { ...card.installments, value: target.value, error: false } })
                    setInterest(getInterest(target.value, total))
                  }}
                  onBlur={() => setError('installments', card, setCard)} required>
                  {installments.map(item => (
                    <option key={item.convert} value={item.value}>
                      {item.value + 'X - '}{moneyMask(item.convert)}
                    </option>
                  ))}
                </select>
                <label htmlFor="installments">Valor da Parcela*</label>
              </div>
            </div>}
          {/* --------------------------Selected-Cards-Section-------------------------- */}
          {card.cardObj &&
            <div className="col-12 bg-gray rounded p-3 anime-left">
              <div className="d-flex">
                <p>Cartão: </p>
                <p className='ms-2'>**** **** **** {card.cardObj.last_four_digits}</p>
                <p className='ms-4'>Validade: </p>
                <p className='ms-2'>{card.cardObj.exp_month}/{card.cardObj.exp_year}</p>
              </div>
            </div>}
        </div>
      )}
    </>
  )
}

export default CardPayment