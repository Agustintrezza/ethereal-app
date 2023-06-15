import React, { useContext, useEffect, useReducer, useState } from "react";
import axios from "axios";
import { Store } from "../Store";
import { useNavigate, useParams } from "react-router-dom";
import { getError } from "../utils";
import Form from "react-bootstrap/Form";
// import { DayPicker } from 'react-day-picker';
import { motion } from "framer-motion";
import LoadingBox from '../components/LoadingBox';
import Button from 'react-bootstrap/Button';
import { toast } from "react-toastify";
import MessageBox from "../components/MessageBox";
// import es from 'date-fns/locale/es';
// import { BiWindows } from "react-icons/bi";
// import Spinner from "react-bootstrap/esm/Spinner";
import {AiOutlineCalendar} from "react-icons/ai";
import {BiArrowBack, BiRefresh} from "react-icons/bi";




function reducer(state, action) {

  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
      case 'PAY_REQUEST':
        return { ...state, loadingPay: true };
      case 'PAY_SUCCESS':
        return { ...state, loadingPay: false, successPay: true };
      case 'PAY_FAIL':
        return { ...state, loadingPay: false };
      case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false };
      case 'DELIVER_REQUEST':
        return { ...state, loadingDeliver: true };
      case 'DELIVER_SUCCESS':
        return { ...state, loadingDeliver: false, successDeliver: true };
      case 'DELIVER_FAIL':
        return { ...state, loadingDeliver: false };
      case 'DELIVER_RESET':
        return {
          ...state,
          loadingDeliver: false,
          successDeliver: false,
        };

    default:
      return state;
  }
}


