import React, {useState, useEffect, useRef, useContext, useReducer} from 'react';
import Slider from "react-slick";
import './SliderProductosTangoStyles.css';

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import axios from 'axios';

import {BsHeart, BsHeartFill} from 'react-icons/bs';
import {AiFillStar} from 'react-icons/ai';

import Card from 'react-bootstrap/Card';

import { Link } from "react-router-dom";

// import {AiOutlineClockCircle} from 'react-icons/ai';
// import { BiBed } from "react-icons/bi";
// import {GrPrevious, GrNext} from "react-icons/gr";
import Button from 'react-bootstrap/Button';
import { Store } from '../../Store';

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





const SliderProductosTango = () => {

    const { state } = useContext(Store);
    const { userInfo } = state;
    const [dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    });

    // const [proddestacado, setProddestacado] = useState([]);
    const [prodfiltrado, setProdFiltrado] = useState([]);

    // useEffect(() => {
    //     const fetchProducts = async () => {
    //       try {
    //         const { data } = await axios.get(`/api/products/destacados`);
    //         console.log(data)
    //         // setProducts([data.tango, data.tour, data.paquete, data.varios]);
    //         setProdFiltrado(data)
    //       } catch (err) {
    //         // toast.error(getError(err));
    //       }
    //     }
    //     fetchProducts();
    //   }, [])

      useEffect(() => {
        const fetchProducts = async () => {
          try {
            const { data } = await axios.get(`/api/products/tipo`);
            // console.log(data)
            // setProducts([data.tango, data.tour, data.paquete, data.varios]);
            setProdFiltrado(data.tango)
          } catch (err) {
            // toast.error(getError(err));
          }
        }
        fetchProducts();
      }, [])

        const customeSlider = useRef();

        const [sliderSettings, setSliderSettings] = useState ({
            dots: true,
          buttons: true,
          infinite: true,
          speed: 600,
          slidesToShow: 3,
          slidesToScroll: 1,
          centerPadding: '60px',
        //   autoplay: true,
        //   autoplaySpeed: 2000,
          responsive: [
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
                infinite: true,
                dots: true
              }
            },
            {
              breakpoint: 600,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
                initialSlide: 2
              }
            },
            {
              breakpoint: 480,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1
              }
            }
          ]

        })
          
        console.log(setSliderSettings);

        const [switchToggled, setSwitchToggled] = useState(null);
        
        const agregarFavorito = () => {
            console.log('Hola')
        }
        const addToCartHandler = () => {
            setSwitchToggled(true);
            console.log('Boton Card')
        }

        // const gotoPrev = () => {
        //   customeSlider.current.slickPrev()
        // }
        // const gotoNext = () => {
        //   customeSlider.current.slickNext()
        // }

        

  return (
    <div className="container contenedor-slider mt-2">

    <div className="titulo-slider" id="productos">
        <h1 className="py-3 my-4 titulo-principal1">¡Otras casas de tango!</h1>
        <p className="enlace-ver-todos"></p>
    </div>
        
        <Slider {...sliderSettings} ref={customeSlider} className="slider-contenedor">
        {/* <div className="d-none" onClick={()=>gotoPrev()}><GrPrevious className='boton-slider-prev d-none'/></div>
        <div className="d-none" onClick={()=>gotoNext()}><GrNext className='boton-slider-next d-none'/></div> */}
            {prodfiltrado.map((product)=>(
            <Card className="card-all-slider">

          {userInfo && (
            <>
            {/* {product.destacado && (<p className="banner-destacado-slider">PRODUCTO DESTACADO</p>)} */}
            {product.destacado && (<p className="estrella-destacado-slider"><AiFillStar/></p>)}

            <Button className="boton-destacado-slider" onClick={()=>agregarFavorito(product._id)}>
            {/* <Button className="boton-destacado" onClick={cargarfav}> */}
              <p className="icono-favoritos-slider">{switchToggled ? (<BsHeartFill/>) : (<BsHeart/>)}</p>
            </Button>
            </>
          )}
            
            
      
      
            <Link to={`/product/${product.slug}`}>
            <img src={product.image} className="img-fluid imagen-todos-productos-slider" alt={product.name}/>
            </Link>
       
      
            <Card.Body>
      
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <Link to={`/product/${product.slug}`}>
                            <Card.Title className="fs-4">{product.name}</Card.Title>
                          </Link>
                        </div>
                        {/* <div>
                          <Card.Text className="fs-2 fw-bold">${product.price}</Card.Text>
                        </div> */}
                    </div>
      
                    {/* <div className="my-4">
                      <Card.Text className="texto-card-producto">{product.description}</Card.Text>
                    </div> */}
                    {/* <div className="grid">
                        <div className="d-flex contenedor-icono-producto">
                          <AiOutlineClockCircle className="icono-producto"/> <p className="ms-2">{product.duracion}</p>
                        </div>
                        <div className="d-flex contenedor-icono-producto">
                          <BiBed className="icono-producto"/> <p className="ms-2">{product.hospedaje}</p>
                        </div>
                    </div> */}
      
      
      
                    {/* <div className="grid">
                      <div>
                        <div className="d-flex contenedor-icono-producto">
                          <AiOutlineClockCircle className="icono-producto"/> <p className="ms-2">{product.duracion}</p>
                        </div>
                        <div className="d-flex contenedor-icono-producto">
                          <BiBed className="icono-producto"/> <p className="ms-2">{product.hospedaje}</p>
                        </div>
                      </div>
                      <div>
      
                      </div>
                     
                    </div> */}
      
                {/* <Rating rating={product.rating} numReviews={product.numReviews}></Rating> */}
      
                    <div className="contenedor-texto-card-all">
                        {/* <Card.Text className="fs-2 fw-bold">${product.price}</Card.Text> */}
                        {product.countInStock === 0? <Button variant='light' disabled>Este servicio no esta actualmente disponible</Button>
                        : 
                        <Button className="boton-card-all btn btn-primary w-100" onClick={()=> addToCartHandler(product)}>Reservar</Button>
                        }
                    </div>  
            </Card.Body>
            {/* <hr></hr> */}
            
          </Card>
        ))}

        </Slider>
        
       

      </div>
  )
}


export default SliderProductosTango