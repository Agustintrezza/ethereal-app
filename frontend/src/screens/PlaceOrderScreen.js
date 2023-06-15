import React, { useContext, useReducer, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useNavigate } from 'react-router-dom'
// import CheckoutSteps from '../components/CheckoutSteps'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Form from "react-bootstrap/Form";
import { Store } from '../Store';
import ListGroupItem from 'react-bootstrap/esm/ListGroupItem';
import { getError } from '../utils';
import { toast } from 'react-toastify';
import Axios from 'axios';
import LoadingBox from '../components/LoadingBox';
import emailjs from "@emailjs/browser";
import axios from 'axios';
// import { format } from "date-fns";
// import {parseISO} from 'date-fns';


const reducer = (state, action) => {
    switch (action.type) {
        case 'CREATE_REQUEST':
            return { ...state, loading: true};
            case 'CREATE_SUCCESS':
                return {...state, loading: false}
            case 'CREATE_FAIL':
                return { ...state, loading: false};
            default:
                return state;
    }
}


export default function PlaceOrderScreen() {


    const navigate = useNavigate();

    const form = useRef();

    const [{ loading, }, dispatch] = useReducer(reducer, {
        loading: false,
    })

    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart, userInfo } = state;


    const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.2345 => 123.23

    cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
    );
    cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
    cart.taxPrice = round2(0.15 * cart.itemsPrice);
    cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;


  const placeOrderHandler = async (props, e) => {


      try {
          dispatch({ type: 'CREATE_REQUEST'});

          const { data } = await Axios.post(
              'api/orders',
              {
                  orderItems: cart.cartItems,
                  shippingAddress: cart.shippingAddress,
                  itemsPrice: cart.itemsPrice,
                  shippingPrice: cart.shippingPrice,
                  taxPrice: cart.taxPrice,
                  totalPrice: cart.totalPrice,
                  creacion: new Date().toUTCString(),
              },
              {
                  headers: {
                      authorization: `Bearer ${userInfo.token}`,
                  }
              }
          );

              const Apikey = '$x4p6GoNpiUnhS_2XIfDpKF9PTUEU8YDI$zqzf!aNo63dPD9wm5Pri9MRYVczFsN'
              Axios.post(`https://sheet.best/api/sheets/d19c57ca-e734-44c9-b0b4-c07a38264365`, 
              { 
                nombreservicio: cart.shippingAddress.servicio,
                fechaservicio: cart.shippingAddress.fecha,
                nombrevendedor: cart.shippingAddress.vendedor,
                hospedaje: cart.shippingAddress.hospedaje,
                habitacion: cart.shippingAddress.habitacion,
                cantpasajeros: cart.shippingAddress.cupofinal,
                adultos: cart.shippingAddress.adultos,
                menores: cart.shippingAddress.menores,
                bebes: cart.shippingAddress.bebes,
                nombre_pasajero: cart.shippingAddress.fullName,
                contacto_pasajero: cart.shippingAddress.contacto_pasajero,
                contacto_vendedor: cart.shippingAddress.phone,
                forma_de_pago: cart.shippingAddress.pago,
                mondeda_de_pago: cart.shippingAddress.monedapago,
                monto_cobrado: cart.shippingAddress.montocobrado,
                comentario_de_pago: cart.shippingAddress.comentariopago,
                comentario_de_reserva: cart.shippingAddress.comentarios,
              }, 
              {   

                  headers: { authorization: `Bearer ${userInfo.token}, ${Apikey}`, 
              }, 
            } 
          );

    // e.preventDefault();


  
          const sendEmail = (e) => {
            // e.preventDefault();
            console.log('Se ejecuto');
            emailjs
              .sendForm(
                "service_l282097",
                "template_siu60qb",
                form.current,
                "b6NNLnqS-HA4bOb2s",
              )
              .then(
                (result) => {
                  console.log(result.text);
                },
                (error) => {
                  console.log(error.text);
                }
              );
          };
        
            sendEmail();

          ctxDispatch({ type: 'CART_CLEAR' });
          dispatch({ type: 'CREATE_SUCCESS' });
          localStorage.removeItem('shippingAddress');
          localStorage.removeItem('cartItems');

          
          navigate(`/order/${data.order._id}`);

      } catch (err) {
          dispatch({ type: 'CREATE_FAIL'});
          toast.error(getError(err));
      }


      // try {
      //   dispatch({ type: 'CREATE_REQUEST'});
      //   const data = Axios.post('https://sheet.best/api/sheets/4212fc8e-cf56-4a99-9513-7c758784fe8f', {
      //     shippingAddress: cart.shippingAddress, 
      //   }
      //   )
      //   console.log(data)

      // } catch(err) {
      //   console.log(err)
      // }
  };

  const hola = new Date();
  hola.toUTCString();
  // console.log(hola);

  let shipping = JSON.parse(localStorage.getItem('shippingAddress'));
 
  const fechaselect = new Date(shipping.fecha);
  const fechafinal = fechaselect.toLocaleDateString('es-ES', {dateStyle: 'full'});
  console.log(fechafinal)
  // const nuevaa = new Date(fechaselect).toLocaleDateString('es-ES', { dateStyle:'full'})
  // console.log(nuevaa);

  // const pepe = cart.shippingAddress.fechaformat.toDateString();
  // console.log(fechafinal);

  return (
    <div>
        <Helmet>
            <title>Preview Order</title>
        </Helmet>
        {/* <CheckoutSteps step1 step2 step3></CheckoutSteps> */}
        
        <div className="container">

        
        
        <h1 className='titulo-reservas'>Detalles de la reserva</h1>
        <Row className="contenedor-reservas">
            <Col md={8}>
                <Card className="mb-3">
                    <Card.Body className="grid-placeorder p-4">
                        <Card.Text className="texto-reservas">
                    
                            Fecha de Servicio: <strong>{fechafinal}</strong><br/>
                            {/* Fecha de Servicio: <strong>{cart.shippingAddress.fecho}</strong><br/> */}
                            Nombre del Pasajero: <strong>{cart.shippingAddress.fullName}</strong> <br/>
                            Cantidad de Pasajeros Adultos: <strong>{cart.shippingAddress.adultos}</strong><br/>
                            {cart.shippingAddress.menores !== "" && ( 
                              <>
                              Cantidad de Pasajeros Menores: <strong>{cart.shippingAddress.menores}</strong><br/>
                              </>
                            )}
                            {cart.shippingAddress.bebes !== "" && ( 
                              <>
                              Cantidad de Pasajeros Bebés: <strong>{cart.shippingAddress.bebes}</strong><br/>
                              </>
                            )}
                            
                            Servicio Seleccionado: <strong>{cart.shippingAddress.servicio}</strong><br/>

                            {cart.shippingAddress.servselectfiltro && ( 
                            <>
                            Sub producto Seleccionado: <strong>{cart.shippingAddress.servselectfiltro}</strong><br/>
                            </>
                            )}

                            Hospedaje: <strong>{cart.shippingAddress.hospedaje}</strong><br/>
                        </Card.Text>
                        <Card.Text className="texto-reservas">
                            {cart.shippingAddress.habitacion !== "" && ( 
                              <>
                               Habitación: <strong>{cart.shippingAddress.habitacion}</strong> <br/>
                              </>
                              )}
                            Nombre del Vendedor: <strong>{cart.shippingAddress.vendedor}</strong> <br/>
                            Forma de Pago: <strong>{cart.shippingAddress.pago}</strong> <br/>
                            {shipping.pago === "Pago Manual" && (
                              <>
                              Moneda: <strong>{cart.shippingAddress.monedapago}</strong> <br/>
                              Monto a cobrar: <strong>{cart.shippingAddress.montocobrado}</strong> <br/>
                              {cart.shippingAddress.comentariopago !=='' && (
                                <>
                                Comentario del Pago: <strong>{cart.shippingAddress.comentariopago}</strong> <br/>
                                </>
                              )}
                              </>
                            )}
                            Teléfono Pasajero: <strong>{cart.shippingAddress.contacto_pasajero}</strong> <br/>
                            Teléfono Vendedor: <strong>{cart.shippingAddress.phone}</strong> <br/>
                            {cart.shippingAddress.comentarios !== "" && ( 
                              <>
                              Comentario de la reserva: <strong>{cart.shippingAddress.comentarios}</strong><br/>
                              </>
                            )}
                            
                        </Card.Text>
                        <Link className="fs-5 btn btn-warning my-2 boton-editar" to="/shipping-first">Editar</Link>
                    </Card.Body>
                </Card>
               
                <Card className="mb-3">
                    <Card.Body>
                        <Card.Title>Servicio Seleccionado</Card.Title>
                        <ListGroup variant="flush">
                            {cart.cartItems.map((item) => (
                                <ListGroupItem key={item._id}>
                                    <Row className="align-items-center">
                                        <Col md={12} className="d-flex align-items-center p-0">
                                            <img src={item.image} 
                                                 alt={item.name} 
                                                 className="img-fluid rounded img-thumbnail imagen-placeorder"
                                                 ></img>{' '}
                                            <Link className="nombre-producto-reservas" to={`/product/${item.slug}`}>{item.name}</Link>
                                        </Col>
                                        {/* <Col md={3}><span>{item.quantity}</span></Col>
                                        <Col md={3}>${item.price}</Col> */}
                                    </Row>
                                </ListGroupItem>
                            ))}

                        </ListGroup>
                    </Card.Body>
                </Card>
            </Col>  
            <Col md={4}>
                {/* <Card>
                    <Card.Body> */}
                    <div>
                        <h3 className="titulo-placeorder">Revisá tu reserva, si todo está bien confirmala haciendo click!</h3>
                        <ListGroup variant="flush">
                        
                            <ListGroup.Item>
                                <div className='d-grid'>
                                    <Button
                                    className="boton-reservas-placeorder"
                                    type="button"
                                    onClick={placeOrderHandler}
                                    disabled={cart.cartItems.lenght === 0}
                                    >
                                        Confirmar pedido de Reserva
                                    </Button>
                                </div>
            
                                {loading && <LoadingBox></LoadingBox>}
                            </ListGroup.Item>
                        </ListGroup>
                        </div>
                    {/* </Card.Body>
                </Card> */}
                
            </Col>
        </Row>

        <Form className="d-none" ref={form} onSubmit={placeOrderHandler}>
          <div className="grid-formulario container">
            <div className="container bloque-form1">

               <Form.Group controlId="fecha">
                <Form.Control defaultValue={fechafinal} name="fecha"
                // onSubmit={(e) => setFecha(order.shippingAddress.fecha)}
                />
              </Form.Group>

              <Form.Group controlId="fullName">
                <Form.Control defaultValue={cart.shippingAddress.fullName} name="fullName"/>
              </Form.Group>

              <Form.Group controlId="adultos">
                <Form.Control defaultValue={cart.shippingAddress.adultos} name="adultos"/>
              </Form.Group>

              <Form.Group controlId="menores">
                <Form.Control defaultValue={cart.shippingAddress.menores} name="menores"/>
              </Form.Group>

              <Form.Group controlId="servicio">
                <Form.Control defaultValue={cart.shippingAddress.servicio} name="servicio"/>
                {/* onSubmit={(e) => setServicio(e.defaultValue)} */}
              </Form.Group>

              <Form.Group controlId="hospedaje">
                <Form.Control defaultValue={cart.shippingAddress.hospedaje} name="hospedaje"/>
              </Form.Group>

              <Form.Group controlId="habitacion">
                <Form.Control defaultValue={cart.shippingAddress.habitacion} name="habitacion"/>
              </Form.Group>

              <Form.Group controlId="vendedor">
                <Form.Control defaultValue={cart.shippingAddress.vendedor} name="vendedor"/>
                {/* onSubmit={(e) => setEmail(order.shippingAddress.vendedor)} */}
              </Form.Group>

              <Form.Group controlId="pago">
                <Form.Control defaultValue={cart.shippingAddress.pago} name="pago"/>
              </Form.Group>

              <Form.Group controlId="monedapago">
                <Form.Control defaultValue={cart.shippingAddress.monedapago} name="monedapago"/>
              </Form.Group>

              <Form.Group controlId="montocobrado">
                <Form.Control defaultValue={cart.shippingAddress.montocobrado} name="montocobrado"/>
              </Form.Group>

              <Form.Group controlId="comentariopago">
                <Form.Control defaultValue={cart.shippingAddress.comentariopago} name="comentariopago"/>
              </Form.Group>

              <Form.Group controlId="phone">
                <Form.Control defaultValue={cart.shippingAddress.phone} name="phone"/>
              </Form.Group>

              <Form.Group controlId="comentarios">
                <Form.Control defaultValue={cart.shippingAddress.comentarios} name="comentarios"/>
              </Form.Group>

              <Form.Group controlId="contacto_pasajero">
                <Form.Control defaultValue={cart.shippingAddress.contacto_pasajero} name="contacto_pasajero"/>
              </Form.Group>

              {/* <Form.Group controlId="address">
                <Form.Control value={order.shippingAddress.address} name="address"/>
              </Form.Group> */}


              <div className="mb-3"></div>
              <div className="d-flex justify-content-end mt-5">
                <Button className="fs-5" variant="primary" type="submit">
                  Continuar
                </Button>
              </div>
            </div>
          </div>


        </Form>
        
        </div>
    </div>
  )
}
