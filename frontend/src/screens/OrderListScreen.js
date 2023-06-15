import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
// import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';
import {ExportCSV} from '../ExportCSV';
import { BiRefresh } from 'react-icons/bi';
import { format } from 'date-fns';
import {MdEdit} from 'react-icons/md';
import { AiFillDelete, AiOutlineEye } from 'react-icons/ai';
import useDrivePicker from 'react-google-drive-picker';
// import {FaGoogleDrive} from 'react-icons/fa';
import logoDrive from '../assets/logos/logo-google-drive.png'

import 'react-tippy/dist/tippy.css'
import {Tooltip} from 'react-tippy';
import {BsFileEarmarkSpreadsheetFill} from 'react-icons/bs';



const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        orders: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
    return { ...state, loading: false, error: action.payload };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};
export default function OrderListScreen() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, orders, loadingDelete, successDelete }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  // console.log(orders[0].shippingAddress)

  // const hola = [orders[0].shippingAddress] 

  const [openPicker, data,] = useDrivePicker();
  const [excel, setExcel] = useState();

  const handleOpenPicker = () => {
    openPicker({
      clientId: "72241109873-dvflt6mu7g4h8oh7v3fff64sdp906j5n.apps.googleusercontent.com",
      developerKey: "AIzaSyBDaTLvSzD6UautubKesMf08BtApKSh-Hw",
      viewId: "DOCS",
      token: "ya29.a0Ael9sCOlGkGVvfCw_P6keg4fmIapTv0TzkuKkNxZacSxnX3h55xseG2BnKmm0zg06N73JytlUezNgjP6_QSiGD7cI-hKu0SSKx92JkzFblx5qeWS7mXixTQ7CFqq-vlcsd9VW7q2hLuwf7ZscJ0RXL63H2ybaCgYKAWQSARMSFQF4udJhcjPJ0cB9KFKx45EfgJlXVA0163",
      showUploadView: true,
      showUploadFolders:true,
      multiselect: true,
    })
  }

  useEffect(() => {
    if(data) {
      data.docs.map((x) => console.log(x))
    }
  }, [data])
  

