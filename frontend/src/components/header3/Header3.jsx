import React, {useState, useContext, useEffect, useReducer} from 'react';
import { useParams } from "react-router-dom";
import './Header3Styles.css';
import {Link} from 'react-router-dom';
import logok from '../../assets/logos/logo-ethereal.jpeg';
import logohorizontal from '../../assets/logos/logo-horizontal.png';
import {LinkContainer} from 'react-router-bootstrap';
import { Store } from '../../Store';
import { toast } from 'react-toastify';
import Badge from 'react-bootstrap/Badge';
import NavDropdown from 'react-bootstrap/NavDropdown';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import SearchBox from '../SearchBox';
import SearchBox1 from '../SearchBox1';
import LoadingBox from '../../components/LoadingBox';

import logo from '../../assets/logos/logo-simple.png';

import Spinner from 'react-bootstrap/Spinner';

// import {FaTimes} from 'react-icons/fa';
// import {BiUserCircle} from 'react-icons/bi';
// import {HiOutlineUserCircle} from 'react-icons/hi';

import {AiOutlineMenu, AiOutlineUser, AiFillHome} from 'react-icons/ai';
import {BsBell} from 'react-icons/bs';
import {BsHeart} from 'react-icons/bs';

import {AiOutlineHome} from 'react-icons/ai';
import {AiOutlineShopping} from 'react-icons/ai';
import {RiBillLine} from 'react-icons/ri';
import {BsHeadset} from 'react-icons/bs';
import {AiOutlineCloudDownload} from 'react-icons/ai';
import {BsSearch} from 'react-icons/bs';
import {RiProductHuntLine} from 'react-icons/ri';
import {HiUsers} from 'react-icons/hi';
import {BsBellFill} from 'react-icons/bs';
import {BsClipboardData} from 'react-icons/bs';

import { motion } from "framer-motion";

// import {logo} from '../../assets/logos/logo-ethereal.png';
import { getError } from '../../utils';
import DropdownItem from 'react-bootstrap/esm/DropdownItem';

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

