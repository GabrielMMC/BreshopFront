import React from 'react'
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from '@mui/icons-material/Search';
import { Box, Fade, IconButton, Modal } from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList';
import dateMask from './masks/date';

const Filter = (props) => {
  const [open, setOpen] = React.useState(false)

  function renderOptions() {
    if (props.options) {
      const keys = Object.keys(props.options)
      return keys.map(item => (
        <div className="form-check my-2 mx-3 d-flex align-items-center">
          <input className="form-check-input" type="checkbox" name="exampleRadios" id={item} value={props.options[item].value}
            onChange={() => handleChange(item)} checked={props.options[item].value} />
          <label className="form-check-label lead ms-1" htmlFor={item}>
            {props.options[item].label}
          </label>
        </div>
      )
      )
    }
  }

  const handleChange = (id) => {
    let options2 = { ...props.options }
    let keys = Object.keys(props.options)
    keys.forEach(item => {
      if (item === id) options2[item] = { ...options2[item], value: !options2[item].value }; else options2[item] = { ...options2[item], value: false }
    })
    props.setOptions(options2)
  }

  const handleOpen = () => {
    props.setAllow(false); setOpen(true)
  }

  const handleClose = () => {
    props.setAllow(true); setOpen(false); props.setSearch(''); props.setPagination({ ...props.pagination, pageNumber: 0 })
  }

  const handleDateChange = (value) => {
    console.log('value', value)
  }

  const style = {
    position: 'absolute',
    height: '100%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 2,
  };

  return (
    <div className='ms-2'>
      <IconButton sx={{ padding: 0 }} onClick={(e) => handleOpen(e)}>
        <FilterListIcon size={30} />
      </IconButton>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
      >
        <Fade in={open}>
          <Box sx={style}>
            <div className="d-flex">
              <IconButton onClick={() => setOpen(false)}>
                <CloseIcon />
              </IconButton>

              <div className="ms-auto">
                <button className='rounded-button hvr-grow' onClick={handleClose}>
                  <SearchIcon size={22} />
                </button>
              </div>
            </div>
            {props.options &&
              < div className="my-4 m-auto">
                {renderOptions()}
              </div>}

            <div className="mt-3">
              <label htmlFor='name'>De {props.dateOf ? dateMask(props.dateOf) : ' - / - / -'}</label>
              <input type="date" className="form-control" value={props.dateOf} onChange={({ target }) => props.setDateOf(target.value)} />

              <label className='mt-3' htmlFor='name'>Até {props.dateFor ? dateMask(props.dateFor) : ' - / - / -'}</label>
              <input type="date" className="form-control" value={props.dateFor} onChange={({ target }) => props.setDateFor(target.value)} />
            </div>
          </Box>
        </Fade>
      </Modal>
    </div >
  )
}

export default Filter