import React, { useState, useContext } from 'react';
import './Nav-Logos.css';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {motion} from 'framer-motion'
import {Link} from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Store } from '../../Store';
// import { userInfo } from 'os';
// import {BiHotel} from 'react-icons/bi';

const NavLogos = () => {

  const { state } = useContext(Store);
  const { userInfo} = state;

  console.log(userInfo)

  const [color, setColor] = useState(false)
  return (
      <div className="contenedor-general-nav-logo">

        <motion.div initial={{scale: 1}}
            transition={{ duration: 1}}
            animate= {{scale: 1.02,zIndex: 2, // x:-5, y: -10
            duration: 2
            }} className="contenedor-interno-nav-logo">
            <div className='contenedor-links-nav-logo'>
                <div className=''>
                    <Link className="nav-link-nav-logo" to={'/'}>Conocenos</Link>  
                </div>
                <div className="dropdown-usuario">
                    <NavDropdown title={'Destinos'} id="basic-nav-dropdown" className={ color ? 'nav-link-navlogo active' : 'nav-link-navlogo'}>
                        <LinkContainer className="contenedor-dropdown-navlogo" to="/">
                          <NavDropdown.Item>TOURS EN BUENOS AIRES</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer className="contenedor-dropdown-navlogo" to="/">
                          <NavDropdown.Item>AGENTE RECEPTIVO EN BUENOS AIRES</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer className="contenedor-dropdown-navlogo" to="/">
                          <NavDropdown.Item>SERVICIOS EN EL DÍA</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer className="contenedor-dropdown-navlogo" to="/">
                          <NavDropdown.Item>MENDOZA</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer className="contenedor-dropdown-navlogo" to="/">
                          <NavDropdown.Item>BARILOCHE</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer className="contenedor-dropdown-navlogo" to="/">
                          <NavDropdown.Item>MISIONES</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer className="contenedor-dropdown-navlogo" to="/">
                          <NavDropdown.Item>URUGUAY</NavDropdown.Item>
                        </LinkContainer>
                    </NavDropdown>
                </div>
                <div className="dropdown-usuario">
                    <NavDropdown title={'Servicios'} id="basic-nav-dropdown" className={ color ? 'nav-link-navlogo' : 'nav-link-navlogo'}>

                      {/* <NavDropdown.Header className="dropdown-header-navlogo">LOS MEJORES SERIVICIOS EN ARGENTINA</NavDropdown.Header> */}
                        <LinkContainer className="contenedor-dropdown-navlogo" to="/">
                          <NavDropdown.Item>Agencias</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer className="contenedor-dropdown-navlogo" to="/">
                          <NavDropdown.Item>Traslados</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer className="contenedor-dropdown-navlogo" to="/">
                          <NavDropdown.Item>Privados</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer className="contenedor-dropdown-navlogo" to="/">
                          <NavDropdown.Item>Mayorista</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer className="contenedor-dropdown-navlogo" to="/">
                          <NavDropdown.Item>Minorista</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer className="contenedor-dropdown-navlogo" to="/">
                          <NavDropdown.Item>Guías</NavDropdown.Item>
                        </LinkContainer>
                    </NavDropdown>
                </div>
                <div className=''>
                    <Link className="nav-link-nav-logo" to={'/'}>Interior del país</Link>  
                </div>
                <div className=''>
                    <Link className="nav-link-nav-logo" to={'/'}>Internacionales</Link>  
                </div>
                <div className=''>
                    <Link className="nav-link-nav-logo" to={'/'}>Publicá tus servicios</Link>  
                </div>
                {userInfo && (<>
                  <div className=''>
                    <Link className="nav-link-nav-logo" to={'/'}>Contactanos</Link>  
                  </div>
                </>)}
                
            </div>
        </motion.div>
        
    </div>
  )
}

export default NavLogos