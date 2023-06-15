import React, {
  useContext,
  useState,
  useEffect,
  useReducer,
} from "react";
// import { getError } from '../utils';
import { Helmet } from "react-helmet-async";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Store } from "../Store";
// import CheckoutSteps from "../components/CheckoutSteps";
import axios from "axios";
// import logger from "use-reducer-logger";
// import Card from 'react-bootstrap/Card';
// import ListGroup from 'react-bootstrap/ListGroup';
// import ListGroupItem from "react-bootstrap/esm/ListGroupItem";
// import Row from "react-bootstrap/Row"

import { DayPicker } from 'react-day-picker';
// import isBefore from 'date-fns/isBefore'
import 'react-day-picker/dist/style.css';

import Spinner from 'react-bootstrap/Spinner';



import es from 'date-fns/locale/es';
// import { format } from "date-fns";
import add from 'date-fns/add'
// import getTime from 'date-fns/getTime'
// import differenceInHours from 'date-fns/differenceInHours';
// import { format } from 'date-fns';
// import {parseISO} from 'date-fns';
// import isTomorrow from 'date-fns/isTomorrow'

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import * as yup from "yup";

// import { CSSTransition } from 'react-transition-group';
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { getError } from "../utils";
import MessageBox from "../components/MessageBox";
import LoadingBox from "../components/LoadingBox";


// const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
// const phoneRegExp = /^((\(?\d{3}\)? \d{4})|(\(?\d{4}\)? \d{3})|(\(?\d{5}\)? \d{2}))-\d{4}$/gm
// const phoneRegExp = /^(?=(\D*\d){11}$)\(?\d{3,5}\)?[- .]?\d{2,4}[- .]?\d{4}$/
const phoneRegExp = /^((?:\(?\d{2}\)?[- .]?\d{4}|\(?\d{4}\)?[- .]?\d{3}|\(?\d{5}\)?[- .]?\d{2})[- .]?\d{4})$/

const schema = yup.object().shape({
  // fecha: yup.date().required("Es necesario seleccionar y validar al menos una fecha"), 
  // montocobrado: yup.number().required("Es necesario indicar el monto de la operacion").min(1, "El monto no puede ser 0").typeError("Es necesario indicar el monto de la operación"), 
  fullName: yup.string().required("El nombre es un campo obligatorio y debe tener al menos 2 caracteres").min(2, "El campo debe tener al menos 2 caracteres"),
  // contacto_pasajero: yup.string().required("El teléfono es un campo obligatorio"),
  contacto_pasajero: yup.string().matches(phoneRegExp, 'Formáto de teléfono inválido'),
  adultos: yup.number().required("La reserva debe tener al menos un pasajero adulto")
    .positive("Debe ser un número positivo")
    // .integer("Debe ser un número entero")
    .min(1, "Tiene que haber al menos un pasajero adulto indicado"),
    // .max(18, "Tiene que haber al menos un pasajero adulto indicado"),
    // .typeError("La reserva debe tener al menos un pasajero adulto"),
  hospedaje: yup.string().required("El hospedaje es un campo obligatorio"),
  pago: yup.string().required("Debe haber al menos un medio de pago seleccionado"),
  //   email: yup.string().email("Formato Inválido").required("Es email es obligatorio"), 
  
});


const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
      return {
        ...state,
        loadingCreate: false,
      };
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
        return {
          ...state,
          loadingDelete: false,
          successDelete: true,
        };
      case 'DELETE_FAIL':
        return { ...state, loadingDelete: false, successDelete: false };
  
      case 'DELETE_RESET':
        return { ...state, loadingDelete: false, successDelete: false };

    default:
      return state;
  }
};