const fileName="OrdenesBackup"

  useEffect(() => {
    const fetchData = async (refetchData) => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
        console.log(data)

        const arrayOrdenesexcel = [
          ...data.map(x => x.modificacion.isModified ? (x.modificacion) : (x.shippingAddress)),
        ];
        console.log('array de ordenes para descargar',arrayOrdenesexcel);

        if (data) {
          setExcel(arrayOrdenesexcel);
        }
        
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    
    if(successDelete) {
      dispatch({type:'DELETE_RESET'})
    } else {
      fetchData();
    }

    // const refetchData = async () => {
    //   try {
    //     dispatch({ type: 'FETCH_REQUEST' });
    //     const { data } = await axios.get(`/api/orders`, {
    //       headers: { Authorization: `Bearer ${userInfo.token}` },
    //     });
    //     dispatch({ type: 'FETCH_SUCCESS', payload: data });
    //   } catch (err) {
    //     dispatch({
    //       type: 'FETCH_FAIL',
    //       payload: getError(err),
    //     });
    //   }
    // };
    refetchData();
    
    
  }, [userInfo, successDelete]);

  const refetchData = async () => {

      setTimeout(() => {
      refetchData()
    }, 15000);

      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };

  

  const deleteHandler = async (order) => {
    if (window.confirm('Seguro que quieres eliminar la orden?')) {
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await axios.delete(`/api/orders/${order._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success('Orden eliminada exitosamente');
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (err) {
        toast.error(getError(error));
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
    }
  };

  return (
    <div className='container general-ordenes'>
      <Helmet>
        <title>Ordenes - Administrador</title>
      </Helmet>
     
      <div className='contenedor-table'>
      {loadingDelete && <LoadingBox></LoadingBox>}  
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (

      <>
        <div className="contenedor-titulo-ordenes">
          <div className="contenedor-ordenes">
              <h1 className='container contenedor-reservas titulo-listado-reservas'>¡Reservas! ({orders.length})</h1>
          </div>

          <div className="contenedor-botones-actualizar-listado">
            <div className="contenedor-enlace-refresh-orden" onClick={()=> refetchData()}>
              <BiRefresh className="icono-refresh-orden"/><p className="link-historial-reserva">Actualizar listado</p>           
            </div>
            {/* <ExportCSV csvData={orders} fileName={fileName} className="boton-superior-descargar"/>
            <button className='btn btn-danger boton-superior-eliminar'>BORRAR TODAS</button> */}
          </div>
        </div>
        
        <table className="table table-hover">
          <thead>
            <tr className="header-tabla">
              {/* <th>IDENTIFICADOR</th> */}
              <th className="nombre-tabla-head">USUARIO</th>
              <th className="fecha-tabla-head">FECHA DE LA RESERVA</th>
              <th className="nombre-tabla-head">FECHA DEL SERVICIO</th>
              <th className="id-tabla-head">SERVICIO</th>
              <th className="text-center">PAX</th>
              <th className="nombre-tabla-head text-center">STATUS RESERVA</th>
              <th className="nombre-tabla-head text-center">ACCIONES</th>
              {/* <th className="id-tabla-head text-center">ACCIONES</th> */}
              {/* <th>ACCIONES</th> */}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {

              const fechaParseada = new Date(order.shippingAddress.fecha);
              const fechaFinalParseada = fechaParseada.toLocaleDateString('es-ES', {dateStyle: 'full'});

              const fechaReservaparseada = new Date(order.creacion);
              const fechaReservafinalparseada = fechaReservaparseada.toLocaleDateString('es-ES', {dateStyle: 'full'});
              const horaReservaparseada = format(fechaReservaparseada, 'HH:mm:ss');
              return(
              <tr key={order._id} className="fs-6">
                {/* <td>{order._id}</td> */}
                <td>{order.user ? order.user.name : 'USUARIO ELIMINADO'}</td>

                <td className="contentedor-servicio-tabla">{fechaReservafinalparseada} / <strong>{horaReservaparseada}</strong></td>
                <td className="contentedor-servicio-tabla">{fechaFinalParseada}</td>
                
                <td className="contentedor-servicio-tabla">{order.shippingAddress.servicio}</td>

                <td className="contentedor-dia-tabla text-center"><strong>{order.shippingAddress.cupofinal}</strong></td>
                <td className="contenedor-botones-tabla">
                  {/* {order.cancelacion.isCancel ? (<p className='cancelada'>CANCELADA</p>) : (<>{order.confirmacion.isDelivered || order.modificacion.isModConfirm ? (<p className='confirmada'>CONFIRMADA</p>) : (<p className='pendiente'>PENDIENTE</p>)}</>) } */}
                  {order.status.name === 'pending' && (<p className='pendiente'>PENDIENTE</p>)}
                  {order.status.name === 'confirmed' && (<p className='confirmada'>CONFIRMADA</p>)}
                  {order.status.name === 'cancel' && (<p className='cancelada'>CANCELADA</p>)}
                  {order.status.name === 'auto' && (<p className='auto-confirmada'>AUTO-CONFIRMADA</p>)}
                </td>
                {/* <td>
                  {order.confirmacion.isDelivered
                    ? order.deliveredAt.substring(0, 10)
                    : 'false' }
                </td> */}
                <td className="text-center contenedor-botones-admin-reservas">

                <Tooltip title="Ver Reserva" position="top" trigger="mouseenter">
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
                
                <Tooltip title="Editar Orden" position="top" trigger="mouseenter">
                    <MdEdit
                      className="boton-editar-admin-reservas"
                      type="button"
                      variant="primary"
                      onClick={() => {
                        navigate(`/admin/order/edit/${order._id}`);
                      }}
                    />
                </Tooltip> 
                  &nbsp;

                <Tooltip title="Eliminar Orden" position="top" trigger="mouseenter">
                    <AiFillDelete
                      type="button"
                      className="boton-eliminar"
                      variant="danger"
                      onClick={() => deleteHandler(order)}
                    />
                </Tooltip>     
                </td>
              </tr>
              )
            }
            
            )}
          </tbody>
        </table>


      <div className="contenedor-botones-drive-excel">
        <ExportCSV csvData={excel} fileName={fileName} className="boton-superior-descargar"/> 

        <img className='img-fluid logo-google-drive' src={logoDrive} alt="img-promo"></img>
        <button className="boton-google-drive" onClick={()=> handleOpenPicker()}>Drive</button>
          
      </div>   
       

        </>
      )}
      </div>
     
    </div>
  );
}