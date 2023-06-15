// import React, {useState, useContext, useEffect, useReducer} from 'react';
// import { useParams } from "react-router-dom";
// import './Header2Styles.css';
// import {Link} from 'react-router-dom';
// import logok from '../../assets/logos/logo-ethereal.jpeg';
// import {FaTimes} from 'react-icons/fa';
// import {AiOutlineMenu, AiOutlineUser} from 'react-icons/ai';
// // import {BiUserCircle} from 'react-icons/bi';
// import {BsBell} from 'react-icons/bs';
// // import {HiOutlineUserCircle} from 'react-icons/hi';
// import {LinkContainer} from 'react-router-bootstrap';
// import { Store } from '../../Store';
// import { toast } from 'react-toastify';
// import Badge from 'react-bootstrap/Badge';
// import NavDropdown from 'react-bootstrap/NavDropdown';
// import axios from 'axios';
// import Card from 'react-bootstrap/Card';
// import SearchBox from '../SearchBox';
// import {BsHeart} from 'react-icons/bs';

// import LoadingBox from '../../components/LoadingBox';

// // import {logo} from '../../assets/logos/logo-ethereal.png';
// import { getError } from '../../utils';

// const reducer = (state, action) => {
//     switch (action.type) {
//       case 'FETCH_REQUEST':
//         return { ...state, loading: true };
//       case 'FETCH_SUCCESS':
//         return {
//           ...state,
//           orders: action.payload,
//           loading: false,
//         };
//       case 'FETCH_FAIL':
//       return { ...state, loading: false, error: action.payload };
//       case 'DELETE_REQUEST':
//         return { ...state, loadingDelete: true, successDelete: false };
//       case 'DELETE_SUCCESS':
//         return {
//           ...state,
//           loadingDelete: false,
//           successDelete: true,
//         };
//       case 'DELETE_FAIL':
//         return { ...state, loadingDelete: false };
//       case 'DELETE_RESET':
//         return { ...state, loadingDelete: false, successDelete: false };
//       default:
//         return state;
//     }
//   };




// const Header2 = (props) => {

//     const params = useParams()
//     const {slug} = params;
//     const { state } = useContext(Store);
//     const { userInfo } = state;
//     const [{ loading, error, loadingDelete, successDelete }, dispatch] = useReducer(reducer, {
//       loading: true,
//       error: '',
//     });

//   //    const signoutHandler = () => {

//   //       toast.success('Cerraste tú sesión correctamente');
//   //       // navigate("/home", { replace: true });

//   //   dispatch({ type: 'USER_SIGNOUT'});
//   //   localStorage.removeItem('userInfo');
//   //   localStorage.removeItem('shippingAddress');
//   //   localStorage.removeItem('paymentMethod');

//   //       // window.location.href = '/';
    
//   //       setTimeout(() => {
//   //           window.location.href = '/home';
//   //           console.log('pasoooooooooooooooo')
//   //       }, 1000);
//   // }

//     const [favoritos, setFavoritos] = useState([]);

//     const [navbar, setNavbar] = useState(false)
//     const [color, setColor] = useState(false)

//     const [hamburguer, setHamburguer] = useState(false)

//     const [nav, setNav] = useState(false)
//     const handleNav = () => setNav(!nav)

//     const [products, setProducts] = useState([]);
//     console.log(products)

//     const changeBackground = () => {
//         if (window.scrollY >= 70) {
//             setNavbar(true)
//             setColor(true) 
//             // setLogo(true) 
//             setHamburguer(true)     
//         } else {
//             setNavbar(false)
//             setColor(false)
//             // setLogo(false) 
//             setHamburguer(false)
//         }
//     }

//     window.addEventListener('scroll', changeBackground); 

//     const [notificaciones, setNotificaciones] = useState([]);
    
//     useEffect(() => {
//         const fetchProducts = async () => {
//           try {
//             const { data } = await axios.get(`/api/products/destacados`);
//             // console.log(data)
//             // setProducts([data.tango, data.tour, data.paquete, data.varios]);
//             setFavoritos(data)
//           } catch (err) {
//             toast.error(getError(err));
//           }
//         }
//         fetchProducts();
//       }, [])

//       useEffect(() => {
//         const fetchData = async () => {
//           try {
//             dispatch({ type: 'FETCH_REQUEST' });
//             const { data } = await axios.get(`/api/notificaciones`, {
//               headers: { Authorization: `Bearer ${userInfo.token}` },
//             });
//             setNotificaciones(data)
//             dispatch({ type: 'FETCH_SUCCESS', payload: data });
//           } catch (err) {
//             dispatch({
//               type: 'FETCH_FAIL',
//               payload: getError(err),
//             });
//           }
//         };
//         if(successDelete) {
//         //   dispatch({type:'DELETE_RESET'})
//         } else {
//           fetchData();
//         }
        
