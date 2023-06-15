import { Link, useNavigate } from "react-router-dom";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
// import Rating from './Rating';
import axios from 'axios';
import { useContext, useState, useEffect, useReducer} from "react";
import { Store } from '../Store.js';
// import {FiStar} from 'react-icons/fi'
import {BsHeart, BsHeartFill} from 'react-icons/bs';
import {BiBus} from 'react-icons/bi';
import { getError } from "../utils";
import { toast } from "react-toastify";
// import { BiBusSchool} from 'react-icons/bi';
// import { FaPlaneDeparture } from 'react-icons/fa';
// import { BiBed } from 'react-icons/bi';
// import { MdFoodBank } from 'react-icons/md';

import {AiOutlineCar, AiOutlineClockCircle, AiOutlineClose} from 'react-icons/ai';
import {MdLocalOffer, MdOutlineLocalOffer} from 'react-icons/md';
// import { MdFoodBank, MdOutlineLocalHospital } from "react-icons/md";
// import { GoComment } from "react-icons/go";
import { AiFillStar } from "react-icons/ai";
import { AiOutlineCalendar } from "react-icons/ai";
// import { FaPlaneDeparture } from "react-icons/fa";
import { BiBuildingHouse } from "react-icons/bi";
import { HiOutlineTicket } from "react-icons/hi";
// import { MdOutlineFoodBank } from "react-icons/md";
// import { BiBed } from "react-icons/bi";
// import { BsCheck2 } from "react-icons/bs";
// import {BsUpload} from 'react-icons/bs'


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

  const navigate = useNavigate();

  const [{ loading, error, loadingUpdate, loadingUpload  }, dispatch] = useReducer(reducer,  {
    product: [],
    loading: true, 
    error: '',
  })

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
      cart: { cartItems },  userInfo ,
      } = state;

  const [switchToggled, setSwitchToggled] = useState(null);

  const [usuario, setUsuario] = useState({})
  const [listadousuario, setListadousuario] = useState(true)

  
  useEffect(() => {
    if(userInfo) {
      const fetchUser = async () => {
        console.log('fetchuser') 
        try {
          const { data } = await axios.get(`/api/users/${userInfo._id}`, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          });
          // console.log(data)
          // setProducts([data.tango, data.tour, data.paquete, data.varios]);
          setUsuario(data)
          
          // pintarData()
          setListadousuario(true)
          // if(listadousuario) {
          //   pintarData();
          // }
          // console.log(listadousuario)
          
        } catch (err) {
          toast.error(getError(err));
        }
        // console.log(usuario)
      }
      fetchUser();
    }
  }, [userInfo] )

  // console.log(usuario)
  
  // if(usuario) {
  //   console.log('listadousuario')
  //     const soyfavorito = usuario.favoritos.find(x => x._id === product._id )
  //     console.log(soyfavorito)
  //     if (soyfavorito) {
  //       setSwitchToggled(true);
  //       console.log('Esta entrando')
  //     } else {
  //       setSwitchToggled(false);
  //       console.log('No Esta entrando')
  //     }
  // } else {
  //   console.log('Hola')
  // }

    const pintarData = () => {
      // console.log('pintardata', usuario)
       let storage = JSON.parse( localStorage.getItem( 'userInfo' ) );
      
        // console.log('listadousuario')
        const soyfavorito = storage.favoritos.find(x => x._id === product._id )
        // console.log(soyfavorito)
        if (soyfavorito) {
          setSwitchToggled(true);
          // console.log('Esta entrando')
        } else {
          setSwitchToggled(false);
          // console.log('No Esta entrando')
        }
        setListadousuario(false);
  }
  
  if(listadousuario && userInfo) {
    pintarData();
    setListadousuario(false);
  }


// if(usuario && userInfo) {
//   pintarData();
// }

//   useEffect(() => {
//     if(userInfo) {
//       // fetchUser();
//       pintarData(); //Invoked inside useEffect
//       // setListadousuario(true)
//     } else {
//       setSwitchToggled(false);
      
//     }
    
