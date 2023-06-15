import { useReducer, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { getError } from "../utils";

import './ProductStyles.css';

import Tour from '../components/tour/Tour.jsx';
import Tango from '../components/tango/Tango.jsx';
import Paquete from '../components/paquete/Paquete.jsx';


const reducer = (state, action) => {
    switch (action.type) {
      case 'REFRESH_PRODUCT':
      return { ...state, product: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreateReview: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreateReview: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreateReview: false };
      case 'FETCH_REQUEST':
        return {...state, loading: true};
      case 'FETCH_SUCCESS':
        return {...state, product: action.payload, loading: false};
      case 'FETCH_FAIL':
        return { ...state, loading:false, error: action.payload };
        default:
          return state;
    }
  }

function ProductScreen() {

    const [products, setProducts] = useState([]);
    const params = useParams()
    const {slug} = params;

    const [{ loading, error, product }, dispatch] = useReducer(reducer,  {
        product: [],
        loading: true, 
        error: '',
      })
  
      useEffect(() => {
        const fetchData = async () => {
          dispatch({ type: 'FETCH_REQUEST' });
          try {
            const result = await axios.get(`/api/products/slug/${slug}`);
            dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
          } catch (err) {
            dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
          }
        };
        fetchData();
      }, [slug]);

      useEffect(() => {
        const fetchProducts = async () => {
          try {
            const { data } = await axios.get(`/api/products`);
            setProducts(data);
          } catch (err) {
            // toast.error(getError(err));
          }
        }
        fetchProducts();
      }, [])

      console.log(products);
  

    return (
        loading? <LoadingBox/>
        : error? <MessageBox variant="danger">{error}</MessageBox>
        : 
      <div>

          {product.paymentMethodName === 'Tango' && (<Tango/>)}
          {product.paymentMethodName === 'Tour' && (<Tour/>)}
          {product.paymentMethodName === 'Paquete' && (<Paquete/>)}
          
      </div>     

    )
}

export default ProductScreen