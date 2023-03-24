import { IconButton, ThemeProvider, Typography } from '@mui/material'
import React from 'react'
import map from '../../assets/map.png'
import logo from '../../assets/logo.png'
import Theme from '../routes/Theme/Theme'
import FacebookIcon from '@mui/icons-material/Facebook';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import MailIcon from '@mui/icons-material/Mail';
import InstagramIcon from '@mui/icons-material/Instagram';

const Footer = () => {
  return (
    <ThemeProvider theme={Theme}>
      <footer className='container-fluid bg-purple text-center py-5' style={{ position: 'relative', bottom: 0 }}>
        <div className="row">
          <div className="col-sm-4">
            <div className='m-auto' style={{ maxHeight: 150, maxWidth: 150 }}>
              <img className='img-fluid' src={logo} alt='logo' />
            </div>
            <div className="d-flex flex-column">
              <Typography variant='caption mt-2'>contato@email.com</Typography>
              <Typography variant='caption mt-2'>contato2@email.com</Typography>
              <Typography variant='caption mt-2'>(11) 4002-8922</Typography>
            </div>
          </div>
          <div className="col-sm-4 d-flex flex-column text-pointer mt-3">
            <Typography variant='caption mt-2'>Roupas | Camisas</Typography>
            <Typography variant='caption mt-2'>Promoções | Novidades</Typography>
            <Typography variant='caption mt-2'>Recomendados | Lojas</Typography>
            <Typography variant='caption mt-2'>Avaría | Materiais</Typography>
            <Typography variant='caption mt-2'>Casual | Personalisados</Typography>
            <Typography variant='caption mt-2'>Vintage | Couro</Typography>
            <Typography variant='caption mt-2'>Esportiva | Jeans</Typography>
            <Typography variant='caption mt-2'>Gerais | Calça</Typography>
          </div>
          <div className="col-sm-4 d-flex flex-column mt-3">
            <div className='mt-2'>
              <img style={{ width: '80%' }} className='rounded me-5 d-flex m-auto' src={map} alt='map' />
              <Typography variant='caption mt-2'>Rua um, do lado da rua dois, bairro das flores, 1001</Typography>
            </div>
            <div className="mt-5 d-flex justify-content-center">
              <IconButton><FacebookIcon sx={{ color: 'white' }} /></IconButton>
              <IconButton><WhatsAppIcon sx={{ color: 'white' }} /></IconButton>
              <IconButton><InstagramIcon sx={{ color: 'white' }} /></IconButton>
              <IconButton><MailIcon sx={{ color: 'white' }} /></IconButton>
            </div>
          </div>
        </div>
      </footer>
    </ThemeProvider >
  )
}

export default Footer