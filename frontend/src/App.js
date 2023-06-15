import React, {useState} from 'react';
import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
// import {Store} from './Store';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import Header from './components/header/Header';

import SigninScreen from './screens/SigninScreen';
import HomeScreen from './screens/HomeScreen';
import Footer from './components/footer/Footer';
import SignupScreen from './screens/SignUpScreen';
import AllProducts from './screens/AllProducts';
// import CartScreen from './screens/CartScreen';
import ProfileScreen from './screens/ProfileScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import DashboardScreen from './screens/DashboardScreen';
import AdminRoute, { AuthRoute } from './components/AdminRoute';
import ProductListScreen from './screens/ProductListScreen';
import OrderListScreen from './screens/OrderListScreen';
import UserListScreen from './screens/UserListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderScreen from './screens/OrderScreen';
import UserEditScreen from './screens/UserEditScreen';

import ShippingAddressScreen from './screens/ShippingAdressScreen';
import ShippingAddressFirstScreen from './screens/formulario-reserva/ShippingAddressFirstScreen';

import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import ProductScreen from './screens/ProductScreen';
import Whatsapp from './components/whatsapp/Whatsapp.jsx';
// import Carrito from './components/carrito/Carrito';
import Botonera from '../src/components/botonera/Botonera.jsx';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
// import Header2 from './components/header2/Header2.jsx';
import Header3 from './components/header3/Header3.jsx';
import FavoritosScreen from './screens/FavoritosScreen';
import Cotizaciones from './components/cotizaciones/Cotizaciones.jsx';
import Confcotizacion from './components/confcotizacion/Confcotizacion';
import ChangePasswordScreen from './screens/ChangePasswordScreen';
import CrearNotificacionScreen from './screens/CrearNotificacionScreen';
import AmpliarCupoScreen from './screens/AmpliarCupoScreen';
import Confcupo from './components/confcupo/Confcupo';
import ErrorPageScreen from './screens/ErrorPageScreen';
import ScrollToTop from './components/ScrollToTop';
import Descargables from './components/descargables/Descargables';
import OrderEditScreen from './screens/OrderEditScreen';
import OrderAdminEditScreen from './screens/OrderAdminEditScreen';
import SolicitudCuenta from './screens/SolicitudCuenta';
import NotificacionesScreen from './screens/NotificacionesScreen';
import SolicitudCuentaRegistro from './screens/SolicitudCuentaRegistro';
import Payment from './screens/Payment';
import PaymentSuccess from './screens/PaymentSuccess';
import ShippingAddressSecondScreen from './screens/formulario-reserva/ShippingAddressSecondScreen';
import FirstQrScreen from './screens/qr/FirstQrScreen';
import IngresoQrScreen from './screens/qr/IngresoQrScreen';




