import React, {useEffect, useState} from 'react'
// import { Link } from 'react-router-dom'
import './MenuStyles.css'
import { HashLink as Link } from 'react-router-hash-link';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../../utils';






const Menu = () => {

    // useEffect(() => {
    //     const tipoDeCambio = async () => {
    //       try {
    //         const { data } = await axios.get(`https://api-dolar-argentina.herokuapp.com/api/dolaroficial`);
    //         console.log(data)
    //         // setProducts([data.tango, data.tour, data.paquete, data.varios]);
    //         // setFavoritos(data)
    //       } catch (err) {
    //         toast.error(getError(err));
    //       }
    //     }
    //     tipoDeCambio();
    //   }, [])

        // const [dolar, setDolar] = useState('');

    //   fetch("https://api.estadisticasbcra.com/usd", {
    //     headers: {
    //         Authorization: "BEARER eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDU3NzU5NDAsInR5cGUiOiJleHRlcm5hbCIsInVzZXIiOiJhZ3VzdGluLnRyZXp6YUBnbWFpbC5jb20ifQ.7wkrtw8GzaHrEfXjnNQUePqSF-nvTd7bhXVAogS5qDwUSpw6Q9DJHtqTaRwPWCy8js6ZfmLWdtLcdcBxT6bqjw",
    //     },
    //   })
    //   .then((response) => response.json())
    //   .then((data)=> {
    //     console.log(data)
    //     // setDolar(data);
    //     // console.log(dolar)

    //   })

    //   Authorization: BEARER eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDU3NzU5NDAsInR5cGUiOiJleHRlcm5hbCIsInVzZXIiOiJhZ3VzdGluLnRyZXp6YUBnbWFpbC5jb20ifQ.7wkrtw8GzaHrEfXjnNQUePqSF-nvTd7bhXVAogS5qDwUSpw6Q9DJHtqTaRwPWCy8js6ZfmLWdtLcdcBxT6bqjw
    //   document.querySelector('.text-inf').remove();

  return (
    <div className='container'>

        <h1 className="py-3 my-4 container titulo-principal">¡Bienvenido - encontrá todo lo necesario!</h1>

        <div className="contenedor-menu">
            <div className='d-flex justify-content-center align-items-center'>
                <Link to="/search" className="boton-etiquetas-menu">TODOS LOS PRODUCTOS</Link>
            </div>

            <div className='d-flex justify-content-center align-items-center'>
                <Link to="/cotizaciones" className="boton-etiquetas-menu">¡COTIZÁ TU RESERVA!</Link>
            </div>

            <div className='d-flex justify-content-center align-items-center'>
                <Link to="#descargables" className="boton-etiquetas-menu">TARIFARIO ONLINE</Link>
            </div>

            <div className='d-flex justify-content-center align-items-center'>
                <Link to="#faq" className="boton-etiquetas-menu">PREGUNTAS FRECUENTES</Link>
            </div>
        </div>

        {/* <iframe className="d-none" width="300px" height="690px" src="https://www.dolarsi.com/func/moduloArriba-n.html" frameborder="0" scrolling="0" allowfullscreen=""></iframe> */}


    </div>
   
  )
}

export default Menu