//       }, [userInfo, successDelete]);



//   const deleteHandler = async (notificacion, e) => {
    
//     if (window.confirm('¿Seguro que quieres eliminar ésta notificación?')) {
//       try {
//         dispatch({ type: 'DELETE_REQUEST' });
//         await axios.delete(`/api/notificaciones/${notificacion._id}`, {
//           headers: { Authorization: `Bearer ${userInfo.token}` },
//         });
//         toast.success('Notificacion eliminada exitosamente');
//         dispatch({ type: 'DELETE_SUCCESS' });
        
//       } catch (err) {
//         toast.error(getError(err));
//         dispatch({
//           type: 'DELETE_FAIL',
//         });
//       }
//     }
//   };

//   const notificacionesFiltradas = [...notificaciones].sort((a,b) => {
//     return a._id < b._id ? 1 : -1
//   })
//   console.log(notificacionesFiltradas);

//   if(userInfo) {
//     const favoritosFiltrados = [...userInfo.favoritos].sort((a,b) => {
//       return a._id < b._id ? 1 : -1
//     })
//     console.log(favoritosFiltrados);
//   }


//   const [width, setWidth] = React.useState(window.innerWidth);
//   const breakpoint = 968;
//   const handleResizeWindow = () => setWidth(window.innerWidth);
//   window.addEventListener("resize", handleResizeWindow);



//   return (
//     <div className={navbar ? 'navbar active' : 'navbar'}>
//         <div className="contenedor-interno">
          
//             <div className="primer-bloque-header">
//               {/* <div className="d-flex"> */}
//                 <Link to={'/'}>
//                     <img className='logo-ethereal' src={logok} alt="logo-ethereal"/>
//                 </Link>

//                 {/* <div className='contenedor-inicio'>
//                         <Link to="/home" className={ color ? 'boton-reserva active' : 'boton-reserva'}>INICIO</Link>
//                 </div> */}
//                 <SearchBox/>
//               {/* </div> */}
                
//             </div>


//             <div className='segundo-bloque-header'>
            

//                   {width > breakpoint ? (
//                     <div className="contenedor-interno">
//                     <div className="contenedor-dropdown">
//                           {userInfo ?  (
//                                   <>
//                                   <div className="contenedor-logos-dropdown">
//                                       <AiOutlineUser className={ color ? 'logo-user-dropdown-active' : 'logo-user-dropdown'}/>
//                                       <NavDropdown title={userInfo.name} id="basic-nav-dropdown" className={ color ? 'nav-link active' : 'nav-link'}>
                                          
//                                           <div className="dropdown-usuario">

//                                               <LinkContainer className="contenedor-dropdown-usuario" to="/historial-de-reservas">
//                                                   <NavDropdown.Item>Mis Reservas</NavDropdown.Item>
//                                               </LinkContainer>

//                                               <LinkContainer className="contenedor-dropdown-usuario" to="/cotizaciones">
//                                                   <NavDropdown.Item>Cotizaciones</NavDropdown.Item>
//                                               </LinkContainer>

//                                               {/* <LinkContainer className="contenedor-dropdown-usuario" to="/">
//                                                   <NavDropdown title="Tus Ventas">
//                                                       <NavDropdown.Item>Estadísticas</NavDropdown.Item>
//                                                       <NavDropdown.Item>Premiaciones</NavDropdown.Item>
//                                                   </NavDropdown>
//                                               </LinkContainer> */}

//                                               <LinkContainer className="contenedor-dropdown-usuario" to="/">
//                                                   <NavDropdown.Item>Contacto</NavDropdown.Item>
//                                               </LinkContainer>

//                                               <LinkContainer className="contenedor-dropdown-usuario" to="/profile">
//                                                   <NavDropdown.Item>Perfil</NavDropdown.Item>
//                                               </LinkContainer>

//                                               <NavDropdown.Divider/>
//                                               {/* <Link className='enlace-sidenav nav-link mt-5' to="#signout" onClick={signoutHandler}>
//                                               {/* <Link className='dropdown-item link-salir-dropdown' to="#signout" onClick={signoutHandler}> */}
//                                                   {/* Salir */}
//                                               {/* </Link> */}
//                                           </div>
//                                       </NavDropdown>
//                                   </div>