const Header2 = (props) => {

    const params = useParams()
    const {slug} = params;
    const { state } = useContext(Store);
    const { userInfo } = state;
    const [{ loading, error, loadingDelete, successDelete }, dispatch] = useReducer(reducer, {
      loading: true,
      error: '',
    });

     const signoutHandler = () => {

        toast.success('Cerraste tú sesión correctamente');
        // navigate("/home", { replace: true });

    dispatch({ type: 'USER_SIGNOUT'});
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');

        // window.location.href = '/home';
    
    setTimeout(() => {
        window.location.href = '/';
        // console.log('pasoooooooooooooooo')
    }, 1500);
  }

    const [favoritos, setFavoritos] = useState([]);

    const [navbar, setNavbar] = useState(false)
    const [navbutton, setNavbutton] = useState(false)
    const [color, setColor] = useState(false)

    const [hamburguer, setHamburguer] = useState(false)

    const [nav, setNav] = useState(false)
    const handleNav = () => setNav(!nav)

    const [cargando, setCargando] = useState(false)

    const [products, setProducts] = useState([]);
    // console.log(products)

    const changeBackground = () => {
        if (window.scrollY >= 65) {
            setNavbar(true)
            setNavbutton(true)
            setColor(true) 
            // setLogo(true) 
            setHamburguer(true)     
        } else {
            setNavbar(false)
            setNavbutton(false)
            setColor(false)
            // setLogo(false) 
            setHamburguer(false)
        }
    }

    window.addEventListener('scroll', changeBackground); 

    const [notificaciones, setNotificaciones] = useState([]);
    
    useEffect(() => {
        const fetchProducts = async () => {
          try {
            const { data } = await axios.get(`/api/products/destacados`);
            // console.log(data)
            // setProducts([data.tango, data.tour, data.paquete, data.varios]);
            setFavoritos(data)
          } catch (err) {
            toast.error(getError(err));
          }
        }
        fetchProducts();
      }, [])

      useEffect(() => {
        const fetchData = async () => {
          try {
            dispatch({ type: 'FETCH_REQUEST' });
            const { data } = await axios.get(`/api/notificaciones`, {
              headers: { Authorization: `Bearer ${userInfo.token}` },
            });
            setNotificaciones(data)
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

      

    //   useEffect(() => {
    //    const fetchProducts = async () => {
    //      try {
    //        const { data } = await axios.get(`/api/users/${userInfo._id}`, {
    //          headers: { Authorization: `Bearer ${userInfo.token}` },
    //        });
    //        // console.log(data)
    //        // setProducts([data.tango, data.tour, data.paquete, data.varios]);
    //        setUser(data)
    //        console.log(data)
    //      } catch (err) {
    //        toast.error(getError(err));
    //      }
    //    }
    //    fetchProducts();
    //  }, [userInfo])

    //  console.log(user)




  const deleteHandler = async (notificacion, e) => {
    
    if (window.confirm('¿Seguro que quieres eliminar ésta notificación?')) {
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await axios.delete(`/api/notificaciones/${notificacion._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success('Notificacion eliminada exitosamente');
        dispatch({ type: 'DELETE_SUCCESS' });
        
      } catch (err) {
        toast.error(getError(err));
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
    }
  };

  const notificacionesFiltradas = [...notificaciones].sort((a,b) => {
    return a._id < b._id ? 1 : -1
  })
  // console.log(notificacionesFiltradas);


  const [width, setWidth] = React.useState(window.innerWidth);
  // const breakpoint = 1100;
  const breakpoint = 700;
  const handleResizeWindow = () => setWidth(window.innerWidth);
  window.addEventListener("resize", handleResizeWindow);

  const cerrarSidenav = () => {
    document.getElementById('offcanvasExample').classList.toggle('show');
    document.querySelector('offcanvas-backdrop').style.opacity = '0';
    // document.getElementById('offcanvasExample').classList.toggle('offcanvas-backdrop');
  } 

  const [user, setUser] = useState({})
  const [listadofavoritos, setListadofavoritos] = useState(false)



  if(!user) {
    const favoritosFiltrados = [...user.favoritos].sort((a,b) => {
      return a._id < b._id ? 1 : -1
    })
    // console.log(favoritosFiltrados);
  } else {
    // console.log('hola')
  }

  const llamarUser = async () => {
        setCargando(true)

        setTimeout(() => {  
          setCargando(false)
        }, 400);

    try {
      const { data } = await axios.get(`/api/users/${userInfo._id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      console.log(data)
      // setProducts([data.tango, data.tour, data.paquete, data.varios]);
      setUser(data)
      setListadofavoritos(true)
      // console.log(user)
    } catch (err) {
      toast.error(getError(err));
    }
  }

  const llamarNotificacion = async () => {
        setCargando(true)

        setTimeout(() => {  
          setCargando(false)
        }, 400);

          try {
            dispatch({ type: 'FETCH_REQUEST' });
            const { data } = await axios.get(`/api/notificaciones`, {
              headers: { Authorization: `Bearer ${userInfo.token}` },
            });
            setNotificaciones(data)
            dispatch({ type: 'FETCH_SUCCESS', payload: data });
          } catch (err) {
            dispatch({
              type: 'FETCH_FAIL',
              payload: getError(err),
            });
          }
  }
   

  return (
    <div>
      {/* {userInfo && (llamarUser())} */}
        <motion.div initial={{scale: 0.99}}
            transition={{ duration: 1}}
            animate= {{scale: 1,zIndex: 1, // x:-5, y: -10
            duration: 4
            }} className="contenedor-interno">
          
            <div className="primer-bloque-header">
              {/* <div className="d-flex"> */}
                <Link className="d-flex align-items-center contenedor-logo-header" to={'/'}>
                    <img className='logo-ethereal-horizontal-header' src={logohorizontal} alt="logo-ethereal"/>
                    <h1 className="logo-agencias"> - Agencias</h1>
                </Link>

                {/* <div className='contenedor-inicio'>
                        <Link to="/home" className={ color ? 'boton-reserva active' : 'boton-reserva'}>INICIO</Link>
                </div> */}
                <SearchBox/>
              {/* </div> */}
                
            </div>


            <div className='segundo-bloque-header'>
            

                  {width > breakpoint ? (
                    <div className="contenedor-interno">
                    <div className="contenedor-dropdown">
                          {userInfo ?  (
                                  <>
                                  <div className="contenedor-logos-dropdown">
                                      <AiOutlineUser className={ color ? 'logo-user-dropdown-active' : 'logo-user-dropdown'}/>
                                      <NavDropdown title={userInfo.name} id="basic-nav-dropdown" className={ color ? 'nav-link active' : 'nav-link'}>
                                          
                                          <div className="dropdown-usuario">

                                              <LinkContainer className="contenedor-dropdown-usuario" to="/historial-de-reservas">
                                                  <NavDropdown.Item>Mis Reservas</NavDropdown.Item>
                                              </LinkContainer>

                                              <LinkContainer className="contenedor-dropdown-usuario" to="/cotizaciones">
                                                  <NavDropdown.Item>Cotizaciones</NavDropdown.Item>
                                              </LinkContainer>

                                              {/* <LinkContainer className="contenedor-dropdown-usuario" to="/">
                                                  <NavDropdown title="Tus Ventas">
                                                      <NavDropdown.Item>Estadísticas</NavDropdown.Item>
                                                      <NavDropdown.Item>Premiaciones</NavDropdown.Item>
                                                  </NavDropdown>
                                              </LinkContainer> */}

                                              <LinkContainer className="contenedor-dropdown-usuario" to="/documentos-descargables">
                                                  <NavDropdown.Item>Tarfiarios y documentos</NavDropdown.Item>
                                              </LinkContainer>

                                              <LinkContainer className="contenedor-dropdown-usuario" to="/notificaciones">
                                                  <NavDropdown.Item>Cartelera de notificaciones</NavDropdown.Item>
                                              </LinkContainer>

                                              <LinkContainer className="contenedor-dropdown-usuario" to="/">
                                                  <NavDropdown.Item>Políticas de cancelación</NavDropdown.Item>
                                              </LinkContainer>

                                              <LinkContainer className="contenedor-dropdown-usuario" to="/profile">
                                                  <NavDropdown.Item>Perfil</NavDropdown.Item>
                                              </LinkContainer>

                                              <NavDropdown.Divider/>
                                              <Link className='dropdown-item link-salir-dropdown' to="#signout" onClick={signoutHandler}>
                                                  Cerrar sesión
                                              </Link>
                                          </div>
                                      </NavDropdown>
                                  </div>

                                  <div className={ color ? 'contenedor-dropdown-mis-reservas active' : 'contenedor-dropdown-mis-reservas'}>
                                      <Link className={ color ? 'nav-link active' : 'nav-link'} to="/historial-de-reservas" >
                                              Mis reservas
                                      </Link>
                                  </div>
                                
                              
                                {userInfo && (
                                  <div className="contenedor-favoritos" id="fav-dropdown">
                                  <NavDropdown onClick={llamarUser} title={'Favoritos'} className={ color ? 'nav-link active contenedor-favoritos' : 'nav-link contenedor-favoritos'}>
                                      <NavDropdown.Header className="titulo-favoritos">

                                        {listadofavoritos && (
                                          <>
                                                                                 
                                                {user.favoritos.length === 0 ? (
                                                  <>
                                                  <div className="contenedor-titulo-favoritos">
                                                    <div>
                                                        <p className="texto-sin-favoritos">Aún no hay favoritos agregados</p>
                                                    </div>
                                                    <div>
                                                      <BsHeart className="corazon-dropdown-favoritos"/>
                                                    </div>
                                                  </div>
                                                  </>
                                                  
                                                ) : (
                                                  <>
                                                  <div>Favoritos <strong className="fs-5">({user.favoritos.length})</strong></div> 
                                                  <div>
                                                    <div><BsHeart/></div>
                                                  </div>
                                                  </>
                                                )}
                                            
                                              
                                          </>
                                        )}
                                        
                                      </NavDropdown.Header>
                                      <NavDropdown.Divider/>
                                    
                                    {listadofavoritos && (
                                      <>
                                      {cargando ? (<Spinner className="container spinner-favoritos"  animation="border" role="status"></Spinner>): (
                                         <>
                                         {user.favoritos.map((product)=>
                                           <>
                                           <DropdownItem className="correccion-favoritos-dropdown">
                                           <div className="link-contenedor-favorito">
                                           <div className="contenedor-item-favoritos">
                                             <div>
                                                 <div>
                                                     <p className="nombre-producto-favorito">{product.name}</p>
                                                 </div>
                                                 <div>
                                                   <Link to={'/'}>
                                                     <p  onClick={() => deleteHandler(product._id)}  className='boton-eliminar-favoritos'>Eliminar</p>
                                                   </Link>
                                                 </div>
                                             </div>
                                             <Link to={`/product/${product.slug}`}>
                                               <Card.Img className="img-producto-favoritos-dropdown" variant="top" src={product.image} alt="product" />
                                             </Link>
                                             {/* <p>{product.category}</p> */}
                                           </div>
                                           </div>
                                           </DropdownItem>
                                           <NavDropdown.Divider/>
                                           </>
                                         )}
                                         </>
                                      )}                                   
                                      </>
                                      )}
                                  </NavDropdown>
                                
                              </div>
                                )}
                                  

                                  <div className="d-flex contenedor-campana-notificaciones">
                                      {/* <Link to="/" className="contenedor-notificaciones me-2"> */}
                                          <div className="contenedor-notificaciones me-2">
                                              <BsBell className={ color ? 'icono-campana-active' : 'icono-campana'}/>
                                              <Badge pill className="pildora-notoficacion">
                                                  {notificaciones.length}
                                              </Badge>
                                          </div>
                                                  
                                      {/* </Link> */}


                                  <NavDropdown onClick={llamarNotificacion} className={ color ? 'nav-link active contenedor-favoritos dropdown-item' : 'nav-link contenedor-favoritos'}>
                                    
                                      {cargando ? (<Spinner className="container spinner-favoritos"  animation="border" role="status"></Spinner>): (
                                        <>
                                        <NavDropdown.Header className="titulo-favoritos">
                                              <div>{notificaciones.length === 0 ? ('No tenés ninguna notificación') : (`Notificaciones (${notificaciones.length})`)}</div>
                                              <div><BsBell/></div>
                                        </NavDropdown.Header>
                                      
                                          <NavDropdown.Divider/>
                                          {loadingDelete && <LoadingBox></LoadingBox>} 
                                          {notificacionesFiltradas.map((notificacion, i)=>(
                                              <div key={i}>
                                                  <NavDropdown.Item className="contenedor-item-favoritos">

                                                      

                                                      <div  className="d-flex flex-column">
                                                          <div className="contenedor-dropdown-favoritos ">
                                                            {/* <Link className="link-categorias-related mb-3" to={'/'}>
                                                                <Card.Img className="img-notificaciones" variant="top" alt="product" src={require('../../assets/logos/logo-ethereal.png')}/>
                                                            </Link> */}

                                                              {/* <Link className="contenedor-dropdown-favoritos mb-2" to={`/product/${product.slug}`}> */}
                                                                  <p className="texto-notificacion-titulo">{notificacion.titulo}</p>
                                                                  <p className="texto-notificacion">{notificacion.contenidobreve}</p>
                                                              {/* </Link> */}
                                                          </div>
                                                          <div className="contenedor-link-cartelera">
                                                              {/* <Link to={'/'}>
                                                                  <p onClick={() => deleteHandler(notificacion)} className='boton-eliminar-favoritos'>Quitar del listado</p>
                                                              </Link> */}
                                                              <div><Link className="link-cartelera-notificaciones" to={'/notificaciones'}>Ver completo</Link></div>

                                                          </div>
                                                          
                                                      </div>                
                                                      
                                                  </NavDropdown.Item>  
                                                  
                                                  <NavDropdown.Divider/>   
                                          
                                              </div>
                                              ))} 
                                        </>
                                      )}
                                      
                                          
                                      </NavDropdown>
                                        <div className={color ? 'hamburguer2 active' : 'hamburguer2'} data-bs-toggle="offcanvas" href="#offcanvasExample" role="button" aria-controls="offcanvasExample" onClick={handleNav}>
                                            <img className="logo-boton-menu" src={logo} alt="logo"/>
                                            {/* <AiFillHome/> */}
                                        </div>
                                  </div>

                                  
                                  
                                  </>
                                  ) : (
                                    <>
                                    
                                    <motion.div initial={{scale: 1}}
                                        transition={{ duration: 1}}
                                        animate= {{scale: 1.02,zIndex: 1, // x:-5, y: -10
                                        duration: 2
                                        }} className="contenedor-slogan-inicio">
                                        <p className="texto-slogan-inicio">Solicitá una cuenta <Link className="click-aqui-inicio" to={"/solicitud-cuenta"}>aquí</Link> y comenzá a operar con nosotros</p>
                                    </motion.div>

                                    <Link className="" to="/login">
                                      <button className="boton-iniciar">Iniciar Sesión</button>
                                    </Link>
                                    </>
                                      
                                  )}
                                  {userInfo && userInfo.isAdmin && (
                                      <NavDropdown title="Admin" id="admin-nav-dropdown" className={ color ? 'nav-link-admin active' : 'nav-link-admin'}>
                                          
                                          <LinkContainer className="contenedor-dropdown-usuario" to="/admin/orders">
                                          <NavDropdown.Item>Reservas</NavDropdown.Item>
                                          </LinkContainer>
                                          <LinkContainer className="contenedor-dropdown-usuario" to="/admin/products">
                                          <NavDropdown.Item>Productos</NavDropdown.Item>
                                          </LinkContainer>
                                          <LinkContainer className="contenedor-dropdown-usuario" to="/admin/users">
                                          <NavDropdown.Item>Usuarios</NavDropdown.Item>
                                          </LinkContainer>
                                          <LinkContainer className="contenedor-dropdown-usuario" to="/admin/crear-notificacion">
                                          <NavDropdown.Item>Crear Notificación</NavDropdown.Item>
                                          </LinkContainer>
                                          <LinkContainer className="contenedor-dropdown-usuario" to="/admin/dashboard">
                                          <NavDropdown.Item>Configuración y General</NavDropdown.Item>
                                          </LinkContainer>
                                          
                                      </NavDropdown>
                                  )}
                              
                              {/* {userInfo && (
                                 <div className="hamburguer2 active" data-bs-toggle="offcanvas" href="#offcanvasExample" role="button" aria-controls="offcanvasExample" onClick={handleNav}>
                                 {/* {!nav ? (<AiOutlineMenu className={hamburguer ? 'hamburguer2' : 'hamburguer'} />):(<FaTimes className={hamburguer ? 'hamburguer2' : 'hamburguer'} />) } */}
                                 {/* <AiOutlineMenu/>
                               </div> */}
                              {/* )} */} 
                             
                                  
                                  
                                  
                      </div>
                    </div>
                  )
                  : (
                    <motion.div 
                    // drag={"y"} 
                      // whileTap={{ cursor: "grabbing" }}
                      // dragConstraints={{top: -430, bottom: -10}}
                      initial={{scale: 1.1}}
                      transition={{ duration: 1}}
                      animate= {{scale: 1.1,zIndex: 1, // x:-5, y: -10
                      duration: 5
                      }}
                    
                    className={ userInfo && color ? 'hamburguer-celu active' : 'hamburguer-celu'} data-bs-toggle="offcanvas" href="#offcanvasExample" role="button" aria-controls="offcanvasExample" onClick={handleNav}>
                        <AiOutlineMenu/>
                    </motion.div>
                    //   <div data-bs-toggle="offcanvas" href="#offcanvasExample" role="button" aria-controls="offcanvasExample" onClick={handleNav}>
                    //   {/* {!nav ? (<AiOutlineMenu className={hamburguer ? 'hamburguer2' : 'hamburguer'} />):(<FaTimes className={hamburguer ? 'hamburguer2' : 'hamburguer'} />) } */}
                    //   <AiOutlineMenu className={color ? 'hamburguer2' : 'hamburguer'}/>
                    //   </div>
                  )}
            
            </div>
        </motion.div>

        <div>

       


<div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasExample" data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions" >
  <div className="offcanvas-header header-sidebar " id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
      <div>
        <button type="button" className="btn-close btn-sidebar" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>

      <div>
        <Link to={'/'}>
          <img className='logo-ethereal-sidebar' src={logok} alt="logo-ethereal"/>
        </Link>
      </div>
      <SearchBox1/>
  </div>
  <hr></hr>

  <div className="offcanvas-body">
      <div className="contenerdor-enlaces-sidenav">

        <ul className='ul-sidenav'>
          <li data-bs-dismiss="offcanvas">
            <Link className='enlace-sidenav nav-link2' to="/"><AiOutlineHome className="icono-sidebar"/>Inicio</Link>
          </li>
          <li data-bs-dismiss="offcanvas">
            <Link className='enlace-sidenav nav-link2' to="/historial-de-reservas"><AiOutlineShopping className="icono-sidebar"/>Mis resveras</Link>
          </li>
          <li data-bs-dismiss="offcanvas">
            <Link className='enlace-sidenav nav-link2' to="/cotizaciones"><RiBillLine className="icono-sidebar"/>Cotizaciones</Link>
          </li>
          <li data-bs-dismiss="offcanvas">
            <Link className='enlace-sidenav nav-link2' to="/profile"><AiOutlineCloudDownload className="icono-sidebar"/>Tarifarios y documentos</Link>
          </li>
          <li data-bs-dismiss="offcanvas">
            <Link className='enlace-sidenav nav-link2' to="/profile"><AiOutlineUser className="icono-sidebar"/>Tú perfil</Link>
          </li>
        </ul>

          {userInfo && userInfo.isAdmin && (
            <div className="contenedor-admin-sidenav">
              <h1 className="titulo-admin-sidenav">Admin</h1>
              <ul className='ul-sidenav'>
                <li data-bs-dismiss="offcanvas">
                  <Link className='enlace-sidenav nav-link2' to="/admin/orders"><BsSearch className="icono-sidebar"/>Reservas Generales</Link>
                </li>
                <li data-bs-dismiss="offcanvas">
                  <Link className='enlace-sidenav nav-link2' to="admin/products"><RiProductHuntLine className="icono-sidebar"/>Productos</Link>
                </li>
                <li data-bs-dismiss="offcanvas">
                  <Link className='enlace-sidenav nav-link2' to="admin/dashboard"><BsClipboardData className="icono-sidebar"/>Dashboard</Link>
                </li>
                <li data-bs-dismiss="offcanvas">
                  <Link className='enlace-sidenav nav-link2' to="admin/crear-notificacion"><BsBellFill className="icono-sidebar"/>Crear notificaciones</Link>
                </li>
                <li data-bs-dismiss="offcanvas">
                  <Link className='enlace-sidenav nav-link2' to="admin/users"><HiUsers className="icono-sidebar"/>Usuarios</Link>
                </li>
              </ul>
              
            </div>
          
          )}

        <div className="contenedor-boton-sidenav">
          <Link className='enlace-sidenav nav-link2 boton-sidenav-cerrar-sesion mt-5' data-bs-dismiss="offcanvas" aria-label="Close" to="#signout" onClick={signoutHandler}>Cerrar sesión</Link>
        </div>
          

      </div>
  </div>
  
  </div>





               {/* <div className="contenedor-titulo-sidenav">
                    <Link className="titulo-sidenav" to="/home">Menú</Link>
               </div>

               <div className="contenerdor-enlaces-sidenav">
                    <Link className='enlace-sidenav' to="/profile">Tú Perfil</Link>
                    <Link className='enlace-sidenav' to="/profile">Tú Perfil</Link>
                    <Link className='enlace-sidenav' to="/profile">Tú Perfil</Link>
                    <Link className='enlace-sidenav' to="/profile">Tú Perfil</Link>
                    <Link className='enlace-sidenav' to="/profile">Tú Perfil</Link>
               </div> */}
        </div>

    </div>
  )
}

export default Header2