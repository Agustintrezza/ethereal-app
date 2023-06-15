import React from 'react';
import './FooterStyles.css';
import {Link} from 'react-router-dom';
import {BsFacebook, BsYoutube, BsInstagram} from 'react-icons/bs';
// import {FaInstagramSquare} from 'react-icons/fa';
import {AiFillTwitterCircle, AiOutlineMail, AiOutlinePhone} from 'react-icons/ai';
import {FaTiktok} from 'react-icons/fa';
import logok from '../../assets/logos/logo-ethereal.png';


const Footer = () => {
  return (

    <div className="contenedor-general-footer">
        <footer className='row container-footer footer'>
            <div className='col-md-4 text-center'>
                <div className="contenedor-redes">
                    <div>
                        <h1 className='text-white titulo-footer'>¡Visitá nuestras redes!</h1>
                    </div>
                    <div className='contenedor-logos d-flex justify-content-around'>
                        <Link className='logo-footer' to={'/'}><BsFacebook/></Link>
                        <Link className='logo-footer' to={'/'}><BsInstagram/></Link>
                        <Link className='logo-footer' to={'/'}><FaTiktok/></Link>
                        <Link className='logo-footer' to={'/'}><AiFillTwitterCircle/></Link>
                        <Link className='logo-footer' to={'/'}><BsYoutube/></Link>
                    </div>
                </div>
                {/* <h1 className='text-white titulo-footer'>Somos e-Tours</h1>
                <p className='text-white texto-footer'>Somos los que no dejan que las distancias nos separen de los que más queremos. Somos los que hoy estamos acá y mañana podemos estar allá. Somos un equipo trabajando para que todos podamos disfrutar.</p>
                <Link to={'/'} className='boton-footer btn text-white d-flex align-items-center justify-content-center'>
                    <p>CONTACTO</p>
                </Link> */}
            </div>
            <div className='col-md-4 text-center contenedor-nav-footer'>
                <nav className='d-flex flex-column'>
                    <Link className='link-footer text-white custom-link' to={'/'}>Inicio</Link>
                    <Link className='link-footer text-white custom-link' to={'/'}>Solicitar una cuenta</Link>
                    <Link className='link-footer text-white custom-link' to={'/login'}>Reservas</Link>
                    <Link className='link-footer text-white custom-link' to={'/search'}>Todos los productos</Link>
                    <a className='link-footer text-white custom-link' href="https://wa.me/1532368312" target="_blank" rel="noreferrer" >Contacto</a>
                    
                    {/* <Link className='link text-white custom-link' to={'/'}>Buscar Viajes</Link>
                    <Link className='link text-white custom-link' to={'/'}>Contactános</Link> */}
                </nav>
            </div>
            <div className='col-md-4 text-center contenedor-logo-ethereal-footer'>
                <div>
                    <p className='text-white texto-footer'><AiOutlineMail className="logo-logo-footer"/>ethereal.tours@turismo.gob</p>
                    <p className='text-white texto-footer'><AiOutlinePhone className="logo-logo-footer"/>4-738-1699 // 15-2-345-2463</p>
                </div>  
                <div>
                    <img src={logok} alt="logo-ethereal" className='logo-ethereal-footer'/>
                </div> 
            </div>
            {/* <hr className="text-white mt-5 container"></hr> */}
            
        </footer>
        
            <div className='contenedor-copyright'>
                <p className='copyright fs-4 mb-1'>2022 Ethereal Tours - Todos los derechos reservados.</p>
            </div>
        
    </div>
  )
}

export default Footer