//                                   <div className={ color ? 'contenedor-dropdown-mis-reservas active' : 'contenedor-dropdown-mis-reservas'}>
//                                       <Link className={ color ? 'nav-link active' : 'nav-link'} to="/historial-de-reservas" >
//                                               Mis reservas
//                                       </Link>
//                                   </div>

//                                   <div className="contenedor-favoritos" id="fav-dropdown">
//                                       <NavDropdown title={'Favoritos'} className={ color ? 'nav-link active contenedor-favoritos' : 'nav-link contenedor-favoritos'}>
//                                           <NavDropdown.Header className="titulo-favoritos">
//                                               <div>Favoritos <strong className="fs-5">({userInfo.favoritos.length})</strong></div>
//                                               <div><BsHeart/></div>
                                          
//                                           </NavDropdown.Header>
//                                           <NavDropdown.Divider/>
                                        
                                        
//                                           {userInfo.favoritos.map((product, i)=>(
//                                               <Link to={`/product/${product.slug}`} key={i} >
//                                                   <NavDropdown.Item className="contenedor-item-favoritos">

//                                                       <Link className="link-categorias-related mb-3" to={`/product/${product.slug}`}>
//                                                               <Card.Img className="img-producto-favoritos-dropdown" variant="top" src={product.image} alt="product" />
//                                                       </Link>

//                                                       <div  className="d-flex flex-column">
//                                                           <div className="contenedor-dropdown-favoritos ">
//                                                               <Link className="contenedor-dropdown-favoritos mb-2" to={`/product/${product.slug}`}>
//                                                                   <p className="nombre-producto-favorito">{product.name}</p>
//                                                               </Link>
//                                                           </div>
//                                                           <div>
//                                                               <Link to={'/'}>
//                                                                   <p  onClick={() => deleteHandler(product._id)}  className='boton-eliminar-favoritos'>Eliminar</p>
//                                                               </Link>
//                                                           </div>
                                              
//                                                       </div>                
                                                      
//                                                   </NavDropdown.Item>  
                                                  
//                                                   <NavDropdown.Divider/>   
                                          
//                                               </Link>
//                                                   ))}
                                                  
//                                       </NavDropdown>
                                    
//                                   </div>

//                                   <div className="d-flex">
//                                       {/* <Link to="/" className="contenedor-notificaciones me-2"> */}
//                                           <div className="contenedor-notificaciones me-2">
//                                               <BsBell className={ color ? 'icono-campana-active' : 'icono-campana'}/>
//                                               <Badge pill className="pildora-notoficacion">
//                                                   {1}
//                                               </Badge>
//                                           </div>
                                                  
//                                       {/* </Link> */}

//                                       <NavDropdown className={ color ? 'nav-link active contenedor-favoritos' : 'nav-link contenedor-favoritos'}>


//                                       <NavDropdown.Header className="titulo-favoritos">
//                                               <div>{notificaciones.length === 0 ? ('No tenés ninguna notificación') : ('Notificaciones')}</div>
//                                               <div><BsBell/></div>
//                                       </NavDropdown.Header>
                                      
//                                           <NavDropdown.Divider/>
//                                           {loadingDelete && <LoadingBox></LoadingBox>} 
//                                           {notificacionesFiltradas.map((notificacion, i)=>(
//                                               <div key={i}>
//                                                   <NavDropdown.Item className="contenedor-item-favoritos">

//                                                       <Link className="link-categorias-related mb-3" to={'/'}>
//                                                               <Card.Img className="img-notificaciones" variant="top" alt="product" src={require('../../assets/logos/logo-ethereal.png')}/>
//                                                       </Link>

//                                                       <div  className="d-flex flex-column">
//                                                           <div className="contenedor-dropdown-favoritos ">
//                                                               {/* <Link className="contenedor-dropdown-favoritos mb-2" to={`/product/${product.slug}`}> */}
//                                                                   <p className="texto-notificacion-titulo">{notificacion.titulo}</p>
//                                                                   <p className="texto-notificacion">{notificacion.contenido}</p>
//                                                               {/* </Link> */}
//                                                           </div>
//                                                           <div>
//                                                               <Link to={'/'}>
//                                                                   <p onClick={() => deleteHandler(notificacion)} className='boton-eliminar-favoritos'>Eliminar</p>
//                                                               </Link>
//                                                           </div>
                                                          
//                                                       </div>                
                                                      
//                                                   </NavDropdown.Item>  
                                                  
