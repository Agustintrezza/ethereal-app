import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import Form from 'react-bootstrap/Form';

import { ExportCSV } from '../ExportCSV';
import useDrivePicker from 'react-google-drive-picker';
import logoDrive from '../assets/logos/logo-google-drive.png'
import { format } from 'date-fns';

import 'react-tippy/dist/tippy.css'
import {Tooltip} from 'react-tippy';
import { MdEdit } from 'react-icons/md';
import { AiFillDelete } from 'react-icons/ai';


const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        users: action.payload,
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
export default function UserListScreen() {
    const navigate = useNavigate();
  const [{ loading, error, users, loadingDelete, successDelete }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const { state } = useContext(Store);
  const { userInfo } = state;

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
  

const fileName="UsuariosBackup"


  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/users`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        const arrayUserssexcel = [
          ...data.map(x => x)
        ];
        console.log('array de usuarios para descargar',arrayUserssexcel);

        if (data) {
          setExcel(arrayUserssexcel);
          console.log(excel);
        }

        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    if(successDelete) {
        dispatch({type: 'DELETE_RESET'});
    } else {
        fetchData();
    }
    
  }, [userInfo, successDelete]);

  const deleteHandler = async (user) => {
    if (window.confirm('Estás seguro de eliminar el usuario?')) {
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await axios.delete(`/api/users/${user._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success('Usuario eliminado exitosamente');
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (error) {
        toast.error(getError(error));
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
    }
  };
  // const navigates = () => {
  //   navigate('/?redirect=/signup');
  // }
  return (
    <div className="container">
      <Helmet>
        <title>Usuarios - Administrador</title>
      </Helmet>
      <Row className="contenedor-titulo-usuarios">
        <Col>
          <h1 className='py-3'>Usuarios</h1>
        </Col>
        <Col className="col text-end">
          <div>
            {/* <Button className="boton-reservas" type="button" onClick={navigates}>
              Crear Usuario
            </Button> */}
            <Button className='boton-reservas-admin' type="button" href="/admin/crear-usuario">Crear cuenta</Button>
          </div>
        </Col>
      </Row>

      <div className='contenedor-table'>
      {loadingDelete && <LoadingBox></LoadingBox>}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
        <table className="table">
          <thead>
            <tr>
              <th>FECHA DE CREACIÓN</th>
              <th>NOMBRE</th>
              <th>EMAIL</th>
              <th>TELEFONO</th>
              <th className="nombre-tabla-head text-center">ADMIN ?</th>
              <th className="nombre-tabla-head text-center">ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
            
            const fechaParseada = new Date(user.createdAt);
                const fechaFinalParseada = fechaParseada.toLocaleDateString('es-ES', {dateStyle: 'full'});
                const horaProductoparseada = format(fechaParseada, 'HH:mm:ss');
            
            return (
              <tr key={user._id}>
                <td className="contentedor-servicio-tabla-producto">{fechaFinalParseada} a las <strong>{horaProductoparseada}</strong></td>
                <td className="nombre-tabla-head">{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td className="text-center">{user.isAdmin ? 'YES' : 'NO'}</td>
                <td className="text-center">

                <Tooltip title="Editar Usuario" position="top" trigger="mouseenter">
                  <MdEdit
                    className="boton-editar-admin-reservas"
                    type="button"
                    variant="primary"
                    onClick={() => navigate(`/admin/user/${user._id}`)}
                  />
                </Tooltip>
                  &nbsp;
                <Tooltip title="Eliminar Usuario" position="top" trigger="mouseenter">
                  <AiFillDelete
                    className="boton-eliminar"
                    type="button"
                    variant="danger"
                    onClick={() => deleteHandler(user)}
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