// }, [])


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

    /* Generación de variable "horaActual" */
    let date = new Date();
    let horaActual = (date.getHours()<10?'0':'') + date.getHours() + ':' + (date.getMinutes()<10?'0':'') + date.getMinutes();
    console.log('hora actual',horaActual);

    /*Para obtener mañana*/
    const hoy = new Date();
    const mañana = new Date(hoy);
    mañana.setDate(mañana.getDate() + 1)
    const mañanaFormat = mañana.toLocaleString('es-ES', {dateStyle: 'full'})

  
  const alertaSeleccionTango = (e) => {
        if(product.paymentMethodName === 'Tango' && userInfo) {
        window.alert('Para reservar un servicio de tipo "TANGO", vas a tener que seleccionar primero un "Tipo de servicio".');
        return
        }
  }

    const addToCartHandler = async (item, e) => {
      alertaSeleccionTango();

      ctxDispatch({ type: 'CART_CLEAR' });
  
        const existItem = cartItems.find((x) => x._id === product._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const {data} = await axios.get(`/api/products/${item._id}`);

        if(!userInfo) {
          return navigate("/login", { replace: true })
        }

        if(data.countInStock < quantity) {
            window.alert('Disculpas, este servicio no esta actualmente disponible');
            return
          }

        if ((product.paymentMethodName === 'Tour' || product.paymentMethodName === 'Paquete') && (horaActual > horarioReservas) && userInfo) {
          window.alert(`Tené en cuenta que pasadasss las ${horarioReservas}hs. Ya no es posible, tomar reservas para mañana ${mañanaFormat}. `)
          console.log(horaActual, horarioReservas);
        } else {
          console.log('es mayor')
        }

    
        ctxDispatch({
          type: 'CART_ADD_ITEM',
          payload: { ...item, quantity },
        });
        
        if(product.paymentMethodName === 'Tango') {
          return navigate(`product/${product.slug}`, { replace: true })
        } else {
          return navigate("shipping-first/", { replace: true })
        }

    }
    
    const agregarFavorito = async (favorito) => {
      try {
        const { data } = await axios.put(
          '/api/users/favoritos',
          {
            product
          },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
          console.log(data.favoritos)
          console.log(data.producto)

          // let storage = JSON.parse( localStorage.getItem( 'userInfo' ) );
          
          switchToggled ? setSwitchToggled(false) : setSwitchToggled(true);

          const existItem = usuario.favoritos.find((x) => x._id === product._id);
          if(existItem) {
            console.log('ya estaba en el storage, se elimino');
            setSwitchToggled(false);
            let agus = usuario.favoritos.findIndex(favoritos => favoritos.favorito === favorito)
            if(agus === -1) {
              usuario.favoritos.splice(agus, 1)
              localStorage.setItem('userInfo', usuario );
            }
            console.log(agus);
            console.log(usuario.favoritos)


            toast.error('Producto removido de favoritos');
          } else {
            console.log('no estaba en el storage, se agregó');
            setSwitchToggled(true);
            usuario.favoritos = [ ...usuario.favoritos, product ];
            
            toast.success('Producto agregado a Favorito');
          }

          
        localStorage.setItem('userInfo', JSON.stringify(usuario))
      } 
      catch (err) {
        toast.error(getError(err));
      }
    
        };

    
    return (
      <Card className="card-all card-productos-expansion">


      

      {userInfo && (  
        <>
          {/* {listadousuario && ((pintarData()))} */}
         {/* {product.destacado && (<p className="banner-destacado"><AiFillStar/></p>)} */}
         {product.destacado && (<p className="texto-destacado">PRODUCTO DESTACADO<AiFillStar className="estrella"/></p>)}
         {product.oferta && (<p className="texto-oferta"><MdOutlineLocalOffer className="oferta-icono"/><p className="texto-descuento">%10</p></p>)}
         
          <Button className="boton-destacado" onClick={()=>agregarFavorito(product._id)}>
          {/* <Button className="boton-destacado" onClick={cargarfav}> */}
            <p className="icono-favoritos">{switchToggled ? (<BsHeartFill/>) : (<BsHeart/>)}</p>
          </Button>
        </>
      )}
      
      <div className="image">
      
      <div className="contenedor-card-underline-hover">
          <Link to={`/product/${product.slug}`}>

            <img src={product.image} className="img-fluid imagen-todos-productos" alt={product.name}/>

            <div class="image__overlay image__overlay--primary">
              <div class="image__title">{product.name}
              <p></p>
              </div>
              {/* <p class="image__description">{product.description}</p> */}

              <div className="contenedor-logos-overlay">
                  <div className="contenedo-interno-logo-overlay">
                    <AiOutlineClockCircle className="logo-reloj-overlay"/>
                    <p className="duracion-servicio-overlay"> {product.duracion}</p>
                  </div>
                  <div className="contenedor-logos-overlay">
                    {product.paymentMethodName === 'Tour' && (<>
                      <AiOutlineCalendar className="logo-reloj-overlay"/>
                      <p className="duracion-servicio-overlay">{product.seguro}</p>
                    </>)}

                    {product.paymentMethodName === 'Tango' && (<>
                      <AiOutlineCalendar className="logo-reloj-overlay"/>
                      <p className="duracion-servicio-overlay">{product.seguro}</p>
                    </>)}

                    {product.paymentMethodName === 'Paquete' && (<>
                      <HiOutlineTicket className="logo-reloj-overlay"/>
                      <p className="duracion-servicio-overlay">{product.seguro}</p>
                    </>)}
                    
                  </div>

                  <div className="contenedor-logos-overlay">
                      <BiBus className="logo-reloj-overlay"/>
                      <p className="duracion-servicio-overlay">{product.traslados}</p>
                    </div>
               


              </div>

            </div>

            <div className="contenedor-interno-card">
                    <div>
                      <Link to={`/product/${product.slug}`}>
                        <Card.Title className="titulo-card-producto">{product.name}</Card.Title>
                      </Link>
                    </div>
            </div>

            

                
          </Link>
      </div>


      
            <div className="contenedor-texto-card-home">
              <Card.Text className="texto-card-producto">{product.description}</Card.Text>
            </div>

      

              {/* <div className="contenedor-general-logos">
                {product.paymentMethodName === 'Tour' && (
                  <>
                  <div className="contenedor-interno-logos-2">
                    <AiOutlineCalendar className="logo-card-home1"/>
                    <p className="texto-card-home">{product.seguro}</p>
                  </div>

                  <div className="contenedor-logos-card-home">
                    <div className="contenedor-interno-logos">
                      <AiOutlineClockCircle className="logo-card-home1"/>
                      <p className="texto-card-home">{product.duracion}</p>
                    </div>
                    <div className="contenedor-interno-logos">
                      <BiBus className="logo-card-home"/>
                      <p className="texto-card-home">{product.traslados}</p>
                    </div>
                  </div>
                  </>
                )}   
              </div> */}

      
              
              {/* <div className="contenedor-general-logos">
                {product.paymentMethodName === 'Paquete' && (
                  <>
                  <div className="contenedor-logos-card-home">
                    <div className="contenedor-interno-logos-2">
                      <HiOutlineTicket className="logo-card-home1"/>
                      <p className="texto-card-home">{product.seguro}</p>
                    </div>
                    <div className="contenedor-interno-logos-2">
                      <BiBuildingHouse className="logo-card-home1"/>
                      <p className="texto-card-home">{product.hospedaje}</p>
                    </div>
                  </div>

                  <div className="contenedor-logos-card-home">
                    <div className="contenedor-interno-logos">
                      <AiOutlineClockCircle className="logo-card-home1"/>
                      <p className="texto-card-home">{product.duracion}</p>
                    </div>
                    <div className="contenedor-interno-logos">
                      <BiBus className="logo-card-home"/>
                      <p className="texto-card-home">{product.traslados}</p>
                    </div>
                  </div>
                  </>
                )}   
              </div> */}

              {/* <div className="contenedor-general-logos">
                {product.paymentMethodName === 'Tango' && (
                  <>
                  <div className="contenedor-interno-logos-2">
                    <AiOutlineCalendar className="logo-card-home1"/>
                    <p className="texto-card-home">{product.seguro}</p>
                  </div>

                  <div className="contenedor-logos-card-home">
                    <div className="contenedor-interno-logos">
                      <AiOutlineClockCircle className="logo-card-home1"/>
                      <p className="texto-card-home">{product.duracion}</p>
                    </div>
                    <div className="contenedor-interno-logos">
                      <BiBus className="logo-card-home"/>
                      <p className="texto-card-home">{product.traslados}</p>
                    </div>
                  </div>
                  </>
                )}   
              </div> */}
        


        </div> 


          <div className="contenedor-texto-card-all">
              {/* <Card.Text className="fs-2 fw-bold">${product.price}</Card.Text> */}
              {product.countInStock === 0 ? 
              (
              <div className="contenedor-texto-sin-stock">
                <Button className="sin-stock" disabled>Este servicio no se encuentra actualmente disponible</Button>
              </div>
              )
              : 
              // <Link to={`/product/${product.slug}`} className="boton-card-all btn btn-primary" onClick={()=> addToCartHandler(product)}>Reservar</Link>
              <Button className="boton-card-all btn btn-primary" onClick={()=> addToCartHandler(product)}>Reservar</Button>
              }
          </div> 
      {/* <hr></hr> */}
      
    </Card>
    )
}

export default Product;