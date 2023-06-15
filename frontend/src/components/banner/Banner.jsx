import React from 'react';
import './BannerStyles.css';
import imgpromo1 from '../../assets/imagenes-promo/promo1.png';
import imgpromo2 from '../../assets/imagenes-promo/promo2.jpeg';
// import imgpromo3 from '../../assets/imagenes-promo/promo3.jpeg';



const Banner = () => {
  return (
    <div className='row container-banner margen-superior row'>
            <div className='col-md-7 d-flex align-items-start'>
                <img className='img-fluid imagen-principal' src={imgpromo1} alt="img-promo"/>
            </div>
            <div className='col-md-5 md-d-flex gap-3'>
                    <div className='col-md-12 d-flex align-items-center'>
                        <img className='img-fluid imagen-par' src={imgpromo2} alt="img-promo"></img>
                    </div>
                    {/* <div className='col-md-6 d-flex align-items-center'>
                        <img className='imagen-par' src={imgpromo3} alt="img-promo"></img>
                    </div> */}
            </div>

        </div>
  )
}

export default Banner