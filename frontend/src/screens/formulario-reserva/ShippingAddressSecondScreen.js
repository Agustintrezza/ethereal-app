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
  import { Store } from "../../Store";
  // import CheckoutSteps from "../components/CheckoutSteps";
  import axios from "axios";
  // import logger from "use-reducer-logger";
  // import Card from 'react-bootstrap/Card';
  // import ListGroup from 'react-bootstrap/ListGroup';
  // import ListGroupItem from "react-bootstrap/esm/ListGroupItem";
  // import Row from "react-bootstrap/Row"
  
  import { DayPicker } from 'react-day-picker';
  import isBefore from 'date-fns/isBefore'
  import 'react-day-picker/dist/style.css';
  
  import Spinner from 'react-bootstrap/Spinner';
  import {BiArrowBack} from 'react-icons/bi';
  
  
  import es from 'date-fns/locale/es';
  import { format } from "date-fns";
  import add from 'date-fns/add'
  // import getTime from 'date-fns/getTime'
  import differenceInHours from 'date-fns/differenceInHours';
  // import { format } from 'date-fns';
  // import {parseISO} from 'date-fns';
  import isTomorrow from 'date-fns/isTomorrow'
  
  import { yupResolver } from "@hookform/resolvers/yup";
  import { useForm } from "react-hook-form";
  
  import * as yup from "yup";
  
  // import { CSSTransition } from 'react-transition-group';
  import { motion } from "framer-motion";
  import { toast } from "react-toastify";
  import { getError } from "../../utils";
  import MessageBox from "../../components/MessageBox";
  import LoadingBox from "../../components/LoadingBox";
  
  
  // const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
  // const phoneRegExp = /^((\(?\d{3}\)? \d{4})|(\(?\d{4}\)? \d{3})|(\(?\d{5}\)? \d{2}))-\d{4}$/gm
  // const phoneRegExp = /^(?=(\D*\d){11}$)\(?\d{3,5}\)?[- .]?\d{2,4}[- .]?\d{4}$/


  // const phoneRegExp = /^((?:\(?\d{2}\)?[- .]?\d{4}|\(?\d{4}\)?[- .]?\d{3}|\(?\d{5}\)?[- .]?\d{2})[- .]?\d{4})$/
  
  // const schema = yup.object().shape({
  //   // fecha: yup.date().required("Es necesario seleccionar y validar al menos una fecha"), 
  //   // montocobrado: yup.number().required("Es necesario indicar el monto de la operacion").min(1, "El monto no puede ser 0").typeError("Es necesario indicar el monto de la operación"), 
  //   // fullName: yup.string().required("El nombre es un campo obligatorio y debe tener al menos 2 caracteres").min(2, "El campo debe tener al menos 2 caracteres"),
  //   // contacto_pasajero: yup.string().required("El teléfono es un campo obligatorio"),
  //   contacto_pasajero: yup.string().matches(phoneRegExp, 'Formáto de teléfono inválido'),
  //   // adultos: yup.number().required("La reserva debe tener al menos un pasajero adulto")
  //   //   .positive("Debe ser un número positivo")
  //   //   // .integer("Debe ser un número entero")
  //   //   .min(1, "Tiene que haber al menos un pasajero adulto indicado"),
  //     // .max(18, "Tiene que haber al menos un pasajero adulto indicado"),
  //     // .typeError("La reserva debe tener al menos un pasajero adulto"),
  //   // hospedaje: yup.string().required("El hospedaje es un campo obligatorio"),
  //   //   pago: yup.string().required("Debe haber al menos un medio de pago seleccionado"),
  //   //   email: yup.string().email("Formato Inválido").required("Es email es obligatorio"), 
    
  // });
  
  
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
  
  
  export default function ShippingAddressSecondScreen() {
  
    const {
      register,
      clearErrors,
      handleSubmit,
      formState: { errors, isDirty, dirtyFields },
  
    } = useForm({
      // defaultValues: {fullName: ''},
      // resolver: yupResolver(schema),
    });
    
    // const form = useRef();
  
    const navigate = useNavigate();
    const { state, dispatch: ctxDispatch } = useContext(Store);
  
    const {
      fullBox,
      userInfo,
      cart: { shippingAddress },
    } = state;
  
    const agus = JSON.parse(localStorage.getItem("cartItems"));
  
    const [stocker, setStocker] = useState('');
  
    const [fecha, setFecha] = useState(shippingAddress.fecha || '');
    const [fullName, setFullName] = useState(shippingAddress.fullName || "");
    const [adultos, setAdultos] = useState(shippingAddress.adultos || 0 );
    const [menores, setMenores] = useState(shippingAddress.menores || 0 );
    const [bebes, setBebes] = useState(shippingAddress.bebes || 0 );

    const [cupofinal, setCupofinal] = useState(shippingAddress.cupofinal || 0 );

    const [servicio, setServicio] = useState(agus[0].name || "");
    const [idservicio, setIdservicio] = useState(agus[0]._id || "");
    const [hospedaje, setHospedaje] = useState(shippingAddress.hospedaje || "");
    const [habitacion, setHabitacion] = useState(shippingAddress.habitacion || "");
    const [vendedor, setVendedor] = useState(userInfo.email || "");
    const [pago, setPago] = useState(shippingAddress.pago || "");
    const [monedapago, setMonedapago] = useState( shippingAddress.monedapago || "");
    const [montocobrado, setMontocobrado] = useState( shippingAddress.montocobrado || "");
    const [comentariopago, setComentariopago] = useState(shippingAddress.comentariopago || "");
    const [phone, setPhone] = useState(userInfo.phone || "");
    const [comentarios, setComentarios] = useState(shippingAddress.comentarios || "");
    const [contacto_pasajero, setContacto_pasajero] = useState(shippingAddress.contacto_pasajero || "");
  
    
    // const [stockinicialfiltrado, setStockinicialfiltrado] = useState(null);
    // const [mensaje, setMensaje] = useState(false);
  
    // const [cargando, setCargando] = useState(false);
    // const [mostrar, setMostrar] = useState(false);
  
    const [{ loading, error, loadingUpdate, loadingUpload  }, dispatch] = useReducer(reducer,  {
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
      const subproductofiltro = localStorage.getItem('subproducto');
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
          // setStockdays(data);
          // return {booked: stockDays}
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

    useEffect(() => {
      if (!userInfo) {
        navigate("/?redirect=/shipping-first");
      }
    }, [userInfo, navigate]);
     
    
    // console.log(fecha);

    const cupo = (parseInt(adultos) + parseInt(menores) + parseInt(bebes))
    console.log(cupo);
  
  
    const submitHandler = async (e) => {
  
      setCupofinal(cupo)

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
          cupofinal,
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
          cupofinal,
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
    }, [ctxDispatch, fullBox]);

  
    /* Validación de inputs (fecha, pago, monedapago, montocobrado) por fuera de YUP */
  
    const validacionJs = (e) => {

    let regExp = /[a-zA-Z]/g;

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
    
    if (pago === "Pago Manual") {
      if(montocobrado === '0' || montocobrado === '' || !montocobrado) {
        document.getElementById('validacion-montocobrado').innerHTML = "Es necesario indicar el monto cobrado o por cobrar";
        document.getElementById('up').scrollIntoView();
        e.preventDefault()
      } 
    }

    if(pago === "Pago Manual") {
      console.log(pago, 'Pago Manual')
      if(monedapago === '') {
        document.getElementById('validacion-moneda').innerHTML = "Es necesario seleccionar al menos una moneda";
        document.getElementById('up').scrollIntoView();
        e.preventDefault()
      } 
    }



    // if(contacto_pasajero.value.match(phoneRegExp)) {
    //   document.getElementById('validacion-contacto_pasajero').innerHTML = "Formato inválido";
    //   console.log('hace match')
    //   e.preventDefault()
    // }

    // function validatePhoneNumber(e) {
    //     let pNumber = document.getElementById('number').value;
    // if(!phoneRegExp(pNumber)) {
    //   document.getElementById('validacion-contacto_pasajero').innerHTML = "Formato inválido";
    // }
    // console.log(pNumber);
    // }
    

    // /* Mensajes y funcionalidades de validación del formulario */
  
      setTimeout(() => {
        clearErrors(["contacto_pasajero"])

        document.getElementById('validacion-pago').innerHTML = "";

        document.getElementById('validacion-fullName').innerHTML = "";
        document.getElementById('validacion-fullName-min').innerHTML = "";
        document.getElementById('validacion-fullName-max').innerHTML = "";
        document.getElementById('validacion-hospedaje').innerHTML = "";

        document.getElementById('validacion-contacto_pasajero-formato').innerHTML = "";
        document.getElementById('validacion-contacto_pasajero-positivo').innerHTML = "";
        document.getElementById('validacion-contacto_pasajero').innerHTML = "";
        


        document.getElementById('validacion-moneda').innerHTML = "";
        document.getElementById('validacion-montocobrado').innerHTML = "";


      // } 
      }, 3000);
    
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
    

    // console.log(stocker.pasajeros);
  
    const pickup = agus[0].traslados; 
  
    const params = useParams(); // /product/:id
    const { id: productId } = params;
  
      
    const subproductofiltro = localStorage.getItem('subproducto');

    
    let cuposolicitado = 0;
    cuposolicitado = (parseInt(adultos) + parseInt(menores) + parseInt(bebes) );

    // console.log(fecha);

    let shipping = JSON.parse(localStorage.getItem('shippingAddress'));
 
    const fechaselect = new Date(shipping.fecha);
    const fechafinal = fechaselect.toLocaleDateString('es-ES', {dateStyle: 'full'});
    // console.log(fechafinal)
    
    
        
    
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
  
        <div id='up' className="container extra-container">
          <div className="contenedor-titulo-shipping">
            
          </div>

          {/* <div className="contenedor-pasajeros-shippingsecond">  */}

                <div className="contenedor-datos-principal">  
                    

                    <div className="boton-volver-shippingsecond">
                      <Link className='enlace-flecha-volver-shippingsecond' to={'/shipping-first'}><BiArrowBack/></Link>
                      <h1 className="titulo-principal-shippingsecond">¡Finalizá tu reserva! <strong className="strong-paginacion-shipping">2/2</strong></h1>
                    </div>


                    <div className="contenedor-interno-datos-shippingsecond">
                            <div className="contenedor-fecha-shippingsecond">
                              <p className="adultos-shippingsecond">Fecha del servicio <strong className="strong-dato-shippingsecond">{fechafinal}</strong></p>
                            </div>

                            <div>
                              <div className="contenedor-interno-pasajeros-shippingsecond">                   
                                    <p className="adultos-shippingsecond">Adultos <strong className="strong-dato-shippingsecond">{shippingAddress.adultos}</strong></p>
                                    <p className="adultos-shippingsecond">Menores <strong className="strong-dato-shippingsecond"> {shippingAddress.menores}</strong></p>              
                                    <p className="adultos-shippingsecond">Bebés <strong className="strong-dato-shippingsecond">{shippingAddress.bebes}</strong></p>
                                </div>
                                <div>
                                    <p className="adultos-shippingsecond">Total de pasajeros: <strong className="strong-dato-shippingsecond">{cuposolicitado}</strong></p>
                                </div>
                            </div>
                      </div>
                    {/* <p>{shippingAddress.fecha}</p> */}
                </div>

                {/* <div className="contenedor-pasajeros-shippingsecond">
                      
                </div> */}

          {/* </div> */}
          {/* <button onClick={() => {setIsEnter((v)=> !v)}}>Botonza</button>
          <CSSTransition
                in = {isEnter}
                timeout = {5000}
                classNames="clase-transition"
                >
                  <p className="clase-texto-animacion">{isEnter ? ('Enter') : ('Exit')}</p>
                </CSSTransition> */}
          {/* <h1 className="fs-3">Completá con los datos de la reserva.</h1> */}
         
  
          <Form onSubmit={(submitHandler)} className="form" id="form"> 
            <div className="grid-formulario">

              <div className="container bloque-form1">
            
  
                <Form.Group className="contenedor-input">
                  <Form.Label className="mb-1 fs-5 label">
                    Nombre y Apellido del titular de la reserva <strong className="asterico-campo-obligatorio">*</strong>
                  </Form.Label>
                  <Form.Control
                    value={fullName}
                    name="fullName"
                    type="text"
                    // {...register("fullName", { required: true })}
                    // error={!!errors?.fullName}
                    // helpertext={errors?.fullName ? errors.fullName.message : null}
                    onChange={(e) => setFullName(e.target.value)}
                    // required
                  />
                </Form.Group>
  
                <p className="mensaje"> {errors.fullName?.message} </p>
                <p id="validacion-fullName" className="mensaje"></p>  
                <p id="validacion-fullName-min" className="mensaje"></p>  
                <p id="validacion-fullName-max" className="mensaje"></p>  
  
                {/* {fullName.length < 2 && (
                  <p className="mensaje"> {errors.fullName?.message} </p>
                )} */}



                <Form.Group className="contenedor-input">
                    <Form.Label className="mb-1 fs-5 label">
                        Teléfono del Pasajero / formato (1137682456) <strong className="asterico-campo-obligatorio">*</strong>
                    </Form.Label>
                    <Form.Control
                        // id="number"
                        type="tel"
                        // min="0"
                        name="contacto_pasajero"
                        value={contacto_pasajero}
                        // {...register("contacto_pasajero", { required: true })}
                        // error={!!errors?.contacto_pasajero}
                        // helpertext={errors?.contacto_pasajero ? errors.contacto_pasajero.message : null}
                        onChange={(e) => setContacto_pasajero(e.target.value)}
                        // required
                    />
                    </Form.Group> 
                    {/* <p className="mensaje"> {errors.contacto_pasajero?.message} </p> */}

                <p id="validacion-contacto_pasajero" className="mensaje"></p>  
                <p id="validacion-contacto_pasajero-formato" className="mensaje"></p>  
                <p id="validacion-contacto_pasajero-positivo" className="mensaje"></p>  


                <Form.Group className="contenedor-input">
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
                <p id="validacion-hospedaje" className="mensaje"></p>  


                <Form.Group className="contenedor-input">
                  <Form.Label className="mb-1 fs-5 label">Habitación</Form.Label>
                  <Form.Control
                    value={habitacion}
                    name="habitacion"
                    onChange={(e) => setHabitacion(e.target.value)}
                    // required
                  />
                </Form.Group>
  
  
              </div>
  
  
  
        <div className="container bloque-form2shippingsecond">
  
                <Form.Group className="contenedor-input">
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
                
                {/* <p className="mensaje"> {errors.pago?.message} </p> */}
  
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
                  <Form.Group className="contenedor-input">
                  <Form.Label className="mb-1 fs-5 label">
                    Monto a pagar al guía al inicio de la excursión, o en la entrada de la casa de tango *
                  </Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    name="montocobrado"
                    value={montocobrado}
                    // {...register("montocobrado", { required: true })}
                    // error={!!errors?.montocobrado}
                    // helpertext={errors?.montocobrado ? errors.montocobrado.message : null}
                    onChange={(e) => setMontocobrado(e.target.value)}
                    // required
                  />
                </Form.Group>
                {/* <p className="mensaje"> {errors.montocobrado?.message} </p> */}
                <div> 
                  <p id="validacion-montocobrado" className="mensaje"></p>      
                </div>
  
                  <Form.Group className="contenedor-input">
                      <Form.Label className="mb-1 fs-5 label">Comentarios acerca del pago</Form.Label>
                      <Form.Control
                      as="textarea"
                      rows={2}
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
                
                
                <Form.Group className="contenedor-input">
                  <Form.Label className="mb-1 fs-5 label">Comentarios útiles para la reserva</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
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
  