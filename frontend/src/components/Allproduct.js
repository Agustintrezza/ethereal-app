import { Link, useNavigate } from "react-router-dom";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
// import Rating from './Rating';
import axios from 'axios';
import { useContext, useEffect, useReducer, useState } from "react";
import { Store } from '../Store.js';
import { getError } from "../utils.js";
import { toast } from "react-toastify";
// import { BiBusSchool} from 'react-icons/bi';
// import { FaPlaneDeparture } from 'react-icons/fa';
// import { BiBed } from 'react-icons/bi';
// import { MdFoodBank } from 'react-icons/md';



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


function Product(props) {
    const {product} = props;

    const { state, dispatch: ctxDispatch } = useContext(Store);
    const {
        cart: { cartItems },
        userInfo,
        } = state;

    const [{ loading, error, loadingUpdate, loadingUpload  }, dispatch] = useReducer(reducer,  {
        product: [],
        loading: true, 
        error: '',
        })

    const navigate = useNavigate();


    const [horarioReservas, setHorarioReservas] = useState('');
    const [horarioTango, setHorarioTango] = useState('');
    const [configuracion, setConfiguracion] = useState('');

    useEffect(() => {
    const fetchData1 = async () => {
      try {
        const { data } = await axios.get('/api/configuraciones', {
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
    fetchData1();
  },[]);

    console.log(configuracion);

    /*Para obtener mañana*/
    const hoy = new Date();
    const mañana = new Date(hoy);
    mañana.setDate(mañana.getDate() + 1)
    const mañanaFormat = mañana.toLocaleString('es-ES', {dateStyle: 'full'})

    /* Generación de variable "horaActual" */
    let date = new Date();
    let horaActual = (date.getHours()<10?'0':'') + date.getHours() + ':' + (date.getMinutes()<10?'0':'') + date.getMinutes();
    console.log('hora actual',horaActual, horarioReservas);


    const alertaSeleccionTango = (e) => {
      if(product.paymentMethodName === 'Tango' && userInfo) {
      window.alert('Para reservar un servicio de tipo "TANGO", vas a tener que seleccionar primero un "Tipo de servicio".');
      // return navigate(`product/${product.slug}`)
      }
}

    const addToCartHandler = async (item, e) => {
      alertaSeleccionTango();

        ctxDispatch({ type: 'CART_CLEAR' });

        // if(product.paymentMethodName === 'Tango') {
        //   window.alert('Para iniciar la reserva de este producto primero tenés que seleccionar un subproducto en "Seleccionar servicio"');
        //   document.getElementById('btn-iniciar').disabled = true;
        // }

        if(!userInfo) {
          return navigate("/login", { replace: true })
        }

        if ((product.paymentMethodName === 'Tour' || product.paymentMethodName === 'Paquete') && horaActual > horarioReservas && userInfo) {
            window.alert(`Tené en cuenta que pasadas las ${horarioReservas}hs. Ya no es posible, tomar reservas para el día próximo, ${mañanaFormat}. `)
          } else {
              console.log('es mayor')
            }
          
            if ((product.paymentMethodName === 'Tango' || product.paymentMethodName === 'Tango') && horaActual > horarioTango && userInfo) {
              window.alert(`Tené en cuenta que pasadas las ${horarioTango}hs. Ya no es posible, tomar reservas para el día próximo, ${mañanaFormat}. Sí para todos demás días disponibles. `)
            } else {
              console.log('es mayor')
            }
        
        const existItem = cartItems.find((x) => x._id === product._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const {data} = await axios.get(`/api/products/${item._id}`);

        if(data.countInStock < quantity) {
            window.alert('Disculpas, este servicio no esta actualmente disponible');
            return
          }
    
        ctxDispatch({
          type: 'CART_ADD_ITEM',
          payload: { ...item, quantity },
        });

        // return navigate("/shipping")

        if(product.paymentMethodName === 'Tango') {
          navigate(`/product/${product.slug}`, { replace: true })
        } else {
          // console.log('Hola')
          return navigate("/shipping-first")
        }
        
    }

    return (
       <Card className="card-all">

            <Link to={`/product/${product.slug}`}>
            <img src={product.image} className="img-fluid imagen-todos-productos" alt={product.name}/>
            </Link>
       

            <Card.Body>

                    <div>
                        <Link to={`/product/${product.slug}`}>
                        <Card.Title>{product.name}</Card.Title>
                        </Link>
                </div>

                {/* <Rating rating={product.rating} numReviews={product.numReviews}></Rating> */}

                    <div className="contenedor-texto-card-all">
                        {/* <Card.Text className="fs-2 fw-bold">${product.price}</Card.Text> */}
                        {product.countInStock === 0? <Button variant='light' disabled>Este servicio no esta actualmente disponible</Button>
                        : 
                        <Button className="boton-card-all btn btn-primary" onClick={()=> addToCartHandler(product)}>Reservar</Button>
                        }
                    </div>  
            </Card.Body>
            
        </Card>
    )
}

export default Product;