export default function OrderAdminEditScreen () {

  const [selected, setSelected] = useState(false);
  console.log(setSelected);
  
  // console.log(selected)
  // const [stocker, setStocker] = useState('');
  const [stockdays, setStockdays] = useState(['']);
  console.log(stockdays);
  const [fechaordenservicio, setFechaordenservicio] = useState(new Date())

  const [cuposolicitado, setCuposolicitado] = useState(Number);
  const [cupodeldia, setCupodeldia] = useState(Number);
  const [cupofinal, setCupofinal] = useState(Number);

  const [stockinicial, setStockinicial] = useState(null);


  const [confirmada, setConfirmada] = useState(false);
  const [cancelada, setCancelada] = useState(false);
  const [modificada, setModificada] = useState(false);
  
  const [orderid, setOrderid] = useState('');
  console.log(orderid);
  const [fecha, setFecha] = useState(Date);
  const [fullName, setFullName] = useState('');
  const [adultos, setAdultos] = useState(0);
  const [menores, setMenores] = useState(0);
  const [bebes, setBebes] = useState(0);
  const [servicio, setServicio] = useState('');
  // const [idservicio, setIdservicio] = useState('');
  const [hospedaje, setHospedaje] = useState('');
  const [habitacion, setHabitacion] = useState('');
  const [vendedor, setVendedor] = useState('');
  const [pago, setPago] = useState('');
  const [monedapago, setMonedapago] = useState('');
  const [montocobrado, setMontocobrado] = useState('');
  const [comentariopago, setComentariopago] = useState('');
  const [phone, setPhone] = useState('');
  const [comentarios, setComentarios] = useState('');
  const [contacto_pasajero, setContacto_pasajero] = useState('');
  const [countModificacion, setCountmodificacion] = useState(0);

  

  // const [stockinicialfiltrado, setStockinicialfiltrado] = useState(null);
  // const [mensaje, setMensaje] = useState(false);

  // const [cargando, setCargando] = useState(false);
  const [mostrar, setMostrar] = useState(false);
  console.log(setMostrar);
  
  const { state } = useContext(Store);
  const { userInfo} = state;

  const params = useParams();
  const { id: orderId } = params;
  const navigate = useNavigate();


  const [{ loading, loadingUpdate, order, error, successPay, successDeliver }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: "",
    successPay: false,
    loadingPay: false,
  });

  const [idproducto, setIdproducto] = useState('');

  useEffect(() => {

    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/orders/${orderId}/modificacion`, {
          headers: { authorization: `Bearer ${userInfo.token}` }, 
        });

        setIdproducto(data.orderItems[0]._id);
        setCupofinal(data.modificacion.cupofinal || data.shippingAddress.cupofinal);
        setFechaordenservicio(data.shippingAddress.fecha);

        setCuposolicitado(cuposolicitado);

        setOrderid(data.modificacion._id || data.shippingAddress._id )
        setPhone(data.modificacion.phone || data.shippingAddress.phone )
        setFecha(data.modificacion.fecha || data.shippingAddress.fecha)
        setFullName(data.modificacion.fullName || data.shippingAddress.fullName)
        setContacto_pasajero(data.modificacion.contacto_pasajero || data.shippingAddress.contacto_pasajero)
        setAdultos(data.modificacion.adultos || data.shippingAddress.adultos)
        setMenores(data.modificacion.menores || data.shippingAddress.menores)
        setBebes(data.modificacion.bebes || data.shippingAddress.bebes)
        setHospedaje(data.modificacion.hospedaje || data.shippingAddress.hospedaje)
        setVendedor(data.modificacion.vendedor || data.shippingAddress.vendedor)
        setHabitacion(data.modificacion.habitacion || data.shippingAddress.habitacion)
        setPago(data.modificacion.pago || data.shippingAddress.pago)
        setMonedapago(data.modificacion.monedapago || data.shippingAddress.monedapago)
        setMontocobrado(data.modificacion.montocobrado || data.shippingAddress.montocobrado)
        setComentariopago(data.modificacion.comentariopago || data.shippingAddress.comentariopago)
        setComentarios(data.modificacion.comentarios || data.shippingAddress.comentarios)
        setServicio(data.modificacion.servicio || data.shippingAddress.servicio)
        setCountmodificacion(data.modificacion.countModificacion + 1);
        

        console.log(data)
        
    
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }

     
    };


    // console.log(idproducto)

    
    if (!userInfo) {
      return navigate("/login");
    }
    if (!order._id || successPay || successDeliver || (order._id && order._id !== orderId)) {
      fetchOrder();
    if (successPay) {
      dispatch({ type: 'PAY_RESET' });
    }
    if (successDeliver) {
      dispatch({ type: 'DELIVER_RESET' });
    }


    }

    refetchOrder();
  }, [order, userInfo, orderId, navigate, successPay, successDeliver, cuposolicitado]);

  const refetchOrder = async (e) => {
    try {
      // dispatch({ type: "FETCH_REQUEST" });
      const { data } = await axios.get(`/api/orders/${orderId}/modificacion`, {
        headers: { authorization: `Bearer ${userInfo.token}` }, 
      });

      setIdproducto(data.orderItems[0]._id);
      setCupofinal(data.modificacion.cupofinal || data.shippingAddress.cupofinal);
      setFechaordenservicio(data.shippingAddress.fecha);

      setCuposolicitado(cuposolicitado);

      setOrderid(data.modificacion._id || data.shippingAddress._id )
      setPhone(data.modificacion.phone || data.shippingAddress.phone )
      setFecha(data.modificacion.fecha || data.shippingAddress.fecha)
      setFullName(data.modificacion.fullName || data.shippingAddress.fullName)
      setContacto_pasajero(data.modificacion.contacto_pasajero || data.shippingAddress.contacto_pasajero)
      setAdultos(data.modificacion.adultos || data.shippingAddress.adultos)
      setMenores(data.modificacion.menores || data.shippingAddress.menores)
      setBebes(data.modificacion.bebes || data.shippingAddress.bebes)
      setHospedaje(data.modificacion.hospedaje || data.shippingAddress.hospedaje)
      setVendedor(data.modificacion.vendedor || data.shippingAddress.vendedor)
      setHabitacion(data.modificacion.habitacion || data.shippingAddress.habitacion)
      setPago(data.modificacion.pago || data.shippingAddress.pago)
      setMonedapago(data.modificacion.monedapago || data.shippingAddress.monedapago)
      setMontocobrado(data.modificacion.montocobrado || data.shippingAddress.montocobrado)
      setComentariopago(data.modificacion.comentariopago || data.shippingAddress.comentariopago)
      setComentarios(data.modificacion.comentarios || data.shippingAddress.comentarios)
      setServicio(data.modificacion.servicio || data.shippingAddress.servicio)
      setCountmodificacion(data.modificacion.countModificacion + 1);
      

      console.log(data)
      
  
      // dispatch({ type: "FETCH_SUCCESS", payload: data });
    } catch (err) {
      dispatch({ type: "FETCH_FAIL", payload: getError(err) });
    }

    // setTimeout(() => {
    //   refetchOrder();
    // }, 5000);

  }


  useEffect(() => {
    const fetchProduct = async (e) => {
      try {
        const { data } = await axios.get(`/api/products/${idproducto}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        if(data.ampliacion.length > 0) {

          let diAmpliado = data.ampliacion.find((x) => x.fecha === fecha)
          if(diAmpliado) {
            setStockinicial(diAmpliado.stockampliado)
            console.log('if',stockinicial)
          } else {
            setStockinicial(18)
          }

        } else {
          setStockinicial(18)
          console.log('else',stockinicial)
        }
        console.log(data)
      } catch(err) {
        console.log('Error Catch',err)
      }
    }
    fetchProduct();
  })

  useEffect(() => {
    const fetchStock = async (e) => {

      // console.log('Entro a fetchData', userInfo.token)
      try {
        // dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/stock/${idproducto}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        // dispatch({ type: 'FETCH_SUCCESS', payload: data });
        setStockdays(data);
        // setStockinicial(18)

        let copo = data.find((x) => x._id === fecha) 
        // console.log(copo);

        if(copo) {
          // console.log(copo)
          const pasajeros = copo.pasajeros
          setCupodeldia(pasajeros)
          // console.log(pasajeros);
        } else {
          console.log('no hay dia seleccionado')
          setCupodeldia(0)
        }
        // return {booked: stockDays}
      } 
      catch (err) {
        console.log('Error catch')
      }
    };
    fetchStock();
    const llamarCupo = setInterval(() => {
          refetchStock();
          console.log('llama stock del dia', llamarCupo)
        }, 5000)
    
  }, [idproducto, userInfo.token ]);

  // console.log(order);

  const refetchStock = async (e) => {

    // console.log('Entro a fetchData', userInfo.token)
    try {
      // dispatch({ type: 'FETCH_REQUEST' });
      const { data } = await axios.get(`/api/orders/stock/${idproducto}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });

      let copo = data.find((x) => x._id === fecha) 
      // console.log(copo);

      if(copo) {
        // console.log(copo)
        const pasajeros = copo.pasajeros
        setCupodeldia(pasajeros)
        // console.log(cupodeldia);
      } else {
        // console.log('no hay dia seleccionado')
        setCupodeldia(0)
      }
      // return {booked: stockDays}
    } 
    catch (err) {
      console.log('Error catch')
    }

  };

    // console.log(stockdays)

    // console.log('cupodeldia',cupodeldia);
    // console.log('cupofinaldeldia',cupofinal);

    const lugaresdisponibles = ((stockinicial - cupodeldia) + cupofinal);
    // console.log(lugaresdisponibles);


  const [showhide, setShowhide] = useState('');

  const yesnoCheck = (event) => {
    const getuser = event.target.value;
    setShowhide(getuser);
    setPago(event.target.value);
  }


  const funcionCallback = (e) => {
    validacionJs(e)
  }

  async function grabarModificacion(e) {

    sumarCupos();

    const fechaModificacion = new Date();

    if(window.confirm(`¿Estás seguro que deseas modificar la reserva? ${order.shippingAddress.servicio}`)) {
      
      try {
        dispatch({ type: 'DELIVER_REQUEST' });
        const { data } = await axios.put(
          `/api/orders/${order._id}/admin/modificacion`,
            {
            fechaModificacion, 
            servicio,
            fecha,
            fullName,
            adultos,
            menores,
            bebes,
            hospedaje,
            habitacion,
            vendedor,
            pago,
            monedapago,
            montocobrado,
            comentariopago,
            phone,
            comentarios,
            contacto_pasajero,
            confirmada,
            cancelada,
            modificada,
            countModificacion,
            // modificadaconfirm
        },
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          },
        );
        dispatch({ type: 'DELIVER_SUCCESS', payload: data });
        toast.success('Reserva modificada exitosamente');
      } catch (err) {
        toast.error(getError(err));
        dispatch({ type: 'DELIVER_FAIL' });
      }
      navigate(`/order/${order._id}`);
       
      } else {
        window.alert('No se realizó ningún cambio')
        return false;
        // navigate(`/admin/order/edit/${order._id}`);

      }
    
  }


  const sumarCupos = (e) => {

    // setCupofinal(cupo)
    console.log('sumar cupo')
    // llamarCupo();
    if(adultos || bebes || menores) {
      // let cuposolicitados = 0;
      // cuposolicitados = (parseInt(adultos) + parseInt(menores) + parseInt(bebes) );

      if(!fecha && !selected && !mostrar) {
        // console.log('entro aca');
        document.getElementById('validacion-sin-dia').innerHTML = 'Confirma él cupo seleccionando y verificando un día en el calendario'
        
        // setTimeout(() => {
        //   document.getElementById('validacion-sin-dia').innerHTML = ''
        // }, 5000);

      } else {
        document.getElementById('validacion-sin-dia').innerHTML = ''
      }

      let  cuposolicitado = (parseInt(adultos) + parseInt(menores) + parseInt(bebes) );
              if(cuposolicitado > lugaresdisponibles) {
                setTimeout(() => {
                  document.getElementById('validacion').innerHTML = `La cantidad de pasajeros (${cuposolicitado}) supera el stock disponible para este día (${lugaresdisponibles}). Si necesitas ampliar el cupo, contactanos. Verificá siempre el cupo antes de reservar.`
                  document.getElementById('boton-submit').disabled = true;
                }, 1);
                // console.log('tiene que ir cartel')
                
              } else {
                console.log('hay que sacar cartel')
                document.getElementById('validacion').innerHTML = ""
                document.getElementById('boton-submit').disabled = false;
              }
      
      
      if(cuposolicitado > lugaresdisponibles) {
        document.getElementById('validacion').innerHTML = `La cantidad de pasajeros (${cuposolicitado}) supera el stock disponible para este día (${lugaresdisponibles}). Si necesitas ampliar el cupo, contactanos.`
        document.getElementById('boton-submit').disabled = true;
        console.log('es mayor')
      } else {
        document.getElementById('validacion').innerHTML = ""
        document.getElementById('boton-submit').disabled = false;
        console.log('es menor')
      }
    } 
    
  }

  let fechaServicio = new Date(fechaordenservicio)
  let fechaServicio1 = fechaServicio.toLocaleDateString('es-ES', {dateStyle: 'full'});


  const validacionJs = (e) => {

      if(!modificada && !confirmada && !cancelada) {
        document.getElementById('validacion-status').innerHTML = "Es necesario seleccionar un status para la reserva";
        document.getElementById('status').scrollIntoView();
        e.preventDefault()
      }


      let regExp = /[a-zA-Z]/g;

      if(!fullName) {
        document.getElementById('validacion-fullName').innerHTML = "Es necesario ingresar un nombre";
        document.getElementById('up').scrollIntoView();
        e.preventDefault()
      } else if (fullName.length <= 2) {
        document.getElementById('validacion-fullName-min').innerHTML = "El nombre debe contener al menos 2 caracteres";
        document.getElementById('up').scrollIntoView();
        e.preventDefault()
      } else if (fullName.length >= 50) {
        document.getElementById('validacion-fullName-max').innerHTML = "50 es el máximo permitido de caracteres";
        document.getElementById('up').scrollIntoView();
        e.preventDefault()
      } 

      if(!contacto_pasajero) {
        document.getElementById('validacion-contacto_pasajero').innerHTML = "Es necesario ingresar un número de teléfono";
        document.getElementById('up').scrollIntoView();
        e.preventDefault()
      } else if (contacto_pasajero.length < 10) {
        document.getElementById('validacion-contacto_pasajero-formato').innerHTML = "Formato inválido, el número debe contener 10 caracteres";
        document.getElementById('up').scrollIntoView();
        e.preventDefault()
      } else if (contacto_pasajero.match(regExp)) {
        document.getElementById('validacion-contacto_pasajero-positivo').innerHTML = "El número no puede contener letras";
        document.getElementById('up').scrollIntoView();
        e.preventDefault()
      } 

      if(!adultos || adultos == '0') {
        document.getElementById('validacion-adultos').innerHTML = "Tiene que haber al menos un pasajero adulto";
        document.getElementById('up').scrollIntoView();
        e.preventDefault()
      }

      if(!hospedaje) {
        document.getElementById('validacion-hospedaje').innerHTML = "Es necesario indicar un hospedaje o punto de encuentro";
        document.getElementById('up').scrollIntoView();
        e.preventDefault()
      }

      if(!pago || pago === '') {
        document.getElementById('validacion-pago').innerHTML = "Es necesario seleccionar al menos un medio de pago";
        document.getElementById('up').scrollIntoView();
        e.preventDefault()
      }

      if(pago === "Pago Manual") {
        console.log(pago, 'Pago Manual')
        if(monedapago === '') {
          document.getElementById('validacion-moneda').innerHTML = "Es necesario seleccionar al menos una moneda";
          document.getElementById('up').scrollIntoView();
          e.preventDefault()
        } 
      }
      
      if (pago === "Pago Manual") {
        if(montocobrado === '0' || montocobrado === '' || !montocobrado) {
          document.getElementById('validacion-montocobrado').innerHTML = "Es necesario indicar el monto cobrado o por cobrar";
          document.getElementById('up').scrollIntoView();
          e.preventDefault()
        } 
      }

      // /* Mensajes y funcionalidades de validación del formulario */

        setTimeout(() => {

          document.getElementById('validacion-pago').innerHTML = "";
          document.getElementById('validacion-status').innerHTML = "";

          document.getElementById('validacion-fullName').innerHTML = "";
          document.getElementById('validacion-fullName-min').innerHTML = "";
          document.getElementById('validacion-fullName-max').innerHTML = "";
          document.getElementById('validacion-hospedaje').innerHTML = "";

          document.getElementById('validacion-adultos').innerHTML = "";
          document.getElementById('validacion-contacto_pasajero-formato').innerHTML = "";
          document.getElementById('validacion-contacto_pasajero-positivo').innerHTML = "";
          document.getElementById('validacion-contacto_pasajero').innerHTML = "";
          


          document.getElementById('validacion-moneda').innerHTML = "";
          document.getElementById('validacion-montocobrado').innerHTML = "";
        // } 
        }, 3000);


        let  cuposolicitado = (parseInt(adultos) + parseInt(menores) + parseInt(bebes) );
              if(cuposolicitado > lugaresdisponibles) {
                document.getElementById('validacion').innerHTML = `La cantidad de pasajeros (${cuposolicitado}) supera el stock disponible para este día (${lugaresdisponibles}). Si necesitas ampliar el cupo, contactanos. Verificá siempre el cupo antes de reservar.`
                document.getElementById('boton-submit').disabled = true;
                e.preventDefault()

                // setTimeout(() => {
                //   document.getElementById('validacion').innerHTML = `La cantidad de pasajeros (${cuposolicitado}) supera el stock disponible para este día. Si necesitas ampliar el cupo, contactanos. Verificá siempre el cupo antes de reservar.`
                //   // document.getElementById('boton-submit').disabled = true;
                // }, 0001);
                // console.log('tiene que ir cartel')
                // e.preventDefault();
              } else {
                console.log('hay que sacar cartel')
                document.getElementById('validacion').innerHTML = ""
                document.getElementById('boton-submit').disabled = false;
              }

}


  return loading ?  (
    <LoadingBox></LoadingBox>
    ) : error ? (
      <MessageBox variant="danger">{error}</MessageBox>
    ) : (
    <div className="container extra-container">

      <div className="contenedor-titulo-editar-reserva">
        <div id="status">
          {/* <h1 className="fs-1 d-flex align-items-center">Modificá tu reserva! ({orderid.substring(18,24)}) <p className="subtitulo-editar-reserva">- Completá los cambios y esperá nuestra confirmación.</p></h1> */}
          <h3 className="titulo-edicion-modificacion">{servicio}</h3>
          {/* <h3 className="fw-light mt-2">{vendedor} // {phone}</h3> */}
          
          <p className="label"> <AiOutlineCalendar className="icono-calendario-modificacion"/> <strong className="servicio-disponibilidad-modificacion"> {fechaServicio1} ({lugaresdisponibles} lugares disponibles)</strong></p>
        </div>
        <div className="d-flex align-items-center">


            <div className="contenedor-enlace-refresh-orden" onClick={(e)=> refetchOrder()}>
              <BiRefresh className="icono-refresh-orden"/><p className="link-historial-reserva">Actualizar reserva</p>           
            </div>
          <Button
            className="boton-editar-admin-reservas-modificacion"
            type="button"
            variant="primary"
            onClick={() => {
              navigate(`/order/${order._id}`);
            }}
            >
            <BiArrowBack className="icono-volver-modificacion"/>Ir a la reserva
          </Button>       
        </div>
      </div>

      <div> 
              {/* <h2>Hacer click en "Actualizar" para guardar los cambios</h2> */}
            {/* <h1 className="titulo-status-modificacion">Seleccionar un status</h1> */}
            
            <div className="contenedor-check-editar-reservas">

                  <div className="contenedor-interno-check-modificacion">
                      <div className="check-editar-reservas">
                        <Form.Check
                              type="checkbox"
                              id="confirmada"
                              label={confirmada ? ("Quitar status de confirmación a la reserva") : ("Marcar la reserva como confirmada")}
                              checked={confirmada}
                              onChange={()=>setConfirmada(confirmada=> !confirmada)}
                          />
                      </div>

                      <div className="check-editar-reservas">
                        <Form.Check
                              type="checkbox"
                              id="modificada"
                              label={modificada ? ("Quitar modificación a la reserva") : ("Marcar la reserva como modificada")}
                              checked={modificada}
                              onChange={()=>setModificada(modificada=> !modificada)}
                          />
                      </div>

                      <div className="check-editar-reservas">
                        <Form.Check
                              type="checkbox"
                              id="cancelada"
                              label={cancelada ? ("Quitar cancelación a la reserva") : ("Marcar la reserva como cancelada")}
                              // disabled={!cancelada}
                              checked={cancelada}
                              onChange={()=>setCancelada(cancelada=> !cancelada)}
                          />
                      </div>
                  </div>

                  <div className="mt-4 fs-4">
                      <p id="validacion-status" className="mensaje-status-modificacion"></p>      
                  </div>
              </div>    


          </div>
      
      <Form onSubmit={()=>grabarModificacion()}>
      <div id="up"  className="grid-formulario">

        <div className="container bloque-form1">
             

              <Form.Group className="contenedor-input-modificacion" controlId="fullName">
                <Form.Label className="mb-1 fs-5 label">
                  Nombre y Apellido del titular de la reserva *
                </Form.Label>
                <Form.Control
                  value={fullName}
                  name="fullName"
                  onChange={(e) => setFullName(e.target.value)}
                  // required
                />
              </Form.Group>
                <p id="validacion-fullName" className="mensaje"></p>  
                <p id="validacion-fullName-min" className="mensaje"></p>  
                <p id="validacion-fullName-max" className="mensaje"></p>  

              <Form.Group className="contenedor-input" controlId="contacto_pasajero">
                <Form.Label className="mb-1 fs-5 label">
                  Teléfono del Pasajero *
                </Form.Label>
                <Form.Control
                  type="text"
                  name="contacto_pasajero"
                  value={contacto_pasajero}
                  onChange={(e) => setContacto_pasajero(e.target.value)}
                  // required
                />
              </Form.Group> 

              <p id="validacion-contacto_pasajero" className="mensaje"></p>  
              <p id="validacion-contacto_pasajero-formato" className="mensaje"></p>  
              <p id="validacion-contacto_pasajero-positivo" className="mensaje"></p> 

              <Form.Group className="contenedor-input" controlId="adultos">
                  <Form.Label className="mb-1 fs-5 label">
                    Cantidad de pasajeros adultos * <strong className="texto-informativo-input-labels"></strong>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    max="18"
                    name="adultos"
                    value={adultos}
                    onChange={(e) => setAdultos(e.target.value)}
                    onClick={(e) => sumarCupos()}
                    // required
                  />
                </Form.Group>

                <p id="validacion-adultos" className="mensaje"></p>  


                <Form.Group className="contenedor-input" controlId="menores">
                <Form.Label className="mb-1 fs-5 label">
                  Cantidad de pasajeros menores <strong className="texto-informativo-input-labels"></strong>
                </Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  max="17"
                  // max="12"
                  name="menores"
                  value={menores}
                  onChange={(e) => setMenores(e.target.value)}
                  onClick={(e) => sumarCupos()}
                />
              </Form.Group>

              <Form.Group className="contenedor-input" controlId="bebes">
                <Form.Label className="mb-1 fs-5 label">
                  Bebés <strong className="texto-informativo-input-labels"></strong>
                </Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  max="17"
                  // max="12"
                  name="bebes"
                  value={bebes}
                  onChange={(e) => setBebes(e.target.value)}
                  onClick={(e) => sumarCupos()}
                />
              </Form.Group>

              </div>
            

              <div className="container bloque-form2">

              <motion.div initial={{ scale: 0.1 }} animate={{ scale: 1, x: -3 }} transition={{ duration: 2 }}>
                    <p  className="mensaje2" id="validacion-sin-dia"></p>
                    <p  className="mensaje2" id="validacion"></p>
              </motion.div>

              <Form.Group className="contenedor-input" controlId="hospedaje">
                <Form.Label className="mb-1 fs-5 label">Hospedaje *  <strong className="texto-informativo-input-labels"></strong></Form.Label>
                <Form.Control
                  type="text"
                  value={hospedaje}
                  name="hospedaje"
                  onChange={(e) => setHospedaje(e.target.value)}
                  // required
                />
              </Form.Group>
              <p id="validacion-hospedaje" className="mensaje"></p>  


              <Form.Group className="contenedor-input" controlId="habitacion">
                <Form.Label className="mb-1 fs-5 label">Habitación</Form.Label>
                <Form.Control
                  value={habitacion}
                  name="habitacion"
                  onChange={(e) => setHabitacion(e.target.value)}
                  // required
                />
              </Form.Group>




              <Form.Group className="contenedor-input" controlId="pago">
                <Form.Label className="mb-1 fs-5 label">Forma de pago *</Form.Label>
                <Form.Select
                  className="form-control"
                  type="select"
                  value={pago}
                  name="pago"
                  onChange={(e) => yesnoCheck(e)}
                  // required
                > 
                  <option value="">--Seleccionar forma de pago--</option>
                  <option value="Cuenta Corriente">Cuenta corriente</option>
                  <option value="Pago Manual">Pago manual</option>

                </Form.Select>
                
              </Form.Group>

              <p id="validacion-pago" className="mensaje"></p>  


              {
                showhide === 'Pago Manual' &&  (
                  <>    
                <motion.div initial={{ scale: 0.99 }} animate={{ scale: 1, x: -3 }} transition={{ duration: 1 }} >
                <div className="contenedor-radio-shipping-pago">
                
                <div className="contenedor-check-moneda-shipping">
                  <div className=" fs-4">
                    <Form.Check
                      type="radio"
                      id="pesos"
                      label="Pesos Argentinos"
                      value="Pesos Argentinos"
                      checked={monedapago === 'Pesos Argentinos'}
                      onChange={(e) => setMonedapago(e.target.value)}
                    />
                  </div>
                  <div className=" fs-4">
                    <Form.Check
                      type="radio"
                      id="dolares"
                      label="Dolares"
                      value="Dolares"
                      checked={monedapago === 'Dolares'}
                      onChange={(e) => setMonedapago(e.target.value)}
                    />
                  </div>
                  <div className=" fs-4">
                    <Form.Check
                      type="radio"
                      id="reales"
                      label="Reales"
                      value="Reales"
                      checked={monedapago === 'Reales'}
                      onChange={(e) => setMonedapago(e.target.value)}
                    />
                  </div>

                </div>

                <div>
                  <p id="validacion-moneda" className="mensaje"></p>  
                </div>

                </div>
                <Form.Group className="contenedor-input" controlId="montocobrado">
                <Form.Label className="mb-1 fs-5 label">
                  Monto a pagar al guía al inicio de la excursión, o en la entrada de la casa de tango *
                </Form.Label>
                <Form.Control
                  type="number"
                  // min="0"
                  name="montocobrado"
                  value={montocobrado}
                  onChange={(e) => setMontocobrado(e.target.value)}
                  // required
                />
              </Form.Group>

                <div> 
                  <p id="validacion-montocobrado" className="mensaje"></p>      
                </div>
              {/* <p className="mensaje"> {errors.montocobrado?.message} </p> */}

              

                <Form.Group className="contenedor-input" controlId="comentariopago">
                    <Form.Label className="mb-1 fs-5 label">Comentarios acerca del pago</Form.Label>
                    <Form.Control
                    as="textarea"
                    rows={3}
                    name="comentariopago"
                    value={comentariopago}
                    onChange={(e) => setComentariopago(e.target.value)} 
                    // required
                    />
                  </Form.Group>

                  </motion.div>  
                  </>
                )
              }

              <Form.Group className="contenedor-input" controlId="comentarios">
                <Form.Label className="mb-1 fs-5 label">Comentarios útiles para la reserva</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="comentarios"
                  value={comentarios}
                  onChange={(e) => setComentarios(e.target.value)}
                  // required
                />
              </Form.Group>

              </div>

            </div>

            <div className="mb-3 d-flex justify-content-end">
              <Button id="boton-submit" onClick={(e)=> funcionCallback(e)} className="boton-card mt-3" disabled={loadingUpdate} type="submit">
                Modificar
              </Button>
              {loadingUpdate && <LoadingBox></LoadingBox>}
      </div>

      </Form>


    </div>
  )
}
