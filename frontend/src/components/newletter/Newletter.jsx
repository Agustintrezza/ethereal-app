import React from 'react';
import './NewletterStyles.css';

const Newletter = () => {
  return (
    <div className='contenedor-general-newletter'>
        <h1 className="titulo-newsletter text-center">¡No te pierdas nada!</h1>
        <h2 className='subtitulo-newsletter text-center'>Hola! Suscribite a nuestro newsletter para enterarte de todo antes que nadie.</h2>
        <div className='d-flex justify-content-center contenedor-input'>
            <input className='form-control input-newsletter' type="text" placeholder='Ingresa tu email'></input>
            <button className='btn btn-primary boton-newsletter'>Enviar</button>
        </div>
    </div>
  )
}

export default Newletter