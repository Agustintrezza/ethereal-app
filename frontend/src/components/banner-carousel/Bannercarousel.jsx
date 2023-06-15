import React from 'react';
import './BannercarouselStyles.css';
import img1 from '../../assets/imagenes-carousel/pexels4.webp';
import img2 from '../../assets/imagenes-carousel/pexels2.webp';
import img3 from '../../assets/imagenes-carousel/pexels3.webp';
import Carousel from 'react-bootstrap/Carousel';


const Bannercarousel = () => {
  return (
    <div className='container-banner d-flex align-items-center row py-5'>
        <div className='col-md-7'>
        <Carousel fade>

            <Carousel.Item interval={2000}>
                <img
                className="d-block w-100 h-100 img-fluid imagen-carousel"
                src={img1}
                alt="First slide"
                />
                <Carousel.Caption className="info-carousel">
                <h3>First slide label</h3>
                <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item interval={2000}>
                <img
                className="d-block w-100 h-100 img-fluid imagen-carousel"
                src={img2}
                alt="Second slide"
                />

                <Carousel.Caption className="info-carousel">
                <h3>Second slide label</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item interval={2000}>
                <img
                className="d-block w-100 img-fluid imagen-carousel"
                src={img3}
                alt="Third slide"
                />

                <Carousel.Caption className="info-carousel">
                <h3>Third slide label</h3>
                <p>
                    Praesent commodo cursus magna, vel scelerisque nisl consectetur.
                </p>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
        </div>

        <div className='col-md-5 contenedor-slider-constante'>

            <div className="slider">
                   <div className='slide-track'>

                        <div className='slides'>
                            <img className='loguito w-100 img-fluid' src={img1} alt="react-logo" height="500px"/>
                        </div>
                        <div className='slides'>
                            <img className='loguito w-100 img-fluid' src={img2} alt="react-logo" height="500px"/>
                        </div>
                        <div className='slides'>
                            <img className='loguito w-100 img-fluid' src={img3} alt="react-logo" height="500px"/>
                        </div>

                   </div> 
            </div>

        </div>
    </div>
  )
}

export default Bannercarousel