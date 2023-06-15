import React from 'react';
import './EtiquetasinfoStyles.css';
import {ImCalendar} from 'react-icons/im';
import {BsBagCheckFill} from 'react-icons/bs';
import {BsCreditCard} from 'react-icons/bs';
import {MdAirplaneTicket} from 'react-icons/md';
import {GiPassport} from 'react-icons/gi';
import {SiYourtraveldottv} from 'react-icons/si'
import {Link} from "react-router-dom";

const Etiquetasinfo = () => {
  return (
    <div className='container-general-etiquetas'>
        <div className='container-etiquetas'>
            <h1 className='text-center titulos-etiquetas'>Cómo hacer para cotizar tu viaje</h1>
            <h2 className='text-center subtitulos-etiquetas'>Te contamos todo lo que tenés que saber para volar con Etheral al precio mas bajo</h2>

            <div className=''>
                <div className='mb-5 grid-general'>
                    <div className='background-card'>
                        <h1 className='titulo-card-etiqueta'>SELECCIONA TU VIAJE</h1>
                        <div className="contenedor-logo-etiqueta d-flex align-items-center">
                            <Link to={'/'} className="logo-etiquetas"><ImCalendar/></Link>
                            <p className='etiqueta-texto'>Elegí a dónde querés ir y cuándo. Acordate que cuanto antes compres, más barato vas a volar.</p>
                        </div>
                        <Link to={'/'} className="etiquetas-link d-flex justify-content-center">Conocé nuestros destinos</Link>
                    </div>
                    <div className='background-card'>
                        <h1 className='titulo-card-etiqueta'>¿QUÉ INCLUYEN MIS ESTADÍAS?</h1>
                        <div className="contenedor-logo-etiqueta d-flex align-items-center">
                            <Link to={'/'} className="logo-etiquetas"><BsBagCheckFill/></Link>
                            <p className='etiqueta-texto'>Elegí a dónde querés ir y cuándo. Acordate que cuanto antes compres, más barato vas a volar.</p>
                        </div>
                        <Link to={'/'} className="etiquetas-link d-flex justify-content-center">Conocé nuestros destinos</Link>
                    </div>
                    <div className='background-card'>
                        <h1 className='titulo-card-etiqueta'>PAGÁ</h1>
                        <div className="contenedor-logo-etiqueta d-flex align-items-center">
                            <Link to={'/'} className="logo-etiquetas"><BsCreditCard/></Link>
                            <p className='etiqueta-texto'>Elegí a dónde querés ir y cuándo. Acordate que cuanto antes compres, más barato vas a volar.</p>
                        </div>
                        <Link to={'/'} className="etiquetas-link d-flex justify-content-center">Conocé nuestros destinos</Link>
                    </div>
                    <div className='background-card'>
                        <h1 className='titulo-card-etiqueta'>HACÉ TU CHECK-IN</h1>
                        <div className="contenedor-logo-etiqueta d-flex align-items-center">
                            <Link to={'/'} className="logo-etiquetas"><MdAirplaneTicket/></Link>
                            <p className='etiqueta-texto'>Elegí a dónde querés ir y cuándo. Acordate que cuanto antes compres, más barato vas a volar.</p>
                        </div>
                        <Link to={'/'} className="etiquetas-link d-flex justify-content-center">Conocé nuestros destinos</Link>
                    </div>
                    <div className='background-card'>
                        <h1 className='titulo-card-etiqueta'>RECIBÍ TU TARJETA DE VIAJE</h1>
                        <div className="contenedor-logo-etiqueta d-flex align-items-center">
                            <Link to={'/'} className="logo-etiquetas"><GiPassport/></Link>
                            <p className='etiqueta-texto'>Elegí a dónde querés ir y cuándo. Acordate que cuanto antes compres, más barato vas a volar.</p>
                        </div>
                        <Link to={'/'} className="etiquetas-link d-flex justify-content-center">Conocé nuestros destinos</Link>
                    </div>
                    <div className='background-card'>
                        <h1 className='titulo-card-etiqueta'>¡NOS VEMOS EN ALLÁ</h1>
                        <div className="contenedor-logo-etiqueta d-flex align-items-center">
                            <Link to={'/'} className="logo-etiquetas"><SiYourtraveldottv/></Link>
                            <p className='etiqueta-texto'>Elegí a dónde querés ir y cuándo. Acordate que cuanto antes compres, más barato vas a volar.</p>
                        </div>
                        <Link to={'/'} className="etiquetas-link d-flex justify-content-center">Conocé nuestros destinos</Link>
                    </div>
                </div>
            </div>
            <div className='d-flex justify-content-center align-items-center'>
                <Link to={'/'} className="boton-etiquetas">¡RESPONDE A TUS PREGUNTAS!</Link>
            </div>
            
        </div>
    </div>
  )
}

export default Etiquetasinfo