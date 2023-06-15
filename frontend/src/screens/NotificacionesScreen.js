import { useContext, useEffect, useReducer, useState } from "react";
import { Helmet } from "react-helmet-async";
import MessageBox from '../components/MessageBox';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';
// import Button from 'react-bootstrap/Button';

import logo from '../assets/logos/logo-ethereal.jpeg'

import {Link} from 'react-router-dom';
import { Store } from "../Store";
// import { FaTrash } from "react-icons/fa";   
import axios from "axios";
import { getError } from "../utils";
import LoadingBox from "../components/LoadingBox";

import {motion} from 'framer-motion';




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


    const NotificacionesScreen = () => {

    // const navigate = useNavigate();
    const { state } = useContext(Store);
    // const {
    //     cart: {  },
    //     } = state;

        // const updateCartHandler = async (item, quantity) => {
        //     const {data} = await axios.get(`/api/products/${item._id}`);
        //     if(data.countInStock < quantity) {
        //         window.alert('Disculpas, este servicio no esta actualmente disponible');
        //         return
        //       }
        
        //     ctxDispatch({
        //       type: 'CART_ADD_ITEM',
        //       payload: { ...item, quantity },
        //     });
        // }
        // const removeItemHandler = (item) => {
        //     ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
        // }
        // const checkoutHandler = () => {
        //     navigate('/?redirect=/shipping-first');
        //     }
    

    // const params = useParams()
    // const {slug} = params;
    // const { state } = useContext(Store);
    const { userInfo } = state;
    const [{ loading, error, successDelete }, dispatch] = useReducer(reducer, {
      loading: true,
      error: '',
    });

    const [notificaciones, setNotificaciones] = useState([]);
    // const [fechacreacion, setFechacreacion] = useState(Date);

    useEffect(() => {
        const fetchData = async () => {
          try {
            dispatch({ type: 'FETCH_REQUEST' });
            const { data } = await axios.get(`/api/notificaciones`, {
              headers: { Authorization: `Bearer ${userInfo.token}` },
            });
            if(data) {
            setNotificaciones(data)
            } else {
                console.log('Hola')
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
        //   dispatch({type:'DELETE_RESET'})
        } else {
          fetchData();
        }
        
      }, [userInfo, successDelete]);



        // console.log(fechacreacion);

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) :  (
    <div>

    <Helmet>
        <title>¡Notificaciones!</title>
    </Helmet>

    <motion.div initial={{scale: 1}}
    transition={{ duration: 1}}
    animate= {{scale: 1.01,zIndex: 1, // x:-5, y: -10
    duration: 2
    }} className="container-notificaciones">

    <div className="contenedor-cartelera-modificaciones">
        <h1 className="titulo-cartelera-notificaciones">Cartelera de Notificaciones ({notificaciones.length})</h1>
        {userInfo.isAdmin && (
          <Link className="enlace-link" to={'/admin/crear-notificacion'}>Editar notificaciones</Link>
        )}
    </div>

    <Row>
        <Col md={12}>
          {notificaciones.length === 0 ? (
            <MessageBox>
              Aún no hay notificaciones generadas. <Link to="/">Ir al menú</Link>
            </MessageBox>
          ) : (

            <>
            
            <ListGroup className="contenedor-item-reservas">
              {notificaciones.map((x, index) => {

                const fechaParseada = new Date(x.createdAt); 
                const fechaNotificacion = fechaParseada.toLocaleDateString('es-ES', {dateStyle: 'full'});


                return(
                <>
                <ListGroup.Item key={x._id} className="contenedor-macro-card-notificacion">
                  <Row className="">
                    <Col md={12} className="contenedor-general-card-notificacion">
                      <img
                        src={logo}
                        alt="logo"
                        className="img-fluid imagen-notificacion"
                      ></img>{' '}

                      <div className="contenedor-card-notificacion-edicion">
                            <div className="contenedor-titular-card-notificacion">
                                <h1 className="titulo-card-notificacion">{x.titulo}</h1>
                            </div>
                            <div className="contenedor-contenido-notificacion">
                                <p className="subtitulo-card-notificacion">{x.contenidobreve}</p>
                            </div>
                            <div className="contenedor-contenido-notificacion">
                                <p className="texto-extenso-card-notificacion">{x.contenidoextenso}</p>
                            </div>
                            
                      </div>
                        <div className="contenedor-fecha-card-notificacion">
                          <p>{fechaNotificacion}</p>
                          <p>#{index + 1000}</p>
                        </div>
                      
                    </Col>   
                  </Row>
                </ListGroup.Item>
                </>)
            })}
            </ListGroup>
            </>
          )}
        </Col>
        {/* <Col md={3}>
            {/* <div className="d-grid">
              <Button
                className="boton-reservas"
                type="button"
                variant="primary"
                disabled={cartItems.length > 1 || cartItems.length === 0}
                onClick={()=> checkoutHandler()}
              >
                ¡Comenzar la reserva!
              </Button>
              {cartItems.length > 1 
              ? (<ListGroup variant="flush">
              <ListGroup.Item variant="danger" className="rounded alerta-reservas">
                <Row>
                  <Col> Recorda que para hacer una reserva debes tener únicamente un tour seleccionado.<br></br>
                  Si tenés más de uno seleccionado, antes debes eliminarlo para poder continuar.
                  </Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>)
              : (<ListGroup variant="flush" className="d-none">
              <ListGroup.Item variant="success" className="rounded">
                <Row>
                  <Col> ¡TODO LISTO!
                  </Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>)
              
              }
            </div> */}
        {/* </Col> */} 
      </Row>
    </motion.div>

    </div>
  )
}

export default NotificacionesScreen