import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import { URL } from '../../variables'
import { useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import Theme from '../routes/Theme/Theme'

export default function SaleCard({ product }) {
  const history = useNavigate()
  // history(`/product/${product.id}`)

  return (
    <ThemeProvider theme={Theme}>
      {product && <Card onClick={() => ''} sx={{ width: 175 }} className='m-2 hvr'>
        <CardMedia
          component="img"
          height="150"
          image={`${URL}storage/${product.images[0].file}`}
          alt="Paella dish"
          onClick={() => history(`/product/${product.id}`)}
        />
        <div className="product-card">
          <div className="m-2">
            <Typography variant="body2" color="text.secondary">
              {product.name}
            </Typography>
          </div>

          <div className="d-flex m-2">
            <Typography className='me-2' variant="substring" color="text.secondary">
              <del>R$: {product.price}</del>
            </Typography>
            <Typography fontSize={25} variant="substring" sx={{ color: '#ff4c4c', fontWeight: 'bold' }}>
              R$: {product.price}
            </Typography>
          </div>
        </div>
        <CardActions disableSpacing sx={{ padding: 0, margin: 0 }}>
          <IconButton aria-label="add to favorites">
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
        </CardActions>
      </Card>}
    </ThemeProvider>
  );
}