export default function ShippingAddressScreen() {

  const {
    register,
    clearErrors,
    handleSubmit,
    formState: { errors },

  } = useForm({
    // defaultValues: {fullName: ''},
    resolver: yupResolver(schema),
  });
  
  // const form = useRef();

  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);

  const {
    fullBox,
    userInfo,
    cart,
    cart: { shippingAddress },
  } = state;

  const agus = JSON.parse(localStorage.getItem("cartItems"));

  const [selected, setSelected] = useState(false);
  const [stocker, setStocker] = useState('');
  const [stockdays, setStockdays] = useState(['']);

  
  const [fecha, setFecha] = useState('');
  const [fullName, setFullName] = useState(shippingAddress.fullName || "");
  const [adultos, setAdultos] = useState(shippingAddress.adultos || 0 );
  const [menores, setMenores] = useState(shippingAddress.menores || 0 );
  const [bebes, setBebes] = useState(shippingAddress.bebes || 0 );
  const [servicio, setServicio] = useState(agus[0].name || "");
  const [idservicio, setIdservicio] = useState(agus[0]._id || "");
  const [hospedaje, setHospedaje] = useState(shippingAddress.hospedaje || "");
  const [habitacion, setHabitacion] = useState(shippingAddress.habitacion || "");
  const [vendedor, setVendedor] = useState(userInfo.email || "");
  const [pago, setPago] = useState(shippingAddress.pago || "");
  const [monedapago, setMonedapago] = useState(shippingAddress.monedapago || "");
  const [montocobrado, setMontocobrado] = useState(shippingAddress.montocobrado || "");
  const [comentariopago, setComentariopago] = useState(shippingAddress.comentariopago || "");
  const [phone, setPhone] = useState(userInfo.phone || "");
  const [comentarios, setComentarios] = useState(shippingAddress.comentarios || "");
  const [contacto_pasajero, setContacto_pasajero] = useState(shippingAddress.contacto_pasajero || "");

  
  const [stockinicialfiltrado, setStockinicialfiltrado] = useState(null);
  const [mensaje, setMensaje] = useState(false);

  const [cargando, setCargando] = useState(false);
  const [mostrar, setMostrar] = useState(false);

  const [{ loading, error }, dispatch] = useReducer(reducer,  {
    product: [],
    loading: true, 
    error: '',
  })


  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get("/api/products");
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
      }
    };
    fetchData();
    // disabTomorrow();
    // const subproductofiltro = localStorage.getItem('subproducto');
    localStorage.removeItem('subproducto');
    // console.log(subproductofiltro)

    // sumarCupos();
  }, []);

  const idProducto = agus[0]._id

  useEffect(() => {
    const fetchStock = async () => {
      // console.log('Entro a fetchData', userInfo.token)
      try {
        // dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/stock/${idProducto}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        // dispatch({ type: 'FETCH_SUCCESS', payload: data });
        setStockdays(data);
        return {booked: stockDays}
      } 
      catch (err) {
        console.log('Error catch')
      }
    };
    fetchStock();
    
  }, [idProducto, userInfo.token ]);


  const [horarioReservas, setHorarioReservas] = useState('');
  const [horarioTango, setHorarioTango] = useState('');
  const [configuracion, setConfiguracion] = useState('');
  console.log(configuracion)


  const fetchData1 = async () => {
    try {
      const { data } = await axios.get('/api/configuraciones', {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setConfiguracion(data)
      
      if(data[0].horaReserva) {
          setHorarioReservas(data[0].horaReserva)
      }
      if(data[0].horaTango) {
          setHorarioTango(data[0].horaTango);
      }
      
      // dispatch({ type: 'FETCH_SUCCESS', payload: info });
    } catch (err) {
      toast.error(getError(err));
      dispatch({
        type: 'FETCH_FAIL',
        payload: getError(err),
      });
    }
  };

  // console.log(configuracion);
  // console.log('horario del sistema',horarioReservas)
  // console.log('horario tango', horarioTango)

  useEffect(() => {
    if (!userInfo) {
      navigate("/?redirect=/shipping");
    }
  }, [userInfo, navigate]);
  

  
  console.log(fecha);


  const submitHandler = async (e) => {
    // e.preventDefault();
    sumarCupos()

    ctxDispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: {
        servicio,
        idservicio,
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
        servselectfiltro
      },
    });
    localStorage.setItem(
      "shippingAddress",
      JSON.stringify({
        servicio,
        idservicio,
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
        servselectfiltro
      })
    );
    navigate("/placeorder");
    // e.preventDefault()
  };

  useEffect(() => {
    fetchData1();
    ctxDispatch({ type: "SET_FULLBOX_OFF" });
  }, [ctxDispatch, fullBox, fetchData1]);


  
    

/* Validación de inputs (fecha, pago, monedapago, montocobrado) por fuera de YUP */

