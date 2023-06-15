import React from 'react';
import { useEffect, useState } from 'react';
import './CarouselbootStyles.css';
import Carousel from 'react-bootstrap/Carousel';
import img1 from '../../assets/imagenes-carousel/glaciar.jpg';
import img2 from '../../assets/imagenes-carousel/bs-as.jpg';
import img3 from '../../assets/imagenes-carousel/salar1.jpg';
import video from '../../assets/imagenes-carousel/video-ethereal-1.mp4';
import { Link } from "react-router-dom";

import Spinner from 'react-bootstrap/Spinner';

import {motion} from 'framer-motion';

const Carouselboot = () => {

  const [cargando, setCargando] = useState(true)
  // console.log(cargando)


  const loadingVideo = () => {
    // console.log(cargando)
    
    // setCargando(true)
    setTimeout(() => {
      setCargando(false)
    console.log(cargando)

    }, 800);
    // console.log(cargando)
  }

  useEffect(() => {
    loadingVideo()
    // return () => {
    //   second
    // }
  },)
  


  return (
    <>
    {cargando ? (<Spinner className="container flash-spinner spinner-grow text-secondary"  animation="border" role="status"></Spinner>)
    :
    (
      <>
      <Carousel className='carousel carous'>

          <Carousel.Item className='w-100 video-carousel' interval={360800}>

                {/* <div className="contenedor-texto-carouselbootstrap">

                <motion.div initial={{scale: 0.98}}
                    transition={{ duration: 1}}
                    animate= {{scale: 1,zIndex: 1, // x:-5, y: -10
                    duration: 2
                    }} className="grid-cartel-carouselbootstrap">
                    <div>
                      <h1 className="titulo-carouselbootstrap">Ethereal Tours</h1>
                      <h1 className="seccion-agencias-strong">Sección agencias</h1>
                      <h2 className="tercertitulo-carouselbootstrap">El mejor operador receptivo de Buenos Aires. </h2>      
                      <h2 className="subtitulo-carouselbootstrap">Solititá tu cuenta y accedé a todos nuestros servicios. </h2>
                    </div>
                    
                    <div className="contenedor-boton-carousel">
                        <div className="contenedor-interno-boton-carousel"> 
                          <Link to={'/solicitud-cuenta'} className="boton-carousel">¡Comenzar!</Link>
                        </div>
                    </div>
                </motion.div>
                  
                </div> */}

                <video className="w-100 video-fluid video" loop autoPlay muted>
                  <source src={video} type="video/mp4"/>
                </video> 
          
          </Carousel.Item>

       <Carousel.Item className='h-100'>
        <img
          className="d-block w-100 img-fluid imagen-carousel-principal"
          src={img1}
          alt="First slide"
        />
       
      </Carousel.Item>

      <Carousel.Item className='h-100'>
        <img
          className="d-block w-100 img-fluid imagen-carousel-principal"
          src={img2}
          alt="First slide"
        />
       
      </Carousel.Item>

      <Carousel.Item className='h-100'>
        <img
          className="d-block w-100 img-fluid imagen-carousel-principal"
          src={img3}
          alt="First slide"
        />
       
      </Carousel.Item>

      {/* <Carousel.Item interval={2800} className='h-100'>
        <img
          className="d-block w-100 img-fluid imagen-carousel"
          src={img2}
          alt="First slide"
        />
        <Carousel.Caption className="pie-de-imagen">
          <h3>Bariloche</h3>
          <p className="texto-carousel">10 días ALL INLCUSIVE en bariloche, con 5 excursiones.</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item interval={2800} className='h-100'>
        <img
          className="d-block w-100 img-fluid imagen-carousel"
          src={img3}
          alt="First slide"
        />
        <Carousel.Caption className="pie-de-imagen">
          <h3>Mendoza</h3>
          <p className="texto-carousel">Mendoza capital y alrededores, 7 días aéreos incluídos.</p>
        </Carousel.Caption>
      </Carousel.Item> */}


     
    </Carousel>
    </>
    )}
   
    </>
  );
}

export default Carouselboot



