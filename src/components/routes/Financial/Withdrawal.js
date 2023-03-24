import React from 'react'
import MoreInfo from './MoreInfo'
import { MdSearch } from 'react-icons/md'
import { useSelector } from 'react-redux'
import Filter from '../../utilities/Filter'
import InfoIcon from '@mui/icons-material/Info'
import dateMask from '../../utilities/masks/date'
import { renderToast } from '../../utilities/Alerts'
import { POST_FETCH, GET_FETCH } from '../../../variables'
import { moneyMask } from '../../utilities/masks/currency'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'
import { CircularProgress, IconButton, Pagination, Tooltip, Button } from '@mui/material'
import './styles.css'

const Withdrawal = () => {
  const [data, setData] = React.useState("")
  const [sales, setSales] = React.useState("")
  const [withdrawals, setWithdrawals] = React.useState("")
  const [disabled, setDisabled] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const [searchMask, setSearchMask] = React.useState('')
  const [dateOf, setDateOf] = React.useState('')
  const [dateFor, setDateFor] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [allow, setAllow] = React.useState(true)

  const [pagination, setPagination] = React.useState({
    totalItems: '', pageNumber: 0, perPage: 10
  })

  const [options, setOptions] = React.useState({
    paid: { value: false, label: 'Pago', checked: false },
    failed: { value: false, label: 'Falha', checked: false },
    canceled: { value: false, label: 'Cancelado', checked: false },
    pending: { value: false, label: 'Pendente', checked: false },
  })

  const token = useSelector(state => state.AppReducer.token)

  React.useEffect(() => {
    if (allow) getData()
  }, [pagination.pageNumber, search, allow])

  const getData = async () => {
    const status = getStatus()
    setAllow(false); setLoading(true)
    const response = await GET_FETCH({ url: `balance?page=${pagination.pageNumber + 1}&status=${status ? status : ''}&dateOf=${dateOf ? dateOf : ''}&dateFor=${dateFor ? dateFor : ''}&search=${search}`, token });

    // console.log("bal", response);
    if (response.status) {
      setData(response.balance); setWithdrawals(response.withdrawals); setSales(response.courses);
      if (!pagination.totalItems) setPagination({ ...pagination, totalItems: response.pagination.total, perPage: 10 })
    }
    setLoading(false);
  };

  const getStatus = () => {
    let keys = { ...options }; let status = ''
    keys = Object.keys(keys)
    keys.forEach(item => { if (options[item].value) status = item })
    return status
  }

  let timeout;
  const handleWithdrawal = async () => {
    clearTimeout(timeout);
    setDisabled(true);

    if (data.available_amount !== 0) {
      const response = await POST_FETCH({ url: `${URL}/balance/withdrawal`, body: { amount: data.available_amount } });
      // console.log("resp withdrawal", response);
      if (response) {
        setDisabled(false);
        renderToast({ type: "error", error: response.withdrawal.message });
      }
    } else {
      timeout = setTimeout(() => { setDisabled(false) }, 2500); renderToast({ type: "error", error: "Saldo insuficiente para realização de saque!", });
    }
  };

  const timerRef = React.useRef(null);
  const handleSearch = (value) => {
    setSearchMask(moneyMask(value))

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setAllow(true);
      setSearch(value);
      setPagination({ ...pagination, pageNumber: 0 });
    }, 750);
  }

  const handleStatus = (status) => {
    switch (status) {
      case "pending":
        return { style: { backgroundColor: "#FFFF66" }, status: 'PENDENTE' }

      case "paid":
        return { style: { backgroundColor: "#8AFF8A" }, status: 'PAGO' };

      case "failed":
        return { style: { backgroundColor: "#FF8A8A" }, status: 'FALHA' };

      case "canceled":
        return { style: { backgroundColor: "#FF8A8A" }, status: 'CANCELADO' };

      default:
        return null;
    }
  }

  return (
    <div className="anime-left">
      <div className="row mb-5">
        <div className='col-sm-6'>
          <div className="d-flex align-items-center">
            <h6 className="dash-title">Saques</h6>
            <Filter setDateOf={setDateOf} setDateFor={setDateFor} dateOf={dateOf} dateFor={dateFor} options={options} setOptions={setOptions}
              setAllow={setAllow} setPagination={setPagination} setSearch={setSearch} />
          </div>
          <p className='small mb-4'>Historico de saques efetuados</p>

          <div class="input-group-with-icon">
            <input class="form-control" type="text" placeholder="Buscar..." onChange={({ target }) => handleSearch(target.value)} required />
            <MdSearch className='search-icon' size={25} />
          </div>
        </div>
      </div>

      {!loading ? (
        <div>
          {data && (
            <>
              <div
                className="row p-3 rounded"
                style={{ backgroundColor: "#DCDCDC" }}
              >
                <div className="col-md-5 balance-card my-2">
                  <h6 className="mb-3">Valores disponíveis</h6>
                  <div
                    className="d-flex justify-content-center input-group"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    <span className='p-2' style={{ backgroundColor: '#D3D3D3', borderRadius: '.4rem 0 0 .4rem', fontWeight: 'bold' }}>
                      {moneyMask(data.available_amount)} {data.currency}
                    </span>
                    <Button
                      onClick={handleWithdrawal}
                      disabled={disabled}
                      variant="contained"
                      color="success"
                      endIcon={<CurrencyExchangeIcon />}
                    >
                      Sacar
                    </Button>
                    {/* <button className='btn btn-success d-flex'>Teste</button> */}
                  </div>
                </div>
                <div className="col-md-5 balance-card my-2">
                  <div className="d-flex justify-content-center">
                    <h6 className="mb-3 me-1">Valores pendentes de recebimento </h6>
                    <div className="d-flex align-self-start">
                      <Tooltip
                        title="Valores ficam disponíveis para saque após liberação Pagar.me"
                        arrow
                        placement="top"
                      >
                        <IconButton sx={{ padding: 0 }}>
                          <InfoIcon />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </div>
                  <p>
                    {moneyMask(data.waiting_funds_amount)} {data.currency}
                  </p>
                </div>
              </div>
            </>
          )}

          {!loading ?
            <table className='table table-hover table-striped text-center'>
              <thead>
                <tr className='small' style={{ fontWeight: 500 }}>
                  <td>SAQUE</td>
                  <td>STATUS</td>
                  <td>DATA</td>
                  <td>AÇÕES</td>
                </tr>
              </thead>
              <tbody>
                {withdrawals && withdrawals.map((item, index) => {
                  const { style, status } = handleStatus(item.status)
                  return (
                    <tr key={index}>
                      <td>{moneyMask(item.amount)}</td>
                      <td><span className='row m-auto status' style={style}>{status}</span></td>
                      <td>{dateMask(item.created_at)}</td>
                      <td><MoreInfo id={item.id} /></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            : <div className='d-flex justify-content-center p-5'><CircularProgress /></div>
          }


          {pagination.totalItems &&
            <div className='d-flex justify-content-end'>
              <Pagination color='primary' shape="rounded" count={Math.ceil(pagination.totalItems / pagination.perPage)}
                page={pagination.pageNumber + 1} onChange={(e, page) => {
                  window.scrollTo(0, 0); setPagination({ ...pagination, pageNumber: page - 1 }); setAllow(true)
                }
                } />
            </div>
          }
        </div>
      ) : (
        <div className="d-flex justify-content-center p-5">
          <CircularProgress />
        </div>
      )}
    </div>
  );
};

export default Withdrawal;