const validacionJs = (e) => {

    // console.log('dirtyField',isDirty, dirtyFields);

    // e.preventDefault();

    /* Hora Actualizada  Esta porción de código válida si al hacer click se paso el horario permitido para reservar para el próximo día.*/ 
    let dia = new Date();
    let horaActualizada = (dia.getHours()<10?'0':'') + dia.getHours() + ':' + (dia.getMinutes()<10?'0':'') + dia.getMinutes();

    console.log(horaActualizada);
    

    if((agus[0].paymentMethodName === 'Tour' || agus[0].paymentMethodName === 'Paquete') && (horaActualizada >= horarioReservas) && (new Date(fecha).getDate() === tomorrow.getDate()) ) {
      window.alert(`Después de las ${horarioReservas} ya no es posible reservar para el día de mañana a través del sitio. Si necesitás hacerlo a través de Whatsapp hasta las 19:30 horas.`)
      e.preventDefault();
      window.location.reload();
    } 
    else if ((agus[0].paymentMethodName === 'Tango') && (horaActualizada >= horarioTango) && (new Date(fecha).getDate() === today.getDate()) ) {
      window.alert(`Después de las ${horarioTango} ya no es posible reservar éste servicio para el día de hoy (en el sitio). Podés hacerlo a través de Whatsapp hasta las 19:30 horas.`)
      e.preventDefault();
      window.location.reload();
      console.log('holi')
    } 

    /* Mensajes y funcionalidades de validación del formulario */

    setTimeout(() => {
      clearErrors(["fullName", "contacto_pasajero", "adultos", "hospedaje", "pago", "montocobrado"])
      document.getElementById('validacion-fecha').innerHTML = "";
      document.getElementById('validacion-moneda').innerHTML = "";
      document.getElementById('validacion-montocobrado').innerHTML = "";
      // document.getElementById('validacion-pago').innerHTML = "";
    // } 
    }, 7000);

  if(!fecha || fecha === undefined || fecha === '' || fecha === null || fecha === 'Invalid Date') {
    document.getElementById('validacion-fecha').innerHTML = "Es necesario seleccionar y validar al menos una fecha";
    console.log('valida', fecha)
    e.preventDefault()
  } else {
      document.getElementById('validacion-fecha').innerHTML = "";
      console.log('else', fecha)
      // e.preventDefault()
  }

  if(pago === "Pago Manual") {
    // console.log(pago, 'Pago Manual')
    if(!monedapago) {
    document.getElementById('validacion-moneda').innerHTML = "Es necesario seleccionar al menos una moneda";
    e.preventDefault()
    } 
    if (!montocobrado) {
    document.getElementById('validacion-montocobrado').innerHTML = "Es necesario indicar el monto cobrado o por cobrar";
    e.preventDefault()
    }
  }

}


let today = new Date();
const defaultMonth = today;

let diaHoy = new Date();


/*Para obtener mañana*/
const hoy = new Date();
const mañana = new Date(hoy);
mañana.setDate(mañana.getDate() + 1)
const mañanaFormat = mañana.toLocaleString('es-ES', {dateStyle: 'full'})


/* Generación del día "Mañana" con método de FNS*/ 
const resultMañana = add(new Date(), {
  days: 1,
});

const [tomorrow, setTomorrow] = useState(resultMañana); 


/* No mover el orden del array con la lógica se eliminan la primer y ultima posición del mismo*/
const disabledDays = [
  today,
  ...agus[0].fechas.map(x => new Date(x)),
  ...agus[0].fechasPuntual.map(x => new Date(x)),
  {before: diaHoy},
  tomorrow,
];

// console.log(tomorrow, disabledDays)

