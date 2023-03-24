import * as React from "react";
import Box from "@mui/material/Box"
import Fade from "@mui/material/Fade"
import Modal from "@mui/material/Modal"
import { useSelector } from 'react-redux'
import Backdrop from "@mui/material/Backdrop"
import { GET_FETCH } from "../../../variables"
import CloseIcon from "@mui/icons-material/Close"
import dateMask from "../../utilities/masks/date"
import LocalAtmIcon from "@mui/icons-material/LocalAtm"
import { moneyMask } from "../../utilities/masks/currency"
import VisibilityIcon from "@mui/icons-material/Visibility"
import { CircularProgress, IconButton } from "@mui/material"
import CreditCardIcon from "@mui/icons-material/CreditCard"
import './styles.css'

// --------------------------------------------------------------------
//*********************************************************************
// -------------------------Styles-------------------------------------
const cssStyle = {
  position: "absolute",
  left: "50%",
  width: "50%",
  height: "100%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

//Props coming from the Withdrawal table screen
export default function MoreInfo({ id }) {
  // -------------------------------------------------------------------
  //********************************************************************
  // -------------------------States------------------------------------
  const [open, setOpen] = React.useState(false);
  const [style, setStyle] = React.useState(false);
  const [status, setStatus] = React.useState(false);
  const [withdrawal, setWithdrawal] = React.useState("");

  const token = useSelector(state => state.AppReducer.token)

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  React.useEffect(() => {
    if (open) getData();
  }, [open])


  // -----------------------------------------------------------------
  //******************************************************************
  // -------------------------Getting-data----------------------------
  const getData = async () => {
    const response = await GET_FETCH({ url: `balance/withdrawal/${id}`, token });
    console.log('resp', response)
    const styleResponse = handleStatus(response.status)
    setWithdrawal(response); setStatus(styleResponse.status); setStyle(styleResponse.style)
  }


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
          <Box sx={cssStyle}>
            <div className="d-flex">
              <div>
                <span className="lead">Detalhes do Saque</span>
                <p className="text-muted">Saiba mais sobre o seu saque!</p>
              </div>
              <div className="ms-auto">
                <IconButton onClick={handleClose}>
                  <CloseIcon />
                </IconButton>
              </div>
            </div>
            <hr />
            {withdrawal ?
              <div className="row">
                <div className="my-3">
                  <p>Realizado em: <span>{dateMask(withdrawal.created_at)}</span></p>
                  <span style={style} className="text-center row status small">{status}</span>
                </div>

                <div className="my-3 bg-gray rounded p-3">
                  <p>Banco: <span>{withdrawal.bank_account.bank}</span></p>
                  <p>Total: <span>{moneyMask(withdrawal.amount)}</span></p>
                  <p>Dígito da agência: <span>{withdrawal.bank_account.branch_check_digit}</span></p>
                  <p>Dígito da conta: <span>{withdrawal.bank_account.account_check_digit}</span></p>
                  <p>Número da agência: <span>{withdrawal.bank_account.branch_number}</span></p>
                  <p>Número da conta: <span>{withdrawal.bank_account.account_number}</span></p>
                </div>
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