//                                                   <NavDropdown.Divider/>   
                                          
//                                               </div>
//                                                   ))} 
                                          
//                                       </NavDropdown>
//                                   </div>
                                  
//                                   </>
//                                   ) : (
//                                     <>
//                                     <Link className="" to="/login">
//                                       <button className={color ? 'boton-iniciar active' : 'boton-iniciar'}>Iniciar Sesión</button>
//                                     </Link>
//                                     </>
                                      
//                                   )}
//                                   {userInfo && userInfo.isAdmin && (
//                                       <NavDropdown title="Admin" id="admin-nav-dropdown" className={ color ? 'nav-link-admin active' : 'nav-link-admin'}>
                                          
//                                           <LinkContainer className="contenedor-dropdown-usuario" to="/admin/orders">
//                                           <NavDropdown.Item>Reservas</NavDropdown.Item>
//                                           </LinkContainer>
//                                           <LinkContainer className="contenedor-dropdown-usuario" to="/admin/products">
//                                           <NavDropdown.Item>Productos</NavDropdown.Item>
//                                           </LinkContainer>
//                                           <LinkContainer className="contenedor-dropdown-usuario" to="/admin/users">
//                                           <NavDropdown.Item>Usuarios</NavDropdown.Item>
//                                           </LinkContainer>
//                                           <LinkContainer className="contenedor-dropdown-usuario" to="/admin/crear-notificacion">
//                                           <NavDropdown.Item>Notificaciones</NavDropdown.Item>
//                                           </LinkContainer>
//                                           <LinkContainer className="contenedor-dropdown-usuario" to="/admin/dashboard">
//                                           <NavDropdown.Item>General</NavDropdown.Item>
//                                           </LinkContainer>
                                          
//                                       </NavDropdown>
//                                   )}
                              
//                               {userInfo && (
//                                  <div data-bs-toggle="offcanvas" href="#offcanvasExample" role="button" aria-controls="offcanvasExample" onClick={handleNav}>
//                                  {/* {!nav ? (<AiOutlineMenu className={hamburguer ? 'hamburguer2' : 'hamburguer'} />):(<FaTimes className={hamburguer ? 'hamburguer2' : 'hamburguer'} />) } */}
//                                  <AiOutlineMenu className={color ? 'hamburguer2' : 'hamburguer2 active'}/>
//                                </div>
//                               )}
                             
                                  
                                  
                                  
//                       </div>
//                     </div>
//                   )
//                   : (
//                       <div data-bs-toggle="offcanvas" href="#offcanvasExample" role="button" aria-controls="offcanvasExample" onClick={handleNav}>
//                       {/* {!nav ? (<AiOutlineMenu className={hamburguer ? 'hamburguer2' : 'hamburguer'} />):(<FaTimes className={hamburguer ? 'hamburguer2' : 'hamburguer'} />) } */}
//                       <AiOutlineMenu className={color ? 'hamburguer2' : 'hamburguer'}/>
//                       </div>
//                   )}
            
//             </div>
//         </div>

//         <div>

       


// <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
//   <div class="offcanvas-header">
//     <h5 class="offcanvas-title" id="offcanvasExampleLabel">Offcanvas</h5>
//     <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
//   </div>
//   <div class="offcanvas-body">
//     <div>
//       Some text as placeholder. In real life you can have the elements you have chosen. Like, text, images, lists, etc.
//     </div>
//     <div class="dropdown mt-3">
//       <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
//         Dropdown button
//       </button>
//       <ul class="dropdown-menu">
//         <li><a class="dropdown-item" href="#">Action</a></li>
//         <li><a class="dropdown-item" href="#">Another action</a></li>
//         <li><a class="dropdown-item" href="#">Something else here</a></li>
//       </ul>
//     </div>
//   </div>
// </div>





//                {/* <div className="contenedor-titulo-sidenav">
//                     <Link className="titulo-sidenav" to="/home">Menú</Link>
//                </div>

//                <div className="contenerdor-enlaces-sidenav">
//                     <Link className='enlace-sidenav' to="/profile">Tú Perfil</Link>
//                     <Link className='enlace-sidenav' to="/profile">Tú Perfil</Link>
//                     <Link className='enlace-sidenav' to="/profile">Tú Perfil</Link>
//                     <Link className='enlace-sidenav' to="/profile">Tú Perfil</Link>
//                     <Link className='enlace-sidenav' to="/profile">Tú Perfil</Link>
//                </div> */}
//         </div>

//     </div>
//   )
// }

// export default Header2