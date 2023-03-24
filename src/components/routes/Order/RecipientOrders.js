import React from 'react'
import Chart from "react-apexcharts"
import { useSelector } from 'react-redux'
import { GET_FETCH } from '../../../variables'
import { MdSearch } from 'react-icons/md'
import { Pagination, CircularProgress } from "@mui/material"
import MoreInfo from '../../pages/Dashboard/Order/MoreInfo'
import Filter from '../../utilities/Filter'
import dateMask from '../../utilities/masks/date'
import { moneyMask } from '../../utilities/masks/currency'

const RecipientOrders = () => {
  const [year, setYear] = React.useState('2023')
  const [orders, setOrders] = React.useState('')
  const [search, setSearch] = React.useState('')
  const [dateOf, setDateOf] = React.useState('')
  const [dateFor, setDateFor] = React.useState('')

  const [chartData, setChartData] = React.useState('')

  const [allow, setAllow] = React.useState(true)
  const [loading, setLoading] = React.useState(true)
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
  }, [pagination.pageNumber, search, allow, year])

  const getData = async () => {
    setAllow(false); setLoading(true)

    const status = getStatus()
    const response = await GET_FETCH({ url: `orders/all/?page=${pagination.pageNumber + 1}&status=${status ? status : ''}&dateOf=${dateOf ? dateOf : ''}&dateFor=${dateFor ? dateFor : ''}&search=${search}&year_orders=${year}`, token })

    console.log('resp', response)
    setOrders(response.orders); setLoading(false)
    if (!pagination.totalItems) setPagination({ ...pagination, totalItems: response.pagination.total })

    let data = []
    for (let i = 0; i < 12; i++) {
      let month = response.year_orders.filter(item => new Date(item.created_at).getMonth() === i).length
      data = [...data, month]
    }

    setChartData({
      "options": {
        chart: {
          id: "basic-bar"
        },
        xaxis: {
          categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
        }
      },
      "series": [
        {
          name: 'Pedidos',
          data
        }
      ]
    })
  }


  const getStatus = () => {
    let keys = { ...options }; let status = ''
    keys = Object.keys(keys)
    keys.forEach(item => { if (options[item].value) status = item })
    return status
  }

  let timer
  const handleSearch = (value) => {
    clearTimeout(timer)
    timer = setTimeout(() => { setSearch(value); setAllow(true); setPagination({ ...pagination, pageNumber: 0 }) }, 750)
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

  const years = [2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032]

  return (
    <div className="anime-left">
      <div className="row mb-5">
        <div className='col-sm-6'>
          <div className="d-flex align-items-center">
            <h6 className="dash-title">Pedidos</h6>
            <Filter setDateOf={setDateOf} setDateFor={setDateFor} dateOf={dateOf} dateFor={dateFor} options={options} setOptions={setOptions}
              setAllow={setAllow} setPagination={setPagination} setSearch={setSearch} />
          </div>
          <p className='small mb-4'>Historico de pedidos dos clientes</p>

          <div class="input-group-with-icon">
            <input class="form-control" type="text" placeholder="Buscar..." onChange={({ target }) => handleSearch(target.value)} required />
            <MdSearch className='search-icon' size={25} />
          </div>
        </div>
      </div>
      {!loading ?
        <>
          <div className="row m-3">
            <div className="col-sm-8">
              <strong>Gŕafico de pedidos</strong>
              <p className='text-muted'>Visualize os pedidos efetuados durante o ano escolhido</p>
            </div>

            <div className='col-md-4 my-2'>
              <div className='form-floating'>
                <select className='form-control' id='gender' type='text' value={year} onChange={({ target }) => { setYear(target.value); setAllow(true) }} required>
                  {years.map(item => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
                <label htmlFor='gender'>Ano*</label>
              </div>
            </div>

            {chartData &&
              <Chart
                options={chartData.options}
                series={chartData.series}
                type="line"
                width="100%"
                height='400'
              />}
          </div>

          {!loading ?
            <table className='table table-hover table-striped text-center'>
              <thead>
                <tr className='small' style={{ fontWeight: 500 }}>
                  <td>PRODUTOS</td>
                  <td>STATUS</td>
                  <td>TOTAL</td>
                  <td>CRIADO EM</td>
                  <td>AÇÕES</td>
                </tr>
              </thead>
              <tbody>
                {orders && orders.map(item => {
                  const { style, status } = handleStatus(item.status)
                  return (
                    <tr key={item.id}>
                      <td>{item.products.map(item2 => (<span className='row m-auto'>{item2?.product?.name}</span>))}</td>
                      <td><span className='row m-auto status' style={style}>{status}</span></td>
                      <td>{moneyMask(item.amount)}</td>
                      <td>{dateMask(item.created_at)}</td>
                      <td><MoreInfo id={item.id} token={token} /></td>
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

        </> : <div className='d-flex justify-content-center p-5 bg-white'><CircularProgress /></div>}
    </div>
  )
}

export default RecipientOrders