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
  // import isBefore from 'date-fns/isBefore'
  import 'react-day-picker/dist/style.css';
  
  import Spinner from 'react-bootstrap/Spinner';
  
  import {AiOutlineUser} from 'react-icons/ai';
  
  import es from 'date-fns/locale/es';
  // import { format } from "date-fns";
  import add from 'date-fns/add'
  // import getTime from 'date-fns/getTime'
  // import differenceInHours from 'date-fns/differenceInHours';
  // import { format } from 'date-fns';
  // import {parseISO} from 'date-fns';
  // import isTomorrow from 'date-fns/isTomorrow'
  
  // import { yupResolver } from "@hookform/resolvers/yup";
  import { useForm } from "react-hook-form";
  
  // import * as yup from "yup";
  
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
  //   // contacto_pasajero: yup.string().matches(phoneRegExp, 'Formáto de teléfono inválido'),
  //   adultos: yup.number().required("La reserva debe tener al menos un pasajero adulto")
  //     .positive("Debe ser un número positivo")
  //     // .integer("Debe ser un número entero")
  //     .min(1, "Tiene que haber al menos un pasajero adulto indicado"),
  //     // .max(18, "Tiene que haber al menos un pasajero adulto indicado"),
  //     // .typeError("La reserva debe tener al menos un pasajero adulto"),
  //   // hospedaje: yup.string().required("El hospedaje es un campo obligatorio"),
  //   // pago: yup.string().required("Debe haber al menos un medio de pago seleccionado"),
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
  
  
  export default function ShippingAddressScreen() {
  
    const {
      register,
      clearErrors,
      handleSubmit,
      formState: { errors },
  
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
      product,
      cart,
      cart: { shippingAddress },
    } = state;
  
    const agus = JSON.parse(localStorage.getItem("cartItems"));
  
    const [selected, setSelected] = useState(false);
    const [stocker, setStocker] = useState('');
    const [stockdays, setStockdays] = useState(['']);
    const [cupofinal, setCupofinal] = useState(Number);
    const [cupodeldia, setCupodeldia] = useState(0);


    const [fecha, setFecha] = useState("");
    const [fullName, setFullName] = useState("");
    const [adultos, setAdultos] = useState( 0 );
    const [menores, setMenores] = useState( 0 );
    const [bebes, setBebes] = useState( 0 );
    
    // const [cupofinal, setCupofinal] = useState(0);

    const [servicio, setServicio] = useState(agus[0].name || "");
    const [idservicio, setIdservicio] = useState(agus[0]._id || "");
    const [hospedaje, setHospedaje] = useState("");
    const [habitacion, setHabitacion] = useState("");
    const [vendedor, setVendedor] = useState(userInfo.email || "");
    const [pago, setPago] = useState("");
    const [monedapago, setMonedapago] = useState("");
    const [montocobrado, setMontocobrado] = useState("");
    const [comentariopago, setComentariopago] = useState("");
    const [phone, setPhone] = useState(userInfo.phone || "");
    const [comentarios, setComentarios] = useState("");
    const [contacto_pasajero, setContacto_pasajero] = useState("");
  
    
    const [stockinicialfiltrado, setStockinicialfiltrado] = useState(null);
    const [mensaje, setMensaje] = useState(false);
  
    const [cargando, setCargando] = useState(false);
    const [mostrar, setMostrar] = useState(false);
  
    const [{ loading, error, loadingUpdate, loadingUpload  }, dispatch] = useReducer(reducer,  {
      product: [],
      loading: true, 
      error: '',
    })
  
  
    useEffect(() => {
      // localStorage.removeItem('shippingAddress');
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
          setStockdays(data);
          // return {booked: stockDays}
        } 
        catch (err) {
          console.log('Error catch')
        }
        
      };

      fetchStock();
      
    }, [idProducto, userInfo.token ]);

    // const [diass, setDiass] = useState(0);


    
    const fetchStock = async (e) => {
        try {
          // dispatch({ type: 'FETCH_REQUEST' });
          const { data } = await axios.get(`/api/orders/stock/${idProducto}`, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          });
          setStockdays(data);
          console.log(data)
          
          let copo = data.find((x) => x._id === fecha.toISOString(true)) 

          if(copo) {
            console.log(copo)
            const pasajeros = copo.pasajeros
            setCupodeldia(pasajeros)
            console.log(pasajeros);
          } else {
            console.log('no hay dia seleccionado')
            setCupodeldia(0)
          }
          
          
          // dispatch({ type: 'FETCH_SUCCESS', payload: data });
          // return {booked: stockDays}
        } 
        catch (err) {
          console.log('Error catch')
        }
      };

     console.log(cupodeldia)


      const stockDays = [
      ...stockdays.map(x => new Date(x._id)),
    ];

    
    const bookedStyle = { border: 'none' };
    const conStock = {border: '1px solid #0e6ffd', boxShadow: '0px 0px 2px #0c6dff' };
    // const sinStock = {border: '1px solid red', boxShadow: '0px 0px 2px #0c6dff' };
  
  
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
  
    // console.log(configuracion);
    // console.log('horario del sistema',horarioReservas)
    // console.log('horario tango', horarioTango)
  
    useEffect(() => {
      if (!userInfo) {
        navigate("/?redirect=shipping-first");
      }
    }, [userInfo, navigate]);
    
  
    const cupo = (parseInt(adultos) + parseInt(menores) + parseInt(bebes))


  
  
    const submitHandler = async (e) => {

  
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
      navigate("/shipping-second");
      // e.preventDefault()
    };
  
    useEffect(() => {
      fetchData1();
      ctxDispatch({ type: "SET_FULLBOX_OFF" });
    }, [ctxDispatch, fullBox]);
  
    
    const funcionCallback = (e) => {
      validacionJs(e);
    }

    const validacionJs = (e) => {
      console.log('Entro a la funcion Js')

      if(!adultos || adultos == '0') {
        document.getElementById('validacion-adultos').innerHTML = "Tiene que haber al menos un pasajero adulto";
        document.getElementById('up').scrollIntoView();
        e.preventDefault()
      }

      setTimeout(() => {
        // clearErrors(["adultos"])
        document.getElementById('validacion-adultos').innerHTML = "";
      }, 7000);

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

      if(!fecha || fecha === undefined || fecha === '' || fecha === null || fecha === 'Invalid Date') {
        document.getElementById('validacion-fecha').innerHTML = "Es necesario seleccionar y validar al menos una fecha";
        console.log('valida', fecha)
        e.preventDefault()
      } else {
        document.getElementById('validacion-fecha').innerHTML = "";
        // console.log('else', fecha)
        // e.preventDefault()
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
    // console.log('hora actual',horaActual);
  
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
  
  
    const handleDayClick = (day, modifiers) => {
          setFecha(day)
          const stocker1 = stockdays.find((x) => new Date(x._id).toLocaleDateString() === new Date(day).toLocaleDateString());
          // const modifiedstocker1 = modifiedDays.find((x) => new Date(x._id).toLocaleDateString() === new Date(day).toLocaleDateString());
          // console.log(stocker1)

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

          fetchStock();
  
          setCargando(true)
  
          setTimeout(() => {  
            setCargando(false)
          }, 1000);
          
          setMostrar(true)
  
          setTimeout(() => {  
            setMostrar(false)
          }, 6000);
  
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
                  document.getElementById('validacion').innerHTML = `La cantidad de pasajeros (${cuposolicitado}) supera el stock disponible para este día. Si necesitas ampliar el cupo, contactanos. Verificá siempre el cupo antes de reservar.`
                  document.getElementById('boton-submit').disabled = true;
                  // setTimeout(() => {
                  //   document.getElementById('validacion').innerHTML = `La cantidad de pasajeros (${cuposolicitado}) supera el stock disponible para este día. Si necesitas ampliar el cupo, contactanos. Verificá siempre el cupo antes de reservar.`
                  //   // document.getElementById('boton-submit').disabled = true;
                  // }, 0001);
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
  
              let cuposolicitado = (parseInt(adultos) + parseInt(menores) + parseInt(bebes));
                if(cuposolicitado > cupoinicial || cuposolicitado > stockinicial) {
                  setTimeout(() => {
                    document.getElementById('validacion').innerHTML = `La cantidad de pasajeros (${cuposolicitado}) supera el stock disponible para este día. Si necesitas ampliar el cupo, contactanos.`
                    document.getElementById('boton-submit').disabled = true;
                  }, 1);
                  // console.log('tiene que ir cartel')
                  
                } else {
                  // console.log('hay que sacar cartel')
                  document.getElementById('validacion').innerHTML = ""
                  // document.getElementById('boton-submit').disabled = false;
                }
              
            }
  
        } else {
            // sumarCupos()
            console.log('else fecha')
            stockinicial = 18;          
        }
      }
  
      
    const [showhide, setShowhide] = useState('');
  
    const yesnoCheck = (event) => {
      const getuser = event.target.value;
      setShowhide(getuser);
      setPago(event.target.value);
    }
    
    const edadadulto = agus[0].adultos;
    const edadmenor = agus[0].menores;
    const edadbebe = agus[0].bebes;
  
    const servselectfiltro = agus[0].servselect;
    console.log(agus[0]);
  
    let stockinicial = 18;
    // let stockampliado = 18;
    let cupoinicial = stockinicial - stocker.pasajeros;
    
  
    const sumarCupos = (e) => {

      console.log(cupo)
      setCupofinal(cupo)
      console.log('sumar cupo')
      // llamarCupo();
      if(adultos || bebes || menores) {
        // let cuposolicitados = 0;
        // cuposolicitados = (parseInt(adultos) + parseInt(menores) + parseInt(bebes) );
  
        if(!fecha && !selected && !mostrar) {
          // console.log('entro aca');
          document.getElementById('validacion-sin-dia').innerHTML = 'Confirmá el cupo seleccionando y verificando un día en el calendario'  
        } else {
          document.getElementById('validacion-sin-dia').innerHTML = ''
        }

        let  cuposolicitado = (parseInt(adultos) + parseInt(menores) + parseInt(bebes) );
                if(cuposolicitado > cupoinicial || cuposolicitado > stockinicial) {
                  setTimeout(() => {
                    document.getElementById('validacion').innerHTML = `La cantidad de pasajeros (${cuposolicitado}) supera el stock disponible para este día. Si necesitas ampliar el cupo, contactanos. Verificá siempre el cupo antes de reservar.`
                    document.getElementById('boton-submit').disabled = true;
                  }, 1);
                  // console.log('tiene que ir cartel')
                  
                } else {
                  console.log('hay que sacar cartel')
                  document.getElementById('validacion').innerHTML = ""
                  // document.getElementById('boton-submit').disabled = false;
                }
        
        
        if(cuposolicitado > stockinicialfiltrado) {
          document.getElementById('validacion').innerHTML = `La cantidad de pasajeros (${cuposolicitado}) supera el stock disponible para este día. Si necesitas ampliar el cupo, contactanos.`
          document.getElementById('boton-submit').disabled = true;
          console.log('es mayor')
        } else {
          document.getElementById('validacion').innerHTML = ""
          // document.getElementById('boton-submit').disabled = false;
          console.log('es menor')
        }
      } 
      
    }
  
    // console.log(stocker.pasajeros);
  
    const pickup = agus[0].traslados; 
  
    const params = useParams(); // /product/:id
    const { id: productId } = params;
  
  
      const footer = fecha && stockdays ? 
  
      <div className="contenedor-carterl-verificar-fecha">
        
        {fecha && (
          <>
          <div className="contenedor-boton-verificar-cupo-shippingfirst">
            {cargando ? (<Spinner className="container spinner-chico"  animation="border" role="status"></Spinner>) 
            : (
              <>
  
              {!mostrar && fecha !== '' && (
                <div>
                  <p className="fecha-cupo-pie-de-calendario">Verificar disponibilidad para el día  <strong>{fecha.toLocaleString('es-ES', {dateStyle: 'full'})}</strong></p>
                  <button id="boton-cupo" className="boton-verificar" onClick={(e)=>otraFuncion(e)}>Verificar</button>
                </div>
              )}
  
              {selected && mensaje && fecha && mostrar && stockinicial - cupodeldia !== 0 && (
                <>
                <div id="contenedor" className="contenedor-mensaje-cupo-shippingfirst">
                  <p className="fecha-cupo">El día {fecha.toLocaleString('es-ES', {dateStyle: 'full'})}</p>
                  <strong className="cantidad-cupo-footer-calendar">tiene {stockinicialfiltrado - cupodeldia} lugares disponibles.</strong>
                  <p className="extension-cupo-shippingfirst">Si necesitas extender el cupo, <Link className="click-aqui-cupo" to={"/ampliar-cupo"}>click aquí</Link>.</p>
                </div>
                </>
              )}

              {selected && mensaje && fecha && mostrar && stockinicial - cupodeldia == 0 && (
                <>
                <div id="contenedor" className="contenedor-mensaje-cupo-shippingfirst">
                  <p className="fecha-cupo">El día {fecha.toLocaleString('es-ES', {dateStyle: 'full'})}</p>
                  <strong className="fs-2 red">ya no tiene lugares disponibles.</strong>
                  <p className="extension-cupo-shippingfirst">Si necesitas extender el cupo, <Link className="click-aqui-cupo" to={"/ampliar-cupo"}>click aquí</Link>.</p>
                </div>
                </>
              )}
      
      
              {fecha && !selected && mensaje && mostrar && (
                <>
                  <motion.div animate={{ scale: 1, x: 0 }} initial={{scale: 1.03}} transition={{ duration: 0.5 }} id="contenedor" className="contenedor-mensaje-cupo-shippingfirst">
                    <p className="fecha-cupo">El día {fecha.toLocaleString('es-ES', {dateStyle: 'full'})}</p>
                    <strong className="cantidad-cupo-footer-calendar">tiene {stockinicialfiltrado - cupodeldia} lugares disponibles.</strong>
                    <p className="extension-cupo-shippingfirst">Si necesitas extender el cupo, <Link className="click-aqui-cupo" to={"/ampliar-cupo"}>click aquí</Link>.</p>
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
      <div className="mt-5 contenedor-footer-calendario">
        <p className="texto-inicial-calendario-shippingfirst">*Seleccionando una fecha vas a poder verificar la disponibilidad para ese día.</p>
  
         <div>
          <p className="extension-cupo-shippingfirst">Si necesitas extender el cupo, <Link className="click-aqui-cupo" to={"/ampliar-cupo"}>click aquí</Link>.</p>
         </div>
      </div>;
  
      
    // const subproductofiltro = localStorage.getItem('subproducto');


    // if(mostrar) {
    //   setSelected(false);
    // }
    
        
    
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
          {/* <div className="contenedor-titulo-shipping">
            
          </div> */}

        

        <div id="up" className="contenedor-titulo-principal-shippingfirst">
            <h1 className="titulo-principal-shippingfirst">¡Comenzá tu reserva! <strong className="strong-paginacion-shipping">1/2</strong></h1>

              <div className="contenedor-card-formulario-shippingfirst">
                  <div className="contenedor-datos-formulario-shipping">
                      {cart.cartItems.map((item,x) => (
                        <div className="contenedor-servicios-shipping" key={x}>
                          <p className="adultos-shippingsecond"> Servicio:</p><Link className="link-servicio-shippinAddress" to={`/product/${item.slug}`}><strong className="datos-default-formulario-link-producto">{servicio}</strong> </Link>  
                        </div>          
                      ))}
                  </div>

                  
                  <div className="contenedor-datos-formulario-shipping">
                      {servselectfiltro && agus[0].paymentMethodName === 'Tango' && (
                              <div className="contenedor-datos-formulario-shipping">
                                  <p className="adultos-shippingsecond"> Sector:</p> <strong className="strong-dato-shippingsecond"> {servselectfiltro} </strong> 
                              </div> 
                      )}
                      {servselectfiltro && agus[0].paymentMethodName === 'Tour' && (
                              <div className="contenedor-datos-formulario-shipping">
                                  <p className="adultos-shippingsecond"> Sub Servicio:</p> <strong className="strong-dato-shippingsecond"> {servselectfiltro} </strong> 
                              </div> 
                      )}
                    <p className="adultos-shippingsecond"> <AiOutlineUser className="logo-user-shippingfirst"/></p> <strong className="strong-dato-shippingsecond"> {vendedor} </strong>
                  </div>
                  {/* <div className="contenedor-datos-formulario-shipping">
                    <p className="titulo-datos-default-formulario-shipping"> Teléfono del Usuario:</p> <strong className="datos-default-formulario-shipping"> {userInfo.phone} </strong> 
                  </div>   */}
            </div>
        </div>


        <div className="contenedor-mensaje-shippingaddresfirst">
                {(agus[0].paymentMethodName === 'Tour' || agus[0].paymentMethodName === 'Paquete') && (horaActual >= horarioReservas) && (
                  <MessageBox variant="warning">
                  <div className="contenedor-mensaje-tangos-horario-shippingfirst">
                    {/* <p className="mensaje-tango">Pasadas las {horarioReservas}hs, no es posible reservar éste servicio para el día próximo, ({mañanaFormat}). En caso que necesites hacerlo, comunicáte con nosotros a <strong>Whatsapp</strong>.</p> */}
                    <p className="mensaje-tango">Tené en cuenta que a partir de las {horarioReservas} horas, <strong>ya no tomamos reservas de éste servicio para mañana</strong> ({mañanaFormat}), a través del sitio. <strong>En caso que necesites hacerlo, comunicáte con nosotros a través de Whatsapp</strong>.</p>
                  </div>
                  </MessageBox>
                )}
    
                {(agus[0].paymentMethodName === 'Tour' || agus[0].paymentMethodName === 'Paquete') && (horaActual < horarioReservas) && (
                  <MessageBox variant="success">
                  <div className="contenedor-mensaje-tangos-horario-shippingfirst">
                    {/* <p className="mensaje-tango">Pasadas las {horarioReservas}hs, no es posible reservar éste servicio para el día próximo, ({mañanaFormat}). En caso que necesites hacerlo, comunicáte con nosotros a <strong>Whatsapp</strong>.</p> */}
                    <p className="mensaje-tango">Tené en cuenta que <strong> a partir de las {horarioReservas} hs, ya no será posible reservar éste servicio para mañana, ({mañanaFormat}). En caso que igual necesites hacerlo, comunicáte con nostros a través de Whatsapp</strong>.</p>
                  </div>
                  </MessageBox>
                )}
    
                {agus[0].paymentMethodName === 'Tango' && horaActual >= horarioTango && (<>
                  <MessageBox variant="warning">
                    <div className="contenedor-mensaje-tangos-horario-shippingfirst">
                      <p className="mensaje-tango">Tené en cuenta que a partir de las {horarioTango}horas <strong>las reservas para el día de hoy, podés hacerlas únicamente a través de Whatsapp</strong>, hasta las 19.30hs.</p>
                    </div>
                  </MessageBox>
                </>)}
    
                {agus[0].paymentMethodName === 'Tango' && horaActual < horarioTango && (<>
                  <MessageBox variant="success">
                    <div className="contenedor-mensaje-tangos-horario-shippingfirst">
                      <p className="mensaje-tango">Tené en cuenta que a partir de las {horarioTango}hs <strong>las reservas para este servicio, podés hacerlas únicamente por Whatsapp</strong>, hasta las 19.30hs.</p>
                    </div>
                  </MessageBox>
                </>)}
            </div>

        
          
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
            <div className="grid-formulario-shippingfirst">


              <div className="container bloque-form1">

              <div>
                <h1 className="titulo-form-verifica-disponibilidad">Verificá disponibilidad</h1>
                <h1 className="subtitulo-form-verifica-disponibilidad-shippingfirst">Ingresá la cantidad de pasajeros y verificá el cupo para ese día.</h1>
              </div>
                

                  <Form.Group className="contenedor-input" controlId="adultos">
                      <Form.Label className="mb-1 fs-5 label">
                        Cantidad de pax adultos <strong className="texto-informativo-input-labels">(desde {edadadulto} )</strong> <strong className="asterico-campo-obligatorio">*</strong>
                      </Form.Label>
                      <Form.Control
                        type="number"
                        min="0"
                        max="18"
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

                    <p id="validacion-adultos" className="mensaje"></p>  
                    
      
                  <Form.Group className="contenedor-input" controlId="menores">
                      <Form.Label className="mb-1 fs-5 label">
                        Cantidad de pax menores <strong className="texto-informativo-input-labels">(desde {edadmenor} )</strong>
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
                        Cantidad de pax bebés <strong className="texto-informativo-input-labels">(hasta {edadbebe} )</strong>
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
  
              </div>
  
  
              <div className="container bloque-form2-shippingsecond">
                    
              <Form.Group className="contenedor-calendario-shippingfirst" controlId="fecha">
                  {/* <Form.Label className="mb-1 fs-5 label">
                      Fecha del servicio <strong className="asterico-campo-obligatorio">*</strong>
                  </Form.Label> */}
                        <DayPicker 
                            // type="date"
                            name="fecha"
                            // value={fecha}
                            selected={fecha}
                            onSelect={setFecha}
                            mode="single"
                            modifiers={pickerFunction()}
                            modifiersStyles={ stockdays.pasajeros === 0 ? ({booked: bookedStyle}) : ({booked: conStock})}
                            onDayClick={handleDayClick}
                            locale={es}
                            footer={footer}
                            hidden={(mostrar)}
                            disabled={(disabledDays)}
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
  

                
              {mostrar && (<>
                <div className="mb-3"></div>
                <div className="d-flex justify-content-end mt-5">
                  <Button 
                  className="fs-5 boton-reservas-firstshipping" 
                  id="boton-submit"
                  // disabled={mostrar}
                  onClick={(e)=> funcionCallback(e)}
                  variant="primary" type="submit">
                    Continuar
                  </Button>

                  
                </div>
               </>)} 
                
              </div>
            </div>
          </Form>
        </div>
      </div>
    );
  }
  