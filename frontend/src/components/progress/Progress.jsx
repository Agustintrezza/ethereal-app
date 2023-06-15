import React from 'react';
import './ProgreStyle.css';

const Progress = () => {
  return (
    <div id='reservar' className="contenedor-como-reservar" >
        <div  className='container contenedor-pasos'>
            <section>
                <div className="separador-progress">
                    <h1 className="titulo-progress">¿Cómo reservar?</h1>
                    {/* <h2 className='subtitulo-progress'>Siguiendo estos pasos vas a poder cargar tu reserva</h2> */}
                </div>
            
            <ul className="step-wizard-list">
                <li className="step-wizard-item">
                    <span className="progress-count">1</span>
                    <span className="progress-label">AGREGÁ UN TOUR</span>
                    <span className="progress-label-texto">Ingresá a nuestra sección de productos, elegí el que buscás y dentro de la página del producto, hacé click en el botón que dice <strong>"Iniciar Reserva".</strong></span>
                </li>
                <li className="step-wizard-item">
                    <span className="progress-count">2</span>
                    <span className="progress-label">COMPLETÁ EL FORMULARIO</span>
                    <span className="progress-label-texto">Completá el formulario con los datos necesarios para la reserva.</span>
                </li>
                <li className="step-wizard-item">
                    <span className="progress-count">3</span>
                    <span className="progress-label">VERIFICA TUS DATOS Y CONFIRMÁ</span>
                    <span className="progress-label-texto">Revisá y confirmá que los datos ingresados para tu reserva sean correctos.</span>
                </li>
                <li className="step-wizard-item current-item">
                    <span className="progress-count">4</span>
                    <span className="progress-label">CONFRIMÁ TU RESERVA</span>
                    <span className="progress-label-texto">Una vez tu reserva sea confirmada, vas a recibir un mensaje de <strong>Whatsapp</strong> y un <strong>email</strong> con los datos de la misma.</span>
                </li>
            </ul>
        </section>
        </div>
        
    </div>
  )
}

export default Progress