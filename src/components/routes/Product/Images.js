import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import { Skeleton } from '@mui/material';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"
import { STORAGE_URL } from '../../../variables';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '.4rem'
};

export default function Images(props) {
  const [open, setOpen] = React.useState(false);
  const [thumbLoaded, setThumbLoaded] = React.useState(false);
  const [images, setImages] = React.useState(props.images.map(item => { return { path: item.file, loaded: false } }));
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <div style={{ width: 100, height: 100 }}>
        <img onClick={handleOpen} onLoad={() => setThumbLoaded(true)} className={`w-100 h-100 rounded pointer ${!thumbLoaded && 'd-none'}`} src={`${STORAGE_URL + '/' + props.thumb}`} alt="product" />
        {!thumbLoaded && <Skeleton className='position-absolute' variant="rectangular" width={100} height={100} animation='wave' sx={{ borderRadius: '.4rem' }} />}
      </div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            {images.length > 0 ?
              <Carousel infiniteLoop={true}>
                {images.map((item, index) => {
                  let newImages = [...images]
                  return (
                    <div style={{ width: 500, height: 500 }} key={index}>
                      <img onLoad={() => { newImages[index].loaded = true; setImages(newImages) }} className={`${!item.loaded && 'd-none'}`} style={{ borderRadius: '.4rem .4rem 0 0', maxWidht: '100%', maxHeight: '100%' }} src={`${STORAGE_URL + item.path}`} />
                      {!item.loaded && <Skeleton className='position-absolute' variant="rectangular" width={500} height={500} animation='wave' sx={{ borderRadius: '.4rem' }} />}
                    </div>
                  )
                })}
              </Carousel>
              : <p className='dash-title text-center p-5'>Sem imagens cadastradas</p>}
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}