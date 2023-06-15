import React, { useReducer, useEffect, useContext, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
// import Badge from 'react-bootstrap/Badge';
// import Rating from "../components/Rating";
import ListGroupItem from "react-bootstrap/esm/ListGroupItem";
// import { Helmet } from "react-helmet-async";
import LoadingBox from "../LoadingBox";
import MessageBox from "../MessageBox";
import { getError } from "../../utils";
import { Store } from "../../Store";
// import Form from 'react-bootstrap/Form'
// import FloatingLabel from "react-bootstrap/FloatingLabel";
import { Toaster, toast } from "react-hot-toast";
// import Galerias from '../galeria/Galerias.jsx';
import {MdEdit} from 'react-icons/md';
// import {AiOutlineCar, AiOutlineClockCircle, AiOutlineClose} from 'react-icons/ai';
// import { MdFoodBank, MdOutlineLocalHospital } from "react-icons/md";
// import { GoComment } from "react-icons/go";
// import { BiBed } from "react-icons/bi";
// import { BsCheck2 } from "react-icons/bs";
import {FiCopy} from 'react-icons/fi'
import Carousel from 'react-bootstrap/Carousel';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

import {BsChevronDown} from 'react-icons/bs';
import {FcCollapse} from 'react-icons/fc';

import {motion} from 'framer-motion';

import {CopyToClipboard} from 'react-copy-to-clipboard'
import './TangoStyles.css';
import SliderProductosTango from "../slider-productos-tango/SliderProductoTango";
import { AiFillStar } from "react-icons/ai";

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

const Tango = () => {

      // const [selectedImage, setSelectedImage] = useState('');
      const [products, setProducts] = useState([]);


      const navigate = useNavigate();
      const params = useParams()
      const {slug} = params;

      // const [especifico, setEspecifico] = useState('')
  
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

        const [prodfiltrado, setProdFiltrado] = useState([]);
        const [prodfiltrado2, setProdFiltrado2] = useState([]);

      useEffect(() => {
            const fetchProducts = async () => {
              try {
                const { data } = await axios.get(`/api/products/tipo`);
                // console.log(data)
                // setProducts([data.tango, data.tour, data.paquete, data.varios]);
                setProdFiltrado(data.tour)
                setProdFiltrado2(data.paquete)
              } catch (err) {
                // toast.error(getError(err));
              }
            }
            fetchProducts();
          }, [])
  
        // console.log(products);
        // console.log(console.log(product.subproducto))
  
        const { state, dispatch: ctxDispatch } = useContext(Store);
        const {cart, userInfo} = state;


    const [horarioReservas, setHorarioReservas] = useState('');
    const [horarioTango, setHorarioTango] = useState('');
    const [configuracion, setConfiguracion] = useState('');

    useEffect(() => {
      const fetchData1 = async () => {
        try {
          const { data } = await axios.get('/api/configuraciones', {
            // headers: { Authorization: `Bearer ${userInfo.token}` },
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

    /* Generación de variable "horaActual" */
    let date = new Date();
    let horaActual = (date.getHours()<10?'0':'') + date.getHours() + ':' + (date.getMinutes()<10?'0':'') + date.getMinutes();
    console.log('hora actual',horaActual);

    /*Para obtener mañana*/
    const hoy = new Date();
    const mañana = new Date(hoy);
    mañana.setDate(mañana.getDate() + 1)
    const mañanaFormat = mañana.toLocaleString('es-ES', {dateStyle: 'full'})

    /* Generacion día hoy */
    const today = new Date().toLocaleString('es-ES', {dateStyle: 'full'});
  
        
    const addToCartHandler = async (e) => {

        if(!userInfo) {
          navigate("/login")
        } else {
        e.preventDefault()

        ctxDispatch({ type: 'CART_CLEAR' });
        
        const existItem = cart.cartItems.find((x) => x._id === product._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const {data} = await axios.get(`/api/products/${product._id}`);
  
        if(data.countInStock < quantity) {
          window.alert('Disculpas, este servicio no esta actualmente disponible');
          return
        }

       const subservicio = localStorage.getItem('subproducto');


        if(!servselect || !subservicio) {
          window.alert('Para iniciar la reserva de este producto primero tenés que seleccionar un subproducto en "Seleccionar servicio"');
          document.getElementById('btn-iniciar').disabled = true;
        } else {
          if ((product.paymentMethodName === 'Tango' || product.paymentMethodName === 'Tango') && horaActual > horarioTango && userInfo) {
            window.alert(`Tené en cuenta que pasadas las ${horarioTango}hs. Ya no es posible, hacer reservas para hoy, ${today}. Sí, para todos demás días disponibles. `)
          } else {
            console.log('es mayor')
          }
        }

  
      ctxDispatch({
        type: 'CART_ADD_ITEM',
        payload: { ...product, quantity, servselect },
      });
  
      navigate('/shipping-first');
    }
    };

    const agregarServicioSeleccionado = async (e) => {
      // console.log('Holaaa Etro')
      localStorage.setItem('subproducto',(servselect));
      handleClose();

      

      // ctxDispatch({
      //   type: "SAVE_SHIPPING_ADDRESS",
      //   payload: {
      //     servselect,
      //   },
      // });
        // const existItem = cart.cartItems.find((x) => x._id === product._id);
        // const quantity = existItem ? existItem.quantity + 1 : 1;
        // const {data} = await axios.get(`/api/products/${product._id}`);

        // if(data.countInStock < quantity) {
        //   window.alert('Disculpas, no hay stock de este producto');
        //   return
        // }

        // ctxDispatch({
        //   type: 'CART_ADD_ITEM',
        //   payload: { ...product, quantity, servselect },
        // });
        // handleClose();
    }

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [servselect, setServselect] = useState('');
    // console.log(servselect)

    // const agus = JSON.parse(localStorage.getItem("cartItems"));

    const [mostraritinerario, setMostraritinerario] = useState(false);
    const [mostrarmenu, setMostrarmenu] = useState(false);

    // const selectsubproducto = (e) => {
    //   e.preventDefault();
    //   console.log(servselect)
    // }

    const [width, setWidth] = React.useState(window.innerWidth);
    const breakpoint = 500;
    const handleResizeWindow = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResizeWindow);
    


  return (
    loading? <LoadingBox/>
    : error? <MessageBox variant="danger">{error}</MessageBox>
    : 
    <motion.div initial={{scale: 0.998}}
    transition={{ duration: 1}}
    animate= {{scale: 1,zIndex: 1, // x:-5, y: -10
    duration: 1
    }} className="container top mt-5">
      
          <Row className="mt-5 grid-producto">

          {width < breakpoint ? (
              <>
              <Col md={5}>
                <div className="d-flex justify-content-between align-items-center contendor-titulo-producto">
                  <h1 className="titulo-producto">{product.name} {product.destacado && (<AiFillStar className="estrella-producto"/>)}</h1>
                  <h1 >{servselect ? (<p className="titulo-subproducto">({servselect})</p>) : (<p className="titulo-subproducto">Elegí un tipo de servicio</p>)}</h1>
                </div>
                <div className="contenedor-producto-body">
                  {/* <p className="texto-producto">{product.descriptionGral}</p> */}
                  <div className="texto-descripcion-gral" dangerouslySetInnerHTML={{__html: product.descriptionGral}}/>
                </div>

                <Col md={5}>
                  {/* <img className="img-large" src={selectedImage || product.image} alt={product.name}></img> */}
                  <Carousel>
                  {[product.image, ...product.images].map((x) => (
                  <Carousel.Item interval={6000}>
                      <img
                      className="d-block w-100 img-fluid imagen-carousel"
                      src={x}
                      alt="First slide"
                      />
                  </Carousel.Item>
                  ))}
                  </Carousel>

                  <ListGroup variant="flush">
                      <ListGroup.Item>
                        <Row className="description">
                        <ListGroup.Item><strong>Descripción breve:</strong> {product.description}</ListGroup.Item>
                        </Row>
                        {/* <hr></hr> */}
                      </ListGroup.Item>
                    </ListGroup>
                  </Col>                



                <div className="mt-4 contenedor-boton-descargar">
                  <CopyToClipboard text={`localhost:3000/product/${product.slug}`}>                   
                      <p className="copiar-enlace" onClick={()=> toast.success('Enlace Copiado',{position: 'bottom-center'})}><FiCopy className="icono-descargar"/>Copiar enlace</p>                       
                  </CopyToClipboard>
                  <Toaster/>
                  
                  <div>
                    {userInfo && userInfo.isAdmin && (
                      <Link className="fs-5 copiar-enlace" to={`/admin/product/${product._id}`} target="_blank"><MdEdit className="fs-1"/> Editar Producto</Link>
                    )}
                  </div>

                </div>

                

                
                <div className="mt-5 d-flex justify-content-center">
                  <button className="boton-disponibilidad" onClick={handleShow}>Seleccionar servicio</button>
                </div>
                
                <div className="mt-4">
                    <ListGroupItem>
                        <div className="d-grid">
                            <Button className="boton-iniciar-reserva" id="btn-iniciar-reserva" onClick={addToCartHandler} variant="primary">
                              Iniciar reserva
                            </Button>
                        </div>
                    </ListGroupItem>
                </div>

                  <Modal
                    show={show}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                  >
                      
                      <Modal.Header closeButton>
                        <Modal.Title className="titulo-producto-modal">{product.name}</Modal.Title>
                        {/* <h1 className="titulo-producto-modal">{product.subproducto.nombresubproducto}</h1> */}
                      </Modal.Header>

                      <Modal.Header>
                        <Modal.Title className="subtitulo-producto-modal">Elegí y confirmá el tipo de servicio para <strong>"{product.name}".</strong></Modal.Title>
                      </Modal.Header>

                
                      <Modal.Body className="p-4 d-flex flex-column">

                      <Form className="formulario-modal-subproductos">
                        
                      {product.subproducto.map((x, i) => (
                          <div key={i} className="contenedor-tarjeta-modal">

                                  <div className="d-flex align-items-center justify-content-between contenedor-titulo-modal-subproducto">

                                      <div className="">
                                        <h2 className="titulo-tarjeta-modal">{x.nombresubproducto}</h2>
                                      </div>
                                      <div className="mb-3 fs-3">
                                          <Form.Check
                                          type="radio"
                                          id="especifico"
                                          // label="Tour"
                                          value={x.nombresubproducto}
                                          checked={servselect === x.nombresubproducto}
                                          onChange={(e) => setServselect(e.target.value)}
                                        />
                                      </div>

                                  </div>
                                    
                                  <div className="descripcion-tarjeta-modal">
                                      <p>{x.descripcionsubproducto}</p>
                                  </div>
                                  <div className="descripcion-tarjeta-modal">
                                      <strong><p>{x.info1subproducto}</p></strong>
                                  </div>
                                  <div className="descripcion-tarjeta-modal">
                                      <p>{x.info2subproducto}</p>
                                  </div>
                                  <div className="descripcion-tarjeta-modal">
                                      <p>{x.info3subproducto}</p>
                                  </div>

                                  {/* <div className="contenedor-precio-modal"> <strong>{x.info1subproducto}</strong></div> */}
                                  {/* <div className="contenedor-total-modal"><p className="texto-total-modal"><strong>Total: {product.price} usd </strong><p className="texto-pequeño"> (sin impuestos ni cargos adicionales de reserva)</p></p></div> */}
                                  {/* <div className="contenedor-horario-modal"><p className="horario">19:00</p></div> */}
                          </div>
                        ))} 

                        </Form>
                    </Modal.Body>

                  
                
                    
                    <Modal.Footer>
                      <Button className="btn-modal-subproducto" variant="primary" onClick={agregarServicioSeleccionado}>
                        Confirmar selección
                      </Button>
                    </Modal.Footer>
                  </Modal>
                                
              </Col>
              </>
              ) : (
              <>

              <Col md={2} className="columna-img-selected-productos">
              <ListGroup variant="flush">

                <ListGroup.Item className="px-0">
                    <Row xs={1} md={1} className="g-2">
                      {[product.image, ...product.images].map((x) => (
                        <Col key={x}>
                          <div className="card-producto">
                            {/* <Button
                              className=""
                              // type="button"
                              variant="light"
                              onClick={() => setSelectedImage(x)}
                            > */}
                              <Card.Img className="img-producto" variant="top" src={x} alt="product" />
                            {/* </Button> */}
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </ListGroup.Item>
                {/* <ListGroup.Item><strong>Descripción:</strong> {product.description}</ListGroup.Item> */}

              </ListGroup>
            </Col>

            <Col md={5} className="titulo-y-descripcion">
            {/* <img className="img-large" src={selectedImage || product.image} alt={product.name}></img> */}
            <Carousel>
            {[product.image, ...product.images].map((x) => (
            <Carousel.Item interval={6000}>
                <img
                className="d-block w-100 img-fluid imagen-carousel"
                src={x}
                alt="First slide"
                />
            </Carousel.Item>
            ))}
            </Carousel>

            <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row className="description">
                  <ListGroup.Item><strong>Descripción breve:</strong> {product.description}</ListGroup.Item>
                  </Row>
                  {/* <hr></hr> */}
                </ListGroup.Item>
              </ListGroup>
            </Col>

            <Col md={5} className="titulo-y-descripcion">
              <div className="d-flex justify-content-between align-items-center contendor-titulo-producto">
                <h1 className="titulo-producto">{product.name} {product.destacado && (<AiFillStar className="estrella-producto"/>)}</h1>
                <h1 >{servselect ? (<p className="titulo-subproducto">({servselect})</p>) : (<p className="titulo-subproducto">Elegí un tipo de servicio</p>)}</h1>
              </div>
              <div className="contenedor-producto-body">
                {/* <p className="texto-producto">{product.descriptionGral}</p> */}
                <div className="texto-descripcion-gral" dangerouslySetInnerHTML={{__html: product.descriptionGral}}/>
              </div>

              <div className="mt-4 contenedor-boton-descargar">
                <CopyToClipboard text={`localhost:3000/product/${product.slug}`}>                   
                    <p className="copiar-enlace" onClick={()=> toast.success('Enlace Copiado',{position: 'bottom-center'})}><FiCopy className="icono-descargar"/>Copiar enlace</p>                       
                </CopyToClipboard>
                <Toaster/>
                
                <div>
                  {userInfo && userInfo.isAdmin && (
                    <Link className="fs-5 copiar-enlace" to={`/admin/product/${product._id}`} target="_blank"><MdEdit className="fs-1"/> Editar Producto</Link>
                  )}
                </div>

              </div>

              


             <div className="mt-5 d-flex justify-content-center">
                {userInfo ? (
                <button className="boton-disponibilidad" onClick={handleShow}>Seleccionar servicio</button>
                ) : (
                <button className="boton-disponibilidad" onClick={handleShow}>Ver Servicios</button>
                )}
              </div> 
              
              <div className="mt-4">
                  <ListGroupItem>
                      <div className="d-grid">
                          <Button className="boton-iniciar-reserva" id="btn-iniciar-reserva" onClick={addToCartHandler} variant="primary">
                            Iniciar reserva
                          </Button>
                      </div>
                  </ListGroupItem>
              </div>

                <Modal
                  show={show}
                  onHide={handleClose}
                  backdrop="static"
                  keyboard={false}
                >
                  
                    
                    <Modal.Header closeButton>
                      <Modal.Title className="titulo-producto-modal">{product.name}</Modal.Title>
                      {/* <h1 className="titulo-producto-modal">{product.subproducto.nombresubproducto}</h1> */}
                    </Modal.Header>

                    <Modal.Header>
                      <Modal.Title className="subtitulo-producto-modal">Elegí y confirmá el tipo de servicio para <strong>"{product.name}".</strong></Modal.Title>
                    </Modal.Header>

               
                    <Modal.Body className="p-4 d-flex flex-column">

                    <Form>
                    {product.subproducto.map((x, i) => (
                        <div key={i} className="contenedor-tarjeta-modal">

                                <div className="d-flex align-items-center justify-content-between contenedor-titulo-modal-subproducto">

                                    <div className="">
                                      <h2 className="titulo-tarjeta-modal">{x.nombresubproducto}</h2>
                                    </div>
                                    <div className="mb-3 fs-3">
                                        <Form.Check
                                        type="radio"
                                        id="especifico"
                                        // label="Tour"
                                        value={x.nombresubproducto}
                                        checked={servselect === x.nombresubproducto}
                                        onChange={(e) => setServselect(e.target.value)}
                                      />
                                    </div>

                                </div>
                                  
                                <div className="descripcion-tarjeta-modal">
                                    <p>{x.descripcionsubproducto}</p>
                                </div>
                                <div className="descripcion-tarjeta-modal">
                                    <strong><p>{x.info1subproducto}</p></strong>
                                </div>
                                <div className="descripcion-tarjeta-modal">
                                    <p>{x.info2subproducto}</p>
                                </div>
                                <div className="descripcion-tarjeta-modal">
                                    <p>{x.info3subproducto}</p>
                                </div>

                                {/* <div className="contenedor-precio-modal"> <strong>{x.info1subproducto}</strong></div> */}
                                {/* <div className="contenedor-total-modal"><p className="texto-total-modal"><strong>Total: {product.price} usd </strong><p className="texto-pequeño"> (sin impuestos ni cargos adicionales de reserva)</p></p></div> */}
                                {/* <div className="contenedor-horario-modal"><p className="horario">19:00</p></div> */}
                        </div>
                      ))} 

                      </Form>
                  </Modal.Body>

                
              
                  
                  <Modal.Footer>
                    <Button className="btn-modal-subproducto" variant="primary" onClick={agregarServicioSeleccionado}>
                      Confirmar selección
                    </Button>
                  </Modal.Footer>
                </Modal>
                              
            </Col>
                </>
              )}

            

          </Row>
          
          <Row className="">
              <Col md={2}>
              </Col>

            
              <Col md={10}>

                <div className="contenedor-datos-complementarios-productos justify-content-around ">

                    <div className="contenedor-datos-complementarios text-center">                         
                        <strong className="titulo-complementario-reserva">Reservar ahora y pagar después</strong>
                        <p className="subtitulo-complementario-reserva">Reserve plaza manteniendo la flexibilidad</p>                       
                    </div>

                    <div className="contenedor-datos-complementarios text-center">
                        <strong className="titulo-complementario-reserva">Cancelación gratuita</strong>
                        <p className="subtitulo-complementario-reserva">Hasta 24 horas antes. Más información</p>
                    </div>

                    <div className="contenedor-datos-complementarios text-center">
                        <strong className="titulo-complementario-reserva">Cancelación gratuita</strong>
                        <p className="subtitulo-complementario-reserva">Hasta 24 horas antes. Más información</p>
                    </div>
                  
                </div>

              </Col>
          </Row>
        
        <hr className="separador-productos"></hr>
      
      <Row>
      <Col md={12}>
        <div>
            <h1 className="titulos-responsive mb-4">Descripción Secundaria</h1>
            {/* <p className="texto-descripcion">{product.descriptionGral}</p> */}
            <div className="texto-descipcion-secundaria" dangerouslySetInnerHTML={{__html: product.descriptionSecundaria}}/>
        </div>
        <hr className="separador-productos-interno"></hr>

       
        {/* <div className="grid px-2"> */}
        <div className="grid">
        <div>
            <h1 className="titulos-responsive mb-4">Itinerario <strong onClick={()=> setMostraritinerario(!mostraritinerario)}> {mostraritinerario === true ? <FcCollapse/> : <BsChevronDown/>}</strong></h1>
            {mostraritinerario && <div dangerouslySetInnerHTML={{__html: product.tangos.itinerario}}/>}
            
        </div>
        <div>
        <h1 className="titulos-responsive mb-4">Menú <strong onClick={()=> setMostrarmenu(!mostrarmenu)}> {mostrarmenu === true ? <FcCollapse/> : <BsChevronDown/>}</strong></h1>
            {mostrarmenu && <div dangerouslySetInnerHTML={{__html: product.tangos.menu}}/>}
        </div>
        </div>
       
            
        {/* </div> */}
        <hr className="separador-productos-interno"></hr>
        
        <div className="contenedor-informacion-adicional">
            <h1 className="titulos-responsive mb-4">Información Adicional</h1>
            <div className="info-adicional" dangerouslySetInnerHTML={{__html: product.infoAdicional}}/>
        </div>

        <hr className="separador-productos-interno"></hr>

        <div className="contenedor-cancelacion-producto">

          <h1 className="titulos-responsive">Política de Cancelación</h1>
          <p className="mb-4 fs-4 fw-bold">Para recibir el reembolso íntegro de la experiencia debes cancelarla como mínimo 24 horas antes de que empiece.</p>
        <div>

          <div className="grid px-3">
              <div>
                  <ul>
                      <li>Para recibir el reembolso íntegro de la experiencia debes cancelarla al menos 24 horas antes de que empiece.</li>
                      <li>Si cancelas la experiencia menos de 24 horas antes de que empiece, no se te devolverá el importe abonado.</li>
                      <li>No se aceptará ningún cambio que se realice cuando falten menos de 24 horas para empezar la experiencia.</li>
                  </ul>
              </div>
              <div>
                  <ul>
                      <li>La hora límite se basa en la hora local del lugar donde se realiza la experiencia.</li>
                      <li>Tiene que hacer buen tiempo para que se pueda realizar esta experiencia. Si se cancela por malas condiciones meteorológicas, se le ofrecerá otra fecha o el reembolso total del importe abonado.</li>
                  </ul>
              </div>
          </div>
        </div>
        </div>


      </Col>
      </Row>

      <SliderProductosTango/>
      
    
      <Row className="separacion-listados">
      {/* <h1 className="py-3 titulo-principal-listados">¡Más Productos!</h1> */}
      <div className="contenedor-listados">

      <Col className="mt-5" md={5}>
          <ListGroup variant="flush">
            <h2 className="titulos-responsive titulos-galeria mb-5">Tours</h2>
            {prodfiltrado.map((product)=>(

              

            <ListGroup.Item key={product._id} className="p-0 mt-3 contenedor-categorias">              
                <Link className="link-categorias-related mb-3 fs-2" to={`/product/${product.slug}`}>{product.name}
                  <p className="subtitulo-categorias-related"><strong>{product.brand}</strong></p>
                </Link>

                <Link className="link-categorias-related mb-3" to={`/product/${product.slug}`}>
                  <Card.Img className="img-producto-related img-thumbnail" variant="top" src={product.image} alt="product" />
                </Link>
            </ListGroup.Item>
            ))}
            </ListGroup>
            <hr className="separador-productos separador-tours-relacionados"></hr>
      </Col>
      {/* <Col md={1}>
      </Col> */}
      <Col className="mt-5" md={5}>
          <ListGroup variant="flush">
            <h2 className="titulos-responsiv titulos-galeria mb-5">Paquetes</h2>
            {prodfiltrado2.map((product)=>(

              

            <ListGroup.Item key={product._id} className="p-0 mt-3 contenedor-categorias">              
                <Link className="link-categorias-related mb-3 fs-2" to={`/product/${product.slug}`}>{product.name}
                  <p className="subtitulo-categorias-related"><strong>{product.brand}</strong></p>
                </Link>

                <Link className="link-categorias-related mb-3" to={`/product/${product.slug}`}>
                  <Card.Img className="img-producto-related img-thumbnail" variant="top" src={product.image} alt="product" />
                </Link>
            </ListGroup.Item>
            ))}
            </ListGroup>
            <hr className="separador-productos separador-tours-relacionados"></hr>
      </Col>
      


      </div>
    
    </Row>
      


       
    </motion.div>
  )
}

export default Tango