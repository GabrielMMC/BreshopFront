import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import swal from "sweetalert";

export function renderAlert({ id, deleteFunction, article, item }) {
  return (
    swal({
      title: `Deletar ${item} selecionad${article}?`,
      text: `Uma vez deletad${article}, não dará para recuperá-l${article}!`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        swal(`${item} deletad${article} com sucesso!`, {
          icon: "success",
        });
        deleteFunction(id)
      }
    })
  )
}

export function ToastContent() {
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  )
}

export function renderToast(props) {
  toast[props.type](props.error, {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
}