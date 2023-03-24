import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import Theme from '../routes/Theme/Theme'
import { ThemeProvider } from '@mui/material'
import { ToastContent } from '../utilities/Alerts'

const Container = ({ children }) => {
  return (
    <ThemeProvider theme={Theme}>
      <div style={{ overflowX: 'hidden', minHeight: '100vh', backgroundColor: '#e8e8e8' }}>
        <Navbar />
        <div style={{ minHeight: 'calc(100vh - 459px)' }}>
          <div className="container my-5 m-auto" style={{ maxWidth: 1200 }}>
            {children}
          </div>
        </div>
        <Footer />
        <ToastContent />
      </div>
    </ThemeProvider >
  )
}

export default Container