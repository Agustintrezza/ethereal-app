import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Store } from "../Store";
import axios from 'axios';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
// import Card from 'react-bootstrap/Card';
import MessageBox from '../components/MessageBox';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import {Link} from 'react-router-dom';
// import axios from 'axios';
import { FaTrash } from "react-icons/fa";
// import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
// import CheckoutSteps from "../components/CheckoutSteps";

import './ReservasStyles.css';


// import ListGroupItem from "react-bootstrap/ListGroupItem";



export default function FavoritosScreen() {
    // const navigate = useNavigate();
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const {
        cart: { cartItems }, userInfo,
        } = state;

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
        const removeItemHandler = (item) => {
            ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
        }
        // const checkoutHandler = () => {
        //     navigate('/?redirect=/shipping');
        // }

        const [proddestacado, setProddestacado] = useState([]);

        useEffect(() => {
            const fetchProducts = async () => {
              try {
                const { data } = await axios.get(`/api/products/destacados`);
                console.log(data)
                // setProducts([data.tango, data.tour, data.paquete, data.varios]);
                setProddestacado(data)
              } catch (err) {
                // toast.error(getError(err));
              }
            }
            fetchProducts();
          }, [])

          console.log(userInfo);


        return (
            <div>
      <Helmet>
        <title>¡Favoritos!</title>
      </Helmet>
      {/* <CheckoutSteps step1></CheckoutSteps> */}
      <h1 className="container titulo-reservas">¡Favoritos!</h1>
      {/* <h3 className="container">Recordá que siempre es una reserva por cada tour.</h3> */}
      <Row className="container contenedor-vertical">
        <Col md={8}>
          {cartItems.length === 0 ? (
            <MessageBox>
              Aún no tenés un tour agregado. <Link to="/">Ir al menú</Link>
            </MessageBox>
          ) : (
            <ListGroup className="contenedor-item-reservas">
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id} className="align-items-center d-flex">
                  <Row className="">
                    <Col md={12} className="d-flex">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="img-fluid rounded img-thumbnail imagen-reservas"
                      ></img>{' '}
                      <div className="d-flex justify-content-between">
                        <Link className="nombre-producto-reservas" to={`/product/${item.slug}`}>{item.name} ({item.servselect})</Link>
                        <Col className="d-flex align-items-center">
                          <Button className="boton-delete" variant="light"  
                          onClick={() => removeItemHandler(item)}
                          >
                            <FaTrash/>
                          </Button>
                        </Col>
                      </div>
                      
                    </Col>
                    
                    
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col className="mt-5" md={4}>
          <ListGroup variant="flush">
            <h2 className="titulos-responsive">Destacados</h2>
            {proddestacado.map((product)=>(

              

            <ListGroup.Item key={product._id} className="p-0 mt-3 contenedor-categorias">              
                <Link className="link-categorias-related mb-3" to={`/product/${product.slug}`}>{product.category}
                  <p className="subtitulo-categorias-related"><strong>{product.name}</strong></p>
                </Link>

                <Link className="link-categorias-related mb-3" to={`/product/${product.slug}`}>
                  <Card.Img className="img-producto-related" variant="top" src={product.image} alt="product" />
                </Link>
            </ListGroup.Item>
            ))}
            </ListGroup>
            <hr className="separador-productos separador-tours-relacionados"></hr>
      </Col>
        {/* <Col md={4}>
            <div className="d-grid">
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
            </div>
        </Col> */}
      </Row>
    </div>
        )
    }
