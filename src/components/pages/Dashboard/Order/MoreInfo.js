import * as React from "react";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import CloseIcon from "@mui/icons-material/Close";
import { CircularProgress, IconButton } from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { GET_FETCH, STORAGE_URL } from "../../../../variables";
import dateMask from "../../../utilities/masks/date";
import { moneyMask } from "../../../utilities/masks/currency";
import characterLimitMask from "../../../utilities/masks/characterLimit";
// import './styles.css';

// -------------------------------------------------------------------
//********************************************************************
// -------------------------Styles------------------------------------
const style = {
  position: "absolute",
  left: "50%",
  width: "50%",
  height: "100%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function MoreInfo(props) {
  // -------------------------------------------------------------------
  //********************************************************************
  // -------------------------States------------------------------------
  const [open, setOpen] = React.useState(false);
  const [order, setOrder] = React.useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  React.useEffect(() => {
    if (open) getData();
  }, [open])


  // -----------------------------------------------------------------
  //******************************************************************
  // -------------------------Getting-data----------------------------
  const getData = async () => {
    const response = await GET_FETCH({ url: `orders/${props.id}`, token: props.token });
    setOrder(response.order);
  };


  // -----------------------------------------------------------------
  //******************************************************************
  // -------------------------Other-functions-------------------------
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

  const handleMethod = (method) => {
    switch (method) {
      case "credit_card":
        return "Crédito"

      case "debit_card":
        return "Débito"

      case "boleto":
        return "Boleto"

      case "pix":
        return "Pix"

      default:
        return method;
    }
  }

  return (
    <div>
      <IconButton color='inherit' onClick={handleOpen}>
        <VisibilityIcon size={17} />
      </IconButton>

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
            <div className="d-flex">
              <div>
                <span className="lead">Detalhes do Pedido</span>
                <p className="text-muted">Visualize detalhes sobre o pedido!</p>
              </div>
              <div className="ms-auto">
                <IconButton onClick={handleClose}>
                  <CloseIcon />
                </IconButton>
              </div>
            </div>
            <hr />
            {order ?
              <div className="row">
                {order.charges.map((item, index) => {
                  const { style, status } = handleStatus(item.status)
                  return (
                    // <div key={index} className="row my-5 rounded" style={{ backgroundColor: "#DCDCDC" }}>
                    <div key={index} className='col-12 py-3 my-3 m-auto rounded bg-gray' style={{ whiteSpace: 'nowrap' }}>
                      <div className="d-flex">
                        <p>Pago em: </p>
                        <p className="ms-2">{item.paid_at ? dateMask(item.paid_at) : '- / - / -'}</p>
                      </div>

                      <div className="d-flex">
                        <LocalAtmIcon size={20} />
                        <p className="ms-1">{moneyMask(item.amount)}</p>
                      </div>

                      <div className="d-flex mt-2">
                        <CreditCardIcon size={20} />
                        <p className="ms-1">
                          {handleMethod(item.payment_method)}
                        </p>
                        {item.last_transaction.installments &&
                          <div className="d-flex ms-2">{item.last_transaction.installments}X</div>
                        }
                      </div>

                      <span style={style} className="m-1 text-center row status small">{status}</span>
                    </div>
                    // </div>
                  );
                })}

                {order.products.map((item, index) => (
                  <div key={index} className='col-12 py-3 m-auto rounded mt-3 bg-gray'>
                    <p className="lead">{characterLimitMask(item.product?.name, 40)}</p>
                    <div className="d-flex">
                      {item.images.map(img => (
                        <div key={img?.file} style={{ width: 100, height: 100, marginRight: '1rem' }}>
                          <img className='w-100 h-100 rounded' src={`${STORAGE_URL + img?.file}`} />
                        </div>
                      ))}
                    </div>
                    <p className="small mt-1">{characterLimitMask(item.product?.description, 180)}</p>
                    <span className="small">{moneyMask(10000)}</span>
                    <span className="text-center row" style={{ backgroundColor: '#FFF', height: '.1rem' }} />
                  </div>
                )
                )}
              </div>
              : <div className="d-flex justify-content-center p-5">
                <CircularProgress color='inherit' />
              </div>}
          </Box>
        </Fade>
      </Modal >
    </div >
  );
}
