import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';
// import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
// import isTomorrow from 'date-fns/isTomorrow'
// import { isYesterday } from 'date-fns';
import { format, isToday } from 'date-fns';
import { BiRefresh } from 'react-icons/bi';
import {BsFileEarmarkSpreadsheetFill} from 'react-icons/bs';
import {AiOutlineEye, AiFillDelete, AiOutlineStop} from 'react-icons/ai';
import { ExportCSV } from '../ExportCSV';

import 'react-tippy/dist/tippy.css'
import {Tooltip} from 'react-tippy';
// import { MdEdit } from 'react-icons/md';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, orders: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// const userInfo = localStorage.getItem('userInfo')

export default function OrderHistoryScreen() {

  

  // const { state } = useContext(Store);
  // const { userInfo } = state;
  const navigate = useNavigate();

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const { state } = useContext(Store);

  const {
    userInfo
  } = state;

  // console.log(new Date() - )


  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(
          `/api/orders/mine`,

          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
        console.log(data)

        const arrayOrderUserssexcel = [
          ...data.map(x => x.shippingAddress)
        ];
        console.log('array de usuarios para descargar',arrayOrderUserssexcel);

        if (data) {
          setExcel(arrayOrderUserssexcel);
          console.log(excel);
        }

      } catch (error) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(error),
        });
      }
    };
    fetchData();
    refetchData()
    
  }, [userInfo]);

  const fileName="MisÓrdenesEtherealTours"
  const [excel, setExcel] = useState();

   const refetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(
          `/api/orders/mine`,

          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
        console.log(data)


      } catch (error) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(error),
        });
      }
      setTimeout(() => {
        refetchData();
      }, 15000);
    };
    




  // const grabarCancelacion = (porcentaje, fechaCancelacion) => {
  //   console.log('Entro', porcentaje, fechaCancelacion)
  // }

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


  const cancelarHandler = (order) => {
    
    const fechaServicio = (new Date(order.shippingAddress.fecha))

    let miliSegundos = (new Date() - fechaServicio)
    let hora = (miliSegundos/(1000 * 60 * 60)).toFixed(2);
    // let hora1 = (miliSegundos/(1000 * 60 )).toFixed(2);

    // console.log(hora);
    // console.log(hora1);
    
    let fechacheta1 = new Date(order.shippingAddress.fecha);
    fechacheta1 = fechacheta1.toLocaleDateString('es-ES', {dateStyle: 'full'});    

    const enlace = "http://google.com";

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
      window.confirm('Estas cancelando tu reserva entre las 22:00 y las 00:00, el costo de cancelacion es del 50% del servicio')
        const porcentaje = 50;
        const fechaCancelacion = new Date();
        grabarCancelacion(porcentaje, fechaCancelacion, order);
    }
    else {
      if(window.confirm(`Está reserva puede ser cancelada sin costo de cancelación, el día del servicio es el (${fechacheta1}).${enlace}`)) {
        const porcentaje = 0;
        const fechaCancelacion = new Date();
        grabarCancelacion(porcentaje, fechaCancelacion, order);

      } else {
        result = false;
        console.log(result)
      }
    }
  }



  return (
    
    <div className='container contenedor-principal-ordenes' >
      <Helmet>
        <title>Mis Reservas - Ethereal Tour</title>
      </Helmet>
      
      {/* <h4 className="subtitulo-listado-reservas">Listado de reservas de la cuenta: {userInfo.name} </h4> */}
    
    <div className=' contendor-reservas'>
      

      
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
        <div className='contenedor-tus-reservas'>
            <h1 className='py-3 container contenedor-reservas titulo-listado-reservas'>¡Tus Reservas! ({orders.length})</h1>

            <div className="contenedor-enlace-refresh-orden" onClick={()=> refetchData()}>
                <BiRefresh className="icono-refresh-orden"/><p className="link-historial-reserva">Refrescar listado</p>           
              </div>
            {/* <h2>{nose && ({nose})}</h2> */}
        </div>
        
        <table className="table container contenedor-vertical table-hover">
          <thead>
            <tr>
              <th className="id-tabla-head">FECHA DE LA RESERVA</th>
              <th className="fecha-tabla-head">FECHA DEL SERVICIO</th>
              <th className="fecha-tabla-head">SERVICIO</th>
              {/* <th>TOTAL</th> */}
              <th>PASAJERO</th>
              <th className="text-center">CONFIRMACIÓN</th>
              <th className="text-center">ACCIONES</th>
            </tr>
          </thead>
          {orders.length === 0 ? ( 
            
                <div className="mt-5 contenedor-mensaje-tus-reservas">
                <MessageBox className="mensaje">
                  Aún no tenés reservas realizadas.
                </MessageBox>
                </div>
          ) 
          
          : (
          <tbody className="scroll">  
            
            

            {orders.map((order) => {

              const fechaParseada = new Date(order.shippingAddress.fecha);
              const fechaFinalParseada = fechaParseada.toLocaleDateString('es-ES', {dateStyle: 'full'});

              const fechaReservaparseada = new Date(order.creacion);
              const fechaReservafinalparseada = fechaReservaparseada.toLocaleDateString('es-ES', {dateStyle: 'full'});
              const horaReservaparseada = format(fechaReservaparseada, 'HH:mm:ss');

              return(
              <tr className="table-row" key={order._id}>
                <td>{fechaReservafinalparseada} / <strong>{horaReservaparseada}hs</strong></td>
                {/* <td>{order.createdAt.substring(0, 10)}</td> */}
                
                <td>{fechaFinalParseada}</td>
                <td>{order.shippingAddress.servicio}</td>
                {/* <td>{order.createdAt.substring(0, 10)}</td> */}
                {/* <td>{order.createdAt.toLocaleString()}</td> */}
                {/* <td>{pipo1}</td> */}
                
                {/* <td>{order.totalPrice.toFixed(2)}</td> */}
                <td>{order.shippingAddress.fullName}</td>
                <td className="contenedor-botones-tabla">
                  {/* {order.cancelacion.isCancel ? (<p className='cancelada'>CANCELADA</p>) : (<>{order.confirmacion.isDelivered ? (<p className='confirmada'>CONFIRMADA</p>) : (<p className='pendiente'>PENDIENTE</p>)}</>) } */}
                  {order.status.name === 'pending' && (<p className='pendiente'>PENDIENTE</p>)}
                  {order.status.name === 'confirmed' && (<p className='confirmada'>CONFIRMADA</p>)}
                  {order.status.name === 'cancel' && (<p className='cancelada'>CANCELADA</p>)}
                  {order.status.name === 'auto' && (<p className='auto-confirmada'>AUTO-CONFIRMADA</p>)}
                </td>
                <td className="contenedor-botones-historial-reservas">

                <Tooltip title="Ver reserva" position="top" trigger="mouseenter">
                  <BsFileEarmarkSpreadsheetFill
                    className="boton-detalles"
                    type="button"
                    variant="warning"
                    onClick={() => {
                      navigate(`/order/${order._id}`);
                    }}
                  />
                </Tooltip> 
                  &nbsp;
                <Tooltip title="Cancelar reserva" position="top" trigger="mouseenter">
                  <AiOutlineStop
                    type="button"
                    className="boton-eliminar"
                    variant="danger"
                    onClick={(e) => cancelarHandler(order)}
                  />
                </Tooltip>
                </td>
              </tr>
              )
              }
            )}
          </tbody>
          )}
        </table>


        <div className="contenedor-botones-drive-excel">
            <ExportCSV csvData={excel} fileName={fileName} className="boton-superior-descargar"/> 
        </div>

        </>
      )}
    </div>
    </div>
  );
}