/* Generación de variable "horaActual" */
  let date = new Date();
  let horaActual = (date.getHours()<10?'0':'') + date.getHours() + ':' + (date.getMinutes()<10?'0':'') + date.getMinutes();
  console.log('hora actual',horaActual);



  if(agus[0].paymentMethodName === 'Tango' && horaActual < horarioTango) {
    disabledDays.shift();
    disabledDays.pop();
    // console.log('es menor')
  } 

  if(agus[0].paymentMethodName === 'Tango' && horaActual >= horarioTango) {
    disabledDays.pop();
  }


  if ((agus[0].paymentMethodName === 'Tour' || agus[0].paymentMethodName === 'Paquete') && horaActual < horarioReservas) {
    disabledDays.pop();
    // console.log('es menor')
  } else {
    // console.log('es mayor')
}

  const stockDays = [
    ...stockdays.map(x => new Date(x._id)),
  ];


  const bookedStyle = { border: '2px solid red' };
  const conStock = {border: '1px solid #0e6ffd', boxShadow: '0px 0px 2px #0c6dff' };
  // const conStock = {border: '1px solid #ffc107'};


  const handleDayClick = (day, modifiers) => {
        setFecha(day)
        const stocker1 = stockdays.find((x) => new Date(x._id).toLocaleDateString() === new Date(day).toLocaleDateString());
        if(stocker1) {
          setStocker(stocker1)
          setSelected(true);
        } else {
          setSelected(false);
          setStocker(0);
          sumarCupos();
        }
      }

      const pickerFunction = () => {
        if(selected) {
            // sumarCupos()
            return {booked: stockDays};
        } else {
            return {booked: stockDays};
        }
        
      }

      const otraFuncion = (e) => {

        setCargando(true)

        setTimeout(() => {  
          setCargando(false)
        }, 1000);
        
        setMostrar(true)

        setTimeout(() => {  
          setMostrar(false)
        }, 7000);

        setMensaje(true)

        document.getElementById('boton-cupo').innerHTML = 'Verificar'

        e.preventDefault()
        
        if(fecha) {
          // console.log('render',fecha)
          const resultadoampliacion = agus[0].ampliacion.find((x) => x.fecha === fecha.toISOString(true));
          // console.log(resultadoampliacion);

          if(resultadoampliacion) {
            // console.log('Hay ampliacion');
            stockinicial = resultadoampliacion.stockampliado;
            console.log(stockinicial);
            setStockinicialfiltrado(stockinicial)
            console.log(stockinicialfiltrado);

             let  cuposolicitado = (parseInt(adultos) + parseInt(menores) + parseInt(bebes) );
              if(cuposolicitado > cupoinicial || cuposolicitado > stockinicial) {
                setTimeout(() => {
                  document.getElementById('validacion').innerHTML = `La cantidad de pasajeros (${cuposolicitado}) supera el stock disponible para este día. Si necesitas ampliar el cupo, contactanos. Verificá siempre el cupo antes de reservar.`
                  // document.getElementById('boton-submit').disabled = true;
                }, 1000);
                // console.log('tiene que ir cartel')
                
              } else {
                console.log('hay que sacar cartel')
                document.getElementById('validacion').innerHTML = ""
                document.getElementById('boton-submit').disabled = false;
              }
            
          } else {
            stockinicial = 18
            // console.log(stockinicial);
            // console.log('No hay ampliacion');
            setStockinicialfiltrado(stockinicial)
            // console.log(stockinicialfiltrado);

            let  cuposolicitado = (parseInt(adultos) + parseInt(menores) + parseInt(bebes) );
              if(cuposolicitado > cupoinicial || cuposolicitado > stockinicial) {
                setTimeout(() => {
                  document.getElementById('validacion').innerHTML = `La cantidad de pasajeros (${cuposolicitado}) supera el stock disponible para este día. Si necesitas ampliar el cupo, contactanos.`
                  document.getElementById('boton-submit').disabled = true;
                }, 1000);
                // console.log('tiene que ir cartel')
                
              } else {
                // console.log('hay que sacar cartel')
                document.getElementById('validacion').innerHTML = ""
                document.getElementById('boton-submit').disabled = false;
              }
            
          }

      } else {
          // sumarCupos()
          console.log('else fecha')
          stockinicial = 18;          
      }
    }

    // console.log(stockinicialfiltrado);

    
  const [showhide, setShowhide] = useState('');

  // const [isEnter, setIsEnter] = useState(false);

  const yesnoCheck = (event) => {
    const getuser = event.target.value;
    setShowhide(getuser);
    setPago(event.target.value);
  }
  
  const edadadulto = agus[0].adultos;
  const edadmenor = agus[0].menores;
  const edadbebe = agus[0].bebes;

  const servselectfiltro = agus[0].servselect;

  let stockinicial = 18;
  // let stockampliado = 18;
  let cupoinicial = stockinicial - stocker.pasajeros;
  

  const sumarCupos = (e) => {
    // console.log('sumar cupo')
    // llamarCupo();
    if(adultos || bebes || menores) {
      let cuposolicitado = 0;
      cuposolicitado = (parseInt(adultos) + parseInt(menores) + parseInt(bebes) );

      if(!fecha && !selected && !mostrar) {
        // console.log('entro aca');
        document.getElementById('validacion-sin-dia').innerHTML = 'Confirma él cupo seleccionando y verificando un día en el calendario'
        
        // setTimeout(() => {
        //   document.getElementById('validacion-sin-dia').innerHTML = ''
        // }, 5000);

      } else {
        document.getElementById('validacion-sin-dia').innerHTML = ''
      }
      
      
      if(cuposolicitado > stockinicialfiltrado) {
        document.getElementById('validacion').innerHTML = `La cantidad de pasajeros (${cuposolicitado}) supera el stock disponible para este día. Si necesitas ampliar el cupo, contactanos.`
        document.getElementById('boton-submit').disabled = true;
      } 
      else {
        document.getElementById('validacion').innerHTML = ""
        document.getElementById('boton-submit').disabled = false;
      }
    } 
    
  }

  // console.log(stocker.pasajeros);

  const pickup = agus[0].traslados; 

  const params = useParams(); // /product/:id
  const { id: productId } = params;


    const footer = fecha && stockdays ? 

    <div className="mt-5">
      
      {fecha && (
        <>
        <div className="contenedor-boton-verificar-cupo">
          {cargando ? (<Spinner className="container spinner-chico"  animation="border" role="status"></Spinner>) 
          : (
            <>

            {!mostrar && (
              <div>
                <p className="fecha-cupo-pie-de-calendario">Verificar disponibilidad para el día  <strong>{fecha.toLocaleString('es-ES', {dateStyle: 'full'})}</strong></p>
                <button id="boton-cupo" className="boton-verificar" onClick={(e)=>otraFuncion(e)}>Verificar</button>
              </div>
            )}

            {selected && mensaje && fecha && mostrar && (
              <>
              <div id="contenedor" className="contenedor-mensaje-cupo">
                <p className="fecha-cupo">El día {fecha.toLocaleString('es-ES', {dateStyle: 'full'})}</p>
                <strong className="cantidad-cupo-footer-calendar">tiene actualmente {stockinicialfiltrado - stocker.pasajeros} lugares disponibles.</strong>
                <p className="extension-cupo">Si necesitas extender el cupo, hacé <Link className="click-aqui-cupo" to={"/ampliar-cupo"}>click aquí</Link>.</p>
              </div>
              </>
            )}
    
    
            {fecha && !selected && mensaje && mostrar && (
              <>
                <motion.div animate={{ scale: 1, x: 0 }} initial={{scale: 1.03}} transition={{ duration: 0.5 }} id="contenedor" className="contenedor-mensaje-cupo">
                  <p className="fecha-cupo">El día {fecha.toLocaleString('es-ES', {dateStyle: 'full'})}</p>
                  <strong className="cantidad-cupo-footer-calendar">tiene actualmente {stockinicialfiltrado} lugares disponibles.</strong>
                  <p className="extension-cupo">Si necesitas extender el cupo, hacé <Link className="click-aqui-cupo" to={"/ampliar-cupo"}>click aquí</Link>.</p>
                </motion.div>
              </>
            )}
    
            {/* {!mensaje && !fecha && (
              <>
                <div className="mt-5">
                  <p className="texto-inicial-calendario">Hola</p>
                </div>
              </>
            )} */}
            </>

          )}
          
        </div>

        
        </>
      
      
      )}
  
    </div>
   : 
    <div className="mt-5">
      <p className="texto-inicial-calendario">*Seleccionando una fecha vas a poder verificar la disponibilidad para ese día.</p>

       <div>
        <p className="extension-cupo">Si necesitas extender el cupo, hacé <Link className="click-aqui-cupo" to={"/ampliar-cupo"}>click aquí</Link>.</p>
       </div>
    </div>;

    
  const subproductofiltro = localStorage.getItem('subproducto');
      
  
  return loading ? (
    <LoadingBox></LoadingBox>
    ) : error ? (
      <MessageBox variant="danger">{error}</MessageBox>
    ) : (
    <div>
      <Helmet>
        <title>Datos para la Reserva</title>
      </Helmet>
      {/* <CheckoutSteps step1 step2></CheckoutSteps> */}

      <div className="container extra-container">
        <div className="contenedor-titulo-shipping">
          
        </div>
        <h1 className="titulo-principal-shipping">¡Hacé tu reserva!</h1>
        {/* <button onClick={() => {setIsEnter((v)=> !v)}}>Botonza</button>
        <CSSTransition
              in = {isEnter}
              timeout = {5000}
              classNames="clase-transition"
              >
                <p className="clase-texto-animacion">{isEnter ? ('Enter') : ('Exit')}</p>
              </CSSTransition> */}
        {/* <h1 className="fs-3">Completá con los datos de la reserva.</h1> */}
       

        <Form onSubmit={handleSubmit(submitHandler)} className="form" id="form"> 
          <div className="grid-formulario">
            <div className="container bloque-form1">

            <div className="contenedor-card-formulario-shipping">
                <div className="contenedor-datos-formulario-shipping">
                {cart.cartItems.map((item,x) => (
                  <div className="contenedor-servicios-shipping" key={x}>
                     <p className="titulo-datos-default-formulario-shipping"> Servicio:</p><Link className="link-servicio-shippinAddress" to={`/product/${item.slug}`}><strong className="datos-default-formulario-link-producto">{servicio}</strong> </Link>  
                  </div>          
                ))}
                </div>
                {servselectfiltro && (
                        <div className="contenedor-datos-formulario-shipping">
                            <p className="titulo-datos-default-formulario-shipping"> Sub Servicio</p> <strong className="datos-default-formulario-shipping"> {servselectfiltro} </strong> 
                        </div> 
                )}
                <div className="contenedor-datos-formulario-shipping">
                  <p className="titulo-datos-default-formulario-shipping"> Usuario:</p> <strong className="datos-default-formulario-shipping"> {vendedor} </strong>
                </div>
                <div className="contenedor-datos-formulario-shipping">
                  <p className="titulo-datos-default-formulario-shipping"> Teléfono del Usuario:</p> <strong className="datos-default-formulario-shipping"> {userInfo.phone} </strong> 
                </div>  
                
            </div>

            {(agus[0].paymentMethodName === 'Tour' || agus[0].paymentMethodName === 'Paquete') && (horaActual >= horarioReservas) && (
              <MessageBox variant="warning">
              <div className="contenedor-mensaje-tangos-horario">
                {/* <p className="mensaje-tango">Pasadas las {horarioReservas}hs, no es posible reservar éste servicio para el día próximo, ({mañanaFormat}). En caso que necesites hacerlo, comunicáte con nosotros a <strong>Whatsapp</strong>.</p> */}
                <p className="mensaje-tango">Tené en cuenta que a partir de las {horarioReservas} horas, <strong>ya no tomamos reservas de éste servicio para mañana</strong> ({mañanaFormat}), a través del sitio. <strong>En caso que necesites hacerlo, comunicáte con nosotros a través de Whatsapp</strong>.</p>
              </div>
              </MessageBox>
            )}

            {(agus[0].paymentMethodName === 'Tour' || agus[0].paymentMethodName === 'Paquete') && (horaActual < horarioReservas) && (
              <MessageBox variant="success">
              <div className="contenedor-mensaje-tangos-horario">
                {/* <p className="mensaje-tango">Pasadas las {horarioReservas}hs, no es posible reservar éste servicio para el día próximo, ({mañanaFormat}). En caso que necesites hacerlo, comunicáte con nosotros a <strong>Whatsapp</strong>.</p> */}
                <p className="mensaje-tango">Tené en cuenta que <strong> a partir de las {horarioReservas} hs, ya no será posible reservar éste servicio para mañana, ({mañanaFormat}). En caso que igual necesites hacerlo, comunicáte con nostros a través de Whatsapp</strong>.</p>
              </div>
              </MessageBox>
            )}

            {agus[0].paymentMethodName === 'Tango' && horaActual >= horarioTango && (<>
              <MessageBox variant="warning">
                <div className="contenedor-mensaje-tangos-horario">
                  <p className="mensaje-tango">Tené en cuenta que a partir de las {horarioTango}horas <strong>las reservas para el día de hoy, podés hacerlas únicamente a través de Whatsapp</strong>, hasta las 19.30hs.</p>
                </div>
              </MessageBox>
            </>)}

            {agus[0].paymentMethodName === 'Tango' && horaActual < horarioTango && (<>
              <MessageBox variant="success">
                <div className="contenedor-mensaje-tangos-horario">
                  <p className="mensaje-tango">Tené en cuenta que a partir de las {horarioTango}hs <strong>las reservas para este servicio, podés hacerlas únicamente por Whatsapp</strong>, hasta las 19.30hs.</p>
                </div>
              </MessageBox>
            </>)}

          
            <Form.Group className="contenedor-calendario" controlId="fecha">
                <Form.Label className="mb-1 fs-5 label">
                    Fecha del servicio <strong className="asterico-campo-obligatorio">*</strong>
                </Form.Label>
                      <DayPicker 
                          // type="date"
                          name="fecha"
                          // value={fecha}
                          selected={fecha}
                          onSelect={setFecha}
                          mode="single"
                          modifiers={pickerFunction()}
                          modifiersStyles={stockinicial < 0 ? ({ booked: bookedStyle }) : ({ booked: conStock})}
                          onDayClick={handleDayClick}
                          locale={es}
                          footer={footer}
                          disabled={(mostrar)}
                          hidden={(disabledDays)}
                          onMonthChange={[disabledDays]}
                          {...register("fecha", { required: true })}
                          error={!!errors?.fecha}
                          helpertext={errors?.fecha ? errors.fecha.message : null}
                          toYear={2023}
                          // fromYear={2023}
                          defaultMonth={defaultMonth}
                          fromMonth={defaultMonth}
                          // onChange={(e) => setFecha(e.target.value)}
                          />
                          {/* <button className="boton-reservas" onClick={()=>otraFuncion()}>Verificar</button> */}
            </Form.Group>
              {/* <p className="mensaje"> {errors.fecha?.message} </p> */}

              <p id="validacion-fecha" className="mensaje-fecha"></p>    

            { selected && stocker.pasajeros >= 19 &&  (
              <>
                <motion.div animate={{ scale: 1, x: 0 }} initial={{scale: 1.04}} transition={{ duration: 1 }}>
                  <p className="validacion-dia-completo"><strong >Si necesitas agrandar el cupo, ponete en contacto.</strong></p>
                </motion.div>
              </>
            )}

              <Form.Group className="mb-3 d-none" controlId="vendedor">
                <Form.Label className="mb-1 fs-5 label">
                  Nombre del Vendedor
                </Form.Label>
                <Form.Control
                  value={vendedor}
                  name="vendedor"
                  onChange={(e) => setVendedor(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3 d-none" controlId="phone">
                <Form.Label className="mb-1 fs-5 label">Teléfono del Vendedor</Form.Label>
                <Form.Control
                  value={userInfo.phone}
                  name="phone"
                  onChange={(e) => setPhone(e.target.value)}
                  // required
                />
              </Form.Group>
            

              {/* <Form.Group className="contenedor-input" controlId="fecha">
                <Form.Label className="mb-1 fs-5 label">Fecha del Servicio</Form.Label>
                <Form.Control
                  type="date"
                  name="fecha"
                  value={fecha}
                  onChange={(e) => setFecha(fecha)}
                  required
                />
              </Form.Group>   */}

              <Form.Group className="contenedor-input" controlId="fullName">
                <Form.Label className="mb-1 fs-5 label">
                  Nombre y Apellido del titular de la reserva <strong className="asterico-campo-obligatorio">*</strong>
                </Form.Label>
                <Form.Control
                  value={fullName}
                  name="fullName"
                  // type="text"
                  {...register("fullName", { required: true })}
                  error={!!errors?.fullName}
                  helpertext={errors?.fullName ? errors.fullName.message : null}
                  onChange={(e) => setFullName(e.target.value)}
                  // required
                />
              </Form.Group>

              <p className="mensaje"> {errors.fullName?.message} </p>

              {/* {fullName.length < 2 && (
                <p className="mensaje"> {errors.fullName?.message} </p>
              )} */}


            </div>



            <div className="container bloque-form2">

            <Form.Group className="contenedor-input" controlId="contacto_pasajero">
                <Form.Label className="mb-1 fs-5 label">
                  Teléfono del Pasajero / formato (11-37682456) <strong className="asterico-campo-obligatorio">*</strong>
                </Form.Label>
                <Form.Control
                  type="tel"
                  name="contacto_pasajero"
                  value={contacto_pasajero}
                  {...register("contacto_pasajero", { required: true })}
                  error={!!errors?.contacto_pasajero}
                  helpertext={errors?.contacto_pasajero ? errors.contacto_pasajero.message : null}
                  onChange={(e) => setContacto_pasajero(e.target.value)}
                  // required
                />
              </Form.Group> 
              <p className="mensaje"> {errors.contacto_pasajero?.message} </p>


            <Form.Group className="contenedor-input" controlId="adultos">
                <Form.Label className="mb-1 fs-5 label">
                  Cantidad de pasajeros adultos <strong className="texto-informativo-input-labels">(desde {edadadulto} )</strong> <strong className="asterico-campo-obligatorio">*</strong>
                </Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  // max="18"
                  name="adultos"
                  value={adultos}
                  {...register("adultos", { required: true })}
                  error={!!errors?.adultos}
                  helpertext={errors?.adultos ? errors.adultos.message : null}
                  onChange={(e) => setAdultos(e.target.value)}
                  onClick={(e) => sumarCupos()}
                  // required
                />
              </Form.Group>

              <p className="mensaje"> {errors.adultos?.message} </p>

              {/* {adultos === '0' && (
                <p className="mensaje"> {errors.adultos?.message} </p>
              )} */}
              

            <Form.Group className="contenedor-input" controlId="menores">
                <Form.Label className="mb-1 fs-5 label">
                  Cantidad de pasajeros menores <strong className="texto-informativo-input-labels">(desde {edadmenor} )</strong>
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
                  Bebés <strong className="texto-informativo-input-labels">(hasta {edadbebe} )</strong>
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

              <motion.div initial={{ scale: 0.1 }} animate={{ scale: 1, x: -3 }} transition={{ duration: 2 }}>
              <p  className="mensaje2" id="validacion-sin-dia"></p>
              <p  className="mensaje2" id="validacion"></p>
              
              </motion.div>

              <Form.Group className="contenedor-input" controlId="hospedaje">
                <Form.Label className="mb-1 fs-5 label">Hospedaje <strong className="texto-informativo-input-labels">({pickup} )</strong><strong className="asterico-campo-obligatorio">*</strong></Form.Label>
                <Form.Control
                  type="text"
                  value={hospedaje}
                  name="hospedaje"
                  {...register("hospedaje", { required: true })}
                  error={!!errors?.hospedaje}
                  helpertext={errors?.hospedaje ? errors.hospedaje.message : null}
                  onChange={(e) => setHospedaje(e.target.value)}
                  // required
                />
              </Form.Group>
              <p className="mensaje"> {errors.hospedaje?.message} </p>

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
                <Form.Label className="mb-1 fs-5 label">Forma de pago <strong className="asterico-campo-obligatorio">*</strong></Form.Label>
                <Form.Select
                  className="form-control"
                  type="select"
                  value={pago}
                  name="pago"
                  // onChange={(e) => setPago(e.target.value)}
                  {...register("pago", { required: true })}
                  error={!!errors?.pago}
                  helpertext={errors?.pago ? errors.pago.message : null}
                  onChange={(e) => yesnoCheck(e)}
                  // required
                > 
                  <option value="">--Seleccionar forma de pago--</option>
                  <option value="Cuenta Corriente">Cuenta corriente</option>
                  <option value="Pago Manual">Pago manual</option>

                </Form.Select>
                
              </Form.Group>
              <p className="mensaje"> {errors.pago?.message} </p>

              <p id="validacion-pago" className="mensaje"></p>  

              {/* {!pago && (<p className="mensaje">Es necesario seleccionar al menos un tipo de pago</p>)} */}

              {
                pago === 'Pago Manual' &&  (
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
                  {...register("montocobrado", { required: true })}
                  error={!!errors?.montocobrado}
                  helpertext={errors?.montocobrado ? errors.montocobrado.message : null}
                  onChange={(e) => setMontocobrado(e.target.value)}
                  // required
                />
              </Form.Group>
              {/* <p className="mensaje"> {errors.montocobrado?.message} </p> */}
              <p id="validacion-montocobrado" className="mensaje"></p>  

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
              
            
              <div className="mb-3"></div>
              <div className="d-flex justify-content-end mt-5">
                <Button 
                className="fs-5 boton-reservas" 
                id="boton-submit"
                // disabled={!fecha}
                variant="primary" type="submit" onClick={(e)=> validacionJs(e)}>
                  Reservar
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
