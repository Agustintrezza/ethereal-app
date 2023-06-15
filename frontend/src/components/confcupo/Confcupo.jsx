import React from 'react';
// import Button from 'react-bootstrap/esm/Button';
import {Helmet} from 'react-helmet-async';
import { Link } from 'react-router-dom';
// import './ConfcotizacionStyles.css';

const Confcupo = () => {
  return (
    <div>
    {/* <CheckoutSteps step1 step2 step3></CheckoutSteps> */}
    <div className="container payment-container">
        <Helmet>
            <title>Solicitud de cupo</title>
        </Helmet>
        <h1 className='my-3 text-center'>¡Gracias por confiar en nosotros, recibimos con éxito solicitud de amplicación de cupo!</h1>
        <h3 className='my-3 text-center'>En breve vas a estar recibiendo el contacto de un asesor.</h3>

          <div className="contenedor-boton-confcotizacion">
            <Link className="boton-confcotizacion" to={'/'}>Inicio</Link>
          </div>
            
            
            {/* <div className="mb-3">
                <Button className="boton-iniciar" type="submit">Continuar</Button>
            </div> */}
       
    </div>  

</div>
  )
}

export default Confcupo