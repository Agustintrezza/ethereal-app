import React from 'react';
import './CardStyles.css';
// import {BiWallet} from 'react-icons/bi';
// import {TbPlaneDeparture} from 'react-icons/tb';
// import{RiHotelLine} from 'react-icons/ri';
import{BsDownload} from 'react-icons/bs';

const Cards = () => {
  return (
    <div className='container-card contenedor-general-card' id="descargables">

         <div className="separador">
          <p>.</p>
        </div>

        <div>
            <h1 className='text-center titulo-principal-faq'>Documentos Descargables</h1>
            {/* <h2 className='subtitulo-progress'>Haciendo click vas a poder descargar los recursos necesarios.</h2> */}
        </div>
        

        <div className='contenedor-grid-card text-center'>
            <div className='px-4'>
                <a href="AgustinTrezza-CV.pdf" download="AgustinTrezza-CV.pdf">
                    <BsDownload className='imagen-card col-md-4'/>
                </a>
                <h1 className='titulo-card'>TARIFARIOS ONLINE</h1>
                <p className='texto-card'>Descargá el tarifario con los valores actualizados.</p>
            </div>
            <div className='px-4'>
                <a href="AgustinTrezza-CV.pdf" download="AgustinTrezza-CV.pdf">
                    <BsDownload className='imagen-card col-md-4'/>
                </a>
                <h1 className='titulo-card'>PDF INFORMATIVOS</h1>
                <p className='texto-card'>Descriptivos de los servicios, con toda la información con imágenes para la venta.</p>
            </div>
            <div className='px-4'>
                <a href="AgustinTrezza-CV.pdf" download="AgustinTrezza-CV.pdf">
                    <BsDownload className='imagen-card col-md-4'/>
                </a>
                <h1 className='titulo-card'>IMÁGENES, GRÁFICAS Y VIDEOS</h1>
                <p className='texto-card'>Todo el material necesario para informar y crear campañas.</p>
            </div>
        </div>

    </div>
  )
}

export default Cards