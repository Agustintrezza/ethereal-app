import React, { useContext, useEffect, useReducer, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { Store } from "../Store";
import Axios from "axios";
import { getError } from "../utils";
import { Helmet } from "react-helmet-async";
import Row from "react-bootstrap/Row";
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';  
import Button from 'react-bootstrap/Button';
import { toast } from "react-toastify";
// import emailjs from "@emailjs/browser";
import { isToday } from 'date-fns';
import isTomorrow from 'date-fns/isTomorrow';
import {BiRefresh} from 'react-icons/bi';
import {AiFillEdit } from 'react-icons/ai';

// import HistorialReserva from '../components/historial-reserva/HistorialReserva.jsx';


import {FcDocument} from 'react-icons/fc'

import Form from "react-bootstrap/Form";
// import CheckoutSteps from "../components/CheckoutSteps";
import axios from "axios";
import {format} from 'date-fns';
import Modal from 'react-bootstrap/Modal';


// import File from './pdf.worker.min.js';
// import { Viewer, Worker} from '@react-pdf-viewer/core';
// import {defaultLayoutPlugin} from '@react-pdf-viewer/default-layout';


import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';


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

export default function OrderScreen() {

  const form = useRef();

  // const [loading, setLoading] = useState(false);

  const { state } = useContext(Store);
  const { userInfo} = state;
  // const [file, setFile] = useState('');

  const params = useParams();
  const { id: orderId } = params;
  const navigate = useNavigate();

  const [{ loading, loadingUpload, order, error, successPay, loadingDeliver, successDeliver }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: "",
    successPay: false,
    loadingPay: false,
  });

  const [fechacancel, setFechacancel] = useState('');
  const [horacancel, setHoracancel] = useState('');

  const [fechaconfirm, setFechaconfirm] = useState('')
  const [horaconfirm, setHoraconfirm] = useState('');

  const [fechareserva, setFechareserva] = useState('');
  const [horareserva, setHorareserva] = useState('');

  const [comentarioconfirm, setComentarioconfirm] = useState('');
  const [pdfsconfirm, serPdfsconfirm] = useState('');

  const [fechamodificacion, setFechamodificacion] = useState(Date);
  const [horamodificacion, setHoramodificacion] = useState(Date);

  const [fechaconfirmmodificacion, setFechaconfirmmodificacion] = useState('');
  const [horaconfirmmodificacion, setHoraconfirmmodificacion] = useState('');

  const [fechaticket, setFechaticket] = useState('');
  const [horaCierre, setHoracierre] = useState(false);
  console.log(horaCierre)

  const [countModificacion, setCountmodificacion] = useState(Number);

  const [horarioReservas, setHorarioReservas] = useState('');
  const [horarioTango, setHorarioTango] = useState('');

  const [status, setStatus] = useState('');
  console.log(status)



  let fechaCancelFormat = new Date(fechacancel);
  let fechaCancelFormat1 = fechaCancelFormat.toLocaleDateString('es-ES', {dateStyle: 'full'});

  let fechaConfirmFormat = new Date(fechaconfirm);
  let fechaConfirmFormat1 = fechaConfirmFormat.toLocaleDateString('es-ES', {dateStyle: 'full'});

  let fechaReservaFormat = new Date(fechareserva);
  let fechaReservaFormat1 = fechaReservaFormat.toLocaleDateString('es-ES', {dateStyle: 'full'});

  let fechaModificacionFormat = new Date(fechamodificacion);
  let fechaModificacionFormat1 = fechaModificacionFormat.toLocaleDateString('es-ES', {dateStyle: 'full'});

  let fechaModificacionTicket = new Date(fechaticket);
  let fechaModificacionTicket1 = fechaModificacionTicket.toLocaleDateString('es-ES', {dateStyle: 'full'});

  let fechaconfirmModificacionFormat = new Date(fechaconfirmmodificacion);
  let fechaconfirmModificacionFormat1 = fechaconfirmModificacionFormat.toLocaleDateString('es-ES', {dateStyle: 'full'});


//   const idd = order.orderItems[0]._id

//   useEffect(()=> {
//     const fetchProducts = async (idd) => {
//       try {
//         dispatch({ type: "FETCH_REQUEST" });
//         const { data } = await Axios.get(`/api/products/${idd}`, {
//           headers: { authorization: `Bearer ${userInfo.token}` }, 
//         });
//         console.log(data)
//       }
//       catch (err) {
//       dispatch({ type: "FETCH_FAIL", payload: getError(err) });
//     }
//   }
// fetchProducts();
// })

  const [sheets, setSheets] = useState([]);  

  useEffect(() => {
    
    chequear();

    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await Axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` }, 
        });
        console.log(data.shippingAddress)

        if(data) {
          const arraySheets = [data.shippingAddress]
          // setSheets(arraySheets)
          console.log(arraySheets)
        }


        fetchData1();

        cerrarModificacionReserva(data);

        setFechareserva(data.createdAt);
        setHorareserva(format(new Date(data.createdAt), 'HH:mm:ss'));
        // setFechaservicio(data.shippingAddress.fecha)

        if(data.modificacion.countModificacion) {
          setCountmodificacion(data.modificacion.countModificacion)
        }

        if(data.modificacion.fechaModificacion) {
          setFechamodificacion(data.modificacion.fechaModificacion)
          setHoramodificacion(format(new Date(data.modificacion.fechaModificacion), 'HH:mm:ss'))
        }

        if(data.modificacion.fecha) {
            setFechaticket(data.modificacion.fecha)
        }

        if(data.modificacion.fechaConfirmModificacion) {
          setFechaconfirmmodificacion(data.modificacion.fechaConfirmModificacion)
          setHoraconfirmmodificacion(format(new Date(data.modificacion.fechaConfirmModificacion), 'HH:mm:ss'))
        }

        if(data.confirmacion.isDelivered) {
          setFechaconfirm(data.status.modified);
          setHoraconfirm(format(new Date(data.status.modified), 'HH:mm:ss'));
        }
        if(data.confirmacion.pdfs){
          serPdfsconfirm(data.confirmacion.pdfs)
        }
        if(data.confirmacion.comentarioreserva) {
          setComentarioconfirm(data.confirmacion.comentarioreserva)
        }
        if(data.cancelacion.isCancel) {
          setFechacancel(data.cancelacion.fechaCancelacion)
          setHoracancel(format(new Date(data.cancelacion.fechaCancelacion), 'HH:mm:ss'))
        } else {
        }

        if(data.status) {
          setStatus(data.status.name)
          // console.log(status)
        }
    
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }

      setInterval(() => {
        refetchOrder();
      }, 20000);
      
    };

    const fetchData1 = async () => {
      try {
        const { data } = await axios.get('/api/configuraciones', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        // setConfiguracion(data)
        
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

    const cerrarModificacionReserva = (data) => {
      const fechaServicio = (new Date(data.shippingAddress.fecha))

      let milisegundosCierre = (new Date() - fechaServicio);
      let horaCierreReserva = (milisegundosCierre/(1000 * 60 * 60)).toFixed(2);

      // console.log('hora de cierre de la modificación', horaCierreReserva)
      if(horaCierreReserva >= 0 ) {
        setHoracierre(true)
      } else {
        setHoracierre(false)
      }
    }

    // console.log(horaCierre);

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
  }, [order, userInfo, orderId, navigate, successPay, successDeliver]);



  const cerrarModificacionReserva = (data) => {
    const fechaServicio = (new Date(data.shippingAddress.fecha))

    let milisegundosCierre = (new Date() - fechaServicio);
    let horaCierreReserva = (milisegundosCierre/(1000 * 60 * 60)).toFixed(2);

    // console.log('hora de cierre de la modificación', horaCierreReserva)
    if(horaCierreReserva >= 0 ) {
      setHoracierre(true)
    } else {
      setHoracierre(false)
    }
  }

  const fetchData1 = async () => {
    try {
      const { data } = await axios.get('/api/configuraciones', {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      // setConfiguracion(data)
      
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

  const refetchOrder = async () => {
    try {
      dispatch({ type: "FETCH_REQUEST" });
      const { data } = await Axios.get(`/api/orders/${orderId}`, {
        headers: { authorization: `Bearer ${userInfo.token}` }, 
      });
      console.log(data.shippingAddress)

      if(data) {
        const arraySheets = [data.shippingAddress[0]]
        setSheets(arraySheets)
        console.log(sheets)
      }

      fetchData1();

      cerrarModificacionReserva(data);

      setFechareserva(data.createdAt);
      setHorareserva(format(new Date(data.createdAt), 'HH:mm:ss'));
      // setFechaservicio(data.shippingAddress.fecha)

      if(data.modificacion.countModificacion) {
        setCountmodificacion(data.modificacion.countModificacion)
      }

      if(data.modificacion.fechaModificacion) {
        setFechamodificacion(data.modificacion.fechaModificacion)
        setHoramodificacion(format(new Date(data.modificacion.fechaModificacion), 'HH:mm:ss'))
      }

      if(data.modificacion.fecha) {
          setFechaticket(data.modificacion.fecha)
      }

      if(data.modificacion.fechaConfirmModificacion) {
        setFechaconfirmmodificacion(data.modificacion.fechaConfirmModificacion)
        setHoraconfirmmodificacion(format(new Date(data.modificacion.fechaConfirmModificacion), 'HH:mm:ss'))
      }

      if(data.confirmacion.isDelivered) {
        setFechaconfirm(data.status.modified);
        setHoraconfirm(format(new Date(data.status.modified), 'HH:mm:ss'));
      }
      if(data.confirmacion.pdfs){
        serPdfsconfirm(data.confirmacion.pdfs)
      }
      if(data.confirmacion.comentarioreserva) {
        setComentarioconfirm(data.confirmacion.comentarioreserva)
      }
      if(data.cancelacion.isCancel) {
        setFechacancel(data.cancelacion.fechaCancelacion)
        setHoracancel(format(new Date(data.cancelacion.fechaCancelacion), 'HH:mm:ss'))
      } else {
      }

      if(data.status) {
        setStatus(data.status.name)
        // console.log(status)
      }
  
      dispatch({ type: "FETCH_SUCCESS", payload: data });

      
    } catch (err) {
      dispatch({ type: "FETCH_FAIL", payload: getError(err) });
    }
    
    
    
  };

  // const crearSheet = async () => {
  //   try {

  //     // dispatch({ type: "FETCH_REQUEST" });
  //     const { data } = await Axios.post(`http://sheet.best/api/sheets/4212fc8e-cf56-4a99-9513-7c758784fe8f`, {
  //       headers: { authorization: `Bearer ${userInfo.token}` }, 
  //     });
  //     // dispatch({ type: 'CREATE_REQUEST'});
  //     // const {data} = await axios.post('http://sheet.best/api/sheets/4212fc8e-cf56-4a99-9513-7c758784fe8f', {
  //     //   headers: { Authorization: `Bearer ${userInfo.token}` },
  //     //   shippingAddress: order.shippingAddress, 
  //     // }
  //     // )
  //     console.log(data);
  //   } catch(err) {
  //     console.log(err)
  //   }
  // }
  // crearSheet();



  async function confirmarModificacionHandler() {
    const fechaConfirmModificacion = new Date();
    const nombre = order.shippingAddress.fullName;
    const fechaConfirmacion = new Date();



    try {
      dispatch({ type: 'DELIVER_REQUEST' });
      const { data } = await Axios.put(
        `/api/orders/${order._id}/admin/confirmar-modificacion`,
        {fechaConfirmModificacion, nombre, pdf, pdfs, comentarioreserva, fechaConfirmacion,
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        },
        sendMessage(),
      );
      dispatch({ type: 'DELIVER_SUCCESS', payload: data });
      // localStorage.removeItem('shippingAddress');
      // localStorage.removeItem('cartItems');
      toast.success('Modificación confirmada exitosamente');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'DELIVER_FAIL' });
    }
  }

  async function deliverOrderHandler() {
    // refetchOrder()

    const fechaConfirmacion = new Date();
    try {
      dispatch({ type: 'DELIVER_REQUEST' });
      const { data } = await Axios.put(
        `/api/orders/${order._id}/deliver`,
        {pdf, pdfs, comentarioreserva, fechaConfirmacion},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        },
        sendMessage(),
      );
      console.log(data);

      dispatch({ type: 'DELIVER_SUCCESS', payload: data });
      localStorage.removeItem('shippingAddress');
      localStorage.removeItem('cartItems');
      toast.success('Orden entregada exitosamente');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'DELIVER_FAIL' });
    }
  }
  

  const sendMessage = async () => {

    // const enviarEmailMailgun = async (e) => {
    //   const fecha = order.shippingAddress.fecha
    //   const email = order.shippingAddress.vendedor
    //   const subject = `Confirmación de reserva Ethereal Tours ${order.shippingAddress.servicio}`
    //   const servicio = order.shippingAddress.servicio
    //   const phone = order.shippingAddress.phone
    //   const nombre = order.shippingAddress.fullName
    //   const phonepasajero = order.shippingAddress.contacto_pasajero
    //   const adultos = order.shippingAddress.adultos
    //   const menores = order.shippingAddress.menores
    //   const hospedaje = order.shippingAddress.hospedaje
    //   const habitacion = order.shippingAddress.habitacion
    //   const pago = order.shippingAddress.pago

    //   // console.log(email)
    //   // console.log(subject)
    //   // console.log('entra a la funcion')
    //   // e.preventDefault();
    //   // if (!fecha) {
    //   //   return toast.error('Please fill email, subject and message');
    //   // }
    //   try {
    //     // setLoading(true);
    //     const { data } = await axios.post(`/api/email`, {
    //       email,
    //       subject,
    //       fecha,
    //       servicio,
    //       phone,
    //       nombre,
    //       phonepasajero,
    //       adultos,
    //       menores,
    //       hospedaje,
    //       habitacion,
    //       pago
    //     });
    //     // setLoading(false);
    //     toast.success(data.name);
    //   } catch (err) {
    //     // setLoading(false);
    //     toast.error(
    //       err.response && err.response.data.message
    //         ? err.response.data.message
    //         : err.message
    //     );
    //   }
    //   // console.log(fecha)
    // };

    // enviarEmailMailgun();

    // try {
    //     const { dati } = await Axios.post(
    //         '/api/orders/send',
    //         {
    //           id_order: order._id,
    //           number: '+5491132368312',
    //           // number: `+549${order.shippingAddress.whatsapp}`,
    //           message: `¡Hola ${order.shippingAddress.fullName}!, gracias por elegir Ethereal! 

    //       *_¡Tu reserva fue confirmada con éxito!_*

    //       *Estos son los datos de tu rerserva:*

    //       Servicio Seleccionado: *${order.shippingAddress.servicio}*
    //       Nombre del Vendedor: *${order.shippingAddress.vendedor}*
    //       Teléfono del Vendedor: *${order.shippingAddress.phone}*
    //       Nombre del Pasajero: *${order.shippingAddress.fullName}*
    //       Fecha del servicio: *${order.shippingAddress.fecha}*
    //       Teléfono del pasajero: *${order.shippingAddress.contacto_pasajero}*
    //       Cantidad de Adultos: *${order.shippingAddress.adultos}*
    //       Cantidad de Menores: *${order.shippingAddress.menores}*                         
    //       Hospedaje: *${order.shippingAddress.hospedaje}*
    //       Habitación: *${order.shippingAddress.habitacion}*
    //       Forma de Pago: *${order.shippingAddress.pago}*
    //       Comentarios: *${order.shippingAddress.comentarios}*

    //       ¡Gracias por elegirnos!
    //       *www.etherealtour.turismo*
    //                                 `
    //         },
    //         {
    //             headers: {
    //                 authorization: `Bearer ${userInfo.token}`,
    //             }
    //         }
    //     );
    //     console.log('Console Dati:', dati);

    // } catch (err) {
    //     // console.log(err)
    //     toast.error(getError(err));
    // }

  //   const sendEmail = (e) => {
  //   // e.preventDefault();
  //   // console.log('Se ejecuto');
  //   emailjs
  //     .sendForm(
  //       "service_l282097",
  //       "template_siu60qb",
  //       form.current,
  //       "b6NNLnqS-HA4bOb2s",
  //     )
  //     .then(
  //       (result) => {
  //         console.log(result.text);
  //       },
  //       (error) => {
  //         console.log(error.text);
  //       }
  //     );
  // };

  //   sendEmail();
    
}



 function chequear() {
    if(order.confirm === 100 && !order.confirmacion.isDelivered && order.status.name === 'auto') {
      sendMessage();     
    } else {
    }
  }

  const [pdf, setPdf] = useState('');
  const [pdfs, setPdfs] = useState([]);
  const [comentarioreserva, setComentarioreserva] = useState('')

  // const [pdfFile, setPDFFile] = useState(null);
  // const [viewPdf, setViewPdf] = useState(null);

  // const fileType = ['application/pdf'];
  // const newplugin = defaultLayoutPlugin();


  // const VerPdf = (e) => {
  //   let selectedFile = e.target.files[0]
  //   if(selectedFile) {
  //     if(selectedFile && fileType.includes(selectedFile.type)) {
  //       let reader = new FileReader()
  //       reader.readAsDataURL(selectedFile)
  //       reader.onload = (e) => {
  //         setPDFFile(e.target.result)
  //       }
  //     }
  //     else {
  //       setPDFFile(null)
  //     }
  //   }
  //   else {
  //     console.log('Seleccionar un PDF')
  //   }
  // }

  // const SubmitPdf = (e) => {
  //   e.preventDefault()
  //   if(pdfFile !== null ) {
  //     setViewPdf(pdfFile)
  //   }
  //   else {
  //     setPDFFile(null)
  //   }
  // }


  const uploadFileHandler = async (e, forPdfs) => {

    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const { data } = await axios.post('/api/upload', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: 'UPLOAD_SUCCESS' });

      if (forPdfs) {
        setPdfs([...pdfs, data.secure_url]);
      } else {
        setPdf(data.secure_url);
      }
      toast.success('Documento agrgeado exitosamente.');
      
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
    }
  };

  const deleteFileHandler = async (fileName, f) => {
    setPdfs(pdfs.filter((x) => x !== fileName));
    toast.success('Documento eliminado exitosamente.');
  };

  const [fechacheta, setFechacheta] = useState('');

  if(loading === false && fechacheta === '') {
    
    let fechacheta1 = new Date(order.shippingAddress.fecha);
    fechacheta1 = fechacheta1.toLocaleDateString('es-ES', {dateStyle: 'full'});

    setFechacheta(fechacheta1)
    // console.log(fechacheta);
  }

  const redirigirPdf = (x) => {
  window.open(`${x}`, '_blank');
  }

  // console.log(fechacheta)

  async function grabarCancelacion(porcentaje, fechaCancelacion, order) {
    try {
      dispatch({ type: 'DELIVER_REQUEST' });
      const { data } = await axios.put(
        `/api/orders/${order._id}/cancelacion`,
        {porcentaje, fechaCancelacion},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        },
      );
      dispatch({ type: 'DELIVER_SUCCESS', payload: data });
      toast.success('Orden cancelada exitosamente');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'DELIVER_FAIL' });
    }
  }

  // async function anularModificacion(order) {
  //   try {
  //     dispatch({ type: 'DELIVER_REQUEST' });
  //     const { data } = await axios.put(
  //       `/api/orders/${order._id}/anular-modificacion`,
  //       {},
  //       {
  //         headers: { authorization: `Bearer ${userInfo.token}` },
  //       },
  //     );
  //     dispatch({ type: 'DELIVER_SUCCESS', payload: data });
  //     toast.success('Modificación anulada exitosamente');
  //   } catch (err) {
  //     toast.error(getError(err));
  //     dispatch({ type: 'DELIVER_FAIL' });
  //   }
  // }

  const cancelarHandler = (order) => {
    
    const fechaServicio = (new Date(order.shippingAddress.fecha))

    let miliSegundos = (new Date() - fechaServicio)
    let hora = (miliSegundos/(1000 * 60 * 60)).toFixed(2);
    // let hora1 = (miliSegundos/(1000 * 60 )).toFixed(2);
    
    let fechacheta1 = new Date(order.shippingAddress.fecha);
    fechacheta1 = fechacheta1.toLocaleDateString('es-ES', {dateStyle: 'full'});    

    let result = isToday(fechaServicio)
    if(result === true) {
      if(window.confirm(`Estás cancelando tu reserva el mismo día del servicio (${fechacheta1}), el costo de cancelación es del 100%`)) {
        const porcentaje = 100;
        const fechaCancelacion = new Date();
        grabarCancelacion(porcentaje, fechaCancelacion, order);
      } 
    } 
    else if (fechaServicio <= new Date()) {
      window.alert('Este servicio no puede ser cancelado, la fecha del mismo está en el pasado.')
    }
    else if (hora >= -2 & hora <0) {
      window.alert('Estas cancelando tu reserva entre las 22:00 y las 00:00, el costo de cancelacion es del 50% del servicio - Esta ')
        const porcentaje = 50;
        const fechaCancelacion = new Date();
        grabarCancelacion(porcentaje, fechaCancelacion, order);
    }
    else {
      if(window.confirm(`Está reserva puede ser cancelada sin costo de cancelación, el día del servicio es el (${fechacheta1})`)) {
        const porcentaje = 0;
        const fechaCancelacion = new Date();
        grabarCancelacion(porcentaje, fechaCancelacion, order);

      } else {
        result = false;
        // console.log(result)
      }
    }
  }


  const llamarProducto = async (x) => {
      try {
        // dispatch({ type: 'DELETE_REQUEST' });
       const { data } = await axios.get(`/api/products/${x._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        console.log(data)
        // navigate(`/product/${x._id}`)
        // dispatch({ type: 'DELETE_SUCCESS' });
        // toast.success('Ampliacion eliminada exitosamente');
      } catch (error) {
        toast.error(getError(error));
        // dispatch({
        //   type: 'DELETE_FAIL',
        // });
      }
  };



  const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

  
    const [selected, setSelected] = useState(null);
  
    const toggle = (i) => {
      if (selected === i) {
        return setSelected(null);
      }
  
      setSelected(i);
    };
    


   return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div> 
      <Helmet>
        <title>Orden {orderId}</title>
      </Helmet>
      {/* <CheckoutSteps step1 step2 step3 step4></CheckoutSteps> */}

      <div className="contenedor-titulo-refresh-orden">
          <h1 className="titulo-orden">¡Tu solicitud fue enviada con éxito!</h1>

          <div className="d-flex align-items-center">
              <div className="contenedor-enlace-refresh-orden" onClick={()=> refetchOrder()}>
                <BiRefresh className="icono-refresh-orden"/><p className="link-historial-reserva">Actualizar reserva</p>           
              </div>
              {userInfo && userInfo.isAdmin && (
                <div>
                      <Link className="link-historial-reserva" to={`/admin/order/edit/${order._id}`}><AiFillEdit className="icono-editar-orden"/>Editar Reserva</Link>
                </div>
              )}
          </div>
          
          
      </div>

      

      <Row className="container-centrado-orden contenedor-reservas">
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>


              <div>
                  
                  {/* <MessageBox variant="warning fs-5 fw-bold mt-4">RESERVA SOLICITADA EL {fechaReservaFormat1.toUpperCase()} a las {horareserva}</MessageBox> */}

                  {order.status.name === 'confirmed' && (
                  <MessageBox variant="success my-3 fw-bold fs-5">
                    RESERVA CONFIRMADA POR EL ADMINISTRADOR EL {fechaConfirmFormat1.toUpperCase()} a las {horaconfirm}.
                  </MessageBox>
                  )}
      
                  {order.status.name === 'pending' && (<>
                    <MessageBox variant="danger fw-bold fs-5">ESTADO DE LA RESERVA: PENDIENTE DE CONFIRMACIÓN</MessageBox>
                  </>)}

                  {order.status.name === 'auto' && (<>
                    <MessageBox variant="success fw-bold fs-5 mt-4">RESERVA CONFIRMADA AUTOMÁTICAMENTE POR EL SISTEMA ({fechaReservaFormat1.toUpperCase()} a las {horareserva}).</MessageBox>
                  </>)}
                
                  {order.status.name === 'cancel' && (
                  <>
                  <MessageBox variant="danger fw-bold fs-5 mt-4">ESTADO DE LA RESERVA: CANCELADA</MessageBox>
                  <MessageBox variant="danger fs-5 fw-bold">Reserva cancelada el {fechaCancelFormat1} a las {horacancel}. El porcentaje de cancelación de este servicio es del {order.cancelacion.porcentaje}%.</MessageBox>
                  </>
                  )} 

                {!order.cancelacion.isCancel &&(<>
                  {countModificacion >= 3 &&  (<>
                    <MessageBox variant="danger">
                    <div className="contenedor-sin-modificaciones">
                      <p className="sin-modificaciones">Hiciste las 3 modificaciones permitidas, en caso que requieras realizar algún cambio, ponete en contacto con nosotros a nuestro <strong>WhatsApp</strong></p>
                    </div>
                    </MessageBox>
                  </>)}
                </>)}

              </div>
                
            
              <div>
                {order.modificacion.isModified && (<>
                {!order.modificacion.isModConfirm && (
                  <div>
                  <MessageBox variant="info">
                  <h1 className="titulo-modificacion">PEDIDO DE MODIFICACION ({countModificacion}) <strong>({fechaModificacionFormat1} a las {horamodificacion})</strong></h1>

                  <div className="grid-placeorder p-2">
                            <Card.Text className="texto-reservas-modificacion">
                                Fecha de Servicio: <strong>{fechaModificacionTicket1}</strong> <br/>
                                {/* Fecha de Servicio: <strong>{order.shippingAddress.fecha}</strong> <br/> */}
                                Nombre del Pasajero: <strong>{order.modificacion.fullName}</strong> <br/>
                                Cantidad de Pasajeros Adultos: <strong>{order.modificacion.adultos}</strong><br/>
                                Cantidad de Pasajeros Menores: <strong>{order.modificacion.menores}</strong><br/>
                                Cantidad de Pasajeros Bebés: <strong>{order.modificacion.bebes}</strong><br/>
                                Servicio Seleccionado:  <strong>{order.modificacion.servicio}</strong><br/>
                                {order.modificacion.servselectfiltro && ( 
                                  <>
                                    Sub producto Seleccionado: <strong>{order.modificacion.servselectfiltro}</strong><br/>
                                  </>
                                  )}
                                Hospedaje: <strong>{order.modificacion.hospedaje}</strong><br/>
                                {order.modificacion.habitacion !== "" && ( 
                                  <>
                                  Habitación: <strong>{order.modificacion.habitacion}</strong> <br/>
                                  </>
                                  )}
                                
                            </Card.Text>
                            
                            <Card.Text className="texto-reservas-modificacion">
                                Nombre del Vendedor: <strong>{order.modificacion.vendedor}</strong> <br/>
                                {order.shippingAddress.pago === "Cuenta Corriente" && (
                                  <>
                                  Forma de Pago: <strong>{order.modificacion.pago}</strong><br/>
                                  </>
                                )}
                                {order.modificacion.pago === "Pago Manual" && (
                                  <>
                                  Moneda: <strong>{order.modificacion.monedapago}</strong> <br/>
                                  Monto a cobrar: <strong>${order.modificacion.montocobrado}</strong> <br/>
                                  Comentario del Pago: <strong>{order.modificacion.comentariopago}</strong> <br/>
                                  </>
                                )}
                                Teléfono del Vendedor: <strong>{order.modificacion.phone}</strong> <br/>
                                Teléfono del Pasajero: <strong>{order.modificacion.contacto_pasajero}</strong><br/>
                                {order.modificacion.comentarios && ( 
                                  <>
                                    Comentarios: <strong>{order.modificacion.comentarios}</strong><br/>  
                                  </>
                                  )}
                              
                            </Card.Text>    
                      </div>
                      </MessageBox>                  
                      
                  </div>
                )}


                {order.modificacion.isModConfirm && (
                  <div>
                  {/* <MessageBox variant="success fw-bold fs-5 mt-4">ESTADO DE LA RESERVA: MODIFICACIÓN CONFIRMADA POR EL ADMINISTRADOR</MessageBox> */}
                  <MessageBox variant="success">
                  <h1 className="titulo-modificacion">RESERVA FINAL (MODIFICADA/CONFIRMADA) <strong>({fechaconfirmModificacionFormat1} a las {horaconfirmmodificacion})</strong></h1>

                  <div className="grid-placeorder p-2">
                            <Card.Text className="texto-reservas-modificacion">
                                Fecha de Servicio: <strong>{fechacheta}</strong> <br/>
                                {/* Fecha de Servicio: <strong>{order.shippingAddress.fecha}</strong> <br/> */}
                                Nombre del Pasajero: <strong>{order.modificacion.fullName}</strong> <br/>
                                Cantidad de Pasajeros Adultos: <strong>{order.modificacion.adultos}</strong><br/>
                                Cantidad de Pasajeros Menores: <strong>{order.modificacion.menores}</strong><br/>
                                Cantidad de Pasajeros Bebés: <strong>{order.modificacion.bebes}</strong><br/>
                                Servicio Seleccionado: <strong>{order.modificacion.servicio}</strong><br/>
                                {order.modificacion.servselectfiltro && ( 
                                  <>
                                    Sub producto Seleccionado: <strong>{order.modificacion.servselectfiltro}</strong><br/>
                                  </>
                                  )}
                                Hospedaje: <strong>{order.modificacion.hospedaje}</strong><br/>
                                {order.modificacion.habitacion !== "" && ( 
                                  <>
                                  Habitación: <strong>{order.modificacion.habitacion}</strong> <br/>
                                  </>
                                  )}
                                
                            </Card.Text>
                            
                            <Card.Text className="texto-reservas-modificacion">
                                Nombre del Vendedor: <strong>{order.modificacion.vendedor}</strong> <br/>
                                {order.shippingAddress.pago === "Cuenta Corriente" && (
                                  <>
                                  Forma de Pago: <strong>{order.modificacion.pago}</strong><br/>
                                  </>
                                )}
                                {order.modificacion.pago === "Pago Manual" && (
                                  <>
                                  Moneda: <strong>{order.modificacion.monedapago}</strong> <br/>
                                  Monto a cobrar: <strong>${order.modificacion.montocobrado}</strong> <br/>
                                  Comentario del Pago: <strong>{order.modificacion.comentariopago}</strong> <br/>
                                  </>
                                )}
                                Teléfono del Vendedor: <strong>{order.modificacion.phone}</strong> <br/>
                                Teléfono del Pasajero: <strong>{order.modificacion.contacto_pasajero}</strong><br/>
                                {order.modificacion.comentarios && ( 
                                  <>
                                    Comentarios: <strong>{order.modificacion.comentarios}</strong><br/>  
                                  </>
                                  )}
                              
                            </Card.Text>    
                      </div>
                      </MessageBox>

                  </div>
                )}
                  
                </>)}


                
            
                
              </div>
            
            <div className="contenedor-general-botones-reservas">

                {/* {order.orderItems.map((x) => (
                    <Link key={x} className="nombre-producto-reservas" to={`/product/${x.slug}`} onClick={(e)=>llamarProducto(x)}>{x.name}</Link>
                  ))} */}

                  <Modal
                    show={show}
                    onHide={handleClose}
                    // backdrop="static"
                    keyboard={false}
                  >

                    <Modal.Header>
                      <Modal.Title className="subtitulo-producto-modal"> Historial de Status de la reserva</Modal.Title>
                    </Modal.Header>

                    <Modal.Body className="contenedor-historial">
                      
                    {order.status.history.map((x, i) => {
                      const fechaParseada = new Date(x.modified);             
                      const dateString = fechaParseada.toLocaleDateString('es-ES', {dateStyle: 'full'});
                      const horaString = format(fechaParseada, 'HH:mm:ss');

                      const fechaHistorialParseada = new Date(x.modifiedticket.fecha);
                      const dateHistorialParseada = fechaHistorialParseada.toLocaleDateString('es-ES', {dateStyle: 'full'});

                      if(order.shippingAddress.fullName == order.modificacion.fullName) {
                        // console.log('Es igual')
                      } else {
                        // console.log('Es distinto')
                      }

                      if(order.shippingAddress.adultos == order.modificacion.adultos) {
                        console.log('Es igual')
                      } else {
                        console.log('Es distinto')
                      }

                      
                      return(
                      <>
                      <div key={i}>
                          {x.name === 'created' && (<> 
                            <MessageBox variant="warning fs-5 fw-bold mt-3">RESERVA SOLICITADA EL {fechaReservaFormat1.toUpperCase()} a las <strong>{horareserva}</strong>.</MessageBox>
                          </>)}

                          {x.name === 'auto' && (<>
                            <MessageBox variant="success fw-bold fs-5 mt-4">RESERVA CONFIRMADA AUTOMÁTICAMENTE POR EL SISTEMA ({fechaReservaFormat1.toUpperCase()} a las {horareserva}).</MessageBox>
                          </>)}

                          {x.name === 'pending' && (<> 
                            <MessageBox className="contenedor-generalisimo-modal-modificacion" variant="info">
                              <div className="contenedor-general-modificacion-modal">
                                <h1 className="titulo-modificacion">PEDIDO DE MODIFICACION ({x.modifiedticket.countTicket}) EL DÍA {dateString.toUpperCase()} A LAS <strong>{horaString}</strong>. MODIFICADO POR {x.modifiedBy}.</h1>
                      
                                  <div className={selected === i ? "contenido mostrar" : "contenido"}>

                            <div className="grid-ticket">
                              <Card.Text className="texto-ticket-modificacion">
                                  <strong className="propiedad-ticket">Fecha: </strong><strong className="valor-ticket">{dateHistorialParseada}</strong> <br/>
                                  <strong className="propiedad-ticket">Nombre: </strong><strong className="valor-ticket">{x.modifiedticket.fullName}</strong> <br/>
                                  <strong className="propiedad-ticket">Adultos: </strong><strong className="valor-ticket">{x.modifiedticket.adultos}</strong><br/>
                                  <strong className="propiedad-ticket">Menores: </strong><strong className="valor-ticket">{x.modifiedticket.menores}</strong><br/>
                                  <strong className="propiedad-ticket">Bebés: </strong><strong className="valor-ticket">{x.modifiedticket.bebes}</strong><br/>
                                  <strong className="propiedad-ticket">Servicio: </strong><strong className="valor-ticket">{x.modifiedticket.servicio}</strong><br/>
                                  {x.modifiedticket.servselectfiltro && ( 
                                    <>
                                      <strong className="propiedad-ticket">Subproducto: </strong><strong className="valor-ticket">{x.modifiedticket.servselectfiltro}</strong><br/>
                                    </>
                                    )}
                                  <strong className="propiedad-ticket">Hospedaje: </strong><strong className="valor-ticket">{x.modifiedticket.hospedaje}</strong><br/>
                                  {x.modifiedticket.habitacion !== "" && ( 
                                    <>
                                    <strong className="propiedad-ticket">Habitación: </strong><strong className="valor-ticket">{x.modifiedticket.habitacion}</strong> <br/>
                                    </>
                                    )}
                                  
                              </Card.Text>
                              
                              <Card.Text className="texto-ticket-modificacion">
                              <strong className="propiedad-ticket">Vendedor: </strong><strong className="valor-ticket">{x.modifiedticket.vendedor}</strong> <br/>
                                  {order.shippingAddress.pago === "Cuenta Corriente" && (
                                    <>
                                    <strong className="propiedad-ticket">Forma de Pago: </strong><strong className="valor-ticket">{x.modifiedticket.pago}</strong><br/>
                                    </>
                                  )}
                                  {x.modifiedticket.pago === "Pago Manual" && (
                                    <>
                                    <strong className="propiedad-ticket">Moneda: </strong><strong className="valor-ticket">{x.modifiedticket.monedapago}</strong> <br/>
                                    <strong className="propiedad-ticket">Monto a cobrar: </strong><strong className="valor-ticket">${x.modifiedticket.montocobrado}</strong> <br/>
                                    <strong className="propiedad-ticket">Comentario del Pago: </strong><strong className="valor-ticket">{x.modifiedticket.comentariopago}</strong> <br/>
                                    </>
                                  )}
                                  <strong className="propiedad-ticket">Teléfono del Vendedor: </strong><strong className="valor-ticket">{x.modifiedticket.phone}</strong> <br/>
                                  <strong className="propiedad-ticket">Teléfono del Pasajero: </strong><strong className="valor-ticket">{x.modifiedticket.contacto_pasajero}</strong><br/>
                                  {x.modifiedticket.comentarios && ( 
                                    <>
                                      <strong className="propiedad-ticket">Comentarios: </strong><strong className="valor-ticket">{x.modifiedticket.comentarios}</strong><br/>  
                                    </>
                                    )}
                                
                              </Card.Text>    
                          </div> 
                          </div>

                          <div className="contenedor-enlace-ticket">
                            <p onClick={() => toggle(i)} className="link-ticket-reserva">{selected === i ? ('Cerrar reserva') : ('Ver reserva') }</p>                        
                          </div>
                          </div>
                               
                            </MessageBox>
                          </>)}

                          {x.name === 'cancel' && (<> 
                            <MessageBox variant="danger fs-5 fw-bold">
                                Reserva cancelada {dateString.toUpperCase()} a las <strong>{horaString}</strong>. El porcentaje de cancelación de este servicio fue del {order.cancelacion.porcentaje}%. Cancelación realizada por {x.modifiedBy}.
                            </MessageBox>
                          </>)}

                          {x.name === 'confirmed' && (<> 
                            <MessageBox variant="success fw-bold fs-5">
                              RESERVA CONFIRMADA EL {dateString.toUpperCase()} a las <strong>{horaString}</strong> POR {x.modifiedBy}.
                            </MessageBox>
                          </>)}
                        </div>
                      </>
                      );
                          })}
                      
                    </Modal.Body>

                    {/* <HistorialReserva/> */}

                  </Modal>

              <div>
                <button className="link-historial-reserva" onClick={handleShow}>Historial de la reserva</button>
              </div>

              <div className="contenedor-boton-admin-reservas">
              
              
              {!order.cancelacion.isCancel &&(<>
                {countModificacion < 3 && (<>

                    {order.orderItems.map((x) => {

                    let dia = new Date();
                    let horaActualizada = new Date().getHours() + ':' + (dia.getMinutes()<10?'0':'') + dia.getMinutes();

                    const mañana = isTomorrow(new Date(order.shippingAddress.fecha))
                    const hoy = isToday(new Date(order.shippingAddress.fecha))
                    // console.log('mañana',mañana);
                    // console.log('hoy', hoy);

                    return(
                      <>
                      <button
                        className="boton-modificacion-reserva me-3"
                        type="button"
                        // variant="primary"
                        onClick={() => {
                      
                    if(x.paymentMethodName === 'Tango' && (horaActualizada >= horarioTango) && hoy) {
                      window.alert(`Pasadas las ${horarioTango} ya no es posible modifar el servicio para éste día en el sitio, si necesitas, podés hacerlo a través de Whatsapp hasta las 19:30hs `)
                    } else {
                      console.log('Holaaaaaaaaa')
                      if(x.paymentMethodName === 'Tour' && (horaActualizada >= horarioReservas) && mañana) {
                        window.alert(`Pasadas las ${horarioReservas} ya no es posible modifar el servicio para el día próximo en el sitio, si necesitas, podés hacerlo a través de Whatsapp hasta las 19:30hs `)
                      } else {
                        if(window.confirm(`Revisá siempre muy bien los datos que vas a modificar - ${order.shippingAddress.servicio}`)){
                          if(userInfo.isAdmin) {
                          navigate(`/admin/order/edit/${order._id}`);
                          } else {
                          navigate(`/order/edit/${order._id}`);
                          }
                        } else {
                          console.log('Hola')
                        }
                      }
                    }
                      
                    }
                  }
                  >
                        Modificar reserva
                        </button>
                              
                    </>                      
                  )
                                                       
                  })}
                </>
                )}
                  

                  {/* {order.modificacion.isModified && !order.modificacion.isModConfirm && (<>
                    <button
                    className="boton-anular-reserva me-3"
                    type="button"
                    // variant="primary"
                    // onClick={(e) => anularModificacion(order)}
                    onClick={()=> {
                      if(window.confirm(`¿Estás seguro que querés anular la modificación de esta reserva? - ${order.shippingAddress.servicio}`)) {
                        anularModificacion(order);
                      }
                    }}
                  >
                    Anular modificación
                  </button>
                  </>)} */}

                  <button
                    className="boton-cancelacion-reserva"
                    type="button"
                    // variant="primary"
                    onClick={(e) => cancelarHandler(order)}
                  >
                    Cancelar reserva
                  </button>

                  </>)}


                <div>

              </div>
              

            </div>
               
            </div>

            <div className="contenedor-confirmacion-info-reserva">
              {comentarioconfirm.length > 0 && (
                <Card>
                   <Card.Body>
                     <p className="titulo-aprobacion">Comentario de aprobación: <strong className="comentario-aprobacion">{comentarioconfirm}</strong></p><br/>
                   </Card.Body>
                 </Card>
                )}

                {pdfsconfirm.length > 0 && (
                  <Card>
                      <Card.Body className="p-0">
                        <Card.Title className="d-flex align-items-center">
                          <FcDocument style={{fontSize: "24px", marginRight: "5px"}}/>Documentos de la reserva:
                        </Card.Title>
                          <Card.Text>
                            <a className="enlace-cloudinary" href={order.confirmacion.pdf} rel="noreferrer" target="_blank">{order.confirmacion.pdf}</a> 
                            <a className="enlace-cloudinary" href={order.confirmacion.pdfs} rel="noreferrer" target="_blank">{order.confirmacion.pdfs}</a> 
                          </Card.Text> 
                      </Card.Body>
                  </Card>
                )}
              </div>


              
              <hr className="my-4"></hr>
              
              <div className="contenedor-datos-de-la-reserva">
                <h1 className="titulo-reserva-original">{order.modificacion.isModified ? ('RESERVA ORIGINAL') : ('DATOS DE LA RESERVA ')}</h1>
                <p className="fecha-solicitud-reserva-original">(SOLICITADA EL {fechaReservaFormat1.toUpperCase()} a las {horareserva})</p>
              </div>
              


              <div className="grid-reserva-original p-2 mt-2">

                        <Card.Text className="texto-reservas">

                          {order.orderItems.map((x) => {
                            
                            return(
                              <>
                              {/* {x.paymentMethodName === 'Tour' && (horaActualizada >= horarioReservas) && ('Es un tour')} */}

                              <div key={x} className="contenedor-servicio-seleccionado-link">
                                <p className="label-servicio-seleccionado">Servicio Seleccionado:</p><Link className="nombre-producto-reservas" to={`/product/${x.slug}`} onClick={(e)=>llamarProducto(x)}><strong>{order.shippingAddress.servicio}</strong></Link>
                              </div>
                              </>                      
                            )                       
                            })}

                            Fecha de Servicio: <strong>{fechacheta}</strong> <br/>
                            {/* Fecha de Servicio: <strong>{order.shippingAddress.fecha}</strong> <br/> */}
                            Nombre del Pasajero: <strong>{order.shippingAddress.fullName}</strong> <br/>
                            Cantidad de Pasajeros Adultos: <strong>{order.shippingAddress.adultos}</strong><br/>
                            Cantidad de Pasajeros Menores: <strong>{order.shippingAddress.menores}</strong><br/>
                            Cantidad de Pasajeros Bebés: <strong>{order.shippingAddress.bebes}</strong><br/>
                            
                            {order.shippingAddress.servselectfiltro && ( 
                              <>
                                Sub producto Seleccionado: <strong>{order.shippingAddress.servselectfiltro}</strong><br/>
                              </>
                              )}
                            Hospedaje: <strong>{order.shippingAddress.hospedaje}</strong><br/>
                            {order.shippingAddress.habitacion !== "" && ( 
                              <>
                               Habitación: <strong>{order.shippingAddress.habitacion}</strong> <br/>
                              </>
                              )}
                            
                        </Card.Text>
                        
                        <Card.Text className="texto-reservas">
                            Nombre del Vendedor: <strong>{order.shippingAddress.vendedor}</strong> <br/>
                            {order.shippingAddress.pago === "Cuenta Corriente" && (
                              <>
                              Forma de Pago: <strong>{order.shippingAddress.pago}</strong><br/>
                              </>
                            )}
                            {order.shippingAddress.pago === "Pago Manual" && (
                              <>
                              Moneda: <strong>{order.shippingAddress.monedapago}</strong> <br/>
                              Monto a cobrar: <strong>${order.shippingAddress.montocobrado}</strong> <br/>

                              {order.shippingAddress.comentariopago !== '' && (<>
                                Comentario del Pago: <strong>{order.shippingAddress.comentariopago}</strong> <br/>
                              </>)}
                              </>
                            )}
                            Teléfono del Vendedor: <strong>{order.shippingAddress.phone}</strong> <br/>
                            Teléfono del Pasajero: <strong>{order.shippingAddress.contacto_pasajero}</strong><br/>
                            {order.shippingAddress.comentarios && ( 
                              <>
                                Comentarios: <strong>{order.shippingAddress.comentarios}</strong><br/>  
                              </>
                              )}
                           
                        </Card.Text> 
                                                  
                </div>    

            </Card.Body>
          </Card>
        </Col>


        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>

            <div>
                  {order.status.name === 'confirmed' ? (
                  <ListGroup variant="flush">
                      <ListGroup.Item variant="success" className="rounded">
                        <Row>
                          <Col className="mensajes fw-bold">Tu solicitud fue aceptada! <br></br>
                          Ya tenés toda la reserva completa!<br></br>
                          <br></br>
                          A la casilla de email que nos indicaste, te haremos llegar todos ls detalles de la operación.<br></br>
                          Recordá que siempre podés comunicarte con nosotros al 4-768-1344.
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    </ListGroup>
                ) : ( order.status.name === 'auto' ?
                  <ListGroup variant="flush">
                      <ListGroup.Item variant="success" className="rounded">
                        <Row>
                          <Col className="mensajes fw-bold">Tu solicitud está confirmada con éxito. <br></br>
                          Ya tenés tu lugar reservado.<br></br>
                          Recordá que siempre podés comunicarte con nosotros al 4-768-1344.
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    </ListGroup>
                :
                <>
                <ListGroup variant="flush">
                      <ListGroup.Item variant="danger" className="rounded">
                        <Row>
                        {(!order.modificacion.isModified && !order.cancelacion.isCancel) && (<>
                            <Col className="mensajes fw-bold">Tu solicitud de reserva fue enviada con éxito! <br></br>
                              Estamos procesando la cantidad de lugar para confirmarte con éxito el proceso!<br></br>
                              En unos instante te confirmaremos la operación!
                            </Col>
                        </>)}
                        {(order.modificacion.isModified) && (<>
                            <Col className="mensajes fw-bold">Tu solicitud de modificación de reserva fue enviada con éxito! <br></br>
                              Estamos procesando la cantidad de lugar para confirmarte con éxito el proceso!<br></br>
                              En unos instante te confirmaremos la operación!
                            </Col>
                        </>)}
                        {(order.cancelacion.isCancel) && (<>
                            <Col className="mensajes fw-bold">Tu reserva fue cancelada con éxito! <br></br>
                              Estamos procesando la cantidad de lugar para confirmarte con éxito el proceso!<br></br>
                              En unos instante te confirmaremos la operación!
                            </Col>
                        </>)}
                        </Row>
                      </ListGroup.Item>
                    </ListGroup>

                    {/* <ListGroup variant="flush" className="contenedor-mensajes-order">
                      <ListGroup.Item variant="warning" className="rounded">
                        <Row>
                          <Col className="mensajes fw-bold">DESDE LA SECCIÓN "MIS RESERVAS" SIEMPRE VAS A PODER TENER ACCESO A TODAS TUS RESERVAS. <br></br>
                          <br></br>
                          DESDE AHÍ VAS A PODER SIEMPRE VERIFICAR EL ESTADO DE LAS MISMAS.
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    </ListGroup> */}
                </>
                  
                  )}
              </div>

                

            </Card.Body>
          </Card>
        
          {userInfo.isAdmin && order.status.name === 'pending' && (
                   <ListGroup.Item className="mt-3">
                  {loadingDeliver && <LoadingBox></LoadingBox>}
                  <div className="">
                    

                    <Form className="" onSubmit={deliverOrderHandler}>
                      {/* <Form.Group className="mb-3" controlId="pdfFile">
                          <Form.Label className="label">Adjuntar documento</Form.Label>
                          <Form.Control type="file" onChange={uploadFileHandler} />
                          {loadingUpload && <LoadingBox></LoadingBox>}
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="pdf">
                          <Form.Label className="label">Documento seleccionado</Form.Label>
                          {pdf.length === 0 ? <MessageBox>Aún no hay ningún documento seleccionado</MessageBox> :
                              (
                              <div>
                                  <Form.Control
                              value={pdf}
                              onChange={(e) => setPdf(e.target.value)}
                              required
                            />
                            <Button variant="primary" onClick={() => deleteFileHandler(pdf)}>
                                <i className="fa fa-times-circle">Borrar</i>
                            </Button>
                              </div>
                              
                              )
                          
                          }
                          </Form.Group> */}
                  

                  {/* {!order.status.name === 'cancel'  (<> */}

                        <Form.Group className="mb-3" controlId="additionalPdfsFile">
                        <Form.Label className="label fw-bold">Documentos Complementarios</Form.Label>
                        <Form.Control
                          type="file"
                          onChange={(e) => uploadFileHandler(e, true)}
                          // onChange={(e) => VerPdf(e, true)}
                        />
                        {loadingUpload && <LoadingBox></LoadingBox>}
                        </Form.Group>

                        {/* <button onClick={(SubmitPdf)}>VER PDF</button> */}

                        

                        <Form.Group className="mb-3" controlId="pdfs">
                          <Form.Label className="label fw-bold">Archivos Seleccionados</Form.Label>
                          {pdfs.length === 0 && <MessageBox>Aún no hay ningún documento agregado</MessageBox>}
                          <ListGroup variant="flush">
                            {pdfs.map((x) => (
                              <ListGroup.Item className="contenedor-imagen-cloudinary" key={x}>
                                <div className="imagen-cloudinary">
                                  <p className="link-imagen" onClick={()=>redirigirPdf(x)}>{x}</p>
                                </div>
                                <Button variant="primary mt-2" onClick={() => deleteFileHandler(x)}>
                                  <i className="fa fa-times-circle">Borrar</i>
                                </Button>
                              </ListGroup.Item>
                            ))}
                          </ListGroup>
                        </Form.Group>

                        <Form.Group className="contenedor-input" controlId="comentarioreserva">
                    <Form.Label className="mb-1 fs-5 label">Comentarios acerca del pago</Form.Label>
                    <Form.Control
                    as="textarea"
                    rows={3}
                    name="comentarioreserva"
                    value={comentarioreserva}
                    onChange={(e) => setComentarioreserva(e.target.value)} 
                    // required
                    />
                  </Form.Group>
                        

                        {/* <Button className="d-none" type="submit">
                          Adjuntar
                        </Button> */}

             

                      {!order.modificacion.isModified && (
                        <Button type="button" className="boton-reservas-order w-100" onClick={()=> {if(window.confirm('¿Estás seguro que querés confirmar ésta reserva?')) {deliverOrderHandler()}} }>
                        Confirmar Reserva
                        </Button>
                      )}
                        

                      {order.modificacion.isModified && (
                        <Button type="button" className="boton-reservas-order w-100" onClick={()=> {if(window.confirm('¿Estás seguro que querés confirmar ésta reserva?')) {confirmarModificacionHandler()}} }>
                        Confirmar Modificación
                        </Button>
                      )}

              {/* </>)} */}
                      
                     
                        

                    </Form>
                    
                    

                  </div>
                  

                </ListGroup.Item>
                
                )}

          {/* <div className="pdf-container">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.3.122/build/pdf.worker.min.js">
            {viewPdf && (
              <>
                <Viewer fileUrl={viewPdf} plugins={[newplugin]}/>
              </>
            )}

            {!viewPdf && <>No PDF</>}
            </Worker>
          </div> */}
          
        </Col>
      </Row>
      <Form className="d-none" ref={form} onSubmit={sendMessage}>
          <div className="grid-formulario container">
            <div className="container bloque-form1">

               <Form.Group controlId="fecha">
                <Form.Control defaultValue={order.shippingAddress.fecha} name="fecha"
                // onSubmit={(e) => setFecha(order.shippingAddress.fecha)}
                />
              </Form.Group>

              <Form.Group controlId="fullName">
                <Form.Control defaultValue={order.shippingAddress.fullName} name="fullName"/>
              </Form.Group>

              <Form.Group controlId="adultos">
                <Form.Control defaultValue={order.shippingAddress.adultos} name="adultos"/>
              </Form.Group>

              <Form.Group controlId="menores">
                <Form.Control defaultValue={order.shippingAddress.menores} name="menores"/>
              </Form.Group>

              <Form.Group controlId="servicio">
                <Form.Control defaultValue={order.shippingAddress.servicio} name="servicio"/>
                {/* onSubmit={(e) => setServicio(e.defaultValue)} */}
              </Form.Group>

              <Form.Group controlId="hospedaje">
                <Form.Control defaultValue={order.shippingAddress.hospedaje} name="hospedaje"/>
              </Form.Group>

              <Form.Group controlId="habitacion">
                <Form.Control defaultValue={order.shippingAddress.habitacion} name="habitacion"/>
              </Form.Group>

              <Form.Group controlId="vendedor">
                <Form.Control defaultValue={order.shippingAddress.vendedor} name="vendedor"/>
                {/* onSubmit={(e) => setEmail(order.shippingAddress.vendedor)} */}
              </Form.Group>

              <Form.Group controlId="pago">
                <Form.Control defaultValue={order.shippingAddress.pago} name="pago"/>
              </Form.Group>

              <Form.Group controlId="phone">
                <Form.Control defaultValue={order.shippingAddress.phone} name="phone"/>
              </Form.Group>

              <Form.Group controlId="comentarios">
                <Form.Control defaultValue={order.shippingAddress.comentarios} name="comentarios"/>
              </Form.Group>

              <Form.Group controlId="contacto_pasajero">
                <Form.Control defaultValue={order.shippingAddress.contacto_pasajero} name="contacto_pasajero"/>
              </Form.Group>

              {/* <Form.Group controlId="address">
                <Form.Control value={order.shippingAddress.address} name="address"/>
              </Form.Group> */}


              <div className="mb-3"></div>
              <div className="d-flex justify-content-end mt-5">
                <Button className="fs-5" variant="primary" type="submit">
                  Continuar
                </Button>
              </div>
            </div>
          </div>


        </Form>
    </div>
  );
}
