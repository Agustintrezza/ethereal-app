import React, { useEffect, useReducer, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { getError } from '../utils';
import Container from 'react-bootstrap/Container';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';


import FormularioTango from '../components/formulario-tango/FormularioTango';
import FormularioPaquete from '../components/formulario-paquete/FormularioPaquete';
import FormularioTour from '../components/formulario-tour/FormularioTour';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
      case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
    return { ...state, loadingUpdate: false };
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        loadingUpload: false,
        errorUpload: '',
      };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };
    default:
      return state;
  }
};

export default function ProductEditScreen() {


  const params = useParams();
  const { id: productId } = params;

  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });


  const [payment, setPayment] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/products/${productId}`);

        setPayment(data.paymentMethodName);
        
        dispatch({ type: 'FETCH_SUCCESS' });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [productId]);


  return (
    <Container className="container">
      <Helmet>
        <title>Editar Producto</title>
      </Helmet>
      <div className='d-flex align-items-center justify-content-between titulo-formularios-productos'>
        {payment === 'Tango' && (<h1 className="titulo-principal-editar-producto">Editar Producto (Tango) {productId}</h1>)}
        {payment === 'Tour' && (<h1 className="titulo-principal-editar-producto">Editar Producto (Tour) {productId}</h1>)}
        {payment === 'Paquete' && (<h1 className="titulo-principal-editar-producto">Editar Producto (Paquete) {productId}</h1>)}
      </div>

      {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ): ('')}
  

      {payment === 'Tour' && (<FormularioTour/>)}
      {payment === 'Tango' && (<FormularioTango/>)}
      {payment === 'Paquete' && (<FormularioPaquete/>)}
      
    </Container>
  );
}