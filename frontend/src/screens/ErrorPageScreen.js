import React from 'react';
import {Helmet} from 'react-helmet-async';
import { Link } from 'react-router-dom';

const ErrorPageScreen = () => {
  return (
    <div>
    {/* <CheckoutSteps step1 step2 step3></CheckoutSteps> */}
    <div className="container payment-container">
        <Helmet>
            <title>Error en la búsqueda :-(</title>
        </Helmet>
        <h1 className='my-3 text-center'>¡Lo sentimos, tu búsqueda no coincide con ningún resultado!</h1>
        {/* <h3 className='my-3 text-center'>En breve vas a estar recibiendo el contacto de un asesor.</h3> */}

          <div className="contenedor-boton-confcotizacion">
            <Link className="boton-confcotizacion" to={'/'}>Inicio</Link>
          </div>
       
    </div>  

</div>
  )
}

export default ErrorPageScreen