import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Profile from "../pages/Dashboard/Profile";
import Home from "../pages/Home";
import Product from "../pages/Product";
import Breshop from "./Breshop/Breshop";
import GuestRoutes from "./GuestRoutes";
import AddProduct from "./Product/AddProduct";
import EditProduct from "./Product/EditProduct";
import ListProducts from "./Product/ListProducts";
import Address from "../pages/Dashboard/Address";
import Payment from "../pages/Dashboard/Payment";
import Orders from "../pages/Dashboard/Order/Order";
import Recipient from "./Breshop/Recipient";
import PaymentScreen from "../pages/Paymant/PaymentScreen";
import Withdrawal from "./Financial/Withdrawal";
import RecipientOrders from "./Order/RecipientOrders";

const PrivateRoute = (props) => {
  const token = useSelector((state) => state.AppReducer.token);

  return token != null ? (
    <Home {...props}></Home>
  ) : (
    <Navigate to={{ pathname: "/login", state: { from: props.location } }} />
  );
};

const LoginRoute = (props) => {
  const token = useSelector((state) => state.AppReducer.token);
  return token == null ? (
    <Login {...props} />
  ) : (
    <Navigate to={{ pathname: "/home", state: { from: props.location } }} />
  );
};

const RoutesContainer = () => {
  const dispatch = useDispatch();
  let token = localStorage.getItem("token");
  let user = localStorage.getItem("user");
  let cartItems = localStorage.getItem("cart_items");
  let breshop = localStorage.getItem("breshop");

  user = JSON.parse(user);
  if (user == null || user === undefined) {
    user = {};
  }

  dispatch({ type: "login", payload: { token: token, user: user } });
  dispatch({ type: "cart_items", payload: cartItems ? JSON.parse(cartItems) : '' });
  dispatch({ type: "dados", payload: breshop ? { breshop: JSON.parse(breshop) } : null });

  return (
    <Routes>
      <Route path={"/login"} element={<LoginRoute />} />
      <Route path={"/register"} element={<Register />} />
      <Route path={"product/:id"} element={<Product />} />
      <Route path={"/payment"} element={<PaymentScreen />} />
      <Route path={"/home"} element={<PrivateRoute />} />
      <Route path={"/profile"} element={<Profile />}>
        <Route path={"address"} element={<Address />} />
        <Route path={"payment"} element={<Payment />} />
        <Route path={"orders"} element={<Orders />} />
        <Route path={"breshop"} element={<Breshop />} />
        <Route path={"breshop/recipient"} element={<Recipient />} />
        <Route path={"products"} element={<ListProducts />} />
        <Route path={"product/add"} element={<AddProduct />} />
        <Route path={"product/edit/:id"} element={<EditProduct />} />
        <Route path={"withdrawals"} element={<Withdrawal />} />
        <Route path={"recipient-orders"} element={<RecipientOrders />} />
      </Route>
      <Route path={"/*"} element={<GuestRoutes />} />
    </Routes>
  );
};

export default RoutesContainer;
