import React, {useEffect, useState, useRef} from 'react';
import './GaleriaStyles.css';
import imagenes from '../../Helper/imagenes';
import {motion} from 'framer-motion';
import axios from 'axios';

const Galeria = () => {

    const [width, setWidth] = useState(0);
    const carousel = useRef();

    useEffect(() => {
        setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth);
    })

    
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
          try {
            const { data } = await axios.get(`/api/products`);
            // console.log(data)
            // setProducts([data.tango, data.tour, data.paquete, data.varios]);
            setProducts(data)
          } catch (err) {
            // toast.error(getError(err));
          }
        }
        fetchProducts();
      }, [])

  return (
    <div className="contenedor-general-galeria container-banner">
            <motion.div ref={carousel} className="carousel container-grande" whileTap={"grabbing"}>
            <motion.div
            className='inner-carousel'
            drag="x"
            dragConstraints={{ right: 0, left: - width }}
            >
                {imagenes.map((imagen) => {
                    return (
                        <motion.div className="item">
                            <img src={imagen} alt=""></img>
                        </motion.div>
                    )
                })}
            </motion.div>
            </motion.div>
    </div>
  )
}

export default Galeria