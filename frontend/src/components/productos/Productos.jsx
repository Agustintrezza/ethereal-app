import { useEffect, useReducer } from "react";
import './ProductosStyles.css';
import axios from 'axios';
// import logger from 'use-reducer-logger';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Product from "../Product";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../LoadingBox";
import MessageBox from "../MessageBox";
import { Link } from "react-router-dom";

const reducer = (state, action) => {
    switch (action.type) {
      case 'FETCH_REQUEST':
        return {...state, loading: true};
      case 'FETCH_SUCCESS':
        return {...state, products: action.payload, loading: false};
      case 'FETCH_FAIL':
        return { ...state, loading:false, error: action.payload };
        default:
          return state;
    }
  }

const Productos = () => {

    const [{ loading, error, products}, dispatch] = useReducer((reducer),  {
        products: [],
        loading: true, 
        error: ''
      })

      useEffect(() => {
        const fetchData = async () => {
          dispatch({type: 'FETCH_REQUEST'})
          try {
            const result = await axios.get('/api/products');
            dispatch({type:'FETCH_SUCCESS', payload: result.data})
          } catch(err) {
            dispatch({type: 'FETCH_FAIL', payload: err.message});
          }
          // setProducts(result.data);
  
  
        }
        fetchData();
      }, []);

  return (

    <div> 
    <Helmet>
      <title>Ethereal</title>
    </Helmet>
    
    <div className="contenedor-titulo-productos" id="productos">
      <h1 className="py-3 my-4 titulo-principal1">¡Productos Destacados!</h1>
      <p className="enlace-ver-todos">La mejor agencia receptiva de Buenos Aires.</p>
    </div>

    <div className="products">
        {loading? <LoadingBox/>
        :
        error? <MessageBox variant="danger">{error}</MessageBox>
        :
        <Row className="contenedor-productos">
        {products.map((product) => (
        <Col key={product.slug} sm={6} md={4} lg={3}  className="contenedor-card-producto">
            <Product product={product}></Product>
        </Col>
        ))}
        </Row>
        }
        </div>

        
    </div>
  )
}

export default Productos