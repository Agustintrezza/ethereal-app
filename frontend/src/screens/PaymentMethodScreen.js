import React, { useContext, useState, useReducer } from 'react';
import {Helmet} from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Store } from '../Store';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../utils';

export default function PaymentMethodScreen() {

    const navigate = useNavigate();
    const {state, dispatch: ctxDispatch} = useContext(Store);

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

        const [{ error }, dispatch] = useReducer(reducer, {
          loading: true,
          error: '',
        });

        const { userInfo } = state;
        const [paymentMethodName, setPaymentMethod] = useState ('');

    const submitHandler = async (e) => {
        e.preventDefault();
        ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName });
        // localStorage.setItem('paymentMethod', paymentMethodName);
        // navigate('/placeorder');
                try {
                  dispatch({ type: 'CREATE_REQUEST' });
                  const { data } = await axios.post(
                    '/api/products',
                    {paymentMethodName},
                    {
                      headers: { Authorization: `Bearer ${userInfo.token}` },
                    }
                  );
                  navigate(`/admin/product/${data.product._id}`);
                  toast.success('Producto creado exitosamente');
                  dispatch({ type: 'CREATE_SUCCESS' });
                  
                } catch (err) {
                  toast.error(getError(error));
                  dispatch({
                    type: 'CREATE_FAIL',
                  });
                }
    }

  return (
    <div>
        {/* <CheckoutSteps step1 step2 step3></CheckoutSteps> */}
        <div className="container payment-container">
            <Helmet>
                <title>Crear producto - Administrador</title>
            </Helmet>
            <h1 className='my-3 text-center'>¿Qué tipo de producto querés crear?</h1>
            <Form className="form-payment" onSubmit={submitHandler}>
                <div className="contenedor-radio-payment">
                        <div className="mb-3 fs-3">
                            <Form.Check
                            type="radio"
                            id="Tour"
                            label="Tour"
                            value="Tour"
                            checked={paymentMethodName === 'Tour'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                        </div>
                        <div className="mb-3 fs-3">
                            <Form.Check
                                type="radio"
                                id="Tango"
                                label="Show de Tango"
                                value="Tango"
                                checked={paymentMethodName === 'Tango'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                        </div>
                        <div className="mb-3 fs-3">
                            <Form.Check
                                type="radio"
                                id="Paquete"
                                label="Paquete"
                                value="Paquete"
                                checked={paymentMethodName === 'Paquete'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                        </div>

                </div>
                
                <div className="mb-3">
                    <Button className="boton-iniciar" type="submit">Continuar</Button>
                </div>
            </Form>
        </div>  

    </div>
  )
}