function App() {

  const [chatbot, setChatbot] = useState(false);

  const toggleChatbot = () => {
    console.log('se disparo');
    chatbot ? setChatbot(false) : setChatbot(true);
  };

  return (
    <>
      <div className="App" id='App'>

        <BrowserRouter>
        <ScrollToTop/> 
        <ToastContainer position="bottom-right" theme="dark" className="toastify" autoClose={4000} limit={1}/>
        {/* <Header2/> */}
        <Header3/>
              <Routes>
                <Route path="*" element={<ErrorPageScreen/>}></Route>
                <Route path="/product/:slug" element={<ProductScreen/>}></Route>
                <Route path="/login" element={<SigninScreen/>}></Route>
                <Route path="/search" element={<AllProducts/>}></Route>
                <Route path="/solicitud-cuenta" element={<SolicitudCuenta/>}></Route>
                <Route path="/solicitud-cuenta-registro" element={<SolicitudCuentaRegistro/>}></Route>
                
                <Route path="/payment" element={<Payment/>}></Route>
                <Route path="/payment-success" element={<PaymentSuccess/>}></Route>
                <Route path="/qr" element={<FirstQrScreen/>}></Route>

                <Route path="/qr/:id" element={<IngresoQrScreen/>}></Route>


                
               
                <Route path="/forgot-password" element={<ForgotPasswordScreen/>}></Route>
                <Route path="/reset-password/:id/:token" element={<ResetPasswordScreen/>}></Route>
                <Route path="/cotizaciones" element={<AuthRoute><Cotizaciones/></AuthRoute>}></Route>
                <Route path="/documentos-descargables" element={<AuthRoute><Descargables/></AuthRoute>}></Route>
                <Route path="/ampliar-cupo" element={<AuthRoute><AmpliarCupoScreen/></AuthRoute>}></Route>
                <Route path="/confirmacion-cotizacion" element={<AuthRoute><Confcotizacion/></AuthRoute>}></Route>
                <Route path="/confirmacion-cupo" element={<AuthRoute><Confcupo/></AuthRoute>}></Route>
                <Route path="/change-password" element={<AuthRoute><ChangePasswordScreen/></AuthRoute>}></Route>
                <Route path="/favoritos" element={<AuthRoute><FavoritosScreen/></AuthRoute>}></Route>
                <Route path="/profile" element={<AuthRoute><ProfileScreen/></AuthRoute>}></Route>
                <Route path="/historial-de-reservas" element={<AuthRoute><OrderHistoryScreen/></AuthRoute>}></Route>
                <Route path="/order/:id" element={<AuthRoute><OrderScreen/></AuthRoute>}></Route>

                <Route path="/shipping" element={<AuthRoute><ShippingAddressScreen/></AuthRoute>}></Route>
                <Route path="/shipping-first" element={<AuthRoute><ShippingAddressFirstScreen/></AuthRoute>}></Route>
                <Route path="/shipping-second" element={<AuthRoute><ShippingAddressSecondScreen/></AuthRoute>}></Route>


                <Route path="/placeorder" element={<AuthRoute><PlaceOrderScreen/></AuthRoute>}></Route>
                <Route path="/notificaciones" element={<AuthRoute><NotificacionesScreen/></AuthRoute>}></Route>
                <Route path="/order/edit/:id" element={<AuthRoute><OrderEditScreen /></AuthRoute>}></Route> 



                <Route path="/admin/dashboard" element={<AdminRoute><DashboardScreen /></AdminRoute>}></Route>
                <Route path="/admin/products" element={<AdminRoute><ProductListScreen /></AdminRoute>}></Route>
                <Route path="/admin/user/:id" element={<AdminRoute><UserEditScreen /></AdminRoute>}></Route>
                <Route path="/admin/crear-notificacion" element={<AdminRoute><CrearNotificacionScreen/></AdminRoute>}></Route>
                <Route path="/admin/payment" element={<AdminRoute><PaymentMethodScreen/></AdminRoute>}></Route>
                <Route path="/admin/product/:id" element={ <AdminRoute> <ProductEditScreen /></AdminRoute>}></Route>
                <Route path="/admin/orders" element={<AdminRoute><OrderListScreen /></AdminRoute>}></Route>
                <Route path="/admin/users" element={<AdminRoute><UserListScreen /></AdminRoute>}></Route>
                <Route path="/admin/crear-usuario" element={<AdminRoute><SignupScreen /></AdminRoute>}></Route>
                <Route path="/admin/order/edit/:id" element={<AdminRoute><OrderAdminEditScreen/></AdminRoute>}></Route> 


                <Route path="/" element={<HomeScreen/>}></Route>

                {/* <Route path="/reservas" element={<CartScreen/>}></Route>*/}
                {/* <Route path="/signup" element={<SignupScreen/>}></Route> */}
              </Routes>

          <Whatsapp/>
          <Botonera toggleChatbot={toggleChatbot}/>

          {/* <Carrito/> */}
          <Footer/>



      </BrowserRouter>

      </div>


    </>
  );
}

export default App;
