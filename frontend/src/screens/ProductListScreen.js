import React, { useContext, useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import { getError } from '../utils';

import { ExportCSV } from '../ExportCSV';
import useDrivePicker from 'react-google-drive-picker';
import logoDrive from '../assets/logos/logo-google-drive.png'
import { format } from 'date-fns';
import { AiFillDelete, AiOutlineEye } from 'react-icons/ai';

import 'react-tippy/dist/tippy.css'
import {Tooltip} from 'react-tippy';
import { MdEdit } from 'react-icons/md';


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

export default function ProductListScreen() {
  const [{ loading, error, products, pages, loadingCreate, loadingDelete, successDelete }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get('page') || 1;

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
  

const fileName="ProductosBackup"

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/products/admin?page=${page} `, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        dispatch({ type: 'FETCH_SUCCESS', payload: data });

        console.log(data)
        if(data) {
          setExcel(data.products)
          console.log(excel)
        }
      } catch (err) {}
      
      // const arrayProductossexcel = [
      //     ...data.map(x =>  x.products),
      //     // console.log(x)
      //   ];
      //   console.log('array de ordenes para descargar',arrayProductossexcel);

      //   if (data) {
      //     setExcel(arrayProductossexcel);
      //   }
      //   console.log(excel)
    };
    
    if(successDelete) {
      dispatch({ type: 'DELETE_RESET'});
    } else {
      fetchData();
    }
  }, [page, userInfo, successDelete]);

  // const createHandler = async () => {
  //   if (window.confirm('Seguro que quieres crear un nuevo producto?')) {
  //     try {
  //       dispatch({ type: 'CREATE_REQUEST' });
  //       const { data } = await axios.post(
  //         '/api/products',
  //         {},
  //         {
  //           headers: { Authorization: `Bearer ${userInfo.token}` },
  //         }
  //       );
  //       toast.success('product created successfully');
  //       dispatch({ type: 'CREATE_SUCCESS' });
  //       navigate(`/admin/product/${data.product._id}`);
  //     } catch (err) {
  //       toast.error(getError(error));
  //       dispatch({
  //         type: 'CREATE_FAIL',
  //       });
  //     }
  //   }
  // };

  const createHandler = async () => {
    if (window.confirm('Seguro que quieres crear un nuevo producto?')) {
      navigate('/admin/payment')
    }
  };

  const deleteHandler = async (product) => {
    if (window.confirm('Seguro que quieres crear eliminar el producto?')) {
      try {
        await axios.delete(`/api/products/${product._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success('Producto eliminado exitosamente');
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
    <div className='container contenedor-productos-listado'>
      <Helmet>
        <title>Servicios - Administrador</title>
      </Helmet>
       <Row className="align-items-center justify-content-between d-flex mb-5">
        <Col>
          <h1 className='py-3'>Servicios</h1>
        </Col>
        <Col className="col contenedor-boton-crear-producto">
          <div>
            <Button className="boton-reservas-admin" type="button" onClick={createHandler}>
              Crear servicio
            </Button>
          </div>
        </Col>
      </Row>

      <div className="tabla-productos">

       {loadingCreate && <LoadingBox></LoadingBox>}
       {loadingDelete && <LoadingBox></LoadingBox>}
       
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <table className="table table-hover">
            <thead>
              <tr>
                {/* <th>ID DEL PRODUCTO</th> */}
                <th>NOMBRE DEL SERVICIO</th>
                {/* <th>PRECIO</th> */}
                <th>TIPO DE SERVICIO</th>
                <th>ETIQUETA</th>
                <th>FECHA DE CREACIÓN</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                
                const fechaParseada = new Date(product.createdAt);
                const fechaFinalParseada = fechaParseada.toLocaleDateString('es-ES', {dateStyle: 'full'});
                const horaProductoparseada = format(fechaParseada, 'HH:mm:ss');
                
                return(
                <tr key={product._id}>
                  {/* <td>{product._id}</td> */}

                  <td className="contentedor-servicio-tabla-producto">
                    <Tooltip title="Ver Servicio" position="top" trigger="mouseenter"> 
                          <Link className="link-table" to={`/product/${product.slug}`}>{product.name}</Link>
                    </Tooltip>
                  </td>
                  
                  {/* <td>{product.price}</td> */}
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>{fechaFinalParseada} a las <strong>{horaProductoparseada}</strong></td>

            
                 
                  <td className="fecha-tabla-head">


                  <Tooltip title="Editar Servicio" position="top" trigger="mouseenter">
                      <MdEdit
                      className="boton-editar-admin-reservas"
                      type="button" 
                      variant="primary" 
                      onClick={() => navigate(`/admin/product/${product._id}`)}
                      />
                  </Tooltip>
                    
                      
                      &nbsp;

                    <Tooltip title="Eliminar Servicio" position="top" trigger="mouseenter">    
                    < AiFillDelete
                      className="boton-eliminar"
                      type="button"
                      variant="danger"
                      onClick={() => deleteHandler(product)}
                      />
                    </Tooltip>
                  </td>

                </tr>
              )
              }
              )}
            </tbody>
          </table>
          <div className="my-5">
            {[...Array(pages).keys()].map((x) => (
              <Link
                className={x + 1 === Number(page) ? 'btn-primary text-bold btn-paginacion' : 'btn'}
                key={x + 1}
                to={`/admin/products?page=${x + 1}`}
              >
                {x + 1}
              </Link>
            ))}
          </div>

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
