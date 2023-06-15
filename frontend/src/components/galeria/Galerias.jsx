import React from 'react';
import './GaleriasStyles.css';
import img1 from '../../assets/imagenes-slider/jujuy.webp';
import img2 from '../../assets/imagenes-slider/Mendoza.webp';
import img3 from '../../assets/imagenes-slider/salar.webp';
import img4 from '../../assets/imagenes-slider/usuahia.webp';
// import img5 from '../../assets/imagenes-slider/valle-de-la-luna154.webp';
// import img6 from '../../assets/imagenes-slider/glaciar.webp';
// import img7 from '../../assets/imagenes-slider/ibera.webp';
// import img8 from '../../assets/imagenes-slider/misiones.jpeg';
// import img9 from '../../assets/imagenes-slider/bsas.jpeg';
 
// import {Link} from 'react-router-dom'; 

const Galerias = () => {
  return (
    <div className='contenedor-modal row g-3'>

        <div className='d-flex flex-column justify-content-center align-items-center py-3 m-2'>
          <h1 className='titulo-galeria-modal'>¡Esperamos disfrutes viajar con nosotros!</h1>
          <h2 className="subtitulo-galeria-modal">¡Conocé acerca de este producto!</h2>
        </div>


        <div className='col-md-6'>
          <img src={img1} className="imagen-galeria-modal img-fluid" data-bs-toggle="modal" data-bs-target="#imagen1" data-bs-imagen={img1} alt="img-modal1"/>
        </div>
        <div className='col-md-6'>
          <img src={img2} className="imagen-galeria-modal img-fluid" data-bs-toggle="modal" data-bs-target="#imagen2" alt="img-modal2"/>
        </div>
        <div className='col-md-6'>
          <img src={img3} className="imagen-galeria-modal img-fluid" data-bs-toggle="modal" data-bs-target="#imagen3" data-bs-imagen="img3" alt="img-modal3"/>
        </div>
        <div className='col-md-6'>
          <img src={img4} className="imagen-galeria-modal img-fluid" data-bs-toggle="modal" data-bs-target="#imagen4" data-bs-imagen={img1} alt="img-modal1"/>
        </div>
        {/* <div className='col-md-6'>
          <img src={img5} className="imagen-galeria-modal img-fluid" data-bs-toggle="modal" data-bs-target="#imagen5" alt="img-modal2"/>
        </div>
        <div className='col-md-6'>
          <img src={img6} className="imagen-galeria-modal img-fluid" data-bs-toggle="modal" data-bs-target="#imagen6" data-bs-imagen="img3" alt="img-modal3"/>
        </div> */}
        {/* <div className='col-md-4'>
          <img src={img7} className="imagen-galeria-modal img-fluid" data-bs-toggle="modal" data-bs-target="#imagen7" data-bs-imagen={img1} alt="img-modal1"/>
        </div>
        <div className='col-md-4'>
          <img src={img8} className="imagen-galeria-modal img-fluid" data-bs-toggle="modal" data-bs-target="#imagen8" alt="img-modal2"/>
        </div>
        <div className='col-md-4'>
          <img src={img9} className="imagen-galeria-modal img-fluid" data-bs-toggle="modal" data-bs-target="#imagen9" data-bs-imagen="img3" alt="img-modal3"/>
        </div> */}

        

        

        <div className="modal fade" id="imagen1" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content modal-content-centered">
              <div className="modal-body">
                <img src={img1} className="img-fluid imagen-modal" data-bs-toggle="modal" data-bs-target="#exampleModal" alt="img-modal1"/>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="imagen2" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content modal-content-centered">
              <div className="modal-body">
                <img src={img2} className="img-fluid imagen-modal" data-bs-toggle="modal" data-bs-target="#exampleModal" alt="img-modal1"/>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="imagen3" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content modal-dialog-centered">
              <div className="modal-body">
                <img src={img3} className="img-fluid imagen-modal" data-bs-toggle="modal" data-bs-target="#exampleModal" alt="img-modal1"/>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="imagen4" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content modal-content-centered">
              <div className="modal-body">
                <img src={img4} className="img-fluid imagen-modal" data-bs-toggle="modal" data-bs-target="#exampleModal" alt="img-modal1"/>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="modal fade" id="imagen5" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content modal-content-centered">
              <div className="modal-body">
                <img src={img5} className="img-fluid imagen-modal" data-bs-toggle="modal" data-bs-target="#exampleModal" alt="img-modal1"/>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="imagen6" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content modal-dialog-centered">
              <div className="modal-body">
                <img src={img6} className="img-fluid imagen-modal" data-bs-toggle="modal" data-bs-target="#exampleModal" alt="img-modal1"/>
              </div>
            </div>
          </div>
        </div> */}

        {/* <div className="modal fade" id="imagen7" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content modal-content-centered">
              <div className="modal-body">
                <img src={img7} className="img-fluid imagen-modal" data-bs-toggle="modal" data-bs-target="#exampleModal" alt="img-modal1"/>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="imagen8" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content modal-content-centered">
              <div className="modal-body">
                <img src={img8} className="img-fluid imagen-modal" data-bs-toggle="modal" data-bs-target="#exampleModal" alt="img-modal1"/>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="imagen9" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content modal-dialog-centered">
              <div className="modal-body">
                <img src={img9} className="img-fluid imagen-modal" data-bs-toggle="modal" data-bs-target="#exampleModal" alt="img-modal1"/>
              </div>
            </div>
          </div>
        </div> */}



    </div>
  )
}

export default Galerias