import React from 'react'
import Images from './Images'
import { useSelector } from 'react-redux'
import Filter from '../../utilities/Filter'
import { useNavigate } from 'react-router-dom'
import { DELETE_FETCH, GET_FETCH } from '../../../variables'
import { renderAlert, renderToast } from '../../utilities/Alerts'
import { moneyMask } from '../../utilities/masks/currency'
import { MdEdit, MdDelete, MdSearch, MdSave } from 'react-icons/md'
import { CircularProgress, IconButton, Pagination, Tooltip, TextField, InputAdornment, Button } from '@mui/material'

function ListProducts() {
  const [allow, setAllow] = React.useState(true)
  const [search, setSearch] = React.useState('')
  const [dateOf, setDateOf] = React.useState('')
  const [dateFor, setDateFor] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [products, setProducts] = React.useState(null)
  const [pagination, setPagination] = React.useState({
    totalItems: '', pageNumber: 0, perPage: 10
  })

  const history = useNavigate()
  const token = useSelector(state => state.AppReducer.token)

  let timeout
  const handleSearch = (value) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => { setSearch(value); setPagination({ ...pagination, pageNumber: 0 }) }, 750)
  }

  React.useEffect(() => {
    if (allow) getData()
  }, [pagination.pageNumber, allow, search])

  const getData = async () => {
    setLoading(true)
    const response = await GET_FETCH({
      url: `products/?page=${pagination.pageNumber + 1}&dateOf=${dateOf ? dateOf : ''}&dateFor=${dateFor ? dateFor : ''}&search=${search}`, token
    })
    // console.log('resp', response)

    setPagination({ ...pagination, totalItems: response.pagination.total_pages }); setProducts(response.products); setLoading(false);
  }

  const handleSize = (description) => {
    let value = Array.from(description)
    let tooltip = false
    if (value.length > 40) { value = value.splice(0, 40).toString().replace(/,/g, '') + '...'; tooltip = true }
    else { value = value.toString().replace(/,/g, ''); tooltip = false }

    return { value, tooltip }
  }

  const handleDelete = async (id) => {
    const response = await DELETE_FETCH({ url: `products/${id}`, token })
    // console.log('delete', response)

    if (response.status) getData()
    else renderToast({ type: 'error', error: 'Falha ao deletar produto, tente novamente mais tarde!' })
  }

  return (
    <div className='anime-left'>
      <div className="row mb-5">
        <div className='col-sm-6'>
          <div className="d-flex align-items-center">
            <h6 className="dash-title">Produtos</h6>
            <Filter setAllow={setAllow} pagination={pagination} setPagination={setPagination} setSearch={setSearch} />
          </div>
          <p className='small mb-4'>Encontre todos seu produtos cadastrados!</p>

          <div class="input-group-with-icon">
            <input class="form-control" type="text" placeholder="Buscar..." onChange={({ target }) => handleSearch(target.value)} required />
            <MdSearch className='search-icon' size={25} />
          </div>
        </div>

        <div className="col-sm-6">
          <div className="d-flex ms-auto align-items-end justify-content-end h-100">
            <Button variant='contained' endIcon={<MdSave />} onClick={() => history('/profile/product/add')} size='large'>Adicionar produto</Button>
          </div>
        </div>
      </div>

      {!loading ?
        <table className='table table-hover table-striped text-center'>
          <thead>
            <tr className='small' style={{ fontWeight: 500 }}>
              <td>IMAGEM</td>
              <td>NOME</td>
              <td>DESCRIÇÃO</td>
              <td>AVARIA</td>
              <td>PREÇO</td>
              <td>QUANTIDADE</td>
              <td>AÇÕES</td>
            </tr>
          </thead>
          <tbody>
            {products && products.map((item, index) => {
              const description = handleSize(item.description)
              const title = handleSize(item.name)
              return (
                <tr key={index} className=''>
                  <td><Images thumb={item.thumb} images={item.images} /></td>
                  <td>{title.tooltip ? <Tooltip placement='top' arrow title={item.name}><p>{title.value}</p></Tooltip> : title.value}</td>
                  <td>{description.tooltip ?
                    <Tooltip placement='top' arrow title={item.description}>
                      <p style={{ cursor: 'pointer' }}>{description.value}</p>
                    </Tooltip> : description.value
                  }
                  </td>
                  <td><input className="form-check-input" type="checkbox" checked={Boolean(item.damage)} readOnly /></td>
                  <td style={{ whiteSpace: 'nowrap' }}>{moneyMask(item.price)}</td>
                  <td>{item.quantity} Un</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <IconButton color='secondary' onClick={() => history(`/profile/product/edit/${item.id}`)}><MdEdit /></IconButton>
                    <IconButton color='error' onClick={() => renderAlert({ id: item.id, item: 'produto', article: 'o', deleteFunction: handleDelete })}><MdDelete /></IconButton>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table> : <div className='d-flex justify-content-center p-5'><CircularProgress /></div>
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
  );
}

export default ListProducts;
