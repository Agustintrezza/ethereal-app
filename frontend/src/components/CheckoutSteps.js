import React from 'react';
import './CheckoutStyles.css'
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';

export default function CheckoutSteps(props) {

  return (
    <div className='contenedor-checkout'>
        {/* <!-- Progress bar --> */}
      <div className="progressbar">
        {/* <div className="progress" id="progress"></div> */}
        <div className={`progress ${props.step1 ? '' : '' }`}></div>
        <div className={`progress ${props.step2 ? 'progress-1' : '' }`}></div>
        <div className={`progress ${props.step3 ? 'progress-2' : '' }`}></div>
        <div className={`progress ${props.step4 ? 'progress-3' : '' }`}></div>
        
        {/* <div className={`progress-step ${props.step1 ? 'progress-step-active' : '' }`} data-title="AGREGÁ UN TOUR"></div> */}
        <div className={`progress-step ${props.step2 ? 'progress-step-active' : '' }`} data-title="COMPLETÁ EL FORMULARIO"></div>
        <div className={`progress-step ${props.step3 ? 'progress-step-active' : '' }`} data-title="VERIFICA TUS DATOS Y CONFIRMÁ"></div>
        <div className={`progress-step ${props.step4 ? 'progress-step-active' : '' }`} data-title="CONFRIMÁ TU RESERVA"></div>
      </div>

      {/* <Row className="checkout-steps">
            <Col className={props.step1 ? 'active' : '' } >Iniciar Sesión</Col>
            <Col className={props.step2 ? 'active' : '' } >Datos para la reserva</Col>
            <Col className={props.step3 ? 'active' : '' } >Datos para la reserva</Col>
            <Col className={props.step4 ? 'active' : '' } >Detalles de la reserva</Col>
        </Row> */}

    </div>
  )
}
